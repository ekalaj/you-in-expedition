/* =====================================================================
   COMMON GROUND — seed data + categories
   Prototype only: sample activities used the first time the app loads.
   ===================================================================== */

const CATEGORIES = [
  { id: 'cards',    name: 'Playing Cards',     icon: '🂡', cls: 'c-cards' },
  { id: 'dominoes', name: 'Dominoes',          icon: '🁫', cls: 'c-dominoes' },
  { id: 'crafts',   name: 'Knitting & Crafts', icon: '🧶', cls: 'c-crafts' },
  { id: 'walking',  name: 'Walking Group',     icon: '🚶', cls: 'c-walking' },
  { id: 'coffee',   name: 'Coffee & Chat',     icon: '☕', cls: 'c-coffee' },
  { id: 'games',    name: 'Board Games',       icon: '🎲', cls: 'c-games' },
  { id: 'garden',   name: 'Gardening',         icon: '🌷', cls: 'c-garden' },
  { id: 'books',    name: 'Book Club',         icon: '📚', cls: 'c-books' },
  { id: 'music',    name: 'Music & Singing',   icon: '🎵', cls: 'c-music' },
  { id: 'meal',     name: 'Shared Meal',       icon: '🍲', cls: 'c-meal' },
];

function categoryById(id) {
  return CATEGORIES.find(c => c.id === id) || { id: 'other', name: 'Activity', icon: '📌', cls: 'c-default' };
}

/* Approximate neighborhood coordinates (lat/lng) used by the recommendation
   algorithm to estimate distance. In the real app these come from geocoding
   the meeting place; here we map our sample neighborhoods to fixed points.
   Only neighborhood-level location is ever used — never an exact address. */
const AREA_COORDS = {
  'Oakdale':   { lat: 42.462, lng: -83.104 },
  'Riverside': { lat: 42.411, lng: -83.162 },
  'Greenfield':{ lat: 42.383, lng: -83.118 },
};

/* Sample activities. Dates are generated relative to "today" so the
   prototype always shows upcoming events. */
const SEED_ACTIVITIES = [
  {
    title: 'Friendly Bridge Afternoon',
    category: 'cards',
    host: 'Margaret W.',
    daysFromNow: 2, time: '2:00 PM',
    place: 'Maple Street Community Center',
    area: 'Oakdale',
    capacity: 8,
    attendees: ['Margaret W.', 'Frank D.', 'Rosa L.'],
    description: "A relaxed game of bridge for all levels. We'll pair newcomers with experienced players, so don't worry if you're rusty. Tea and biscuits provided. Come for the cards, stay for the company.",
  },
  {
    title: 'Tuesday Dominoes Club',
    category: 'dominoes',
    host: 'Frank D.',
    daysFromNow: 1, time: '10:30 AM',
    place: 'Riverside Library, Meeting Room B',
    area: 'Riverside',
    capacity: 12,
    attendees: ['Frank D.', 'Henry P.', 'Lillian S.', 'Joe M.'],
    description: 'Our weekly dominoes get-together. Bones and boards are all here — just bring yourself. Lively but friendly. We usually play a few rounds and chat over coffee.',
  },
  {
    title: 'Knitting Circle & Cozy Chat',
    category: 'crafts',
    host: 'Rosa L.',
    daysFromNow: 3, time: '1:00 PM',
    place: 'The Yarn Corner Café',
    area: 'Oakdale',
    capacity: 10,
    attendees: ['Rosa L.', 'Margaret W.'],
    description: "Bring a project you're working on, or start something new. We share patterns, swap tips, and there's always someone happy to help untangle a tricky stitch. Beginners very welcome.",
  },
  {
    title: 'Morning Walk in the Park',
    category: 'walking',
    host: 'Henry P.',
    daysFromNow: 1, time: '9:00 AM',
    place: 'Greenfield Park, Main Gate',
    area: 'Greenfield',
    capacity: 15,
    attendees: ['Henry P.', 'Joe M.', 'Lillian S.'],
    description: 'A gentle 30–40 minute stroll on flat, paved paths. We keep an easy pace and there are plenty of benches if you need a rest. A lovely way to start the day with good company.',
  },
  {
    title: 'Coffee & Conversation',
    category: 'coffee',
    host: 'Lillian S.',
    daysFromNow: 4, time: '11:00 AM',
    place: 'Corner Bean Coffee House',
    area: 'Riverside',
    capacity: 6,
    attendees: ['Lillian S.', 'Rosa L.', 'Frank D.', 'Henry P.', 'Margaret W.'],
    description: 'No agenda — just good coffee and friendly faces. We talk about everything and nothing. A warm, welcoming group if you fancy a chat and meeting new neighbors.',
  },
  {
    title: 'Scrabble & Board Games Night',
    category: 'games',
    host: 'Joe M.',
    daysFromNow: 5, time: '6:00 PM',
    place: 'Oakdale Senior Lounge',
    area: 'Oakdale',
    capacity: 10,
    attendees: ['Joe M.', 'Henry P.'],
    description: 'Scrabble, Rummikub, checkers and more. We have plenty of games on the shelf, or bring your favorite. Good-natured competition and lots of laughs.',
  },
  {
    title: 'Community Garden Morning',
    category: 'garden',
    host: 'Rosa L.',
    daysFromNow: 6, time: '10:00 AM',
    place: 'Greenfield Allotments',
    area: 'Greenfield',
    capacity: 12,
    attendees: ['Rosa L.', 'Margaret W.', 'Joe M.'],
    description: 'Help tend the shared beds, swap cuttings, and enjoy the fresh air. No experience needed — just a willingness to get your hands a little dirty. Gloves and tools provided.',
  },
  {
    title: 'Book Club: "A Gentleman in Moscow"',
    category: 'books',
    host: 'Margaret W.',
    daysFromNow: 8, time: '2:30 PM',
    place: 'Riverside Library, Meeting Room A',
    area: 'Riverside',
    capacity: 12,
    attendees: ['Margaret W.', 'Lillian S.'],
    description: "This month we're discussing Amor Towles' beloved novel. Haven't finished it? Come anyway — no homework police here. Thoughtful, friendly discussion and a cup of tea.",
  },
];
