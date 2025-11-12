import React, { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import logo from "../assets/youtube.png"; // PlayTube logo
import {  useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { showCustomAlert } from "../component/CustomAlert";
import axios from "axios";
import { serverUrl } from "../App";
import { ClipLoader } from "react-spinners";
import { setChannelData } from "../redux/userSlice";

const CreateChannelFlow = () => {
  const [step, setStep] = useState(1);
  const [channelName, setChannelName] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [banner, setBanner] = useState(null);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const {userData}  = useSelector(state=>state.user)
  const [loading,setLoading] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const handleAvatarChange = (e) => setAvatar(e.target.files[0]);
  const handleBannerChange = (e) => setBanner(e.target.files[0]);


  const handleCreateChannel = async () => {
    const formData = new FormData()
    formData.append("name",channelName);
    formData.append("avatar",avatar);
    formData.append("description",description);
    formData.append("category",category);
    formData.append("bannerImage",banner);
    setLoading(true)
    try {
      const result = await axios.post(serverUrl + "/api/user/create-channel" ,formData , {withCredentials:true})
      console.log(result)
      showCustomAlert("Channel Created")
      dispatch(setChannelData(result.data))
      navigate("/")
      setLoading(false)
    } catch (error) {
      console.log(error)
      showCustomAlert(error.response.data.message)
      setLoading(false)
    }
    
  }


  return (
    <div className="w-full min-h-screen bg-black text-white flex flex-col">
      {/* HEADER */}
      <header className="flex justify-between items-center px-6 py-3 border-b border-slate-800/50 bg-black/95 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <img src={logo} alt="PlayTube" className="w-8 h-8" />
          <span className="text-2xl font-bold">VIDORA</span>
        </div>
        <div className="flex items-center gap-3">
          {!userData?.photoUrl ?
            <FaUserCircle className="text-3xl cursor-pointer" /> :
            <img src={userData?.photoUrl} className="w-9 h-9 rounded-full border-2 border-slate-700 hover:border-[#795d3f] object-cover transition-all"/>}
        </div>
      </header>

      {/* MAIN */}
      <main className="flex flex-1 justify-center items-center px-4">
        <div className="bg-slate-900/40 backdrop-blur-sm border-2 border-slate-800/50 p-6 rounded-2xl w-full max-w-lg shadow-2xl">
          {/* Step 1 */}
          {step === 1 && (
            <>
              <h2 className="text-2xl font-bold mb-2">How you'll appear</h2>
              <p className="text-sm text-slate-400 mb-6">
                Choose a profile picture and channel name.
              </p>

              {/* Avatar Upload */}
              <div className="flex flex-col items-center mb-6">
                <label
                  htmlFor="avatar-upload"
                  className="cursor-pointer flex flex-col items-center group"
                >
                  {avatar ? (
                    <div className="relative">
                      <div className="absolute inset-0 bg-[#795d3f]/20 blur-2xl rounded-full group-hover:bg-[#795d3f]/30 transition-all"></div>
                      <img
                        src={URL.createObjectURL(avatar)}
                        alt="avatar"
                        className="relative w-24 h-24 rounded-full object-cover border-4 border-slate-700 group-hover:border-[#795d3f] shadow-2xl transition-all"
                      />
                    </div>
                  ) : (
                    <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center text-slate-500 border-4 border-slate-700 group-hover:border-[#795d3f] transition-all">
                      <FaUserCircle size={48} />
                    </div>
                  )}
                  <span className="text-[#795d3f] hover:text-[#8a6a47] text-sm font-semibold mt-3 transition-colors">
                    Upload Picture
                  </span>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                </label>
              </div>

              {/* Channel Name */}
              <input
                type="text"
                placeholder="Channel name"
                className="w-full p-3 mb-6 rounded-xl bg-black border-2 border-slate-800/50 text-white placeholder:text-slate-500 focus:outline-none focus:border-[#795d3f] focus:ring-2 focus:ring-[#795d3f]/20 transition-all"
                value={channelName}
                onChange={(e) => setChannelName(e.target.value)}
              />

              

              <button
                onClick={nextStep}
                disabled={!channelName}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#795d3f] to-[#8a6a47] hover:from-[#6a5038] hover:to-[#795d3f] transition-all py-3 rounded-xl font-bold shadow-lg hover:shadow-[#795d3f]/20 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed active:scale-95"
              >
                Continue <IoIosArrowForward size={20} />
              </button>
              <span onClick={()=>navigate("/")} className="w-full flex items-center justify-center text-sm text-[#795d3f] hover:text-[#8a6a47] cursor-pointer hover:underline mt-3 transition-colors">Back to Home Page</span>
            </>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <>
              <h2 className="text-2xl font-bold mb-2">Your Channel</h2>
              <p className="text-sm text-slate-400 mb-6">Review your channel setup</p>
              
              <div className="flex flex-col items-center mb-6">
                {avatar ? (
                  <div className="relative">
                    <div className="absolute inset-0 bg-[#795d3f]/20 blur-2xl rounded-full"></div>
                    <img
                      src={URL.createObjectURL(avatar)}
                      alt="avatar"
                      className="relative w-24 h-24 rounded-full object-cover border-4 border-slate-700 shadow-2xl"
                    />
                  </div>
                ) : (
                  <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center text-slate-500 border-4 border-slate-700">
                    <FaUserCircle size={48} />
                  </div>
                )}
                <h3 className="mt-4 text-lg font-bold">{channelName}</h3>
              
              </div>

              <div className="flex gap-3">
                <button
                  onClick={nextStep}
                  className="flex w-full items-center justify-center gap-2 bg-gradient-to-r from-[#795d3f] to-[#8a6a47] hover:from-[#6a5038] hover:to-[#795d3f] py-3 rounded-xl font-bold shadow-lg hover:shadow-[#795d3f]/20 transition-all active:scale-95"
                >
                Continue and Create Channel <IoIosArrowForward size={20} />
                </button>
                
              </div>

              <button
                onClick={prevStep}
                className="mt-4 w-full flex items-center justify-center text-[#795d3f] hover:text-[#8a6a47] hover:underline text-sm font-semibold transition-colors"
              >
                Back
              </button>
            </>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <>
              <h2 className="text-2xl font-bold mb-2">Create Channel</h2>
              <p className="text-sm text-slate-400 mb-6">Add banner, description and category</p>

              {/* Banner Upload */}
              <label
                htmlFor="banner-upload"
                className="cursor-pointer block mb-6 group"
              >
                {banner ? (
                  <img
                    src={URL.createObjectURL(banner)}
                    alt="banner"
                    className="w-full h-32 object-cover rounded-xl mb-2 border-2 border-slate-800/50 group-hover:border-[#795d3f] transition-all shadow-lg"
                  />
                ) : (
                  <div className="w-full h-32 bg-slate-800 rounded-xl flex items-center justify-center text-slate-500 border-2 border-slate-800/50 group-hover:border-[#795d3f] mb-2 transition-all">
                    Click to upload banner
                  </div>
                )}
                <span className="text-[#795d3f] hover:text-[#8a6a47] font-semibold text-sm transition-colors">Upload Banner Image</span>
                <input
                  id="banner-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleBannerChange}
                />
              </label>

              {/* Description */}
              <textarea
                placeholder="Channel description"
                className="w-full p-3 mb-4 rounded-xl bg-black border-2 border-slate-800/50 text-white placeholder:text-slate-500 focus:outline-none focus:border-[#795d3f] focus:ring-2 focus:ring-[#795d3f]/20 transition-all resize-none h-28"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              {/* Category */}
              <input
                className="w-full p-3 mb-6 rounded-xl bg-black border-2 border-slate-800/50 text-white placeholder:text-slate-500 focus:outline-none focus:border-[#795d3f] focus:ring-2 focus:ring-[#795d3f]/20 transition-all"
                value={category}
                placeholder="Category (e.g., Gaming, Tech, Lifestyle)"
                onChange={(e) => setCategory(e.target.value)}
              />
                
              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={prevStep}
                  className="bg-slate-800 hover:bg-slate-700 py-3 px-6 rounded-xl font-bold transition-all active:scale-95 flex-1"
                >
                  Back
                </button>
                <button
                  onClick={handleCreateChannel}
                  disabled={loading}
                  className="bg-gradient-to-r from-[#795d3f] to-[#8a6a47] hover:from-[#6a5038] hover:to-[#795d3f] py-3 px-6 rounded-xl font-bold shadow-lg hover:shadow-[#795d3f]/20 transition-all active:scale-95 disabled:from-slate-800 disabled:to-slate-800 disabled:cursor-not-allowed flex-1"
                >
                {loading ? <ClipLoader size={20} color="white"/>:"Save"}
                </button>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default CreateChannelFlow;