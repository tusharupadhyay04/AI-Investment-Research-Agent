import React, { useState, useEffect } from 'react';
import { Loader2, Server, Globe, Cpu, LineChart } from 'lucide-react';

const LoadingAnimation = () => {
  const [stepIndex, setStepIndex] = useState(0);

  const steps = [
    { text: "Searching Financial Data...", icon: Globe },
    { text: "Fetching Company Information...", icon: Server },
    { text: "Reading Latest News...", icon: Globe },
    { text: "Analyzing Fundamentals...", icon: LineChart },
    { text: "Running AI Analysis...", icon: Cpu },
    { text: "Generating Recommendation...", icon: Loader2 }
  ];

  // Animate through the steps every 1.5 seconds to give a sense of progress
  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 1500);
    return () => clearInterval(interval);
  }, [steps.length]);

  const CurrentIcon = steps[stepIndex].icon;

  return (
    <div className="w-full max-w-lg mx-auto p-12 bg-white dark:bg-slate-800 rounded-3xl shadow-xl flex flex-col items-center justify-center space-y-6">
      <div className="relative">
        <div className="absolute inset-0 bg-blue-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
        <CurrentIcon className="h-16 w-16 text-blue-500 animate-bounce relative z-10" />
      </div>
      
      <div className="space-y-2 text-center w-full">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
          {steps[stepIndex].text}
        </h3>
        <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-500 transition-all duration-500 ease-out"
            style={{ width: `${((stepIndex + 1) / steps.length) * 100}%` }}
          ></div>
        </div>
        <p className="text-sm text-slate-500">This may take up to 10 seconds...</p>
      </div>
    </div>
  );
};

export default LoadingAnimation;
