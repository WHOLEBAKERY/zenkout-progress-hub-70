import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Download, Edit3, Upload, RefreshCw, Settings, Moon, Sun, Palette, Image, Smartphone, Monitor, User, Activity, Clock, Target, Save, X } from 'lucide-react';
import ProfileModal from '@/components/ProfileModal';
import ColorSchemeModal from '@/components/ColorSchemeModal';
import DeveloperModal from '@/components/DeveloperModal';
import CalendarModal from '@/components/CalendarModal';
import ImageModal from '@/components/ImageModal';
import { useToast } from "@/hooks/use-toast";

// Define types for better TypeScript support
interface WorkoutRecord {
  workout: string;
  status: "pending" | "completed" | "missed" | "rest";
}

interface WorkoutRecords {
  [dateKey: string]: WorkoutRecord;
}

interface WorkoutPlan {
  [day: string]: string;
}

const Index = () => {
  const { toast } = useToast();

  // Default workout plan
  const defaultWorkoutPlan = useMemo(() => ({
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
  }), []);

  // State management with proper typing
  const [profile, setProfile] = useState(() => JSON.parse(localStorage.getItem("profile") || "null"));
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan>(() => JSON.parse(localStorage.getItem("workoutPlan") || JSON.stringify(defaultWorkoutPlan)));
  const [workoutRecords, setWorkoutRecords] = useState<WorkoutRecords>(() => JSON.parse(localStorage.getItem("workoutRecords") || "{}"));
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
  const [tempWorkoutContent, setTempWorkoutContent] = useState("");

  // Countdown timer
  const [countdown, setCountdown] = useState("");
  const [missedTimer, setMissedTimer] = useState("");

  // Memoized utility functions
  const getTodayKey = useCallback(() => new Date().toISOString().split("T")[0], []);
  
  const getCurrentDayName = useCallback(() => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return days[new Date().getDay()];
  }, []);

  const recalcDaysWorkedOut = useMemo(() => {
    return Object.values(workoutRecords).filter((record: WorkoutRecord) => record?.status === "completed").length;
  }, [workoutRecords]);

  // Memoized values
  const todayKey = useMemo(() => getTodayKey(), [getTodayKey]);
  const currentDay = useMemo(() => getCurrentDayName(), [getCurrentDayName]);
  
  const todaysRecord = useMemo(() => {
    return workoutRecords[todayKey] || { 
      workout: workoutPlan[currentDay] || "No workout assigned", 
      status: "pending" 
    };
  }, [workoutRecords, todayKey, workoutPlan, currentDay]);

  // Optimized save function
  const saveLocalStorage = useCallback(() => {
    localStorage.setItem("profile", JSON.stringify(profile));
    localStorage.setItem("workoutPlan", JSON.stringify(workoutPlan));
    localStorage.setItem("workoutRecords", JSON.stringify(workoutRecords));
    localStorage.setItem("tipsContent", tipsContent);
    localStorage.setItem("pictures", JSON.stringify(pictures));
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [profile, workoutPlan, workoutRecords, tipsContent, pictures, isDarkMode]);

  // Memoized event handlers
  const handleWorkoutComplete = useCallback((checked: boolean) => {
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
  }, [workoutRecords, todayKey, todaysRecord, toast]);

  const handleRestDay = useCallback(() => {
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
  }, [workoutRecords, todaysRecord, todayKey, workoutPlan, currentDay, toast]);

  // Timer update with reduced frequency
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

  // Optimized localStorage save
  useEffect(() => {
    const timeoutId = setTimeout(saveLocalStorage, 300); // Debounce saves
    return () => clearTimeout(timeoutId);
  }, [saveLocalStorage]);

  // Initialize
  useEffect(() => {
    if (!profile) {
      setShowProfileModal(true);
    }
  }, [profile]);

  // Calendar rendering with improved mobile layout
  const renderCalendar = useCallback(() => {
    const firstDay = new Date(calendarDisplayYear, calendarDisplayMonth, 1).getDay();
    const daysInMonth = new Date(calendarDisplayYear, calendarDisplayMonth + 1, 0).getDate();
    const cells = [];

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      cells.push(<div key={`empty-${i}`} className="aspect-square"></div>);
    }

    // Days of the month
    for (let d = 1; d <= daysInMonth; d++) {
      const cellDate = new Date(calendarDisplayYear, calendarDisplayMonth, d);
      const dateKey = cellDate.toISOString().split("T")[0];
      const record = workoutRecords[dateKey];
      const isToday = dateKey === todayKey;
      
      let bgColor = "bg-slate-800/40 hover:bg-slate-700/60";
      let borderColor = "border-slate-600/50";
      let textColor = "text-slate-200";
      
      if (record?.status === "completed") {
        bgColor = "bg-emerald-500/30 hover:bg-emerald-500/50";
        borderColor = "border-emerald-400/60";
        textColor = "text-emerald-100";
      } else if (record?.status === "missed") {
        bgColor = "bg-red-500/30 hover:bg-red-500/50";
        borderColor = "border-red-400/60";
        textColor = "text-red-100";
      } else if (record?.status === "rest") {
        bgColor = "bg-violet-500/30 hover:bg-violet-500/50";
        borderColor = "border-violet-400/60";
        textColor = "text-violet-100";
      }

      if (isToday) {
        borderColor = "border-cyan-400 border-2";
        bgColor += " ring-2 ring-cyan-400/40";
      }

      cells.push(
        <div key={d} className={`aspect-square rounded-xl border ${borderColor} ${bgColor} text-center relative hover:scale-105 transition-all duration-300 cursor-pointer group flex flex-col items-center justify-center p-1`}>
          <div className={`font-bold text-lg ${textColor} ${isToday ? 'text-cyan-300' : ''}`}>{d}</div>
          <div className="flex gap-1 mt-1">
            {record?.status === "completed" && <div className="text-emerald-400 text-lg">✓</div>}
            {record?.status === "rest" && <div className="text-violet-400 text-lg">💤</div>}
            {record?.status === "missed" && <div className="text-red-400 text-lg">✗</div>}
            {isToday && <div className="text-cyan-400 text-lg">●</div>}
          </div>
        </div>
      );
    }

    return cells;
  }, [calendarDisplayYear, calendarDisplayMonth, workoutRecords, todayKey]);

  const handleWorkoutPlanEdit = useCallback((day: string) => {
    setEditingWorkoutDay(day);
    setTempWorkoutContent(workoutPlan[day] || "");
  }, [workoutPlan]);

  const handleWorkoutPlanSave = useCallback((day: string) => {
    const newWorkoutPlan = {
      ...workoutPlan,
      [day]: tempWorkoutContent
    };
    setWorkoutPlan(newWorkoutPlan);
    setEditingWorkoutDay("");
    setTempWorkoutContent("");
    
    // Update today's record if we're editing today's workout
    if (day === currentDay) {
      const newRecords = { ...workoutRecords };
      if (newRecords[todayKey]) {
        newRecords[todayKey] = {
          ...newRecords[todayKey],
          workout: tempWorkoutContent
        };
        setWorkoutRecords(newRecords);
      }
    }
    
    toast({
      title: "Workout Plan Updated! ✅",
      description: `${day}'s workout has been successfully saved.`,
    });
  }, [workoutPlan, tempWorkoutContent, currentDay, workoutRecords, todayKey, toast]);

  const handleWorkoutPlanCancel = useCallback(() => {
    setEditingWorkoutDay("");
    setTempWorkoutContent("");
  }, []);

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
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
        setPictures(prev => [...prev, evt.target?.result as string]);
        toast({
          title: "Image uploaded! 📸",
          description: "Your progress photo has been added",
        });
      };
      reader.readAsDataURL(file);
    }
  }, [toast]);

  const exportData = useCallback(() => {
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
  }, [profile, workoutPlan, workoutRecords, tipsContent, pictures, toast]);

  const formatMarkdownContent = useCallback((content: string) => {
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br>');
  }, []);

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 text-white transition-all duration-500 ${isDarkMode ? 'dark' : ''}`}>
      {/* Enhanced animated background overlay */}
      <div className="fixed inset-0 bg-[url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&h=1080&fit=crop')] bg-cover bg-center opacity-5 -z-10"></div>
      <div className="fixed inset-0 bg-gradient-to-br from-cyan-900/20 via-violet-900/30 to-slate-900/40 -z-10 animate-gradient"></div>
      
      {/* Floating particles effect */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-cyan-400/20 rounded-full animate-ping"></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-violet-400/30 rounded-full animate-pulse"></div>
        <div className="absolute top-1/2 left-3/4 w-3 h-3 bg-emerald-400/10 rounded-full animate-bounce"></div>
      </div>
      
      {/* Header */}
      <header className="text-center py-8 md:py-16 animate-fade-in px-4">
        <h1 className="text-5xl md:text-8xl font-black bg-gradient-to-r from-cyan-400 via-violet-500 to-emerald-400 bg-clip-text text-transparent mb-4 md:mb-6 animate-gradient tracking-tight">
          ZENKED
        </h1>
        <p className="text-xl md:text-3xl text-slate-300 font-light mb-2">Your Elite Workout Portfolio</p>
        <div className="flex justify-center items-center gap-3 mt-4 md:mt-6 text-sm md:text-lg text-slate-400">
          <Activity className="w-4 h-4 md:w-5 md:h-5 text-cyan-400" />
          <span className="tracking-wide">TRACK • PROGRESS • DOMINATE</span>
          <Activity className="w-4 h-4 md:w-5 md:h-5 text-emerald-400" />
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 pb-8 md:pb-16 space-y-6 md:space-y-10">
        
        {/* Mobile-first grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-10">
          
          {/* Profile Section */}
          <Card className="backdrop-blur-2xl bg-gradient-to-br from-slate-800/40 to-slate-900/60 border-slate-600/30 p-6 md:p-10 rounded-3xl md:rounded-4xl hover:bg-slate-800/60 transition-all duration-500 hover:scale-[1.02] animate-fade-in-scale shadow-2xl">
            <div className="flex flex-col sm:flex-row items-center gap-6 md:gap-8">
              <div className="relative">
                <img 
                  src={profile?.picture || "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&h=100&fit=crop&crop=face"} 
                  alt="Profile" 
                  className="w-20 h-20 md:w-28 md:h-28 rounded-full border-4 border-cyan-400 object-cover ring-4 ring-cyan-400/20 shadow-lg"
                />
                <div className="absolute -bottom-2 -right-2 md:-bottom-3 md:-right-3 bg-gradient-to-r from-cyan-500 to-violet-500 rounded-full p-2 md:p-3 shadow-lg">
                  <User className="w-4 h-4 md:w-5 md:h-5 text-white" />
                </div>
              </div>
              <div className="flex-1 text-center sm:text-left">
                <div className="space-y-2 md:space-y-3 text-sm md:text-base text-slate-300">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <span className="font-semibold text-white">Name:</span> 
                    <span className="text-cyan-300">{profile?.name || "Set up profile"}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <span className="font-semibold text-white">Age:</span> 
                    <span className="text-emerald-300">{profile?.age || "N/A"}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <span className="font-semibold text-white">Height:</span> 
                    <span className="text-violet-300">{profile?.height || "N/A"}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <span className="font-semibold text-white">Weight:</span> 
                    <span className="text-orange-300">{profile?.weight || "N/A"}</span>
                  </div>
                </div>
                <Button onClick={() => setShowProfileModal(true)} className="mt-4 md:mt-6 w-full sm:w-auto bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-600 hover:to-violet-700 border-0 shadow-xl text-sm md:text-base font-semibold">
                  <Edit3 className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                  Edit Profile
                </Button>
              </div>
            </div>
          </Card>

          {/* Countdown Timer */}
          <Card className="backdrop-blur-2xl bg-gradient-to-br from-slate-800/40 to-slate-900/60 border-slate-600/30 p-6 md:p-10 rounded-3xl md:rounded-4xl text-center hover:bg-slate-800/60 transition-all duration-500 animate-slide-up shadow-2xl">
            <div className="bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-2xl p-4 md:p-5 w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 md:mb-6 shadow-lg">
              <Clock className="w-8 h-8 md:w-10 md:h-10 text-white" />
            </div>
            <div className="text-lg md:text-xl text-slate-300 mb-2 md:mb-3 font-medium">Today is {currentDay}</div>
            <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-white">Reset In:</h2>
            <div className="text-3xl md:text-4xl font-black text-cyan-400 mb-2 md:mb-4 font-mono tracking-wider">{countdown}</div>
            <div className="text-red-400 text-sm md:text-base font-medium">Auto-miss in: <span className="font-mono text-red-300">{missedTimer}</span></div>
          </Card>

          {/* Days Worked Out */}
          <Card className="backdrop-blur-2xl bg-gradient-to-br from-slate-800/40 to-slate-900/60 border-slate-600/30 p-6 md:p-10 rounded-3xl md:rounded-4xl text-center hover:bg-slate-800/60 transition-all duration-500 hover:scale-[1.02] animate-slide-up shadow-2xl">
            <div className="bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl p-4 md:p-5 w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 md:mb-6 shadow-lg">
              <Activity className="w-8 h-8 md:w-10 md:h-10 text-white" />
            </div>
            <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-white">Days Worked Out</h2>
            <div className="text-5xl md:text-7xl font-black text-emerald-400 mb-2 md:mb-3 tracking-tight">{recalcDaysWorkedOut}</div>
            <div className="text-slate-300 text-sm md:text-base font-medium">Total completed workouts</div>
          </Card>
        </div>

        {/* Daily Workout - Full width */}
        <Card className="backdrop-blur-2xl bg-gradient-to-br from-slate-800/40 to-slate-900/60 border-slate-600/30 p-6 md:p-10 rounded-3xl md:rounded-4xl hover:bg-slate-800/60 transition-all duration-500 animate-fade-in-scale shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6 md:mb-8">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-3 md:p-4 w-fit shadow-lg">
              <Target className="w-6 h-6 md:w-8 md:h-8 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl md:text-3xl font-black text-white mb-1">Today's Workout</h2>
              <p className="text-slate-300 text-lg">{currentDay}</p>
            </div>
          </div>
          
          <div 
            className={`mb-6 md:mb-8 p-6 md:p-8 rounded-2xl md:rounded-3xl transition-all duration-300 text-sm md:text-base leading-relaxed ${
              todaysRecord.status === "completed" ? "bg-emerald-500/20 border-2 border-emerald-400/40 line-through" :
              todaysRecord.status === "rest" ? "bg-violet-500/20 border-2 border-violet-400/40 italic" :
              todaysRecord.status === "missed" ? "bg-red-500/20 border-2 border-red-400/40 line-through" :
              "bg-slate-700/30 border-2 border-slate-600/30"
            }`}
            dangerouslySetInnerHTML={{ __html: formatMarkdownContent(todaysRecord.workout) }}
          />
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 md:gap-6">
            <label className="flex items-center gap-3 md:gap-4 cursor-pointer group flex-1">
              <Checkbox 
                checked={todaysRecord.status === "completed"}
                onCheckedChange={handleWorkoutComplete}
                disabled={todaysRecord.status === "rest"}
                className="w-5 h-5 md:w-6 md:h-6 border-2 border-emerald-400 data-[state=checked]:bg-emerald-500 shadow-lg"
              />
              <span className="font-semibold text-white group-hover:text-emerald-300 transition-colors text-base md:text-lg">
                Mark Complete
              </span>
            </label>
            <Button 
              onClick={handleRestDay}
              variant="outline"
              className="bg-transparent border-2 border-violet-400 text-violet-300 hover:bg-violet-500/20 hover:border-violet-300 text-base md:text-lg font-semibold px-6 py-3"
            >
              {todaysRecord.status === "rest" ? "Clear Rest Day" : "Rest Day"}
            </Button>
          </div>
        </Card>

        {/* Calendar Section - Full width with improved mobile layout */}
        <Card className="backdrop-blur-2xl bg-gradient-to-br from-slate-800/40 to-slate-900/60 border-slate-600/30 p-6 md:p-10 rounded-3xl md:rounded-4xl hover:bg-slate-800/60 transition-all duration-500 animate-fade-in shadow-2xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-r from-indigo-500 to-violet-500 rounded-2xl p-3 md:p-4 shadow-lg">
                <Calendar className="w-6 h-6 md:w-8 md:h-8 text-white" />
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-white">Workout Calendar</h2>
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
              <Button onClick={() => setShowCalendar(!showCalendar)} variant="outline" size="sm" className="bg-slate-700/50 border-slate-500/50 text-white hover:bg-slate-600/50 flex-1 sm:flex-none text-sm md:text-base font-semibold">
                <Calendar className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                {showCalendar ? "Hide" : "Show"}
              </Button>
              <Button onClick={() => setShowCalendarModal(true)} variant="outline" size="sm" className="bg-slate-700/50 border-slate-500/50 text-white hover:bg-slate-600/50 flex-1 sm:flex-none text-sm md:text-base font-semibold">
                Full View
              </Button>
            </div>
          </div>
          
          {showCalendar && (
            <>
              <div className="flex justify-between items-center mb-6 md:mb-8">
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
                  className="bg-slate-700/50 border-slate-500/50 text-white hover:bg-slate-600/50 text-sm md:text-base font-semibold px-4 py-2"
                >
                  ← Previous
                </Button>
                <h3 className="text-xl md:text-2xl font-bold text-white text-center">
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
                  className="bg-slate-700/50 border-slate-500/50 text-white hover:bg-slate-600/50 text-sm md:text-base font-semibold px-4 py-2"
                >
                  Next →
                </Button>
              </div>
              
              {/* Improved mobile calendar layout */}
              <div className="grid grid-cols-7 gap-2 md:gap-4">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                  <div key={`day-${index}`} className="text-center text-slate-400 font-bold text-sm md:text-lg p-2 md:p-3 hidden sm:block">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][index]}
                  </div>
                ))}
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                  <div key={`mobile-day-${index}`} className="text-center text-slate-400 font-bold text-sm p-2 sm:hidden">
                    {day}
                  </div>
                ))}
                {renderCalendar()}
              </div>
            </>
          )}
        </Card>

        {/* Workout Plan Editor with improved editing interface */}
        <Card className="backdrop-blur-2xl bg-gradient-to-br from-slate-800/40 to-slate-900/60 border-slate-600/30 p-6 md:p-10 rounded-3xl md:rounded-4xl hover:bg-slate-800/60 transition-all duration-500 animate-fade-in shadow-2xl">
          <Button onClick={() => setShowWorkoutPlan(!showWorkoutPlan)} className="mb-6 md:mb-8 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 shadow-xl text-base md:text-lg font-bold px-6 py-3">
            <Edit3 className="w-5 h-5 md:w-6 md:h-6 mr-2" />
            {showWorkoutPlan ? "Hide" : "Edit"} Weekly Workout Plan
          </Button>
          
          {showWorkoutPlan && (
            <div className="animate-slide-up space-y-6 md:space-y-8">
              {Object.entries(workoutPlan).map(([day, content]) => (
                <div key={day} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xl md:text-2xl font-bold text-white">{day}</h4>
                    <div className="flex gap-2">
                      {editingWorkoutDay === day ? (
                        <>
                          <Button
                            onClick={() => handleWorkoutPlanSave(day)}
                            size="sm"
                            className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold"
                          >
                            <Save className="w-4 h-4 mr-2" />
                            Save
                          </Button>
                          <Button
                            onClick={handleWorkoutPlanCancel}
                            variant="outline"
                            size="sm"
                            className="bg-transparent border-red-400 text-red-300 hover:bg-red-500/20"
                          >
                            <X className="w-4 h-4 mr-2" />
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <Button
                          onClick={() => handleWorkoutPlanEdit(day)}
                          variant="outline"
                          size="sm"
                          className="bg-transparent border-cyan-400 text-cyan-300 hover:bg-cyan-500/20 font-semibold"
                        >
                          <Edit3 className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  {editingWorkoutDay === day ? (
                    <div className="space-y-3">
                      <Textarea
                        value={tempWorkoutContent}
                        onChange={(e) => setTempWorkoutContent(e.target.value)}
                        className="bg-slate-700/50 border-slate-500/50 text-white min-h-[180px] md:min-h-[220px] resize-none text-sm md:text-base font-mono leading-relaxed"
                        placeholder={`Enter ${day}'s workout plan...
Use **bold** for titles and *italic* for emphasis`}
                      />
                      <div className="text-sm text-slate-400 bg-slate-800/30 p-3 rounded-lg">
                        <strong>Formatting Tips:</strong> Use **text** for bold, *text* for italic
                      </div>
                    </div>
                  ) : (
                    <div 
                      className="bg-slate-700/30 border-2 border-slate-600/30 p-4 md:p-6 rounded-2xl text-sm md:text-base leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: formatMarkdownContent(content) }}
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Tips and Pictures row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10">
          
          {/* Tips Section */}
          <Card className="backdrop-blur-2xl bg-gradient-to-br from-slate-800/40 to-slate-900/60 border-slate-600/30 p-6 md:p-10 rounded-3xl md:rounded-4xl hover:bg-slate-800/60 transition-all duration-500 animate-fade-in shadow-2xl">
            <div className="flex flex-col sm:flex-row gap-4 mb-6 md:mb-8">
              <Button onClick={() => setShowTips(!showTips)} className="bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-600 hover:to-cyan-700 shadow-xl text-base md:text-lg font-bold">
                {showTips ? "Hide Tips" : "Show Tips"}
              </Button>
              {showTips && (
                <Button 
                  onClick={() => setEditingTips(!editingTips)} 
                  variant="outline"
                  className="bg-transparent border-2 border-cyan-400 text-cyan-300 hover:bg-cyan-500/20 text-base md:text-lg font-semibold"
                >
                  <Edit3 className="w-4 h-4 md:w-5 md:h-5 mr-2" />
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
                      className="mb-4 md:mb-6 bg-slate-700/50 border-slate-500/50 text-white min-h-[200px] md:min-h-[250px] resize-none text-sm md:text-base leading-relaxed"
                      placeholder="Enter your fitness tips and notes here..."
                    />
                    <Button onClick={() => setEditingTips(false)} className="bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-600 hover:to-violet-700 text-base md:text-lg font-bold">
                      Save Tips
                    </Button>
                  </div>
                ) : (
                  <div 
                    className="prose prose-invert max-w-none text-slate-200 leading-relaxed text-sm md:text-base"
                    dangerouslySetInnerHTML={{ __html: tipsContent }}
                  />
                )}
              </div>
            )}
          </Card>

          {/* Pictures Section */}
          <Card className="backdrop-blur-2xl bg-gradient-to-br from-slate-800/40 to-slate-900/60 border-slate-600/30 p-6 md:p-10 rounded-3xl md:rounded-4xl hover:bg-slate-800/60 transition-all duration-500 animate-fade-in shadow-2xl">
            <div className="flex items-center gap-4 mb-6 md:mb-8">
              <Button onClick={() => setShowPics(!showPics)} className="bg-gradient-to-r from-violet-500 to-pink-600 hover:from-violet-600 hover:to-pink-700 shadow-xl text-base md:text-lg font-bold">
                <Image className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                {showPics ? "Hide Progress Pics" : "Show Progress Pics"}
              </Button>
            </div>
            
            {showPics && (
              <div className="animate-slide-up">
                <Input 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="mb-6 md:mb-8 bg-slate-700/50 border-slate-500/50 text-white file:bg-cyan-500 file:text-white file:border-0 file:rounded-xl text-sm md:text-base"
                />
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                  {pictures.map((pic, index) => (
                    <div key={index} className="relative group">
                      <img 
                        src={pic} 
                        alt={`Progress ${index + 1}`}
                        className="w-full h-28 md:h-36 object-cover rounded-xl md:rounded-2xl cursor-pointer hover:scale-105 transition-all duration-300 shadow-xl"
                        onClick={() => {
                          setEnlargedImage(pic);
                          setShowImageModal(true);
                        }}
                      />
                      <button 
                        onClick={() => setPictures(pictures.filter((_, i) => i !== index))}
                        className="absolute top-2 right-2 md:top-3 md:right-3 bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 md:w-10 md:h-10 text-sm md:text-base opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center font-bold shadow-lg"
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
        <Card className="backdrop-blur-2xl bg-gradient-to-br from-slate-800/40 to-slate-900/60 border-slate-600/30 p-6 md:p-10 rounded-3xl md:rounded-4xl hover:bg-slate-800/60 transition-all duration-500 animate-fade-in shadow-2xl">
          <h3 className="text-xl md:text-2xl font-black text-white mb-6 md:mb-8">App Controls</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
            <Button 
              onClick={exportData}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 shadow-xl text-sm md:text-base font-bold"
            >
              <Download className="w-4 h-4 md:w-5 md:h-5 mr-2" />
              Export
            </Button>
            
            <Button onClick={() => setShowDeveloperModal(true)} className="bg-gradient-to-r from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700 shadow-xl text-sm md:text-base font-bold">
              <Settings className="w-4 h-4 md:w-5 md:h-5 mr-2" />
              Developer
            </Button>
            
            <Button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 shadow-xl text-sm md:text-base font-bold"
            >
              {isDarkMode ? <Sun className="w-4 h-4 md:w-5 md:h-5 mr-2" /> : <Moon className="w-4 h-4 md:w-5 md:h-5 mr-2" />}
              Theme
            </Button>
            
            <Button onClick={() => setShowColorModal(true)} className="bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 shadow-xl text-sm md:text-base font-bold">
              <Palette className="w-4 h-4 md:w-5 md:h-5 mr-2" />
              Colors
            </Button>
            
            <Button 
              onClick={() => setIsMobileView(!isMobileView)}
              className="bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 shadow-xl text-sm md:text-base font-bold"
            >
              {isMobileView ? <Monitor className="w-4 h-4 md:w-5 md:h-5 mr-2" /> : <Smartphone className="w-4 h-4 md:w-5 md:h-5 mr-2" />}
              Layout
            </Button>
            
            <Button 
              onClick={() => {
                if (confirm("⚠️ This will delete ALL your data. Are you sure?")) {
                  localStorage.clear();
                  window.location.reload();
                }
              }}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-xl text-sm md:text-base font-bold"
            >
              <RefreshCw className="w-4 h-4 md:w-5 md:h-5 mr-2" />
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
