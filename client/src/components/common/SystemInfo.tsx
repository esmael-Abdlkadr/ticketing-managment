import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaClock, FaUser, FaGlobeAmericas } from "react-icons/fa";
import useAuth from "../../store/useAuth";

const SystemInfo: React.FC = () => {
  const { user } = useAuth();
  const [timestamp, setTimestamp] = useState("");
  const [date, setDate] = useState("");
  
  // Update the timestamp every second
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      
      // Format for display: YYYY-MM-DD HH:MM:SS
      const formattedTime = now.toISOString().slice(0, 19).replace("T", " ");
      setTimestamp(formattedTime);
      
      // Format date for the date display
      const options: Intl.DateTimeFormatOptions = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      };
      setDate(now.toLocaleDateString(undefined, options));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-blue-900 to-indigo-800 rounded-lg overflow-hidden shadow-lg"
    >
      <div className="backdrop-blur-sm bg-white/5 px-6 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Time info */}
          <div className="flex items-center gap-4">
            <div className="flex flex-shrink-0 items-center justify-center bg-blue-600/30 w-12 h-12 rounded-full">
              <FaClock className="text-blue-200 text-xl" />
            </div>
            <div>
              <h2 className="text-blue-200 text-xs font-medium uppercase tracking-wider">
                Current UTC Time
              </h2>
              <div className="flex items-center">
                <span className="text-white font-mono text-lg">{timestamp}</span>
                <motion.span 
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  className="ml-2 w-2 h-2 bg-green-400 rounded-full"
                />
              </div>
              <p className="text-blue-200 text-xs mt-0.5">{date}</p>
            </div>
          </div>
          
          {/* User info */}
          <div className="flex items-center gap-4">
            <div className="flex flex-shrink-0 items-center justify-center bg-indigo-600/30 w-12 h-12 rounded-full">
              <FaUser className="text-blue-200 text-xl" />
            </div>
            <div>
              <h2 className="text-blue-200 text-xs font-medium uppercase tracking-wider">
                Current User
              </h2>
              <div className="text-white font-medium text-lg">
                {user?.firstName && user?.lastName
                  ? `${user.firstName} ${user.lastName}`
                  : "Guest"}
              </div>
              <div className="flex items-center text-xs text-blue-200 mt-0.5">
                <FaGlobeAmericas className="mr-1" /> Active Session
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SystemInfo;