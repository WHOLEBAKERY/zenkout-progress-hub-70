
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface CalendarModalProps {
  show: boolean;
  onClose: () => void;
  workoutRecords: any;
  onMonthSelect: (year: number, month: number) => void;
}

const CalendarModal: React.FC<CalendarModalProps> = ({ 
  show, 
  onClose, 
  workoutRecords, 
  onMonthSelect 
}) => {
  if (!show) return null;

  const generateMonths = () => {
    const months = [];
    const now = new Date();
    const startYear = now.getFullYear();
    const startMonth = now.getMonth();

    for (let i = 0; i < 12; i++) {
      let month = startMonth + i;
      let year = startYear;
      if (month > 11) {
        month -= 12;
        year++;
      }

      const monthName = new Date(year, month, 1).toLocaleDateString('en-US', { 
        month: 'long', 
        year: 'numeric' 
      });

      const firstDay = new Date(year, month, 1).getDay();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const days = [];

      // Empty cells
      for (let j = 0; j < firstDay; j++) {
        days.push(<div key={`empty-${j}`} className="w-6 h-6"></div>);
      }

      // Days
      for (let d = 1; d <= daysInMonth; d++) {
        const cellDate = new Date(year, month, d);
        const dateKey = cellDate.toISOString().split("T")[0];
        const record = workoutRecords[dateKey];
        
        let bgColor = "bg-gray-600";
        if (record?.status === "completed") bgColor = "bg-green-500";
        else if (record?.status === "missed") bgColor = "bg-red-500";
        else if (record?.status === "rest") bgColor = "bg-purple-500";

        days.push(
          <div key={d} className={`w-6 h-6 text-xs flex items-center justify-center rounded ${bgColor}`}>
            {d}
          </div>
        );
      }

      months.push(
        <div 
          key={`${year}-${month}`}
          className="bg-white/5 p-4 rounded-lg cursor-pointer hover:bg-white/10 transition-colors"
          onClick={() => onMonthSelect(year, month)}
        >
          <h3 className="text-center text-white font-medium mb-2">{monthName}</h3>
          <div className="grid grid-cols-7 gap-1">
            {days}
          </div>
        </div>
      );
    }

    return months;
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <Card className="backdrop-blur-lg bg-white/10 border-white/20 p-8 rounded-2xl w-full max-w-4xl max-h-[80vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-white mb-6">Calendar Mode</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {generateMonths()}
        </div>
        
        <Button onClick={onClose} variant="outline" className="w-full bg-transparent border-white/20 text-white hover:bg-white/10">
          Close
        </Button>
      </Card>
    </div>
  );
};

export default CalendarModal;
