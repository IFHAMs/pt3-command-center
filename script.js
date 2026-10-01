/* ========= PT3 COMMAND CENTER · LOGIC ========= */

const store = {
  get(k, fallback){ try{ return JSON.parse(localStorage.getItem('pt3_'+k)) ?? fallback; }catch{ return fallback; } },
  set(k, v){ localStorage.setItem('pt3_'+k, JSON.stringify(v)); }
};

/* ---------- DAYS LEFT ---------- */
(function(){
  const target = new Date(new Date().getFullYear(), 9, 15); // 15 Oct
  const now = new Date();
  if (now > new Date(target.getFullYear(), 9, 15, 23, 59)) target.setFullYear(target.getFullYear()+1);
  const diff = Math.ceil((target - now) / 86400000);
  document.getElementById('daysLeft').textContent = diff > 0 ? diff + ' D' : 'TODAY';
})();

/* ---------- DAILY TIMELINE ---------- */
const timelineData = [
  ["05:30 – 05:45","Wake up + Freshen up","START"],
  ["05:45 – 06:05","Fajr Salah","FAITH"],
  ["06:05 – 06:50","Deep Study Block 1: Maths or Science (Hardest topic)","FOCUS"],
  ["06:50 – 07:50","Breakfast + Get ready + Quick recall","PREP"],
  ["08:15 – 15:00","SCHOOL","SCHOOL"],
  ["15:00 – 15:50","Lunch + Travel + Short rest","REST"],
  ["16:00 – 18:00","TUITION","TUITION"],
  ["18:00 – 19:00","Free Time / Gaming / Phone + Maghrib Salah","FREE"],
  ["19:00 – 19:50","Study Block 2 (Science focus remaining)","STUDY"],
  ["19:50 – 20:00","Short break","BREAK"],
  ["20:00 – 20:45","Study Block 3 (SST Maps / Dates)","STUDY"],
  ["20:45 – 21:00","Isha Salah / Reset","FAITH"],
  ["21:00 – 21:30","Dinner","MEAL"],
  ["21:30 – 22:00","Homework + Same-day revision + Prepare bag","WRAP"],
  ["22:00","SLEEP","REST"]
];
document.getElementById('timeline').innerHTML = timelineData.map(([t, txt, tag]) =>
  `<li><span class="time">${t}</span><span>${txt}</span><span class="tag ${tag}">${tag}</span></li>`
).join('');

/* ---------- 90% LOOP ---------- */
const loopData = [
  ["LEARN","Read / watch / understand the concept carefully"],
  ["CLOSE THE BOOK","Remove all reference material from view"],
  ["RECALL","Write or speak everything you remember"],
  ["SOLVE","Attempt problems without looking at solutions"],
  ["CHECK","Compare answers with the key or textbook"],
  ["MARK MISTAKE","Log every error in the Mistake Book"],
  ["REDO","Re-attempt the wrong questions immediately"],
  ["TEST YOURSELF","Timed mini-test on the same topic later"]
];
document.getElementById('loopGrid').innerHTML = loopData.map(([t, d], i) =>
  `<div class="loop-card"><div class="loop-num">${i+1}</div><h4>${t}</h4><p>${d}</p></div>`
).join('');

/* ---------- 15-DAY COUNTDOWN ---------- */
const countdown = [
  ["1 OCT · D15","C1-C2","Physics P1","Block A","Hindi-Eng 20-30m"],
  ["2 OCT · D14","C3","Chem C1","Block B","IT + language"],
  ["3 OCT · D13","C4","Bio B1","Block C","Hindi-English"],
  ["4 OCT · D12","C5","Physics P2","Block D","IT + language"],
  ["5 OCT · D11","C6","Chem C2","Block E","Hindi-English"],
  ["6 OCT · D10","C7","Bio B2","Block F","IT + language"],
  ["7 OCT · D9","C1-C3 revision","Physics P3","Block G","Grammar-writing"],
  ["8 OCT · D8","C4-C7 revision","Chem C3","Block H","IT + language"],
  ["9 OCT · D7","HARD QUESTIONS","Bio B3","Block I","Hindi-Eng revision"],
  ["10 OCT · D6","FULL TIMED MOCK","Physics P1-P3 rev","Maps+dates+kw","Lang weak areas"],
  ["11 OCT · D5","Mistake-book","Chem C1-C3 rev","Full rev pass","IT quick test"],
  ["12 OCT · D4","Timed paper","Bio B1-B3 rev","Timed Q&A","Hindi-Eng timed"],
  ["13 OCT · D3","Weak topics","Weak topics","Weak topics","NO new chapters"],
  ["14 OCT · D2","Formulas+thms","Diagrams+eqns","Dates+maps+kw","Light recall only"],
  ["15 OCT · D1","EXAM DAY","Quick 30-40 min","No new work","Calm & ready"]
];
document.querySelector('#countdownTable tbody').innerHTML = countdown.map(row =>
  `<tr>${row.map(c => `<td>${c}</td>`).join('')}</tr>`
).join('');

