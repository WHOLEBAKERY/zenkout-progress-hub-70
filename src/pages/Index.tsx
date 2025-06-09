
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Play, 
  Calendar, 
  TrendingUp, 
  Users, 
  Star, 
  Download,
  ChevronLeft,
  ChevronRight,
  Dumbbell,
  Target,
  Trophy,
  Heart,
  Zap,
  Clock
} from 'lucide-react';
import WorkoutCard from '@/components/WorkoutCard';
import ProgressChart from '@/components/ProgressChart';
import TestimonialCarousel from '@/components/TestimonialCarousel';
import ContactForm from '@/components/ContactForm';

const Index = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const workoutCategories = [
    { id: 'all', name: 'All Workouts', count: 12 },
    { id: 'strength', name: 'Strength', count: 4 },
    { id: 'hiit', name: 'HIIT', count: 3 },
    { id: 'flexibility', name: 'Flexibility', count: 3 },
    { id: 'endurance', name: 'Endurance', count: 2 }
  ];

  const workouts = [
    {
      id: 1,
      title: 'Upper Body Power',
      description: 'Build strength in chest, shoulders, and arms with compound movements',
      duration: '45 min',
      difficulty: 'Intermediate',
      category: 'strength',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop'
    },
    {
      id: 2,
      title: 'HIIT Cardio Blast',
      description: 'High-intensity intervals for maximum calorie burn',
      duration: '30 min',
      difficulty: 'Advanced',
      category: 'hiit',
      image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=300&fit=crop'
    },
    {
      id: 3,
      title: 'Morning Yoga Flow',
      description: 'Gentle stretches to start your day with energy',
      duration: '25 min',
      difficulty: 'Beginner',
      category: 'flexibility',
      image: 'https://images.unsplash.com/photo-1506629905607-afb20c1384d4?w=400&h=300&fit=crop'
    },
    {
      id: 4,
      title: 'Lower Body Strength',
      description: 'Target glutes, quads, and hamstrings for powerful legs',
      duration: '50 min',
      difficulty: 'Intermediate',
      category: 'strength',
      image: 'https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a?w=400&h=300&fit=crop'
    },
    {
      id: 5,
      title: 'Endurance Runner',
      description: 'Build cardiovascular endurance and stamina',
      duration: '40 min',
      difficulty: 'Advanced',
      category: 'endurance',
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop'
    },
    {
      id: 6,
      title: 'Core Stability',
      description: 'Strengthen your core with targeted exercises',
      duration: '20 min',
      difficulty: 'Intermediate',
      category: 'strength',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Fitness Enthusiast',
      content: 'ZENKED transformed my workout routine completely. The personalized plans and progress tracking kept me motivated every single day.',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b25a019c?w=100&h=100&fit=crop&crop=face',
      rating: 5
    },
    {
      name: 'Mike Chen',
      role: 'Professional Athlete',
      content: 'The variety of workouts and expert coaching helped me break through my fitness plateau. Incredible results in just 3 months.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      rating: 5
    },
    {
      name: 'Emily Rodriguez',
      role: 'Busy Professional',
      content: 'Finally found a program that fits my schedule. The flexibility and efficiency of ZENKED workouts are unmatched.',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      rating: 5
    }
  ];

  const filteredWorkouts = selectedCategory === 'all' 
    ? workouts 
    : workouts.filter(workout => workout.category === selectedCategory);

  return (
    <div className="min-h-screen bg-slate-900 text-white overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&h=1080&fit=crop')`
          }}
        />
        <div className={`relative z-10 text-center px-6 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            ZENKED
          </h1>
          <p className="text-xl md:text-2xl mb-4 text-gray-200">
            Workout Portfolio
          </p>
          <p className="text-lg md:text-xl mb-8 text-gray-300 max-w-2xl mx-auto">
            Transform Your Body | Track Your Progress | Achieve Your Goals
          </p>
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 px-8 py-6 text-lg rounded-2xl shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105"
          >
            <Play className="mr-2 h-5 w-5" />
            Get Started
          </Button>
        </div>
      </section>

      {/* About & Philosophy Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className={`transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                  About ZENKED
                </h2>
                <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                  ZENKED is more than just a workout program - it's a complete fitness transformation system designed to help you achieve your peak physical potential through scientifically-backed training methods and personalized coaching.
                </p>
                <p className="text-lg text-gray-300 leading-relaxed">
                  Our philosophy centers on sustainable progress, mind-body connection, and creating lasting healthy habits that extend far beyond the gym.
                </p>
              </div>
              <div className="relative">
                <Card className="backdrop-blur-lg bg-white/10 border-white/20 p-8 rounded-3xl shadow-2xl">
                  <div className="flex items-center space-x-4 mb-6">
                    <Avatar className="h-16 w-16 border-2 border-blue-400">
                      <AvatarImage src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop&crop=face" />
                      <AvatarFallback>ZK</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-xl font-semibold text-white">Alex Thompson</h3>
                      <p className="text-blue-400">Head Trainer & Founder</p>
                    </div>
                  </div>
                  <p className="text-gray-300">
                    "Every journey starts with a single step. At ZENKED, we make sure every step counts towards your ultimate transformation."
                  </p>
                </Card>
              </div>
            </div>

            {/* Why ZENKED Features */}
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="backdrop-blur-lg bg-white/10 border-white/20 p-8 rounded-3xl shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 hover:scale-105">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Target className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-4">Personalized Plans</h3>
                  <p className="text-gray-300 leading-relaxed">
                    Tailored workout routines designed specifically for your fitness level, goals, and available time.
                  </p>
                </div>
              </Card>
              
              <Card className="backdrop-blur-lg bg-white/10 border-white/20 p-8 rounded-3xl shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 hover:scale-105">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <TrendingUp className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-4">Progress Tracking</h3>
                  <p className="text-gray-300 leading-relaxed">
                    Advanced analytics and visual progress reports to keep you motivated and on track.
                  </p>
                </div>
              </Card>
              
              <Card className="backdrop-blur-lg bg-white/10 border-white/20 p-8 rounded-3xl shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 hover:scale-105">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-4">Expert Coaching</h3>
                  <p className="text-gray-300 leading-relaxed">
                    Professional guidance from certified trainers with years of experience in fitness transformation.
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Workout Library Section */}
      <section className="py-20 px-6 bg-slate-800/50">
        <div className="max-w-6xl mx-auto">
          <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Workout Library
              </h2>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                Discover our comprehensive collection of expertly crafted workouts designed to challenge and transform you.
              </p>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {workoutCategories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`rounded-2xl px-6 py-3 transition-all duration-300 ${
                    selectedCategory === category.id
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 shadow-lg'
                      : 'bg-transparent border-white/20 text-gray-300 hover:border-blue-400 hover:text-blue-400'
                  }`}
                >
                  {category.name}
                  <Badge className="ml-2 bg-white/20 text-white border-0">
                    {category.count}
                  </Badge>
                </Button>
              ))}
            </div>

            {/* Workout Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredWorkouts.map((workout, index) => (
                <WorkoutCard key={workout.id} workout={workout} delay={index * 100} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Progress Tracker Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className={`transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Track Your Progress
              </h2>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                Visualize your transformation journey with detailed analytics and progress tracking.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <Card className="backdrop-blur-lg bg-white/10 border-white/20 p-8 rounded-3xl shadow-2xl">
                <ProgressChart />
              </Card>
              
              <div className="space-y-8">
                <Card className="backdrop-blur-lg bg-white/10 border-white/20 p-6 rounded-3xl shadow-2xl">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                      <Trophy className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">Workouts Completed</h3>
                      <p className="text-2xl font-bold text-green-400">127</p>
                    </div>
                  </div>
                  <Progress value={85} className="h-2 bg-slate-700" />
                </Card>

                <Card className="backdrop-blur-lg bg-white/10 border-white/20 p-6 rounded-3xl shadow-2xl">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
                      <Zap className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">Calories Burned</h3>
                      <p className="text-2xl font-bold text-blue-400">15,420</p>
                    </div>
                  </div>
                  <Progress value={67} className="h-2 bg-slate-700" />
                </Card>

                <Card className="backdrop-blur-lg bg-white/10 border-white/20 p-6 rounded-3xl shadow-2xl">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                      <Clock className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">Total Hours</h3>
                      <p className="text-2xl font-bold text-purple-400">94.5</p>
                    </div>
                  </div>
                  <Progress value={72} className="h-2 bg-slate-700" />
                </Card>

                <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 py-4 rounded-2xl shadow-xl">
                  <Download className="mr-2 h-5 w-5" />
                  Export Progress Report
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-6 bg-slate-800/50">
        <div className="max-w-4xl mx-auto">
          <div className={`transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Success Stories
              </h2>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                Real transformations from real people who trusted ZENKED with their fitness journey.
              </p>
            </div>

            <TestimonialCarousel testimonials={testimonials} />
          </div>
        </div>
      </section>

      {/* Contact & Sign-Up Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className={`transition-all duration-1000 delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Start Your Journey
              </h2>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                Ready to transform your life? Get started with a personalized fitness plan today.
              </p>
            </div>

            <ContactForm />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-slate-900 border-t border-slate-800">
        <div className="max-w-6xl mx-auto text-center">
          <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            ZENKED
          </h3>
          <p className="text-gray-400 mb-6">Transform Your Body | Track Your Progress | Achieve Your Goals</p>
          <div className="flex justify-center space-x-6">
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-blue-400">
              Privacy Policy
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-blue-400">
              Terms of Service
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-blue-400">
              Contact
            </Button>
          </div>
          <p className="text-gray-500 text-sm mt-6">
            © 2024 ZENKED. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
