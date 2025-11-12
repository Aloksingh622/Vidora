import React, { useState } from "react";
import { FaVideo, FaPlay, FaPen, FaList } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import create from "../assets/create.png";

function CreatePage() {
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();

  const options = [
    { id: "video", icon: <FaVideo size={32} />, title: "Upload Video", desc: "Share long-form content" },
    { id: "short", icon: <FaPlay size={32} />, title: "Create Short", desc: "Quick vertical videos" },
    { id: "post", icon: <FaPen size={32} />, title: "Community Post", desc: "Engage with your audience" },
    { id: "playlist", icon: <FaList size={32} />, title: "New Playlist", desc: "Organize your videos" },
  ];

  const handleCreate = () => {
    const routes = {
      video: "/create-video",
      short: "/create-short",
      post: "/create-post",
      playlist: "/create-playlist",
    };

    if (selected && routes[selected]) {
      navigate(routes[selected]);
    }
  };

  return (
    <div className=" min-h-screen text-white px-6 py-12 mt-10">
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#795d3f]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#795d3f]/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="mb-16 text-center">
          <h1 className="text-6xl text-[#795d3f]  tracking-tight mb-4 font-bold bg-clip-text ">
            Create
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Choose what type of content you want to create for your audience
          </p>
          <div className="mt-4 max-w-6xl mx-auto">
        <div className="h-1 bg-gradient-to-r from-transparent via-[#d4a574]/30 to-transparent rounded-full"></div>
      </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {options.map((opt) => (
            <div
              key={opt.id}
              className={`group relative bg-slate-900/40 backdrop-blur-sm border-2 rounded-2xl p-8 flex flex-col items-center text-center justify-center cursor-pointer transition-all duration-300 hover:-translate-y-2
                ${selected === opt.id 
                  ? "border-[#795d3f] bg-[#795d3f]/10 shadow-2xl shadow-[#795d3f]/20" 
                  : "border-slate-800/50 hover:border-[#795d3f]/50 hover:bg-slate-800/40"
                }`}
              onClick={() => setSelected(opt.id)}
            >
              <div className={`p-5 rounded-2xl mb-5 transition-all duration-300
                ${selected === opt.id 
                  ? "bg-gradient-to-br from-[#795d3f] to-[#8a6a47] shadow-lg" 
                  : "bg-slate-800/60 group-hover:bg-[#795d3f]/20"
                }`}>
                <div className={`transition-colors ${selected === opt.id ? "text-white" : "text-slate-300 group-hover:text-[#795d3f]"}`}>
                  {opt.icon}
                </div>
              </div>
              
              <h2 className={`text-xl font-bold mb-2 transition-colors ${selected === opt.id ? "text-[#795d3f]" : "text-white"}`}>
                {opt.title}
              </h2>
              <p className="text-xs text-slate-500 group-hover:text-slate-400 transition-colors">
                {opt.desc}
              </p>

              {selected === opt.id && (
                <div className="absolute top-3 right-3 w-6 h-6 bg-[#795d3f] rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}

              <div className={`absolute inset-0 bg-gradient-to-br from-[#795d3f]/0 to-[#795d3f]/0 rounded-2xl transition-opacity duration-300 pointer-events-none
                ${selected === opt.id ? "opacity-100" : "opacity-0 group-hover:opacity-50"}`}
              ></div>
            </div>
          ))}
        </div>

        <div className="bg-slate-900/40 backdrop-blur-sm border-2 border-slate-800/50 rounded-2xl p-12 text-center">
          <div className="relative inline-block mb-6">
            <img src={create} alt="Create" className="w-24 h-24 drop-shadow-2xl" />
            <div className="absolute inset-0 bg-[#795d3f]/20 blur-2xl rounded-full -z-10"></div>
          </div>
          
          {!selected ? (
            <>
              <h3 className="text-2xl font-bold mb-3 text-white">Create content on any device</h3>
              <p className="text-slate-400 text-base max-w-xl mx-auto leading-relaxed">
                Upload and record at home or on the go. Everything you make public will appear here.
              </p>
            </>
          ) : (
            <>
              <h3 className="text-2xl font-bold mb-3 text-white">Ready to create?</h3>
              <p className="text-slate-400 text-base max-w-xl mx-auto mb-6 leading-relaxed">
                Click below to start your <span className="text-[#795d3f] font-semibold">{options.find((o) => o.id === selected)?.title.toLowerCase()}</span>
              </p>
              <button
                className="bg-gradient-to-r from-[#795d3f] to-[#8a6a47] hover:from-[#6a5038] hover:to-[#795d3f] text-white px-8 py-3 rounded-xl font-bold text-lg transition-all shadow-lg shadow-[#795d3f]/30 hover:shadow-xl hover:shadow-[#795d3f]/40 transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2 mx-auto"
                onClick={handleCreate}
              >
                <span className="text-2xl">+</span>
                <span>Create Now</span>
              </button>
            </>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="flex items-start gap-4 p-4">
            <div className="w-10 h-10 bg-[#795d3f]/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-[#795d3f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-1">Fast Upload</h4>
              <p className="text-sm text-slate-500">Quick and easy content upload process</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4 p-4">
            <div className="w-10 h-10 bg-[#795d3f]/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-[#795d3f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-1">HD Quality</h4>
              <p className="text-sm text-slate-500">Support for high-definition content</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4 p-4">
            <div className="w-10 h-10 bg-[#795d3f]/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-[#795d3f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-1">Reach Audience</h4>
              <p className="text-sm text-slate-500">Connect with your subscribers instantly</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreatePage;