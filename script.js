const RSVP_ENDPOINT = "https://script.google.com/macros/s/AKfycbyH1FCFniuoQtK7jAj5zGTCguW8hU3UVH-VZjR2irqLrNLXgrrWoaWS1HmSlBwoJlcN/exec";

const target = new Date("2026-08-29T20:00:00+03:00").getTime();

function tick() {
    let x = Math.max(0, target - Date.now());

    const d = Math.floor(x / 86400000);
    x %= 86400000;

    const h = Math.floor(x / 3600000);
    x %= 3600000;

    const m = Math.floor(x / 60000);
    x %= 60000;

    const s = Math.floor(x / 1000);

    document.getElementById("days").textContent = String(d).padStart(2, "0");
    document.getElementById("hours").textContent = String(h).padStart(2, "0");
    document.getElementById("minutes").textContent = String(m).padStart(2, "0");
    document.getElementById("seconds").textContent = String(s).padStart(2, "0");
}

tick();
setInterval(tick, 1000);


// ===============================
// AFISARE CAMPURI INSOTITOR
// ===============================

const plusOneBox = document.getElementById("plusOneBox");
const plusOneNameBox = document.getElementById("plusOneNameBox");
const plusOneName = document.getElementById("plusOneName");

document.querySelectorAll('input[name="attendance"]').forEach(input => {

    input.addEventListener("change", () => {

        const vine = input.value === "DA";

        plusOneBox.classList.toggle("hidden", !vine);
        plusOneNameBox.classList.add("hidden");

        plusOneName.required = false;
        plusOneName.value = "";

        document.querySelectorAll('input[name="plusOne"]').forEach(radio => {
            radio.checked = false;
        });
    });

});


document.querySelectorAll('input[name="plusOne"]').forEach(input => {

    input.addEventListener("change", () => {

        const areInsotit = input.value === "DA";

        plusOneNameBox.classList.toggle("hidden", !areInsotit);

        plusOneName.required = areInsotit;

        if (!areInsotit) {
            plusOneName.value = "";
        }
    });

});


// ===============================
// TRIMITERE RSVP
// ===============================

document.getElementById("rsvpForm").addEventListener("submit", function (e) {

    e.preventDefault();

    const name = document.getElementById("guestName").value.trim();

    const attendanceElement =
        document.querySelector('input[name="attendance"]:checked');

    const attendance = attendanceElement
        ? attendanceElement.value
        : "";

    const plusOneElement =
        document.querySelector('input[name="plusOne"]:checked');

    const plusOne =
        attendance === "DA" && plusOneElement
            ? plusOneElement.value
            : "";

    const companion =
        plusOne === "DA"
            ? document.getElementById("plusOneName").value.trim()
            : "";

    const msg = document.getElementById("msg");
    const btn = document.getElementById("submitBtn");


    // VALIDARI

    if (!name) {
        msg.textContent = "Introdu numele tău.";
        return;
    }

    if (!attendance) {
        msg.textContent = "Alege DA sau NU.";
        return;
    }

    if (attendance === "DA" && !plusOne) {
        msg.textContent = "Spune-ne dacă vei fi însoțit(ă).";
        return;
    }

    if (plusOne === "DA" && !companion) {
        msg.textContent = "Introdu numele persoanei care te însoțește.";
        return;
    }


    // ===============================
    // FORMULAR INVIZIBIL
    // ===============================

    let iframe = document.getElementById("rsvpFrame");

    if (!iframe) {

        iframe = document.createElement("iframe");

        iframe.id = "rsvpFrame";
        iframe.name = "rsvpFrame";

        iframe.style.position = "absolute";
        iframe.style.width = "1px";
        iframe.style.height = "1px";
        iframe.style.border = "0";
        iframe.style.opacity = "0";

        document.body.appendChild(iframe);
    }


    const submitForm = document.createElement("form");

    submitForm.method = "POST";
    submitForm.action = RSVP_ENDPOINT;
    submitForm.target = "rsvpFrame";

    submitForm.style.display = "none";


    function addField(name, value) {

        const input = document.createElement("input");

        input.type = "hidden";
        input.name = name;
        input.value = value;

        submitForm.appendChild(input);
    }


    addField("name", name);
    addField("attendance", attendance);
    addField("plusOne", plusOne);
    addField("companion", companion);

    addField(
        "timestamp",
        new Date().toLocaleString("ro-RO")
    );


    document.body.appendChild(submitForm);


    // ===============================
    // TRIMITERE
    // ===============================

    btn.disabled = true;
    btn.textContent = "SE TRIMITE...";
    msg.textContent = "";


    submitForm.submit();


    /*
      Așteptăm puțin mai mult pentru telefoane.
      Apps Script poate avea nevoie de câteva secunde
      pentru redirect + procesarea POST-ului.
    */

    setTimeout(() => {

        msg.textContent =
            "Mulțumesc! Confirmarea ta a fost înregistrată. 🥂";

        document.getElementById("rsvpForm").reset();

        plusOneBox.classList.add("hidden");
        plusOneNameBox.classList.add("hidden");

        plusOneName.required = false;

        submitForm.remove();

        btn.disabled = false;
        btn.textContent = "CONFIRMĂ PREZENȚA";

    }, 3000);

});
