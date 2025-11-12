import React, { useEffect, useState } from "react";
import axios from "axios";
import { MdPlaylistPlay, MdBookmark } from "react-icons/md";
import { serverUrl } from "../App"; 
import PlaylistCard from "../component/PlaylistCard";
import { useSelector } from "react-redux";

export default function SavedPlaylistPage() {
  const { userData } = useSelector((state) => state.user);
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedPlaylists = async () => {
      try {
        const res = await axios.get(`${serverUrl}/api/content/saveplaylist`, {
          withCredentials: true,
        });
        console.log("Saved playlists:", res.data);
        setPlaylists(res.data);
      } catch (err) {
        console.error("Error fetching saved playlists:", err);
      } finally {
        setLoading(false);
      }
    };

    if (userData?._id) fetchSavedPlaylists();
  }, [userData]);

  if (loading) {
    return (
      <div className="min-h-screen  text-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block p-4 bg-[#795d3f]/10 rounded-full mb-4">
            <MdPlaylistPlay className="text-5xl text-[#795d3f] animate-pulse" />
          </div>
          <p className="text-slate-400 text-lg">Loading saved playlists...</p>
        </div>
      </div>
    );
  }

  if (!playlists || playlists.length === 0) {
    return (
      <div className="min-h-screen  text-white mt-[40px] lg:mt-[20px] p-6">
        {/* Decorative Background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#795d3f]/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-[#795d3f]/5 rounded-full blur-3xl"></div>
        </div>

        <div className="flex flex-col items-center justify-center h-[70vh]">
          <div className="text-center bg-slate-900/40 backdrop-blur-sm rounded-2xl border-2 border-dashed border-slate-800/50 p-16 max-w-md">
            <div className="inline-block p-6 bg-slate-950/50 rounded-full mb-6">
              <MdPlaylistPlay className="text-7xl text-slate-700" />
            </div>
            <p className="text-[#795d3f] mb-2 text-lg font-medium">
              No saved playlists yet
            </p>
            <p className="text-sm text-[#795d3f]">
              Save playlists to access them quickly here
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen  text-white mt-[40px] lg:mt-[20px]">
      {/* Decorative Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#795d3f]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-[#795d3f]/5 rounded-full blur-3xl"></div>
      </div>

      {/* Page Title */}
      <div className="pt-5 flex items-center gap-3">
        <div className=" bg-[#795d3f]/10 rounded-lg">
          <MdBookmark className="text-4xl text-[#795d3f]" />
        </div>
        <h1 className="text-3xl font-bold text-white">Your Saved Playlists</h1>
      </div>

      {/* Decorative Line */}
      <div className="mb-8">
        <div className="h-1  bg-gradient-to-r from-[#795d3f] via-[#795d3f]/60 to-transparent rounded-full"></div>
      </div>

      {/* Playlists Grid */}
      <div className="flex pt-[50px] flex-wrap gap-6">
        {playlists.map((pl) => (
          <PlaylistCard
            key={pl._id}
            id={pl._id}
            title={pl.title}
            videos={pl.videos}
            savedBy={pl.saveBy}
          />
        ))}
      </div>
    </div>
  );
}