
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
    Monday: `**Day 1: Push (Chest, Shoulders, Triceps)**
*Warm-Up:* 5-10 minutes light cardio & dynamic stretches
1. Weighted Push-Ups (to failure) x 3
2. Incline/Decline Push-Ups (to failure) x 3
3. Diamond Push-Ups x 3
4. Overhead Tricep Extensions x 3 sets of 15
5. Shoulder Press x 3 sets of 10-12
*Abs:* Plank (1 min x 3), Leg Raises (15 reps x 3)`,
    Tuesday: `**Day 2: Pull (Back, Biceps)**
*Warm-Up:* 5-10 minutes light cardio & dynamic stretches
1. Pull-Ups/Assisted Pull-Ups x 3 sets
2. Barbell/Dumbbell Rows x 3 sets of 10
3. Bicep Curls x 3 sets of 12
4. Cross Hammer Curls x 3 sets of 12
5. Preacher Curls x 3 sets of 12
*Abs:* Russian Twists (1 min x 3), Sit-Ups (20 reps x 3)`,
    Wednesday: `**Day 3: Legs & Core**
*Warm-Up:* 5-10 minutes light cardio & leg swings
1. Squats x 3 sets of 15
2. Lunges x 3 sets of 12 (each leg)
3. Step-Ups x 3 sets of 12
4. Calf Raises x 3 sets of 20
5. Leg Raises x 3 sets of 15
*Core:* Plank (1 min x 3), Side Plank (30 sec each side)`,
    Thursday: `**Day 4: Active Rest / Cardio**
Light cardio for 20-30 minutes
Stretching and mobility work`,
    Friday: `**Day 5: Push (Chest, Shoulders, Triceps)**
Repeat Day 1 with progression`,
    Saturday: `**Day 6: Pull (Back, Biceps)**
Repeat Day 2 with progression`,
    Sunday: `**Day 7: Rest / Recovery**
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
  const [editingWorkoutDay, setEditingWorkoutDay] = useState("");

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
      cells.push(<div key={`empty-${i}`} className="p-1 md:p-2"></div>);
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
        <div key={d} className={`p-1 md:p-3 rounded-lg md:rounded-xl border ${borderColor} ${bgColor} text-center relative hover:scale-105 transition-all duration-200 cursor-pointer group`}>
          <div className="text-xs text-gray-400 absolute top-0.5 right-0.5 md:top-1 md:right-1">{dayAbbr}</div>
          <div className={`font-semibold text-sm md:text-base ${textColor} ${isToday ? 'text-blue-300' : ''}`}>{d}</div>
          {record?.status === "completed" && <div className="text-xs text-green-300 mt-0.5 md:mt-1">✓</div>}
          {record?.status === "rest" && <div className="text-xs text-purple-300 mt-0.5 md:mt-1">💤</div>}
          {record?.status === "missed" && <div className="text-xs text-red-300 mt-0.5 md:mt-1">✗</div>}
          {isToday && <div className="text-xs text-blue-300 mt-0.5 md:mt-1">●</div>}
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

  const handleWorkoutPlanUpdate = (day: string, content: string) => {
    setWorkoutPlan({
      ...workoutPlan,
      [day]: content
    });
  };

  const formatMarkdownContent = (content: string) => {
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br>');
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white transition-all duration-500 ${isDarkMode ? 'dark' : ''}`}>
      {/* Animated background overlay */}
      <div className="fixed inset-0 bg-[url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&h=1080&fit=crop')] bg-cover bg-center opacity-10 -z-10"></div>
      <div className="fixed inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/30 to-slate-900/40 -z-10 animate-gradient"></div>
      
      {/* Header */}
      <header className="text-center py-6 md:py-12 animate-fade-in px-4">
        <h1 className="text-4xl md:text-7xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-2 md:mb-4 animate-gradient">
          ZENKED
        </h1>
        <p className="text-lg md:text-2xl text-gray-300 font-light">Your Personal Workout Portfolio</p>
        <div className="flex justify-center items-center gap-2 mt-2 md:mt-4 text-xs md:text-sm text-gray-400">
          <Activity className="w-3 h-3 md:w-4 md:h-4" />
          <span>Track • Progress • Achieve</span>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 pb-6 md:pb-12 space-y-4 md:space-y-8">
        
        {/* Mobile-first grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
          
          {/* Profile Section */}
          <Card className="backdrop-blur-xl bg-white/10 border-white/20 p-4 md:p-8 rounded-2xl md:rounded-3xl hover:bg-white/15 transition-all duration-300 hover:scale-[1.02] animate-fade-in-scale">
            <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-6">
              <div className="relative">
                <img 
                  src={profile?.picture || "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&h=100&fit=crop&crop=face"} 
                  alt="Profile" 
                  className="w-16 h-16 md:w-24 md:h-24 rounded-full border-3 border-blue-400 object-cover ring-4 ring-blue-400/30"
                />
                <div className="absolute -bottom-1 -right-1 md:-bottom-2 md:-right-2 bg-blue-500 rounded-full p-1 md:p-2">
                  <User className="w-3 h-3 md:w-4 md:h-4 text-white" />
                </div>
              </div>
              <div className="flex-1 text-center sm:text-left">
                <div className="space-y-1 md:space-y-2 text-xs md:text-sm text-gray-300">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                    <span className="font-medium text-white">Name:</span> 
                    <span>{profile?.name || "Set up profile"}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                    <span className="font-medium text-white">Age:</span> 
                    <span>{profile?.age || "N/A"}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                    <span className="font-medium text-white">Height:</span> 
                    <span>{profile?.height || "N/A"}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                    <span className="font-medium text-white">Weight:</span> 
                    <span>{profile?.weight || "N/A"}</span>
                  </div>
                </div>
                <Button onClick={() => setShowProfileModal(true)} className="mt-3 md:mt-4 w-full sm:w-auto bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 border-0 shadow-lg text-xs md:text-sm">
                  <Edit3 className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                  Edit Profile
                </Button>
              </div>
            </div>
          </Card>

          {/* Countdown Timer */}
          <Card className="backdrop-blur-xl bg-white/10 border-white/20 p-4 md:p-8 rounded-2xl md:rounded-3xl text-center hover:bg-white/15 transition-all duration-300 animate-slide-up">
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full p-3 md:p-4 w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 md:mb-4">
              <Clock className="w-6 h-6 md:w-8 md:h-8 text-white" />
            </div>
            <div className="text-sm md:text-lg text-gray-300 mb-1 md:mb-2">Today is {currentDay}</div>
            <h2 className="text-lg md:text-xl font-semibold mb-2 md:mb-3 text-white">Reset In:</h2>
            <div className="text-2xl md:text-3xl font-bold text-blue-400 mb-2 md:mb-3 font-mono">{countdown}</div>
            <div className="text-red-400 text-xs md:text-sm">Auto-miss in: <span className="font-mono">{missedTimer}</span></div>
          </Card>

          {/* Days Worked Out */}
          <Card className="backdrop-blur-xl bg-white/10 border-white/20 p-4 md:p-8 rounded-2xl md:rounded-3xl text-center hover:bg-white/15 transition-all duration-300 hover:scale-[1.02] animate-slide-up">
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-full p-3 md:p-4 w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 md:mb-4">
              <Activity className="w-6 h-6 md:w-8 md:h-8 text-white" />
            </div>
            <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-white">Days Worked Out</h2>
            <div className="text-4xl md:text-6xl font-bold text-green-400 mb-1 md:mb-2">{recalcDaysWorkedOut()}</div>
            <div className="text-gray-300 text-xs md:text-sm">Total completed workouts</div>
          </Card>
        </div>

        {/* Daily Workout - Full width */}
        <Card className="backdrop-blur-xl bg-white/10 border-white/20 p-4 md:p-8 rounded-2xl md:rounded-3xl hover:bg-white/15 transition-all duration-300 animate-fade-in-scale">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4 md:mb-6">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-full p-2 md:p-3 w-fit">
              <Target className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl md:text-2xl font-bold text-white">Today's Workout</h2>
              <p className="text-gray-300">{currentDay}</p>
            </div>
          </div>
          
          <div 
            className={`mb-4 md:mb-6 p-4 md:p-6 rounded-xl md:rounded-2xl transition-all duration-300 text-sm md:text-base ${
              todaysRecord.status === "completed" ? "bg-green-500/20 border border-green-400/30 line-through" :
              todaysRecord.status === "rest" ? "bg-purple-500/20 border border-purple-400/30 italic" :
              todaysRecord.status === "missed" ? "bg-red-500/20 border border-red-400/30 line-through" :
              "bg-white/5 border border-white/10"
            }`}
            dangerouslySetInnerHTML={{ __html: formatMarkdownContent(todaysRecord.workout) }}
          />
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 md:gap-4">
            <label className="flex items-center gap-2 md:gap-3 cursor-pointer group flex-1">
              <Checkbox 
                checked={todaysRecord.status === "completed"}
                onCheckedChange={handleWorkoutComplete}
                disabled={todaysRecord.status === "rest"}
                className="w-4 h-4 md:w-5 md:h-5 border-2 border-green-400 data-[state=checked]:bg-green-500"
              />
              <span className="font-medium text-white group-hover:text-green-300 transition-colors text-sm md:text-base">
                Mark Complete
              </span>
            </label>
            <Button 
              onClick={handleRestDay}
              variant="outline"
              className="bg-transparent border-purple-400 text-purple-300 hover:bg-purple-500/20 hover:border-purple-300 text-sm md:text-base"
            >
              {todaysRecord.status === "rest" ? "Clear Rest Day" : "Rest Day"}
            </Button>
          </div>
        </Card>

        {/* Calendar Section - Full width */}
        <Card className="backdrop-blur-xl bg-white/10 border-white/20 p-4 md:p-8 rounded-2xl md:rounded-3xl hover:bg-white/15 transition-all duration-300 animate-fade-in">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 md:mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full p-2 md:p-3">
                <Calendar className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-white">Workout Calendar</h2>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button onClick={() => setShowCalendar(!showCalendar)} variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20 flex-1 sm:flex-none text-xs md:text-sm">
                <Calendar className="w-3 h-3 md:w-4 md:h-4" />
                {showCalendar ? "Hide" : "Show"}
              </Button>
              <Button onClick={() => setShowCalendarModal(true)} variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20 flex-1 sm:flex-none text-xs md:text-sm">
                Full View
              </Button>
            </div>
          </div>
          
          {showCalendar && (
            <>
              <div className="flex justify-between items-center mb-4 md:mb-6">
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
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20 text-xs md:text-sm"
                >
                  ← Previous
                </Button>
                <h3 className="text-lg md:text-xl font-semibold text-white text-center">
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
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20 text-xs md:text-sm"
                >
                  Next →
                </Button>
              </div>
              <div className="grid grid-cols-7 gap-1 md:gap-3">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center text-gray-400 font-medium text-xs md:text-sm p-1 md:p-2">
                    {day}
                  </div>
                ))}
                {renderCalendar()}
              </div>
            </>
          )}
        </Card>

        {/* Workout Plan Editor */}
        <Card className="backdrop-blur-xl bg-white/10 border-white/20 p-4 md:p-8 rounded-2xl md:rounded-3xl hover:bg-white/15 transition-all duration-300 animate-fade-in">
          <Button onClick={() => setShowWorkoutPlan(!showWorkoutPlan)} className="mb-4 md:mb-6 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 shadow-lg text-sm md:text-base">
            <Edit3 className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
            {showWorkoutPlan ? "Hide" : "Edit"} Weekly Workout Plan
          </Button>
          
          {showWorkoutPlan && (
            <div className="animate-slide-up space-y-4 md:space-y-6">
              {Object.entries(workoutPlan).map(([day, content]) => (
                <div key={day} className="space-y-2 md:space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg md:text-xl font-semibold text-white">{day}</h4>
                    <Button
                      onClick={() => setEditingWorkoutDay(editingWorkoutDay === day ? "" : day)}
                      variant="outline"
                      size="sm"
                      className="bg-transparent border-blue-400 text-blue-300 hover:bg-blue-500/20 text-xs md:text-sm"
                    >
                      {editingWorkoutDay === day ? "Save" : "Edit"}
                    </Button>
                  </div>
                  
                  {editingWorkoutDay === day ? (
                    <div className="space-y-2">
                      <Textarea
                        value={content}
                        onChange={(e) => handleWorkoutPlanUpdate(day, e.target.value)}
                        className="bg-white/10 border-white/20 text-white min-h-[120px] md:min-h-[150px] resize-none text-sm md:text-base"
                        placeholder={`Enter ${day}'s workout plan...
Use **bold** for titles and *italic* for emphasis`}
                      />
                      <div className="text-xs text-gray-400">
                        <strong>Tip:</strong> Use **text** for bold, *text* for italic
                      </div>
                    </div>
                  ) : (
                    <div 
                      className="bg-white/5 border border-white/10 p-3 md:p-4 rounded-lg md:rounded-xl text-sm md:text-base leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: formatMarkdownContent(content) }}
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Tips and Pictures row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
          
          {/* Tips Section */}
          <Card className="backdrop-blur-xl bg-white/10 border-white/20 p-4 md:p-8 rounded-2xl md:rounded-3xl hover:bg-white/15 transition-all duration-300 animate-fade-in">
            <div className="flex flex-col sm:flex-row gap-3 mb-4 md:mb-6">
              <Button onClick={() => setShowTips(!showTips)} className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg text-sm md:text-base">
                {showTips ? "Hide Tips" : "Show Tips"}
              </Button>
              {showTips && (
                <Button 
                  onClick={() => setEditingTips(!editingTips)} 
                  variant="outline"
                  className="bg-transparent border-blue-400 text-blue-300 hover:bg-blue-500/20 text-sm md:text-base"
                >
                  <Edit3 className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
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
                      className="mb-3 md:mb-4 bg-white/10 border-white/20 text-white min-h-[150px] md:min-h-[200px] resize-none text-sm md:text-base"
                      placeholder="Enter your fitness tips and notes here..."
                    />
                    <Button onClick={() => setEditingTips(false)} className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-sm md:text-base">
                      Save Tips
                    </Button>
                  </div>
                ) : (
                  <div 
                    className="prose prose-invert max-w-none text-gray-200 leading-relaxed text-sm md:text-base"
                    dangerouslySetInnerHTML={{ __html: tipsContent }}
                  />
                )}
              </div>
            )}
          </Card>

          {/* Pictures Section */}
          <Card className="backdrop-blur-xl bg-white/10 border-white/20 p-4 md:p-8 rounded-2xl md:rounded-3xl hover:bg-white/15 transition-all duration-300 animate-fade-in">
            <div className="flex items-center gap-3 mb-4 md:mb-6">
              <Button onClick={() => setShowPics(!showPics)} className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 shadow-lg text-sm md:text-base">
                <Image className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                {showPics ? "Hide Progress Pics" : "Show Progress Pics"}
              </Button>
            </div>
            
            {showPics && (
              <div className="animate-slide-up">
                <Input 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="mb-4 md:mb-6 bg-white/10 border-white/20 text-white file:bg-blue-500 file:text-white file:border-0 file:rounded-lg text-sm md:text-base"
                />
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
                  {pictures.map((pic, index) => (
                    <div key={index} className="relative group">
                      <img 
                        src={pic} 
                        alt={`Progress ${index + 1}`}
                        className="w-full h-24 md:h-32 object-cover rounded-lg md:rounded-xl cursor-pointer hover:scale-105 transition-all duration-300 shadow-lg"
                        onClick={() => {
                          setEnlargedImage(pic);
                          setShowImageModal(true);
                        }}
                      />
                      <button 
                        onClick={() => setPictures(pictures.filter((_, i) => i !== index))}
                        className="absolute top-1 right-1 md:top-2 md:right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 md:w-8 md:h-8 text-xs md:text-sm opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Controls - Full width */}
        <Card className="backdrop-blur-xl bg-white/10 border-white/20 p-4 md:p-8 rounded-2xl md:rounded-3xl hover:bg-white/15 transition-all duration-300 animate-fade-in">
          <h3 className="text-lg md:text-xl font-bold text-white mb-4 md:mb-6">App Controls</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 md:gap-4">
            <Button 
              onClick={exportData}
              className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 shadow-lg text-xs md:text-sm"
            >
              <Download className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
              Export
            </Button>
            
            <Button onClick={() => setShowDeveloperModal(true)} className="bg-gradient-to-r from-gray-500 to-slate-600 hover:from-gray-600 hover:to-slate-700 shadow-lg text-xs md:text-sm">
              <Settings className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
              Developer
            </Button>
            
            <Button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 shadow-lg text-xs md:text-sm"
            >
              {isDarkMode ? <Sun className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" /> : <Moon className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />}
              Theme
            </Button>
            
            <Button onClick={() => setShowColorModal(true)} className="bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 shadow-lg text-xs md:text-sm">
              <Palette className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
              Colors
            </Button>
            
            <Button 
              onClick={() => setIsMobileView(!isMobileView)}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-lg text-xs md:text-sm"
            >
              {isMobileView ? <Monitor className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" /> : <Smartphone className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />}
              Layout
            </Button>
            
            <Button 
              onClick={() => {
                if (confirm("⚠️ This will delete ALL your data. Are you sure?")) {
                  localStorage.clear();
                  window.location.reload();
                }
              }}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg text-xs md:text-sm"
            >
              <RefreshCw className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
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
