import React, { useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Users, Target, Wifi, WifiOff, RefreshCw, ArrowLeft, Crown, Medal, Award, Gamepad2, Clock, Handshake, ChevronUp, ChevronDown, Instagram, Mail, Phone, MapPin, Send, Camera, Play, Star, User, Calendar } from 'lucide-react';
import zGameLogo from '../assets/Z Games logo with illustration.png';

const galleryImages = [
  { id: 1, src: '/images/AKZ02225.jpg', alt: 'Tournament Action 1', category: 'tournament' },
  { id: 2, src: '/images/AKZ02230.jpg', alt: 'Team Building Event', category: 'events' },
  { id: 3, src: '/images/AKZ02237.jpg', alt: 'Gaming Setup', category: 'setup' },
  { id: 4, src: '/images/AKZ02240.jpg', alt: 'Winners Celebration', category: 'tournament' },
  { id: 5, src: '/images/AKZ02242.jpg', alt: 'Community Gathering', category: 'events' },
  { id: 6, src: '/images/AKZ02246.jpg', alt: 'Game Masters in Action', category: 'team' },
  { id: 7, src: '/images/AKZ02249.jpg', alt: 'Championship Trophy', category: 'tournament' },
  { id: 8, src: '/images/AKZ02251.jpg', alt: 'Team Strategy Session', category: 'team' },
  { id: 9, src: '/images/AKZ02256.jpg', alt: 'Gaming Arena', category: 'setup' },

  { id: 10, src: '/images/AKZ02257.jpg', alt: 'Tournament Match 2', category: 'tournament' },
  //{ id: 11, src: '/images/AKZ02258.jpg', alt: 'Event Highlights', category: 'events' },
  //{ id: 12, src: '/images/AKZ02259.jpg', alt: 'Pro Gaming Setup', category: 'setup' },
  { id: 13, src: '/images/AKZ02260.jpg', alt: 'Team Coordination', category: 'team' },
//  { id: 14, src: '/images/AKZ02261.jpg', alt: 'Tournament Finals', category: 'tournament' },
  { id: 15, src: '/images/AKZ02262.jpg', alt: 'Networking Event', category: 'events' },
  { id: 19, src: '/images/AKZ02266.jpg', alt: 'Workshop Event', category: 'events' },
{ id: 21, src: '/images/AKZ02268.jpg', alt: 'Team Training', category: 'team' },
  { id: 22, src: '/images/AKZ02269.jpg', alt: 'Qualifier Match', category: 'tournament' },
{ id: 24, src: '/images/AKZ02271.jpg', alt: 'Esports Setup', category: 'setup' },
{ id: 27, src: '/images/AKZ02274.jpg', alt: 'Special Event', category: 'events' },
  { id: 28, src: '/images/AKZ02275.jpg', alt: 'Control Room Setup', category: 'setup' },
{ id: 33, src: '/images/AKZ02280.jpg', alt: 'Team Coaching', category: 'team' },
  //{ id: 34, src: '/images/AKZ02281.jpg', alt: 'Tournament Victory', category: 'tournament' },
  { id: 35, src: '/images/AKZ02282.jpg', alt: 'Charity Event', category: 'events' },

  { id: 43, src: '/images/AKZ02290.jpg', alt: 'Public Event', category: 'events' },
  { id: 44, src: '/images/AKZ02291.jpg', alt: 'Console Setup', category: 'setup' },
{ id: 50, src: '/images/AKZ02297.jpg', alt: 'Tournament Championship', category: 'tournament' },

{ id: 57, src: '/images/AKZ02304.jpg', alt: 'Team Leaders', category: 'team' },
 { id: 60, src: '/images/AKZ02307.jpg', alt: 'Sound System Setup', category: 'setup' },

  { id: 62, src: '/images/AKZ02309.jpg', alt: 'Tournament Highlights', category: 'tournament' },
 { id: 65, src: '/images/AKZ02312.jpg', alt: 'Team Energy', category: 'team' },
  { id: 68, src: '/images/AKZ02315.jpg', alt: 'Network Setup', category: 'setup' },
 { id: 72, src: '/images/AKZ02319.jpg', alt: 'Video Setup', category: 'setup' },
 { id: 80, src: '/images/AKZ02327.jpg', alt: 'Monitor Setup', category: 'setup' },
  { id: 82, src: '/images/AKZ02329.jpg', alt: 'National Tournament', category: 'tournament' },
  { id: 86, src: '/images/AKZ02333.jpg', alt: 'Elite Tournament', category: 'tournament' },
{ id: 90, src: '/images/AKZ02337.jpg', alt: 'Final Match Tournament', category: 'tournament' },

  { id: 97, src: '/images/AKZ02348.jpg', alt: 'Team Focus 2', category: 'team' },
  { id: 98, src: '/images/AKZ02349.jpg', alt: 'World Tournament', category: 'tournament' },
  { id: 99, src: '/images/AKZ02356.jpg', alt: 'Closing Event 2', category: 'events' },
  { id: 100, src: '/images/AKZ02357.jpg', alt: 'Control Setup 2', category: 'setup' },
 { id: 101, src: '/images/AKZ02359.jpg', alt: 'Lighting Setup', category: 'setup' },
  { id: 102, src: '/images/AKZ02360.jpg', alt: 'Team Discussion', category: 'team' },
  { id: 103, src: '/images/AKZ02361.jpg', alt: 'Tournament Semifinals', category: 'tournament' },
  { id: 104, src: '/images/AKZ02363.jpg', alt: 'VIP Event', category: 'events' },
  { id: 105, src: '/images/AKZ02366.jpg', alt: 'LAN Setup', category: 'setup' },
  { id: 106, src: '/images/AKZ02367.jpg', alt: 'Team Motivation', category: 'team' },
  { id: 107, src: '/images/AKZ02371.jpg', alt: 'Tournament Kickoff', category: 'tournament' },
  { id: 97, src: '/images/AKZ02348.jpg', alt: 'Team Focus 2', category: 'team' },
  { id: 98, src: '/images/AKZ02349.jpg', alt: 'World Tournament', category: 'tournament' },
  { id: 99, src: '/images/AKZ02356.jpg', alt: 'Closing Event 2', category: 'events' },
  { id: 100, src: '/images/AKZ02357.jpg', alt: 'Control Setup 2', category: 'setup' },
 { id: 101, src: '/images/AKZ02359.jpg', alt: 'Lighting Setup', category: 'setup' },
  { id: 102, src: '/images/AKZ02360.jpg', alt: 'Team Discussion', category: 'team' },
  { id: 103, src: '/images/AKZ02361.jpg', alt: 'Tournament Semifinals', category: 'tournament' },
  { id: 104, src: '/images/AKZ02363.jpg', alt: 'VIP Event', category: 'events' },
  { id: 105, src: '/images/AKZ02366.jpg', alt: 'LAN Setup', category: 'setup' },
  { id: 106, src: '/images/AKZ02367.jpg', alt: 'Team Motivation', category: 'team' },
  { id: 107, src: '/images/AKZ02371.jpg', alt: 'Tournament Kickoff', category: 'tournament' },
    { id: 108, src: '/images/AKZ02373.jpg', alt: 'Evening Event 2', category: 'events' },
    { id: 109, src: '/images/AKZ02376.jpg', alt: 'PC Setup', category: 'setup' },
    { id: 110, src: '/images/AKZ02379.jpg', alt: 'Team Spirit 2', category: 'team' },
    { id: 111, src: '/images/AKZ02382.jpg', alt: 'Tournament Finals 2', category: 'tournament' },
    { id: 112, src: '/images/AKZ02383.jpg', alt: 'Festival Event 2', category: 'events' },
    { id: 113, src: '/images/AKZ02384.jpg', alt: 'Esports Setup 2', category: 'setup' },
    { id: 114, src: '/images/AKZ02388.jpg', alt: 'Team Huddle 2', category: 'team' },
    { id: 115, src: '/images/AKZ02390.jpg', alt: 'Tournament Battle 2', category: 'tournament' },
    { id: 116, src: '/images/AKZ02395.jpg', alt: 'Special Event 2', category: 'events' },
    { id: 117, src: '/images/AKZ02398.jpg', alt: 'Control Room Setup 2', category: 'setup' },
    { id: 118, src: '/images/AKZ02402.jpg', alt: 'Team Briefing 3', category: 'team' },
    { id: 119, src: '/images/AKZ02405.jpg', alt: 'Tournament Stage 2', category: 'tournament' },
    { id: 120, src: '/images/AKZ02406.jpg', alt: 'Outdoor Event 2', category: 'events' },
    { id: 121, src: '/images/AKZ02407.jpg', alt: 'Streaming Setup 3', category: 'setup' },
    { id: 122, src: '/images/AKZ02409.jpg', alt: 'Team Gathering 2', category: 'team' },
    { id: 123, src: '/images/AKZ02416.jpg', alt: 'Final Match Tournament 2', category: 'tournament' },
    { id: 124, src: '/images/AKZ02418.jpg', alt: 'Public Event 2', category: 'events' },
    { id: 125, src: '/images/AKZ02420.jpg', alt: 'Console Setup 2', category: 'setup' },
    { id: 126, src: '/images/AKZ02421.jpg', alt: 'Team Celebration 2', category: 'team' },
    { id: 127, src: '/images/AKZ02424.jpg', alt: 'Grand Tournament 2', category: 'tournament' },
    { id: 128, src: '/images/AKZ02426.jpg', alt: 'Event Ceremony 2', category: 'events' },
    { id: 129, src: '/images/AKZ02431.jpg', alt: 'Stage Lighting Setup 2', category: 'setup' },
    { id: 130, src: '/images/AKZ02433.jpg', alt: 'Team Spirit 3', category: 'team' },
    { id: 131, src: '/images/AKZ02436.jpg', alt: 'Tournament Championship 2', category: 'tournament' },
    { id: 132, src: '/images/AKZ02452.jpg', alt: 'Event Networking 3', category: 'events' },
    { id: 133, src: '/images/AKZ02455.jpg', alt: 'Arena Setup 3', category: 'setup' },
    { id: 134, src: '/images/AKZ02457.jpg', alt: 'Team Practice 2', category: 'team' },
    { id: 135, src: '/images/AKZ02459.jpg', alt: 'Qualifier Tournament 2', category: 'tournament' },
    { id: 136, src: '/images/AKZ02463.jpg', alt: 'Community Event 2', category: 'events' },
    { id: 137, src: '/images/AKZ02466.jpg', alt: 'Equipment Setup 2', category: 'setup' },
    { id: 138, src: '/images/AKZ02467.jpg', alt: 'Team Leaders 2', category: 'team' },
    { id: 139, src: '/images/AKZ02470.jpg', alt: 'Tournament Arena 2', category: 'tournament' },
    { id: 140, src: '/images/AKZ02472.jpg', alt: 'Award Event 2', category: 'events' },
    { id: 141, src: '/images/AKZ02475.jpg', alt: 'Sound System Setup 2', category: 'setup' },
    { id: 142, src: '/images/AKZ02479.jpg', alt: 'Team Focus 3', category: 'team' },
    { id: 143, src: '/images/AKZ02480.jpg', alt  : 'Tournament Highlights 2', category: 'tournament' },
    { id: 144, src: '/images/AKZ02482.jpg', alt: 'Fan Event 3', category: 'events' },
    { id: 145, src: '/images/AKZ02485.jpg', alt: 'Lighting Control Setup 2', category: 'setup' },
    { id: 146, src: '/images/AKZ02488.jpg', alt     : 'Team Energy 2', category: 'team' },
    { id: 147, src: '/images/AKZ02490.jpg', alt: 'Final Tournament 2', category: 'tournament' },
    { id: 148, src: '/images/AKZ02492.jpg', alt: 'Summer Event 2', category: 'events' },
    { id: 149, src: '/images/AKZ02496.jpg', alt: 'Network Setup 2', category: 'setup' },
    { id: 150, src: '/images/AKZ02501.jpg', alt: 'Team Coordination 2', category: 'team' },
    { id: 151, src: '/images/AKZ02504.jpg', alt: 'Opening Tournament 2', category: 'tournament' },
    { id: 152, src: '/images/AKZ02506.jpg', alt : 'Closing Event 3', category: 'events' },
    { id: 153, src: '/images/AKZ02513.jpg', alt: 'Video Setup 2', category: 'setup' },
    { id: 154, src: '/images/AKZ02516.jpg', alt: 'Team Unity 2', category: 'team' },
    { id: 155, src: '/images/AKZ02519.jpg', alt: 'Tournament Matches 2', category: 'tournament' },
    { id: 156, src: '/images/AKZ02521.jpg', alt : 'Exhibition Event 2', category: 'events' },
    { id: 157, src: '/images/AKZ02525.jpg', alt     : 'Gaming PC Setup 2', category: 'setup' },
    { id: 158, src: '/images/AKZ02527.jpg', alt   : 'Team Performance 2', category: 'team' },
     { id: 159, src: '/images/AKZ02531.jpg', alt: 'Opening Tournament 2', category: 'tournament' },
    { id: 160, src: '/images/AKZ02539.jpg', alt : 'Closing Event 3', category: 'events' },
    { id: 161, src: '/images/AKZ02544.jpg', alt: 'Video Setup 2', category: 'setup' },
    { id: 162, src: '/images/AKZ02547.jpg', alt: 'Team Unity 2', category: 'team' },
    { id: 163, src: '/images/AKZ02551.jpg', alt: 'Tournament Matches 2', category: 'tournament' },
    { id: 164, src: '/images/AKZ02553.jpg', alt : 'Exhibition Event 2', category: 'events' },
    { id: 165, src: '/images/AKZ02560.jpg', alt     : 'Gaming PC Setup 2', category: 'setup' },
    { id: 166, src: '/images/AKZ02563.jpg', alt   : 'Team Performance 2', category: 'team' },
     { id: 167, src: '/images/AKZ02570.jpg', alt: 'Opening Tournament 2', category: 'tournament' },
    { id: 168, src: '/images/AKZ02571.jpg', alt : 'Closing Event 3', category: 'events' },
    { id: 169, src: '/images/AKZ02574.jpg', alt: 'Video Setup 2', category: 'setup' },
    { id: 170, src: '/images/AKZ02579.jpg', alt: 'Team Unity 2', category: 'team' },
    { id: 171, src: '/images/AKZ02580.jpg', alt: 'Tournament Matches 2', category: 'tournament' },
    { id: 172, src: '/images/AKZ02581.jpg', alt : 'Exhibition Event 2', category: 'events' },
    { id: 173, src: '/images/AKZ02583.jpg', alt     : 'Gaming PC Setup 2', category: 'setup' },
    { id: 174, src: '/images/AKZ02591.jpg', alt   : 'Team Performance 2', category: 'team' },
    { id: 175, src: '/images/AKZ02595.jpg', alt: 'Team Coordination 2', category: 'team' },
    { id: 176, src: '/images/AKZ02598.jpg', alt: 'Opening Tournament 2', category: 'tournament' },
    { id: 177, src: '/images/AKZ02603.jpg', alt : 'Closing Event 3', category: 'events' },
    { id: 178, src: '/images/AKZ02604.jpg', alt: 'Video Setup 2', category: 'setup' },
    { id: 179, src: '/images/AKZ02606.jpg', alt: 'Team Unity 2', category: 'team' },
    { id: 180, src: '/images/AKZ02608.jpg', alt: 'Tournament Matches 2', category: 'tournament' },
    { id: 181, src: '/images/AKZ02610.jpg', alt : 'Exhibition Event 2', category: 'events' },
    { id: 182, src: '/images/AKZ02619.jpg', alt     : 'Gaming PC Setup 2', category: 'setup' },
    { id: 183, src: '/images/AKZ02622.jpg', alt   : 'Team Performance 2', category: 'team' },
     { id: 184, src: '/images/AKZ02628.jpg', alt: 'Opening Tournament 2', category: 'tournament' },
    { id: 185, src: '/images/AKZ02630.jpg', alt : 'Closing Event 3', category: 'events' },
    { id: 186, src: '/images/AKZ02632.jpg', alt: 'Video Setup 2', category: 'setup' },
    { id: 187, src: '/images/AKZ02640.jpg', alt: 'Team Unity 2', category: 'team' },
    { id: 188, src: '/images/AKZ02643.jpg', alt: 'Tournament Matches 2', category: 'tournament' },
    { id: 189, src: '/images/AKZ02644.jpg', alt : 'Exhibition Event 2', category: 'events' },
    { id: 190, src: '/images/AKZ02647.jpg', alt     : 'Gaming PC Setup 2', category: 'setup' },
    { id: 191, src: '/images/AKZ02649.jpg', alt   : 'Team Performance 2', category: 'team' },
     { id: 192, src: '/images/AKZ02657.jpg', alt: 'Opening Tournament 2', category: 'tournament' },
    { id: 193, src: '/images/AKZ02658.jpg', alt : 'Closing Event 3', category: 'events' },
    { id: 194, src: '/images/AKZ02659.jpg', alt: 'Video Setup 2', category: 'setup' },
    { id: 195, src: '/images/AKZ02662.jpg', alt: 'Team Unity 2', category: 'team' },
    { id: 196, src: '/images/AKZ02670.jpg', alt: 'Tournament Matches 2', category: 'tournament' },
    { id: 197, src: '/images/AKZ02676.jpg', alt : 'Exhibition Event 2', category: 'events' },
    { id: 198, src: '/images/AKZ02686.jpg', alt     : 'Gaming PC Setup 2', category: 'setup' },
    { id: 199, src: '/images/AKZ02689.jpg', alt   : 'Team Performance 2', category: 'team' },
    { id: 200, src: '/images/AKZ02692.jpg', alt: 'Team Unity 2', category: 'team' },
    { id: 201, src: '/images/AKZ02698.jpg', alt: 'Tournament Matches 2', category: 'tournament' },
    { id: 202, src: '/images/AKZ02700.jpg', alt : 'Exhibition Event 2', category: 'events' },
    { id: 203, src: '/images/AKZ02705.jpg', alt     : 'Gaming PC Setup 2', category: 'setup' },
    { id: 204, src: '/images/AKZ02706.jpg', alt   : 'Team Performance 2', category: 'team' },
    
];


