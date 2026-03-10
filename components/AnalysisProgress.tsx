'use client';

import { useState, useEffect } from 'react';

interface ProcessingStep {
  id: string;
  label: string;
  status: 'pending' | 'processing' | 'complete' | 'error';
  duration?: number;
}

interface AnalysisProgressProps {
  isProcessing: boolean;
  onComplete?: () => void;
}

export default function AnalysisProgress({ isProcessing, onComplete }: AnalysisProgressProps) {
  const [steps, setSteps] = useState<ProcessingStep[]>([
    { id: 'upload', label: 'Uploading Image', status: 'pending' },
    { id: 'preprocess', label: 'Preprocessing', status: 'pending' },
    { id: 'inference', label: 'AI Analysis', status: 'pending' },
    { id: 'postprocess', label: 'Processing Results', status: 'pending' },
  ]);

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!isProcessing) {
      setCurrentStepIndex(0);
      setSteps(prev => prev.map(s => ({ ...s, status: 'pending', duration: undefined })));
      setStartTime(null);
      setElapsed(0);
      return;
    }

    setStartTime(Date.now());
    
    const processSteps = async () => {
      const stepDurations = [500, 800, 1200, 400]; // Simulated durations
      
      for (let i = 0; i < steps.length; i++) {
        setCurrentStepIndex(i);
        
        // Mark current step as processing
        setSteps(prev => prev.map((s, idx) => 
          idx === i ? { ...s, status: 'processing' } : s
        ));
        
        // Wait for step duration
        await new Promise(resolve => setTimeout(resolve, stepDurations[i]));
        
        // Mark as complete
        setSteps(prev => prev.map((s, idx) => 
          idx === i ? { ...s, status: 'complete', duration: stepDurations[i] } : s
        ));
      }
      
      if (onComplete) {
        setTimeout(onComplete, 300);
      }
    };

    processSteps();
  }, [isProcessing]);

  // Update elapsed time
  useEffect(() => {
    if (!startTime) return;

    const interval = setInterval(() => {
      setElapsed(Date.now() - startTime);
    }, 50);

    return () => clearInterval(interval);
  }, [startTime]);

  if (!isProcessing) return null;

  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-fade-in">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg 
              className="w-8 h-8 text-blue-600 animate-pulse" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" 
              />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Analyzing Brain Scan
          </h3>
          <p className="text-gray-600">
            AI is processing your MRI image...
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-sm font-medium text-gray-700">
              {Math.round(progress)}% Complete
            </span>
            <span className="text-sm text-gray-500">
              {(elapsed / 1000).toFixed(1)}s
            </span>
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-3">
          {steps.map((step, index) => (
            <div 
              key={step.id}
              className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${
                step.status === 'processing' 
                  ? 'bg-blue-50 border border-blue-200' 
                  : step.status === 'complete'
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-gray-50 border border-gray-200'
              }`}
            >
              {/* Icon */}
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                step.status === 'processing'
                  ? 'bg-blue-600'
                  : step.status === 'complete'
                  ? 'bg-green-600'
                  : 'bg-gray-300'
              }`}>
                {step.status === 'processing' ? (
                  <svg 
                    className="w-5 h-5 text-white animate-spin" 
                    fill="none" 
                    viewBox="0 0 24 24"
                  >
                    <circle 
                      className="opacity-25" 
                      cx="12" 
                      cy="12" 
                      r="10" 
                      stroke="currentColor" 
                      strokeWidth="4"
                    />
                    <path 
                      className="opacity-75" 
                      fill="currentColor" 
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                ) : step.status === 'complete' ? (
                  <svg 
                    className="w-5 h-5 text-white" 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path 
                      fillRule="evenodd" 
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                      clipRule="evenodd" 
                    />
                  </svg>
                ) : (
                  <span className="text-white text-xs font-bold">{index + 1}</span>
                )}
              </div>

              {/* Label */}
              <div className="flex-1">
                <p className={`font-medium ${
                  step.status === 'processing'
                    ? 'text-blue-900'
                    : step.status === 'complete'
                    ? 'text-green-900'
                    : 'text-gray-500'
                }`}>
                  {step.label}
                </p>
                {step.status === 'processing' && (
                  <p className="text-xs text-blue-600 mt-0.5">
                    In progress...
                  </p>
                )}
                {step.status === 'complete' && step.duration && (
                  <p className="text-xs text-green-600 mt-0.5">
                    Completed in {step.duration}ms
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <svg 
              className="w-4 h-4 animate-pulse" 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path 
                fillRule="evenodd" 
                d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" 
                clipRule="evenodd" 
              />
            </svg>
            AI Processing with YOLOv8
          </div>
        </div>
      </div>
    </div>
  );
}
