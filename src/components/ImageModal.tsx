
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface ImageModalProps {
  show: boolean;
  onClose: () => void;
  imageSrc: string;
}

const ImageModal: React.FC<ImageModalProps> = ({ show, onClose, imageSrc }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <Card className="backdrop-blur-lg bg-white/10 border-white/20 p-8 rounded-2xl max-w-2xl">
        <img 
          src={imageSrc} 
          alt="Enlarged view" 
          className="w-full max-h-96 object-contain rounded-lg mb-4"
        />
        <Button onClick={onClose} variant="outline" className="w-full bg-transparent border-white/20 text-white hover:bg-white/10">
          Close
        </Button>
      </Card>
    </div>
  );
};

export default ImageModal;
