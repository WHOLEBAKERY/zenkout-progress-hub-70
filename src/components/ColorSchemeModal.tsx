
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

interface ColorSchemeModalProps {
  show: boolean;
  onClose: () => void;
}

const ColorSchemeModal: React.FC<ColorSchemeModalProps> = ({ show, onClose }) => {
  const [colors, setColors] = useState({
    primary: '#ff7e5f',
    secondary: '#feb47b',
    accent: '#6a82fb'
  });

  const handleSave = () => {
    document.documentElement.style.setProperty('--primary-color', colors.primary);
    document.documentElement.style.setProperty('--secondary-color', colors.secondary);
    document.documentElement.style.setProperty('--accent-color', colors.accent);
    onClose();
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <Card className="backdrop-blur-lg bg-white/10 border-white/20 p-8 rounded-2xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-white mb-6">Color Scheme Editor</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-white mb-2">Primary Color:</label>
            <Input
              type="color"
              value={colors.primary}
              onChange={(e) => setColors({ ...colors, primary: e.target.value })}
              className="h-12 bg-white/10 border-white/20"
            />
          </div>
          
          <div>
            <label className="block text-white mb-2">Secondary Color:</label>
            <Input
              type="color"
              value={colors.secondary}
              onChange={(e) => setColors({ ...colors, secondary: e.target.value })}
              className="h-12 bg-white/10 border-white/20"
            />
          </div>
          
          <div>
            <label className="block text-white mb-2">Accent Color:</label>
            <Input
              type="color"
              value={colors.accent}
              onChange={(e) => setColors({ ...colors, accent: e.target.value })}
              className="h-12 bg-white/10 border-white/20"
            />
          </div>
        </div>
        
        <div className="flex gap-4 mt-6">
          <Button onClick={handleSave} className="flex-1 bg-blue-500 hover:bg-blue-600">
            Save Colors
          </Button>
          <Button onClick={onClose} variant="outline" className="flex-1 bg-transparent border-white/20 text-white hover:bg-white/10">
            Close
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ColorSchemeModal;
