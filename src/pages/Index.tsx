
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Download, Edit3, Upload, RefreshCw, Settings, Moon, Sun, Palette, Image, Smartphone, Monitor } from 'lucide-react';
import ProfileModal from '@/components/ProfileModal';
import ColorSchemeModal from '@/components/ColorSchemeModal';
import DeveloperModal from '@/components/DeveloperModal';
import CalendarModal from '@/components/CalendarModal';
import ImageModal from '@/components/ImageModal';

const Index = () => {
  // Default workout plan
  const defaultWorkoutPlan = {
    Monday: `<strong>Day 1: Push (Chest, Shoulders, Triceps)</strong><br>
             <em>Warm-Up:</em> 5-10 minutes light cardio & dynamic stretches<br>
             1. Weighted Push-Ups (to failure) x 3<br>
             2. Incline/Decline Push-Ups (to failure) x 3<br>
             3. Diamond Push-Ups x 3<br>
             4. Overhead Tricep Extensions x 3 sets of 15<br>
             5. Shoulder Press x 3 sets of 10-12<br>
             <em>Abs:</em> Plank (1 min x 3), Leg Raises (15 reps x 3)`,
    Tuesday: `<strong>Day 2: Pull (Back, Biceps)</strong><br>
              <em>Warm-Up:</em> 5-10 minutes light cardio & dynamic stretches<br>
              1. Pull-Ups/Assisted Pull-Ups x 3 sets<br>
              2. Barbell/Dumbbell Rows x 3 sets of 10<br>
              3. Bicep Curls x 3 sets of 12<br>
              4. Cross Hammer Curls x 3 sets of 12<br>
              5. Preacher Curls x 3 sets of 12<br>
              <em>Abs:</em> Russian Twists (1 min x 3), Sit-Ups (20 reps x 3)`,
    Wednesday: `<strong>Day 3: Legs & Core</strong><br>
                <em>Warm-Up:</em> 5-10 minutes light cardio & leg swings<br>
                1. Squats x 3 sets of 15<br>
                2. Lunges x 3 sets of 12 (each leg)<br>
                3. Step-Ups x 3 sets of 12<br>
                4. Calf Raises x 3 sets of 20<br>
                5. Leg Raises x 3 sets of 15<br>
                <em>Core:</em> Plank (1 min x 3), Side Plank (30 sec each side)`,
    Thursday: `<strong>Day 4: Active Rest / Cardio</strong><br>
               Light cardio for 20-30 minutes<br>
               Stretching and mobility work`,
    Friday: `<strong>Day 5: Push (Chest, Shoulders, Triceps)</strong><br>
             Repeat Day 1 with progression`,
    Saturday: `<strong>Day 6: Pull (Back, Biceps)</strong><br>
               Repeat Day 2 with progression`,
    Sunday: `<strong>Day 7: Rest / Recovery</strong><br>
             Rest and recover (stretch, yoga, or mobility exercises)`
  };

  // State management
  const [profile, setProfile] = useState(() => JSON.parse(localStorage.getItem("profile") || "null"));
  const [workoutPlan, setWorkoutPlan] = useState(() => JSON.parse(localStorage.getItem("workoutPlan") || JSON.stringify(defaultWorkoutPlan)));
  const [workoutRecords, setWorkoutRecords] = useState(() => JSON.parse(localStorage.getItem("workoutRecords") || "{}"));
  const [tipsContent, setTipsContent] = useState(() => localStorage.getItem("tipsContent") || "Default fitness tips...");
  const [pictures, setPictures] = useState(() => JSON.parse(localStorage.getItem("pictures") || "[]"));
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem("theme") === "dark");
  const [isMobileView, setIsMobileView] = useState(false);
  
  // Calendar state
  const [calendarDisplayYear, setCalendarDisplayYear] = useState(new Date().getFullYear());
  const [calendarDisplayMonth, setCalendarDisplayMonth] = useState(new Date().getMonth());
  
  // Modal states
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showColorModal, setShowColorModal] = useState(false);
  const [showDeveloperModal, setShowDeveloperModal] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [enlargedImage, setEnlargedImage] = useState("");
  
  // Section visibility
  const [showTips, setShowTips] = useState(false);
  const [showPics, setShowPics] = useState(false);
  const [showWorkoutPlan, setShowWorkoutPlan] = useState(false);
  const [showCalendar, setShowCalendar] = useState(true);
  const [editingTips, setEditingTips] = useState(false);

  // Utility functions
  const getTodayKey = () => new Date().toISOString().split("T")[0];
  const getCurrentDayName = () => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return days[new Date().getDay()];
  };

  const saveLocalStorage = () => {
    localStorage.setItem("profile", JSON.stringify(profile));
    localStorage.setItem("workoutPlan", JSON.stringify(workoutPlan));
    localStorage.setItem("workoutRecords", JSON.stringify(workoutRecords));
    localStorage.setItem("tipsContent", tipsContent);
    localStorage.setItem("pictures", JSON.stringify(pictures));
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  };

  const recalcDaysWorkedOut = () => {
    return Object.values(workoutRecords).filter((record: any) => record.status === "completed").length;
  };

  // Today's workout logic
  const todayKey = getTodayKey();
  const currentDay = getCurrentDayName();
  const todaysRecord = workoutRecords[todayKey] || { 
    workout: workoutPlan[currentDay] || "No workout assigned", 
    status: "pending" 
  };

  const handleWorkoutComplete = (checked: boolean) => {
    const newRecords = { ...workoutRecords };
    newRecords[todayKey] = {
      ...todaysRecord,
      status: checked ? "completed" : "pending"
    };
    setWorkoutRecords(newRecords);
  };

  const handleRestDay = () => {
    const newRecords = { ...workoutRecords };
    if (todaysRecord.status === "rest") {
      newRecords[todayKey] = {
        workout: workoutPlan[currentDay] || "No workout assigned",
        status: "pending"
      };
    } else {
      newRecords[todayKey] = {
        workout: "Rest Day",
        status: "rest"
      };
    }
    setWorkoutRecords(newRecords);
  };

  // Countdown timer
  const [countdown, setCountdown] = useState("");
  const [missedTimer, setMissedTimer] = useState("");

  useEffect(() => {
    const updateTimers = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setHours(24, 0, 0, 0);
      const diff = tomorrow.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setCountdown(`${hours}h ${minutes}m ${seconds}s`);

      const missedTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 0, 0, 0);
      if (now >= missedTime) missedTime.setDate(missedTime.getDate() + 1);
      const missedDiff = missedTime.getTime() - now.getTime();
      const mHours = Math.floor(missedDiff / (1000 * 60 * 60));
      const mMinutes = Math.floor((missedDiff % (1000 * 60 * 60)) / (1000 * 60));
      const mSeconds = Math.floor((missedDiff % (1000 * 60)) / 1000);
      setMissedTimer(`${mHours}h ${mMinutes}m ${mSeconds}s`);
    };

    updateTimers();
    const interval = setInterval(updateTimers, 1000);
    return () => clearInterval(interval);
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    saveLocalStorage();
  }, [profile, workoutPlan, workoutRecords, tipsContent, pictures, isDarkMode]);

  // Initialize
  useEffect(() => {
    if (!profile) {
      setShowProfileModal(true);
    }
  }, []);

  // Calendar rendering
  const renderCalendar = () => {
    const firstDay = new Date(calendarDisplayYear, calendarDisplayMonth, 1).getDay();
    const daysInMonth = new Date(calendarDisplayYear, calendarDisplayMonth + 1, 0).getDate();
    const cells = [];

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      cells.push(<div key={`empty-${i}`} className="p-2"></div>);
    }

    // Days of the month
    for (let d = 1; d <= daysInMonth; d++) {
      const cellDate = new Date(calendarDisplayYear, calendarDisplayMonth, d);
      const dateKey = cellDate.toISOString().split("T")[0];
      const dayAbbr = cellDate.toLocaleDateString('en-US', { weekday: 'short' });
      const record = workoutRecords[dateKey];
      
      let bgColor = "bg-white/10";
      if (record?.status === "completed") bgColor = "bg-green-500/30";
      else if (record?.status === "missed") bgColor = "bg-red-500/30";
      else if (record?.status === "rest") bgColor = "bg-purple-500/30";

      cells.push(
        <div key={d} className={`p-2 rounded-lg border border-white/20 text-center relative hover:scale-105 transition-transform ${bgColor}`}>
          <div className="text-xs text-gray-400 absolute top-1 right-1">{dayAbbr}</div>
          <div className="text-white">{d}</div>
        </div>
      );
    }

    return cells;
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-5 ${isDarkMode ? 'dark' : ''}`}>
      {/* Background overlay */}
      <div className="fixed inset-0 bg-[url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&h=1080&fit=crop')] bg-cover bg-center opacity-20 -z-10"></div>
      
      {/* Header */}
      <header className="text-center mb-8">
        <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-4">
          ZENKED
        </h1>
        <p className="text-xl text-gray-300">Workout Portfolio</p>
      </header>

      {/* Main Container */}
      <div className={`max-w-7xl mx-auto grid gap-6 ${isMobileView ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
        
        {/* Profile Section */}
        <Card className="backdrop-blur-lg bg-white/10 border-white/20 p-6 rounded-2xl">
          <div className="flex items-center gap-4">
            <img 
              src={profile?.picture || "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&h=100&fit=crop&crop=face"} 
              alt="Profile" 
              className="w-20 h-20 rounded-full border-2 border-blue-400 object-cover"
            />
            <div className="flex-1">
              <div className="text-sm text-gray-300">
                <div><strong>Name:</strong> {profile?.name || "N/A"}</div>
                <div><strong>Age:</strong> {profile?.age || "N/A"}</div>
                <div><strong>Height:</strong> {profile?.height || "N/A"}</div>
                <div><strong>Weight:</strong> {profile?.weight || "N/A"}</div>
              </div>
              <Button onClick={() => setShowProfileModal(true)} className="mt-2 bg-blue-500 hover:bg-blue-600">
                <Edit3 className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            </div>
          </div>
        </Card>

        {/* Daily Workout */}
        <Card className="backdrop-blur-lg bg-white/10 border-white/20 p-6 rounded-2xl">
          <h2 className="text-xl font-semibold mb-4">Today's Workout - <em>{currentDay}</em></h2>
          <div 
            className={`mb-4 p-4 rounded-lg ${
              todaysRecord.status === "completed" ? "bg-green-500/20 line-through" :
              todaysRecord.status === "rest" ? "bg-purple-500/20 italic" :
              todaysRecord.status === "missed" ? "bg-red-500/20 line-through" :
              "bg-white/5"
            }`}
            dangerouslySetInnerHTML={{ __html: todaysRecord.workout }}
          />
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <Checkbox 
                checked={todaysRecord.status === "completed"}
                onCheckedChange={handleWorkoutComplete}
                disabled={todaysRecord.status === "rest"}
              />
              Complete
            </label>
            <Button 
              onClick={handleRestDay}
              variant="outline"
              className="bg-transparent border-purple-400 text-purple-300 hover:bg-purple-500/20"
            >
              {todaysRecord.status === "rest" ? "Clear Rest Day" : "Mark as Rest Day"}
            </Button>
          </div>
        </Card>

        {/* Countdown Timer */}
        <Card className="backdrop-blur-lg bg-white/10 border-white/20 p-6 rounded-2xl text-center">
          <div className="text-lg text-gray-300 mb-2">Today is {currentDay}</div>
          <h2 className="text-xl font-semibold mb-2">Reset In:</h2>
          <div className="text-2xl font-bold text-blue-400 mb-2">{countdown}</div>
          <div className="text-red-400">Auto-miss in: {missedTimer}</div>
        </Card>

        {/* Days Worked Out */}
        <Card className="backdrop-blur-lg bg-white/10 border-white/20 p-6 rounded-2xl text-center">
          <h2 className="text-xl font-semibold mb-4">Days Worked Out</h2>
          <div className="text-5xl font-bold text-green-400">{recalcDaysWorkedOut()}</div>
        </Card>

        {/* Calendar Section */}
        <Card className="backdrop-blur-lg bg-white/10 border-white/20 p-6 rounded-2xl lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Workout Calendar</h2>
            <div className="flex gap-2">
              <Button onClick={() => setShowCalendar(!showCalendar)} variant="outline" size="sm">
                <Calendar className="w-4 h-4" />
                Toggle
              </Button>
              <Button onClick={() => setShowCalendarModal(true)} variant="outline" size="sm">
                Calendar Mode
              </Button>
            </div>
          </div>
          
          {showCalendar && (
            <>
              <div className="flex justify-between items-center mb-4">
                <Button 
                  onClick={() => {
                    let newMonth = calendarDisplayMonth - 1;
                    let newYear = calendarDisplayYear;
                    if (newMonth < 0) { newMonth = 11; newYear--; }
                    setCalendarDisplayMonth(newMonth);
                    setCalendarDisplayYear(newYear);
                  }}
                  variant="outline" 
                  size="sm"
                >
                  Previous
                </Button>
                <h3 className="text-lg font-medium">
                  {new Date(calendarDisplayYear, calendarDisplayMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </h3>
                <Button 
                  onClick={() => {
                    let newMonth = calendarDisplayMonth + 1;
                    let newYear = calendarDisplayYear;
                    if (newMonth > 11) { newMonth = 0; newYear++; }
                    setCalendarDisplayMonth(newMonth);
                    setCalendarDisplayYear(newYear);
                  }}
                  variant="outline" 
                  size="sm"
                >
                  Next
                </Button>
              </div>
              <div className="grid grid-cols-7 gap-2">
                {renderCalendar()}
              </div>
            </>
          )}
        </Card>

        {/* Tips Section */}
        <Card className="backdrop-blur-lg bg-white/10 border-white/20 p-6 rounded-2xl lg:col-span-3">
          <div className="flex gap-2 mb-4">
            <Button onClick={() => setShowTips(!showTips)} className="bg-green-500 hover:bg-green-600">
              {showTips ? "Hide Tips" : "Show Tips"}
            </Button>
            {showTips && (
              <Button 
                onClick={() => setEditingTips(!editingTips)} 
                variant="outline"
                className="bg-transparent border-blue-400 text-blue-300"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                {editingTips ? "Cancel Edit" : "Edit Tips"}
              </Button>
            )}
          </div>
          
          {showTips && (
            <div>
              {editingTips ? (
                <div>
                  <Textarea 
                    value={tipsContent}
                    onChange={(e) => setTipsContent(e.target.value)}
                    className="mb-4 bg-white/10 border-white/20 text-white"
                    rows={10}
                  />
                  <Button onClick={() => setEditingTips(false)} className="bg-blue-500 hover:bg-blue-600">
                    Save Tips
                  </Button>
                </div>
              ) : (
                <div 
                  className="prose prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: tipsContent }}
                />
              )}
            </div>
          )}
        </Card>

        {/* Pictures Section */}
        <Card className="backdrop-blur-lg bg-white/10 border-white/20 p-6 rounded-2xl lg:col-span-2">
          <Button onClick={() => setShowPics(!showPics)} className="mb-4 bg-purple-500 hover:bg-purple-600">
            {showPics ? "Hide Pics" : "Show Pics"}
          </Button>
          
          {showPics && (
            <div>
              <Input 
                type="file" 
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (evt) => {
                      setPictures([...pictures, evt.target?.result as string]);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                className="mb-4 bg-white/10 border-white/20"
              />
              <div className="grid grid-cols-3 gap-4">
                {pictures.map((pic, index) => (
                  <div key={index} className="relative group">
                    <img 
                      src={pic} 
                      alt={`Upload ${index}`}
                      className="w-full h-24 object-cover rounded-lg cursor-pointer hover:scale-105 transition-transform"
                      onClick={() => {
                        setEnlargedImage(pic);
                        setShowImageModal(true);
                      }}
                    />
                    <button 
                      onClick={() => setPictures(pictures.filter((_, i) => i !== index))}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>

        {/* Workout Plan Editor */}
        <Card className="backdrop-blur-lg bg-white/10 border-white/20 p-6 rounded-2xl lg:col-span-3">
          <Button onClick={() => setShowWorkoutPlan(!showWorkoutPlan)} className="mb-4 bg-orange-500 hover:bg-orange-600">
            {showWorkoutPlan ? "Hide" : "Edit"} Weekly Workout Plan
          </Button>
          
          {showWorkoutPlan && (
            <div>
              <Textarea 
                value={JSON.stringify(workoutPlan, null, 2)}
                onChange={(e) => {
                  try {
                    setWorkoutPlan(JSON.parse(e.target.value));
                  } catch (err) {
                    // Invalid JSON, don't update
                  }
                }}
                className="mb-4 bg-white/10 border-white/20 text-white font-mono"
                rows={15}
              />
            </div>
          )}
        </Card>

        {/* Controls */}
        <Card className="backdrop-blur-lg bg-white/10 border-white/20 p-6 rounded-2xl lg:col-span-3">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button 
              onClick={() => {
                const data = { profile, workoutPlan, workoutRecords, tipsContent, pictures };
                const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "zenkout_data.json";
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="bg-blue-500 hover:bg-blue-600"
            >
              <Download className="w-4 h-4 mr-2" />
              Save JSON
            </Button>
            
            <Button onClick={() => setShowDeveloperModal(true)} className="bg-gray-500 hover:bg-gray-600">
              <Settings className="w-4 h-4 mr-2" />
              Developer
            </Button>
            
            <Button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="bg-yellow-500 hover:bg-yellow-600"
            >
              {isDarkMode ? <Sun className="w-4 h-4 mr-2" /> : <Moon className="w-4 h-4 mr-2" />}
              Theme
            </Button>
            
            <Button onClick={() => setShowColorModal(true)} className="bg-pink-500 hover:bg-pink-600">
              <Palette className="w-4 h-4 mr-2" />
              Colors
            </Button>
            
            <Button 
              onClick={() => setIsMobileView(!isMobileView)}
              className="bg-indigo-500 hover:bg-indigo-600"
            >
              {isMobileView ? <Monitor className="w-4 h-4 mr-2" /> : <Smartphone className="w-4 h-4 mr-2" />}
              View
            </Button>
            
            <Button 
              onClick={() => {
                if (confirm("Reset all data?")) {
                  localStorage.clear();
                  window.location.reload();
                }
              }}
              className="bg-red-500 hover:bg-red-600"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
        </Card>
      </div>

      {/* Modals */}
      <ProfileModal 
        show={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        profile={profile}
        onSave={setProfile}
      />
      
      <ColorSchemeModal 
        show={showColorModal}
        onClose={() => setShowColorModal(false)}
      />
      
      <DeveloperModal 
        show={showDeveloperModal}
        onClose={() => setShowDeveloperModal(false)}
        workoutRecords={workoutRecords}
        onSave={setWorkoutRecords}
        workoutPlan={workoutPlan}
      />
      
      <CalendarModal 
        show={showCalendarModal}
        onClose={() => setShowCalendarModal(false)}
        workoutRecords={workoutRecords}
        onMonthSelect={(year, month) => {
          setCalendarDisplayYear(year);
          setCalendarDisplayMonth(month);
          setShowCalendarModal(false);
        }}
      />
      
      <ImageModal 
        show={showImageModal}
        onClose={() => setShowImageModal(false)}
        imageSrc={enlargedImage}
      />
    </div>
  );
};

export default Index;
