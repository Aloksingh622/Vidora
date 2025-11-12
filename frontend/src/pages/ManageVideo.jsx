import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import { MdDelete, MdSaveAlt, MdEdit, MdImage } from "react-icons/md";
import { FaVideo, FaArrowLeft } from "react-icons/fa";
import { BiSolidVideos } from "react-icons/bi";
import { serverUrl } from "../App";
import { showCustomAlert } from "../component/CustomAlert";
import { setAllVideoData } from "../redux/contentSlice";

const ManageVideo = () => {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { allVideoData } = useSelector((state) => state.content);

  const [video, setVideo] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch video details
  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const res = await axios.get(`${serverUrl}/api/content/fetch-video/${videoId}`, {
          withCredentials: true,
        });
        setVideo(res.data);
        setTitle(res.data.title);
        setDescription(res.data.description || "");
        setTags(res.data.tags.join(", "));
      } catch (error) {
        showCustomAlert(error.response?.data?.message || "Failed to load video");
        navigate("/");
      }
    };
    fetchVideo();
  }, [videoId, navigate]);

  // Update Video
  const handleUpdate = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("tags", JSON.stringify(tags.split(",").map((t) => t.trim())));
      if (thumbnail) formData.append("thumbnail", thumbnail);

      const result = await axios.put(
        `${serverUrl}/api/content/update-video/${videoId}`,
        formData,
        { withCredentials: true }
      );

      // update redux
      const updatedVideos = allVideoData.map((v) =>
        v._id === videoId ? result.data.video : v
      );
      dispatch(setAllVideoData(updatedVideos));

      showCustomAlert("Video updated successfully");
      
    } catch (error) {
      showCustomAlert(error.response?.data?.message || "Update failed");
    }
    setLoading(false);
  };

  // Delete Video
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this video?")) return;

    setLoading(true);
    try {
      await axios.delete(`${serverUrl}/api/content/delete-video/${videoId}`, {
        withCredentials: true,
      });

      // remove from redux
      dispatch(setAllVideoData(allVideoData.filter((v) => v._id !== videoId)));

      showCustomAlert("Video deleted successfully");
      navigate("/");
    } catch (error) {
      showCustomAlert(error.response?.data?.message || "Delete failed");
    }
    setLoading(false);
  };

  if (!video) {
    return (
      <div className="w-full h-screen flex justify-center items-center bg-black text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-[#795d3f] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 text-lg">Loading video...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  text-white px-4 py-6">
      {/* Back Button */}
      <div className="max-w-5xl mx-auto mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-400 hover:text-[#795d3f] transition-colors group"
        >
          <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-semibold">Back</span>
        </button>
      </div>

      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-[#795d3f]/10 rounded-xl">
            <MdEdit className="text-[#795d3f] w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Manage Video</h2>
            <p className="text-sm text-slate-400">Edit or delete your video content</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Video Preview */}
          <div className="space-y-6">
            {/* Video Player */}
            <div className="bg-slate-900/40 backdrop-blur-sm border-2 border-slate-800/50 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-[#795d3f]/10 rounded-lg">
                  <FaVideo className="text-[#795d3f] w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold">Video Preview</h3>
              </div>
              {video.videoUrl? (
                <video
                  src={video.videoUrl}
                  controls
                  className="w-full rounded-xl border-2 border-slate-800/50 shadow-lg"
                />
              ) : (
                <div className="w-full aspect-video bg-slate-800 rounded-xl flex items-center justify-center border-2 border-slate-800/50">
                  <BiSolidVideos className="text-slate-600 w-16 h-16" />
                </div>
              )}
            </div>

            {/* Current Thumbnail */}
            <div className="bg-slate-900/40 backdrop-blur-sm border-2 border-slate-800/50 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-[#795d3f]/10 rounded-lg">
                  <MdImage className="text-[#795d3f] w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold">Current Thumbnail</h3>
              </div>
              {thumbnail ? (
                <div className="relative group">
                  <img
                    src={URL.createObjectURL(thumbnail)}
                    alt="thumbnail"
                    className="w-full rounded-xl border-2 border-slate-800/50 shadow-lg"
                  />
                  <div className="absolute top-2 right-2 bg-[#795d3f] text-white text-xs font-bold px-2 py-1 rounded-lg">
                    New
                  </div>
                </div>
              ) : video.thumbnail ? (
                <img
                  src={video.thumbnail}
                  alt="thumbnail"
                  className="w-full rounded-xl border-2 border-slate-800/50 shadow-lg"
                />
              ) : (
                <div className="w-full aspect-video bg-slate-800 rounded-xl flex items-center justify-center border-2 border-slate-800/50">
                  <MdImage className="text-slate-600 w-16 h-16" />
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Edit Form */}
          <div className="space-y-6">
            <div className="bg-slate-900/40 backdrop-blur-sm border-2 border-slate-800/50 rounded-2xl p-6 shadow-2xl space-y-5">
              <h3 className="text-xl font-bold mb-4">Video Details</h3>

              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Video Title
                </label>
                <input
                  type="text"
                  placeholder="Enter video title"
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
                  placeholder="Enter video description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-3 rounded-xl bg-black border-2 border-slate-800/50 text-white placeholder:text-slate-500 focus:outline-none focus:border-[#795d3f] focus:ring-2 focus:ring-[#795d3f]/20 transition-all resize-none"
                  rows="4"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Tags
                </label>
                <input
                  type="text"
                  placeholder="gaming, tutorial, tech (comma separated)"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="w-full p-3 rounded-xl bg-black border-2 border-slate-800/50 text-white placeholder:text-slate-500 focus:outline-none focus:border-[#795d3f] focus:ring-2 focus:ring-[#795d3f]/20 transition-all"
                />
                <p className="text-xs text-slate-500 mt-1">Separate tags with commas</p>
              </div>

              {/* Thumbnail Upload */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Update Thumbnail
                </label>
                <label className="block cursor-pointer group">
                  <div className="w-full h-32 bg-slate-800 rounded-xl flex flex-col items-center justify-center border-2 border-slate-800/50 group-hover:border-[#795d3f] transition-all">
                    <MdImage className="text-slate-500 group-hover:text-[#795d3f] w-10 h-10 mb-2 transition-colors" />
                    <span className="text-slate-400 group-hover:text-[#795d3f] text-sm font-semibold transition-colors">
                      Click to upload new thumbnail
                    </span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => setThumbnail(e.target.files[0])}
                  />
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  onClick={handleUpdate}
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-[#795d3f] to-[#8a6a47] hover:from-[#6a5038] hover:to-[#795d3f] py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg hover:shadow-[#795d3f]/20 transition-all active:scale-95 disabled:from-slate-800 disabled:to-slate-800 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <ClipLoader size={20} color="white" />
                  ) : (
                    <>
                      <MdSaveAlt size={20} />
                      <span>Update Video</span>
                    </>
                  )}
                </button>
                <button
                  onClick={handleDelete}
                  disabled={loading}
                  className="flex-1 bg-red-600/90 hover:bg-red-600 py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg hover:shadow-red-600/20 transition-all active:scale-95 disabled:bg-slate-800 disabled:cursor-not-allowed"
                >
                  <MdDelete size={20} />
                  <span>Delete Video</span>
                </button>
              </div>
            </div>

            {/* Video Stats */}
            <div className="bg-slate-900/40 backdrop-blur-sm border-2 border-slate-800/50 rounded-2xl p-6 shadow-2xl">
              <h3 className="text-lg font-bold mb-4">Video Statistics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-black/50 rounded-xl p-4 border border-slate-800/50">
                  <p className="text-xs text-slate-400 mb-1">Views</p>
                  <p className="text-2xl font-bold text-[#795d3f]">{video.views?.toLocaleString() || 0}</p>
                </div>
                <div className="bg-black/50 rounded-xl p-4 border border-slate-800/50">
                  <p className="text-xs text-slate-400 mb-1">Duration</p>
                  <p className="text-2xl font-bold text-[#795d3f]">{video.duration || "N/A"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageVideo;