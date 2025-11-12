import React from "react";
import { useSelector } from "react-redux";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { FaVideo, FaFileVideo, FaEye, FaChartLine } from "react-icons/fa";
import { HiTrendingUp } from "react-icons/hi";

const AnalyticsPage = () => {
  const { channelData } = useSelector((state) => state.user);

  if (!channelData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-[#795d3f] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 text-lg">Loading channel data...</p>
        </div>
      </div>
    );
  }

  // ------------------- Video Chart Data -------------------
  const videoChartData = (channelData.videos || []).map((video) => ({
    title: video.title.length > 10 ? video.title.slice(0, 15) + "..." : video.title,
    views: video.views || 0,
  }));

  // ------------------- Shorts Chart Data -------------------
  const shortChartData = (channelData.shorts || []).map((short) => ({
    title: short.title.length > 10 ? short.title.slice(0, 15) + "..." : short.title,
    views: short.views || 0,
  }));

  // ------------------- Calculate Stats -------------------
  const totalVideoViews = videoChartData.reduce((sum, v) => sum + v.views, 0);
  const totalShortViews = shortChartData.reduce((sum, s) => sum + s.views, 0);
  const totalViews = totalVideoViews + totalShortViews;
  const avgVideoViews = videoChartData.length > 0 ? Math.floor(totalVideoViews / videoChartData.length) : 0;
  const avgShortViews = shortChartData.length > 0 ? Math.floor(totalShortViews / shortChartData.length) : 0;

  // Custom Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border-2 border-[#795d3f]/30 rounded-xl p-3 shadow-2xl">
          <p className="text-white font-semibold text-sm mb-1">{label}</p>
          <p className="text-[#795d3f] text-sm font-bold">
            Views: {payload[0].value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full min-h-screen p-4 sm:p-6 text-white space-y-6 mb-[50px]">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 bg-[#795d3f]/10 rounded-xl">
          <FaChartLine className="text-[#795d3f] w-8 h-8" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Channel Analytics
          </h1>
          <p className="text-sm text-slate-400">Track your content performance</p>
        </div>
      </div>

      {/* Stats Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Views Card */}
        <div className="bg-gradient-to-br from-[#795d3f] to-[#8a6a47] rounded-2xl p-6 shadow-2xl relative overflow-hidden group hover:scale-105 transition-transform">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <FaEye className="text-white/80 w-5 h-5" />
              <p className="text-sm font-semibold text-white/80">Total Views</p>
            </div>
            <p className="text-3xl font-black text-white mb-1">{totalViews.toLocaleString()}</p>
            <p className="text-xs text-white/60">All content</p>
          </div>
        </div>

        {/* Video Views Card */}
        <div className="bg-slate-900/60 backdrop-blur-sm border-2 border-slate-800/50 rounded-2xl p-6 shadow-xl hover:border-blue-500/50 transition-all group">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <FaVideo className="text-blue-400 w-4 h-4" />
            </div>
            <p className="text-sm font-semibold text-slate-300">Video Views</p>
          </div>
          <p className="text-3xl font-bold text-white">{totalVideoViews.toLocaleString()}</p>
          <p className="text-xs text-slate-400 mt-1">{channelData.videos?.length || 0} videos</p>
        </div>

        {/* Shorts Views Card */}
        <div className="bg-slate-900/60 backdrop-blur-sm border-2 border-slate-800/50 rounded-2xl p-6 shadow-xl hover:border-emerald-500/50 transition-all group">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-emerald-500/10 rounded-lg">
              <FaFileVideo className="text-emerald-400 w-4 h-4" />
            </div>
            <p className="text-sm font-semibold text-slate-300">Shorts Views</p>
          </div>
          <p className="text-3xl font-bold text-white">{totalShortViews.toLocaleString()}</p>
          <p className="text-xs text-slate-400 mt-1">{channelData.shorts?.length || 0} shorts</p>
        </div>

        {/* Average Performance Card */}
        <div className="bg-slate-900/60 backdrop-blur-sm border-2 border-slate-800/50 rounded-2xl p-6 shadow-xl hover:border-[#795d3f]/50 transition-all group">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-[#795d3f]/10 rounded-lg">
              <HiTrendingUp className="text-[#795d3f] w-4 h-4" />
            </div>
            <p className="text-sm font-semibold text-slate-300">Avg Views</p>
          </div>
          <p className="text-2xl font-bold text-white">
            {Math.floor((avgVideoViews + avgShortViews) / 2).toLocaleString()}
          </p>
          <p className="text-xs text-slate-400 mt-1">Per content piece</p>
        </div>
      </div>

      {/* Videos Chart */}
      {videoChartData.length > 0 && (
        <div className="bg-slate-900/40 backdrop-blur-sm border-2 border-slate-800/50 rounded-2xl p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <FaVideo className="text-blue-400 w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Videos Performance</h2>
                <p className="text-xs text-slate-400">Views per video</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-400">Average</p>
              <p className="text-lg font-bold text-blue-400">{avgVideoViews.toLocaleString()}</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={videoChartData}>
              <defs>
                <linearGradient id="colorVideo" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
              <XAxis 
                dataKey="title" 
                tick={{ fontSize: 10, fill: '#94a3b8' }}
                stroke="#475569"
                angle={-15}
                textAnchor="end"
                height={60}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: '#94a3b8' }}
                stroke="#475569"
              />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="views" 
                stroke="#3b82f6" 
                strokeWidth={3}
                fill="url(#colorVideo)"
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: '#3b82f6' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Shorts Chart */}
      {shortChartData.length > 0 && (
        <div className="bg-slate-900/40 backdrop-blur-sm border-2 border-slate-800/50 rounded-2xl p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-emerald-500/10 rounded-lg">
                <FaFileVideo className="text-emerald-400 w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Shorts Performance</h2>
                <p className="text-xs text-slate-400">Views per short</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-400">Average</p>
              <p className="text-lg font-bold text-emerald-400">{avgShortViews.toLocaleString()}</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={shortChartData}>
              <defs>
                <linearGradient id="colorShort" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
              <XAxis 
                dataKey="title" 
                tick={{ fontSize: 10, fill: '#94a3b8' }}
                stroke="#475569"
                angle={-15}
                textAnchor="end"
                height={60}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: '#94a3b8' }}
                stroke="#475569"
              />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="views" 
                stroke="#10b981" 
                strokeWidth={3}
                fill="url(#colorShort)"
                dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: '#10b981' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Empty State */}
      {videoChartData.length === 0 && shortChartData.length === 0 && (
        <div className="bg-slate-900/40 backdrop-blur-sm border-2 border-slate-800/50 rounded-2xl p-12 shadow-2xl text-center">
          <div className="inline-block p-4 bg-[#795d3f]/10 rounded-full mb-4">
            <FaChartLine className="text-[#795d3f] w-16 h-16" />
          </div>
          <h3 className="text-xl font-bold mb-2">No Analytics Data Yet</h3>
          <p className="text-slate-400 text-sm">Start uploading content to track your performance!</p>
        </div>
      )}
    </div>
  );
};

export default AnalyticsPage;