import React, { useState } from "react";
import { FaList, FaCheck } from "react-icons/fa";
import { MdPlaylistAdd } from "react-icons/md";
import { ClipLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { serverUrl } from "../App";
import { showCustomAlert } from "../component/CustomAlert";
import { setChannelData } from "../redux/userSlice";

const CreatePlaylist = () => {
  const navigate = useNavigate();
  const { channelData } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const { videoData } = useSelector((state) => state.content);
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedVideos, setSelectedVideos] = useState([]);
  const [loading, setLoading] = useState(false);

  const toggleVideoSelect = (videoId) => {
    setSelectedVideos((prev) =>
      prev.includes(videoId)
        ? prev.filter((id) => id !== videoId)
        : [...prev, videoId]
    );
  };

  const handleCreatePlaylist = async () => {
    if (!title) {
      showCustomAlert("Playlist title is required!");
      return;
    }
    if (selectedVideos.length === 0) {
      showCustomAlert("Please select at least one video");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `${serverUrl}/api/content/create-playlist`,
        {
          title,
          description,
          channelId: channelData._id,
          videoIds: selectedVideos,
        },
        { withCredentials: true }
      );

      const updatedChannel = {
        ...channelData,
        playlists: [...(channelData.playlists || []), res.data.playlist],
      };
      dispatch(setChannelData(updatedChannel));

      showCustomAlert("Playlist created successfully");
      navigate("/");
    } catch (error) {
      console.error(error);
      showCustomAlert(error.response?.data?.message || "Failed to create playlist");
    }
    setLoading(false);
  };

  return (
    <div className="w-full min-h-screen  text-white pt-20 pb-12 px-4">
      {/* Decorative Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#795d3f]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-[#795d3f]/5 rounded-full blur-3xl"></div>
      </div>

      {/* Header Section */}
      <div className="max-w-4xl mx-auto mb-12 text-center">
        <div className="inline-block p-4 bg-[#795d3f]/10 rounded-2xl mb-6">
          <FaList className="text-6xl text-[#795d3f]" />
        </div>
        <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-4 bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
          Create Playlist
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          Organize your videos into collections for easy viewing
        </p>
         <div className="mt-4 max-w-6xl mx-auto">
        <div className="h-1 bg-gradient-to-r from-transparent via-[#d4a574]/30 to-transparent rounded-full"></div>
      </div>
      </div>

      {/* Main Content */}
      <main className="flex justify-center px-4">
        <div className="bg-slate-900/40 backdrop-blur-sm border-2 border-slate-800/50 p-8 rounded-2xl w-full max-w-4xl shadow-2xl space-y-8">
          
          {/* Playlist Details Section */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white flex items-center gap-3">
              <div className="p-2 bg-[#795d3f]/10 rounded-lg">
                <MdPlaylistAdd className="text-2xl text-[#795d3f]" />
              </div>
              Playlist Details
            </h3>

            {/* Title Input */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-slate-300">
                Playlist Title *
              </label>
              <input
                type="text"
                placeholder="e.g., My Favorite Videos, Tutorial Series..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-4 rounded-xl bg-slate-950/50 border-2 border-slate-700/50 text-white placeholder-slate-500 focus:outline-none focus:border-[#795d3f] focus:ring-2 focus:ring-[#795d3f]/20 transition-all"
              />
            </div>

            {/* Description Textarea */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-slate-300">
                Description
              </label>
              <textarea
                placeholder="Describe what this playlist is about..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="4"
                className="w-full p-4 rounded-xl bg-slate-950/50 border-2 border-slate-700/50 text-white placeholder-slate-500 focus:outline-none focus:border-[#795d3f] focus:ring-2 focus:ring-[#795d3f]/20 transition-all resize-none"
              />
            </div>
          </div>

          {/* Video Selection Section */}
          <div className="space-y-4 pt-6 border-t border-slate-800/50">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">Select Videos</h3>
              <div className="bg-[#795d3f]/10 px-4 py-2 rounded-full border border-[#795d3f]/30">
                <span className="text-sm font-semibold text-[#795d3f]">
                  {selectedVideos.length} selected
                </span>
              </div>
            </div>

            {videoData?.length === 0 ? (
              <div className="text-center py-16 bg-slate-950/30 rounded-xl border-2 border-dashed border-slate-800/50">
                <FaList className="text-6xl text-slate-700 mx-auto mb-4" />
                <p className="text-slate-400 mb-2 text-lg font-medium">
                  No videos found
                </p>
                <p className="text-sm text-slate-600">
                  Upload some videos first to create a playlist
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent p-2">
                {videoData?.map((video) => {
                  const isSelected = selectedVideos.includes(video._id);
                  return (
                    <div
                      key={video._id}
                      onClick={() => toggleVideoSelect(video._id)}
                      className={`cursor-pointer rounded-xl overflow-hidden border-2 transition-all duration-200 hover:-translate-y-1 ${
                        isSelected
                          ? "border-[#795d3f] bg-[#795d3f]/10 shadow-lg shadow-[#795d3f]/20"
                          : "border-slate-700/50 hover:border-[#795d3f]/50 bg-slate-950/30"
                      }`}
                    >
                      <div className="relative">
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-full aspect-video object-cover"
                        />
                        {isSelected && (
                          <div className="absolute inset-0 bg-[#795d3f]/20 flex items-center justify-center">
                            <div className="bg-[#795d3f] rounded-full p-3">
                              <FaCheck className="text-white text-2xl" />
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="p-3">
                        <h4 className="font-semibold text-white text-sm line-clamp-2 mb-1">
                          {video.title}
                        </h4>
                        <p className="text-xs text-slate-400">
                          {video.views || 0} views
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-6">
            <button
              onClick={() => navigate("/")}
              className="flex-1 px-6 py-4 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 text-white font-semibold transition-all border-2 border-slate-700/50 hover:border-slate-600"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={handleCreatePlaylist}
              disabled={loading || !title || selectedVideos.length === 0}
              className="flex-1 px-6 py-4 rounded-xl bg-gradient-to-r from-[#795d3f] to-[#9b7653] hover:from-[#8a6d4a] hover:to-[#a98561] text-white font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-[#795d3f]/20"
            >
              {loading ? (
                <>
                  <ClipLoader size={20} color="#ffffff" />
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <MdPlaylistAdd className="text-xl" />
                  <span>Create Playlist</span>
                </>
              )}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreatePlaylist;