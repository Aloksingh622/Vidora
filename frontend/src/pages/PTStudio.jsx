import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaTachometerAlt, FaChartBar, FaVideo, FaPlusCircle } from "react-icons/fa";
import { SiYoutubestudio } from "react-icons/si";
import Profile from "../component/Profile";
import { RiMoneyRupeeCircleFill } from "react-icons/ri";

function PTStudio() {
  const navigate = useNavigate();
  const { channelData } = useSelector((state) => state.user);
  const [active, setActive] = useState("Dashboard");
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-black text-white min-h-screen flex flex-col">
      {/* Header */}
      <header className="h-16 px-4 sm:px-6 flex items-center justify-between border-b border-slate-800/50 bg-black/95 backdrop-blur-sm shadow-lg sticky top-0 z-50">
        {/* Left Logo */}
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => navigate("/")}
        >
          <div className="p-2 bg-[#795d3f]/10 rounded-xl group-hover:bg-[#795d3f]/20 transition-all">
            <SiYoutubestudio className="text-[#795d3f] w-7 h-7" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight">
            PT <span className="text-[#795d3f]">Studio</span>
          </h1>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={() => navigate("/createpage")}
            className="bg-gradient-to-r from-[#795d3f] to-[#8a6a47] hover:from-[#6a5038] hover:to-[#795d3f] px-4 sm:px-5 py-2 rounded-xl hover:shadow-lg hover:shadow-[#795d3f]/20 active:scale-95 transition-all cursor-pointer text-sm sm:text-base font-bold flex items-center justify-center gap-2"
          >
            <FaPlusCircle className="text-lg" />
            <span>Create</span>
          </button>

          {channelData ? (
            <div className="relative">
              <img
                src={channelData.avatar}
                alt="channel avatar"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-slate-700 hover:border-[#795d3f] object-cover hover:scale-105 transition-all cursor-pointer"
                onClick={() => setOpen((prev) => !prev)}
              />
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#795d3f] rounded-full border-2 border-black"></div>
            </div>
          ) : (
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-800" />
          )}
        </div>
      </header>

      {/* Body (Sidebar + Main) */}
      <div className="flex flex-1 flex-col md:flex-row">
        {/* Sidebar */}
        <aside className="hidden md:flex w-64 lg:w-72 bg-black border-r border-slate-800/50 flex-col p-6 shadow-2xl">
          {/* Channel Info */}
          {channelData ? (
            <div className="flex flex-col items-center gap-3 mb-8 text-center">
              <div className="relative group">
                <div className="absolute inset-0 bg-[#795d3f]/20 blur-2xl rounded-full group-hover:bg-[#795d3f]/30 transition-all"></div>
                <img
                  src={channelData.avatar}
                  alt="channel avatar"
                  className="relative w-28 h-28 rounded-full border-4 border-slate-700 group-hover:border-[#795d3f] object-cover shadow-2xl hover:scale-105 transition-all"
                />
              </div>
              <div>
                <h2 className="text-lg lg:text-xl font-bold text-white mb-1">
                  {channelData.name}
                </h2>
                <p className="text-xs text-slate-500 flex items-center justify-center gap-1">
                  <span className="w-1.5 h-1.5 bg-[#795d3f] rounded-full"></span>
                  Your Channel
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-slate-500 text-sm">No channel data</p>
            </div>
          )}

          {/* Nav Items */}
          <nav className="space-y-2">
            <SidebarItem
              icon={<FaTachometerAlt />}
              text="Dashboard"
              active={active}
              setActive={setActive}
              onClick={() => navigate("/ptstudio/dashboard")}
            />
            <SidebarItem
              icon={<FaVideo />}
              text="Content"
              active={active}
              setActive={setActive}
              onClick={() => navigate("/ptstudio/content")}
            />
            <SidebarItem
              icon={<FaChartBar />}
              text="Analytics"
              active={active}
              setActive={setActive}
              onClick={() => navigate("/ptstudio/analytics")}
            />
            <SidebarItem
              icon={<RiMoneyRupeeCircleFill className="w-5 h-5" />}
              text="Revenue"
              active={active}
              setActive={setActive}
              onClick={() => navigate("/ptstudio/revenue")}
            />
          </nav>

          {/* Decorative Element */}
          <div className="mt-auto pt-6">
            <div className="bg-[#795d3f]/10 border border-[#795d3f]/30 rounded-xl p-4">
              <p className="text-xs text-[#795d3f] font-semibold">Studio Tips</p>
              <p className="text-xs text-slate-400 mt-1">
                Upload consistently to grow your channel
              </p>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 pb-20 md:pb-6">
          <div className="border-2 border-slate-800/50 rounded-2xl p-4 sm:p-6 bg-slate-900/40 backdrop-blur-sm shadow-2xl min-h-[70vh]">
            {open && <Profile />}
            <div className="mt-4">
              <Outlet />
            </div>
          </div>
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-sm border-t border-slate-800/50 flex justify-around py-3 z-50 shadow-2xl">
        <MobileNavItem
          icon={<FaTachometerAlt />}
          text="Dashboard"
          active={active === "Dashboard"}
          onClick={() => {
            setActive("Dashboard");
            navigate("/ptstudio/dashboard");
          }}
        />
        <MobileNavItem
          icon={<FaVideo />}
          text="Content"
          active={active === "Content"}
          onClick={() => {
            setActive("Content");
            navigate("/ptstudio/content");
          }}
        />
        <MobileNavItem
          icon={<FaPlusCircle />}
          text="Create"
          onClick={() => navigate("/createpage")}
        />
        <MobileNavItem
          icon={<FaChartBar />}
          text="Analytics"
          active={active === "Analytics"}
          onClick={() => {
            setActive("Analytics");
            navigate("/ptstudio/analytics");
          }}
        />
        <MobileNavItem
          icon={<RiMoneyRupeeCircleFill className="w-6 h-6" />}
          text="Revenue"
          active={active === "Revenue"}
          onClick={() => {
            setActive("Revenue");
            navigate("/ptstudio/revenue");
          }}
        />
      </nav>
    </div>
  );
}

function SidebarItem({ icon, text, onClick, active, setActive }) {
  const isActive = active === text;

  return (
    <button
      onClick={() => {
        setActive(text);
        onClick();
      }}
      className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all font-medium ${
        isActive
          ? "bg-[#795d3f]/10 text-[#795d3f] border-l-4 border-[#795d3f] shadow-lg shadow-[#795d3f]/10"
          : "text-slate-400 hover:bg-slate-900/60 hover:text-white border-l-4 border-transparent"
      }`}
    >
      <span className="text-lg">{icon}</span>
      <span className="text-sm lg:text-base">{text}</span>
    </button>
  );
}

function MobileNavItem({ icon, text, onClick, active }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl transition-all duration-300 ${
        active
          ? "text-[#795d3f]"
          : "text-slate-400 hover:text-white"
      }`}
    >
      <span className={`text-xl sm:text-2xl ${active ? "scale-110" : ""} transition-transform`}>
        {icon}
      </span>
      <span className={`text-[10px] sm:text-xs font-medium ${active ? "font-bold" : ""}`}>
        {text}
      </span>
      {active && (
        <span className="w-1 h-1 bg-[#795d3f] rounded-full mt-0.5"></span>
      )}
    </button>
  );
}

export default PTStudio;