const founders = [
  {
    id: 1,
    name: "Eric",
    role: "Co-Founder & Lead Game Designer",
    bio: "Passionate about creating immersive gaming experiences with over 8 years in game development and tournament organization.",
    image: "/api/placeholder/300/300",
    achievements: ["50+ Tournaments Organized", "Community Builder Award 2024", "Game Innovation Excellence"],
    specialties: ["Tournament Design", "Player Engagement", "Community Building"]
  },
  {
    id: 2,
    name: "Michael", 
    role: "Co-Founder & Technical Director",
    bio: "Expert in gaming technology and platform development, ensuring seamless experiences for all participants.",
    image: "/api/placeholder/300/300",
    achievements: ["Tech Innovation Leader", "Platform Development Expert", "Player Experience Optimizer"],
    specialties: ["Technical Systems", "Platform Development", "Analytics & Insights"]
  }
];

const teamMembers = [
  {
    id: 1,
    name: "Candy",
    role: "Community Manager",
    image: "/api/placeholder/250/250",
    description: "Bringing sweetness to our gaming community with exceptional player support and event coordination."
  },
  {
    id: 2,
    name: "Sheriff",
    role: "Tournament Coordinator", 
    image: "/api/placeholder/250/250",
    description: "Maintaining order and fairness in all tournaments while ensuring every player has a great experience."
  },
//   {
//     id: 3,
//     name: "Your Name",
//     role: "Development Lead",
//     image: "/api/placeholder/250/250", 
//     description: "Building and maintaining the technical infrastructure that powers our gaming platform."
//   }
];

