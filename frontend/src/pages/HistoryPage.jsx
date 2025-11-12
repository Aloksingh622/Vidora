// src/pages/HistoryPage.jsx
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { SiYoutubeshorts } from "react-icons/si";
import { MdHistory, MdPlayCircle } from "react-icons/md";
import VideoCard from "../component/VideoCard";
import ShortsCard from "../component/ShortsCard";
import logo from "../assets/youtube.png";
import short from "../assets/short.png";

const getVideoDuration = (url, callback) => {
  const video = document.createElement("video");
  video.preload = "metadata";
  video.src = url;
  video.onloadedmetadata = () => {
    const totalSeconds = Math.floor(video.duration);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    callback(`${minutes}:${seconds.toString().padStart(2, "0")}`);
  };
  video.onerror = () => {
    callback("0:00");
  };
};

const HistoryPage = () => {
  const { videoHistory, shortHistory } = useSelector((state) => state.user) || {};
  const [durations, setDurations] = useState({});

  // ✅ calculate durations for videos
  useEffect(() => {
    if (Array.isArray(videoHistory) && videoHistory.length > 0) {
      videoHistory.forEach((item) => {
        const video = item.contentId; // ✅ actual video object
        getVideoDuration(video.videoUrl, (formattedTime) => {
          setDurations((prev) => ({
            ...prev,
            [video._id]: formattedTime,
          }));
        });
      });
    }
  }, [videoHistory]);

  return (
    <div className="px-6 py-4 min-h-screen mt-[50px] lg:mt-[20px]  text-white">
      {/* Decorative Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#795d3f]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-[#795d3f]/5 rounded-full blur-3xl"></div>
      </div>

      {/* Page Title */}
      <div className="pt-5 flex items-center gap-3 ">
        <div className=" bg-[#795d3f]/10 rounded-lg">
          <MdHistory className="text-4xl text-[#795d3f]" />
        </div>
        <h1 className="text-3xl font-bold text-white">Watch History</h1>
      </div>

      {/* Shorts History */}
      <div className="mb-6 pt-[50px]">
        <h2 className="text-2xl  font-bold mb-3 flex items-center gap-2">
          <img src={short} className="w-7" alt="" />
          Shorts History
        </h2>
        <div className="h-1  bg-gradient-to-r from-[#795d3f] via-[#795d3f]/60 to-transparent rounded-full"></div>
      </div>
      
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-[#795d3f]/50 scrollbar-track-slate-900/50">
        {shortHistory?.length > 0 ? (
          shortHistory.map((item) => {
            const short = item.contentId; // ✅ actual short object
            return (
              <div key={item._id} className="flex-shrink-0">
                <ShortsCard
                  shortUrl={short.shortUrl}
                  title={short.title}
                  channelName={short.channel?.name}
                  views={short.views}
                  id={short._id}
                  avatar={short.channel?.avatar}
                />
              </div>
            );
          })
        ) : (
          <p className="text-slate-400">No shorts watched yet.</p>
        )}
      </div>

      {/* Video History */}
      <div className="pt-[50px] mb-6">
        <h2 className="text-2xl font-bold mb-3 flex items-center gap-2">
          <img src={logo} className="w-7 h-7" alt="" />
          Video History
        </h2>
        <div className="h-1  bg-gradient-to-r from-[#795d3f] via-[#795d3f]/60 to-transparent rounded-full"></div>
      </div>
      
      <div className="flex flex-wrap gap-6 mb-12">
        {videoHistory?.length > 0 ? (
          videoHistory.map((item) => {
            const video = item.contentId; // ✅ actual video object
            return (
              <VideoCard
                key={item._id}
                thumbnail={video.thumbnail}
                duration={durations[video._id] || "0:00"}
                channelLogo={video.channel?.avatar}
                title={video.title}
                channelName={video.channel?.name}
                views={`${video.views}`}
                time={new Date(video.createdAt).toLocaleDateString()}
                id={video._id}
              />
            );
          })
        ) : (
          <p className="text-slate-400">No videos watched yet.</p>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;