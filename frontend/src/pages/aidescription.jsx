import React, { useState, useEffect } from 'react';
import { MdContentCopy, MdDownload, MdCheck, MdRefresh, MdPlayCircle, MdEditNote } from 'react-icons/md';
import axios from 'axios';
import { serverUrl } from '../App';
import logo from '../assets/youtube.png';

const YouTubeAnalysis = () => {
    const [videoUrl, setVideoUrl] = useState('');
    const [analysisType, setAnalysisType] = useState('description');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);
    const [progress, setProgress] = useState(0);
    const [estimatedTime, setEstimatedTime] = useState(0);

    useEffect(() => {
        if (isAnalyzing) {
            setProgress(0);
            setEstimatedTime(30);

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
    }, [isAnalyzing]);

    const isValidYouTubeUrl = (url) => {
        const patterns = [
            /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]+/,
            /^(https?:\/\/)?(www\.)?youtube\.com\/watch\?v=[\w-]+/
        ];
        return patterns.some(pattern => pattern.test(url));
    };

    const handleAnalyze = async () => {
        if (!videoUrl.trim()) {
            setError('Please enter a YouTube video URL');
            return;
        }

        if (!isValidYouTubeUrl(videoUrl)) {
            setError('Please enter a valid YouTube URL');
            return;
        }

        setError('');
        setIsAnalyzing(true);
        setResult(null);

        try {
            const response = await axios.post(
                `${serverUrl}/api/thumbnail/youtube/analyze`,
                {
                    videoUrl: videoUrl,
                    analysisType: analysisType
                },
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            const data = response.data;
            setProgress(100);
            setTimeout(() => {
                setResult(data);
                setIsAnalyzing(false);
            }, 500);


        } catch (err) {
            console.error('Error analyzing video:', err);
            setError(err.message || 'Failed to analyze video. Please try again.');
            setIsAnalyzing(false);
        }
    };

    const handleCopy = () => {
        let textToCopy = '';

        if (result.type === 'description') {
            textToCopy = result.content;
        } else {
            textToCopy = result.content.map(item => `${item.time} - ${item.label}`).join('\n');
        }

        navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = () => {
        let content = '';
        let filename = '';

        if (result.type === 'description') {
            content = result.content;
            filename = 'description.txt';
        } else {
            content = result.content.map(item => `${item.time} - ${item.label}`).join('\n');
            filename = 'timestamps.txt';
        }

        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const steps = [
        {
            title: 'Upload as Private',
            desc: 'Upload your video to YouTube and set the visibility to Private.',
            badge: '1',
        },
        {
            title: 'Paste & Generate',
            desc: 'Paste your YouTube link here and generate the AI-powered description & timestamps. Then go to the Edit page, select your video, paste the generated description or timestamps, and change visibility to Public.',
            badge: '2',
        },
        {
            title: 'Make Live',
            desc: 'Save changes and make your video public. All set — your video now has an optimized description and timestamps.',
            badge: '3',
        },
    ];

    return (
        <div className="min-h-screen mt-[50px] bg-[#0f0f0f] text-white p-4 md:p-8">
            <style jsx>{`
                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
                .animate-shimmer {
                    animation: shimmer 2s infinite;
                }
            `}</style>

            {/* Header */}
            <div className="max-w-7xl mx-auto mb-8">
                <div className="flex items-center gap-4 mb-3">
                    <img src={logo} alt="Logo" className="w-16 h-16 object-contain" />
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-white">YouTube Analysis</h1>
                        <p className="text-sm text-gray-400 mt-1">Generate descriptions and timestamps instantly</p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Column - Input */}
                    <div className="space-y-6">
                        {/* Input Card */}
                        <div className="bg-slate-900/40 rounded-lg p-6 border border-[#2a3150]">
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                YouTube Video URL
                            </label>
                            <input
                                type="text"
                                value={videoUrl}
                                onChange={(e) => {
                                    setVideoUrl(e.target.value);
                                    setError('');
                                }}
                                placeholder="https://www.youtube.com/watch?v=..."
                                className="w-full bg-[#0a0e27] border border-[#2a3150] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#d4a574] transition-colors"
                            />

                            {/* Analysis Type */}
                            <div className="mt-6">
                                <label className="block text-sm font-medium text-gray-300 mb-3">
                                    Select Type
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => setAnalysisType('description')}
                                        className={`p-4 rounded-lg border transition-all ${analysisType === 'description'
                                            ? 'bg-[#d4a574] border-[#d4a574] text-[#0a0e27]'
                                            : 'bg-[#0a0e27] border-[#2a3150] text-gray-300 hover:border-[#d4a574]'
                                            }`}
                                    >
                                        <MdEditNote className="text-2xl mx-auto mb-1" />
                                        <div className="text-sm font-medium">Description</div>
                                    </button>

                                    <button
                                        onClick={() => setAnalysisType('timestamp')}
                                        className={`p-4 rounded-lg border transition-all ${analysisType === 'timestamp'
                                            ? 'bg-[#d4a574] border-[#d4a574] text-[#0a0e27]'
                                            : 'bg-[#0a0e27] border-[#2a3150] text-gray-300 hover:border-[#d4a574]'
                                            }`}
                                    >
                                        <MdPlayCircle className="text-2xl mx-auto mb-1" />
                                        <div className="text-sm font-medium">Timestamps</div>
                                    </button>
                                </div>
                            </div>

                            {/* Error */}
                            {error && (
                                <div className="mt-4 p-3 bg-red-900/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
                                    {error}
                                </div>
                            )}

                            {/* Generate Button */}
                            <button
                                onClick={handleAnalyze}
                                disabled={isAnalyzing}
                                className="w-full mt-6 bg-[#d4a574] hover:bg-[#c49564] disabled:bg-gray-600 text-[#0a0e27] font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2"
                            >
                                {isAnalyzing ? (
                                    <>
                                        <MdRefresh className="text-xl animate-spin" />
                                        <span>Processing...</span>
                                    </>
                                ) : (
                                    <span>Generate {analysisType === 'description' ? 'Description' : 'Timestamps'}</span>
                                )}
                            </button>
                        </div>

                        {/* How it works */}
                        <div className="bg-slate-900/40 rounded-lg p-6 border border-[#2a3150]">
                            <h3 className="text-lg font-semibold mb-6 text-white">How it works</h3>


                            <div className="relative pl-8">
                                {/* vertical line */}
                                <div className="absolute left-3 top-6 bottom-0 w-[2px] bg-gradient-to-b from-[#d4a574] to-transparent opacity-30" />


                                <ol className="space-y-8">
                                    {steps.map((step, idx) => (
                                        <li key={idx} className="flex items-start gap-4">
                                            <div className="relative">
                                                <div className="w-10 h-10 rounded-full bg-[#d4a574] flex items-center justify-center text-[#0a0e27] font-bold text-sm">{step.badge}</div>
                                                {/* connector dot shadow */}
                                                <div className="absolute left-0 top-10 w-[2px] h-8 bg-transparent" />
                                            </div>


                                            <div className="flex-1">
                                                <div className="flex items-center justify-between">
                                                    <div className="font-medium text-white">{step.title}</div>
                                                </div>
                                                <div className="mt-1 text-sm text-gray-300 leading-relaxed">{step.desc}</div>


                                                {/* optional CTA for step 2 */}
                                                {idx === 1 && (
                                                    <div className="mt-3">
                                                        <div className="inline-flex items-center gap-2 rounded-md px-3 py-1 text-xs font-medium bg-white/6 border border-white/8 text-white">
                                                            Tip: You can paste the link above and click <span className="font-semibold">Generate</span> to get instant results.
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </li>
                                    ))}
                                </ol>
                            </div>


                        </div>
                    </div>

                    {/* Right Column - Results */}
                    <div>
                        {isAnalyzing ? (
                            <div className="bg-slate-900/40 rounded-lg p-8 border border-[#2a3150] h-full flex flex-col justify-center">
                                <div className="text-center mb-8">
                                    <div className="w-20 h-20 mx-auto mb-6 relative">
                                        <img src={logo} alt="Processing" className="w-full h-full object-contain animate-pulse" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-white mb-2">Analyzing Video</h3>
                                    <p className="text-gray-400 text-sm">Please wait while we process your video</p>
                                </div>

                                {/* Progress Bar */}
                                <div className="mb-6">
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-gray-400">Progress</span>
                                        <span className="text-[#d4a574] font-semibold">{Math.round(progress)}%</span>
                                    </div>
                                    <div className="h-2 bg-[#0a0e27] rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-[#d4a574] transition-all duration-500 ease-out relative"
                                            style={{ width: `${progress}%` }}
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                                        </div>
                                    </div>
                                </div>

                                {/* Time */}
                                <div className="text-center text-sm text-gray-400">
                                    Estimated time: <span className="text-white font-medium">{estimatedTime}s</span>
                                </div>

                                {/* Steps */}
                                <div className="mt-6 space-y-3">
                                    <div className={`flex items-center gap-3 p-3 rounded-lg ${progress > 20 ? 'bg-[#0a0e27] border border-[#2a3150]' : ''}`}>
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${progress > 20 ? 'bg-[#d4a574] text-[#0a0e27]' : 'bg-gray-700 text-gray-400'}`}>
                                            {progress > 20 ? '✓' : '1'}
                                        </div>
                                        <span className={`text-sm ${progress > 20 ? 'text-white' : 'text-gray-500'}`}>Fetching video data</span>
                                    </div>
                                    <div className={`flex items-center gap-3 p-3 rounded-lg ${progress > 50 ? 'bg-[#0a0e27] border border-[#2a3150]' : ''}`}>
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${progress > 50 ? 'bg-[#d4a574] text-[#0a0e27]' : 'bg-gray-700 text-gray-400'}`}>
                                            {progress > 50 ? '✓' : '2'}
                                        </div>
                                        <span className={`text-sm ${progress > 50 ? 'text-white' : 'text-gray-500'}`}>AI content analysis</span>
                                    </div>
                                    <div className={`flex items-center gap-3 p-3 rounded-lg ${progress > 80 ? 'bg-[#0a0e27] border border-[#2a3150]' : ''}`}>
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${progress > 80 ? 'bg-[#d4a574] text-[#0a0e27]' : 'bg-gray-700 text-gray-400'}`}>
                                            {progress > 80 ? '✓' : '3'}
                                        </div>
                                        <span className={`text-sm ${progress > 80 ? 'text-white' : 'text-gray-500'}`}>Generating output</span>
                                    </div>
                                </div>
                            </div>
                        ) : !result ? (
                            <div className="bg-slate-900/40 rounded-lg p-12 border border-[#2a3150] h-full flex flex-col items-center justify-center text-center">
                                <img src={logo} alt="Logo" className="w-24 h-24 object-contain mb-6 opacity-50" />
                                <h3 className="text-xl font-semibold text-white mb-2">Ready to Analyze</h3>
                                <p className="text-gray-400 max-w-md">
                                    Enter a YouTube URL and select the type of content you want to generate
                                </p>
                            </div>
                        ) : (
                            <div className="bg-slate-900/40 rounded-lg p-6 border border-[#2a3150]">
                                <div className="flex items-start justify-between mb-6">
                                    <div>
                                        <h3 className="text-xl font-semibold text-white mb-1">
                                            {result.type === 'description' ? 'Video Description' : 'Video Timestamps'}
                                        </h3>
                                        <p className="text-sm text-gray-400">Generated successfully</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleCopy}
                                            className="bg-[#0a0e27] hover:bg-[#2a3150] text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2 text-sm"
                                        >
                                            {copied ? <MdCheck className="text-lg" /> : <MdContentCopy className="text-lg" />}
                                            <span>{copied ? 'Copied' : 'Copy'}</span>
                                        </button>
                                        <button
                                            onClick={handleDownload}
                                            className="bg-[#d4a574] hover:bg-[#c49564] text-[#0a0e27] px-4 py-2 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
                                        >
                                            <MdDownload className="text-lg" />
                                            <span>Download</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Metadata */}
                                <div className="bg-[#0a0e27] rounded-lg p-4 mb-4 grid grid-cols-3 gap-4">
                                    <div>
                                        <div className="text-xs text-gray-500 mb-1">Video</div>
                                        <div className="text-sm text-white font-medium truncate">{result.metadata.videoTitle}</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-500 mb-1">Duration</div>
                                        <div className="text-sm text-white font-medium">{result.metadata.duration}</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-500 mb-1">Generated</div>
                                        <div className="text-sm text-white font-medium">{result.metadata.analyzed}</div>
                                    </div>
                                </div>

                                {/* Content */}
                                {result.type === 'description' ? (
                                    <div className="bg-[#0a0e27] rounded-lg p-4 max-h-[500px] overflow-y-auto">
                                        <pre className="text-sm text-gray-300 whitespace-pre-wrap font-sans">
                                            {result.content}
                                        </pre>
                                    </div>
                                ) : (
                                    <div className="bg-[#0a0e27] rounded-lg max-h-[500px] overflow-y-auto">
                                        {result.content.map((item, index) => (
                                            <div key={index} className="flex gap-4 p-3 border-b border-[#2a3150] last:border-b-0 hover:bg-[#1a1f3a] transition-colors">
                                                <div className="text-[#d4a574] font-mono text-sm font-semibold min-w-[60px]">
                                                    {item.time}
                                                </div>
                                                <div className="text-gray-300 text-sm flex-1">
                                                    {item.label}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default YouTubeAnalysis;