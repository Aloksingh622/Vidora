import React from "react";
import { useNavigate } from "react-router-dom";
  




const VideoCard = ({ thumbnail, duration, channelLogo, title, channelName, views,id }) => {
  const navigate = useNavigate()


   
  return (
   <div className="w-[360px] cursor-pointer group" onClick={()=>navigate(`/watch-video/${id}`)}>
      {/* Thumbnail */}
      <div className="relative overflow-hidden rounded-2xl border border-gray-800/50 group-hover:border-[#795d3f] transition-all duration-300">
        <img
          src={thumbnail}
          alt={title}
          className="w-full h-[200px] object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-0.5 rounded">
          {duration}
        </span>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      {/* Info */}
      <div className="flex mt-3">
        {/* Channel Logo */}
        <img
          src={channelLogo}
          alt={channelName}
          className="w-10 h-10 rounded-full mr-3"
        />

        {/* Text Content */}
        <div>
          <h3 className="text-sm font-medium leading-snug line-clamp-2 text-gray-200 group-hover:text-[#795d3f] transition-colors duration-200">
            {title}
          </h3>
          <p className="text-xs text-gray-400 mt-1 group-hover:text-[#9a7b5f] transition-colors duration-200">{channelName}</p>
          <p className="text-xs text-gray-500">
           {
              Number(views) >= 1_000_000
                ? Math.floor(Number(views) / 1_000_000) + "M"
                : Number(views) >= 1_000
                ? Math.floor(Number(views) / 1_000) + "K"
                : Number(views) || 0
            } views • <span className="text-[#795d3f]">Watch now</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
