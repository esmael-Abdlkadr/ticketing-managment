import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaHome, FaTicketAlt, FaSearch, FaArrowLeft } from "react-icons/fa";

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  // Animation variants
  const containerVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="container mx-auto px-4">
        <motion.div 
          className="max-w-4xl mx-auto text-center"
          variants={containerVariants}
          initial="initial"
          animate="animate"
        >
          {/* Error code with animated dots */}
          <motion.div
            className="relative"
            variants={itemVariants}
          >
            <h1 className="text-9xl font-bold text-blue-600 mb-8">404</h1>
            
            {/* Animated dots */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-10 left-1/4">
                <motion.div 
                  className="h-3 w-3 rounded-full bg-blue-300"
                  animate={{ 
                    y: [0, -20, 0],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 2,
                    ease: "easeInOut",
                  }}
                />
              </div>
              <div className="absolute bottom-10 right-1/4">
                <motion.div 
                  className="h-5 w-5 rounded-full bg-blue-200"
                  animate={{ 
                    y: [0, -30, 0],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 2.5,
                    ease: "easeInOut",
                    delay: 0.3
                  }}
                />
              </div>
              <div className="absolute top-20 right-1/3">
                <motion.div 
                  className="h-4 w-4 rounded-full bg-indigo-300"
                  animate={{ 
                    y: [0, -25, 0],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 3,
                    ease: "easeInOut",
                    delay: 0.7
                  }}
                />
              </div>
            </div>
          </motion.div>
          
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-gray-800 mb-4"
            variants={itemVariants}
          >
            Page Not Found
          </motion.h2>
          
          <motion.p 
            className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
            variants={itemVariants}
          >
            We couldn't find the page you're looking for. It might have been moved,
            deleted, or perhaps never existed.
          </motion.p>
          
          <motion.div 
            className="flex flex-col md:flex-row justify-center gap-4 mb-12"
            variants={itemVariants}
          >
            {/* Back button */}
            <button
              onClick={goBack}
              className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg flex items-center justify-center transition-colors"
            >
              <FaArrowLeft className="mr-2" />
              Go Back
            </button>
            
            {/* Home button */}
            <Link
              to="/"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center transition-colors"
            >
              <FaHome className="mr-2" />
              Back to Home
            </Link>
            
            {/* Tickets button */}
            <Link
              to="/tickets"
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center justify-center transition-colors"
            >
              <FaTicketAlt className="mr-2" />
              View Tickets
            </Link>
          </motion.div>
          
          {/* Search box */}
          <motion.div 
            className="max-w-md mx-auto"
            variants={itemVariants}
          >
            <div className="relative">
              <input
                type="text"
                placeholder="Search for help..."
                className="w-full px-5 py-3 pl-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
                Search
              </button>
            </div>
          </motion.div>
          
          {/* Quick links */}
          <motion.div 
            className="mt-12 text-gray-600"
            variants={itemVariants}
          >
            <p className="mb-4 text-sm">Quick Links:</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/dashboard" className="text-blue-600 hover:underline">Dashboard</Link>
              <Link to="/knowledge-base" className="text-blue-600 hover:underline">Knowledge Base</Link>
              <Link to="/contact" className="text-blue-600 hover:underline">Contact Support</Link>
              <Link to="/faq" className="text-blue-600 hover:underline">FAQ</Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFoundPage;