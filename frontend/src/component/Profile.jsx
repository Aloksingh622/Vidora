import React, { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { MdOutlineSwitchAccount } from "react-icons/md";
import { FcGoogle } from "react-icons/fc";
import { TiUserAddOutline } from "react-icons/ti";
import { SiYoutubestudio } from "react-icons/si";
import img from "../assets/youtube.png"
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";
import { showCustomAlert } from "./CustomAlert";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "../redux/userSlice";
import { auth, provider } from "../../utils/firebase";
import { signInWithPopup } from "firebase/auth";

const Profile = () => {
  const navigate = useNavigate();
  const { userData } = useSelector(state => state.user);
  const dispatch = useDispatch();

  const handleSignOut = async () => {
    try {
      const result = await axios.get(serverUrl + "/api/auth/signout", { withCredentials: true });
      console.log(result.data);
      dispatch(setUserData(null));
      showCustomAlert("Signout Successfully");
    } catch (error) {
      console.log(error);
      showCustomAlert(error.response.data.message);
    }
  };

  const googleSignIn = async () => {
    try {
      const response = await signInWithPopup(auth, provider);
      console.log(response);
      let user = response.user;
      let username = user.displayName;
      let email = user.email;
      let photoUrl = user.photoURL;

      const result = await axios.post(serverUrl + "/api/auth/google-auth", { username, email, photoUrl }, { withCredentials: true });
      dispatch(setUserData(result.data));

      navigate("/");
      showCustomAlert("SignIn with Google Successfully");
    } catch (error) {
      console.log(error);
      showCustomAlert("SignIn with Google Error");
    }
  };

  return (
    <div>
      {/* Dropdown Menu */}
      <div className="absolute right-5 top-10 mt-2 w-80 bg-black/95 backdrop-blur-sm text-white rounded-2xl shadow-2xl border border-slate-800/50 z-50 overflow-hidden">
        {/* Profile Info */}
        {userData && (
          <div className="flex items-center gap-4 p-5 border-b border-slate-800/50 bg-slate-900/40">
            <div className="relative group">
              <div className="absolute inset-0 bg-[#795d3f]/20 blur-xl rounded-full group-hover:bg-[#795d3f]/30 transition-all"></div>
              <img
                src={userData?.photoUrl || img}
                alt="Profile"
                className="relative w-14 h-14 rounded-full object-cover border-2 border-slate-700 group-hover:border-[#795d3f] shadow-lg transition-all"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-base truncate">{userData?.username}</h4>
              <p className="text-sm text-slate-400 truncate">{userData?.email}</p>
              <p
                className="text-sm text-[#795d3f] cursor-pointer hover:text-[#8a6a47] font-medium mt-1 transition-colors flex items-center gap-1"
                onClick={() => {
                  if (userData?.channel) {
                    navigate("/viewchannel");
                  } else {
                    navigate("/createchannel");
                  }
                }}
              >
                <span className="w-1.5 h-1.5 bg-[#795d3f] rounded-full"></span>
                {userData?.channel ? "View Channel" : "Create Channel"}
              </p>
            </div>
          </div>
        )}

        {/* Options */}
        <div className="flex flex-col py-2">
          <button 
            className="flex items-center gap-3 px-5 py-3 hover:bg-slate-900/60 transition-all text-sm font-medium text-slate-300 hover:text-white group"
            onClick={googleSignIn}
          >
            <FcGoogle className="text-xl group-hover:scale-110 transition-transform" />
            <span>SignIn with Google Account</span>
          </button>
          
          <button 
            className="flex items-center gap-3 px-5 py-3 hover:bg-slate-900/60 transition-all text-sm font-medium text-slate-300 hover:text-white group"
            onClick={() => navigate("/signup")}
          >
            <TiUserAddOutline className="text-xl text-slate-400 group-hover:text-[#795d3f] group-hover:scale-110 transition-all" />
            <span>Create new account</span>
          </button>
          
          <button 
            className="flex items-center gap-3 px-5 py-3 hover:bg-slate-900/60 transition-all text-sm font-medium text-slate-300 hover:text-white group"
            onClick={() => navigate("/signin")}
          >
            <MdOutlineSwitchAccount className="text-xl text-slate-400 group-hover:text-[#795d3f] group-hover:scale-110 transition-all" />
            <span>SignIn with other account</span>
          </button>
          
          {userData?.channel && (
            <button 
              className="flex items-center gap-3 px-5 py-3 hover:bg-slate-900/60 transition-all text-sm font-medium text-slate-300 hover:text-white group border-t border-slate-800/50"
              onClick={() => navigate("/ptstudio/dashboard")}
            >
              <SiYoutubestudio className="w-5 h-5 text-[#795d3f] group-hover:scale-110 transition-transform" />
              <span>PT Studio</span>
            </button>
          )}
          
          {userData && (
            <button 
              className="flex items-center gap-3 px-5 py-3 hover:bg-red-950/30 transition-all text-sm font-medium text-slate-300 hover:text-red-400 group border-t border-slate-800/50 mt-1"
              onClick={handleSignOut}
            >
              <FiLogOut className="text-xl text-slate-400 group-hover:text-red-400 group-hover:scale-110 transition-all" />
              <span>Sign out</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;