/* ---------- SUBJECT CHECKLISTS ---------- */
const checklists = {
  math:{title:"MATHS", lvl:"HIGH", cls:"math", items:["C1","C2","C3","C4","C5","C6","C7","Formulas sheet","Hard Q bank","Full mock"]},
  sci: {title:"SCIENCE",lvl:"HIGH", cls:"sci",  items:["Physics P1","Physics P2","Physics P3","Chem C1","Chem C2","Chem C3","Bio B1","Bio B2","Bio B3","Diagrams set"]},
  sst: {title:"SST",    lvl:"HIGH", cls:"sst",  items:["Block A","Block B","Block C","Block D","Block E","Block F","Block G","Block H","Block I","Maps + Dates"]},
  eng: {title:"ENGLISH",lvl:"MEDIUM",cls:"eng", items:["Literature","Grammar","Writing tasks","Comprehension","Timed practice"]},
  hin: {title:"HINDI",  lvl:"MAINT.",cls:"hin", items:["Prose / Poetry","Grammar","Writing","Revision pass"]},
  it:  {title:"IT",     lvl:"MAINT.",cls:"it",  items:["Theory units","Practical","Quick test","Light recall"]}
};

const savedChecks = store.get('checks', {});
document.getElementById('checklists').innerHTML = Object.entries(checklists).map(([key, c]) => `
  <div class="check-card ${c.cls}">
    <div class="check-head"><h3>${c.title}</h3><span>${c.lvl}</span></div>
    ${c.items.map((item, i) => {
      const id = `${key}_${i}`;
      const checked = savedChecks[id] ? 'checked' : '';
      return `<label><input type="checkbox" data-id="${id}" ${checked}><span>${item}</span></label>`;
    }).join('')}
  </div>
`).join('');

document.querySelectorAll('.check-card input').forEach(cb => {
  cb.addEventListener('change', () => {
    savedChecks[cb.dataset.id] = cb.checked;
    store.set('checks', savedChecks);
  });
});

/* ---------- EXAM TIMETABLE ---------- */
const exams = [
  ["15 Thu","Science"],["16 Fri","Hindi"],["17 Sat","Maths"],
  ["19 Mon","Maths"],["21 Wed","English"],["22 Thu","SST"],["24 Sat","IT"]
];
document.getElementById('examRow').innerHTML = exams.map(([d, s]) =>
  `<div class="exam-item"><div class="day">${d}</div><div class="subj">${s}</div></div>`
).join('');

/* ---------- PROGRESS TRACKER ---------- */
const subjects = ["Maths","Science","SST","Other"];
const savedProgress = store.get('progress', {});
document.querySelector('#progressTable tbody').innerHTML = subjects.map(sub =>
  `<tr><td>${sub}</td>${
    Array.from({length:15}, (_, i) => {
      const id = `${sub}_${i+1}`;
      const on = savedProgress[id] ? 'on' : '';
      return `<td><div class="progress-cell ${on}" data-id="${id}"></div></td>`;
    }).join('')
  }</tr>`
).join('');

document.querySelectorAll('.progress-cell').forEach(cell => {
  cell.addEventListener('click', () => {
    cell.classList.toggle('on');
    savedProgress[cell.dataset.id] = cell.classList.contains('on');
    store.set('progress', savedProgress);
  });
});

