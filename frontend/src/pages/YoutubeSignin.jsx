import React, { useState } from "react";
import youtubeLogo from "../assets/youtube.png";
import { FaArrowLeft, FaUserCircle } from "react-icons/fa";
import { showCustomAlert } from "../component/CustomAlert";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import axios from "axios";
import { serverUrl } from "../App";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";

function YoutubeSignin() {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleSignIn = async () => {
        try {
            setLoading(true);
            const result = await axios.post(serverUrl + "/api/auth/signin", { email, password }, { withCredentials: true });
            console.log(result.data);
            setLoading(false);
            navigate("/");
            dispatch(setUserData(result.data));
            showCustomAlert("SignIn Successfully ");
        } catch (error) {
            console.log(error);
            setLoading(false);
            showCustomAlert(error.response.data.message);
        }
    };

    const handleNext = () => {
        if (step === 1) {
            if (!email) {
                showCustomAlert("Please fill all fields");
                return;
            }
        }
        if (step === 2) {
            if (!password) {
                showCustomAlert("Please fill password field");
                return;
            }
        }
        setStep(step + 1);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-black">
            <div className="bg-slate-900/40 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-10 w-full max-w-md shadow-2xl">
                
                {/* Logo & Back Arrow */}
                <div className="flex items-center mb-6">
                    <button
                        onClick={() => step === 1 ? navigate("/") : setStep(step - 1)}
                        className="text-slate-400 mr-3 hover:text-[#795d3f] transition-colors hover:scale-110 transform"
                    >
                        <FaArrowLeft size={20} />
                    </button>
                    <img src={youtubeLogo} alt="YouTube" className="w-8 h-8 mr-2" />
                    <span className="text-white text-2xl font-bold tracking-tight">PlayTube</span>
                </div>

                {/* Progress Indicator */}
                <div className="flex gap-2 mb-8">
                    <div className={`flex-1 h-1 rounded-full transition-all ${step >= 1 ? 'bg-[#795d3f]' : 'bg-slate-700'}`}></div>
                    <div className={`flex-1 h-1 rounded-full transition-all ${step >= 2 ? 'bg-[#795d3f]' : 'bg-slate-700'}`}></div>
                </div>

                {/* Step 1: Email */}
                {step === 1 && (
                    <>
                        <h1 className="text-3xl font-bold text-white mb-2">Sign in</h1>
                        <p className="text-slate-400 text-sm mb-6">
                            with your Account to continue to PlayTube.
                        </p>

                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                            required
                            className="w-full bg-black/40 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#795d3f] focus:ring-1 focus:ring-[#795d3f]/50 transition-all"
                        />

                        <div className="flex justify-between items-center mt-8">
                            <button 
                                className="text-[#795d3f] text-sm hover:text-[#8a6a47] font-medium transition-colors" 
                                onClick={() => navigate("/signup")}
                            >
                                Create account
                            </button>
                            <button
                                onClick={handleNext}
                                className="bg-gradient-to-r from-[#795d3f] to-[#8a6a47] hover:from-[#6a5038] hover:to-[#795d3f] text-white font-bold px-8 py-3 rounded-xl shadow-lg hover:shadow-[#795d3f]/20 active:scale-95 transition-all"
                            >
                                Next
                            </button>
                        </div>
                    </>
                )}

                {/* Step 2: Password */}
                {step === 2 && (
                    <>
                        <h1 className="text-3xl font-bold text-white mb-6">Welcome Back</h1>

                        <div className="flex items-center bg-[#795d3f]/10 border border-[#795d3f]/30 text-white px-4 py-2 rounded-xl w-fit mb-6">
                            <FaUserCircle className="mr-2 text-[#795d3f]" size={20} />
                            <span className="text-sm">{email}</span>
                        </div>

                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            required
                            className="w-full bg-black/40 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#795d3f] focus:ring-1 focus:ring-[#795d3f]/50 transition-all"
                        />

                        <div className="flex items-center mt-4 space-x-2">
                            <input
                                type="checkbox"
                                id="showPassword"
                                checked={showPassword}
                                onChange={(e) => setShowPassword(e.target.checked)}
                                className="w-4 h-4 accent-[#795d3f] cursor-pointer"
                            />
                            <label htmlFor="showPassword" className="text-slate-300 text-sm cursor-pointer">
                                Show password
                            </label>
                        </div>

                        <div className="flex justify-between items-center mt-8">
                            <button 
                                className="text-[#795d3f] text-sm hover:text-[#8a6a47] font-medium transition-colors" 
                                onClick={() => navigate("/forgetpassword")}
                            >
                                Forgot password?
                            </button>
                            <button
                                onClick={handleSignIn}
                                disabled={loading}
                                className="bg-gradient-to-r from-[#795d3f] to-[#8a6a47] hover:from-[#6a5038] hover:to-[#795d3f] text-white font-bold px-8 py-3 rounded-xl shadow-lg hover:shadow-[#795d3f]/20 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <ClipLoader size={20} color="white" />
                                        <span>Signing In...</span>
                                    </>
                                ) : (
                                    "Sign In"
                                )}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default YoutubeSignin;