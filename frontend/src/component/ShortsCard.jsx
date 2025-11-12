import React from "react";
import { useNavigate } from "react-router-dom";
import { FaPlay } from "react-icons/fa";

const ShortsCard = ({ shortUrl, title, channelName, avatar, views, id }) => {
  const navigate = useNavigate();

  return (
    <div 
      className="w-45 sm:w-48 cursor-pointer group relative"
      onClick={() => navigate(`/watch-short/${id}`)}
    >
      {/* Video Container */}
      <div className="rounded-2xl overflow-hidden bg-slate-950 w-full aspect-[9/16] border-2 border-slate-800/50 group-hover:border-[#795d3f]/50 transition-all duration-300 relative">
        <video
          src={shortUrl}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          muted
          playsInline
          preload="metadata"
          onContextMenu={(e) => e.preventDefault()}
        />
        
        {/* Play Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="bg-[#795d3f] p-4 rounded-full transform scale-0 group-hover:scale-100 transition-transform duration-300">
            <FaPlay className="text-white text-2xl ml-1" />
          </div>
        </div>

       
      </div>

      {/* Info Section */}
      <div className="mt-3 space-y-2">
        {/* Title */}
        <h3 className="text-sm font-semibold text-white line-clamp-2 group-hover:text-[#795d3f] transition-colors leading-snug">
          {title}
        </h3>
        
        {/* Channel Info */}
        <div className="flex items-center gap-2">
          <img 
            src={avatar} 
            className="w-6 h-6 rounded-full border-2 border-slate-700 group-hover:border-[#795d3f] transition-colors object-cover" 
            alt={channelName}
          />
          <p className="text-xs text-slate-400 font-medium truncate">
            {channelName}
          </p>
        </div>
        
        {/* Views */}
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 bg-[#795d3f] rounded-full"></div>
          <p className="text-xs text-slate-500 font-medium">
            {Number(views) >= 1_000_000
              ? Math.floor(Number(views) / 1_000_000) + "M"
              : Number(views) >= 1_000
              ? Math.floor(Number(views) / 1_000) + "K"
              : Number(views) || 0} views
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShortsCard;