import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaTicketAlt, FaChartLine, FaUsersCog, FaRocket } from "react-icons/fa";

const HeroSection: React.FC = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-blue-900 to-indigo-900 text-white">
      {/* Background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-blue-500 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/4 w-72 h-72 rounded-full bg-purple-500 blur-3xl"></div>
        <div className="absolute bottom-12 right-1/3 w-60 h-60 rounded-full bg-indigo-400 blur-3xl"></div>
      </div>
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-grid-white/[0.05]" 
           style={{backgroundSize: '30px 30px'}}></div>
      
      <div className="container mx-auto px-4 py-20 sm:py-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text content */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6">
            <div className="inline-block px-4 py-2 bg-blue-600/30 border border-blue-500/30 rounded-full text-sm font-medium">
              <span className="mr-1">🚀</span> SupportSphere Ticketing System
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Support that <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">works</span> for everyone
            </h1>
            
            <p className="text-xl text-blue-100 max-w-2xl">
              Streamline your support process with our intuitive ticketing platform.
              Get issues resolved faster and keep your customers happier.
            </p>
            
            <div className="flex flex-wrap gap-4 pt-2">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link 
                  to="/create-ticket" 
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium rounded-lg shadow-lg hover:shadow-blue-500/30 transition duration-300"
                >
                  <FaTicketAlt className="mr-2" />
                  Create New Ticket
                </Link>
              </motion.div>
              
              <Link 
                to="/tickets" 
                className="inline-flex items-center px-6 py-3 bg-blue-800/30 hover:bg-blue-800/40 text-white font-medium rounded-lg transition duration-300"
              >
                View Your Tickets
              </Link>
            </div>
            
            {/* Current system status */}
            <div className="pt-10 flex items-center text-blue-200 text-sm">
              <span className="flex items-center">
                <span className="h-2 w-2 rounded-full bg-green-400 mr-2 animate-pulse"></span>
                System Status: Operational
              </span>
              <span className="mx-3">•</span>
              <span>
                {new Date().toLocaleDateString()} | {new Date().toLocaleTimeString()}
              </span>
            </div>
          </motion.div>
          
          {/* Visual side - Animated card/stats */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-2xl">
              <h3 className="text-xl font-semibold mb-6">Support Dashboard</h3>
              
              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <motion.div 
                  whileHover={{ y: -5 }}
                  className="bg-white/5 rounded-xl p-5 border border-white/10"
                >
                  <div className="flex items-center space-x-2 text-blue-300 mb-3">
                    <FaChartLine />
                    <span className="text-sm font-medium">Average Response</span>
                  </div>
                  <p className="text-3xl font-bold">2.4 hrs</p>
                  <p className="text-green-400 text-sm mt-2">↓ 15% faster this week</p>
                </motion.div>
                
                <motion.div 
                  whileHover={{ y: -5 }}
                  className="bg-white/5 rounded-xl p-5 border border-white/10"
                >
                  <div className="flex items-center space-x-2 text-blue-300 mb-3">
                    <FaUsersCog />
                    <span className="text-sm font-medium">Support Team</span>
                  </div>
                  <p className="text-3xl font-bold">12</p>
                  <p className="text-green-400 text-sm mt-2">+2 agents this month</p>
                </motion.div>
                
                <motion.div 
                  whileHover={{ y: -5 }}
                  className="bg-white/5 rounded-xl p-5 border border-white/10 col-span-2"
                >
                  <div className="flex items-center space-x-2 text-blue-300 mb-3">
                    <FaRocket />
                    <span className="text-sm font-medium">Resolution Rate</span>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-2.5 mb-2">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2.5 rounded-full" style={{ width: '94%' }}></div>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-sm text-blue-300">Weekly goal: 90%</p>
                    <p className="text-sm font-medium">94%</p>
                  </div>
                </motion.div>
              </div>
              
              {/* Ticket activity list */}
              <div className="mt-6 space-y-3">
                <h4 className="text-sm font-medium text-blue-200 mb-2">Recent Activity</h4>
                {[
                  { status: 'resolved', title: 'Login authentication issue' },
                  { status: 'progress', title: 'Dashboard reporting bug' },
                  { status: 'new', title: 'Feature request: API integration' }
                ].map((ticket, index) => (
                  <div key={index} className="flex items-center p-3 rounded-lg bg-white/5 border border-white/10">
                    <span className={`h-2 w-2 rounded-full mr-3 ${
                      ticket.status === 'new' ? 'bg-blue-400' : 
                      ticket.status === 'progress' ? 'bg-yellow-400' : 
                      'bg-green-400'
                    }`}></span>
                    <span className="text-sm truncate">{ticket.title}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 h-20 w-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full blur-xl opacity-60"></div>
            <div className="absolute -bottom-6 -left-6 h-24 w-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full blur-xl opacity-60"></div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;