
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Download, Edit3, Upload, RefreshCw, Settings, Moon, Sun, Palette, Image, Smartphone, Monitor, User, Activity, Clock, Target } from 'lucide-react';
import ProfileModal from '@/components/ProfileModal';
import ColorSchemeModal from '@/components/ColorSchemeModal';
import DeveloperModal from '@/components/DeveloperModal';
import CalendarModal from '@/components/CalendarModal';
import ImageModal from '@/components/ImageModal';
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const { toast } = useToast();

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
    
    if (checked) {
      toast({
        title: "Workout Completed! 💪",
        description: "Great job finishing today's workout!",
      });
    }
  };

  const handleRestDay = () => {
    const newRecords = { ...workoutRecords };
    if (todaysRecord.status === "rest") {
      newRecords[todayKey] = {
        workout: workoutPlan[currentDay] || "No workout assigned",
        status: "pending"
      };
      toast({
        title: "Rest Day Cleared",
        description: "Back to regular workout schedule",
      });
    } else {
      newRecords[todayKey] = {
        workout: "Rest Day",
        status: "rest"
      };
      toast({
        title: "Rest Day Set 😴",
        description: "Recovery is just as important as training!",
      });
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
      const isToday = dateKey === todayKey;
      
      let bgColor = "bg-white/5 hover:bg-white/10";
      let borderColor = "border-white/20";
      let textColor = "text-gray-300";
      
      if (record?.status === "completed") {
        bgColor = "bg-green-500/30 hover:bg-green-500/40";
        borderColor = "border-green-400/50";
        textColor = "text-green-100";
      } else if (record?.status === "missed") {
        bgColor = "bg-red-500/30 hover:bg-red-500/40";
        borderColor = "border-red-400/50";
        textColor = "text-red-100";
      } else if (record?.status === "rest") {
        bgColor = "bg-purple-500/30 hover:bg-purple-500/40";
        borderColor = "border-purple-400/50";
        textColor = "text-purple-100";
      }

      if (isToday) {
        borderColor = "border-blue-400";
        bgColor += " ring-2 ring-blue-400/50";
      }

      cells.push(
        <div key={d} className={`p-3 rounded-xl border ${borderColor} ${bgColor} text-center relative hover:scale-105 transition-all duration-200 cursor-pointer group`}>
          <div className="text-xs text-gray-400 absolute top-1 right-1">{dayAbbr}</div>
          <div className={`font-semibold ${textColor} ${isToday ? 'text-blue-300' : ''}`}>{d}</div>
          {record?.status === "completed" && <div className="text-xs text-green-300 mt-1">✓</div>}
          {record?.status === "rest" && <div className="text-xs text-purple-300 mt-1">💤</div>}
          {record?.status === "missed" && <div className="text-xs text-red-300 mt-1">✗</div>}
          {isToday && <div className="text-xs text-blue-300 mt-1">●</div>}
        </div>
      );
    }

    return cells;
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB",
          variant: "destructive"
        });
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (evt) => {
        setPictures([...pictures, evt.target?.result as string]);
        toast({
          title: "Image uploaded! 📸",
          description: "Your progress photo has been added",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const exportData = () => {
    const data = { profile, workoutPlan, workoutRecords, tipsContent, pictures };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `zenked_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Data exported! 💾",
      description: "Your workout data has been downloaded",
    });
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white transition-all duration-500 ${isDarkMode ? 'dark' : ''}`}>
      {/* Animated background overlay */}
      <div className="fixed inset-0 bg-[url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&h=1080&fit=crop')] bg-cover bg-center opacity-10 -z-10"></div>
      <div className="fixed inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/30 to-slate-900/40 -z-10 animate-gradient"></div>
      
      {/* Header */}
      <header className="text-center py-12 animate-fade-in">
        <h1 className="text-7xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-4 animate-gradient">
          ZENKED
        </h1>
        <p className="text-2xl text-gray-300 font-light">Your Personal Workout Portfolio</p>
        <div className="flex justify-center items-center gap-2 mt-4 text-sm text-gray-400">
          <Activity className="w-4 h-4" />
          <span>Track • Progress • Achieve</span>
        </div>
      </header>

      {/* Main Container */}
      <div className={`max-w-7xl mx-auto px-6 pb-12 grid gap-8 ${isMobileView ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
        
        {/* Profile Section */}
        <Card className="backdrop-blur-xl bg-white/10 border-white/20 p-8 rounded-3xl hover:bg-white/15 transition-all duration-300 hover:scale-[1.02] animate-fade-in-scale">
          <div className="flex items-center gap-6">
            <div className="relative">
              <img 
                src={profile?.picture || "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&h=100&fit=crop&crop=face"} 
                alt="Profile" 
                className="w-24 h-24 rounded-full border-3 border-blue-400 object-cover ring-4 ring-blue-400/30"
              />
              <div className="absolute -bottom-2 -right-2 bg-blue-500 rounded-full p-2">
                <User className="w-4 h-4 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <div className="space-y-2 text-sm text-gray-300">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-white">Name:</span> 
                  <span>{profile?.name || "Set up profile"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-white">Age:</span> 
                  <span>{profile?.age || "N/A"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-white">Height:</span> 
                  <span>{profile?.height || "N/A"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-white">Weight:</span> 
                  <span>{profile?.weight || "N/A"}</span>
                </div>
              </div>
              <Button onClick={() => setShowProfileModal(true)} className="mt-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 border-0 shadow-lg">
                <Edit3 className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            </div>
          </div>
        </Card>

        {/* Daily Workout */}
        <Card className="backdrop-blur-xl bg-white/10 border-white/20 p-8 rounded-3xl hover:bg-white/15 transition-all duration-300 lg:col-span-2 animate-fade-in-scale">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-full p-3">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Today's Workout</h2>
              <p className="text-gray-300">{currentDay}</p>
            </div>
          </div>
          
          <div 
            className={`mb-6 p-6 rounded-2xl transition-all duration-300 ${
              todaysRecord.status === "completed" ? "bg-green-500/20 border border-green-400/30 line-through" :
              todaysRecord.status === "rest" ? "bg-purple-500/20 border border-purple-400/30 italic" :
              todaysRecord.status === "missed" ? "bg-red-500/20 border border-red-400/30 line-through" :
              "bg-white/5 border border-white/10"
            }`}
            dangerouslySetInnerHTML={{ __html: todaysRecord.workout }}
          />
          
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-3 cursor-pointer group">
              <Checkbox 
                checked={todaysRecord.status === "completed"}
                onCheckedChange={handleWorkoutComplete}
                disabled={todaysRecord.status === "rest"}
                className="w-5 h-5 border-2 border-green-400 data-[state=checked]:bg-green-500"
              />
              <span className="font-medium text-white group-hover:text-green-300 transition-colors">
                Mark Complete
              </span>
            </label>
            <Button 
              onClick={handleRestDay}
              variant="outline"
              className="bg-transparent border-purple-400 text-purple-300 hover:bg-purple-500/20 hover:border-purple-300"
            >
              {todaysRecord.status === "rest" ? "Clear Rest Day" : "Rest Day"}
            </Button>
          </div>
        </Card>

        {/* Countdown Timer */}
        <Card className="backdrop-blur-xl bg-white/10 border-white/20 p-8 rounded-3xl text-center hover:bg-white/15 transition-all duration-300 animate-slide-up">
          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full p-4 w-16 h-16 mx-auto mb-4">
            <Clock className="w-8 h-8 text-white" />
          </div>
          <div className="text-lg text-gray-300 mb-2">Today is {currentDay}</div>
          <h2 className="text-xl font-semibold mb-3 text-white">Reset In:</h2>
          <div className="text-3xl font-bold text-blue-400 mb-3 font-mono">{countdown}</div>
          <div className="text-red-400 text-sm">Auto-miss in: <span className="font-mono">{missedTimer}</span></div>
        </Card>

        {/* Days Worked Out */}
        <Card className="backdrop-blur-xl bg-white/10 border-white/20 p-8 rounded-3xl text-center hover:bg-white/15 transition-all duration-300 hover:scale-[1.02] animate-slide-up">
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-full p-4 w-16 h-16 mx-auto mb-4">
            <Activity className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-semibold mb-4 text-white">Days Worked Out</h2>
          <div className="text-6xl font-bold text-green-400 mb-2">{recalcDaysWorkedOut()}</div>
          <div className="text-gray-300 text-sm">Total completed workouts</div>
        </Card>

        {/* Calendar Section */}
        <Card className="backdrop-blur-xl bg-white/10 border-white/20 p-8 rounded-3xl hover:bg-white/15 transition-all duration-300 lg:col-span-2 animate-fade-in">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full p-3">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">Workout Calendar</h2>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => setShowCalendar(!showCalendar)} variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                <Calendar className="w-4 h-4" />
                {showCalendar ? "Hide" : "Show"}
              </Button>
              <Button onClick={() => setShowCalendarModal(true)} variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                Full View
              </Button>
            </div>
          </div>
          
          {showCalendar && (
            <>
              <div className="flex justify-between items-center mb-6">
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
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  ← Previous
                </Button>
                <h3 className="text-xl font-semibold text-white">
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
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  Next →
                </Button>
              </div>
              <div className="grid grid-cols-7 gap-3">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center text-gray-400 font-medium text-sm p-2">
                    {day}
                  </div>
                ))}
                {renderCalendar()}
              </div>
            </>
          )}
        </Card>

        {/* Tips Section */}
        <Card className="backdrop-blur-xl bg-white/10 border-white/20 p-8 rounded-3xl hover:bg-white/15 transition-all duration-300 lg:col-span-3 animate-fade-in">
          <div className="flex gap-3 mb-6">
            <Button onClick={() => setShowTips(!showTips)} className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg">
              {showTips ? "Hide Tips" : "Show Tips"}
            </Button>
            {showTips && (
              <Button 
                onClick={() => setEditingTips(!editingTips)} 
                variant="outline"
                className="bg-transparent border-blue-400 text-blue-300 hover:bg-blue-500/20"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                {editingTips ? "Cancel Edit" : "Edit Tips"}
              </Button>
            )}
          </div>
          
          {showTips && (
            <div className="animate-slide-up">
              {editingTips ? (
                <div>
                  <Textarea 
                    value={tipsContent}
                    onChange={(e) => setTipsContent(e.target.value)}
                    className="mb-4 bg-white/10 border-white/20 text-white min-h-[200px] resize-none"
                    placeholder="Enter your fitness tips and notes here..."
                  />
                  <Button onClick={() => setEditingTips(false)} className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                    Save Tips
                  </Button>
                </div>
              ) : (
                <div 
                  className="prose prose-invert max-w-none text-gray-200 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: tipsContent }}
                />
              )}
            </div>
          )}
        </Card>

        {/* Pictures Section */}
        <Card className="backdrop-blur-xl bg-white/10 border-white/20 p-8 rounded-3xl hover:bg-white/15 transition-all duration-300 lg:col-span-2 animate-fade-in">
          <div className="flex items-center gap-3 mb-6">
            <Button onClick={() => setShowPics(!showPics)} className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 shadow-lg">
              <Image className="w-4 h-4 mr-2" />
              {showPics ? "Hide Progress Pics" : "Show Progress Pics"}
            </Button>
          </div>
          
          {showPics && (
            <div className="animate-slide-up">
              <Input 
                type="file" 
                accept="image/*"
                onChange={handleImageUpload}
                className="mb-6 bg-white/10 border-white/20 text-white file:bg-blue-500 file:text-white file:border-0 file:rounded-lg"
              />
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {pictures.map((pic, index) => (
                  <div key={index} className="relative group">
                    <img 
                      src={pic} 
                      alt={`Progress ${index + 1}`}
                      className="w-full h-32 object-cover rounded-xl cursor-pointer hover:scale-105 transition-all duration-300 shadow-lg"
                      onClick={() => {
                        setEnlargedImage(pic);
                        setShowImageModal(true);
                      }}
                    />
                    <button 
                      onClick={() => setPictures(pictures.filter((_, i) => i !== index))}
                      className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 text-sm opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center"
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
        <Card className="backdrop-blur-xl bg-white/10 border-white/20 p-8 rounded-3xl hover:bg-white/15 transition-all duration-300 lg:col-span-3 animate-fade-in">
          <Button onClick={() => setShowWorkoutPlan(!showWorkoutPlan)} className="mb-6 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 shadow-lg">
            <Edit3 className="w-4 h-4 mr-2" />
            {showWorkoutPlan ? "Hide" : "Edit"} Weekly Workout Plan
          </Button>
          
          {showWorkoutPlan && (
            <div className="animate-slide-up">
              <Textarea 
                value={JSON.stringify(workoutPlan, null, 2)}
                onChange={(e) => {
                  try {
                    setWorkoutPlan(JSON.parse(e.target.value));
                  } catch (err) {
                    // Invalid JSON, don't update
                  }
                }}
                className="mb-4 bg-white/10 border-white/20 text-white font-mono text-sm min-h-[300px] resize-none"
                placeholder="Edit your workout plan in JSON format..."
              />
            </div>
          )}
        </Card>

        {/* Controls */}
        <Card className="backdrop-blur-xl bg-white/10 border-white/20 p-8 rounded-3xl hover:bg-white/15 transition-all duration-300 lg:col-span-3 animate-fade-in">
          <h3 className="text-xl font-bold text-white mb-6">App Controls</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <Button 
              onClick={exportData}
              className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 shadow-lg"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            
            <Button onClick={() => setShowDeveloperModal(true)} className="bg-gradient-to-r from-gray-500 to-slate-600 hover:from-gray-600 hover:to-slate-700 shadow-lg">
              <Settings className="w-4 h-4 mr-2" />
              Developer
            </Button>
            
            <Button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 shadow-lg"
            >
              {isDarkMode ? <Sun className="w-4 h-4 mr-2" /> : <Moon className="w-4 h-4 mr-2" />}
              Theme
            </Button>
            
            <Button onClick={() => setShowColorModal(true)} className="bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 shadow-lg">
              <Palette className="w-4 h-4 mr-2" />
              Colors
            </Button>
            
            <Button 
              onClick={() => setIsMobileView(!isMobileView)}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-lg"
            >
              {isMobileView ? <Monitor className="w-4 h-4 mr-2" /> : <Smartphone className="w-4 h-4 mr-2" />}
              Layout
            </Button>
            
            <Button 
              onClick={() => {
                if (confirm("⚠️ This will delete ALL your data. Are you sure?")) {
                  localStorage.clear();
                  window.location.reload();
                }
              }}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg"
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
