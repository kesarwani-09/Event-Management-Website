const events = [
  {id:1,name:"CodeSprint Hackathon",cat:"Tech",date:"2026-12-05T09:00",venue:"Tech Park Auditorium, Bhubaneswar",emoji:"💻",c:"#5b3df5,#8b78ff",desc:"24-hour team hackathon with mentors, prizes and free food.",long:"Build a working product in 24 hours. Teams of 2 to 4. Mentors from top startups will guide you, and winners get cash prizes and internship offers."},
  {id:2,name:"Winter Music Night",cat:"Music",date:"2026-12-18T18:30",venue:"Open Air Theatre, Cuttack",emoji:"🎸",c:"#ff5d8f,#ff9a6b",desc:"Live bands and indie artists under the winter sky.",long:"Five live acts, a food court and a silent-disco corner. Gates open at 5 pm. Carry a light jacket."},
  {id:3,name:"UI/UX Design Workshop",cat:"Workshop",date:"2027-01-09T10:00",venue:"Design Lab, Room 204",emoji:"🎨",c:"#14b8a6,#5eead4",desc:"Hands-on Figma workshop for beginners.",long:"Learn wireframing, prototyping and usability testing in one day. Bring a laptop with Figma installed."},
  {id:4,name:"Startup Pitch Day",cat:"Business",date:"2027-01-16T11:00",venue:"Innovation Hub, Bhubaneswar",emoji:"🚀",c:"#f59e0b,#fcd34d",desc:"Ten startups pitch to real investors.",long:"Watch founders pitch, ask questions, and network with investors during the open networking session."},
  {id:5,name:"Inter-College Cricket Cup",cat:"Sports",date:"2027-01-24T08:00",venue:"Kalinga Stadium Ground",emoji:"🏏",c:"#22c55e,#86efac",desc:"T20 knockout tournament across 16 colleges.",long:"Register as a spectator or volunteer. Entry is free with registration. Food stalls open all day."},
  {id:6,name:"AI & ML Bootcamp",cat:"Tech",date:"2027-02-06T09:30",venue:"Computer Science Block, Seminar Hall",emoji:"🤖",c:"#6366f1,#a5b4fc",desc:"Two days of practical machine learning with Python.",long:"From data cleaning to training your first model. Basic Python knowledge is enough. Certificates provided."}
];
const $ = s => document.querySelector(s);
let cat = "All", reg = JSON.parse(localStorage.getItem("regs") || "[]");
const fmt = d => new Date(d).toLocaleString("en-IN",{dateStyle:"medium",timeStyle:"short"});
const pic = e => `<div class="pic" style="background:linear-gradient(135deg,${e.c})">${e.emoji}</div>`;

/* theme */
const setTheme = t => { document.documentElement.dataset.theme = t; localStorage.setItem("theme", t); };
setTheme(localStorage.getItem("theme") || (matchMedia("(prefers-color-scheme:dark)").matches ? "dark" : "light"));
$("#theme").onclick = () => setTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark");

/* chips + cards */
const cats = ["All", ...new Set(events.map(e => e.cat))];
$("#chips").innerHTML = cats.map(c => `<button class="chip${c==="All"?" on":""}">${c}</button>`).join("");
$("#chips").onclick = e => { if (!e.target.matches(".chip")) return;
  cat = e.target.textContent;
  document.querySelectorAll(".chip").forEach(b => b.classList.toggle("on", b === e.target)); render(); };
$("#search").oninput = render;

function render() {
  const q = $("#search").value.trim().toLowerCase();
  const list = events.filter(e => (cat === "All" || e.cat === cat) && (e.name + e.venue).toLowerCase().includes(q));
  $("#grid").innerHTML = list.map(e => `<article class="card">${pic(e)}<div class="body">
    <span class="tag">${e.cat}</span><h3>${e.name}</h3>
    <div class="meta">📅 ${fmt(e.date)}<br>📍 ${e.venue}</div><p>${e.desc}</p>
    <button class="btn" data-id="${e.id}">View details</button></div></article>`).join("");
  $("#empty").hidden = list.length > 0;
}
$("#grid").onclick = e => { const id = e.target.dataset.id; if (id) openModal(+id); };

