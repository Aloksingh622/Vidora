import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import { FaArrowLeft, FaCheckCircle, FaTrash, FaSave } from "react-icons/fa";
import { MdEdit, MdPlaylistPlay, MdVideoLibrary } from "react-icons/md";
import { BiPlayCircle } from "react-icons/bi";
import { serverUrl } from "../App";
import { showCustomAlert } from "../component/CustomAlert";
import { setChannelData } from "../redux/userSlice";

const ManagePlaylist = () => {
  const { playlistId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { channelData } = useSelector((state) => state.user);
  const { videoData } = useSelector((state) => state.content);

  const [playlist, setPlaylist] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedVideos, setSelectedVideos] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch playlist details
  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        const res = await axios.get(
          `${serverUrl}/api/content/fetch-playlist/${playlistId}`,
          { withCredentials: true }
        );
        setPlaylist(res.data.playlist);
        setTitle(res.data.playlist.title);
        setDescription(res.data.playlist.description);
        setSelectedVideos(res.data.playlist.videos.map((v) => v._id));
      } catch (error) {
        console.error(error);
        showCustomAlert("Failed to load playlist");
      }
    };
    fetchPlaylist();
  }, [playlistId]);

  // Toggle video selection
  const toggleVideoSelect = (videoId) => {
    setSelectedVideos((prev) =>
      prev.includes(videoId)
        ? prev.filter((id) => id !== videoId)
        : [...prev, videoId]
    );
  };

  // Update Playlist
  const handleUpdate = async () => {
    if (!title) {
      showCustomAlert("Playlist title is required!");
      return;
    }

    setLoading(true);
    try {
      // Find difference between old playlist.videos and new selectedVideos
      const currentVideos = playlist.videos.map((v) => v._id.toString());
      const newVideos = selectedVideos.map((v) => v.toString());

      const addVideos = newVideos.filter((id) => !currentVideos.includes(id));
      const removeVideos = currentVideos.filter((id) => !newVideos.includes(id));

      const res = await axios.put(
        `${serverUrl}/api/content/update-playlist/${playlistId}`,
        {
          title,
          description,
          addVideos,
          removeVideos,
        },
        { withCredentials: true }
      );

      // Update Redux channelData
      const updatedPlaylists = channelData.playlists.map((p) =>
        p._id === playlistId ? res.data.playlist : p
      );
      dispatch(setChannelData({ ...channelData, playlists: updatedPlaylists }));

      showCustomAlert("Playlist updated successfully");
    } catch (error) {
      console.error(error);
      showCustomAlert(error.response?.data?.message || "Failed to update playlist");
    }
    setLoading(false);
  };

  // Delete Playlist
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this playlist?")) return;

    setLoading(true);
    try {
      await axios.delete(
        `${serverUrl}/api/content/delete-playlist/${playlistId}`,
        { withCredentials: true }
      );

      // Remove playlist from Redux
      const updatedPlaylists = channelData.playlists.filter(
        (p) => p._id !== playlistId
      );
      dispatch(setChannelData({ ...channelData, playlists: updatedPlaylists }));

      showCustomAlert("Playlist deleted successfully");
      navigate("/");
    } catch (error) {
      console.error(error);
      showCustomAlert(error.response?.data?.message || "Failed to delete playlist");
    }
    setLoading(false);
  };

  if (!playlist) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-[#795d3f] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 text-lg">Loading playlist...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen  text-white px-4 py-6">
      {/* Back Button */}
      <div className="max-w-6xl mx-auto mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-400 hover:text-[#795d3f] transition-colors group"
        >
          <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-semibold">Back</span>
        </button>
      </div>

      {/* Header */}
      <div className="max-w-6xl mx-auto mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#795d3f]/10 rounded-xl">
            <MdEdit className="text-[#795d3f] w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Manage Playlist</h2>
            <p className="text-sm text-slate-400">Edit your video collection</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Playlist Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Playlist Details Form */}
            <div className="bg-slate-900/40 backdrop-blur-sm border-2 border-slate-800/50 rounded-2xl p-6 shadow-2xl space-y-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-[#795d3f]/10 rounded-lg">
                  <MdPlaylistPlay className="text-[#795d3f] w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold">Playlist Details</h3>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Playlist Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter playlist title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-3 rounded-xl bg-black border-2 border-slate-800/50 text-white placeholder:text-slate-500 focus:outline-none focus:border-[#795d3f] focus:ring-2 focus:ring-[#795d3f]/20 transition-all"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Description
                </label>
                <textarea
                  placeholder="Enter playlist description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-3 rounded-xl bg-black border-2 border-slate-800/50 text-white placeholder:text-slate-500 focus:outline-none focus:border-[#795d3f] focus:ring-2 focus:ring-[#795d3f]/20 transition-all resize-none"
                  rows="4"
                />
              </div>
            </div>

            {/* Stats */}
            <div className="bg-slate-900/40 backdrop-blur-sm border-2 border-slate-800/50 rounded-2xl p-6 shadow-2xl">
              <h3 className="text-lg font-bold mb-4">Playlist Stats</h3>
              <div className="space-y-3">
                <div className="bg-black/50 rounded-xl p-4 border border-slate-800/50">
                  <p className="text-xs text-slate-400 mb-1">Selected Videos</p>
                  <p className="text-2xl font-bold text-[#795d3f]">
                    {selectedVideos.length}
                  </p>
                </div>
                <div className="bg-black/50 rounded-xl p-4 border border-slate-800/50">
                  <p className="text-xs text-slate-400 mb-1">Total Available</p>
                  <p className="text-2xl font-bold text-[#795d3f]">
                    {videoData?.length || 0}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-slate-900/40 backdrop-blur-sm border-2 border-slate-800/50 rounded-2xl p-6 shadow-2xl space-y-3">
              <button
                onClick={handleUpdate}
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#795d3f] to-[#8a6a47] hover:from-[#6a5038] hover:to-[#795d3f] py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg hover:shadow-[#795d3f]/20 transition-all active:scale-95 disabled:from-slate-800 disabled:to-slate-800 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <ClipLoader size={20} color="white" />
                ) : (
                  <>
                    <FaSave size={18} />
                    <span>Update Playlist</span>
                  </>
                )}
              </button>

              <button
                onClick={handleDelete}
                disabled={loading}
                className="w-full bg-red-600/90 hover:bg-red-600 py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg hover:shadow-red-600/20 transition-all active:scale-95 disabled:bg-slate-800 disabled:cursor-not-allowed"
              >
                <FaTrash size={18} />
                <span>Delete Playlist</span>
              </button>
            </div>
          </div>

          {/* Right Column - Video Selection */}
          <div className="lg:col-span-2">
            <div className="bg-slate-900/40 backdrop-blur-sm border-2 border-slate-800/50 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-[#795d3f]/10 rounded-lg">
                    <MdVideoLibrary className="text-[#795d3f] w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold">Select Videos</h3>
                </div>
                <div className="text-sm text-slate-400">
                  {selectedVideos.length} selected
                </div>
              </div>

              {videoData?.length === 0 ? (
                <div className="text-center py-12">
                  <div className="inline-block p-4 bg-[#795d3f]/10 rounded-full mb-4">
                    <MdVideoLibrary className="text-[#795d3f] w-16 h-16" />
                  </div>
                  <p className="text-slate-400 text-lg">No videos found for this channel</p>
                  <p className="text-slate-500 text-sm mt-2">Upload videos to add them to playlists</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                  {videoData?.map((video) => (
                    <div
                      key={video._id}
                      onClick={() => toggleVideoSelect(video._id)}
                      className={`cursor-pointer rounded-xl overflow-hidden border-2 transition-all hover:scale-[1.02] ${
                        selectedVideos.includes(video._id)
                          ? "border-[#795d3f] shadow-lg shadow-[#795d3f]/20"
                          : "border-slate-800/50 hover:border-slate-700"
                      }`}
                    >
                      <div className="relative">
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-full h-36 object-cover"
                        />
                        {selectedVideos.includes(video._id) && (
                          <div className="absolute top-2 right-2 bg-[#795d3f] rounded-full p-1.5">
                            <FaCheckCircle className="text-white w-5 h-5" />
                          </div>
                        )}
                        <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-xs text-white">
                          {video.duration || "0:00"}
                        </div>
                      </div>
                      <div className="p-3 bg-black/30">
                        <p className="text-sm font-semibold text-white truncate mb-1">
                          {video.title}
                        </p>
                        <p className="text-xs text-slate-400">
                          {video.views?.toLocaleString() || 0} views
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
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
  );
};

export default ManagePlaylist;