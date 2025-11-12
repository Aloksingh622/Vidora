import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { RiMoneyRupeeCircleFill } from "react-icons/ri";
import { FaVideo, FaFileVideo } from "react-icons/fa";
import { setContentRevenue } from "../redux/contentSlice";

// ------------------- Revenue Calculation -------------------
const calculateRevenue = (views, type) => {
  if (type === "video") {
    if (views < 1000) return 0;
    return Math.floor(views / 1000) * 50;
  }
  if (type === "short") {
    if (views < 10000) return 0;
    return Math.floor(views / 10000) * 50;
  }
  return 0;
};

const RevenuePage = () => {
  const { channelData } = useSelector((state) => state.user);
  const dispatch = useDispatch();

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

  // ------------------- Videos Revenue Data -------------------
  const videoRevenueData = (channelData.videos || []).map((video) => ({
    title: video.title.length > 10 ? video.title.slice(0, 15) + "..." : video.title,
    revenue: calculateRevenue(video.views || 0, "video"),
    views: video.views || 0,
  }));

  // ------------------- Shorts Revenue Data -------------------
  const shortRevenueData = (channelData.shorts || []).map((short) => ({
    title: short.title.length > 10 ? short.title.slice(0, 15) + "..." : short.title,
    revenue: calculateRevenue(short.views || 0, "short"),
    views: short.views || 0,
  }));

  // ------------------- Total Revenue -------------------
  const videoRevenue = videoRevenueData.reduce((sum, v) => sum + v.revenue, 0);
  const shortRevenue = shortRevenueData.reduce((sum, s) => sum + s.revenue, 0);
  const totalRevenue = videoRevenue + shortRevenue;

  useEffect(() => {
    dispatch(setContentRevenue(totalRevenue));
  }, [totalRevenue]);

  // Custom Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border-2 border-[#795d3f]/30 rounded-xl p-3 shadow-2xl">
          <p className="text-white font-semibold text-sm mb-1">{label}</p>
          <p className="text-[#795d3f] text-sm font-bold">
            Revenue: ₹{payload[0].value}
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
          <RiMoneyRupeeCircleFill className="text-[#795d3f] w-8 h-8" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Revenue Analytics
          </h1>
          <p className="text-sm text-slate-400">Track your earnings and performance</p>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Revenue Card */}
        <div className="bg-gradient-to-br from-[#795d3f] to-[#8a6a47] rounded-2xl p-6 shadow-2xl relative overflow-hidden group hover:scale-105 transition-transform">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform"></div>
          <div className="relative z-10">
            <p className="text-sm font-semibold text-white/80 mb-1">Total Revenue</p>
            <p className="text-4xl font-black text-white mb-1">₹{totalRevenue.toLocaleString()}</p>
            <p className="text-xs text-white/60">All time earnings</p>
          </div>
        </div>

        {/* Video Revenue Card */}
        <div className="bg-slate-900/60 backdrop-blur-sm border-2 border-slate-800/50 rounded-2xl p-6 shadow-xl hover:border-[#795d3f]/50 transition-all group">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <FaVideo className="text-blue-400 w-5 h-5" />
            </div>
            <p className="text-sm font-semibold text-slate-300">Videos</p>
          </div>
          <p className="text-3xl font-bold text-white">₹{videoRevenue.toLocaleString()}</p>
          <p className="text-xs text-slate-400 mt-1">{channelData.videos?.length || 0} videos</p>
        </div>

        {/* Shorts Revenue Card */}
        <div className="bg-slate-900/60 backdrop-blur-sm border-2 border-slate-800/50 rounded-2xl p-6 shadow-xl hover:border-[#795d3f]/50 transition-all group">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-emerald-500/10 rounded-lg">
              <FaFileVideo className="text-emerald-400 w-5 h-5" />
            </div>
            <p className="text-sm font-semibold text-slate-300">Shorts</p>
          </div>
          <p className="text-3xl font-bold text-white">₹{shortRevenue.toLocaleString()}</p>
          <p className="text-xs text-slate-400 mt-1">{channelData.shorts?.length || 0} shorts</p>
        </div>
      </div>

      {/* Revenue Rules */}
      <div className="bg-gradient-to-r from-[#795d3f]/20 to-[#8a6a47]/20 border-2 border-[#795d3f]/30 rounded-2xl p-5 shadow-xl backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl">💡</span>
          <h2 className="text-lg font-bold text-[#795d3f]">Revenue Rules</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex items-start gap-2">
            <span className="text-lg">🎥</span>
            <div>
              <p className="text-sm font-semibold text-white">Videos</p>
              <p className="text-xs text-slate-400">₹50 per 1,000 views (after first 1,000)</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-lg">🎬</span>
            <div>
              <p className="text-sm font-semibold text-white">Shorts</p>
              <p className="text-xs text-slate-400">₹50 per 10,000 views (after first 10,000)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Videos Revenue Chart */}
      {videoRevenueData.length > 0 && (
        <div className="bg-slate-900/40 backdrop-blur-sm border-2 border-slate-800/50 rounded-2xl p-6 shadow-2xl">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <FaVideo className="text-blue-400 w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold">Videos Revenue</h2>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={videoRevenueData}>
              <defs>
                <linearGradient id="colorVideo" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
              <XAxis 
                dataKey="title" 
                tick={{ fontSize: 10, fill: '#94a3b8' }}
                stroke="#475569"
              />
              <YAxis 
                tick={{ fontSize: 12, fill: '#94a3b8' }}
                stroke="#475569"
              />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="#3b82f6" 
                strokeWidth={3}
                fill="url(#colorVideo)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Shorts Revenue Chart */}
      {shortRevenueData.length > 0 && (
        <div className="bg-slate-900/40 backdrop-blur-sm border-2 border-slate-800/50 rounded-2xl p-6 shadow-2xl">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-emerald-500/10 rounded-lg">
              <FaFileVideo className="text-emerald-400 w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold">Shorts Revenue</h2>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={shortRevenueData}>
              <defs>
                <linearGradient id="colorShort" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
              <XAxis 
                dataKey="title" 
                tick={{ fontSize: 10, fill: '#94a3b8' }}
                stroke="#475569"
              />
              <YAxis 
                tick={{ fontSize: 12, fill: '#94a3b8' }}
                stroke="#475569"
              />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="#10b981" 
                strokeWidth={3}
                fill="url(#colorShort)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Empty State */}
      {videoRevenueData.length === 0 && shortRevenueData.length === 0 && (
        <div className="bg-slate-900/40 backdrop-blur-sm border-2 border-slate-800/50 rounded-2xl p-12 shadow-2xl text-center">
          <div className="inline-block p-4 bg-[#795d3f]/10 rounded-full mb-4">
            <RiMoneyRupeeCircleFill className="text-[#795d3f] w-16 h-16" />
          </div>
          <h3 className="text-xl font-bold mb-2">No Revenue Data Yet</h3>
          <p className="text-slate-400 text-sm">Start uploading content to track your earnings!</p>
        </div>
      )}
    </div>
  );
};

export default RevenuePage;