/* modal */
const modal = $("#modal"), form = $("#form");
$("#form select").innerHTML = events.map(e => `<option value="${e.id}">${e.name}</option>`).join("");
function openModal(id) {
  const e = events.find(x => x.id === id);
  $("#detail").innerHTML = pic(e) + `<div class="in"><h2>${e.name}</h2>
    <p class="meta">📅 ${fmt(e.date)}<br>📍 ${e.venue}</p><p>${e.long}</p></div>`;
  form.reset(); form.event.value = id; form.hidden = false; $("#done").hidden = true;
  form.querySelectorAll(".err").forEach(s => s.textContent = "");
  form.querySelectorAll("input").forEach(i => i.classList.remove("bad"));
  modal.showModal();
}
$("#close").onclick = () => modal.close();
modal.onclick = e => { if (e.target === modal) modal.close(); };

/* validation */
const rules = {
  name: v => /^[A-Za-z][A-Za-z .'-]{1,49}$/.test(v) || "Enter your full name (letters only, min 2 characters).",
  email: v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) || "Enter a valid email like name@example.com.",
  phone: v => /^[6-9]\d{9}$/.test(v) || "Enter a valid 10-digit mobile number starting with 6-9."
};
function check(input) {
  const r = rules[input.name](input.value.trim()), ok = r === true;
  input.classList.toggle("bad", !ok);
  input.nextElementSibling.textContent = ok ? "" : r;
  return ok;
}
Object.keys(rules).forEach(n => form[n].addEventListener("blur", () => check(form[n])));
form.onsubmit = e => {
  e.preventDefault();
  if (!Object.keys(rules).map(n => check(form[n])).every(Boolean)) return;
  const ev = events.find(x => x.id === +form.event.value);
  if (reg.some(r => r.eventId === ev.id && r.email === form.email.value.trim().toLowerCase())) {
    form.email.nextElementSibling.textContent = "This email is already registered for this event."; return; }
  reg.push({eventId: ev.id, name: form.name.value.trim(), email: form.email.value.trim().toLowerCase(), phone: form.phone.value.trim(), at: Date.now()});
  localStorage.setItem("regs", JSON.stringify(reg));
  form.hidden = true;
  $("#done").hidden = false;
  $("#done").innerHTML = `<div class="tick">✅</div><h3>You're registered, ${form.name.value.trim().split(" ")[0]}!</h3>
    <p>${ev.name}<br>${fmt(ev.date)}<br>${ev.venue}</p><p class="meta">A confirmation has been saved for ${form.email.value.trim()}.</p>`;
  renderRegs();
};

/* my registrations */
function renderRegs() {
  $("#count").textContent = reg.length;
  $("#list").innerHTML = reg.length ? reg.map((r, i) => { const e = events.find(x => x.id === r.eventId);
    return `<li><span><b>${e.name}</b><br><span class="meta">${r.name} · ${r.email}</span></span><button data-i="${i}">Cancel</button></li>`; }).join("")
    : `<li class="meta">Nothing yet. Pick an event above and register.</li>`;
}
$("#list").onclick = e => { const i = e.target.dataset.i; if (i === undefined) return;
  reg.splice(+i, 1); localStorage.setItem("regs", JSON.stringify(reg)); renderRegs(); };

/* countdown to next event */
function tick() {
  const next = events.map(e => ({...e, t: new Date(e.date) - Date.now()})).filter(e => e.t > 0).sort((a, b) => a.t - b.t)[0];
  if (!next) { $("#nextName").textContent = "No upcoming events"; $("#timer").innerHTML = ""; return; }
  $("#nextName").textContent = next.name;
  const s = Math.floor(next.t / 1000), p = [["Days", s / 86400], ["Hours", s % 86400 / 3600], ["Min", s % 3600 / 60], ["Sec", s % 60]];
  $("#timer").innerHTML = p.map(([l, v]) => `<div>${String(Math.floor(v)).padStart(2, "0")}<span>${l}</span></div>`).join("");
}
render(); renderRegs(); tick(); setInterval(tick, 1000);
