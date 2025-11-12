import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MdImage, MdDescription } from 'react-icons/md';

const AICreatepage = () => {
  const navigate = useNavigate();

  const handleOptionClick = (path) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen  mt-[50px] px-4">
      {/* Page Header */}
      <div className="mb-12 text-center max-w-3xl mx-auto">
        <h1 className="text-5xl font-bold text-[#795d3f] mb-4 tracking-tight">
          AI Create Studio
        </h1>
        <p className="text-lg text-zinc-400">
          Transform your content with powerful AI-driven tools
        </p>
      </div>

     
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
        
        <div
          className="group relative bg-slate-900/40 backdrop-blur-sm rounded-2xl p-10 flex flex-col items-center justify-center text-center cursor-pointer 
                     border-2 border-slate-700/50
                     transition-all duration-300 ease-out
                     hover:border-[#d4a574] hover:shadow-2xl hover:shadow-[#d4a574]/20 hover:-translate-y-1
                     overflow-hidden"
          onClick={() => handleOptionClick('/ai-create/generate-thumbnail')}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#d4a574]/0 to-[#d4a574]/0 group-hover:from-[#d4a574]/5 group-hover:to-[#d4a574]/10 transition-all duration-300 rounded-2xl"></div>
          
        
          <div className="relative z-10 ">
            {/* Icon Container */}
            <div className="mb-6 p-6 bg-slate-900/50 rounded-full inline-block group-hover:bg-[#d4a574]/10 transition-all duration-300">
              <MdImage className="text-6xl text-[#d4a574] group-hover:scale-110 transition-transform duration-300" />
            </div>
            
            {/* Title */}
            <h2 className="text-2xl font-semibold text-white mb-3 group-hover:text-[#d4a574] transition-colors duration-300">
              Generate Thumbnail
            </h2>
            
            {/* Description */}
            <p className="text-zinc-400 text-sm max-w-xs mx-auto">
              Create eye-catching thumbnails that boost your video's click-through rate
            </p>
          </div>

          <div className="absolute top-0 right-0 w-32 h-32 bg-[#d4a574]/5 rounded-bl-full transform translate-x-16 -translate-y-16 group-hover:translate-x-12 group-hover:-translate-y-12 transition-transform duration-300"></div>
        </div>

        <div
          className="group relative bg-slate-900/40 backdrop-blur-sm rounded-2xl p-10 flex flex-col items-center justify-center text-center cursor-pointer 
                     border-2 border-slate-700/50
                     transition-all duration-300 ease-out
                     hover:border-[#d4a574] hover:shadow-2xl hover:shadow-[#d4a574]/20 hover:-translate-y-1
                     overflow-hidden"
          onClick={() => handleOptionClick('/ai-create/youtubeanalyze')}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#d4a574]/0 to-[#d4a574]/0 group-hover:from-[#d4a574]/5 group-hover:to-[#d4a574]/10 transition-all duration-300 rounded-2xl"></div>
          
          <div className="relative z-10">
            <div className="mb-6 p-6 bg-slate-900/50 rounded-full inline-block group-hover:bg-[#d4a574]/10 transition-all duration-300">
              <MdDescription className="text-6xl text-[#d4a574] group-hover:scale-110 transition-transform duration-300" />
            </div>
            
            {/* Title */}
            <h2 className="text-2xl font-semibold text-white mb-3 group-hover:text-[#d4a574] transition-colors duration-300">
              Create Description & Timestamp
            </h2>
            
            {/* Description */}
            <p className="text-zinc-400 text-sm max-w-xs mx-auto">
              Generate SEO-optimized descriptions and accurate timestamps for your videos
            </p>
          </div>

          {/* Corner Accent */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#d4a574]/5 rounded-bl-full transform translate-x-16 -translate-y-16 group-hover:translate-x-12 group-hover:-translate-y-12 transition-transform duration-300"></div>
        </div>

      </div>

     
      <div className="mt-16 max-w-6xl mx-auto">
        <div className="h-1 bg-gradient-to-r from-transparent via-[#d4a574]/30 to-transparent rounded-full"></div>
      </div>
    </div>
  );
};

export default AICreatepage;