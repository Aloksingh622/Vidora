import React, { useState } from "react";
import { useSelector } from "react-redux";
import { FaEdit, FaVideo, FaFileVideo, FaList, FaUsers } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";
import { useDispatch } from "react-redux";
import { setChannelData } from "../redux/userSlice";
import { showCustomAlert } from "../component/CustomAlert";

function ContentPage() {
  const { channelData } = useSelector((state) => state.user);
  const [activeTab, setActiveTab] = useState("Videos");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  if (!channelData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-[#795d3f] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 text-lg">Loading channel content...</p>
        </div>
      </div>
    );
  }

  const handleDeletePost = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      await axios.delete(`${serverUrl}/api/content/delete-post/${postId}`, {
        withCredentials: true,
      });

      const updatedPosts = channelData.communityPosts.filter(
        (p) => p._id !== postId
      );
      dispatch(setChannelData({ ...channelData, communityPosts: updatedPosts }));

      showCustomAlert("Post deleted successfully");
    } catch (error) {
      console.error(error);
      showCustomAlert(error.response?.data?.message || "Failed to delete post");
    }
  };

  const tabs = [
    { name: "Videos", icon: <FaVideo className="w-4 h-4" /> },
    { name: "Shorts", icon: <FaFileVideo className="w-4 h-4" /> },
    { name: "Playlists", icon: <FaList className="w-4 h-4" /> },
    { name: "Community", icon: <FaUsers className="w-4 h-4" /> },
  ];

  return (
    <div className="text-white min-h-screen p-4 sm:p-6 mb-16">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight mb-2">
          Content Management
        </h1>
        <p className="text-sm text-slate-400">Manage your videos, shorts, playlists and posts</p>
      </div>

      {/* Tabs */}
      <div className="bg-slate-900/40 backdrop-blur-sm border-2 border-slate-800/50 rounded-2xl p-2 mb-6 shadow-xl">
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all ${
                activeTab === tab.name
                  ? "bg-gradient-to-br from-[#795d3f] to-[#8a6a47] text-white shadow-lg"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50"
              }`}
            >
              {tab.icon}
              <span className="text-sm">{tab.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Section Content */}
      <div className="space-y-6">
        {/* ------------------ VIDEOS ------------------ */}
        {activeTab === "Videos" && (
          <>
            {/* Stats Card */}
            <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border-2 border-blue-500/30 rounded-2xl p-4 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <FaVideo className="text-blue-400 w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-slate-300">Total Videos</p>
                  <p className="text-2xl font-bold text-white">{channelData.videos?.length || 0}</p>
                </div>
              </div>
            </div>

            {/* Table (desktop & tablet) */}
            <div className="hidden md:block overflow-x-auto bg-slate-900/40 backdrop-blur-sm border-2 border-slate-800/50 rounded-2xl shadow-xl">
              <table className="min-w-full">
                <thead className="bg-slate-800/50">
                  <tr>
                    <th className="p-4 text-left text-sm font-semibold text-slate-300">Thumbnail</th>
                    <th className="p-4 text-left text-sm font-semibold text-slate-300">Title</th>
                    <th className="p-4 text-left text-sm font-semibold text-slate-300">Views</th>
                    <th className="p-4 text-left text-sm font-semibold text-slate-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {channelData.videos?.map((v) => (
                    <tr
                      key={v._id}
                      className="border-t border-slate-800/50 hover:bg-slate-800/30 transition-colors"
                    >
                      <td className="p-4">
                        <img
                          src={v.thumbnail}
                          alt={v.title}
                          className="w-28 h-16 rounded-lg object-cover shadow-lg"
                        />
                      </td>
                      <td className="p-4 text-sm font-medium">{v.title}</td>
                      <td className="p-4 text-sm text-slate-400">{v.views.toLocaleString()}</td>
                      <td className="p-4">
                        <button
                          onClick={() => navigate(`/ptstudio/managevideo/${v._id}`)}
                          className="p-2 bg-blue-500/10 hover:bg-blue-500/20 rounded-lg transition-colors"
                        >
                          <FaEdit className="text-blue-400 w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Cards (mobile) */}
            <div className="grid gap-4 md:hidden">
              {channelData.videos?.map((v) => (
                <div
                  key={v._id}
                  className="bg-slate-900/40 backdrop-blur-sm border-2 border-slate-800/50 rounded-2xl overflow-hidden shadow-xl hover:border-blue-500/50 transition-all group"
                >
                  <img
                    src={v.thumbnail}
                    alt={v.title}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-base font-semibold mb-2 line-clamp-2">{v.title}</h3>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">{v.views.toLocaleString()} views</span>
                      <button
                        onClick={() => navigate(`/ptstudio/managevideo/${v._id}`)}
                        className="p-2 bg-blue-500/10 hover:bg-blue-500/20 rounded-lg transition-colors"
                      >
                        <FaEdit className="text-blue-400 w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ------------------ SHORTS ------------------ */}
        {activeTab === "Shorts" && (
          <>
            {/* Stats Card */}
            <div className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 border-2 border-emerald-500/30 rounded-2xl p-4 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-500/10 rounded-lg">
                  <FaFileVideo className="text-emerald-400 w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-slate-300">Total Shorts</p>
                  <p className="text-2xl font-bold text-white">{channelData.shorts?.length || 0}</p>
                </div>
              </div>
            </div>

            {/* Table (desktop & tablet) */}
            <div className="hidden md:block overflow-x-auto bg-slate-900/40 backdrop-blur-sm border-2 border-slate-800/50 rounded-2xl shadow-xl">
              <table className="min-w-full">
                <thead className="bg-slate-800/50">
                  <tr>
                    <th className="p-4 text-left text-sm font-semibold text-slate-300">Preview</th>
                    <th className="p-4 text-left text-sm font-semibold text-slate-300">Title</th>
                    <th className="p-4 text-left text-sm font-semibold text-slate-300">Views</th>
                    <th className="p-4 text-left text-sm font-semibold text-slate-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {channelData.shorts?.map((s) => (
                    <tr
                      key={s._id}
                      className="border-t border-slate-800/50 hover:bg-slate-800/30 transition-colors"
                    >
                      <td className="p-4">
                        <video
                          src={s.shortUrl}
                          className="w-16 h-24 bg-black rounded-lg object-cover shadow-lg"
                          muted
                          playsInline
                        />
                      </td>
                      <td className="p-4 text-sm font-medium">{s.title}</td>
                      <td className="p-4 text-sm text-slate-400">{s.views.toLocaleString()}</td>
                      <td className="p-4">
                        <button
                          onClick={() => navigate(`/ptstudio/manageshort/${s._id}`)}
                          className="p-2 bg-emerald-500/10 hover:bg-emerald-500/20 rounded-lg transition-colors"
                        >
                          <FaEdit className="text-emerald-400 w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Cards (mobile) */}
            <div className="grid gap-4 md:hidden">
              {channelData.shorts?.map((s) => (
                <div
                  key={s._id}
                  className="bg-slate-900/40 backdrop-blur-sm border-2 border-slate-800/50 rounded-2xl overflow-hidden shadow-xl hover:border-emerald-500/50 transition-all"
                >
                  <video
                    src={s.shortUrl}
                    className="w-full aspect-[9/16] object-cover"
                    muted
                    playsInline
                    controls
                  />
                  <div className="p-4 flex justify-between items-center">
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold mb-1">{s.title}</h3>
                      <p className="text-xs text-slate-400">{s.views.toLocaleString()} views</p>
                    </div>
                    <button
                      onClick={() => navigate(`/ptstudio/manageshort/${s._id}`)}
                      className="p-2 bg-emerald-500/10 hover:bg-emerald-500/20 rounded-lg transition-colors ml-3"
                    >
                      <FaEdit className="text-emerald-400 w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ------------------ PLAYLISTS ------------------ */}
        {activeTab === "Playlists" && (
          <>
            {/* Stats Card */}
            <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 border-2 border-purple-500/30 rounded-2xl p-4 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <FaList className="text-purple-400 w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-slate-300">Total Playlists</p>
                  <p className="text-2xl font-bold text-white">{channelData.playlists?.length || 0}</p>
                </div>
              </div>
            </div>

            {/* Table (desktop & tablet) */}
            <div className="hidden md:block overflow-x-auto bg-slate-900/40 backdrop-blur-sm border-2 border-slate-800/50 rounded-2xl shadow-xl">
              <table className="min-w-full">
                <thead className="bg-slate-800/50">
                  <tr>
                    <th className="p-4 text-left text-sm font-semibold text-slate-300">Preview</th>
                    <th className="p-4 text-left text-sm font-semibold text-slate-300">Title</th>
                    <th className="p-4 text-left text-sm font-semibold text-slate-300">Total Videos</th>
                    <th className="p-4 text-left text-sm font-semibold text-slate-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {channelData.playlists?.map((p) => (
                    <tr
                      key={p._id}
                      className="border-t border-slate-800/50 hover:bg-slate-800/30 transition-colors"
                    >
                      <td className="p-4">
                        <img
                          src={p.videos[0]?.thumbnail}
                          alt={p.title}
                          className="w-28 h-16 rounded-lg object-cover shadow-lg"
                        />
                      </td>
                      <td className="p-4 text-sm font-medium">{p.title}</td>
                      <td className="p-4 text-sm text-slate-400">{p.videos?.length || 0} videos</td>
                      <td className="p-4">
                        <button
                          onClick={() => navigate(`/ptstudio/manageplaylist/${p._id}`)}
                          className="p-2 bg-purple-500/10 hover:bg-purple-500/20 rounded-lg transition-colors"
                        >
                          <FaEdit className="text-purple-400 w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Cards (mobile) */}
            <div className="grid gap-4 md:hidden">
              {channelData.playlists?.map((p) => (
                <div
                  key={p._id}
                  className="bg-slate-900/40 backdrop-blur-sm border-2 border-slate-800/50 rounded-2xl overflow-hidden shadow-xl hover:border-purple-500/50 transition-all"
                >
                  <img
                    src={p.videos[0]?.thumbnail}
                    alt={p.title}
                    className="w-full h-32 object-cover"
                  />
                  <div className="p-4 flex justify-between items-center">
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold mb-1">{p.title}</h3>
                      <p className="text-xs text-slate-400">{p.videos?.length || 0} videos</p>
                    </div>
                    <button
                      onClick={() => navigate(`/ptstudio/manageplaylist/${p._id}`)}
                      className="p-2 bg-purple-500/10 hover:bg-purple-500/20 rounded-lg transition-colors ml-3"
                    >
                      <FaEdit className="text-purple-400 w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ------------------ COMMUNITY ------------------ */}
        {activeTab === "Community" && (
          <>
            {/* Stats Card */}
            <div className="bg-gradient-to-br from-[#795d3f]/20 to-[#8a6a47]/20 border-2 border-[#795d3f]/30 rounded-2xl p-4 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#795d3f]/10 rounded-lg">
                  <FaUsers className="text-[#795d3f] w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-slate-300">Community Posts</p>
                  <p className="text-2xl font-bold text-white">{channelData.communityPosts?.length || 0}</p>
                </div>
              </div>
            </div>

            {/* Table (desktop & tablet) */}
            <div className="hidden md:block overflow-x-auto bg-slate-900/40 backdrop-blur-sm border-2 border-slate-800/50 rounded-2xl shadow-xl">
              <table className="min-w-full">
                <thead className="bg-slate-800/50">
                  <tr>
                    <th className="p-4 text-left text-sm font-semibold text-slate-300">Image</th>
                    <th className="p-4 text-left text-sm font-semibold text-slate-300">Post</th>
                    <th className="p-4 text-left text-sm font-semibold text-slate-300">Date</th>
                    <th className="p-4 text-left text-sm font-semibold text-slate-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {channelData.communityPosts?.map((post) => (
                    <tr
                      key={post._id}
                      className="border-t border-slate-800/50 hover:bg-slate-800/30 transition-colors"
                    >
                      <td className="p-4">
                        {post.image && (
                          <img
                            src={post.image}
                            className="w-28 h-16 object-cover rounded-lg shadow-lg"
                            alt=""
                          />
                        )}
                      </td>
                      <td className="p-4 text-sm font-medium max-w-md">{post.content}</td>
                      <td className="p-4 text-sm text-slate-400">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => handleDeletePost(post._id)}
                          className="p-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors"
                        >
                          <MdDelete className="text-red-400 w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Cards (mobile) */}
            <div className="grid gap-4 md:hidden">
              {channelData.communityPosts?.map((post) => (
                <div
                  key={post._id}
                  className="bg-slate-900/40 backdrop-blur-sm border-2 border-slate-800/50 rounded-2xl overflow-hidden shadow-xl hover:border-[#795d3f]/50 transition-all"
                >
                  {post.image && (
                    <img
                      src={post.image}
                      alt=""
                      className="w-full h-32 object-cover"
                    />
                  )}
                  <div className="p-4 flex flex-col gap-2">
                    <p className="text-sm">{post.content}</p>
                    <div className="flex justify-between items-center text-xs text-slate-400 mt-2 pt-3 border-t border-slate-800/50">
                      <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                      <button
                        onClick={() => handleDeletePost(post._id)}
                        className="p-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors"
                      >
                        <MdDelete className="text-red-400 w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ContentPage;