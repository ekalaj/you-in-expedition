/* =====================================================================
   COMMON GROUND — prototype app logic
   Vanilla JS + localStorage so the demo feels live: you can sign up,
   post an activity, join/leave, and see it persist in your browser.
   No real server, accounts, or payments — this is a clickable prototype.
   ===================================================================== */

const STORE = {
  activities: 'cg_activities',
  member: 'cg_member',
  seeded: 'cg_seeded_v1',
};

/* ---------- date helpers ---------- */
function dateFromNow(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}
function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });
}
function shortDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
}
function uid() { return 'a' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }

/* ---------- storage ---------- */
function seedIfNeeded() {
  if (localStorage.getItem(STORE.seeded)) return;
  const seeded = SEED_ACTIVITIES.map(a => ({
    id: uid(),
    title: a.title,
    category: a.category,
    host: a.host,
    date: dateFromNow(a.daysFromNow),
    time: a.time,
    place: a.place,
    area: a.area,
    capacity: a.capacity,
    attendees: a.attendees.slice(),
    description: a.description,
  }));
  localStorage.setItem(STORE.activities, JSON.stringify(seeded));
  localStorage.setItem(STORE.seeded, '1');
}

function getActivities() {
  seedIfNeeded();
  const raw = localStorage.getItem(STORE.activities);
  const list = raw ? JSON.parse(raw) : [];
  return list.sort((x, y) => new Date(x.date) - new Date(y.date));
}
function saveActivities(list) {
  localStorage.setItem(STORE.activities, JSON.stringify(list));
}
function getActivity(id) {
  return getActivities().find(a => a.id === id);
}
function addActivity(obj) {
  const list = getActivities();
  const me = getMember();
  const activity = {
    id: uid(),
    title: obj.title,
    category: obj.category,
    host: me ? me.name : 'You',
    date: obj.date,
    time: obj.time,
    place: obj.place,
    area: obj.area,
    capacity: parseInt(obj.capacity, 10) || 8,
    attendees: [me ? me.name : 'You'],
    description: obj.description,
  };
  list.push(activity);
  saveActivities(list);
  return activity;
}

/* ---------- member (simulated sign-in) ---------- */
function getMember() {
  const raw = localStorage.getItem(STORE.member);
  return raw ? JSON.parse(raw) : null;
}
function setMember(member) {
  localStorage.setItem(STORE.member, JSON.stringify(member));
}
function signOut() {
  localStorage.removeItem(STORE.member);
}
function trialDaysLeft() {
  const me = getMember();
  if (!me || !me.joined) return null;
  const joined = new Date(me.joined);
  const end = new Date(joined);
  end.setDate(end.getDate() + (me.trialDays || 30));
  const left = Math.ceil((end - new Date()) / (1000 * 60 * 60 * 24));
  return Math.max(0, left);
}

/* ---------- join / leave ---------- */
function isJoined(activity) {
  const me = getMember();
  const name = me ? me.name : 'You';
  return activity.attendees.includes(name);
}
function toggleJoin(id) {
  const list = getActivities();
  const a = list.find(x => x.id === id);
  if (!a) return null;
  const me = getMember();
  const name = me ? me.name : 'You';
  const i = a.attendees.indexOf(name);
  if (i >= 0) {
    a.attendees.splice(i, 1);
  } else {
    if (a.attendees.length >= a.capacity) return { full: true };
    a.attendees.push(name);
  }
  saveActivities(list);
  return a;
}

/* ---------- UI helpers ---------- */
function initials(name) {
  return name.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase();
}
function spotsLabel(a) {
  const left = a.capacity - a.attendees.length;
  if (left <= 0) return { text: 'Full', cls: 'full' };
  if (left <= 2) return { text: left + ' spot' + (left === 1 ? '' : 's') + ' left', cls: 'few' };
  return { text: left + ' spots left', cls: '' };
}
function toast(msg) {
  let el = document.querySelector('.toast');
  if (!el) {
    el = document.createElement('div');
    el.className = 'toast';
    document.body.appendChild(el);
  }
  el.textContent = msg;
  requestAnimationFrame(() => el.classList.add('show'));
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove('show'), 2600);
}
function qs(name) {
  return new URLSearchParams(location.search).get(name);
}

/* ---------- nav: mobile toggle + member state ---------- */
function initNav() {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }
  // swap the auth link based on sign-in state
  const authSlot = document.querySelector('[data-auth-slot]');
  if (authSlot) {
    const me = getMember();
    if (me) {
      authSlot.textContent = 'Hi, ' + me.name.split(' ')[0];
      authSlot.setAttribute('href', 'profile.html');
    } else {
      authSlot.textContent = 'Sign in';
      authSlot.setAttribute('href', 'signup.html');
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  seedIfNeeded();
  initNav();
  if (typeof pageInit === 'function') pageInit();
});
