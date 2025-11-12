import React, { useEffect, useState } from "react";
import axios from "axios";
import { MdThumbUp, MdPlayCircle } from "react-icons/md";
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

const LikedContentPage = () => {
  const [likedShorts, setLikedShorts] = useState([]);
  const [likedVideos, setLikedVideos] = useState([]);
  const [durations, setDurations] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLikedContent = async () => {
      try {
        // ✅ Fetch Liked Shorts
        const shortsRes = await axios.get(`${serverUrl}/api/content/likedshorts`, {
          withCredentials: true,
        });
        setLikedShorts(shortsRes.data || []);

        // ✅ Fetch Liked Videos
        const videosRes = await axios.get(`${serverUrl}/api/content/likedvideos`, {
          withCredentials: true,
        });
        setLikedVideos(videosRes.data || []);

        // ✅ Calculate duration for each liked video
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
        console.error("Error fetching liked content:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLikedContent();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen  text-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block p-4 bg-[#795d3f]/10 rounded-full mb-4">
            <MdThumbUp className="text-5xl text-[#795d3f] animate-pulse" />
          </div>
          <p className="text-slate-400 text-lg">Loading liked content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 py-4 min-h-screen mt-[50px] lg:mt-[20px]  text-white">
      {/* Decorative Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#795d3f]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-[#795d3f]/5 rounded-full blur-3xl"></div>
      </div>

      {/* Page Title */}
      <div className=" flex items-center pt-5 gap-3">
        <div className=" bg-[#795d3f]/10 rounded-lg">
          <MdThumbUp className="text-4xl text-[#795d3f]" />
        </div>
        <h1 className="text-3xl font-bold text-white">Liked Content</h1>
      </div>

      {/* Shorts Section */}
      {likedShorts.length > 0 && (
        <>
          <div className="pt-[50px] mb-6">
            <h2 className="text-2xl font-bold mb-3 flex items-center gap-2">
          <img src={short} className="w-7" alt="" />
              Liked Shorts
            </h2>
            <div className="h-1  bg-gradient-to-r from-[#795d3f] via-[#795d3f]/60 to-transparent rounded-full"></div>
          </div>
          
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-[#795d3f]/50 scrollbar-track-slate-900/50">
            {likedShorts.map((short) => (
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
            ))}
          </div>
        </>
      )}

      {/* Videos Section */}
      {likedVideos.length > 0 && (
        <>
          <div className="pt-[50px] mb-6">
            <h2 className="text-2xl font-bold mb-3 flex items-center gap-2">
              <img src={logo} className="w-7 h-7" alt="" />
              Liked Videos
            </h2>
            <div className="h-1  bg-gradient-to-r from-[#795d3f] via-[#795d3f]/60 to-transparent rounded-full"></div>
          </div>
          
          <div className="flex flex-wrap gap-6 mb-12">
            {likedVideos.map((video) => (
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
            ))}
          </div>
        </>
      )}

      {/* ✅ If nothing liked at all */}
      {likedShorts.length === 0 && likedVideos.length === 0 && (
        <div className="text-center py-20 bg-slate-900/40 backdrop-blur-sm rounded-2xl border-2 border-dashed border-slate-800/50 mt-10">
          <div className="inline-block p-6 bg-slate-950/50 rounded-full mb-6">
            <MdThumbUp className="text-7xl text-slate-700" />
          </div>
          <p className="text-slate-400 mb-2 text-lg font-medium">
            No liked content yet
          </p>
          <p className="text-sm text-slate-600">
            Start liking videos and shorts to see them here
          </p>
        </div>
      )}
    </div>
  );
};

export default LikedContentPage;