const ZGamesHomepage = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [selectedGalleryCategory, setSelectedGalleryCategory] = useState('all');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Filter gallery images based on selected category
  const filteredGalleryImages = useMemo(() => {
    if (selectedGalleryCategory === 'all') return galleryImages;
    return galleryImages.filter(img => img.category === selectedGalleryCategory);
  }, [selectedGalleryCategory]);

  // Handle form submission
  const handleFormSubmit = useCallback((e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 3000);
  }, [formData]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header with original styling */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* <div className="flex items-center gap-3">
                <div className="w-24 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Trophy className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-blue-800">Z Games</h1>
                  <span className="text-sm text-slate-500">Home page</span>
                </div>
              </div> */}
              <div className="flex items-center gap-3">
                <div className="w-24 h-20 rounded-xl flex items-center justify-center">
                    <img 
                    src={zGameLogo} 
                    alt="Z Games Logo" 
                    className="w-12 h-12 object-contain" 
                    />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-blue-800">Z Games</h1>
                    <span className="text-sm text-slate-500">Home page</span>
                </div>
                </div>

            </div>
            
            <div className="flex items-center gap-4">
              {/* Navigation buttons */}
              <div className="hidden md:flex items-center gap-2">
                {[
                  { id: 'home', label: 'Home', icon: Trophy },
                  { id: 'gallery', label: 'Gallery', icon: Camera },
                  { id: 'founders', label: 'Founders', icon: Crown },
                  { id: 'team', label: 'Team', icon: Users },
                  { id: 'contact', label: 'Contact', icon: Mail }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      activeSection === item.id
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-slate-600 hover:bg-blue-50 hover:text-blue-600'
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Instagram button */}
              <a
                href="https://instagram.com/zgames"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-full hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                <Instagram className="w-4 h-4" />
                <span className="text-sm font-medium">Instagram</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Home Section */}
        {activeSection === 'home' && (
          <div className="space-y-12">
            {/* Welcome Hero */}
            <div className="text-center py-12">
              <div className="inline-flex items-center gap-3 bg-blue-100 rounded-full px-6 py-3 mb-6">
                <Trophy className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-700">Premier Gaming Community</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold text-slate-800 mb-6">
                Welcome to <span className="text-blue-600">Z Games</span>
              </h1>
              
              <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
                Where champions are made and legends are born. Join our thriving gaming community for epic tournaments, competitive gameplay, and unforgettable experiences.
              </p>
              
              <div className="flex flex-wrap justify-center gap-4">
                {[
                  { id: 'gallery', label: 'View Gallery', icon: Camera, color: 'bg-blue-600 hover:bg-blue-700' },
                  { id: 'founders', label: 'Meet Founders', icon: Crown, color: 'bg-yellow-600 hover:bg-yellow-700' },
                  { id: 'team', label: 'Our Team', icon: Users, color: 'bg-green-600 hover:bg-green-700' },
                  { id: 'contact', label: 'Contact Us', icon: Mail, color: 'bg-purple-600 hover:bg-purple-700' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`flex items-center gap-2 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105 shadow-lg ${item.color}`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Trophy className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-2">2</h3>
                <p className="text-slate-600">Games Events Hosted</p>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-2">20+</h3>
                <p className="text-slate-600">Active Players</p>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-yellow-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-2">24/7</h3>
                <p className="text-slate-600">Community Support</p>
              </div>
            </div>
          </div>
        )}

        {/* Gallery Section */}
        {activeSection === 'gallery' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-slate-800 mb-4 flex items-center justify-center gap-3">
                <Camera className="w-8 h-8 text-blue-600" />
                Gallery
              </h2>
              <p className="text-slate-600 text-lg max-w-2xl mx-auto">
                Capture the excitement, passion, and community spirit that defines Z Games
              </p>
            </div>

            {/* Filter buttons with original styling */}
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { id: 'all', label: 'All Photos' },
                { id: 'tournament', label: 'Tournaments' },
                { id: 'events', label: 'Events' },
                { id: 'team', label: 'Team' },
                { id: 'setup', label: 'Setup' }
              ].map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedGalleryCategory(category.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    selectedGalleryCategory === category.id
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-white text-slate-600 hover:bg-blue-50 border border-slate-200 shadow-sm'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>

            {/* Gallery grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredGalleryImages.map((image) => (
                <div
                  key={image.id}
                  className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border border-slate-200"
                >
                  <div className="relative group">
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-4 left-4 right-4 text-white">
                        <h3 className="font-semibold">{image.alt}</h3>
                        <p className="text-sm text-white/80 capitalize">{image.category}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Founders Section */}
        {activeSection === 'founders' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-slate-800 mb-4 flex items-center justify-center gap-3">
                <Crown className="w-8 h-8 text-yellow-600" />
                Meet Our Founders
              </h2>
              <p className="text-slate-600 text-lg max-w-2xl mx-auto">
                The visionary game masters who brought Z Games to life
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {founders.map((founder, index) => (
                <div key={founder.id} className={`rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-2 ${
                  index === 0 ? 'bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200' : 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200'
                }`}>
                  <div className="flex flex-col items-center text-center">
                    <div className="relative mb-6">
                      <img
                        src={founder.image}
                        alt={founder.name}
                        className="w-24 h-24 rounded-2xl object-cover shadow-md"
                      />
                      <div className={`absolute -bottom-2 -right-2 rounded-full p-2 shadow-lg ${
                        index === 0 ? 'bg-gradient-to-br from-yellow-400 to-orange-500' : 'bg-gradient-to-br from-blue-500 to-purple-600'
                      }`}>
                        <Crown className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-slate-800 mb-2">{founder.name}</h3>
                    <p className="text-blue-600 font-semibold mb-4">{founder.role}</p>
                    <p className="text-slate-600 mb-6 text-sm">{founder.bio}</p>
                    
                    {/* Specialties */}
                    <div className="mb-6 w-full">
                      <h4 className="text-sm font-semibold text-slate-700 mb-3">Specialties</h4>
                      <div className="flex flex-wrap gap-2 justify-center">
                        {founder.specialties.map((specialty, idx) => (
                          <span key={idx} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    {/* Achievements */}
                    <div className="w-full">
                      <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center justify-center gap-2">
                        <Award className="w-4 h-4" />
                        Key Achievements
                      </h4>
                      <div className="space-y-2">
                        {founder.achievements.map((achievement, idx) => (
                          <div key={idx} className="flex items-center justify-center gap-2 text-sm text-slate-600">
                            <Star className="w-3 h-3 text-yellow-500" />
                            {achievement}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Team Section */}
        {activeSection === 'team' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-slate-800 mb-4 flex items-center justify-center gap-3">
                <Users className="w-8 h-8 text-green-600" />
                Our Amazing Team
              </h2>
              <p className="text-slate-600 text-lg max-w-2xl mx-auto">
                Meet the dedicated professionals who make Z Games extraordinary
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {teamMembers.map((member) => (
                <div key={member.id} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200 hover:scale-105">
                  <div className="text-center">
                    <div className="relative mb-6">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-20 h-20 mx-auto rounded-2xl object-cover shadow-md"
                      />
                      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-green-500 to-blue-600 rounded-full p-2 shadow-lg">
                        <User className="w-3 h-3 text-white" />
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-bold text-slate-800 mb-2">{member.name}</h3>
                    <p className="text-blue-600 font-semibold mb-4 text-sm">{member.role}</p>
                    <p className="text-slate-600 text-sm">{member.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Contact Section */}
        {activeSection === 'contact' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-slate-800 mb-4 flex items-center justify-center gap-3">
                <Mail className="w-8 h-8 text-purple-600" />
                Get in Touch
              </h2>
              <p className="text-slate-600 text-lg max-w-2xl mx-auto">
                Have questions or want to join our gaming community? We'd love to hear from you!
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Contact Info */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
                <h3 className="text-xl font-bold text-slate-800 mb-6">Contact Information</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <Mail className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800">Email Us</h4>
                      <p className="text-slate-600 text-sm">contact@zgames.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                      <Phone className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800">Call Us</h4>
                      <p className="text-slate-600 text-sm">+1 (555) 123-GAME</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                      <Instagram className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800">Follow Us</h4>
                      <a 
                        href="https://instagram.com/zgames" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 transition-colors text-sm"
                      >
                        @zgames on Instagram
                      </a>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <h4 className="font-semibold text-slate-800 mb-2 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    Tournament Schedule
                  </h4>
                  <p className="text-slate-600 text-sm">
                    Regular tournaments every weekend. Special events monthly. Join our community to stay updated!
                  </p>
                </div>
              </div>

              {/* Contact Form */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
                <h3 className="text-xl font-bold text-slate-800 mb-6">Send us a Message</h3>
                
                {formSubmitted ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Send className="w-6 h-6 text-green-600" />
                    </div>
                    <h4 className="text-lg font-bold text-green-600 mb-2">Message Sent!</h4>
                    <p className="text-slate-600">Thank you for reaching out. We'll get back to you soon!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Name</label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                          placeholder="Your name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Subject</label>
                      <input
                        type="text"
                        required
                        value={formData.subject}
                        onChange={(e) => setFormData({...formData, subject: e.target.value})}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                        placeholder="What's this about?"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Message</label>
                      <textarea
                        required
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                        placeholder="Tell us more about your inquiry..."
                      ></textarea>
                    </div>
                    
                    <button
                      type="submit"
                      onClick={handleFormSubmit}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      Send Message
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Admin Login Link - maintaining original position */}
        <div className="mt-12 text-center">
          <Link 
            to="/admin-login" 
            className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-600 transition-colors text-sm"
          >
            <span>Admin Login</span>
            <ArrowLeft className="w-3 h-3 rotate-180" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ZGamesHomepage;