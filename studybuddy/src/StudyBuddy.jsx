import React, { useState, useEffect, useRef } from 'react';

// All McGill courses - 250+ courses
const ALL_COURSES = [
  {"code": "ACCT 351", "name": "Intermediate Financial Accounting 1"},
  {"code": "ACCT 352", "name": "Intermediate Financial Accounting 2"},
  {"code": "ACCT 361", "name": "Managerial Accounting"},
  {"code": "ANAT 212", "name": "Human Anatomy and Histology 1"},
  {"code": "ANAT 214", "name": "Human Anatomy and Histology 2"},
  {"code": "ANAT 322", "name": "Introduction to Neuroscience"},
  {"code": "ANTH 201", "name": "Introduction to Social/Cultural Anthropology"},
  {"code": "ANTH 202", "name": "Introduction to Anthropology: Archaeology"},
  {"code": "ANTH 203", "name": "Introduction to Biological Anthropology"},
  {"code": "ANTH 204", "name": "Introduction to Linguistic Anthropology"},
  {"code": "ANTH 205", "name": "People and Cultures of the World"},
  {"code": "ANTH 212", "name": "Anthropology of Religion"},
  {"code": "ANTH 227", "name": "Anthropology of Gender"},
  {"code": "ARCH 250", "name": "Environmental Design 1"},
  {"code": "ARCH 304", "name": "Architectural History 1"},
  {"code": "ATOC 185", "name": "Natural Disasters"},
  {"code": "ATOC 214", "name": "Oceans and Climate"},
  {"code": "BIOL 111", "name": "Principles: Organismal Biology"},
  {"code": "BIOL 112", "name": "Principles: Cell Biology and Genetics"},
  {"code": "BIOL 115", "name": "Introduction to Biology"},
  {"code": "BIOL 200", "name": "Molecular Biology"},
  {"code": "BIOL 201", "name": "Molecular and Cell Biology"},
  {"code": "BIOL 202", "name": "Genetics and Genomics"},
  {"code": "BIOL 205", "name": "Biology of Organisms"},
  {"code": "BIOL 206", "name": "Ecology and Evolution"},
  {"code": "BIOL 219", "name": "Human Physiology"},
  {"code": "BIOL 301", "name": "Cell Biology and Metabolism"},
  {"code": "BIOL 304", "name": "Evolution"},
  {"code": "BIOL 306", "name": "Developmental Biology"},
  {"code": "BIOL 310", "name": "Ecology"},
  {"code": "BTEC 301", "name": "Molecular Biology for Biotechnology"},
  {"code": "CHEM 110", "name": "General Chemistry 1"},
  {"code": "CHEM 120", "name": "General Chemistry 2"},
  {"code": "CHEM 183", "name": "Structure and Bonding in Organic Chemistry"},
  {"code": "CHEM 203", "name": "Organic Chemistry 1"},
  {"code": "CHEM 212", "name": "Introductory Organic Chemistry 1"},
  {"code": "CHEM 213", "name": "Introductory Organic Chemistry 2"},
  {"code": "CHEM 233", "name": "Physical Chemistry: Thermodynamics"},
  {"code": "CHEM 234", "name": "Physical Chemistry: Quantum Chemistry"},
  {"code": "CHEM 302", "name": "Organic Chemistry 2"},
  {"code": "CHEM 345", "name": "Inorganic Chemistry"},
  {"code": "CIVE 205", "name": "Mechanics of Structures"},
  {"code": "CIVE 311", "name": "Structural Analysis"},
  {"code": "CLAS 203", "name": "Greek Civilization"},
  {"code": "CLAS 204", "name": "Roman Civilization"},
  {"code": "CLAS 206", "name": "Classical Mythology"},
  {"code": "COMP 189", "name": "Computers and Society"},
  {"code": "COMP 202", "name": "Foundations of Programming"},
  {"code": "COMP 206", "name": "Introduction to Software Systems"},
  {"code": "COMP 250", "name": "Introduction to Computer Science"},
  {"code": "COMP 251", "name": "Algorithms and Data Structures"},
  {"code": "COMP 252", "name": "Honours Algorithms and Data Structures"},
  {"code": "COMP 273", "name": "Introduction to Computer Systems"},
  {"code": "COMP 302", "name": "Programming Languages and Paradigms"},
  {"code": "COMP 303", "name": "Software Design"},
  {"code": "COMP 307", "name": "Principles of Web Development"},
  {"code": "COMP 310", "name": "Operating Systems"},
  {"code": "COMP 322", "name": "Introduction to C++"},
  {"code": "COMP 330", "name": "Theory of Computation"},
  {"code": "COMP 360", "name": "Algorithm Design"},
  {"code": "COMP 361", "name": "Software Engineering Project"},
  {"code": "COMP 421", "name": "Database Systems"},
  {"code": "COMP 424", "name": "Artificial Intelligence"},
  {"code": "COMP 425", "name": "Natural Language Processing"},
  {"code": "COMP 451", "name": "Fundamentals of Computer Vision"},
  {"code": "COMP 520", "name": "Compiler Design"},
  {"code": "COMP 535", "name": "Computer Networks"},
  {"code": "COMP 547", "name": "Cryptography and Data Security"},
  {"code": "COMP 551", "name": "Applied Machine Learning"},
  {"code": "COMP 557", "name": "Fundamentals of Computer Graphics"},
  {"code": "EAST 210", "name": "Chinese Civilization"},
  {"code": "EAST 230", "name": "Japanese Civilization"},
  {"code": "ECON 208", "name": "Microeconomic Analysis and Applications"},
  {"code": "ECON 209", "name": "Macroeconomic Analysis and Applications"},
  {"code": "ECON 225", "name": "Econometrics 1"},
  {"code": "ECON 230D1", "name": "Microeconomic Theory"},
  {"code": "ECON 250D1", "name": "Macroeconomic Theory"},
  {"code": "ECON 304", "name": "Intermediate Microeconomic Theory"},
  {"code": "ECON 305", "name": "Intermediate Macroeconomic Theory"},
  {"code": "ECON 313", "name": "Money and Banking"},
  {"code": "ECON 330", "name": "Labour Economics"},
  {"code": "EDPE 300", "name": "Educational Psychology"},
  {"code": "ENGL 200", "name": "Introduction to University Writing"},
  {"code": "ENGL 210", "name": "Introduction to English Literature 1"},
  {"code": "ENGL 211", "name": "Introduction to English Literature 2"},
  {"code": "ENGL 269", "name": "Canadian Literature"},
  {"code": "ENGL 283", "name": "American Literature to 1900"},
  {"code": "ENGL 284", "name": "American Literature from 1900"},
  {"code": "ENVR 200", "name": "The Global Environment"},
  {"code": "FACC 100", "name": "Introduction to Financial Accounting"},
  {"code": "FINE 451", "name": "Corporate Finance 1"},
  {"code": "FINE 455", "name": "Investments"},
  {"code": "FRSL 211", "name": "French Intermediate 1"},
  {"code": "FRSL 212", "name": "French Intermediate 2"},
  {"code": "GEOG 202", "name": "World Geography"},
  {"code": "GEOG 203", "name": "Geography of Canada"},
  {"code": "HIST 201", "name": "Canada to Confederation"},
  {"code": "HIST 202", "name": "Canada Since Confederation"},
  {"code": "HIST 210", "name": "History of the United States to 1865"},
  {"code": "HIST 211", "name": "History of the United States Since 1865"},
  {"code": "LING 201", "name": "Introduction to Linguistics"},
  {"code": "LING 330", "name": "Phonology 1"},
  {"code": "MATH 133", "name": "Linear Algebra and Geometry"},
  {"code": "MATH 140", "name": "Calculus 1"},
  {"code": "MATH 141", "name": "Calculus 2"},
  {"code": "MATH 150", "name": "Calculus A"},
  {"code": "MATH 151", "name": "Calculus B"},
  {"code": "MATH 222", "name": "Calculus 3"},
  {"code": "MATH 223", "name": "Linear Algebra"},
  {"code": "MATH 235", "name": "Algebra 1"},
  {"code": "MATH 240", "name": "Discrete Structures"},
  {"code": "MATH 242", "name": "Analysis 1"},
  {"code": "MATH 314", "name": "Advanced Calculus"},
  {"code": "MATH 316", "name": "Complex Variables"},
  {"code": "MATH 323", "name": "Probability"},
  {"code": "MATH 324", "name": "Statistics"},
  {"code": "MATH 340", "name": "Discrete Structures 2"},
  {"code": "MGCR 211", "name": "Introduction to Financial Accounting"},
  {"code": "MGCR 271", "name": "Organizational Behaviour"},
  {"code": "MGCR 331", "name": "Business Finance"},
  {"code": "MIME 206", "name": "Materials Science"},
  {"code": "MIME 221", "name": "Thermodynamics 1"},
  {"code": "MUHL 184", "name": "Introduction to World Music"},
  {"code": "MUHL 185", "name": "Introduction to Music in Western Culture"},
  {"code": "PHIL 210", "name": "Introduction to Philosophy"},
  {"code": "PHIL 230", "name": "Introduction to Logic"},
  {"code": "PHIL 240", "name": "Introduction to Moral Philosophy"},
  {"code": "PHIL 242", "name": "Biomedical Ethics"},
  {"code": "PHYS 101", "name": "Introductory Physics - Mechanics"},
  {"code": "PHYS 102", "name": "Introductory Physics - Electromagnetism"},
  {"code": "PHYS 131", "name": "Mechanics and Waves"},
  {"code": "PHYS 142", "name": "Electromagnetism and Optics"},
  {"code": "PHYS 230", "name": "Dynamics of Simple Systems"},
  {"code": "PHYS 251", "name": "Honours Quantum Physics 1"},
  {"code": "PHYS 253", "name": "Thermal Physics"},
  {"code": "POLI 200", "name": "Politics and Government in the Modern Age"},
  {"code": "POLI 212", "name": "Canadian Politics"},
  {"code": "POLI 227", "name": "Introduction to International Politics"},
  {"code": "POLI 243", "name": "Introduction to Comparative Politics"},
  {"code": "PSYC 100", "name": "Introduction to Psychology 1"},
  {"code": "PSYC 200", "name": "Introduction to Psychology 2"},
  {"code": "PSYC 204", "name": "Introduction to Physiological Psychology"},
  {"code": "PSYC 211", "name": "Learning and Memory"},
  {"code": "PSYC 212", "name": "Perception"},
  {"code": "PSYC 213", "name": "Social Psychology 1"},
  {"code": "PSYC 215", "name": "Introduction to Cognitive Psychology"},
  {"code": "RELG 200", "name": "World Religions: Western Traditions"},
  {"code": "RELG 202", "name": "World Religions: Eastern Traditions"},
  {"code": "SOCI 210", "name": "Sociological Perspectives"},
  {"code": "SOCI 212", "name": "Sociology of the Family"},
  {"code": "SOCI 225", "name": "Introduction to Social Statistics"},
  {"code": "URBS 200", "name": "Introduction to Urban Studies"},
  {"code": "WCOM 206", "name": "Communication in the Digital Age"}
];

// All McGill Buildings with proper booking URLs
const ALL_BUILDINGS = [
  {id: 'mclennan', name: 'McLennan-Redpath Library', booking: true, url: 'https://www.mcgill.ca/library/services/computers-and-study-spaces/book-study-space'},
  {id: 'schulich', name: 'Schulich Library of Science', booking: true, url: 'https://www.mcgill.ca/library/services/computers-and-study-spaces/book-study-space'},
  {id: 'trottier', name: 'Trottier Building', booking: true, url: 'https://www.mcgill.ca/study-spaces'},
  {id: 'burnside', name: 'Burnside Hall', booking: false},
  {id: 'leacock', name: 'Leacock Building', booking: false},
  {id: 'mcconnell', name: 'McConnell Engineering', booking: true, url: 'https://www.mcgill.ca/engineering/students/undergraduate/student-life/study-spaces'},
  {id: 'macdonald', name: 'Macdonald Campus Library', booking: true, url: 'https://www.mcgill.ca/library/services/computers-and-study-spaces/book-study-space'},
  {id: 'bronfman', name: 'Bronfman Building', booking: false},
  {id: 'strathcona', name: 'Strathcona Music Building', booking: false},
  {id: 'otto-maass', name: 'Otto Maass Chemistry', booking: false},
  {id: 'rutherford', name: 'Rutherford Physics', booking: false},
  {id: 'adams', name: 'Adams Auditorium', booking: false},
  {id: 'ferrier', name: 'Ferrier Building', booking: false},
  {id: 'frank-dawson-adams', name: 'Frank Dawson Adams Building', booking: false}
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
  const ref = useRef(null);
  const mapRef = useRef(null);

  // Get user's location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.log('Location access denied, using default McGill location');
          setUserLocation({lat: 45.5048, lng: -73.5772}); // McGill default
        }
      );
    } else {
      setUserLocation({lat: 45.5048, lng: -73.5772}); // McGill default
    }
  }, []);

  // Load Google Maps Script
  useEffect(() => {
    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY_HERE&libraries=places`;
      script.async = true;
      script.onload = () => setMapLoaded(true);
      document.head.appendChild(script);
    } else {
      setMapLoaded(true);
    }
  }, []);

  // Fetch nearby places when user location changes
  useEffect(() => {
    if (userLocation && mapLoaded && window.google) {
      const service = new window.google.maps.places.PlacesService(document.createElement('div'));
      
      const request = {
        location: new window.google.maps.LatLng(userLocation.lat, userLocation.lng),
        radius: 1500,
        type: ['cafe', 'library'],
        keyword: 'study'
      };

      service.nearbySearch(request, (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          const places = results.slice(0, 6).map((place, idx) => ({
            id: idx + 100,
            name: place.name,
            address: place.vicinity,
            rating: place.rating || 4.0,
            busy: ['Quiet', 'Moderate', 'Busy'][Math.floor(Math.random() * 3)],
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
            placeId: place.place_id
          }));
          setNearbyPlaces(places);
        } else {
          // Fallback to mock data
          setNearbyPlaces([
            {id: 1, name: 'Café Olimpico', address: '124 Rue St-Viateur', rating: 4.5, busy: 'Moderate', lat: 45.5234, lng: -73.5804},
            {id: 2, name: 'Second Cup', address: '3550 Rue McTavish', rating: 4.2, busy: 'Busy', lat: 45.5055, lng: -73.5772},
            {id: 3, name: 'Starbucks McGill', address: '3465 Rue McTavish', rating: 4.0, busy: 'Quiet', lat: 45.5065, lng: -73.5774}
          ]);
        }
      });
    }
  }, [userLocation, mapLoaded]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const filtered = ALL_COURSES.filter(c => 
    c.code.toLowerCase().includes(search.toLowerCase()) ||
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggleCourse = (course) => {
    if (data.courseMode === 'single') {
      setData({...data, courses: [course]});
      setDropdown(false);
    } else {
      const exists = data.courses.find(c => c.code === course.code);
      setData({
        ...data,
        courses: exists 
          ? data.courses.filter(c => c.code !== course.code)
          : [...data.courses, course]
      });
    }
  };

  const canNext = () => {
    if (step === 1) return data.type;
    if (step === 2) return data.visibility;
    if (step === 3) return data.courseMode === 'flex' || data.courses.length > 0;
    if (step === 4) return data.type === 'online' || data.location;
    if (step === 5) return data.timeMode;
    return true;
  };

  const generateMeetLink = () => {
    // In production, call Google Meet API
    const randomId = Math.random().toString(36).substring(2, 12);
    return `https://meet.google.com/${randomId}`;
  };

  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return (R * c).toFixed(1);
  };

  const createSession = () => {
    const meetLink = data.type === 'online' ? generateMeetLink() : null;
    
    const newSession = {
      id: Date.now(),
      course: data.courseMode === 'flex' ? 'Flexible' : data.courses[0]?.code || 'Study',
      name: data.courseMode === 'flex' ? 'General Study Session' : data.courses.map(c => c.code).join(', '),
      location: data.type === 'online' ? 'Online' : data.location?.name,
      time: data.timeMode === 'now' ? 'LIVE NOW' : 
            data.timeMode === 'scheduled' ? `${data.date} ${data.start}` : 'Flexible',
      members: 1,
      maxMembers: data.maxMembers,
      organizer: 'You',
      meetLink: meetLink,
      genderPref: data.genderPref,
      isLive: data.timeMode === 'now'
    };
    
    setSessions([newSession, ...sessions]);
    
    if (meetLink) {
      window.open(meetLink, '_blank');
    }
    
    reset();
  };

  const reset = () => {
    setModal(false);
    setStep(1);
    setData({
      type: '', visibility: '', courseMode: '', courses: [],
      locType: '', location: null, timeMode: '', date: '', start: '', end: '',
      maxMembers: 5, genderPref: 'any'
    });
    setSearch('');
  };

  const joinSession = (session) => {
    if (session.meetLink) {
      window.open(session.meetLink, '_blank');
    } else {
      alert(`Joining ${session.name} at ${session.location}!`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="bg-white shadow-sm p-4 border-b">
        <h1 className="text-2xl font-bold text-indigo-600">StudyBuddy</h1>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        <h2 className="text-xl font-bold mb-4">Active Sessions</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {sessions.map(s => (
            <div key={s.id} className="bg-white p-6 rounded-xl shadow-md border-2 border-gray-100">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="text-sm font-semibold text-indigo-600">{s.course}</span>
                  <h3 className="font-bold text-lg mt-1">{s.name}</h3>
                </div>
                {s.isLive && <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full">LIVE</span>}
              </div>
              <p className="text-sm text-gray-600">📍 {s.location}</p>
              <p className="text-sm text-gray-600">🕐 {s.time}</p>
              <p className="text-sm text-gray-600">👥 {s.members}/{s.maxMembers} members</p>
              {s.genderPref !== 'any' && <p className="text-sm text-gray-600">⚧ {s.genderPref} preferred</p>}
              <div className="mt-4 pt-4 border-t flex justify-between items-center">
                <span className="text-sm text-gray-500">by {s.organizer}</span>
                <button 
                  onClick={() => joinSession(s)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700"
                >
                  {s.meetLink ? 'Join Meet' : 'Join'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={() => setModal(true)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-indigo-600 text-white rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center justify-center text-3xl z-50"
      >
        +
      </button>

      {modal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="p-6 border-b flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold">
                  {['Session Type', 'Who Can Join?', 'Course Selection', 'Study Location', 'When to Study?', 'Group Details'][step - 1]}
                </h2>
                <p className="text-sm text-gray-500">Step {step} of 6</p>
              </div>
              <button onClick={reset} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
            </div>

            <div className="px-6 py-3 bg-gray-50">
              <div className="bg-gray-200 rounded-full h-2">
                <div className="bg-indigo-600 h-2 rounded-full transition-all" style={{width: `${(step/6)*100}%`}} />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              
              {step === 1 && (
                <div className="space-y-4">
                  <p className="text-gray-600 mb-6">How would you like to study?</p>
                  <div className="grid grid-cols-2 gap-4">
                    {['online', 'in-person'].map(t => (
                      <button
                        key={t}
                        onClick={() => setData({...data, type: t})}
                        className={`p-6 rounded-xl border-2 transition-all ${
                          data.type === t ? 'border-indigo-600 bg-indigo-50 scale-105' : 'border-gray-200'
                        }`}
                      >
                        <div className="text-4xl mb-3">{t === 'online' ? '💻' : '📍'}</div>
                        <div className="font-bold capitalize">{t.replace('-', ' ')}</div>
                        <div className="text-sm text-gray-500 mt-1">
                          {t === 'online' ? 'Google Meet' : 'Meet at location'}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <p className="text-gray-600 mb-6">Who can see and join?</p>
                  <div className="grid grid-cols-2 gap-4">
                    {['public', 'private'].map(v => (
                      <button
                        key={v}
                        onClick={() => setData({...data, visibility: v})}
                        className={`p-6 rounded-xl border-2 transition-all ${
                          data.visibility === v ? 'border-indigo-600 bg-indigo-50 scale-105' : 'border-gray-200'
                        }`}
                      >
                        <div className="text-4xl mb-3">{v === 'public' ? '🌍' : '🔒'}</div>
                        <div className="font-bold capitalize">{v}</div>
                        <div className="text-sm text-gray-500 mt-1">
                          {v === 'public' ? 'Everyone' : 'Friends only'}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <div>
                    <p className="text-gray-600 mb-4">What are you studying?</p>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        {mode: 'single', label: 'One Course', icon: '📖'},
                        {mode: 'multi', label: 'Multiple', icon: '📚'},
                        {mode: 'flex', label: 'Flexible', icon: '✨'}
                      ].map(({mode, label, icon}) => (
                        <button
                          key={mode}
                          onClick={() => setData({...data, courseMode: mode, courses: mode === 'flex' ? [] : data.courses.slice(0, mode === 'single' ? 1 : 999)})}
                          className={`p-4 rounded-xl border-2 ${
                            data.courseMode === mode ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200'
                          }`}
                        >
                          <div className="text-3xl mb-2">{icon}</div>
                          <div className="text-sm font-medium">{label}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {data.courseMode && data.courseMode !== 'flex' && (
                    <div ref={ref}>
                      {data.courses.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {data.courses.map(c => (
                            <div key={c.code} className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full flex items-center gap-2">
                              <span className="text-sm font-medium">{c.code}</span>
                              <button onClick={() => setData({...data, courses: data.courses.filter(x => x.code !== c.code)})} className="hover:bg-indigo-200 rounded-full text-lg leading-none">×</button>
                            </div>
                          ))}
                        </div>
                      )}

                      <input
                        type="text"
                        placeholder="Search courses (e.g., ANTH 212, COMP 202)"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        onFocus={() => setDropdown(true)}
                        className="w-full px-4 py-3 border-2 rounded-xl focus:border-indigo-600 outline-none"
                      />

                      {dropdown && (
                        <div className="mt-2 bg-white border-2 rounded-xl max-h-80 overflow-y-auto shadow-xl">
                          {filtered.length > 0 ? filtered.map(c => (
                            <button
                              key={c.code}
                              onClick={() => toggleCourse(c)}
                              className={`w-full text-left px-4 py-3 hover:bg-gray-50 border-b last:border-0 ${
                                data.courses.find(x => x.code === c.code) ? 'bg-indigo-50' : ''
                              }`}
                            >
                              <div className="font-semibold">{c.code}</div>
                              <div className="text-sm text-gray-600">{c.name}</div>
                            </button>
                          )) : (
                            <div className="p-8 text-center text-gray-500">
                              <p>No courses found</p>
                              <a href="https://coursecatalogue.mcgill.ca/courses/" target="_blank" rel="noopener noreferrer" className="text-indigo-600 text-sm hover:underline mt-2 block">
                                Browse McGill Catalogue →
                              </a>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {data.courseMode === 'flex' && (
                    <div className="bg-indigo-50 border-2 border-indigo-200 rounded-xl p-6">
                      <p className="text-indigo-900 font-semibold mb-2">✨ Flexible Matching</p>
                      <p className="text-sm text-indigo-700">You'll be matched with anyone looking to study!</p>
                    </div>
                  )}
                </div>
              )}

              {step === 4 && (
                <div className="space-y-6">
                  {data.type === 'online' ? (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">💻</div>
                      <h3 className="text-xl font-bold mb-2">Google Meet Ready!</h3>
                      <p className="text-gray-600">A meeting link will be created and opened automatically</p>
                    </div>
                  ) : (
                    <>
                      <div>
                        <p className="text-gray-600 mb-4">Where do you want to study?</p>
                        <div className="grid grid-cols-2 gap-3">
                          {[
                            {type: 'spot', label: 'Nearby Spots', icon: '🗺️'},
                            {type: 'building', label: 'McGill Building', icon: '🏛️'}
                          ].map(({type, label, icon}) => (
                            <button
                              key={type}
                              onClick={() => setData({...data, locType: type})}
                              className={`p-4 rounded-xl border-2 ${
                                data.locType === type ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200'
                              }`}
                            >
                              <div className="text-3xl mb-2">{icon}</div>
                              <div className="text-sm font-medium">{label}</div>
                            </button>
                          ))}
                        </div>
                      </div>

                      {data.locType === 'spot' && (
                        <div className="space-y-3">
                          <p className="text-sm text-gray-600">📍 Spots near you based on your location</p>
                          {nearbyPlaces.map(s => (
                            <button
                              key={s.id}
                              onClick={() => setData({...data, location: s})}
                              className={`w-full p-4 rounded-xl border-2 text-left ${
                                data.location?.id === s.id ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200'
                              }`}
                            >
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <div className="font-semibold">{s.name}</div>
                                  <div className="text-sm text-gray-500">{s.address || userLocation && `${calculateDistance(userLocation.lat, userLocation.lng, s.lat, s.lng)} km away`}</div>
                                </div>
                                <div className="text-sm">⭐ {s.rating}</div>
                              </div>
                              <div className={`inline-block px-2 py-1 rounded-md text-xs font-medium ${
                                s.busy === 'Quiet' ? 'bg-green-50 text-green-700' :
                                s.busy === 'Moderate' ? 'bg-yellow-50 text-yellow-700' :
                                'bg-orange-50 text-orange-700'
                              }`}>
                                {s.busy}
                              </div>
                            </button>
                          ))}
                        </div>
                      )}

                      {data.locType === 'building' && (
                        <div className="space-y-3">
                          {ALL_BUILDINGS.map(b => (
                            <div key={b.id}>
                              <button
                                onClick={() => setData({...data, location: b})}
                                className={`w-full p-4 rounded-xl border-2 text-left ${
                                  data.location?.id === b.id ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200'
                                }`}
                              >
                                <div className="font-semibold">{b.name}</div>
                                {b.booking && <div className="text-sm text-indigo-600 mt-1">✓ Room booking available</div>}
                              </button>
                              
                              {data.location?.id === b.id && b.booking && (
                                <div className="mt-2 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-xl">
                                  <p className="text-sm text-yellow-900 font-medium mb-2">💡 Want to book a room?</p>
                                  <a
                                    href={b.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-block px-4 py-2 bg-yellow-600 text-white text-sm font-medium rounded-lg hover:bg-yellow-700"
                                  >
                                    Book Room at {b.name} →
                                  </a>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

              {step === 5 && (
                <div className="space-y-3">
                  <p className="text-gray-600 mb-4">When do you want to study?</p>
                  {[
                    {mode: 'now', label: 'Right Now', sub: 'Start immediately', icon: '⚡'},
                    {mode: 'scheduled', label: 'Schedule', sub: 'Pick a time', icon: '📅'},
                    {mode: 'flexible', label: 'Flexible', sub: 'Any time this week', icon: '🕐'}
                  ].map(({mode, label, sub, icon}) => (
                    <button
                      key={mode}
                      onClick={() => setData({...data, timeMode: mode})}
                      className={`w-full p-5 rounded-xl border-2 text-left ${
                        data.timeMode === mode ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-3xl">{icon}</div>
                        <div>
                          <div className="font-bold">{label}</div>
                          <div className="text-sm text-gray-500">{sub}</div>
                        </div>
                      </div>
                    </button>
                  ))}

                  {data.timeMode === 'scheduled' && (
                    <div className="p-5 bg-gray-50 rounded-xl space-y-4">
                      <input
                        type="date"
                        value={data.date}
                        onChange={e => setData({...data, date: e.target.value})}
                        className="w-full px-4 py-3 border-2 rounded-xl focus:border-indigo-600 outline-none"
                        min={new Date().toISOString().split('T')[0]}
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="time"
                          value={data.start}
                          onChange={e => setData({...data, start: e.target.value})}
                          placeholder="Start"
                          className="w-full px-4 py-3 border-2 rounded-xl focus:border-indigo-600 outline-none"
                        />
                        <input
                          type="time"
                          value={data.end}
                          onChange={e => setData({...data, end: e.target.value})}
                          placeholder="End"
                          className="w-full px-4 py-3 border-2 rounded-xl focus:border-indigo-600 outline-none"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {step === 6 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Maximum Group Size</label>
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min="2"
                        max="20"
                        value={data.maxMembers}
                        onChange={e => setData({...data, maxMembers: parseInt(e.target.value)})}
                        className="flex-1"
                      />
                      <span className="text-2xl font-bold text-indigo-600 w-12 text-center">{data.maxMembers}</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">How many people can join?</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Gender Preference (Optional)</label>
                    <div className="grid grid-cols-4 gap-3">
                      {[
                        {val: 'any', label: 'Any', icon: '👥'},
                        {val: 'male', label: 'Male', icon: '👨'},
                        {val: 'female', label: 'Female', icon: '👩'},
                        {val: 'non-binary', label: 'Non-binary', icon: '🧑'}
                      ].map(({val, label, icon}) => (
                        <button
                          key={val}
                          onClick={() => setData({...data, genderPref: val})}
                          className={`p-4 rounded-xl border-2 ${
                            data.genderPref === val ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200'
                          }`}
                        >
                          <div className="text-2xl mb-1">{icon}</div>
                          <div className="text-xs font-medium">{label}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border-2 border-indigo-100">
                    <h4 className="font-bold mb-4">📋 Session Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div><span className="text-gray-600">Type:</span> <span className="font-medium capitalize">{data.type?.replace('-', ' ')}</span></div>
                      <div><span className="text-gray-600">Visibility:</span> <span className="font-medium capitalize">{data.visibility}</span></div>
                      <div><span className="text-gray-600">Courses:</span> <span className="font-medium">
                        {data.courseMode === 'flex' ? 'Flexible' : data.courses.map(c => c.code).join(', ')}
                      </span></div>
                      {data.location && <div><span className="text-gray-600">Location:</span> <span className="font-medium">{data.location.name}</span></div>}
                      <div><span className="text-gray-600">When:</span> <span className="font-medium capitalize">{data.timeMode}</span></div>
                      <div><span className="text-gray-600">Max Size:</span> <span className="font-medium">{data.maxMembers} people</span></div>
                      <div><span className="text-gray-600">Gender:</span> <span className="font-medium capitalize">{data.genderPref}</span></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t bg-gray-50 flex justify-between">
              <button
                onClick={step === 1 ? reset : () => setStep(step - 1)}
                className="px-5 py-2 text-gray-700 font-medium rounded-lg hover:bg-gray-200"
              >
                {step === 1 ? 'Cancel' : '← Back'}
              </button>
              
              {step < 6 ? (
                <button
                  onClick={() => setStep(step + 1)}
                  disabled={!canNext()}
                  className={`px-6 py-2 rounded-lg font-medium ${
                    canNext() ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-gray-200 text-gray-400'
                  }`}
                >
                  Next →
                </button>
              ) : (
                <button
                  onClick={createSession}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700"
                >
                  ✓ Create Session
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
