import React from 'react'
import { useSelector } from 'react-redux'
import create from "../assets/create.png"
import { useNavigate } from 'react-router-dom'
import { FaPlusCircle } from 'react-icons/fa'

function ViewChannel() {
    const {userData} = useSelector(state=>state.user)
    const {channelData} = useSelector(state=>state.user)
    const navigate = useNavigate()
    
  return (
    <div className="flex flex-col gap-3 min-h-screen  text-white">
      {/* Banner */}
      <div className="w-full h-64 relative mb-16 mt-6 rounded-2xl overflow-hidden border border-slate-800/50 shadow-2xl">
        {channelData?.bannerImage ? (
          <img
            src={channelData?.bannerImage}
            alt="Banner"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
            <p className="text-slate-600 text-lg font-medium">No banner image</p>
          </div>
        )}
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
      </div>

      {/* Main Content */}
      <div className="px-6 sm:px-10 py-8">
        {/* Avatar + Info */}
        <div className="flex flex-col items-center">
          <div className="relative group">
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-[#795d3f]/30 blur-3xl rounded-full group-hover:bg-[#795d3f]/40 transition-all"></div>
            <img
              src={channelData?.avatar || "/default-avatar.png"}
              alt="Channel Avatar"
              className="relative w-32 h-32 rounded-full object-cover -mt-24 border-4 border-slate-800 group-hover:border-[#795d3f] shadow-2xl transition-all"
            />
            {/* Active Indicator */}
            <div className="absolute bottom-2 right-2 w-5 h-5 bg-[#795d3f] rounded-full border-4 border-black"></div>
          </div>
          
          <h1 className="text-3xl font-bold mt-4">{channelData?.name || "Channel Name"}</h1>
          <p className="text-slate-400 text-sm">@{userData?.username}</p>
          
          <div className="flex items-center gap-2 mt-2">
            <p className="text-sm text-slate-400">
              More about this channel...
            </p>
            <span className="text-[#795d3f] cursor-pointer font-medium hover:text-[#8a6a47] transition-colors px-3 py-1 bg-[#795d3f]/10 rounded-full border border-[#795d3f]/30">
              {userData?.channel?.category || "General"}
            </span>
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <button 
              className="bg-gradient-to-r from-[#795d3f] to-[#8a6a47] hover:from-[#6a5038] hover:to-[#795d3f] text-white px-6 py-2.5 rounded-xl font-bold shadow-lg hover:shadow-[#795d3f]/20 active:scale-95 transition-all"
              onClick={()=>navigate("/updatechannel")}
            >
              Customize channel
            </button>
            <button 
              className="bg-slate-900 border border-slate-700 hover:border-[#795d3f] text-white px-6 py-2.5 rounded-xl font-medium hover:bg-slate-800 active:scale-95 transition-all"
              onClick={()=>navigate("/ptstudio/dashboard")}
            >
              Manage videos
            </button>
          </div>
        </div>

        {/* Empty State */}
        <div className="flex flex-col items-center mt-20 bg-slate-900/40 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-12 shadow-2xl">
          <div className="relative">
            <div className="absolute inset-0 bg-[#795d3f]/20 blur-2xl rounded-full"></div>
            <img src={create} alt="Create" className="relative w-24 h-24 opacity-80" />
          </div>
          
          <p className="mt-6 font-bold text-xl text-white">Create content on any device</p>
          <p className="text-slate-400 text-sm text-center mt-2 max-w-md">
            Upload and record at home or on the go. Everything you make public will appear here.
          </p>
          
          <button 
            className="bg-gradient-to-r from-[#795d3f] to-[#8a6a47] hover:from-[#6a5038] hover:to-[#795d3f] text-white mt-6 px-8 py-3 rounded-xl font-bold shadow-lg hover:shadow-[#795d3f]/20 active:scale-95 transition-all flex items-center gap-2"
            onClick={()=>navigate("/createpage")}
          >
            <FaPlusCircle className="text-lg" />
            Create
          </button>
        </div>
      </div>
    </div>
  )
}

export default ViewChannel