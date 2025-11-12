import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import axios from "axios";
import CommunityCard from "../component/CommunityCard";
import PlaylistCard from "../component/PlaylistCard";
import ShortsCard from "../component/ShortsCard";
import VideoCard from "../component/VideoCard";
import { serverUrl } from "../App";
import { ClipLoader } from "react-spinners";
import { FaCheckCircle } from "react-icons/fa";

export default function ChannelPage() {
  const { channelId } = useParams();
  const { allChannelData, userData } = useSelector((state) => state.user);
  const { allPostData } = useSelector((state) => state.content);

  const channelData = allChannelData?.find((ch) => ch._id === channelId);

  const [channel, setChannel] = useState(channelData);
  const [activeTab, setActiveTab] = useState("Videos");
  const [loading, setLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(
    channel?.subscribers?.some(
      (sub) =>
        sub._id?.toString() === userData._id?.toString() ||
        sub?.toString() === userData._id?.toString()
    )
  );

  if (!channel) {
    return (
      <div className="flex justify-center items-center h-screen bg-black">
        <div className="text-center">
          <ClipLoader size={50} color="#795d3f" />
          <p className="text-slate-400 mt-4">Loading channel...</p>
        </div>
      </div>
    );
  }

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        serverUrl + "/api/user/subscribe",
        { channelId: channel._id },
        { withCredentials: true }
      );
      console.log(res.data);
      setLoading(false);
      if (res.data?.subscribers) {
        setChannel((prev) => ({
          ...prev,
          subscribers: res.data.subscribers,
        }));
      } else if (res.data?._id) {
        setChannel(res.data);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    setIsSubscribed(
      channel?.subscribers?.some(
        (sub) =>
          sub._id?.toString() === userData._id?.toString() ||
          sub?.toString() === userData._id?.toString()
      )
    );
  }, [channel.subscribers, userData._id]);

  return (
    <div className="text-white min-h-screen pt-[10px] ">
      {/* Banner */}
      <div className="relative">
        <img
          src={channel.bannerImage || "https://via.placeholder.com/1200x300"}
          alt="Channel Banner"
          className="w-full h-60 md:h-72 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
        
        {/* Decorative Overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent"></div>
      </div>

      {/* Channel Info Card */}
      <div className="relative -mt-16 mx-4 md:mx-8">
        <div className="bg-slate-900/60 backdrop-blur-sm border-2 border-[#3d2811] rounded-2xl p-6 md:p-8 shadow-2xl">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Avatar */}
            <div className="relative group">
              <div className="absolute inset-0 bg-[#795d3f]/20 blur-2xl rounded-full group-hover:bg-[#795d3f]/30 transition-all"></div>
              <img
                src={channel.avatar}
                alt="Channel Logo"
                className="relative rounded-full w-32 h-32 md:w-36 md:h-36 border-4 border-slate-700 group-hover:border-[#795d3f] shadow-2xl transition-all duration-300 object-cover"
              />
            </div>

            {/* Channel Details */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                <h1 className="text-3xl md:text-4xl font-black tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                  {channel.name}
                </h1>
                {isSubscribed && (
                  <FaCheckCircle className="text-[#795d3f] text-xl" />
                )}
              </div>

              {/* Stats */}
              <div className="flex items-center justify-center md:justify-start gap-4 mb-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 bg-[#795d3f] rounded-full"></div>
                  <span className="text-slate-400 text-sm">
                    <span className="font-bold text-white">
                      {channel.subscribers?.length || 0}
                    </span>{" "}
                    subscribers
                  </span>
                </div>
                <div className="w-1 h-1 bg-slate-600 rounded-full"></div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 bg-[#795d3f] rounded-full"></div>
                  <span className="text-slate-400 text-sm">
                    <span className="font-bold text-white">
                      {channel.videos?.length || 0}
                    </span>{" "}
                    videos
                  </span>
                </div>
              </div>

              {/* Category */}
              {channel.category && (
                <div className="inline-block bg-[#795d3f]/10 border border-[#795d3f]/30 rounded-full px-4 py-1.5 mb-4">
                  <span className="text-[#795d3f] text-sm font-semibold">
                    {channel.category}
                  </span>
                </div>
              )}
            </div>

            {/* Subscribe Button */}
            <div className="flex items-center">
              <button
                onClick={handleSubscribe}
                disabled={loading}
                className={`px-8 py-3 rounded-xl font-bold transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 shadow-lg flex items-center gap-2 ${
                  isSubscribed
                    ? "bg-slate-800/80 backdrop-blur-sm text-white border-2 border-slate-700 hover:border-[#795d3f]"
                    : "bg-gradient-to-r from-[#795d3f] to-[#8a6a47] hover:from-[#6a5038] hover:to-[#795d3f] text-white border-2 border-[#795d3f] shadow-[#795d3f]/30"
                }`}
              >
                {loading ? (
                  <ClipLoader size={20} color="white" />
                ) : isSubscribed ? (
                  <>
                      <FaCheckCircle className="text-[#795d3f]" />
                  <span className="text-[#795d3f]">Subscribed</span>
                  </>
                ) : (
                  <span>Subscribe</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="sticky top-[60px] z-30  backdrop-blur-sm border-b border-slate-800/50 mt-8">
        <div className="flex gap-8 px-6 md:px-8 overflow-x-auto scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
          {["Videos", "Shorts", "Playlists", "Community"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 pt-2 relative font-semibold text-sm md:text-base whitespace-nowrap transition-colors ${
                activeTab === tab
                  ? "text-[#795d3f]"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {tab}
              {activeTab === tab && (
                <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#795d3f] to-[#8a6a47] rounded-full"></span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content Section */}
      <div className="px-4 md:px-8 py-8">
        {activeTab === "Videos" && (
          <div>
            {channel.videos?.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 pb-10">
                {channel.videos.map((v) => (
                  <VideoCard
                    key={v._id}
                    id={v._id}
                    thumbnail={v.thumbnail}
                    duration={v.duration}
                    channelLogo={channel.avatar}
                    title={v.title}
                    channelName={channel.name}
                    views={v.views}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="p-6 bg-slate-900/40 rounded-full mb-4">
                  <svg className="w-16 h-16 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[#795d3f] mb-2">No videos yet</h3>
                <p className="text-[#795d3f] text-sm">This channel hasn't uploaded any videos</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "Shorts" && (
          <div>
            {channel.shorts?.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 pb-10">
                {channel.shorts.map((short) => (
                  <ShortsCard
                    key={short._id}
                    id={short._id}
                    shortUrl={short.shortUrl}
                    title={short.title}
                    channelName={channel.name}
                    views={short.views}
                    avatar={channel.avatar}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="p-6 bg-slate-900/40 rounded-full mb-4">
                  <svg className="w-16 h-16 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[#795d3f] mb-2">No shorts yet</h3>
                <p className="text-[#795d3f] text-sm">This channel hasn't created any shorts</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "Playlists" && (
          <div>
            {channel.playlists?.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 pb-10">
                {channel.playlists.map((p) => (
                  <PlaylistCard
                    key={p._id}
                    id={p._id}
                    title={p.title}
                    videos={p.videos}
                    savedBy={p.saveBy}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="p-6 bg-slate-900/40 rounded-full mb-4">
                  <svg className="w-16 h-16 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[#795d3f] mb-2">No playlists yet</h3>
                <p className="text-[#795d3f] text-sm">This channel hasn't created any playlists</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "Community" && (
          <div>
            {allPostData?.filter((post) => post.channel._id === channelId)
              .length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-10">
                {allPostData
                  .filter((post) => post.channel._id === channelId)
                  .map((post) => (
                    <CommunityCard key={post._id} post={post} />
                  ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="p-6 bg-slate-900/40 rounded-full mb-4">
                  <svg className="w-16 h-16 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[#795d3f] mb-2">No posts yet</h3>
                <p className="text-[#795d3f] text-sm">This channel hasn't shared any community posts</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}