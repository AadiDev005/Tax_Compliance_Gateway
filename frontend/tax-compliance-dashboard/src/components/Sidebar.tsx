import React from 'react';
import { CheckCircle, Clock, Zap } from 'lucide-react';

const Sidebar: React.FC = () => {
  return (
    <div className="w-80 bg-white rounded-xl shadow-lg border border-gray-200 p-6 space-y-6">
      {/* Tax Engine Status */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-800">Tax Engine</h3>
          <span className="text-green-600 font-medium">Online</span>
        </div>
        <div className="text-sm text-gray-600">
          <div className="flex justify-between">
            <span>Multi-country tax calculations</span>
          </div>
          <div className="flex justify-between mt-1">
            <span>Port 8082</span>
            <span className="text-gray-400">11:39:34</span>
          </div>
        </div>
      </div>

      {/* Document Service Status */}
      <div className="space-y-4 border-t pt-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-800">Document Service</h3>
          <span className="text-green-600 font-medium">Online</span>
        </div>
        <div className="text-sm text-gray-600">
          <div className="flex justify-between">
            <span>Document processing & storage</span>
          </div>
          <div className="flex justify-between mt-1">
            <span>Port 8083</span>
            <span className="text-gray-400">11:39:34</span>
          </div>
        </div>
      </div>

      {/* Tax Engine Features */}
      <div className="space-y-4 border-t pt-4">
        <div className="flex items-center">
          <Zap className="w-4 h-4 text-blue-600 mr-2" />
          <h3 className="font-semibold text-gray-800">Tax Engine Features:</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">multi-country-tax</span>
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">intelligent-cache</span>
        </div>
      </div>

      {/* Cache Performance */}
      <div className="space-y-4 border-t pt-4">
        <h3 className="font-semibold text-gray-800">Cache Performance</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-gray-600">Hit Rate</div>
            <div className="text-2xl font-bold text-green-600">0%</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Performance</div>
            <div className="text-sm font-medium text-gray-800">Good</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">L1 Hits</div>
            <div className="text-lg font-bold text-purple-600">0</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Cache Misses</div>
            <div className="text-lg font-bold text-orange-600">0</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
