
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';

interface Testimonial {
  name: string;
  role: string;
  content: string;
  avatar: string;
  rating: number;
}

interface TestimonialCarouselProps {
  testimonials: Testimonial[];
}

const TestimonialCarousel: React.FC<TestimonialCarouselProps> = ({ testimonials }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <div className="relative">
      <Card className="backdrop-blur-lg bg-white/10 border-white/20 p-8 md:p-12 rounded-3xl shadow-2xl">
        <div className="text-center max-w-3xl mx-auto">
          <Quote className="h-12 w-12 text-blue-400 mx-auto mb-6 opacity-60" />
          
          <p className="text-lg md:text-xl text-gray-200 leading-relaxed mb-8 italic">
            "{currentTestimonial.content}"
          </p>
          
          <div className="flex justify-center mb-4">
            {[...Array(currentTestimonial.rating)].map((_, i) => (
              <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
            ))}
          </div>
          
          <div className="flex items-center justify-center space-x-4">
            <Avatar className="h-16 w-16 border-2 border-blue-400">
              <AvatarImage src={currentTestimonial.avatar} />
              <AvatarFallback>{currentTestimonial.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="text-left">
              <h4 className="text-lg font-semibold text-white">{currentTestimonial.name}</h4>
              <p className="text-blue-400">{currentTestimonial.role}</p>
            </div>
          </div>
        </div>
      </Card>
      
      <div className="flex justify-center items-center space-x-4 mt-8">
        <Button
          variant="outline"
          size="sm"
          onClick={prevTestimonial}
          className="bg-transparent border-white/20 text-gray-300 hover:border-blue-400 hover:text-blue-400 rounded-2xl"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <div className="flex space-x-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-blue-400 scale-125' 
                  : 'bg-gray-600 hover:bg-gray-500'
              }`}
            />
          ))}
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={nextTestimonial}
          className="bg-transparent border-white/20 text-gray-300 hover:border-blue-400 hover:text-blue-400 rounded-2xl"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default TestimonialCarousel;
