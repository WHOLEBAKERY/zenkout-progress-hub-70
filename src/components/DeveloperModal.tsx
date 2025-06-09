
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";

interface DeveloperModalProps {
  show: boolean;
  onClose: () => void;
  workoutRecords: any;
  onSave: (records: any) => void;
  workoutPlan: any;
}

const DeveloperModal: React.FC<DeveloperModalProps> = ({ 
  show, 
  onClose, 
  workoutRecords, 
  onSave, 
  workoutPlan 
}) => {
  const [records, setRecords] = useState(workoutRecords);

  const handleSave = () => {
    onSave(records);
    onClose();
  };

  const updateRecord = (dateKey: string, status: string) => {
    setRecords({
      ...records,
      [dateKey]: {
        ...records[dateKey],
        status
      }
    });
  };

  if (!show) return null;

  // Generate current month's dates
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const dates = [];

  for (let d = 1; d <= daysInMonth; d++) {
    const cellDate = new Date(year, month, d);
    const dateKey = cellDate.toISOString().split("T")[0];
    const dayName = cellDate.toLocaleDateString('en-US', { weekday: 'short' });
    const dayOfWeek = cellDate.toLocaleDateString('en-US', { weekday: 'long' });
    
    if (!records[dateKey]) {
      records[dateKey] = { 
        workout: workoutPlan[dayOfWeek] || "No workout", 
        status: "pending" 
      };
    }
    
    dates.push({ dateKey, dayName, status: records[dateKey].status });
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <Card className="backdrop-blur-lg bg-white/10 border-white/20 p-8 rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-white mb-6">Developer Options</h2>
        
        <div className="space-y-4 mb-6">
          {dates.map(({ dateKey, dayName, status }) => (
            <div key={dateKey} className="flex items-center justify-between bg-white/5 p-3 rounded-lg">
              <span className="text-white">
                <strong>{dateKey}</strong> ({dayName})
              </span>
              <Select value={status} onValueChange={(value) => updateRecord(dateKey, value)}>
                <SelectTrigger className="w-32 bg-white/10 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="missed">Missed</SelectItem>
                  <SelectItem value="rest">Rest</SelectItem>
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>
        
        <div className="flex gap-4">
          <Button onClick={handleSave} className="flex-1 bg-blue-500 hover:bg-blue-600">
            Save Changes
          </Button>
          <Button onClick={onClose} variant="outline" className="flex-1 bg-transparent border-white/20 text-white hover:bg-white/10">
            Close
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default DeveloperModal;
