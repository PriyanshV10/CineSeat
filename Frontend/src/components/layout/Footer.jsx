import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[#333545] text-white py-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <Link
              to="/"
              className="text-2xl font-black tracking-tighter text-white hover:text-gray-300 transition-colors"
            >
              CineSeat
            </Link>
            <p className="mt-4 text-sm text-gray-400 leading-relaxed">
              Experience movies with clarity. Book your tickets seamlessly.
            </p>
            <div className="mt-6 flex space-x-4">
               {/* Social Icons Placeholder */}
               <div className="w-8 h-8 bg-gray-600 rounded-full hover:bg-white hover:text-black transition-all cursor-pointer flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"/>
                  </svg>
               </div>
               <div className="w-8 h-8 bg-gray-600 rounded-full hover:bg-white hover:text-black transition-all cursor-pointer flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z"/>
                  </svg>
               </div>
               <div className="w-8 h-8 bg-gray-600 rounded-full hover:bg-white hover:text-black transition-all cursor-pointer flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
                  </svg>
               </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold mb-4 uppercase text-xs tracking-wider">Help & Support</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link to="/faq" className="hover:text-white transition-colors">FAQs</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Browse */}
          <div>
             <h3 className="text-white font-bold mb-4 uppercase text-xs tracking-wider">Browse</h3>
             <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/movies" className="hover:text-white transition-colors">Movies</Link></li>
                <li><Link to="/events" className="hover:text-white transition-colors">Events</Link></li>
                <li><Link to="/plays" className="hover:text-white transition-colors">Plays</Link></li>
                <li><Link to="/sports" className="hover:text-white transition-colors">Sports</Link></li>
                <li><Link to="/activities" className="hover:text-white transition-colors">Activities</Link></li>
             </ul>
          </div>

          {/* Newsletter / App */}
          <div>
             <h3 className="text-white font-bold mb-4 uppercase text-xs tracking-wider">Experience App</h3>
             <p className="text-sm text-gray-400 mb-4">
                Get the best experience on the CineSeat App.
             </p>
             <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded transition-colors w-full sm:w-auto">
                Download App
             </button>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-700 pt-8 text-center">
            <div className="flex justify-center items-center gap-4 mb-4">
               <span className="text-gray-500 text-xs uppercase tracking-widest">24/7 Customer Care</span>
               <span className="text-gray-500 text-xs uppercase tracking-widest">Resend Booking Confirmation</span>
               <span className="text-gray-500 text-xs uppercase tracking-widest">Subscribe to Newsletter</span>
            </div>
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} CineSeat. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
