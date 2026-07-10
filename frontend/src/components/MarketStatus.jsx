import React, { useState, useEffect } from 'react';

const MarketStatus = () => {
  const [isOpen, setIsOpen] = useState(false);

  const checkMarketStatus = () => {
    // Get current time in India (IST)
    const options = { timeZone: 'Asia/Kolkata', hour12: false };
    const now = new Date();
    
    // Get Indian date string components
    const istDateString = now.toLocaleString('en-US', options);
    const istDate = new Date(istDateString);
    
    const day = istDate.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const hours = istDate.getHours();
    const minutes = istDate.getMinutes();

    // Check if it's a weekday (Monday-Friday)
    const isWeekday = day >= 1 && day <= 5;
    
    // Indian Market hours (NSE/BSE): 9:15 AM to 3:30 PM (15:30) IST
    // After 9:15 AM
    const isAfterOpen = hours > 9 || (hours === 9 && minutes >= 15);
    // Before 3:30 PM
    const isBeforeClose = hours < 15 || (hours === 15 && minutes < 30);

    if (isWeekday && isAfterOpen && isBeforeClose) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    checkMarketStatus();
    // Update every minute to catch the exact open/close time
    const interval = setInterval(checkMarketStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`hidden sm:flex items-center space-x-2.5 px-4 py-2.5 rounded-full border shadow-sm transition-colors duration-500 ${
      isOpen 
        ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400' 
        : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400'
    }`}>
      <span className="relative flex h-3.5 w-3.5">
        {isOpen && (
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        )}
        <span className={`relative inline-flex rounded-full h-3.5 w-3.5 ${isOpen ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
      </span>
      <span className="text-base font-semibold tracking-wide">
        Indian Market {isOpen ? 'Open' : 'Closed'}
      </span>
    </div>
  );
};

export default MarketStatus;
