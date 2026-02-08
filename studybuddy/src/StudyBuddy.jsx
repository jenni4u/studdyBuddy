import React, { useState, useEffect, useRef, useCallback } from 'react';

const GOOGLE_CLIENT_ID = '690038744070-3o95qmee1h9mk3aas12st4q36k824m8b.apps.googleusercontent.com';
const SCOPES = 'https://www.googleapis.com/auth/calendar.events';
const GOOGLE_MAPS_API_KEY = 'AIzaSyBeS7SWjIBiudPOTdrhluEJwhtriQZWOzg';

const ALL_COURSES = [
  {"code": "ACCT 351", "name": "Intermediate Financial Accounting 1"},
  {"code": "ACCT 352", "name": "Intermediate Financial Accounting 2"},
  {"code": "ACCT 361", "name": "Managerial Accounting"},
  {"code": "COMP 202", "name": "Foundations of Programming"},
  {"code": "COMP 206", "name": "Introduction to Software Systems"},
  {"code": "COMP 250", "name": "Introduction to Computer Science"},
  {"code": "COMP 251", "name": "Algorithms and Data Structures"},
  {"code": "COMP 273", "name": "Introduction to Computer Systems"},
  {"code": "ECON 208", "name": "Microeconomic Analysis and Applications"},
  {"code": "ECON 209", "name": "Macroeconomic Analysis and Applications"},
  {"code": "MATH 140", "name": "Calculus 1"},
  {"code": "MATH 141", "name": "Calculus 2"},
  {"code": "PSYC 100", "name": "Introduction to Psychology 1"},
  {"code": "BIOL 111", "name": "Principles: Organismal Biology"},
  {"code": "CHEM 110", "name": "General Chemistry 1"},
];

// McGill Buildings
const ALL_BUILDINGS = [
  {id: 'mclennan', name: 'McLennan-Redpath Library', booking: false},
  {id: 'schulich', name: 'Schulich Library of Science', booking: false},
  {id: 'humanities', name: 'Humanities & Social Sciences Library', booking: false},
  {id: 'trottier', name: 'Trottier Building', booking: true, url: 'https://calendar.google.com/calendar/u/0/appointments/AcZssZ21fWlz5fAbV51y6M5Bkc3t5denCAnFJ6wZQls='},
];

// Fallback nearby cafés around McGill — sorted closest to farthest
const FALLBACK_PLACES = [
  {id:'cafe7',name:'Second Cup – McGill',address:'3475 Rue McTavish, Montréal',rating:4.0,totalRatings:310,lat:45.5052,lng:-73.5770,distance:'0.2',priceLevel:2,openNow:true,busy:'Moderate',hours:['Monday: 6:30 AM – 9:00 PM','Tuesday: 6:30 AM – 9:00 PM','Wednesday: 6:30 AM – 9:00 PM','Thursday: 6:30 AM – 9:00 PM','Friday: 6:30 AM – 9:00 PM','Saturday: 7:30 AM – 8:00 PM','Sunday: 7:30 AM – 8:00 PM']},
  {id:'cafe6',name:'Arts Café',address:'201 Ave du Président-Kennedy, Montréal',rating:4.2,totalRatings:450,lat:45.5077,lng:-73.5712,distance:'0.5',priceLevel:1,openNow:true,busy:'Busy',hours:['Monday: 7:00 AM – 10:00 PM','Tuesday: 7:00 AM – 10:00 PM','Wednesday: 7:00 AM – 10:00 PM','Thursday: 7:00 AM – 10:00 PM','Friday: 7:00 AM – 10:00 PM','Saturday: 8:00 AM – 10:00 PM','Sunday: 8:00 AM – 10:00 PM']},
  {id:'cafe5',name:'Pikolo Espresso Bar',address:'3418a Ave du Parc, Montréal',rating:4.5,totalRatings:720,lat:45.5112,lng:-73.5748,distance:'0.8',priceLevel:1,openNow:true,busy:'Quiet',hours:['Monday: 7:00 AM – 7:00 PM','Tuesday: 7:00 AM – 7:00 PM','Wednesday: 7:00 AM – 7:00 PM','Thursday: 7:00 AM – 7:00 PM','Friday: 7:00 AM – 7:00 PM','Saturday: 8:00 AM – 7:00 PM','Sunday: 8:00 AM – 7:00 PM']},
  {id:'cafe4',name:'Café Myriade',address:'1432 Rue Mackay, Montréal',rating:4.5,totalRatings:1560,lat:45.4973,lng:-73.5778,distance:'0.9',priceLevel:2,openNow:true,busy:'Moderate',hours:['Monday: 7:30 AM – 6:00 PM','Tuesday: 7:30 AM – 6:00 PM','Wednesday: 7:30 AM – 6:00 PM','Thursday: 7:30 AM – 6:00 PM','Friday: 7:30 AM – 6:00 PM','Saturday: 8:30 AM – 6:00 PM','Sunday: 8:30 AM – 6:00 PM']},
  {id:'cafe8',name:'Café Nocturne',address:'3584 Boul Saint-Laurent, Montréal',rating:4.3,totalRatings:560,lat:45.5150,lng:-73.5680,distance:'1.2',priceLevel:2,openNow:true,busy:'Quiet',hours:['Monday: 8:00 AM – 11:00 PM','Tuesday: 8:00 AM – 11:00 PM','Wednesday: 8:00 AM – 11:00 PM','Thursday: 8:00 AM – 11:00 PM','Friday: 8:00 AM – 11:00 PM','Saturday: 9:00 AM – 12:00 AM','Sunday: 9:00 AM – 10:00 PM']},
  {id:'cafe2',name:'Crew Collective & Café',address:'360 Rue Saint-Jacques, Montréal',rating:4.4,totalRatings:3120,lat:45.5025,lng:-73.5604,distance:'1.6',priceLevel:2,openNow:true,busy:'Busy',hours:['Monday: 8:00 AM – 5:00 PM','Tuesday: 8:00 AM – 5:00 PM','Wednesday: 8:00 AM – 5:00 PM','Thursday: 8:00 AM – 5:00 PM','Friday: 8:00 AM – 5:00 PM','Saturday: 9:00 AM – 5:00 PM','Sunday: 9:00 AM – 5:00 PM']},
  {id:'cafe1',name:'Café Olimpico',address:'124 Rue Saint-Viateur O, Montréal',rating:4.5,totalRatings:2840,lat:45.5225,lng:-73.5985,distance:'2.4',priceLevel:2,openNow:true,busy:'Moderate',hours:['Monday: 6:00 AM – 12:00 AM','Tuesday: 6:00 AM – 12:00 AM','Wednesday: 6:00 AM – 12:00 AM','Thursday: 6:00 AM – 12:00 AM','Friday: 6:00 AM – 12:00 AM','Saturday: 6:00 AM – 12:00 AM','Sunday: 6:00 AM – 12:00 AM']},
  {id:'cafe3',name:'Dispatch Coffee',address:'1000 Rue Bellechasse, Montréal',rating:4.6,totalRatings:890,lat:45.5341,lng:-73.5956,distance:'3.5',priceLevel:2,openNow:true,busy:'Quiet',hours:['Monday: 8:00 AM – 5:00 PM','Tuesday: 8:00 AM – 5:00 PM','Wednesday: 8:00 AM – 5:00 PM','Thursday: 8:00 AM – 5:00 PM','Friday: 8:00 AM – 5:00 PM','Saturday: 9:00 AM – 5:00 PM','Sunday: 9:00 AM – 5:00 PM']},
];

export default function StudyBuddy() {
  const [modal, setModal] = useState(false);
  const [step, setStep] = useState(1);
  const [sessions, setSessions] = useState([
    {id: 1, course: 'COMP 202', name: 'Programming Practice', location: 'Café Olimpico', time: '2:00 PM', members: 2, maxMembers: 5, organizer: 'Sarah Chen', meetLink: null}
  ]);
  const [data, setData] = useState({
    type: '', visibility: '', courseMode: '', courses: [],
    locType: '', location: null, timeMode: '', date: '', start: '', end: '',
    maxMembers: 5, genderPref: 'any'
  });
  const [search, setSearch] = useState('');
  const [dropdown, setDropdown] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [nearbyPlaces, setNearbyPlaces] = useState([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [showHoursPanel, setShowHoursPanel] = useState(false);
  const ref = useRef(null);
  const mapRef = useRef(null);
  const googleMapRef = useRef(null);
  const markersRef = useRef([]);
  const selectedMarkerRef = useRef(null);
  const [googleUser, setGoogleUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const tokenClientRef = useRef(null);
  const placesLoadedRef = useRef(false);
  const [locationGranted, setLocationGranted] = useState(false);
  const [showLocationPopup, setShowLocationPopup] = useState(false);

  // Load Google Identity Services
  useEffect(() => {
    const s = document.createElement('script');
    s.src = 'https://accounts.google.com/gsi/client'; s.async = true; s.defer = true;
    s.onload = () => {
      tokenClientRef.current = window.google?.accounts?.oauth2?.initTokenClient({
        client_id: GOOGLE_CLIENT_ID, scope: SCOPES,
        callback: (r) => { if (r.access_token) { setAccessToken(r.access_token); setGoogleUser(true); } },
      });
    };
    document.head.appendChild(s);
  }, []);

  // Load Google Maps
  useEffect(() => {
    if (!window.google?.maps) {
      const s = document.createElement('script');
      s.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
      s.async = true;
      s.onload = () => setMapLoaded(true);
      s.onerror = () => setMapLoaded(false);
      document.head.appendChild(s);
    } else { setMapLoaded(true); }
  }, []);

  const signInWithGoogle = () => { if (tokenClientRef.current) tokenClientRef.current.requestAccessToken(); };

  const createGoogleMeetLink = async () => {
    if (!accessToken) return null;
    const ev = {
      summary: 'StudyBuddy Session', description: 'Study session created via StudyBuddy',
      start: { dateTime: new Date().toISOString(), timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone },
      end: { dateTime: new Date(Date.now() + 7200000).toISOString(), timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone },
      conferenceData: { createRequest: { requestId: Math.random().toString(36).substring(2,12), conferenceSolutionKey: { type: 'hangoutsMeet' } } },
    };
    try {
      const res = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1',
        { method: 'POST', headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' }, body: JSON.stringify(ev) });
      const d = await res.json();
      const ep = d.conferenceData?.entryPoints?.find(e => e.entryPointType === 'video');
      return ep ? ep.uri : null;
    } catch { return null; }
  };

  // Geolocation — only set location if user grants permission
  const requestLocation = () => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) { resolve(false); return; }
      navigator.geolocation.getCurrentPosition(
        p => { setUserLocation({ lat: p.coords.latitude, lng: p.coords.longitude }); setLocationGranted(true); resolve(true); },
        () => { setLocationGranted(false); resolve(false); }
      );
    });
  };

  // Try requesting on mount silently
  useEffect(() => { requestLocation(); }, []);

  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371, dLat = (lat2-lat1)*Math.PI/180, dLng = (lng2-lng1)*Math.PI/180;
    const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLng/2)**2;
    return (R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))).toFixed(1);
  };

  const placeSelectionPin = useCallback((place) => {
    if (!googleMapRef.current || !window.google?.maps) return;
    if (selectedMarkerRef.current) { selectedMarkerRef.current.setMap(null); }
    const m = new window.google.maps.Marker({
      position: { lat: place.lat, lng: place.lng }, map: googleMapRef.current, title: place.name,
      animation: window.google.maps.Animation.BOUNCE,
      icon: {
        url: `data:image/svg+xml,${encodeURIComponent('<svg width="44" height="54" xmlns="http://www.w3.org/2000/svg"><path d="M22 0C12.3 0 4.4 7.9 4.4 17.6c0 9.7 17.6 36.4 17.6 36.4s17.6-26.7 17.6-36.4C39.6 7.9 31.7 0 22 0z" fill="#DC2626"/><circle cx="22" cy="17.6" r="8.8" fill="white"/><text x="22" y="22" text-anchor="middle" font-size="14" fill="#DC2626">★</text></svg>')}`,
        scaledSize: new window.google.maps.Size(44, 54), anchor: new window.google.maps.Point(22, 54)
      }
    });
    selectedMarkerRef.current = m;
    setTimeout(() => m?.setAnimation(null), 1400);
    googleMapRef.current.panTo({ lat: place.lat, lng: place.lng });
    googleMapRef.current.setZoom(16);
  }, []);

  const loadFallbackPlaces = useCallback(() => {
    const h = new Date().getHours();
    const places = FALLBACK_PLACES.map(p => {
      let busy = 'Moderate';
      if (h >= 8 && h <= 11) busy = ['Busy','Moderate','Quiet'][Math.floor(Math.random()*3)];
      else if (h >= 12 && h <= 14) busy = 'Busy';
      else if (h >= 15 && h <= 17) busy = ['Busy','Moderate'][Math.floor(Math.random()*2)];
      else busy = 'Quiet';
      return { ...p, busy };
    });
    setNearbyPlaces(places);
    placesLoadedRef.current = true;
  }, []);

  const fetchNearbyPlaces = useCallback((map) => {
    if (!window.google?.maps?.places || !userLocation) { loadFallbackPlaces(); return; }
    const svc = new window.google.maps.places.PlacesService(map);
    const req = { location: new window.google.maps.LatLng(userLocation.lat, userLocation.lng), radius: 2000, type: ['cafe'], keyword: 'coffee study wifi' };
    const t = setTimeout(() => { if (!placesLoadedRef.current) loadFallbackPlaces(); }, 5000);
    svc.nearbySearch(req, (results, status) => {
      clearTimeout(t);
      if (status === window.google.maps.places.PlacesServiceStatus.OK && results?.length > 0) {
        markersRef.current.forEach(m => m.setMap(null)); markersRef.current = [];
        const places = results.slice(0, 15).map(place => {
          const dist = calculateDistance(userLocation.lat, userLocation.lng, place.geometry.location.lat(), place.geometry.location.lng());
          const h = new Date().getHours();
          let busy = 'Moderate';
          if (h>=8&&h<=11) busy=['Busy','Moderate','Quiet'][Math.floor(Math.random()*3)];
          else if (h>=12&&h<=14) busy='Busy';
          else if (h>=15&&h<=17) busy=['Busy','Moderate'][Math.floor(Math.random()*2)];
          else busy='Quiet';
          const pd = { id: place.place_id, name: place.name, address: place.vicinity, rating: place.rating||4.0, totalRatings: place.user_ratings_total||0, busy, lat: place.geometry.location.lat(), lng: place.geometry.location.lng(), placeId: place.place_id, distance: dist, priceLevel: place.price_level||2, openNow: place.opening_hours?.open_now, photos: place.photos };
          const mk = new window.google.maps.Marker({
            position: { lat: pd.lat, lng: pd.lng }, map, title: pd.name, animation: window.google.maps.Animation.DROP,
            icon: { url: `data:image/svg+xml,${encodeURIComponent('<svg width="40" height="50" xmlns="http://www.w3.org/2000/svg"><path d="M20 0C11.2 0 4 7.2 4 16c0 8.8 16 34 16 34s16-25.2 16-34c0-8.8-7.2-16-16-16z" fill="#6366F1"/><circle cx="20" cy="16" r="8" fill="white"/><text x="20" y="21" text-anchor="middle" font-size="12" fill="#6366F1" font-weight="bold">☕</text></svg>')}`, scaledSize: new window.google.maps.Size(40, 50), anchor: new window.google.maps.Point(20, 50) }
          });
          mk.addListener('click', () => {
            setSelectedPlace(pd); setShowHoursPanel(false); placeSelectionPin(pd);
            svc.getDetails({ placeId: pd.placeId, fields: ['opening_hours','website','formatted_phone_number','reviews'] }, (det, ds) => {
              if (ds === window.google.maps.places.PlacesServiceStatus.OK) {
                setSelectedPlace(prev => ({ ...prev, hours: det.opening_hours?.weekday_text, website: det.website, phone: det.formatted_phone_number, reviews: det.reviews?.slice(0,3) }));
              }
            });
          });
          markersRef.current.push(mk);
          return pd;
        });
        setNearbyPlaces(places.sort((a,b) => parseFloat(a.distance) - parseFloat(b.distance))); placesLoadedRef.current = true;
      } else { loadFallbackPlaces(); }
    });
  }, [userLocation, loadFallbackPlaces, placeSelectionPin, calculateDistance]);

  // Map init
  useEffect(() => {
    if (showMap && userLocation) {
      // Load fallback places immediately so list is never empty
      if (!placesLoadedRef.current) loadFallbackPlaces();
      if (mapLoaded && window.google?.maps && mapRef.current) {
        const map = new window.google.maps.Map(mapRef.current, {
          center: userLocation, zoom: 14,
          styles: [{ featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] }]
        });
        googleMapRef.current = map;
        new window.google.maps.Marker({ position: userLocation, map, title: "You",
          icon: { path: window.google.maps.SymbolPath.CIRCLE, scale: 10, fillColor: "#4F46E5", fillOpacity: 1, strokeColor: "#fff", strokeWeight: 2 }
        });
        fetchNearbyPlaces(map);
      }
    }
  }, [showMap, mapLoaded, userLocation, fetchNearbyPlaces, loadFallbackPlaces]);

  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setDropdown(false); };
    document.addEventListener('mousedown', h); return () => document.removeEventListener('mousedown', h);
  }, []);

  const filtered = ALL_COURSES.filter(c => c.code.toLowerCase().includes(search.toLowerCase()) || c.name.toLowerCase().includes(search.toLowerCase()));

  const toggleCourse = (course) => {
    if (data.courseMode === 'single') { setData({...data, courses: [course]}); setDropdown(false); }
    else { const ex = data.courses.find(c => c.code === course.code); setData({...data, courses: ex ? data.courses.filter(c => c.code !== course.code) : [...data.courses, course]}); }
  };

  // canNext: online sessions always pass step 4 (Google sign-in optional)
  const canNext = () => {
    if (step === 1) return data.type;
    if (step === 2) return data.visibility;
    if (step === 3) return data.courseMode === 'flex' || data.courses.length > 0;
    if (step === 4) return data.type === 'online' || data.location;
    if (step === 5) {
      if (!data.timeMode) return false;
      if (data.timeMode === 'scheduled') return data.date && data.start && data.end;
      return true;
    }
    return true;
  };

  const createSession = async () => {
    let meetLink = null;
    if (data.type === 'online' && accessToken) meetLink = await createGoogleMeetLink();
    const ns = {
      id: Date.now(),
      course: data.courseMode === 'flex' ? 'Flexible' : data.courses[0]?.code || 'Study',
      name: data.courseMode === 'flex' ? 'General Study Session' : data.courses.map(c => c.code).join(', '),
      location: data.type === 'online' ? 'Online' : data.location?.name,
      time: data.timeMode === 'now' ? 'LIVE NOW' : data.timeMode === 'scheduled' ? `${data.date} ${data.start}` : 'Flexible',
      members: 1, maxMembers: data.maxMembers, organizer: 'You', meetLink, genderPref: data.genderPref, isLive: data.timeMode === 'now'
    };
    setSessions([ns, ...sessions]);
    if (meetLink) window.open(meetLink, '_blank');
    reset();
  };

  const reset = () => {
    setModal(false); setStep(1);
    setData({ type:'', visibility:'', courseMode:'', courses:[], locType:'', location:null, timeMode:'', date:'', start:'', end:'', maxMembers:5, genderPref:'any' });
    setSearch(''); setShowMap(false); setSelectedPlace(null); setShowHoursPanel(false);
    placesLoadedRef.current = false;
    if (selectedMarkerRef.current) { selectedMarkerRef.current.setMap(null); selectedMarkerRef.current = null; }
  };

  const joinSession = s => { if (s.meetLink) window.open(s.meetLink, '_blank'); else alert(`Joining ${s.name} at ${s.location}!`); };

  const openNearbySpots = async () => {
    setData(d => ({...d, locType: 'spot'}));
    if (locationGranted && userLocation) {
      setShowMap(true);
    } else {
      const granted = await requestLocation();
      if (granted) { setShowMap(true); }
      else { setShowLocationPopup(true); }
    }
  };

  const selectPlaceFromMap = place => {
    setData({...data, location: place}); setShowMap(false); setSelectedPlace(null); setShowHoursPanel(false);
    if (selectedMarkerRef.current) { selectedMarkerRef.current.setMap(null); selectedMarkerRef.current = null; }
  };

  const BusyBadge = ({busy}) => (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${busy==='Quiet'?'bg-green-100 text-green-700':busy==='Moderate'?'bg-yellow-100 text-yellow-700':'bg-orange-100 text-orange-700'}`}>{busy}</span>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm p-4 border-b flex justify-between items-center">
        <h1 className="text-2xl font-bold text-indigo-600">StudyBuddy</h1>
        {googleUser ? <span className="text-sm text-green-600 font-medium">✓ Google Connected</span> :
          <button onClick={signInWithGoogle} className="text-sm px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Sign in with Google</button>}
      </div>

      {/* Sessions */}
      <div className="max-w-6xl mx-auto p-6">
        <h2 className="text-xl font-bold mb-4">Active Sessions</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {sessions.map(s => (
            <div key={s.id} className="bg-white p-6 rounded-xl shadow-md border-2 border-gray-100">
              <div className="flex justify-between items-start mb-2">
                <div><span className="text-sm font-semibold text-indigo-600">{s.course}</span><h3 className="font-bold text-lg mt-1">{s.name}</h3></div>
                {s.isLive && <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full">LIVE</span>}
              </div>
              <p className="text-sm text-gray-600">📍 {s.location}</p>
              <p className="text-sm text-gray-600">🕐 {s.time}</p>
              <p className="text-sm text-gray-600">👥 {s.members}/{s.maxMembers} members</p>
              {s.genderPref !== 'any' && <p className="text-sm text-gray-600">⚧ {s.genderPref} preferred</p>}
              <div className="mt-4 pt-4 border-t flex justify-between items-center">
                <span className="text-sm text-gray-500">by {s.organizer}</span>
                <button onClick={() => joinSession(s)} className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700">{s.meetLink ? 'Join Meet' : 'Join'}</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAB */}
      <button onClick={() => setModal(true)} className="fixed bottom-8 right-8 w-16 h-16 bg-indigo-600 text-white rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center justify-center text-3xl z-50">+</button>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[95vh] flex flex-col my-4">
            {/* Modal Header */}
            <div className="p-6 border-b flex justify-between items-center shrink-0">
              <div>
                <h2 className="text-xl font-bold">{showMap ? 'Choose Study Spot' : ['Session Type','Who Can Join?','Course Selection','Study Location','When to Study?','Group Details'][step-1]}</h2>
                {!showMap && <p className="text-sm text-gray-500">Step {step} of 6</p>}
              </div>
              <button onClick={reset} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
            </div>

            {/* Progress */}
            {!showMap && <div className="px-6 py-3 bg-gray-50 shrink-0"><div className="bg-gray-200 rounded-full h-2"><div className="bg-indigo-600 h-2 rounded-full transition-all" style={{width:`${(step/6)*100}%`}}/></div></div>}

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {/* Step 1 */}
              {!showMap && step === 1 && (
                <div className="p-6 space-y-4">
                  <p className="text-gray-600 mb-6">How would you like to study?</p>
                  <div className="grid grid-cols-2 gap-4">
                    {['online','in-person'].map(t => (
                      <button key={t} onClick={() => setData({...data, type: t})} className={`p-6 rounded-xl border-2 transition-all ${data.type===t?'border-indigo-600 bg-indigo-50 scale-105':'border-gray-200'}`}>
                        <div className="text-4xl mb-3">{t==='online'?'💻':'📍'}</div>
                        <div className="font-bold capitalize">{t.replace('-',' ')}</div>
                        <div className="text-sm text-gray-500 mt-1">{t==='online'?'Google Meet':'Meet at location'}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2 */}
              {!showMap && step === 2 && (
                <div className="p-6 space-y-4">
                  <p className="text-gray-600 mb-6">Who can see and join?</p>
                  <div className="grid grid-cols-2 gap-4">
                    {['public','private'].map(v => (
                      <button key={v} onClick={() => setData({...data, visibility: v})} className={`p-6 rounded-xl border-2 transition-all ${data.visibility===v?'border-indigo-600 bg-indigo-50 scale-105':'border-gray-200'}`}>
                        <div className="text-4xl mb-3">{v==='public'?'🌍':'🔒'}</div>
                        <div className="font-bold capitalize">{v}</div>
                        <div className="text-sm text-gray-500 mt-1">{v==='public'?'Everyone':'Friends only'}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3 */}
              {!showMap && step === 3 && (
                <div className="p-6 space-y-6">
                  <div>
                    <p className="text-gray-600 mb-4">What are you studying?</p>
                    <div className="grid grid-cols-3 gap-3">
                      {[{mode:'single',label:'One Course',icon:'📖'},{mode:'multi',label:'Multiple',icon:'📚'},{mode:'flex',label:'Flexible',icon:'✨'}].map(({mode,label,icon}) => (
                        <button key={mode} onClick={() => setData({...data, courseMode: mode, courses: mode==='flex'?[]:data.courses.slice(0,mode==='single'?1:999)})} className={`p-4 rounded-xl border-2 ${data.courseMode===mode?'border-indigo-600 bg-indigo-50':'border-gray-200'}`}>
                          <div className="text-3xl mb-2">{icon}</div><div className="text-sm font-medium">{label}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                  {data.courseMode && data.courseMode !== 'flex' && (
                    <div ref={ref}>
                      {data.courses.length > 0 && <div className="flex flex-wrap gap-2 mb-3">{data.courses.map(c => (
                        <div key={c.code} className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full flex items-center gap-2">
                          <span className="text-sm font-medium">{c.code}</span>
                          <button onClick={() => setData({...data, courses: data.courses.filter(x => x.code !== c.code)})} className="hover:bg-indigo-200 rounded-full text-lg leading-none">×</button>
                        </div>
                      ))}</div>}
                      <input type="text" placeholder="Search courses (e.g., COMP 202)" value={search} onChange={e => setSearch(e.target.value)} onFocus={() => setDropdown(true)} className="w-full px-4 py-3 border-2 rounded-xl focus:border-indigo-600 outline-none"/>
                      {dropdown && <div className="mt-2 bg-white border-2 rounded-xl max-h-80 overflow-y-auto shadow-xl">
                        {filtered.length > 0 ? filtered.map(c => (
                          <button key={c.code} onClick={() => toggleCourse(c)} className={`w-full text-left px-4 py-3 hover:bg-gray-50 border-b last:border-0 ${data.courses.find(x=>x.code===c.code)?'bg-indigo-50':''}`}>
                            <div className="font-semibold">{c.code}</div><div className="text-sm text-gray-600">{c.name}</div>
                          </button>
                        )) : <div className="p-8 text-center text-gray-500">No courses found</div>}
                      </div>}
                    </div>
                  )}
                  {data.courseMode === 'flex' && <div className="bg-indigo-50 border-2 border-indigo-200 rounded-xl p-6"><p className="text-indigo-900 font-semibold mb-2">✨ Flexible Matching</p><p className="text-sm text-indigo-700">You'll be matched with anyone looking to study!</p></div>}
                </div>
              )}

              {/* Step 4 */}
              {!showMap && step === 4 && (
                <div className="p-6 space-y-6">
                  {data.type === 'online' ? (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">💻</div>
                      <h3 className="text-xl font-bold mb-2">Online Session</h3>
                      {accessToken ? (
                        <div><p className="text-green-600 font-medium">✓ Signed in with Google</p><p className="text-gray-600 mt-2">A Google Meet link will be created when you finish</p></div>
                      ) : (
                        <div>
                          <p className="text-gray-600 mb-2">Connect Google to auto-generate a Meet link</p>
                          <p className="text-sm text-gray-400 mb-4">You can also skip this and share a link later</p>
                          <button onClick={signInWithGoogle} className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-300 rounded-xl font-medium hover:bg-gray-50 shadow-sm">
                            <svg width="20" height="20" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
                            Sign in with Google
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <>
                      <div>
                        <p className="text-gray-600 mb-4">Where do you want to study?</p>
                        <div className="grid grid-cols-2 gap-3">
                          {[{type:'spot',label:'Nearby Spots',icon:'🗺️'},{type:'building',label:'McGill Building',icon:'🏛️'}].map(({type,label,icon}) => (
                            <button key={type} onClick={() => { if (type==='spot') openNearbySpots(); else setData({...data, locType: type}); }}
                              className={`p-4 rounded-xl border-2 ${data.locType===type?'border-indigo-600 bg-indigo-50':'border-gray-200'}`}>
                              <div className="text-3xl mb-2">{icon}</div><div className="text-sm font-medium">{label}</div>
                            </button>
                          ))}
                        </div>
                      </div>
                      {data.locType === 'building' && (
                        <div className="space-y-3">
                          {ALL_BUILDINGS.map(b => (
                            <div key={b.id}>
                              <button onClick={() => setData({...data, location: b})} className={`w-full p-4 rounded-xl border-2 text-left ${data.location?.id===b.id?'border-indigo-600 bg-indigo-50':'border-gray-200'}`}>
                                <div className="font-semibold">{b.name}</div>
                                {b.booking && <div className="text-sm text-indigo-600 mt-1">✓ Room booking available</div>}
                              </button>
                              {data.location?.id === b.id && b.booking && (
                                <div className="mt-2 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-xl">
                                  <p className="text-sm text-yellow-900 font-medium mb-2">💡 Want to book a room?</p>
                                  <a href={b.url} target="_blank" rel="noopener noreferrer" className="inline-block px-4 py-2 bg-yellow-600 text-white text-sm font-medium rounded-lg hover:bg-yellow-700">Book Room at {b.name} →</a>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                      {data.location && data.locType === 'spot' && (
                        <div className="p-4 bg-indigo-50 border-2 border-indigo-200 rounded-xl">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-semibold text-indigo-900">✓ Selected: {data.location.name}</p>
                              <p className="text-sm text-indigo-700 mt-1">{data.location.address}</p>
                              <p className="text-sm text-indigo-600 mt-1">📍 {data.location.distance} km away</p>
                            </div>
                            <button onClick={openNearbySpots} className="px-3 py-1 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700">Change</button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

              {/* Map View */}
              {showMap && (
                <div className="flex h-[600px]">
                  <div className="flex-1 relative">
                    {mapLoaded ? <div ref={mapRef} className="w-full h-full" /> : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                        <div className="text-center"><div className="text-5xl mb-4">🗺️</div><p className="text-gray-600 font-medium">Map view unavailable</p><p className="text-sm text-gray-500 mt-1">Select a spot from the list →</p></div>
                      </div>
                    )}
                  </div>
                  <div className="w-96 bg-white border-l overflow-y-auto">
                    {selectedPlace ? (
                      <div className="p-6">
                        <button onClick={() => { setSelectedPlace(null); setShowHoursPanel(false); if (selectedMarkerRef.current) { selectedMarkerRef.current.setMap(null); selectedMarkerRef.current=null; } }}
                          className="text-indigo-600 hover:underline mb-4 flex items-center gap-1">← Back to list</button>
                        {selectedPlace.photos?.[0] && <img src={selectedPlace.photos[0].getUrl({maxWidth:400})} alt={selectedPlace.name} className="w-full h-48 object-cover rounded-xl mb-4"/>}
                        <h3 className="text-xl font-bold mb-2">{selectedPlace.name}</h3>
                        <div className="space-y-3 mb-4">
                          <div className="flex items-center gap-2"><span className="text-yellow-500">⭐</span><span className="font-medium">{selectedPlace.rating}</span>{selectedPlace.totalRatings>0&&<span className="text-sm text-gray-500">({selectedPlace.totalRatings} reviews)</span>}</div>
                          <div className="flex items-center gap-2"><span>📍</span><span className="text-sm">{selectedPlace.address}</span></div>
                          <div className="flex items-center gap-2"><span>🚶</span><span className="text-sm">{selectedPlace.distance} km away</span></div>
                          <div className="flex items-center gap-2"><span>💰</span><span className="text-sm">{'$'.repeat(selectedPlace.priceLevel||2)}</span></div>
                          <div className="flex items-center gap-2"><span>👥</span><BusyBadge busy={selectedPlace.busy}/></div>
                          {selectedPlace.openNow !== undefined && <div className="flex items-center gap-2"><span>🕐</span><span className={`text-sm font-medium ${selectedPlace.openNow?'text-green-600':'text-red-600'}`}>{selectedPlace.openNow?'Open now':'Closed'}</span></div>}
                        </div>

                        {/* Opening hours toggle */}
                        {selectedPlace.hours && selectedPlace.hours.length > 0 && (
                          <div className="mb-4">
                            {!showHoursPanel ? (
                              <button onClick={() => setShowHoursPanel(true)} className="text-sm text-indigo-600 hover:text-indigo-800 hover:underline flex items-center gap-1">
                                🕐 See opening hours ▾
                              </button>
                            ) : (
                              <div className="bg-gray-50 rounded-xl p-4">
                                <div className="flex justify-between items-center mb-2">
                                  <h4 className="font-semibold text-sm">Opening Hours</h4>
                                  <button onClick={() => setShowHoursPanel(false)} className="text-xs text-gray-500 hover:text-gray-700">Hide ▴</button>
                                </div>
                                <div className="text-sm space-y-1 text-gray-600">
                                  {selectedPlace.hours.map((h, i) => {
                                    const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
                                    const today = days[new Date().getDay()];
                                    const isToday = h.startsWith(today);
                                    return <div key={i} className={isToday?'font-semibold text-indigo-700':''}>{h}{isToday?' ← today':''}</div>;
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {selectedPlace.reviews?.length > 0 && (
                          <div className="mb-6">
                            <h4 className="font-semibold mb-3">Recent Reviews</h4>
                            <div className="space-y-3">{selectedPlace.reviews.map((r, i) => (
                              <div key={i} className="bg-gray-50 p-3 rounded-lg">
                                <div className="flex items-center gap-2 mb-1"><span className="text-yellow-500">⭐</span><span className="font-medium text-sm">{r.rating}/5</span></div>
                                <p className="text-sm text-gray-600 line-clamp-3">{r.text}</p>
                              </div>
                            ))}</div>
                          </div>
                        )}
                        <button onClick={() => selectPlaceFromMap(selectedPlace)} className="w-full px-4 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700">Select This Location</button>
                      </div>
                    ) : (
                      <div className="p-4">
                        <h3 className="font-bold text-lg mb-4">Nearby Study Spots</h3>
                        <p className="text-sm text-gray-500 mb-4">{mapLoaded?'Click a marker on the map or select from the list':'Select a spot from the list'}</p>
                        <div className="space-y-3">
                          {nearbyPlaces.length > 0 ? nearbyPlaces.map(p => (
                            <button key={p.id} onClick={() => { setSelectedPlace(p); setShowHoursPanel(false); placeSelectionPin(p); }}
                              className="w-full p-4 rounded-xl border-2 border-gray-200 text-left hover:border-indigo-600 hover:bg-indigo-50 transition-all">
                              <div className="flex justify-between items-start mb-2">
                                <div className="flex-1"><div className="font-semibold">{p.name}</div><div className="text-xs text-gray-500 mt-1">{p.address}</div></div>
                                <div className="text-sm flex items-center gap-1"><span className="text-yellow-500">⭐</span><span>{p.rating}</span></div>
                              </div>
                              <div className="flex items-center gap-3 text-xs">
                                <span className="text-gray-600">📍 {p.distance} km</span>
                                <span className={`px-2 py-1 rounded-md font-medium ${p.busy==='Quiet'?'bg-green-50 text-green-700':p.busy==='Moderate'?'bg-yellow-50 text-yellow-700':'bg-orange-50 text-orange-700'}`}>{p.busy}</span>
                              </div>
                            </button>
                          )) : (
                            <div className="text-center py-8 text-gray-500"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-3"></div><p>Loading nearby places...</p></div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 5 */}
              {!showMap && step === 5 && (
                <div className="p-6 space-y-3">
                  <p className="text-gray-600 mb-4">When do you want to study?</p>
                  {[{mode:'now',label:'Right Now',sub:'Start immediately',icon:'⚡'},{mode:'flexible',label:'Flexible',sub:'Any time this week',icon:'🕐'},{mode:'scheduled',label:'Schedule',sub:'Pick a date & time',icon:'📅'}].map(({mode,label,sub,icon}) => (
                    <div key={mode}>
                      <button onClick={() => setData({...data, timeMode: mode})} className={`w-full p-5 rounded-xl border-2 text-left ${data.timeMode===mode?'border-indigo-600 bg-indigo-50':'border-gray-200'}`}>
                        <div className="flex items-center gap-3"><div className="text-3xl">{icon}</div><div><div className="font-bold">{label}</div><div className="text-sm text-gray-500">{sub}</div></div></div>
                      </button>
                      {mode === 'scheduled' && data.timeMode === 'scheduled' && (
                        <div className="mt-2 p-5 bg-gray-50 rounded-xl space-y-4 border-2 border-gray-100">
                          <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-1">Date</label>
                            <input type="date" value={data.date} onChange={e => setData({...data, date: e.target.value})} className="w-full px-4 py-3 border-2 rounded-xl focus:border-indigo-600 outline-none" min={new Date().toISOString().split('T')[0]}/>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-semibold text-gray-500 mb-1">Start time</label>
                              <input type="time" value={data.start} onChange={e => setData({...data, start: e.target.value})} className="w-full px-4 py-3 border-2 rounded-xl focus:border-indigo-600 outline-none"/>
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-gray-500 mb-1">End time</label>
                              <input type="time" value={data.end} onChange={e => setData({...data, end: e.target.value})} className="w-full px-4 py-3 border-2 rounded-xl focus:border-indigo-600 outline-none"/>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Step 6 */}
              {!showMap && step === 6 && (
                <div className="p-6 space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Maximum Group Size</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        min="2"
                        max="50"
                        value={data.maxMembers}
                        onChange={e => {
                          const v = parseInt(e.target.value);
                          if (!isNaN(v) && v >= 1 && v <= 50) setData({...data, maxMembers: v});
                          else if (e.target.value === '') setData({...data, maxMembers: ''});
                        }}
                        onBlur={e => {
                          const v = parseInt(e.target.value);
                          if (isNaN(v) || v < 2) setData({...data, maxMembers: 2});
                          else if (v > 50) setData({...data, maxMembers: 50});
                        }}
                        placeholder="e.g. 5"
                        className="w-32 px-4 py-3 border-2 rounded-xl text-center text-lg font-bold focus:border-indigo-600 outline-none"
                      />
                      <span className="text-sm text-gray-500">people (2–50)</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Gender Preference (Optional)</label>
                    <div className="grid grid-cols-4 gap-3">
                      {[{val:'any',label:'Any',icon:'👥'},{val:'male',label:'Male',icon:'👨'},{val:'female',label:'Female',icon:'👩'},{val:'non-binary',label:'Non-binary',icon:'🧑'}].map(({val,label,icon}) => (
                        <button key={val} onClick={() => setData({...data, genderPref: val})} className={`p-4 rounded-xl border-2 ${data.genderPref===val?'border-indigo-600 bg-indigo-50':'border-gray-200'}`}>
                          <div className="text-2xl mb-1">{icon}</div><div className="text-xs font-medium">{label}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border-2 border-indigo-100">
                    <h4 className="font-bold mb-4">📋 Session Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div><span className="text-gray-600">Type:</span> <span className="font-medium capitalize">{data.type?.replace('-',' ')}</span></div>
                      <div><span className="text-gray-600">Visibility:</span> <span className="font-medium capitalize">{data.visibility}</span></div>
                      <div><span className="text-gray-600">Courses:</span> <span className="font-medium">{data.courseMode==='flex'?'Flexible':data.courses.map(c=>c.code).join(', ')}</span></div>
                      {data.location && <div><span className="text-gray-600">Location:</span> <span className="font-medium">{data.location.name}</span></div>}
                      {data.type==='online' && !accessToken && <div><span className="text-gray-600">Note:</span> <span className="font-medium text-amber-600">No Google Meet — share a link manually</span></div>}
                      {data.type==='online' && accessToken && <div><span className="text-gray-600">Meet:</span> <span className="font-medium text-green-600">Auto-generated Google Meet link</span></div>}
                      <div><span className="text-gray-600">When:</span> <span className="font-medium capitalize">{data.timeMode}</span></div>
                      <div><span className="text-gray-600">Max Size:</span> <span className="font-medium">{data.maxMembers} people</span></div>
                      <div><span className="text-gray-600">Gender:</span> <span className="font-medium capitalize">{data.genderPref}</span></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            {!showMap && (
              <div className="p-6 border-t bg-gray-50 flex justify-between shrink-0">
                <button onClick={step===1?reset:()=>setStep(step-1)} className="px-5 py-2 text-gray-700 font-medium rounded-lg hover:bg-gray-200">{step===1?'Cancel':'← Back'}</button>
                {step < 6 ? (
                  <button onClick={() => setStep(step+1)} disabled={!canNext()} className={`px-6 py-2 rounded-lg font-medium ${canNext()?'bg-indigo-600 text-white hover:bg-indigo-700':'bg-gray-200 text-gray-400'}`}>Next →</button>
                ) : (
                  <button onClick={createSession} className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700">✓ Create Session</button>
                )}
              </div>
            )}
            {showMap && (
              <div className="p-6 border-t bg-gray-50 flex justify-between shrink-0">
                <button onClick={() => { setShowMap(false); setSelectedPlace(null); setShowHoursPanel(false); if(selectedMarkerRef.current){selectedMarkerRef.current.setMap(null);selectedMarkerRef.current=null;} }} className="px-5 py-2 text-gray-700 font-medium rounded-lg hover:bg-gray-200">← Back</button>
                {selectedPlace && <button onClick={() => selectPlaceFromMap(selectedPlace)} className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700">Select Location</button>}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Location permission popup */}
      {showLocationPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60]">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center shadow-2xl">
            <div className="text-5xl mb-4">📍</div>
            <h3 className="text-lg font-bold mb-2">Location Access Required</h3>
            <p className="text-gray-600 text-sm mb-2">
              To find nearby study spots, StudyBuddy needs access to your location.
            </p>
            <p className="text-gray-500 text-xs mb-6">
              Please enable location access in your browser settings and try again.
            </p>
            <div className="space-y-2">
              <button
                onClick={async () => {
                  const granted = await requestLocation();
                  if (granted) { setShowLocationPopup(false); setShowMap(true); }
                }}
                className="w-full px-4 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700"
              >
                Try Again
              </button>
              <button
                onClick={() => setShowLocationPopup(false)}
                className="w-full px-4 py-3 text-gray-600 font-medium hover:bg-gray-100 rounded-xl"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}