import { MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="py-12 bg-foreground">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gradient-sunset">
              <MapPin className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-display text-lg font-semibold text-background">
              Planora
            </span>
          </div>
          <div className="flex flex-col items-center md:items-end gap-1">
            <p className="text-background/60 text-sm">
              © 2024 Planora.
            </p>
            <p className="text-background/40 text-xs">
              Developed by Dhiyanesh
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
