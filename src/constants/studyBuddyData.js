export const GOOGLE_CLIENT_ID = "690038744070-3o95qmee1h9mk3aas12st4q36k824m8b.apps.googleusercontent.com";
export const SCOPES = "https://www.googleapis.com/auth/calendar.events";
export const GOOGLE_MAPS_API_KEY = "AIzaSyBeS7SWjIBiudPOTdrhluEJwhtriQZWOzg";

export const ALL_COURSES = [
  { code: "ACCT 351", name: "Intermediate Financial Accounting 1" },
  { code: "ACCT 352", name: "Intermediate Financial Accounting 2" },
  { code: "ACCT 361", name: "Managerial Accounting" },
  { code: "COMP 202", name: "Foundations of Programming" },
  { code: "COMP 206", name: "Introduction to Software Systems" },
  { code: "COMP 250", name: "Introduction to Computer Science" },
  { code: "COMP 251", name: "Algorithms and Data Structures" },
  { code: "COMP 273", name: "Introduction to Computer Systems" },
  { code: "ECON 208", name: "Microeconomic Analysis and Applications" },
  { code: "ECON 209", name: "Macroeconomic Analysis and Applications" },
  { code: "MATH 140", name: "Calculus 1" },
  { code: "MATH 141", name: "Calculus 2" },
  { code: "PSYC 100", name: "Introduction to Psychology 1" },
  { code: "BIOL 111", name: "Principles: Organismal Biology" },
  { code: "CHEM 110", name: "General Chemistry 1" },
];

export const ALL_BUILDINGS = [
  { id: "mclennan", name: "McLennan-Redpath Library", booking: false },
  { id: "schulich", name: "Schulich Library of Science", booking: false },
  { id: "humanities", name: "Humanities & Social Sciences Library", booking: false },
  {
    id: "trottier",
    name: "Trottier Building",
    booking: true,
    url: "https://calendar.google.com/calendar/u/0/appointments/AcZssZ21fWlz5fAbV51y6M5Bkc3t5denCAnFJ6wZQls=",
  },
];

export const FALLBACK_PLACES = [
  { id: "cafe7", name: "Second Cup – McGill", address: "3475 Rue McTavish, Montréal", rating: 4.0, totalRatings: 310, lat: 45.5052, lng: -73.577, distance: "0.2", priceLevel: 2, openNow: true, busy: "Moderate", hours: ["Monday: 6:30 AM – 9:00 PM", "Tuesday: 6:30 AM – 9:00 PM", "Wednesday: 6:30 AM – 9:00 PM", "Thursday: 6:30 AM – 9:00 PM", "Friday: 6:30 AM – 9:00 PM", "Saturday: 7:30 AM – 8:00 PM", "Sunday: 7:30 AM – 8:00 PM"] },
  { id: "cafe6", name: "Arts Café", address: "201 Ave du Président-Kennedy, Montréal", rating: 4.2, totalRatings: 450, lat: 45.5077, lng: -73.5712, distance: "0.5", priceLevel: 1, openNow: true, busy: "Busy", hours: ["Monday: 7:00 AM – 10:00 PM", "Tuesday: 7:00 AM – 10:00 PM", "Wednesday: 7:00 AM – 10:00 PM", "Thursday: 7:00 AM – 10:00 PM", "Friday: 7:00 AM – 10:00 PM", "Saturday: 8:00 AM – 10:00 PM", "Sunday: 8:00 AM – 10:00 PM"] },
  { id: "cafe5", name: "Pikolo Espresso Bar", address: "3418a Ave du Parc, Montréal", rating: 4.5, totalRatings: 720, lat: 45.5112, lng: -73.5748, distance: "0.8", priceLevel: 1, openNow: true, busy: "Quiet", hours: ["Monday: 7:00 AM – 7:00 PM", "Tuesday: 7:00 AM – 7:00 PM", "Wednesday: 7:00 AM – 7:00 PM", "Thursday: 7:00 AM – 7:00 PM", "Friday: 7:00 AM – 7:00 PM", "Saturday: 8:00 AM – 7:00 PM", "Sunday: 8:00 AM – 7:00 PM"] },
  { id: "cafe4", name: "Café Myriade", address: "1432 Rue Mackay, Montréal", rating: 4.5, totalRatings: 1560, lat: 45.4973, lng: -73.5778, distance: "0.9", priceLevel: 2, openNow: true, busy: "Moderate", hours: ["Monday: 7:30 AM – 6:00 PM", "Tuesday: 7:30 AM – 6:00 PM", "Wednesday: 7:30 AM – 6:00 PM", "Thursday: 7:30 AM – 6:00 PM", "Friday: 7:30 AM – 6:00 PM", "Saturday: 8:30 AM – 6:00 PM", "Sunday: 8:30 AM – 6:00 PM"] },
  { id: "cafe8", name: "Café Nocturne", address: "3584 Boul Saint-Laurent, Montréal", rating: 4.3, totalRatings: 560, lat: 45.515, lng: -73.568, distance: "1.2", priceLevel: 2, openNow: true, busy: "Quiet", hours: ["Monday: 8:00 AM – 11:00 PM", "Tuesday: 8:00 AM – 11:00 PM", "Wednesday: 8:00 AM – 11:00 PM", "Thursday: 8:00 AM – 11:00 PM", "Friday: 8:00 AM – 11:00 PM", "Saturday: 9:00 AM – 12:00 AM", "Sunday: 9:00 AM – 10:00 PM"] },
  { id: "cafe2", name: "Crew Collective & Café", address: "360 Rue Saint-Jacques, Montréal", rating: 4.4, totalRatings: 3120, lat: 45.5025, lng: -73.5604, distance: "1.6", priceLevel: 2, openNow: true, busy: "Busy", hours: ["Monday: 8:00 AM – 5:00 PM", "Tuesday: 8:00 AM – 5:00 PM", "Wednesday: 8:00 AM – 5:00 PM", "Thursday: 8:00 AM – 5:00 PM", "Friday: 8:00 AM – 5:00 PM", "Saturday: 9:00 AM – 5:00 PM", "Sunday: 9:00 AM – 5:00 PM"] },
  { id: "cafe1", name: "Café Olimpico", address: "124 Rue Saint-Viateur O, Montréal", rating: 4.5, totalRatings: 2840, lat: 45.5225, lng: -73.5985, distance: "2.4", priceLevel: 2, openNow: true, busy: "Moderate", hours: ["Monday: 6:00 AM – 12:00 AM", "Tuesday: 6:00 AM – 12:00 AM", "Wednesday: 6:00 AM – 12:00 AM", "Thursday: 6:00 AM – 12:00 AM", "Friday: 6:00 AM – 12:00 AM", "Saturday: 6:00 AM – 12:00 AM", "Sunday: 6:00 AM – 12:00 AM"] },
  { id: "cafe3", name: "Dispatch Coffee", address: "1000 Rue Bellechasse, Montréal", rating: 4.6, totalRatings: 890, lat: 45.5341, lng: -73.5956, distance: "3.5", priceLevel: 2, openNow: true, busy: "Quiet", hours: ["Monday: 8:00 AM – 5:00 PM", "Tuesday: 8:00 AM – 5:00 PM", "Wednesday: 8:00 AM – 5:00 PM", "Thursday: 8:00 AM – 5:00 PM", "Friday: 8:00 AM – 5:00 PM", "Saturday: 9:00 AM – 5:00 PM", "Sunday: 9:00 AM – 5:00 PM"] },
];
