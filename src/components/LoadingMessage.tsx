import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingMessage: React.FC = () => {
  return (
    <div className="flex gap-3 mb-4 justify-start">
      <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
        <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
      </div>
      <div className="max-w-[70%]">
        <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg rounded-bl-sm">
          <div className="flex items-center gap-2">
            <span className="text-sm">Thinking...</span>
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-100"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-200"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};