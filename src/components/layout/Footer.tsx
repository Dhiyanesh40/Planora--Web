import { MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="py-12 bg-foreground">
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-gradient-sunset">
                <MapPin className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-display text-xl font-semibold text-background">
                Planora
              </span>
            </div>
            <p className="text-background/60 text-sm leading-relaxed">
              A smart trip planner where travelers plan their perfect journeys with budget-optimized itineraries and day-by-day activity planning.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-background mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-background/60 hover:text-background text-sm transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/itineraries" className="text-background/60 hover:text-background text-sm transition-colors">
                  All Itineraries
                </Link>
              </li>
              <li>
                <Link to="/itineraries/new" className="text-background/60 hover:text-background text-sm transition-colors">
                  Create Itinerary
                </Link>
              </li>
              <li>
                <Link to="/auth" className="text-background/60 hover:text-background text-sm transition-colors">
                  Sign In
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-background mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/terms-of-service" className="text-background/60 hover:text-background text-sm transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-background/60 hover:text-background text-sm transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/help-center" className="text-background/60 hover:text-background text-sm transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/contact-us" className="text-background/60 hover:text-background text-sm transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-background mb-4">Contact</h3>
            <ul className="space-y-2">
              <li>
                <a 
                  href="mailto:nivashinidhiyanesh@gmail.com" 
                  className="text-background/60 hover:text-background text-sm transition-colors"
                >
                  nivashinidhiyanesh@gmail.com
                </a>
              </li>
              <li className="text-background/60 text-sm pt-2">
                Developed by <span className="text-background font-semibold">Dhiyanesh</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-background/20 my-8"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <p className="text-background/60 text-sm">
              © 2026 Planora. All rights reserved.
            </p>
            <p className="text-background/40 text-xs mt-1">
              Made with modern web technologies
            </p>
          </div>
          
          <div className="flex flex-col items-center md:items-end gap-1">
            <p className="text-background/40 text-xs">Powered by</p>
            <div className="flex items-center gap-2 text-background/60 text-sm">
              <span>React</span>
              <span>•</span>
              <span>Node.js</span>
              <span>•</span>
              <span>MySQL</span>
              <span>•</span>
              <span>Express</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