/* ---------- WEAK AREAS ---------- */
const savedWeak = store.get('weak', []);
const weakBody = document.getElementById('weakBody');
weakBody.innerHTML = Array.from({length:5}, (_, i) => {
  const row = savedWeak[i] || ["","",""];
  return `<tr>
    <td class="idx">${i+1}</td>
    <td><input data-i="${i}" data-f="0" value="${row[0]||''}" placeholder="Topic / chapter"></td>
    <td><input data-i="${i}" data-f="1" value="${row[1]||''}" placeholder="Fix action"></td>
    <td><input data-i="${i}" data-f="2" value="${row[2]||''}" placeholder="Redo date"></td>
  </tr>`;
}).join('');

weakBody.querySelectorAll('input').forEach(inp => {
  inp.addEventListener('input', () => {
    const i = +inp.dataset.i, f = +inp.dataset.f;
    savedWeak[i] = savedWeak[i] || ["","",""];
    savedWeak[i][f] = inp.value;
    store.set('weak', savedWeak);
  });
});

/* ---------- PRE-EXAM CHECKLIST ---------- */
const preItems = ["Admit card","Stationery kit","Water bottle","Watch / clock","Light snack","Calm mindset"];
const savedPre = store.get('pre', {});
document.getElementById('preCheck').innerHTML = preItems.map((item, i) => {
  const checked = savedPre[i] ? 'checked' : '';
  return `<label><input type="checkbox" data-i="${i}" ${checked}> ${item}</label>`;
}).join('');

document.querySelectorAll('#preCheck input').forEach(cb => {
  cb.addEventListener('change', () => {
    savedPre[cb.dataset.i] = cb.checked;
    store.set('pre', savedPre);
  });
});

/* ============================================================
   REMINDER ENGINE + SERVICE WORKER + NOTIFICATIONS
   ============================================================ */

/* ---------- DEFAULT REMINDERS ---------- */
const DEFAULT_REMINDERS = [
  { time:"05:30", title:"Wake up + Freshen up",          body:"Start the day clean. No phone first.", enabled:true },
  { time:"05:45", title:"Fajr Salah",                    body:"Reset. Pray. Focus.",                  enabled:true },
  { time:"06:05", title:"🎯 Deep Study Block 1",         body:"Hardest topic first. Maths or Science.", enabled:true },
  { time:"06:50", title:"Breakfast + Quick recall",      body:"Eat well. Recall yesterday's key points.", enabled:true },
  { time:"08:10", title:"🏫 School time",                body:"Bag ready? Admit card? Focus in class.", enabled:true },
  { time:"16:00", title:"📚 Tuition",                    body:"Pay attention. Ask questions.",         enabled:true },
  { time:"19:00", title:"📘 Study Block 2",              body:"Science focus. 90% Loop.",              enabled:true },
  { time:"20:00", title:"📗 Study Block 3",              body:"SST Maps / Dates. Active recall.",      enabled:true },
  { time:"21:30", title:"📝 Homework + Revision",        body:"Same-day revision. Prepare tomorrow's bag.", enabled:true },
  { time:"22:00", title:"😴 Sleep",                      body:"No screens. Recover for tomorrow.",     enabled:true }
];

/* ---------- STATE ---------- */
let reminders = store.get('reminders', DEFAULT_REMINDERS);
let notifEnabled = store.get('notifEnabled', false);

/* ---------- RENDER REMINDER LIST ---------- */
function renderReminders(){
  const list = document.getElementById('reminderList');
  list.innerHTML = reminders.map((r, i) => `
    <div class="reminder-item ${r.enabled?'':'off'}">
      <span class="r-time">${r.time}</span>
      <span class="r-text">
        <b>${r.title}</b>
        <span style="display:block;font-size:11px;color:var(--muted)">${r.body}</span>
      </span>
      <button class="r-toggle ${r.enabled?'on':''}" data-i="${i}" aria-label="toggle"></button>
    </div>
  `).join('');

  list.querySelectorAll('.r-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const i = +btn.dataset.i;
      reminders[i].enabled = !reminders[i].enabled;
      store.set('reminders', reminders);
      renderReminders();
      scheduleAll();
    });
  });
}
renderReminders();

/* ---------- SERVICE WORKER REGISTRATION ---------- */
let swReg = null;
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(reg => {
        swReg = reg;
        console.log('✅ SW registered');
      })
      .catch(err => console.warn('SW failed:', err));
  });
}

