import { Link } from 'react-router-dom';
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Shield,
  Smartphone,
  Mail
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-foreground text-primary-foreground">
      <div className="container-tight py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary-foreground flex items-center justify-center">
                <span className="text-foreground font-display font-bold text-xl">L</span>
              </div>
              <span className="font-display text-xl font-bold">Liztitnow.com</span>
            </div>
            <p className="text-primary-foreground/70 text-sm mb-6">
              India's most trusted marketplace for genuine buyers and sellers. No spam, no scams.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-3">
              <li><Link to="/listings" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors text-sm">Browse Ads</Link></li>
              <li><Link to="/post-ad" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors text-sm">Post an Ad</Link></li>
              <li><Link to="/how-it-works" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors text-sm">How It Works</Link></li>
              <li><Link to="/pricing" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors text-sm">Membership Pricing</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-display font-semibold mb-4">Categories</h4>
            <ul className="space-y-3">
              <li><Link to="/listings?category=mobiles" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors text-sm">Mobile Phones</Link></li>
              <li><Link to="/listings?category=electronics" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors text-sm">Electronics</Link></li>
              <li><Link to="/listings?category=furniture" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors text-sm">Furniture</Link></li>
              <li><Link to="/listings?category=vehicles" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors text-sm">Vehicles</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-display font-semibold mb-4">Support</h4>
            <ul className="space-y-3">
              <li><Link to="/help" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors text-sm">Help Center</Link></li>
              <li><Link to="/safety" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors text-sm">Safety Tips</Link></li>
              <li><Link to="/contact" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors text-sm">Contact Us</Link></li>
              <li><Link to="/report" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors text-sm">Report an Issue</Link></li>
            </ul>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-12 pt-8 border-t border-primary-foreground/10">
          <div className="flex flex-wrap justify-center gap-8 mb-8">
            <div className="flex items-center gap-2 text-primary-foreground/70">
              <Shield className="h-5 w-5 text-trust-green" />
              <span className="text-sm">100% Secure Payments</span>
            </div>
            <div className="flex items-center gap-2 text-primary-foreground/70">
              <Smartphone className="h-5 w-5 text-amber" />
              <span className="text-sm">Verified Sellers</span>
            </div>
            <div className="flex items-center gap-2 text-primary-foreground/70">
              <Mail className="h-5 w-5 text-trust-premium" />
              <span className="text-sm">24/7 Support</span>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-primary-foreground/50">
            <div className="text-center md:text-left">
              <p>© {currentYear} Liztitnow.com</p>
              <p>A product of Shermon Industries. All rights reserved.</p>
            </div>
            <div className="flex gap-6">
              <Link to="/privacy" className="hover:text-primary-foreground transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-primary-foreground transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
