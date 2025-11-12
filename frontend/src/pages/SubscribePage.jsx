import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import VideoCard from "../component/VideoCard";
import ShortsCard from "../component/ShortsCard";
import logo from "../assets/youtube.png";
import { useNavigate } from "react-router-dom";
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

const SubscribePage = () => {
  const { subscribeChannel, subscribeVideo, subscribeShort } =
    useSelector((state) => state.user) || {};

  const [durations, setDurations] = useState({});
  const navigate = useNavigate();

  // Step 1: get video durations
  useEffect(() => {
    if (Array.isArray(subscribeVideo) && subscribeVideo.length > 0) {
      subscribeVideo.forEach((video) => {
        getVideoDuration(video.videoUrl, (formattedTime) => {
          setDurations((prev) => ({
            ...prev,
            [video._id]: formattedTime,
          }));
        });
      });
    }
  }, [subscribeVideo]);

  return (
    <div className="px-6 py-4 min-h-screen  text-white">
      {/* Decorative Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#795d3f]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-[#795d3f]/5 rounded-full blur-3xl"></div>
      </div>

      {/* 🔥 Subscribed Channels (avatars in circle) */}
      <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-thin scrollbar-thumb-[#795d3f]/50 scrollbar-track-slate-900/50 pt-[30px]">
        {subscribeChannel?.length > 0 ? (
          subscribeChannel.map((ch) => (
            <div
              key={ch._id}
              className="flex flex-col items-center flex-shrink-0 cursor-pointer hover:scale-105 transition-transform duration-200"
              onClick={() => navigate(`/channelpage/${ch._id}`)}
            >
              <img
                src={ch.avatar}
                alt={ch.name}
                className="w-20 h-20 rounded-full border-2 border-[#795d3f]/50 hover:border-[#795d3f] object-cover shadow-md transition-all duration-200"
              />
              <span className="mt-2 text-sm text-slate-300 font-medium text-center truncate w-20">
                {ch.name}
              </span>
            </div>
          ))
        ) : (
          <p className="text-slate-400">No subscribed channels found.</p>
        )}
      </div>

      {/* Shorts Section */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-3 flex items-center gap-2">
          <img src={short} className="w-7" alt="" />
          Subscribed Shorts
        </h2>
        <div className="h-1 w-full bg-gradient-to-r from-[#795d3f] via-[#795d3f]/60 to-transparent rounded-full"></div>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-[#795d3f]/50 scrollbar-track-slate-900/50">
        {subscribeShort?.length > 0 ? (
          subscribeShort.map((short) => (
            <div key={short._id} className="flex-shrink-0">
              <ShortsCard
                shortUrl={short.shortUrl}
                title={short.title}
                channelName={short.channel?.name}
                views={short.views}
                id={short?._id}
                avatar={short.channel?.avatar}
              />
            </div>
          ))
        ) : (
          <p className="text-slate-400">No subscribed shorts found.</p>
        )}
      </div>

      {/* Videos Section */}
      <div className="pt-[50px] mb-6">
        <h2 className="text-2xl font-bold mb-3 flex items-center gap-2">
          <img src={logo} className="w-7 h-7" alt="" />
          Subscribed Videos
        </h2>
        <div className="h-1 w-full bg-gradient-to-r from-[#795d3f] via-[#795d3f]/60 to-transparent rounded-full"></div>
      </div>
      <div className="flex flex-wrap gap-6 mb-12">
        {subscribeVideo?.length > 0 ? (
          subscribeVideo.map((video) => (
            <VideoCard
              key={video._id}
              thumbnail={video.thumbnail}
              duration={durations[video._id] || "0:00"}
              channelLogo={video.channel?.avatar}
              title={video.title}
              channelName={video.channel?.name}
              views={`${video.views}`}
              time={new Date(video.createdAt).toLocaleDateString()}
              id={video._id}
            />
          ))
        ) : (
          <p className="text-slate-400">No subscribed videos found.</p>
        )}
      </div>
    </div>
  );
};

export default SubscribePage;