/* ---------- NOTIFICATION PERMISSION ---------- */
async function requestPermission(){
  if (!('Notification' in window)) {
    toast('❌ Notifications not supported here');
    return false;
  }
  if (Notification.permission === 'granted') return true;
  if (Notification.permission === 'denied') {
    toast('⚠️ Notifications blocked — enable in browser/phone settings');
    return false;
  }
  const p = await Notification.requestPermission();
  return p === 'granted';
}

/* ---------- SEND NOTIFICATION ---------- */
function sendNotif(title, body, tag){
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  if (swReg && swReg.active) {
    swReg.active.postMessage({ type:'notify', title, body, tag });
  } else {
    try { new Notification(title, { body, icon:'./icons/icon-192.png', tag }); } catch(e){}
  }
}

/* ---------- SCHEDULING ENGINE ---------- */
/* Runs while the page/app is open or alive.
   Stores "lastFired" per reminder per day so it won't spam. */
const firedKey = 'fired_' + new Date().toDateString();
let firedToday = store.get(firedKey, {});

function checkSchedule(){
  const now = new Date();
  const hhmm = String(now.getHours()).padStart(2,'0') + ':' + String(now.getMinutes()).padStart(2,'0');

  reminders.forEach((r, i) => {
    if (!r.enabled) return;
    if (r.time === hhmm && !firedToday[i]) {
      sendNotif('PT3 · ' + r.time, `${r.title} — ${r.body}`, 'pt3-'+i);
      firedToday[i] = true;
      store.set(firedKey, firedToday);
    }
  });
}

function scheduleAll(){
  if (swReg && swReg.active) {
    swReg.active.postMessage({
      type:'schedule',
      reminders: reminders.filter(r => r.enabled)
    });
  }
}

/* Check every 30 seconds while page is open */
setInterval(checkSchedule, 30000);
checkSchedule();
scheduleAll();

/* ---------- DAILY COUNTDOWN PING ---------- */
/* Fires once per day at 06:00 to remind "Day X of 15" */
const targetExam = new Date(new Date().getFullYear(), 9, 15); // 15 Oct
function dailyCountdownPing(){
  const now = new Date();
  if (now > new Date(targetExam.getFullYear(), 9, 15, 23, 59)) targetExam.setFullYear(targetExam.getFullYear()+1);
  const diff = Math.ceil((targetExam - now) / 86400000);
  if (diff > 0 && now.getHours() === 6 && now.getMinutes() === 0) {
    const k = 'countdown_' + now.toDateString();
    if (!store.get(k, false)) {
      sendNotif('⏳ PT3 Countdown', `${diff} day${diff===1?'':'s'} until exams. Stay on plan.`, 'pt3-count');
      store.set(k, true);
    }
  }
}
setInterval(dailyCountdownPing, 30000);

/* ---------- NOTIFICATION BANNER ---------- */
const banner = document.getElementById('notifBanner');
if (!notifEnabled) banner.style.display = 'flex';

document.getElementById('enableNotif').addEventListener('click', async () => {
  const ok = await requestPermission();
  if (ok) {
    notifEnabled = true;
    store.set('notifEnabled', true);
    banner.style.display = 'none';
    sendNotif('✅ PT3 Command Center', 'Reminders enabled. Stay on plan!', 'welcome');
    toast('🔔 Reminders enabled');
    scheduleAll();
  } else {
    toast('❌ Permission denied');
  }
});

document.getElementById('dismissNotif').addEventListener('click', () => {
  banner.style.display = 'none';
});

document.getElementById('notifStatusBtn').addEventListener('click', async () => {
  if (!('Notification' in window)) return toast('❌ Not supported on this device');
  const p = Notification.permission;
  if (p === 'granted') toast('✅ Notifications enabled');
  else if (p === 'denied') toast('⚠️ Blocked — check phone settings');
  else {
    const ok = await requestPermission();
    if (ok) { notifEnabled = true; store.set('notifEnabled', true); toast('🔔 Enabled!'); }
  }
});

document.getElementById('testNotif').addEventListener('click', async () => {
  const ok = await requestPermission();
  if (!ok) return toast('❌ Permission needed');
  sendNotif('🔔 PT3 Test', 'Notifications are working perfectly.', 'pt3-test');
  toast('📨 Test sent');
});

