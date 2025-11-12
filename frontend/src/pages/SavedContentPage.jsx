import React, { useEffect, useState } from "react";
import axios from "axios";
import { MdBookmark, MdPlayCircle } from "react-icons/md";
import VideoCard from "../component/VideoCard";
import ShortsCard from "../component/ShortsCard";
import logo from "../assets/youtube.png";
import { serverUrl } from "../App";
import short from "../assets/short.png";

// Helper to get duration
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

const SavedContentPage = () => {
  const [savedShorts, setSavedShorts] = useState([]);
  const [savedVideos, setSavedVideos] = useState([]);
  const [durations, setDurations] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedContent = async () => {
      try {
        // Parallel request -> shorts + videos
        const shortsRes = await axios.get(`${serverUrl}/api/content/saveshorts`, {
          withCredentials: true,
        });
        setSavedShorts(shortsRes.data || []);

        const videosRes = await axios.get(`${serverUrl}/api/content/savevideos`, {
          withCredentials: true,
        });
        setSavedVideos(videosRes.data || []);

        // ✅ video duration calculate karo
        if (Array.isArray(videosRes.data)) {
          videosRes.data.forEach((video) => {
            getVideoDuration(video.videoUrl, (formattedTime) => {
              setDurations((prev) => ({
                ...prev,
                [video._id]: formattedTime,
              }));
            });
          });
        }
      } catch (error) {
        console.error("Error fetching saved content:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedContent();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen  text-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block p-4 bg-[#795d3f]/10 rounded-full mb-4">
            <MdBookmark className="text-5xl text-[#795d3f] animate-pulse" />
          </div>
          <p className="text-slate-400 text-lg">Loading saved content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 py-4 min-h-screen pt-10    text-white">
      {/* Decorative Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-10">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#795d3f]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-[#795d3f]/5 rounded-full blur-3xl"></div>
      </div>

      {/* Page Title */}
      <div className=" pt-5 flex items-center gap-3">
        <div className=" bg-[#795d3f]/10 rounded-lg">
          <MdBookmark className="text-4xl text-[#795d3f]" />
        </div>
        <h1 className="text-3xl font-bold text-white">Saved Content</h1>
      </div>

      {/* Shorts Section */}
      <div className="pt-[50px] mb-6">
        <h2 className="text-2xl font-bold mb-3 flex items-center gap-2">
          <img src={short} className="w-7" alt="" />
          Saved Shorts
        </h2>
        <div className="h-1 w bg-gradient-to-r from-[#795d3f] via-[#795d3f]/60 to-transparent rounded-full"></div>
      </div>
      
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-[#795d3f]/50 scrollbar-track-slate-900/50">
        {savedShorts.length > 0 ? (
          savedShorts.map((short) => (
            <div key={short._id} className="flex-shrink-0">
              <ShortsCard
                shortUrl={short.shortUrl}
                title={short.title}
                channelName={short.channel?.name}
                views={short.views}
                id={short._id}
                avatar={short.channel?.avatar}
              />
            </div>
          ))
        ) : (
          <p className="text-slate-400">No saved shorts found.</p>
        )}
      </div>

      {/* Videos Section */}
      <div className="pt-[50px] mb-6">
        <h2 className="text-2xl font-bold mb-3 flex items-center gap-2">
          <img src={logo} className="w-7 h-7" alt="" />
          Saved Videos
        </h2>
        <div className="h-1  bg-gradient-to-r from-[#795d3f] via-[#795d3f]/60 to-transparent rounded-full"></div>
      </div>
      
      <div className="flex flex-wrap gap-6 mb-12">
        {savedVideos.length > 0 ? (
          savedVideos.map((video) => (
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
          <p className="text-slate-400">No saved videos found.</p>
        )}
      </div>
    </div>
  );
};

export default SavedContentPage;