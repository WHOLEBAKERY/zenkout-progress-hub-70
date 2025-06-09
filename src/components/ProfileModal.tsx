
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

interface ProfileModalProps {
  show: boolean;
  onClose: () => void;
  profile: any;
  onSave: (profile: any) => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ show, onClose, profile, onSave }) => {
  const [formData, setFormData] = useState({
    name: profile?.name || '',
    age: profile?.age || '',
    height: profile?.height || '',
    weight: profile?.weight || '',
    picture: profile?.picture || ''
  });

  const handleSave = () => {
    if (formData.name && formData.age && formData.height && formData.weight) {
      onSave(formData);
      onClose();
    } else {
      alert("Please fill out all fields.");
    }
  };

  const handlePictureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        setFormData({ ...formData, picture: evt.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <Card className="backdrop-blur-lg bg-white/10 border-white/20 p-8 rounded-2xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-white mb-6">Begin Your Journey</h2>
        
        <div className="space-y-4">
          <Input
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
          />
          
          <Input
            type="number"
            placeholder="Age"
            value={formData.age}
            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
          />
          
          <Input
            type="text"
            placeholder="Height"
            value={formData.height}
            onChange={(e) => setFormData({ ...formData, height: e.target.value })}
            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
          />
          
          <Input
            type="text"
            placeholder="Weight"
            value={formData.weight}
            onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
          />
          
          <div>
            <label className="block text-white mb-2">Profile Picture:</label>
            <Input
              type="file"
              accept="image/*"
              onChange={handlePictureUpload}
              className="bg-white/10 border-white/20 text-white"
            />
          </div>
        </div>
        
        <div className="flex gap-4 mt-6">
          <Button onClick={handleSave} className="flex-1 bg-blue-500 hover:bg-blue-600">
            Save Profile
          </Button>
          <Button onClick={onClose} variant="outline" className="flex-1 bg-transparent border-white/20 text-white hover:bg-white/10">
            Close
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ProfileModal;
