import { useState, useRef } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/youtube.png";
import {
  FaBars,
  FaUserCircle,
  FaHome,
  FaHistory,
  FaList,
  FaThumbsUp,
  FaSearch,
  FaMicrophone,
  FaTimes,
  FaPlus,
} from "react-icons/fa";
import { MdAutoAwesome } from "react-icons/md";
import { SiGoogledisplayandvideo360 } from "react-icons/si";
import { IoIosAddCircle } from "react-icons/io";
import { GoVideo } from "react-icons/go";
import { SiYoutubeshorts } from "react-icons/si";
import { MdOutlineSubscriptions } from "react-icons/md";
import Profile from "../component/Profile";
import { useSelector } from "react-redux";
import AllVideosPage from "../component/AllVideosPage";
import ShortsPage from "../component/ShortsPage";
import CustomAlert from "../component/CustomAlert";
import { serverUrl } from "../App";
import axios from "axios";
import SearchResults from "./SearchResults";
import { ClipLoader } from "react-spinners";
import FilterResults from "./FilterResult";
import RecommendationContent from "./RecommendationContent";
import UseGetSubscribedContent from "../customHooks/UseGetSubscribedContent";
import RenderColdStartLoader from "../component/RenderColdStartLoader";

function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedItem, setSelectedItem] = useState("Home");
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [searchData, setSearchData] = useState(null);
  const [filterData, setFilterData] = useState(null);
  const [popUp, setPopUp] = useState(false);
  const [listening, setListening] = useState(false);
  const [serverReady, setServerReady] = useState(false);
  const [contentLoading, setContentLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const { userData, subscribeChannel } = useSelector((state) => state.user);

  const categories = [
    "Music", "Gaming", "Movies", "TV Shows", "News",
    "Trending", "Entertainment", "Education", "Science & Tech",
    "Travel", "Fashion", "Cooking", "Sports", "Pets",
    "Art", "Comedy", "Vlogs"
  ];

  // 🔊 Speech synthesis
  function speak(message) {
    let utterance = new SpeechSynthesisUtterance(message);
    window.speechSynthesis.speak(utterance);
  }

  // 🎤 Speech recognition
  const recognitionRef = useRef(null);
  if (!recognitionRef.current && (window.SpeechRecognition || window.webkitSpeechRecognition)) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.lang = "en-US";
  }

  const handleSearch = async () => {
    if (!recognitionRef.current) {
      CustomAlert("Speech recognition not supported in your browser");
      return;
    }

    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
      return;
    }

    setListening(true);
    recognitionRef.current.start();

    recognitionRef.current.onresult = async (e) => {
      const transcript = e.results[0][0].transcript.trim();
      setInput(transcript);
      setListening(false);
      await handleSearchData(transcript);
    };

    recognitionRef.current.onerror = (err) => {
      console.error("Recognition error:", err);
      setListening(false);

      if (err.error === "no-speech") {
        CustomAlert("No speech detected. Please try again.");
      } else {
        CustomAlert("Voice search failed. Try again.");
      }
    };

    recognitionRef.current.onend = () => {
      setListening(false);
    };
  };

  const handleSearchData = async (query) => {
    setLoading(true);
    setContentLoading(true);
    setSearchData(null); // Clear previous results
    setFilterData(null);
    
    try {
      const result = await axios.post(
        serverUrl + "/api/content/search",
        { input: query },
        { withCredentials: true }
      );
      setSearchData(result.data);
      console.log(result.data);
      navigate("/");
      setInput("");
      setPopUp(false);
      setLoading(false);
      setContentLoading(false);

      const { videos = [], shorts = [], playlists = [], channels = [] } = result.data;

      if (
        videos.length > 0 ||
        shorts.length > 0 ||
        playlists.length > 0 ||
        channels.length > 0
      ) {
        speak("These are the top search results I found for you");
      } else {
        speak("No results found");
      }
    } catch (error) {
      console.error(error);
      setPopUp(false);
      setLoading(false);
      setContentLoading(false);
    }
  };

  const handleCategoryFilter = async (category) => {
    setLoading1(true);
    setContentLoading(true);
    setSearchData(null); // Clear previous results
    setFilterData(null);
    
    try {
      const result = await axios.post(
        serverUrl + "/api/content/filter",
        { input: category },
        { withCredentials: true }
      );

      const { videos = [], shorts = [], channels = [] } = result.data;

      let channelVideos = [];
      let channelShorts = [];
      channels.forEach((ch) => {
        if (ch.videos?.length) channelVideos.push(...ch.videos);
        if (ch.shorts?.length) channelShorts.push(...ch.shorts);
      });

      setFilterData({
        ...result.data,
        videos: [...videos, ...channelVideos],
        shorts: [...shorts, ...channelShorts],
      });
      setLoading1(false);
      setContentLoading(false);
      navigate("/");

      console.log("Category filter merged:", {
        ...result.data,
        videos: [...videos, ...channelVideos],
        shorts: [...shorts, ...channelShorts],
      });

      if (
        videos.length > 0 ||
        shorts.length > 0 ||
        channelVideos.length > 0 ||
        channelShorts.length > 0
      ) {
        speak(`Here are some ${category} videos and shorts for you`);
      } else {
        speak("No results found");
      }
    } catch (error) {
      console.error("Category filter error:", error);
      setLoading1(false);
      setContentLoading(false);
    }
  };

  UseGetSubscribedContent();

  // Show cold start loader until server is ready
  if (!serverReady) {
    return <RenderColdStartLoader serverUrl={serverUrl} onReady={() => setServerReady(true)} />;
  }

  return (
    <div className="bg-[#0f0f0f] text-white min-h-screen relative">
      {popUp && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-[#1f1f1f]/90 backdrop-blur-md rounded-2xl shadow-2xl w-[90%] max-w-md min-h-[400px] sm:min-h-[480px] p-8 flex flex-col items-center justify-between gap-8 relative border border-gray-700 transition-all duration-300">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
              onClick={() => setPopUp(false)}
            >
              <FaTimes size={22} />
            </button>

            <div className="flex flex-col items-center gap-3">
              {listening ? (
                <h1 className="text-xl sm:text-2xl font-semibold text-orange-400 animate-pulse">
                  Listening...
                </h1>
              ) : (
                <h1 className="text-lg sm:text-xl font-medium text-gray-300">
                  Speak or type your query
                </h1>
              )}

              {input && (
                <span className="text-center text-lg sm:text-xl text-gray-200 px-4 py-2 rounded-lg bg-[#2a2a2a]/60">
                  {input}
                </span>
              )}

              <div className="flex w-full gap-2 sm:hidden mt-4">
                <input
                  type="text"
                  placeholder="Type your search..."
                  className="flex-1 px-4 py-2 rounded-full bg-[#2a2a2a] text-white outline-none border border-gray-600 focus:border-orange-400 focus:ring-2 focus:ring-orange-500 transition"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
                <button
                  className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-full text-white font-semibold shadow-md transition disabled:opacity-50"
                  disabled={loading}
                  onClick={() => handleSearchData(input)}
                >
                  {loading ? <ClipLoader size={18} color="white" /> : <FaSearch />}
                </button>
              </div>
            </div>

            <button
              className={`p-6 rounded-full shadow-xl transition-all duration-300 transform hover:scale-110 ${
                listening
                  ? "bg-red-500 animate-pulse shadow-red-500/40"
                  : "bg-orange-500 hover:bg-orange-600 shadow-orange-500/40"
              }`}
              onClick={handleSearch}
              disabled={loading}
            >
              {loading ? (
                <ClipLoader size={24} color="white" />
              ) : (
                <FaMicrophone className="w-8 h-8 text-white" />
              )}
            </button>
          </div>
        </div>
      )}

      <header className="bg-black/95 backdrop-blur-sm h-15 p-3 border-b border-slate-800/50 fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-xl bg-slate-900/60 hover:bg-slate-800/80 p-2 rounded-full md:inline hidden transition-all border border-slate-800/50"
            >
              <FaBars style={{ color: '#795d3f' }} />
            </button>

            <div className="flex items-center gap-3">
              <div className="relative">
                <img src={logo} alt="Logo" className="w-[50px] drop-shadow-lg" />
                <div className="absolute inset-0 bg-[#efaf6a]/20 blur-xl rounded-full -z-10"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-[#efaf6a] font-black text-3xl tracking-wider uppercase" style={{ fontFamily: "'Orbitron', 'Exo 2', 'Rajdhani', sans-serif", letterSpacing: '0.1em' }}>
                  VIDORA
                </span>
                <span className="text-[#795d3f] text-[10px] font-semibold tracking-[0.2em] uppercase -mt-1" style={{ fontFamily: "'Inter', 'Roboto', sans-serif" }}>
                  AI Powered
                </span>
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2 flex-1 max-w-xl">
            <div className="flex flex-1">
              <input
                type="text"
                placeholder="Search"
                className="flex-1 bg-slate-950/50 px-4 py-2 rounded-l-full outline-none border-2 border-slate-800/50 text-white placeholder-slate-500 focus:border-[#795d3f]/50 focus:ring-2 focus:ring-[#795d3f]/20 transition-all"
                onChange={(e) => setInput(e.target.value)}
                value={input}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !loading) {
                    handleSearchData(input);
                  }
                }}
              />
              <button
                className="bg-slate-900/60 hover:bg-[#795d3f]/20 px-5 rounded-r-full border-2 border-l-0 border-slate-800/50 hover:border-[#795d3f]/50 transition-all"
                onClick={() => handleSearchData(input)}
                disabled={loading}
              >
                {loading ? <ClipLoader size={18} color="#795d3f" /> : <FaSearch className="text-slate-300" />}
              </button>
            </div>
            <button
              className="bg-slate-900/60 hover:bg-[#795d3f]/20 p-3 rounded-full border border-slate-800/50 hover:border-[#795d3f]/50 transition-all"
              onClick={() => setPopUp(true)}
            >
              <FaMicrophone className="text-slate-300" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              className="hidden md:flex items-center gap-2 bg-gradient-to-r from-[#795d3f]/20 to-[#795d3f]/10 hover:from-[#795d3f]/30 hover:to-[#795d3f]/20 text-[#efaf6a] px-4 py-2 rounded-full cursor-pointer transition-all border border-[#795d3f]/30 hover:border-[#795d3f]/50 shadow-lg shadow-[#795d3f]/10 font-semibold"
              onClick={() => navigate("/summary")}
            >
              <MdAutoAwesome className="text-xl" />
              <span className="text-sm">Summarise</span>
            </button>

            {userData?.channel && (
              <button
                className="hidden md:flex items-center gap-2 bg-gradient-to-r from-[#795d3f]/20 to-[#795d3f]/10 hover:from-[#795d3f]/30 hover:to-[#795d3f]/20 text-[#efaf6a] px-4 py-2 rounded-full cursor-pointer transition-all border border-slate-800/50 hover:border-[#795d3f]/30 font-medium"
                onClick={() => navigate("/createpage")}
              >
                <span className="text-xl font-bold">+</span>
                <span className="text-sm">Create</span>
              </button>
            )}

            {!userData?.photoUrl ? (
              <FaUserCircle
                className="text-3xl hidden md:flex text-slate-400 hover:text-[#795d3f] cursor-pointer transition-colors"
                onClick={() => setOpen((prev) => !prev)}
              />
            ) : (
              <div className="relative hidden md:flex">
                <img
                  src={userData?.photoUrl}
                  alt="Profile"
                  className="w-9 h-9 rounded-full object-cover border-2 border-slate-700 hover:border-[#795d3f] cursor-pointer transition-all hover:scale-110"
                  onClick={() => setOpen((prev) => !prev)}
                />
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#795d3f] rounded-full border-2 border-black"></div>
              </div>
            )}

            <button
              className="text-lg md:hidden flex text-slate-300 hover:text-[#795d3f] transition-colors"
              onClick={() => setPopUp(true)}
            >
              <FaSearch />
            </button>
          </div>
        </div>
      </header>

      <aside
        className={`bg-[#0f0f0f] border-r border-gray-800 transition-all duration-300 fixed top-[60px] bottom-0 z-40
          ${sidebarOpen ? "w-60" : "w-20"} hidden md:flex flex-col overflow-y-auto`}
      >
        <nav className="space-y-1 mt-3">
          <SidebarItem icon={<FaHome style={{ color: '#795d3f' }} />} text="Home" open={sidebarOpen} selected={selectedItem === "Home"} onClick={() => { setSelectedItem("Home"); navigate("/"); }} />
          <SidebarItem icon={<SiGoogledisplayandvideo360 className=" text-[#795d3f] " />} text="Shorts" open={sidebarOpen} selected={selectedItem === "Shorts"} onClick={() => { setSelectedItem("Shorts"); navigate("/shorts"); }} />
          <SidebarItem icon={<MdOutlineSubscriptions style={{ color: '#795d3f' }} />} text="Subscriptions" open={sidebarOpen} selected={selectedItem === "Subscriptions"} onClick={() => { setSelectedItem("Subscriptions"); navigate("/subscribepage"); }} />
        </nav>

        <hr className="border-gray-800 my-3" />

        {sidebarOpen && <p className="text-sm text-gray-400 px-2">You</p>}
        <nav className="space-y-1 mt-1">
          <SidebarItem icon={<FaHistory style={{ color: '#795d3f' }} />} text="History" open={sidebarOpen} selected={selectedItem === "History"} onClick={() => { setSelectedItem("History"); navigate("/history"); }} />
          <SidebarItem icon={<FaList style={{ color: '#795d3f' }} />} text="Playlists" open={sidebarOpen} selected={selectedItem === "Playlists"} onClick={() => { setSelectedItem("Playlists"); navigate("/saveplaylist"); }} />
          <SidebarItem icon={<GoVideo style={{ color: '#795d3f' }} />} text="Save videos" open={sidebarOpen} selected={selectedItem === "Save videos"} onClick={() => { setSelectedItem("Save videos"); navigate("/savevideos"); }} />
          <SidebarItem icon={<FaThumbsUp style={{ color: '#795d3f' }} />} text="Liked videos" open={sidebarOpen} selected={selectedItem === "Liked videos"} onClick={() => { setSelectedItem("Liked videos"); navigate("/likedvideos"); }} />
          <SidebarItem icon={<FaPlus style={{ color: '#795d3f' }} />} text="AI Create" open={sidebarOpen} selected={selectedItem === "AI Create"} onClick={() => { setSelectedItem("AI Create"); navigate("/AiCreate"); }} />
        </nav>

        <hr className="border-gray-800 my-3" />

        {sidebarOpen && <p className="text-sm text-gray-400 px-2">Subscriptions</p>}
        <nav className="space-y-1 mt-1">
          {subscribeChannel?.map((item, index) => (
            <button
              key={index}
              onClick={() => {
                setSelectedItem(item._id);
                navigate(`/channelpage/${item._id}`);
              }}
              className={`flex items-center ${
                sidebarOpen ? "gap-3 justify-start" : "justify-center"
              } w-full text-left cursor-pointer p-2 rounded-lg transition ${
                selectedItem === item._id ? "bg-[#272727]" : "hover:bg-gray-800"
              }`}
            >
              <img
                src={item.avatar}
                alt={item.name}
                className="w-6 h-6 rounded-full border border-gray-700 object-cover hover:scale-110 transition-transform duration-200"
              />
              {sidebarOpen && (
                <span className="text-sm text-white truncate">{item.name}</span>
              )}
            </button>
          ))}
        </nav>
      </aside>

      <main className={`overflow-y-auto p-4 flex flex-col pb-16 transition-all duration-300 ${sidebarOpen ? "md:ml-60" : "md:ml-20"}`}>
        {location.pathname === "/" && (
          <>
            <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide pt-2 mt-[60px]">
              {categories.map((cat, idx) => (
                <button
                  key={idx}
                  className="whitespace-nowrap bg-[#272727] px-4 py-1 rounded-lg text-sm hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  disabled={loading1 || contentLoading}
                  onClick={() => handleCategoryFilter(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="mt-6">
              {/* Content Loading State */}
              {contentLoading ? (
                <div className="flex flex-col items-center justify-center min-h-[400px] gap-6">
                  <div className="relative">
                    <ClipLoader size={60} color="#efaf6a" />
                    <div className="absolute inset-0 bg-[#efaf6a]/10 blur-2xl rounded-full animate-pulse"></div>
                  </div>
                  <div className="text-center space-y-2">
                    <p className="text-[#efaf6a] text-lg font-semibold animate-pulse">
                      Loading content...
                    </p>
                    <p className="text-slate-400 text-sm">
                      Please wait while we fetch the best results for you
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  {searchData && <SearchResults searchResults={searchData} />}
                  {filterData && <FilterResults filterResults={filterData} />}

                  {!searchData && !filterData && (
                    userData ? (
                      <RecommendationContent />
                    ) : (
                      <>
                        <AllVideosPage />
                        <ShortsPage />
                      </>
                    )
                  )}
                </>
              )}
            </div>
          </>
        )}

        {open && <Profile />}
        <div className="mt-4">
          <Outlet />
        </div>
      </main>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0f0f0f] border-t border-gray-800 flex justify-around py-2 z-10">
        <MobileNavItem onClick={() => navigate("/")} icon={<FaHome />} text="Home" />
        <MobileNavItem onClick={() => navigate("/shorts")} icon={<SiYoutubeshorts />} text="Shorts" />
        <MobileNavItem onClick={() => navigate("/createpage")} icon={<IoIosAddCircle className="fill-gray-500 text-4xl w-9 h-9" />} />
        <MobileNavItem onClick={() => navigate("/subscribepage")} icon={<MdOutlineSubscriptions />} text="Subscriptions" />
        <MobileNavItem
          onClick={() => navigate("/mobileprofile")}
          icon={!userData?.photoUrl ? <FaUserCircle /> : <img src={userData?.photoUrl} className="w-8 h-8 rounded-full object-cover border border-gray-700" />}
          text="You"
        />
      </nav>
    </div>
  );
}

function SidebarItem({ icon, text, open, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-4 p-2 rounded w-full transition-colors ${open ? "justify-start" : "justify-center"} ${selected ? "bg-[#272727]" : "hover:bg-[#272727]"}`}
    >
      <span className="text-lg">{icon}</span>
      {open && <span className="text-sm">{text}</span>}
    </button>
  );
}

function MobileNavItem({ icon, text, onClick, active }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-1 px-2 sm:px-3 py-2 rounded-lg transition-all duration-300 ${active ? "text-white" : "text-gray-400"} hover:scale-105`}
    >
      <span className="text-xl sm:text-2xl">{icon}</span>
      {text && <span className="text-[10px] sm:text-xs">{text}</span>}
    </button>
  );
}

export default Home;