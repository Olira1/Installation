import React, { useState } from "react";
import Tried from "./Component/Tried";
import Control from "./Component/Control";

export default function App() {
  const [currentPage, setCurrentPage] = useState("tried"); // Users see Tried page by default
  const [showAdminToggle, setShowAdminToggle] = useState(false); // Hidden by default

  // Hidden admin access - only you know about this
  const toggleAdminMode = () => {
    setShowAdminToggle(!showAdminToggle);
  };

  return (
    <div>
      {/* Hidden Admin Toggle - Only you can access this */}
      {showAdminToggle && (
        <div className="fixed top-4 right-4 z-50 bg-white rounded-lg shadow-lg p-2 border border-gray-200">
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage("tried")}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentPage === "tried"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              🚀 Tried (User View)
            </button>
            <button
              onClick={() => setCurrentPage("control")}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentPage === "control"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              📊 Control (Admin Only)
            </button>
            <button
              onClick={() => setShowAdminToggle(false)}
              className="px-3 py-2 rounded-md text-sm font-medium bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
            >
              ❌ Hide Admin
            </button>
          </div>
        </div>
      )}

      {/* Hidden Admin Access Button - Press Ctrl+Shift+A to show */}
      <div 
        className="fixed top-4 left-4 z-50 opacity-0 hover:opacity-100 transition-opacity duration-300 cursor-pointer"
        onClick={toggleAdminMode}
        title="Click to show admin controls (or press Ctrl+Shift+A)"
      >
        <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
          <span className="text-white text-xs">A</span>
        </div>
      </div>

      {/* Page Content */}
      {currentPage === "control" ? <Control /> : <Tried />}

      {/* Keyboard shortcut for admin access */}
      {React.useEffect(() => {
        const handleKeyPress = (event) => {
          if (event.ctrlKey && event.shiftKey && event.key === 'A') {
            setShowAdminToggle(true);
          }
        };

        document.addEventListener('keydown', handleKeyPress);
        return () => document.removeEventListener('keydown', handleKeyPress);
      }, [])}
    </div>
  );
}
