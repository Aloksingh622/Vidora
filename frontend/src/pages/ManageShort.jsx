import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { FaTrash, FaSave, FaArrowLeft } from "react-icons/fa";
import { MdEdit, MdPlayCircle } from "react-icons/md";
import { BiSolidVideos } from "react-icons/bi";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { serverUrl } from "../App";
import { showCustomAlert } from "../component/CustomAlert";
import { setAllShortData } from "../redux/contentSlice";
import { setChannelData } from "../redux/userSlice";

const ManageShort = () => {
  const { shortId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { allShortData } = useSelector((state) => state.content);
  const { channelData } = useSelector((state) => state.user);

  const [shortData, setShortData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");

  // fetch short details
  useEffect(() => {
    const fetchShort = async () => {
      try {
        const res = await axios.get(
          `${serverUrl}/api/content/fetch-short/${shortId}`,
          { withCredentials: true }
        );
        setShortData(res.data.short);
        setTitle(res.data.short.title);
        setDescription(res.data.short.description);
        setTags(res.data.short.tags?.join(", ") || "");
      } catch (error) {
        console.error(error);
        showCustomAlert("Failed to load short", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchShort();
  }, [shortId]);

  // handle update
  const handleUpdate = async () => {
    if (!title.trim()) {
      showCustomAlert("Title is required", "error");
      return;
    }
    try {
      setUpdating(true);
      const res = await axios.put(
        `${serverUrl}/api/content/update-short/${shortId}`,
        {
          title,
          description,
          tags: JSON.stringify(
            tags.split(",").map((t) => t.trim()).filter(Boolean)
          ),
        },
        { withCredentials: true }
      );

      const updatedShort = res.data.short;

      // update allShortData in Redux
      const updatedAllShorts = allShortData.map((s) =>
        s._id === shortId ? updatedShort : s
      );
      dispatch(setAllShortData(updatedAllShorts));

      const updatedChannel = {
        ...channelData,
        shorts: channelData.shorts.map((s) =>
          s._id === shortId ? updatedShort : s
        ),
      };
      dispatch(setChannelData(updatedChannel));

      showCustomAlert("Short updated successfully", "success");
    } catch (error) {
      console.error(error);
      showCustomAlert("Failed to update short", "error");
    } finally {
      setUpdating(false);
    }
  };

  // handle delete
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this short?")) return;
    try {
      await axios.delete(`${serverUrl}/api/content/delete-short/${shortId}`, {
        withCredentials: true,
      });

     
      const updatedAllShorts = allShortData.filter((s) => s._id !== shortId);
      dispatch(setAllShortData(updatedAllShorts));

      const updatedChannel = {
        ...channelData,
        shorts: channelData.shorts.filter((s) => s._id !== shortId),
      };
      dispatch(setChannelData(updatedChannel));

      showCustomAlert("Short deleted successfully", "success");
      navigate("/ptstudio/content");
    } catch (error) {
      console.error(error);
      showCustomAlert("Failed to delete short", "error");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-[#795d3f] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 text-lg">Loading short...</p>
        </div>
      </div>
    );
  }

  if (!shortData) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-black text-slate-400">
        <BiSolidVideos className="w-20 h-20 mb-4 text-slate-600" />
        <p className="text-xl">Short not found</p>
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
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Manage Short</h2>
            <p className="text-sm text-slate-400">Edit or delete your short-form content</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* LEFT: Short Preview */}
          <div className="bg-slate-900/40 backdrop-blur-sm border-2 border-slate-800/50 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-[#795d3f]/10 rounded-lg">
                <MdPlayCircle className="text-[#795d3f] w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold">Short Preview</h3>
            </div>
            <div className="flex justify-center items-center bg-black rounded-xl overflow-hidden border-2 border-slate-800/50">
              <video
                src={shortData.shortUrl}
                className="h-[500px] w-auto aspect-[9/16] object-cover"
                controls
                playsInline
                muted
              />
            </div>

            {/* Stats */}
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="bg-black/50 rounded-xl p-4 border border-slate-800/50">
                <p className="text-xs text-slate-400 mb-1">Views</p>
                <p className="text-2xl font-bold text-[#795d3f]">
                  {shortData.views?.toLocaleString() || 0}
                </p>
              </div>
              <div className="bg-black/50 rounded-xl p-4 border border-slate-800/50">
                <p className="text-xs text-slate-400 mb-1">Likes</p>
                <p className="text-2xl font-bold text-[#795d3f]">
                                    {Array.isArray(shortData.likes) ? shortData.likes.length : 0}

                </p>
              </div>
            </div>
          </div>

          {/* RIGHT: Edit Form */}
          <div className="space-y-6">
            <div className="bg-slate-900/40 backdrop-blur-sm border-2 border-slate-800/50 rounded-2xl p-6 shadow-2xl space-y-5">
              <h3 className="text-xl font-bold mb-4">Short Details</h3>

              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter short title"
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
                  placeholder="Enter short description"
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
                  placeholder="funny, trending, viral (comma separated)"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="w-full p-3 rounded-xl bg-black border-2 border-slate-800/50 text-white placeholder:text-slate-500 focus:outline-none focus:border-[#795d3f] focus:ring-2 focus:ring-[#795d3f]/20 transition-all"
                />
                <p className="text-xs text-slate-500 mt-1">Separate tags with commas</p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  onClick={handleUpdate}
                  disabled={updating}
                  className="flex-1 bg-gradient-to-r from-[#795d3f] to-[#8a6a47] hover:from-[#6a5038] hover:to-[#795d3f] py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg hover:shadow-[#795d3f]/20 transition-all active:scale-95 disabled:from-slate-800 disabled:to-slate-800 disabled:cursor-not-allowed"
                >
                  {updating ? (
                    <ClipLoader size={20} color="white" />
                  ) : (
                    <>
                      <FaSave size={18} />
                      <span>Update Short</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleDelete}
                  disabled={updating}
                  className="flex-1 bg-red-600/90 hover:bg-red-600 py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg hover:shadow-red-600/20 transition-all active:scale-95 disabled:bg-slate-800 disabled:cursor-not-allowed"
                >
                  <FaTrash size={18} />
                  <span>Delete</span>
                </button>
              </div>
            </div>

            {/* Tips Card */}
            <div className="bg-gradient-to-r from-[#795d3f]/20 to-[#8a6a47]/20 border-2 border-[#795d3f]/30 rounded-2xl p-5 shadow-xl backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">💡</span>
                <h3 className="text-lg font-bold text-[#795d3f]">Short Tips</h3>
              </div>
              <ul className="text-sm text-slate-300 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-[#795d3f] font-bold">•</span>
                  <span>Keep titles short and catchy for better engagement</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#795d3f] font-bold">•</span>
                  <span>Use trending tags to increase visibility</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#795d3f] font-bold">•</span>
                  <span>Optimal short length is 15-60 seconds</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ManageShort;