/* ---------- GOOGLE CALENDAR EXPORT ---------- */
document.getElementById('exportCal').addEventListener('click', () => {
  /* Build one .ics file with ALL reminders as daily recurring events */
  const now = new Date();
  const pad = n => String(n).padStart(2,'0');
  const fmt = d => `${d.getUTCFullYear()}${pad(d.getUTCMonth()+1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`;

  /* Start from tomorrow for clean recurring events */
  const startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

  let ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//PT3 Command Center//EN',
    'CALSCALE:GREGORIAN'
  ];

  reminders.filter(r => r.enabled).forEach((r, idx) => {
    const [h, m] = r.time.split(':').map(Number);
    const start = new Date(startDate); start.setHours(h, m, 0, 0);
    const end   = new Date(start.getTime() + 15*60000);

    /* Convert local time to UTC for ICS */
    const s = fmt(new Date(start.getTime() - start.getTimezoneOffset()*60000));
    const e = fmt(new Date(end.getTime()   - end.getTimezoneOffset()*60000));
    /* UNTIL: 15 Oct end of day in UTC */
    const untilDate = new Date(targetExam);
    untilDate.setHours(23,59,59,0);
    const until = fmt(new Date(untilDate.getTime() - untilDate.getTimezoneOffset()*60000));

    ics.push(
      'BEGIN:VEVENT',
      `UID:pt3-${idx}-${Date.now()}@pt3command`,
      `DTSTAMP:${fmt(now)}`,
      `DTSTART:${s}`,
      `DTEND:${e}`,
      `RRULE:FREQ=DAILY;UNTIL=${until}`,
      `SUMMARY:PT3 · ${r.title}`,
      `DESCRIPTION:${r.body}`,
      'BEGIN:VALARM',
      'TRIGGER:-PT0M',
      'ACTION:DISPLAY',
      `DESCRIPTION:${r.title}`,
      'END:VALARM',
      'END:VEVENT'
    );
  });

  ics.push('END:VCALENDAR');

  const blob = new Blob([ics.join('\r\n')], { type:'text/calendar' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'PT3-Command-Center.ics';
  a.click();
  URL.revokeObjectURL(url);

  toast('📅 Import the .ics file into Google Calendar');
});

/* ---------- TOAST HELPER ---------- */
function toast(msg){
  let t = document.querySelector('.toast');
  if (!t) {
    t = document.createElement('div');
    t.className = 'toast';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), 3200);
}

/* ============================================================
   SUPABASE AUTHENTICATION
   ============================================================ */

   const SUPABASE_URL = 'https://qwcwcufzyrsxkpaembch.supabase.co';
   const SUPABASE_KEY = 'sb_publishable_A8QkhY8VS5g4gYzO2UyB1g_oseNpuna';
   
   const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
   
   const loginBtn   = document.getElementById('loginBtn');
   const userBox    = document.getElementById('userBox');
   const userName   = document.getElementById('userName');
   const userAvatar = document.getElementById('userAvatar');
   const logoutBtn  = document.getElementById('logoutBtn');
   
   /* ---- Sign in with Google ---- */
   loginBtn.addEventListener('click', async () => {
     const { error } = await supabaseClient.auth.signInWithOAuth({
       provider: 'google',
       options: { redirectTo: window.location.origin + window.location.pathname }
     });
     if (error) {
       console.error('Login error:', error.message);
       toast('❌ ' + error.message);
     }
   });
   
   /* ---- Sign out ---- */
   logoutBtn.addEventListener('click', async () => {
     await supabaseClient.auth.signOut();
     toast('👋 Signed out');
   });
   
   /* ---- Update UI based on auth state ---- */
   async function updateAuthUI(){
     const { data: { session } } = await supabaseClient.auth.getSession();
     if (session && session.user) {
       const u = session.user;
       loginBtn.style.display = 'none';
       userBox.style.display = 'flex';
       userName.textContent = u.user_metadata.full_name || u.email;
       userAvatar.src = u.user_metadata.avatar_url || '';
     } else {
       loginBtn.style.display = 'inline-block';
       userBox.style.display = 'none';
     }
   }
   
   /* ---- Listen to auth changes ---- */
   supabaseClient.auth.onAuthStateChange((event, session) => {
     updateAuthUI();
     if (event === 'SIGNED_IN') toast('✅ Signed in');
     if (event === 'SIGNED_OUT') toast('👋 Signed out');
   });
   
   /* ---- Check on load ---- */
   updateAuthUI();