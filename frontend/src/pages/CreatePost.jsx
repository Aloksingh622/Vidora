import React, { useState } from "react";
import { FaImage, FaPen } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import { ClipLoader } from "react-spinners";
import { useSelector, useDispatch } from "react-redux";
import { serverUrl } from "../App";
import { showCustomAlert } from "../component/CustomAlert";
import axios from "axios";
import { setChannelData } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";

const CreatePost = () => {
  const { channelData } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePublish = async () => {
    if (!content.trim()) {
      showCustomAlert("Post content is required!");
      return;
    }

    const formData = new FormData();
    formData.append("channelId", channelData?._id);
    formData.append("content", content);
    if (image) formData.append("image", image);

    setLoading(true);
    try {
      const res = await axios.post(`${serverUrl}/api/content/create-post`, formData, {
        withCredentials: true,
      });

      const updatedChannel = {
        ...channelData,
        posts: [...(channelData.posts || []), res.data.post],
      };
      dispatch(setChannelData(updatedChannel));

      showCustomAlert("Post Published Successfully!");
      setContent("");
      navigate("/");
      setImage(null);
    } catch (error) {
      showCustomAlert(error.response?.data?.message || "Post upload failed");
    }
    setLoading(false);
  };

  const removeImage = () => {
    setImage(null);
  };

  return (
    <div className="w-full min-h-screen  text-white pt-20 pb-12 px-4">
      {/* Decorative Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-[#795d3f]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-[#795d3f]/5 rounded-full blur-3xl"></div>
      </div>

      {/* Header Section */}
      <div className="max-w-3xl mx-auto mb-12 text-center">
        <div className="inline-block p-4 bg-[#795d3f]/10 rounded-2xl mb-6">
          <FaPen className="text-6xl text-[#795d3f]" />
        </div>
        <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-4 bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
          Community Post
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          Share updates, polls, and engage with your community
        </p>
         <div className="mt-4 max-w-6xl mx-auto">
        <div className="h-1 bg-gradient-to-r from-transparent via-[#d4a574]/30 to-transparent rounded-full"></div>
      </div>
      </div>

      {/* Main Content */}
      <main className="flex justify-center">
        <div className="bg-slate-900/40 backdrop-blur-sm border-2 border-slate-800/50 p-8 rounded-2xl w-full max-w-3xl shadow-2xl space-y-6">
          
          {/* User Info */}
          <div className="flex items-center gap-3 pb-6 border-b border-slate-800/50">
            <img
              src={channelData?.avatar || "https://via.placeholder.com/40"}
              alt="Channel"
              className="w-12 h-12 rounded-full border-2 border-[#795d3f]"
            />
            <div>
              <h3 className="text-white font-semibold">{channelData?.name}</h3>
              <p className="text-xs text-slate-500">Posting to community</p>
            </div>
          </div>

          {/* Content Textarea */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-slate-300">
              What's on your mind?
            </label>
            <textarea
              placeholder="Share something with your community..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows="8"
              className="w-full p-4 rounded-xl bg-slate-950/50 border-2 border-slate-700/50 text-white placeholder-slate-500 focus:outline-none focus:border-[#795d3f] focus:ring-2 focus:ring-[#795d3f]/20 transition-all resize-none text-base leading-relaxed"
            />
            <p className="text-xs text-slate-500 flex items-center gap-1">
              <span className="inline-block w-1.5 h-1.5 bg-[#795d3f] rounded-full"></span>
              Share updates, ask questions, or start a discussion
            </p>
          </div>

          {/* Image Upload Section */}
          <div className="space-y-3">
            {!image ? (
              <label className="cursor-pointer border-2 border-dashed border-slate-700/50 hover:border-[#795d3f]/50 rounded-xl p-6 flex items-center justify-center gap-3 transition-all bg-slate-950/30 hover:bg-slate-900/30 group">
                <FaImage className="text-3xl text-slate-600 group-hover:text-[#795d3f] transition-colors" />
                <div className="text-center">
                  <p className="text-white font-semibold mb-1">Add Image (Optional)</p>
                  <p className="text-sm text-slate-500">JPG, PNG up to 10MB</p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => setImage(e.target.files[0])}
                />
              </label>
            ) : (
              <div className="relative rounded-xl overflow-hidden border-2 border-slate-700/50 group">
                <img
                  src={URL.createObjectURL(image)}
                  alt="Preview"
                  className="w-full max-h-96 object-cover rounded-xl"
                />
                <button
                  onClick={removeImage}
                  className="absolute top-3 right-3 bg-black/80 hover:bg-red-600 text-white p-2.5 rounded-lg transition-all shadow-lg"
                >
                  <MdClose className="text-xl" />
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4">
                  <p className="text-white text-sm font-medium flex items-center gap-2">
                    <FaImage className="text-[#795d3f]" />
                    {image.name}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Publish Button */}
          <div className="pt-6 border-t border-slate-800/50">
            <button
              onClick={handlePublish}
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#795d3f] to-[#8a6a47] hover:from-[#6a5038] hover:to-[#795d3f] disabled:from-slate-700 disabled:to-slate-700 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-3 shadow-lg shadow-[#795d3f]/30 disabled:shadow-none transform hover:-translate-y-0.5 active:translate-y-0 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <ClipLoader size={20} color="white" />
                  <span>Publishing...</span>
                </>
              ) : (
                <>
                  <FaPen className="text-xl" />
                  <span>Publish Post</span>
                </>
              )}
            </button>
            {loading && (
              <div className="mt-4 text-center">
                <p className="text-slate-300 text-sm animate-pulse mb-2">
                  Publishing your post...
                </p>
                <div className="max-w-md mx-auto bg-slate-950/50 rounded-full h-2 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#795d3f] to-[#8a6a47] w-1/2 animate-pulse"></div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Tips */}
          <div className="bg-[#795d3f]/10 border border-[#795d3f]/30 rounded-xl p-4 flex items-start gap-3">
            <svg className="w-5 h-5 text-[#795d3f] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h4 className="text-sm font-semibold text-[#795d3f] mb-1">Community Guidelines</h4>
              <ul className="text-xs text-slate-400 space-y-1">
                <li>• Be respectful and constructive</li>
                <li>• Share valuable content with your audience</li>
                <li>• Engage authentically with your community</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreatePost;