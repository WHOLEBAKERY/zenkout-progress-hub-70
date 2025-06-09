
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, User, Target, Send } from 'lucide-react';
import { toast } from "sonner";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    goal: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast.success("Thank you! We'll be in touch soon to start your transformation journey.");
    setFormData({ name: '', email: '', goal: '', message: '' });
    setIsSubmitting(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="backdrop-blur-lg bg-white/10 border-white/20 p-8 rounded-3xl shadow-2xl max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>Full Name</span>
            </label>
            <Input
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter your full name"
              className="bg-white/5 border-white/20 text-white placeholder:text-gray-400 rounded-2xl focus:border-blue-400 focus:ring-blue-400/20"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 flex items-center space-x-2">
              <Mail className="h-4 w-4" />
              <span>Email Address</span>
            </label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="Enter your email"
              className="bg-white/5 border-white/20 text-white placeholder:text-gray-400 rounded-2xl focus:border-blue-400 focus:ring-blue-400/20"
              required
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300 flex items-center space-x-2">
            <Target className="h-4 w-4" />
            <span>Fitness Goal</span>
          </label>
          <Select value={formData.goal} onValueChange={(value) => handleInputChange('goal', value)}>
            <SelectTrigger className="bg-white/5 border-white/20 text-white rounded-2xl focus:border-blue-400 focus:ring-blue-400/20">
              <SelectValue placeholder="Select your primary goal" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              <SelectItem value="weight-loss">Weight Loss</SelectItem>
              <SelectItem value="muscle-gain">Muscle Gain</SelectItem>
              <SelectItem value="strength">Strength Training</SelectItem>
              <SelectItem value="endurance">Endurance</SelectItem>
              <SelectItem value="flexibility">Flexibility & Mobility</SelectItem>
              <SelectItem value="general">General Fitness</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">
            Tell us about your current fitness level and any specific needs
          </label>
          <Textarea
            value={formData.message}
            onChange={(e) => handleInputChange('message', e.target.value)}
            placeholder="Share your current fitness experience, any injuries, or specific requirements..."
            className="bg-white/5 border-white/20 text-white placeholder:text-gray-400 rounded-2xl focus:border-blue-400 focus:ring-blue-400/20 min-h-[120px] resize-none"
            rows={4}
          />
        </div>
        
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 py-4 rounded-2xl shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Submitting...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Send className="h-5 w-5" />
              <span>Start My Transformation</span>
            </div>
          )}
        </Button>
      </form>
      
      <div className="mt-8 pt-6 border-t border-white/10">
        <p className="text-center text-sm text-gray-400">
          🔒 Your information is secure and will only be used to create your personalized fitness plan.
        </p>
      </div>
    </Card>
  );
};

export default ContactForm;
