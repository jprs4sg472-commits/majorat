/*
  IMPORTANT:
  DupÄƒ ce creezi Google Apps Script-ul, lipeÈ™te aici URL-ul lui Web App.
*/
const RSVP_ENDPOINT = "PASTEAZA_AICI_URLUL_GOOGLE_APPS_SCRIPT";

const target = new Date("2026-08-29T20:00:00+03:00").getTime();

function updateCountdown(){
  let diff=Math.max(0,target-Date.now());
  const d=Math.floor(diff/86400000); diff%=86400000;
  const h=Math.floor(diff/3600000); diff%=3600000;
  const m=Math.floor(diff/60000); diff%=60000;
  const s=Math.floor(diff/1000);
  document.getElementById("days").textContent=String(d).padStart(2,"0");
  document.getElementById("hours").textContent=String(h).padStart(2,"0");
  document.getElementById("minutes").textContent=String(m).padStart(2,"0");
  document.getElementById("seconds").textContent=String(s).padStart(2,"0");
}
updateCountdown();
setInterval(updateCountdown,1000);

async function submitRSVP(e){
  e.preventDefault();

  const name = document.getElementById("guestName").value.trim();
  const attendance = document.getElementById("attendance").value;
  const message = document.getElementById("formMessage");
  const button = document.getElementById("submitBtn");

  if(!name || !attendance) return;

  if(RSVP_ENDPOINT === "https://script.google.com/macros/s/AKfycbxfCDRtruPz5o5D3pEmB1iZjya_Cv7_kFIj5oywHEG2gYJmjkKwXCI-0B8d3rpMXoC0/exec"){
    message.textContent = "Formularul nu este conectat Ã®ncÄƒ. AdaugÄƒ URL-ul Google Apps Script Ã®n script.js.";
    return;
  }

  button.disabled = true;
  button.textContent = "SE TRIMITE...";

  const data = new URLSearchParams();
  data.append("name", name);
  data.append("attendance", attendance);
  data.append("timestamp", new Date().toLocaleString("ro-RO"));

  try {
    await fetch(RSVP_ENDPOINT, {
      method: "POST",
      mode: "no-cors",
      headers: {"Content-Type":"application/x-www-form-urlencoded;charset=UTF-8"},
      body: data.toString()
    });

    message.textContent = "MulÈ›umesc! Confirmarea ta a fost Ã®nregistratÄƒ. ðŸ¥‚";
    document.getElementById("rsvpForm").reset();
  } catch(error) {
    message.textContent = "A apÄƒrut o problemÄƒ. Te rog Ã®ncearcÄƒ din nou.";
  } finally {
    button.disabled = false;
    button.textContent = "CONFIRMÄ‚ PREZENÈšA";
  }
}
