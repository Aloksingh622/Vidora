import React, { useState, useEffect } from 'react';
import { Clock, Play, Copy, Check, RefreshCw, Zap, ArrowRight, AlertTriangle } from 'lucide-react';
import Logo from '../assets/youtube.png';
import { serverUrl } from '../App';
import axios from 'axios';

const isValidYouTubeUrl = (url) => {
    const patterns = [
        /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]+/,
        /^(https?:\/\/)?(www\.)?youtube\.com\/watch\?v=[\w-]+/
    ];
    return patterns.some(pattern => pattern.test(url));
};

export default function YouTubeSummary() {
    const [videoUrl, setVideoUrl] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [useCustomTime, setUseCustomTime] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [summary, setSummary] = useState('');
    const [copied, setCopied] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState('');

    const [estimatedTime, setEstimatedTime] = useState(0);

    useEffect(() => {
        if (isLoading) {
            setProgress(0);
            setEstimatedTime(70);

            const progressInterval = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 95) return 95;
                    const increment = prev < 50 ? 2 : prev < 80 ? 1 : 0.5;
                    return prev + increment;
                });
            }, 600);

            const timeInterval = setInterval(() => {
                setEstimatedTime(prev => Math.max(0, prev - 1));
            }, 1000);

            return () => {
                clearInterval(progressInterval);
                clearInterval(timeInterval);
            };
        } else {
            setProgress(0);
            setEstimatedTime(0);
        }
    }, [isLoading]);

    const handleSubmit = async () => {
        // Validation
        if (!videoUrl.trim()) {
            setError('Please enter a YouTube video URL');
            return;
        }

        if (!isValidYouTubeUrl(videoUrl)) {
            setError('Please enter a valid YouTube URL');
            return;
        }

        setError('');
        setIsLoading(true);
        setSummary('');

        try {

            const requestData = {
                videoUrl: videoUrl,
                analysisType: 'summary'
            };

            if (useCustomTime && (startTime || endTime)) {
                requestData.startTime = startTime || '0s';
                requestData.endTime = endTime;
            }


            const response = await axios.post(
                `${serverUrl}/api/thumbnail/youtube/summary`,
                requestData,
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            console.log('API response:', response);
            const data = response.data;
            console.log('API response data:', data);
            setProgress(100);

            setTimeout(() => {
                const summaryContent = data.content || data.summary || 'Summary generated successfully';
                setSummary(summaryContent);
                setIsLoading(false);
            }, 500);

            console.log('Summary generated:', data);

        } catch (err) {
            console.error('Error generating summary:', err);
            console.log(err.response);
            setError(
                err.response?.data?.message ||
                err.message ||
                'Failed to generate summary. Please try again.'
            );
            console.log("error")

            setIsLoading(false);
            setProgress(0);
        }
    };

    const handleCopy = () => {
        const textArea = document.createElement("textarea");
        textArea.value = summary;
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            document.execCommand('copy');
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
        document.body.removeChild(textArea);
    };

    return (
        <div className="min-h-screen mt-[10px] bg-[#0f0f0f]">
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 -left-48 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10">

                <main className="max-w-7xl mx-auto px-6 py-12">


                    {!error && !summary && !isLoading && (
                        <div className="text-center mb-20 relative px-4">
                            <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
                                <div className="absolute top-0 left-1/4 w-72 h-72 bg-[#795d3f]/10 rounded-full blur-3xl animate-pulse"></div>
                                <div className="absolute top-20 right-1/4 w-96 h-96 bg-[#795d3f]/5 rounded-full blur-3xl"></div>
                            </div>

                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-6 leading-[1.1]">
                                <span className="block text-white mb-2 font-extrabold">
                                    Summarize Any
                                </span>
                                <span className="block relative">
                                    <span className="text-[#795d3f] relative z-10 bg-gradient-to-r from-[#795d3f] to-[#a17a4d] bg-clip-text ">
                                        YouTube Video
                                    </span>
                                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-3/4 h-1.5 bg-gradient-to-r from-transparent via-[#795d3f]/60 to-transparent rounded-full"></div>
                                </span>
                            </h2>

                            <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto font-light leading-relaxed">
                                Extract key insights and save hours of watching time with
                                <span className="text-[#795d3f] font-semibold"> AI-powered </span>
                                video analysis
                            </p>

                            <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-[#795d3f]/10 border border-[#795d3f]/20 rounded-full">
                                <span className="w-2 h-2 bg-[#795d3f] rounded-full animate-pulse"></span>
                                <span className="text-sm text-[#795d3f] font-medium">Powered by Advanced AI</span>
                            </div>
                        </div>
                    )}

                    <div className="max-w-5xl mx-auto">
                        {error ? (
                            <div className="space-y-6">
                                <div className="flex items-center gap-3">
                                    <AlertTriangle className="w-6 h-6 text-red-500" />
                                    <h3 className="text-2xl font-bold text-red-400 mb-1">An Error Occurred</h3>
                                </div>
                                <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-xl rounded-2xl border border-red-700/50 p-8 shadow-2xl">
                                    <div className="prose prose-invert prose-slate max-w-none">
                                        <pre className="text-sm text-red-300 whitespace-pre-wrap font-sans leading-relaxed bg-transparent border-0 p-0">
                                            {error}
                                        </pre>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setError('')}
                                    className="bg-slate-800 hover:bg-slate-700 text-white px-5 py-2.5 rounded-lg transition-all flex items-center gap-2 text-sm font-medium border border-slate-700"
                                >
                                    <RefreshCw className="w-4 h-4" />
                                    <span>Try Again</span>
                                </button>
                            </div>

                        ) : summary ? (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between flex-wrap gap-4">
                                    <div>
                                        <h3 className="text-3xl font-bold text-white mb-2">Your Summary</h3>
                                        <p className="text-slate-400 text-sm flex items-center gap-2">
                                            <span className="w-2 h-2 bg-[#795d3f] rounded-full animate-pulse"></span>
                                            Generated in seconds
                                        </p>
                                    </div>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={handleCopy}
                                            className="bg-slate-800/60 hover:bg-slate-700/60 text-white px-5 py-2.5 rounded-xl transition-all flex items-center gap-2 text-sm font-medium border-2 border-slate-700/50 hover:border-[#795d3f]/50 backdrop-blur-sm"
                                        >
                                            {copied ? (
                                                <>
                                                    <Check className="w-4 h-4 text-[#795d3f]" />
                                                    <span>Copied!</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Copy className="w-4 h-4" />
                                                    <span>Copy</span>
                                                </>
                                            )}
                                        </button>
                                        <button
                                            onClick={() => setSummary('')}
                                            className="bg-[#795d3f] hover:bg-[#6a5038] text-white px-5 py-2.5 rounded-xl transition-all flex items-center gap-2 text-sm font-semibold shadow-lg hover:shadow-[#795d3f]/20"
                                        >
                                            <RefreshCw className="w-4 h-4" />
                                            <span>New Summary</span>
                                        </button>
                                    </div>
                                </div>

                                {useCustomTime && (startTime || endTime) && (
                                    <div className="inline-flex items-center gap-2 bg-[#795d3f]/10 border-2 border-[#795d3f]/30 rounded-full px-4 py-2 backdrop-blur-sm">
                                        <Clock className="w-4 h-4 text-[#795d3f]" />
                                        <span className="text-sm text-[#795d3f] font-medium">
                                            {startTime || '00:00'} - {endTime || 'End'}
                                        </span>
                                    </div>
                                )}

                                <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl border-2 border-slate-700/50 p-8 shadow-2xl hover:border-[#795d3f]/30 transition-all">
                                    <div className="prose prose-invert prose-slate max-w-none">
                                        <pre className="text-base text-slate-300 whitespace-pre-wrap font-sans leading-relaxed bg-transparent border-0 p-0">
                                            {summary}
                                        </pre>
                                    </div>
                                </div>
                            </div>
                        ) : isLoading ? (

                            <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl border-2 border-slate-700/50 p-12 shadow-2xl">
                                <div className="max-w-md mx-auto text-center">
                                    <div className="relative w-24 h-24 mx-auto mb-8">
                                        <div className="absolute inset-0 bg-gradient-to-r from-[#795d3f] to-[#a17a4d] rounded-full animate-spin" style={{ animationDuration: '3s' }}></div>
                                        <div className="absolute inset-2 bg-slate-900 rounded-full"></div>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <RefreshCw className="w-10 h-10 text-[#795d3f] animate-pulse" />
                                        </div>
                                    </div>

                                    <h3 className="text-3xl font-bold text-white mb-3">Analyzing Video</h3>
                                    <p className="text-slate-400 mb-8">Our AI is processing your content</p>

                                    <div className="mb-8">
                                        <div className="flex justify-between text-sm mb-3">
                                            <span className="text-slate-400 font-medium">Progress</span>
                                            <span className="text-[#795d3f] font-bold">{Math.round(progress)}%</span>
                                        </div>
                                        <div className="h-3 bg-slate-900/80 rounded-full overflow-hidden border border-slate-700/50">
                                            <div
                                                className="h-full bg-gradient-to-r from-[#795d3f] to-[#a17a4d] transition-all duration-500 ease-out rounded-full shadow-lg shadow-[#795d3f]/50"
                                                style={{ width: `${progress}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    <div className="text-sm text-slate-500">
                                        About <span className="text-[#795d3f] font-semibold">{estimatedTime}s</span> remaining
                                    </div>

                                    <div className="mt-8 space-y-3 text-left">
                                        {[
                                            { label: 'Fetching video data', threshold: 20 },
                                            { label: 'AI content analysis', threshold: 50 },
                                            { label: 'Generating summary', threshold: 80 }
                                        ].map((step, i) => (
                                            <div key={i} className={`flex items-center gap-3 p-3 rounded-xl transition-all ${progress > step.threshold ? 'bg-[#795d3f]/10 border-2 border-[#795d3f]/30' : 'bg-slate-800/30 border-2 border-slate-700/30'}`}>
                                                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${progress > step.threshold ? 'bg-gradient-to-r from-[#795d3f] to-[#a17a4d] text-white shadow-md' : 'bg-slate-700 text-slate-500'}`}>
                                                    {progress > step.threshold ? '✓' : i + 1}
                                                </div>
                                                <span className={`text-sm font-medium ${progress > step.threshold ? 'text-white' : 'text-slate-500'}`}>{step.label}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                        ) : (

                            <div className="bg-slate-900/40 backdrop-blur-sm rounded-2xl border-2 border-slate-700/50 p-8 shadow-2xl">
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-3">
                                            Paste YouTube Video URL
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="url"
                                                value={videoUrl}
                                                onChange={(e) => setVideoUrl(e.target.value)}
                                                placeholder="https://www.youtube.com/watch?v=..."
                                                className="w-full bg-slate-950/50 border-2 border-slate-700 rounded-xl px-5 py-4 text-white placeholder-slate-500 focus:outline-none focus:border-[#795d3f] focus:ring-2 focus:ring-[#795d3f]/20 transition-all"
                                            />
                                            <Play className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600" />
                                        </div>
                                    </div>

                                    <div className="border-t border-slate-700/50 pt-6">
                                        <label className="flex items-center gap-3 cursor-pointer group mb-4">
                                            <div className="relative">
                                                <input
                                                    type="checkbox"
                                                    checked={useCustomTime}
                                                    onChange={(e) => setUseCustomTime(e.target.checked)}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-11 h-6 bg-slate-700 rounded-full peer peer-checked:bg-[#795d3f] transition-all"></div>
                                                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all peer-checked:translate-x-5"></div>
                                            </div>
                                            <span className="text-sm text-slate-300 group-hover:text-white transition-colors font-medium">
                                                Summarize specific time range
                                            </span>
                                        </label>

                                        {useCustomTime && (
                                            <div className="grid grid-cols-2 gap-4 mt-4">
                                                <div>
                                                    <label className="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wide">
                                                        Start Time
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={startTime}
                                                        onChange={(e) => setStartTime(e.target.value)}
                                                        placeholder="00:00"
                                                        className="w-full bg-slate-950/50 border-2 border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#795d3f] focus:ring-2 focus:ring-[#795d3f]/20 transition-all"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wide">
                                                        End Time
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={endTime}
                                                        onChange={(e) => setEndTime(e.target.value)}
                                                        placeholder="05:30"
                                                        className="w-full bg-slate-950/50 border-2 border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#795d3f] focus:ring-2 focus:ring-[#795d3f]/20 transition-all"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <button
                                        onClick={handleSubmit}
                                        disabled={!videoUrl}
                                        className="w-full bg-gradient-to-r from-[#795d3f] to-[#8a6a47] hover:from-[#6a5038] hover:to-[#795d3f] disabled:from-slate-700 disabled:to-slate-700 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-3 group shadow-lg shadow-[#795d3f]/30 disabled:shadow-none cursor-pointer"
                                    >
                                        <span>Generate Summary</span>
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>

                                <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-slate-700/50">
                                    <div className="text-center">
                                        <div className="w-12 h-12 bg-[#795d3f]/10 rounded-xl flex items-center justify-center mx-auto mb-3 border border-[#795d3f]/20">
                                            <Zap className="w-6 h-6 text-[#795d3f]" />
                                        </div>
                                        <p className="text-xs text-slate-400 font-medium">Lightning Fast</p>
                                    </div>
                                    <div className="text-center">
                                        <div className="w-12 h-12 bg-[#795d3f]/10 rounded-xl flex items-center justify-center mx-auto mb-3 border border-[#795d3f]/20">
                                            <Clock className="w-6 h-6 text-[#795d3f]" />
                                        </div>
                                        <p className="text-xs text-slate-400 font-medium">Time Range</p>
                                    </div>
                                    <div className="text-center">
                                        <div className="w-12 h-12 bg-[#795d3f]/10 rounded-xl flex items-center justify-center mx-auto mb-3 border border-[#795d3f]/20">
                                            <Play className="w-6 h-6 text-[#795d3f]" />
                                        </div>
                                        <p className="text-xs text-slate-400 font-medium">Any Video</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>


            <div className="mb-8 max-w-5xl mx-auto">
                <div className="bg-gradient-to-r from-[#795d3f]/10 via-[#795d3f]/5 to-[#795d3f]/10 backdrop-blur-sm rounded-xl border-2 border-[#795d3f]/30 p-6 shadow-lg">
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 mt-1">
                            <div className="w-10 h-10 bg-[#795d3f]/20 rounded-full flex items-center justify-center border border-[#795d3f]/40">
                                <svg
                                    className="w-5 h-5 text-[#795d3f]"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </div>
                        </div>
                        <div className="flex-1">
                            <h4 className="text-lg font-bold text-[#795d3f] mb-2">Important Note</h4>
                            <p className="text-slate-300 text-sm leading-relaxed">
                                Currently this feature works for <span className="font-semibold text-white">YouTube video links only</span>,
                                not for Vidora uploaded videos due to free tier limitations of Gemini and Cloudinary services.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}