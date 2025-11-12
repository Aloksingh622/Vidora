import React, { useState } from "react";
import { FaPlay, FaListUl, FaTimes, FaBookmark } from "react-icons/fa";
import { MdPlaylistPlay } from "react-icons/md";
import axios from "axios";
import { serverUrl } from "../App";
import VideoCard from "./VideoCard";
import { useSelector } from "react-redux";

export default function PlaylistCard({ id, title, videos, savedBy }) {
  const { userData } = useSelector((state) => state.user);
  const [showVideos, setShowVideos] = useState(false);
  const [isSaved, setIsSaved] = useState(
    savedBy?.some((uid) => uid.toString() === userData?._id?.toString()) || false
  );

  const [loading, setLoading] = useState(false);

  const thumbnail = videos[0]?.thumbnail;

  // Save/Unsave handler
  const handleToggleSave = async () => {
    if (!userData?._id) return alert("Please login to save playlists");
    setLoading(true);
    try {
      const res = await axios.post(
        `${serverUrl}/api/content/playlist/toggle-save`,
        { playlistId: id },
        { withCredentials: true }
      );

      console.log("Save toggle response:", res.data);

      const saved = res.data.saveBy?.some(
        (uid) => uid.toString() === userData._id.toString()
      );
      setIsSaved(saved);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Playlist Card */}
      <div className="relative w-60 h-40 rounded-2xl overflow-hidden group shadow-2xl bg-slate-900 border-2 border-slate-800/50 hover:border-[#795d3f]/50 transition-all">
        {/* Playlist Thumbnail */}
        <img
          src={thumbnail}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />

        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>

        {/* Content Overlay */}
        <div className="absolute inset-0 flex flex-col justify-end p-4">
          <div className="flex items-start gap-2 mb-2">
            <MdPlaylistPlay className="text-[#795d3f] w-5 h-5 flex-shrink-0 mt-0.5" />
            <h3 className="font-bold text-white text-sm line-clamp-2 leading-tight">
              {title}
            </h3>
          </div>
          <p className="text-xs text-slate-300 flex items-center gap-1">
            <FaPlay className="w-2.5 h-2.5" />
            {videos.length} videos
          </p>
        </div>

        {/* Save Icon (top-right) */}
        <button
          onClick={handleToggleSave}
          disabled={loading}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all backdrop-blur-sm border ${
            isSaved
              ? "bg-[#795d3f] text-white border-[#795d3f] hover:bg-[#8a6a47]"
              : "bg-black/60 text-white border-slate-700 hover:bg-black/80 hover:border-[#795d3f]"
          } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <FaBookmark size={14} />
        </button>

        {/* View Playlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowVideos(true);
          }}
          className="absolute bottom-3 right-3 bg-[#795d3f]/90 backdrop-blur-sm p-2.5 rounded-full text-white hover:bg-[#795d3f] transition-all hover:scale-110 shadow-lg"
        >
          <FaListUl size={14} />
        </button>
      </div>

      {/* Modal for playlist videos */}
      {showVideos && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex justify-center items-center z-50 p-4">
          <div className="bg-slate-900 rounded-2xl w-full max-w-7xl max-h-[90vh] overflow-hidden shadow-2xl border-2 border-slate-800/50 flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-900 border-b-2 border-slate-800/50 p-6 flex items-center justify-between sticky top-0 z-10 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-[#795d3f]/10 rounded-xl">
                  <MdPlaylistPlay className="text-[#795d3f] w-7 h-7" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white tracking-tight">
                    {title}
                  </h2>
                  <p className="text-sm text-slate-400">
                    {videos.length} video{videos.length !== 1 ? "s" : ""} in playlist
                  </p>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setShowVideos(false)}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all group"
              >
                <FaTimes size={20} className="group-hover:rotate-90 transition-transform" />
              </button>
            </div>

            {/* Videos Grid */}
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              <div className="flex flex-wrap gap-5 justify-start">
                {videos.map((v, index) => (
                  <div key={v._id || `${id}-${index}`} className="flex-shrink-0">
                    <VideoCard
                      id={v._id}
                      thumbnail={v.thumbnail}
                      duration={v.duration}
                      channelLogo={v.channel?.avatar}
                      title={v.title}
                      channelName={v.channel?.name}
                      views={v.views}
                    />
                  </div>
                ))}
              </div>

              {videos.length === 0 && (
                <div className="text-center py-12">
                  <div className="inline-block p-4 bg-[#795d3f]/10 rounded-full mb-4">
                    <MdPlaylistPlay className="text-[#795d3f] w-16 h-16" />
                  </div>
                  <p className="text-slate-400 text-lg">No videos in this playlist</p>
                </div>
              )}
            </div>
          </div>

          <style jsx>{`
            .custom-scrollbar::-webkit-scrollbar {
              width: 10px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
              background: rgba(15, 23, 42, 0.3);
              border-radius: 10px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
              background: #795d3f;
              border-radius: 10px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
              background: #8a6a47;
            }
          `}</style>
        </div>
      )}
    </>
  );
}