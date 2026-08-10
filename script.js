const target = new Date("2026-08-29T20:00:00+03:00").getTime();
function updateCountdown(){
 let diff=Math.max(0,target-Date.now());
 const d=Math.floor(diff/86400000); diff%=86400000;
 const h=Math.floor(diff/3600000); diff%=3600000;
 const m=Math.floor(diff/60000); diff%=60000;
 const s=Math.floor(diff/1000);
 days.textContent=String(d).padStart(2,"0");hours.textContent=String(h).padStart(2,"0");
 minutes.textContent=String(m).padStart(2,"0");seconds.textContent=String(s).padStart(2,"0");
}
updateCountdown();setInterval(updateCountdown,1000);
function submitRSVP(e){e.preventDefault();const n=guestName.value.trim(),a=attendance.value;formMessage.textContent=`Mulțumesc, ${n}! ${a}`;e.target.reset();}
