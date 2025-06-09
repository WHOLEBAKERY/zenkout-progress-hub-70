
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Area, AreaChart } from 'recharts';

const ProgressChart = () => {
  const data = [
    { month: 'Jan', weight: 180, bodyFat: 22 },
    { month: 'Feb', weight: 178, bodyFat: 21 },
    { month: 'Mar', weight: 175, bodyFat: 19.5 },
    { month: 'Apr', weight: 172, bodyFat: 18 },
    { month: 'May', weight: 170, bodyFat: 17 },
    { month: 'Jun', weight: 168, bodyFat: 16 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-white mb-4">Progress Overview</h3>
        <p className="text-gray-300 text-sm mb-6">Your 6-month transformation journey</p>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="bodyFatGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
            <XAxis 
              dataKey="month" 
              stroke="#9CA3AF" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="#9CA3AF" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Area
              type="monotone"
              dataKey="weight"
              stroke="#3B82F6"
              strokeWidth={3}
              fill="url(#weightGradient)"
            />
            <Area
              type="monotone"
              dataKey="bodyFat"
              stroke="#8B5CF6"
              strokeWidth={3}
              fill="url(#bodyFatGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center p-4 bg-blue-500/10 rounded-2xl border border-blue-500/20">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-sm text-gray-300">Weight (lbs)</span>
          </div>
          <p className="text-2xl font-bold text-blue-400">168</p>
          <p className="text-xs text-green-400">-12 lbs</p>
        </div>
        <div className="text-center p-4 bg-purple-500/10 rounded-2xl border border-purple-500/20">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <span className="text-sm text-gray-300">Body Fat (%)</span>
          </div>
          <p className="text-2xl font-bold text-purple-400">16%</p>
          <p className="text-xs text-green-400">-6%</p>
        </div>
      </div>
    </div>
  );
};

export default ProgressChart;
