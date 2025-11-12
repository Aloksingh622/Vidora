import React, { useState } from "react";
import { MdCloudUpload, MdVideoLibrary, MdImage } from "react-icons/md";
import { ClipLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { serverUrl } from "../App";
import { showCustomAlert } from "../component/CustomAlert";
import { setChannelData } from "../redux/userSlice";
import { setAllVideoData } from "../redux/contentSlice";

const CreateVideo = () => {
  const navigate = useNavigate();
  const { channelData } = useSelector((state) => state.user);
  const { allVideoData } = useSelector((state) => state.content);

  const [videoFile, setVideoFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleVideoChange = (e) => setVideoFile(e.target.files[0]);
  const handleThumbnailChange = (e) => setThumbnail(e.target.files[0]);

  const handlePublish = async () => {
    if (!videoFile || !thumbnail || !title) {
      showCustomAlert("Video, thumbnail and title are required!");
      return;
    }

    const formData = new FormData();
    formData.append("video", videoFile);
    formData.append("thumbnail", thumbnail);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("tags", JSON.stringify(tags.split(",").map(tag => tag.trim())));
    formData.append("channel", channelData?._id);

    setLoading(true);
    try {
      const result = await axios.post(`${serverUrl}/api/content/upload-video`, formData, {
        withCredentials: true,
      });
      dispatch(setAllVideoData([...allVideoData, result.data.video]));
      const updatedChannel = {
        ...channelData,
        videos: [...(channelData.videos || []), result.data.video]
      };
      dispatch(setChannelData(updatedChannel));

      showCustomAlert("Video Uploaded Successfully");
      console.log(result.data);
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
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#795d3f]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#795d3f]/5 rounded-full blur-3xl"></div>
      </div>

      {/* Header Section */}
      <div className="max-w-4xl mx-auto mb-12 text-center">
        <div className="inline-block p-4 bg-[#795d3f]/10 rounded-2xl mb-6">
          <MdCloudUpload className="text-6xl text-[#795d3f]" />
        </div>
        <h1 className="text-5xl md:text-6xl text-[#795d3f] font-bold tracking-tight mb-4  bg-clip-text ">
          Upload Video
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          Share your content with the world. Fill in the details below to publish your video.
        </p>
         <div className="mt-4 max-w-6xl mx-auto">
        <div className="h-1 bg-gradient-to-r from-transparent via-[#d4a574]/30 to-transparent rounded-full"></div>
      </div>
      </div>

      {/* Main Form */}
      <main className="flex justify-center px-4">
        <div className="bg-slate-900/40 backdrop-blur-sm border-2 border-slate-800/50 p-8 rounded-2xl w-full max-w-4xl shadow-2xl space-y-8">
          
          {/* Video Upload Section */}
          <div className="space-y-3">
            <label className=" text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
              <MdVideoLibrary className="text-[#795d3f]" />
              Video File *
            </label>
            <label
              htmlFor="video-upload"
              className="cursor-pointer border-2 border-dashed border-slate-700/50 hover:border-[#795d3f]/50 rounded-xl flex flex-col items-center justify-center p-8 transition-all bg-slate-950/30 hover:bg-slate-900/30 group"
            >
              {videoFile ? (
                <div className="text-center">
                  <MdVideoLibrary className="text-5xl text-[#795d3f] mx-auto mb-3" />
                  <p className="text-white font-semibold mb-1">{videoFile.name}</p>
                  <p className="text-sm text-slate-500">
                    {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                  <p className="text-xs text-[#795d3f] mt-2">Click to change file</p>
                </div>
              ) : (
                <div className="text-center">
                  <MdCloudUpload className="text-6xl text-slate-600 group-hover:text-[#795d3f] mx-auto mb-4 transition-colors" />
                  <p className="text-white font-semibold mb-2">Click to upload video</p>
                  <p className="text-sm text-slate-500">MP4, AVI, MOV up to 500MB</p>
                </div>
              )}
              <input
                id="video-upload"
                type="file"
                accept="video/*"
                className="hidden"
                onChange={handleVideoChange}
              />
            </label>
          </div>

          {/* Title Input */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-slate-300">
              Title *
            </label>
            <input
              type="text"
              placeholder="Enter your video title..."
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
              placeholder="Tell viewers about your video..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="5"
              className="w-full p-4 rounded-xl bg-slate-950/50 border-2 border-slate-700/50 text-white placeholder-slate-500 focus:outline-none focus:border-[#795d3f] focus:ring-2 focus:ring-[#795d3f]/20 transition-all resize-none"
            />
            <p className="text-xs text-slate-500 flex items-center gap-1">
              <span className="inline-block w-1.5 h-1.5 bg-[#795d3f] rounded-full"></span>
              Add a detailed description to help viewers find your content
            </p>
          </div>

          {/* Tags */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-slate-300">
              Tags
            </label>
            <input
              type="text"
              placeholder="gaming, tutorial, entertainment (comma separated)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full p-4 rounded-xl bg-slate-950/50 border-2 border-slate-700/50 text-white placeholder-slate-500 focus:outline-none focus:border-[#795d3f] focus:ring-2 focus:ring-[#795d3f]/20 transition-all"
            />
          </div>

          {/* Thumbnail Upload */}
          <div className="space-y-3">
            <label className=" text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
              <MdImage className="text-[#795d3f]" />
              Thumbnail *
            </label>
            <label htmlFor="thumbnail-upload" className="block cursor-pointer">
              {thumbnail ? (
                <div className="relative rounded-xl overflow-hidden border-2 border-slate-700/50 hover:border-[#795d3f]/50 transition-all group">
                  <img
                    src={URL.createObjectURL(thumbnail)}
                    alt="thumbnail"
                    className="w-full aspect-video object-cover"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="text-center">
                      <MdImage className="text-4xl text-white mx-auto mb-2" />
                      <p className="text-white font-semibold">Click to change thumbnail</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-full aspect-video bg-slate-950/50 border-2 border-dashed border-slate-700/50 hover:border-[#795d3f]/50 rounded-xl flex items-center justify-center transition-all group cursor-pointer">
                  <div className="text-center">
                    <MdImage className="text-6xl text-slate-600 group-hover:text-[#795d3f] mx-auto mb-3 transition-colors" />
                    <p className="text-white font-semibold mb-1">Click to upload thumbnail</p>
                    <p className="text-sm text-slate-500">JPG, PNG up to 5MB</p>
                    <p className="text-xs text-slate-600 mt-2">Recommended: 1280x720 pixels</p>
                  </div>
                </div>
              )}
              <input
                id="thumbnail-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleThumbnailChange}
              />
            </label>
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
                  <MdCloudUpload className="text-2xl" />
                  <span>Publish Video</span>
                </>
              )}
            </button>
            {loading && (
              <div className="mt-4 text-center">
                <p className="text-slate-300 text-sm animate-pulse mb-2">
                  Video uploading... please wait...
                </p>
                <div className="max-w-md mx-auto bg-slate-950/50 rounded-full h-2 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#795d3f] to-[#8a6a47] animate-pulse"></div>
                </div>
              </div>
            )}
          </div>

          {/* Info Box */}
          <div className="bg-[#795d3f]/10 border border-[#795d3f]/30 rounded-xl p-4 flex items-start gap-3">
            <svg className="w-5 h-5 text-[#795d3f] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h4 className="text-sm font-semibold text-[#795d3f] mb-1">Upload Tips</h4>
              <ul className="text-xs text-slate-400 space-y-1">
                <li>• Use an eye-catching thumbnail to attract viewers</li>
                <li>• Write a clear, descriptive title with relevant keywords</li>
                <li>• Add tags to help people discover your content</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateVideo;