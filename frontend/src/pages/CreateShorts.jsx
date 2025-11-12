import React, { useState } from "react";
import { FaCloudUploadAlt, FaPlay } from "react-icons/fa";
import { MdVideoLibrary } from "react-icons/md";
import { ClipLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { serverUrl } from "../App";
import { showCustomAlert } from "../component/CustomAlert";
import { setChannelData } from "../redux/userSlice";
import { setAllShortData } from "../redux/contentSlice";

const CreateShort = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { channelData } = useSelector((state) => state.user);
  const { allShortData } = useSelector((state) => state.content);

  const [video, setVideo] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePublish = async () => {
    if (!video || !title) {
      showCustomAlert("Short video and title are required!");
      return;
    }

    const formData = new FormData();
    formData.append("short", video);
    formData.append("title", title);
    formData.append("description", description);
    formData.append(
      "tags",
      JSON.stringify(tags.split(",").map((tag) => tag.trim()))
    );
    formData.append("channelId", channelData?._id);

    setLoading(true);
    try {
      const result = await axios.post(
        `${serverUrl}/api/content/upload-short`,
        formData,
        {
          withCredentials: true,
        }
      );
      dispatch(setAllShortData([...allShortData, result.data.short]));
      const updatedChannel = {
        ...channelData,
        shorts: [...(channelData.shorts || []), result.data.short],
      };
      dispatch(setChannelData(updatedChannel));

      showCustomAlert("Short Uploaded Successfully");
      navigate("/");
    } catch (error) {
      console.error(error);
      showCustomAlert(error.response?.data?.message || "Upload failed");
    }
    setLoading(false);
  };

  return (
    <div className="w-full min-h-screen  text-white pt-10 pb-12 px-4">
      {/* Decorative Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#795d3f]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-[#795d3f]/5 rounded-full blur-3xl"></div>
      </div>

      {/* Header Section */}
      <div className="max-w-5xl mx-auto mb-12 text-center">
        <div className="inline-block p-4 bg-[#795d3f]/10 rounded-2xl mb-6">
          <FaPlay className="text-6xl text-[#795d3f]" />
        </div>
        <h1 className="text-5xl md:text-6xl text-[#795d3f] font-bold tracking-tight mb-4  bg-clip-text ">
          Create Short
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          Share quick, engaging vertical videos. Perfect for catching attention in 60 seconds or less.
        </p>
           <div className="mt-4 max-w-6xl mx-auto">
        <div className="h-1 bg-gradient-to-r from-transparent via-[#d4a574]/30 to-transparent rounded-full"></div>
      </div>
      </div>

      {/* Main Content */}
      <main className="flex justify-center px-4">
        <div className="bg-slate-900/40 backdrop-blur-sm border-2 border-slate-800/50 p-8 rounded-2xl w-full max-w-5xl shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* LEFT: Video Upload Preview */}
            <div className="flex flex-col items-center space-y-4">
              <div className="w-full">
                <label className=" text-sm font-semibold text-slate-300 mb-4 flex items-center gap-2">
                  <MdVideoLibrary className="text-[#795d3f]" />
                  Short Video Preview *
                </label>
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-700/50 hover:border-[#795d3f]/50 rounded-2xl cursor-pointer bg-slate-950/30 hover:bg-slate-900/30 overflow-hidden w-full max-w-[300px] mx-auto aspect-[9/16] transition-all group">
                  {video ? (
                    <div className="relative w-full h-full">
                      <video
                        src={URL.createObjectURL(video)}
                        className="h-full w-full object-cover rounded-xl"
                        controls
                      />
                      <div className="absolute top-3 right-3 bg-[#795d3f] text-white text-xs font-bold px-3 py-1 rounded-full">
                        SHORT
                      </div>
                    </div>
                  ) : (
                    <div className="text-center p-6">
                      <FaCloudUploadAlt className="text-6xl text-slate-600 group-hover:text-[#795d3f] mx-auto mb-4 transition-colors" />
                      <p className="text-white font-semibold mb-2">Upload Short Video</p>
                      <p className="text-sm text-slate-500 mb-1">Vertical format (9:16)</p>
                      <span className="text-xs text-slate-600">MP4 or MOV — Max 60 seconds</span>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="video/mp4,video/quicktime"
                    className="hidden"
                    onChange={(e) => setVideo(e.target.files[0])}
                  />
                </label>
              </div>

              {/* Video Info */}
              {video && (
                <div className="bg-[#795d3f]/10 border border-[#795d3f]/30 rounded-xl p-4 w-full max-w-[300px] mx-auto">
                  <div className="flex items-start gap-3">
                    <FaPlay className="text-[#795d3f] flex-shrink-0 mt-1" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{video.name}</p>
                      <p className="text-xs text-slate-400 mt-1">
                        {(video.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Tips Box */}
              <div className="bg-slate-950/50 border border-slate-800/50 rounded-xl p-4 w-full max-w-[300px] mx-auto">
                <h4 className="text-sm font-semibold text-[#795d3f] mb-2 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Shorts Tips
                </h4>
                <ul className="text-xs text-slate-400 space-y-1.5">
                  <li>• Keep it under 60 seconds</li>
                  <li>• Use vertical 9:16 format</li>
                  <li>• Hook viewers in first 3 seconds</li>
                  <li>• Add trending music or sounds</li>
                </ul>
              </div>
            </div>

            {/* RIGHT: Form Inputs */}
            <div className="flex flex-col space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-white mb-6">Video Details</h3>
              </div>

              {/* Title */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-slate-300">
                  Title *
                </label>
                <input
                  type="text"
                  placeholder="Give your short a catchy title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-4 rounded-xl bg-slate-950/50 border-2 border-slate-700/50 text-white placeholder-slate-500 focus:outline-none focus:border-[#795d3f] focus:ring-2 focus:ring-[#795d3f]/20 transition-all"
                />
              </div>

              {/* Description */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-slate-300">
                  Description
                </label>
                <textarea
                  placeholder="Describe what your short is about..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows="4"
                  className="w-full p-4 rounded-xl bg-slate-950/50 border-2 border-slate-700/50 text-white placeholder-slate-500 focus:outline-none focus:border-[#795d3f] focus:ring-2 focus:ring-[#795d3f]/20 transition-all resize-none"
                />
              </div>

              {/* Tags */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-slate-300">
                  Tags
                </label>
                <input
                  type="text"
                  placeholder="shorts, trending, viral (comma separated)"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="w-full p-4 rounded-xl bg-slate-950/50 border-2 border-slate-700/50 text-white placeholder-slate-500 focus:outline-none focus:border-[#795d3f] focus:ring-2 focus:ring-[#795d3f]/20 transition-all"
                />
                <p className="text-xs text-slate-500 flex items-center gap-1">
                  <span className="inline-block w-1.5 h-1.5 bg-[#795d3f] rounded-full"></span>
                  Use relevant tags to help people discover your short
                </p>
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
                      <FaPlay className="text-xl" />
                      <span>Publish Short</span>
                    </>
                  )}
                </button>
                {loading && (
                  <div className="mt-4 text-center">
                    <p className="text-slate-300 text-sm animate-pulse mb-2">
                      Short uploading... please wait...
                    </p>
                    <div className="max-w-md mx-auto bg-slate-950/50 rounded-full h-2 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#795d3f] to-[#8a6a47] w-1/2 animate-pulse"></div>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateShort;