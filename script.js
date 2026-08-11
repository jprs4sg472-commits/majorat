const RSVP_ENDPOINT = "https://script.google.com/macros/s/AKfycbxfCDRtruPz5o5D3pEmB1iZjya_Cv7_kFIj5oywHEG2gYJmjkKwXCI-0B8d3rpMXoC0/exec";
const target=new Date("2026-08-29T20:00:00+03:00").getTime();
function tick(){let x=Math.max(0,target-Date.now()),d=Math.floor(x/86400000);x%=86400000;let h=Math.floor(x/3600000);x%=3600000;let m=Math.floor(x/60000);x%=60000;let s=Math.floor(x/1000);days.textContent=String(d).padStart(2,"0");hours.textContent=String(h).padStart(2,"0");minutes.textContent=String(m).padStart(2,"0");seconds.textContent=String(s).padStart(2,"0")}tick();setInterval(tick,1000);

const plusOneBox=document.getElementById("plusOneBox"),plusOneNameBox=document.getElementById("plusOneNameBox"),plusOneName=document.getElementById("plusOneName");
document.querySelectorAll('input[name="attendance"]').forEach(i=>i.addEventListener("change",()=>{const yes=i.value==="DA";plusOneBox.classList.toggle("hidden",!yes);plusOneNameBox.classList.add("hidden");plusOneName.required=false;document.querySelectorAll('input[name="plusOne"]').forEach(r=>r.checked=false);plusOneName.value=""}));
document.querySelectorAll('input[name="plusOne"]').forEach(i=>i.addEventListener("change",()=>{const yes=i.value==="DA";plusOneNameBox.classList.toggle("hidden",!yes);plusOneName.required=yes;if(!yes)plusOneName.value=""}));

document.getElementById("rsvpForm").addEventListener("submit", e => {
  e.preventDefault();

  const name = document.getElementById("guestName").value.trim();
  const attendance = document.querySelector('input[name="attendance"]:checked')?.value;
  const plusOne = attendance === "DA" ? (document.querySelector('input[name="plusOne"]:checked')?.value || "") : "";
  const companion = plusOne === "DA" ? document.getElementById("plusOneName").value.trim() : "";
  const msg = document.getElementById("msg");
  const btn = document.getElementById("submitBtn");

  if (!attendance) { msg.textContent = "Alege DA sau NU."; return; }
  if (attendance === "DA" && !plusOne) { msg.textContent = "Spune-ne dacă vei fi însoțit(ă)."; return; }
  if (plusOne === "DA" && !companion) { msg.textContent = "Introdu numele persoanei care te însoțește."; return; }

  // Trimitere prin formular HTML clasic, nu fetch/no-cors.
  // Este mult mai compatibilă cu Safari/iPhone și cu site-urile hostate static.
  let iframe = document.getElementById("rsvpSubmitFrame");
  if (!iframe) {
    iframe = document.createElement("iframe");
    iframe.id = "rsvpSubmitFrame";
    iframe.name = "rsvpSubmitFrame";
    iframe.style.display = "none";
    document.body.appendChild(iframe);
  }

  const form = document.createElement("form");
  form.method = "POST";
  form.action = RSVP_ENDPOINT;
  form.target = "rsvpSubmitFrame";
  form.style.display = "none";

  const add = (key, value) => {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = key;
    input.value = value;
    form.appendChild(input);
  };

  add("name", name);
  add("attendance", attendance);
  add("plusOne", plusOne);
  add("companion", companion);
  add("timestamp", new Date().toLocaleString("ro-RO"));

  document.body.appendChild(form);
  btn.disabled = true;
  btn.textContent = "SE TRIMITE...";
  msg.textContent = "";
  form.submit();

  // Apps Script a primit POST-ul prin formular. Nu așteptăm un răspuns CORS.
  setTimeout(() => {
    msg.textContent = "Mulțumesc! Confirmarea ta a fost înregistrată. 🥂";
    document.getElementById("rsvpForm").reset();
    plusOneBox.classList.add("hidden");
    plusOneNameBox.classList.add("hidden");
    plusOneName.required = false;
    form.remove();
    btn.disabled = false;
    btn.textContent = "CONFIRMĂ PREZENȚA";
  }, 1200);
});
