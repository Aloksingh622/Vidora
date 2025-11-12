/* Add these at top imports if not already added */
import { useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaUserCircle } from "react-icons/fa";
import { showCustomAlert } from "../component/CustomAlert";
import { ClipLoader } from "react-spinners";
import { serverUrl } from "../App";
import youtube from "../assets/youtube.png"; // YouTube logo
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";

const CreateAccount = () => {
  const navigate = useNavigate();
  const avatarRef = useRef();
  const [step, setStep] = useState(1);

  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [frontendAvatar, setFrontendAvatar] = useState(null);
  const [backendAvatar, setBackendAvatar] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  // Show/Hide Password state
  const [showPassword, setShowPassword] = useState(false);

  const handleAvatar = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBackendAvatar(file);
      setFrontendAvatar(URL.createObjectURL(file));
    }
  };

  const handleNext = () => {
    if (step === 1) {
      if (!userName || !email) {
        showCustomAlert("Please fill all fields");
        return;
      }
    }
    if (step === 2) {
      if (!password || !confirmPassword) {
        showCustomAlert("Please fill password fields");
        return;
      }
      if (password !== confirmPassword) {
        showCustomAlert("Passwords do not match");
        return;
      }
    }
    setStep(step + 1);
  };

  const handleCreateAccount = async () => {
    if (!backendAvatar) {
      showCustomAlert("Please select an avatar");
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append("username", userName);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("photoUrl", backendAvatar);

    try {
      const result = await axios.post(serverUrl + "/api/auth/signup", formData, { withCredentials: true });
      console.log(result.data);
      setLoading(false);
      navigate("/");
      dispatch(setUserData(result.data));
      showCustomAlert("Account Created");
    } catch (error) {
      console.log(error);
      setLoading(false);
      showCustomAlert(error.response.data.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="bg-slate-900/40 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-10 w-full max-w-md shadow-2xl">
        {/* Back Button */}
        <div className="flex items-center mb-6">
          <button
            onClick={() => {
              if (step > 1) {
                setStep(step - 1);
              } else {
                navigate("/"); // Step 1 → go home
              }
            }}
            className="text-slate-400 mr-3 hover:text-[#795d3f] transition-colors hover:scale-110 transform"
          >
            <FaArrowLeft size={20} />
          </button>
          <span className="text-white text-2xl font-bold tracking-tight">Create Account</span>
        </div>

        {/* Progress Indicator */}
        <div className="flex gap-2 mb-8">
          <div className={`flex-1 h-1 rounded-full transition-all ${step >= 1 ? 'bg-[#795d3f]' : 'bg-slate-700'}`}></div>
          <div className={`flex-1 h-1 rounded-full transition-all ${step >= 2 ? 'bg-[#795d3f]' : 'bg-slate-700'}`}></div>
          <div className={`flex-1 h-1 rounded-full transition-all ${step >= 3 ? 'bg-[#795d3f]' : 'bg-slate-700'}`}></div>
        </div>

        {/* Step 1 */}
        {step === 1 && (
          <>
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
              <img src={youtube} alt="Logo" className="w-8 h-8" />
              Basic Info
            </h1>
            <p className="text-slate-400 text-sm mb-6">Enter your basic information to get started</p>
            
            <input
              type="text"
              placeholder="UserName"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full bg-black/40 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#795d3f] focus:ring-1 focus:ring-[#795d3f]/50 mb-4 transition-all"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black/40 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#795d3f] focus:ring-1 focus:ring-[#795d3f]/50 transition-all"
            />
            <div className="flex justify-end mt-8">
              <button
                onClick={handleNext}
                className="bg-gradient-to-r from-[#795d3f] to-[#8a6a47] hover:from-[#6a5038] hover:to-[#795d3f] text-white font-bold px-8 py-3 rounded-xl shadow-lg hover:shadow-[#795d3f]/20 active:scale-95 transition-all"
              >
                Next
              </button>
            </div>
          </>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <>
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
              <img src={youtube} alt="Logo" className="w-8 h-8" />
              Security
            </h1>
            <p className="text-slate-400 text-sm mb-6">Create a strong password for your account</p>
            
            <div className="flex items-center bg-[#795d3f]/10 border border-[#795d3f]/30 text-white px-4 py-2 rounded-xl w-fit mb-6">
              <FaUserCircle className="mr-2 text-[#795d3f]" size={20} />
              <span className="text-sm">{email}</span>
            </div>
            
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/40 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#795d3f] focus:ring-1 focus:ring-[#795d3f]/50 mb-4 transition-all"
            />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-black/40 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#795d3f] focus:ring-1 focus:ring-[#795d3f]/50 transition-all"
            />
            <div className="flex items-center gap-2 mt-4">
              <input
                type="checkbox"
                id="showPass"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
                className="w-4 h-4 accent-[#795d3f] cursor-pointer"
              />
              <label htmlFor="showPass" className="text-slate-300 cursor-pointer text-sm">
                Show Password
              </label>
            </div>
            <div className="flex justify-end mt-8">
              <button
                onClick={handleNext}
                className="bg-gradient-to-r from-[#795d3f] to-[#8a6a47] hover:from-[#6a5038] hover:to-[#795d3f] text-white font-bold px-8 py-3 rounded-xl shadow-lg hover:shadow-[#795d3f]/20 active:scale-95 transition-all"
              >
                Next
              </button>
            </div>
          </>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <>
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
              <img src={youtube} alt="Logo" className="w-8 h-8" />
              Choose Avatar
            </h1>
            <p className="text-slate-400 text-sm mb-6">Select a profile picture for your account</p>

            <div className="flex items-center gap-6 mb-6">
              <div className="relative group">
                <div className="absolute inset-0 bg-[#795d3f]/20 blur-2xl rounded-full group-hover:bg-[#795d3f]/30 transition-all"></div>
                <div className="relative w-28 h-28 rounded-full border-4 border-slate-700 group-hover:border-[#795d3f] overflow-hidden shadow-2xl transition-all">
                  {frontendAvatar ? (
                    <img src={frontendAvatar} alt="avatar preview" className="w-full h-full object-cover" />
                  ) : (
                    <FaUserCircle className="text-slate-600 w-full h-full p-2" />
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-3 flex-1">
                <label className="text-slate-300 font-semibold text-sm">Upload Profile Picture</label>
                <input
                  type="file"
                  ref={avatarRef}
                  onChange={handleAvatar}
                  accept="image/*"
                  className="block w-full text-sm text-slate-400 
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-xl file:border-0
                    file:text-sm file:font-semibold
                    file:bg-[#795d3f] file:text-white
                    hover:file:bg-[#6a5038]
                    file:transition-all
                    cursor-pointer"
                />
              </div>
            </div>

            <div className="flex justify-end mt-8">
              <button
                onClick={handleCreateAccount}
                disabled={loading}
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold px-8 py-3 rounded-xl shadow-lg hover:shadow-green-600/20 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <ClipLoader size={20} color="white" />
                    <span>Creating...</span>
                  </>
                ) : (
                  "Create Account"
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CreateAccount;