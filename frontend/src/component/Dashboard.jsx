import React from "react";
import { useSelector } from "react-redux";
import {
  FaEye,
  FaThumbsUp,
  FaComment,
  FaVideo,
  FaFileVideo,
  FaUsers,
  FaChartLine,
} from "react-icons/fa";
import { RiMoneyRupeeCircleFill } from "react-icons/ri";
import { HiTrendingUp } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const { channelData } = useSelector((state) => state.user);
  const { contentRevenue } = useSelector((state) => state.content);
  const navigate = useNavigate();

  const totalVideoViews = (channelData?.videos || []).reduce(
    (acc, vid) => acc + (vid.views || 0),
    0
  );
  const totalShortViews = (channelData?.shorts || []).reduce(
    (acc, short) => acc + (short.views || 0),
    0
  );
  const totalViews = totalVideoViews + totalShortViews;

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

  return (
    <div className="w-full text-white min-h-screen p-4 sm:p-6 space-y-6 mb-[50px]">
      {/* -------- Channel Info Header -------- */}
      <div className="bg-gradient-to-br from-[#795d3f]/20 to-[#8a6a47]/20 border-2 border-[#795d3f]/30 rounded-2xl p-6 shadow-2xl backdrop-blur-sm">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="relative">
            <img
              src={channelData.avatar}
              alt="channel avatar"
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-[#795d3f]/50 shadow-xl"
            />
            <div className="absolute -bottom-1 -right-1 bg-gradient-to-br from-[#795d3f] to-[#8a6a47] rounded-full p-2">
              <HiTrendingUp className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="text-center md:text-left flex-1">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-1">
              {channelData.name}
            </h2>
            <div className="flex items-center justify-center md:justify-start gap-2 text-slate-300">
              <FaUsers className="w-4 h-4 text-[#795d3f]" />
              <p className="text-sm sm:text-base">
                <span className="font-bold text-white">
                  {channelData.subscribers?.length || 0}
                </span>{" "}
                subscribers
              </p>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Manage your content and track performance
            </p>
          </div>
        </div>
      </div>

      {/* -------- Channel Analytics -------- */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-[#795d3f]/10 rounded-lg">
            <FaChartLine className="text-[#795d3f] w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold">Channel Analytics</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <AnalyticsCard
            icon={<FaEye className="w-5 h-5" />}
            label="Total Views"
            value={totalViews.toLocaleString()}
            subtitle="All content"
            color="blue"
            onClick={() => navigate("/ptstudio/analytics")}
          />
          <AnalyticsCard
            icon={<FaUsers className="w-5 h-5" />}
            label="Subscribers"
            value={channelData.subscribers?.length || 0}
            subtitle="Community size"
            color="emerald"
          />
          <AnalyticsCard
            icon={<RiMoneyRupeeCircleFill className="w-5 h-5" />}
            label="Estimated Revenue"
            value={`₹${contentRevenue || 0}`}
            subtitle="Total earnings"
            color="gold"
            onClick={() => navigate("/ptstudio/revenue")}
          />
        </div>
      </div>

      {/* -------- Content Performance Stats -------- */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          icon={<FaVideo className="w-4 h-4 text-blue-400" />}
          label="Videos"
          value={channelData.videos?.length || 0}
          bgColor="bg-blue-500/10"
        />
        <StatCard
          icon={<FaFileVideo className="w-4 h-4 text-emerald-400" />}
          label="Shorts"
          value={channelData.shorts?.length || 0}
          bgColor="bg-emerald-500/10"
        />
        <StatCard
          icon={<FaEye className="w-4 h-4 text-purple-400" />}
          label="Avg Views"
          value={Math.floor(totalViews / ((channelData.videos?.length || 0) + (channelData.shorts?.length || 0)) || 0)}
          bgColor="bg-purple-500/10"
        />
        <StatCard
          icon={<FaThumbsUp className="w-4 h-4 text-[#795d3f]" />}
          label="Total Likes"
          value={
            [...(channelData.videos || []), ...(channelData.shorts || [])].reduce(
              (acc, item) => acc + (item.likes?.length || 0),
              0
            )
          }
          bgColor="bg-[#795d3f]/10"
        />
      </div>

      {/* -------- Latest Videos & Shorts -------- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Videos */}
        <div>
          {channelData?.videos?.length > 0 && (
            <>
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <FaVideo className="text-blue-400 w-4 h-4" />
                </div>
                <h3 className="text-lg font-bold">Latest Videos</h3>
              </div>
              <div className="space-y-3">
                {(channelData.videos || [])
                  .slice()
                  .reverse()
                  .slice(0, 5)
                  .map((video, idx) => (
                    <ContentCard
                      key={idx}
                      content={video}
                      onClick={() => navigate(`/watch-video/${video._id}`)}
                    />
                  ))}
              </div>
            </>
          )}
        </div>

        {/* Shorts */}
        <div>
          {channelData?.shorts?.length > 0 && (
            <>
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-emerald-500/10 rounded-lg">
                  <FaFileVideo className="text-emerald-400 w-4 h-4" />
                </div>
                <h3 className="text-lg font-bold">Latest Shorts</h3>
              </div>
              <div className="space-y-3">
                {(channelData.shorts || [])
                  .slice()
                  .reverse()
                  .slice(0, 5)
                  .map((short, idx) => (
                    <ContentCard1
                      key={idx}
                      content={short}
                      onClick={() => navigate(`/watch-short/${short._id}`)}
                    />
                  ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function AnalyticsCard({ icon, label, value, subtitle, color, onClick }) {
  const colorClasses = {
    blue: "from-blue-500/20 to-blue-600/20 border-blue-500/30 hover:border-blue-500/50",
    emerald: "from-emerald-500/20 to-emerald-600/20 border-emerald-500/30 hover:border-emerald-500/50",
    gold: "from-[#795d3f]/20 to-[#8a6a47]/20 border-[#795d3f]/30 hover:border-[#795d3f]/50",
  };

  const iconColorClasses = {
    blue: "bg-blue-500/10 text-blue-400",
    emerald: "bg-emerald-500/10 text-emerald-400",
    gold: "bg-[#795d3f]/10 text-[#795d3f]",
  };

  return (
    <div
      className={`bg-gradient-to-br ${colorClasses[color]} backdrop-blur-sm border-2 rounded-2xl p-6 shadow-xl transition-all hover:scale-105 ${
        onClick ? "cursor-pointer" : ""
      }`}
      onClick={onClick}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className={`p-2 ${iconColorClasses[color]} rounded-lg`}>
          {icon}
        </div>
        <p className="text-sm font-semibold text-slate-300">{label}</p>
      </div>
      <p className="text-3xl font-black text-white mb-1">{value}</p>
      <p className="text-xs text-slate-400">{subtitle}</p>
    </div>
  );
}

function StatCard({ icon, label, value, bgColor }) {
  return (
    <div className="bg-slate-900/60 backdrop-blur-sm border-2 border-slate-800/50 rounded-xl p-4 shadow-lg hover:border-[#795d3f]/30 transition-all">
      <div className="flex items-center gap-2 mb-2">
        <div className={`p-1.5 ${bgColor} rounded-lg`}>{icon}</div>
        <p className="text-xs text-slate-400">{label}</p>
      </div>
      <p className="text-2xl font-bold text-white">{value.toLocaleString()}</p>
    </div>
  );
}

function ContentCard({ content, onClick }) {
  return (
    <div
      className="flex gap-3 bg-slate-900/40 backdrop-blur-sm border-2 border-slate-800/50 rounded-xl p-3 hover:border-blue-500/50 hover:bg-slate-900/60 transition-all cursor-pointer group"
      onClick={onClick}
    >
      {/* Thumbnail */}
      <div className="relative flex-shrink-0">
        <img
          src={content.thumbnail}
          alt="thumbnail"
          className="w-32 sm:w-40 h-20 sm:h-24 rounded-lg object-cover"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
          <div className="bg-blue-500/90 rounded-full p-2">
            <FaVideo className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>

      {/* Content Info */}
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-sm line-clamp-2 mb-2 group-hover:text-blue-400 transition-colors">
          {content.title}
        </h4>
        <p className="text-xs text-slate-400 mb-2">
          {new Date(content.createdAt).toLocaleDateString()}
        </p>

        {/* Stats */}
        <div className="flex flex-wrap gap-3 text-slate-400 text-xs">
          <span className="flex items-center gap-1">
            <FaEye className="w-3 h-3" /> {content.views || 0}
          </span>
          <span className="flex items-center gap-1">
            <FaThumbsUp className="w-3 h-3" /> {content.likes?.length || 0}
          </span>
          <span className="flex items-center gap-1">
            <FaComment className="w-3 h-3" /> {content.comments?.length || 0}
          </span>
        </div>
      </div>
    </div>
  );
}

function ContentCard1({ content, onClick }) {
  return (
    <div
      className="flex gap-3 bg-slate-900/40 backdrop-blur-sm border-2 border-slate-800/50 rounded-xl p-3 hover:border-emerald-500/50 hover:bg-slate-900/60 transition-all cursor-pointer group"
      onClick={onClick}
    >
      {/* Video Thumbnail */}
      <div className="relative flex-shrink-0">
        <video
          src={content.shortUrl}
          className="w-20 h-24 rounded-lg object-cover"
          muted
          playsInline
          preload="metadata"
          onContextMenu={(e) => e.preventDefault()}
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
          <div className="bg-emerald-500/90 rounded-full p-2">
            <FaFileVideo className="w-3 h-3 text-white" />
          </div>
        </div>
      </div>

      {/* Content Info */}
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-sm line-clamp-2 mb-2 group-hover:text-emerald-400 transition-colors">
          {content.title}
        </h4>
        <p className="text-xs text-slate-400 mb-2">
          {new Date(content.createdAt).toLocaleDateString()}
        </p>

        {/* Stats */}
        <div className="flex flex-wrap gap-3 text-slate-400 text-xs">
          <span className="flex items-center gap-1">
            <FaEye className="w-3 h-3" /> {content.views || 0}
          </span>
          <span className="flex items-center gap-1">
            <FaThumbsUp className="w-3 h-3" /> {content.likes?.length || 0}
          </span>
          <span className="flex items-center gap-1">
            <FaComment className="w-3 h-3" /> {content.comments?.length || 0}
          </span>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;