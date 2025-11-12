import React, { useState } from 'react';
import { MdUpload, MdImage, MdDownload, MdRefresh, MdClose } from 'react-icons/md';
import axios from 'axios';
import { serverUrl } from '../App';

const GenerateThumbnail = () => {
  const [description, setDescription] = useState('');
  const [referenceImage, setReferenceImage] = useState(null);
  const [referencePreview, setReferencePreview] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedThumbnails, setGeneratedThumbnails] = useState([]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setReferenceImage(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setReferencePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setReferenceImage(null);
    setReferencePreview(null);
  };

  const handleGenerate = async () => {
    if (!description.trim()) {
      alert('Please describe your thumbnail');
      return;
    }

    setIsGenerating(true);
    
    const formData = new FormData();
    formData.append('description', description);
    if (referenceImage) {
      formData.append('image', referenceImage);
    }

    try {
       const response = await axios.post(`${serverUrl}/api/thumbnail/create`,formData ,{
          withCredentials: true,
        });
      const data =  response.data;
      setGeneratedThumbnails(data.thumbnails);
      console.log(generatedThumbnails)

    } catch (error) {
      console.error('Error:', error);
      alert('Failed to generate thumbnails');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async (thumbnailUrl, id) => {
    try {
      console.log('Downloading thumbnail from:', thumbnailUrl);
      const response = await fetch(serverUrl+thumbnailUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `thumbnail-${id}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  return (
    <div className="min-h-screen mt-[50px] px-4">
      {/* Page Header */}
      <div className="mb-10 text-center max-w-3xl mx-auto">
        <h1 className="text-5xl font-bold text-[#795d3f] mb-4 tracking-tight">
          AI Thumbnail Generator
        </h1>
        <p className="text-lg text-zinc-400">
          Describe your ideal thumbnail and optionally provide a reference image
        </p>
      </div>

      {/* Decorative Line */}
      <div className="max-w-5xl mx-auto mb-10">
        <div className="h-1 bg-gradient-to-r from-transparent via-[#d4a574]/30 to-transparent rounded-full"></div>
      </div>

      <div className="max-w-5xl mx-auto space-y-8">
        {/* Input Section */}
        <div className="bg-slate-900/40 backdrop-blur-sm rounded-2xl p-8 border-2 border-slate-700/50 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-[#d4a574]/10 rounded-xl">
              <MdImage className="text-2xl text-[#d4a574]" />
            </div>
            <h3 className="text-2xl font-semibold text-white">Create Your Thumbnail</h3>
          </div>
          
          <div className="space-y-6">
            {/* Description Text Area */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-3">
                Describe Your Thumbnail *
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="E.g., A bold tech thumbnail with neon blue and purple colors, featuring a futuristic AI robot. Include text 'AI Revolution' in large bold letters..."
                rows="6"
                className="w-full bg-slate-900/50 border-2 border-slate-700/50 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-[#d4a574] focus:ring-2 focus:ring-[#d4a574]/20 resize-none transition-all"
              />
              <p className="text-xs text-zinc-500 mt-2 flex items-center gap-1">
                <span className="inline-block w-1.5 h-1.5 bg-[#d4a574] rounded-full"></span>
                Be specific about colors, text, style, and elements you want in your thumbnail
              </p>
            </div>

            {/* Reference Image Upload */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-3">
                Reference Image (Optional)
              </label>
              
              {!referencePreview ? (
                <div className="border-2 border-dashed border-slate-700/50 rounded-xl p-8 text-center hover:border-[#d4a574]/50 hover:bg-slate-900/30 transition-all cursor-pointer group">
                  <input
                    type="file"
                    id="reference-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  <label 
                    htmlFor="reference-upload" 
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <div className="p-4 bg-slate-900/50 rounded-full mb-4 group-hover:bg-[#d4a574]/10 transition-all">
                      <MdImage className="text-5xl text-[#d4a574] group-hover:scale-110 transition-transform" />
                    </div>
                    <p className="text-white mb-2 font-medium">Upload reference image</p>
                    <p className="text-sm text-zinc-500">
                      JPG, PNG up to 10MB - AI will use this as style inspiration
                    </p>
                  </label>
                </div>
              ) : (
                <div className="relative border-2 border-slate-700/50 rounded-xl overflow-hidden group hover:border-[#d4a574]/50 transition-all">
                  <img
                    src={referencePreview}
                    alt="Reference"
                    className="w-full h-64 object-cover"
                  />
                  <button
                    onClick={removeImage}
                    className="absolute top-3 right-3 bg-black/80 hover:bg-[#d4a574] text-white p-2.5 rounded-lg transition-all shadow-lg hover:scale-110"
                  >
                    <MdClose className="text-xl" />
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4">
                    <p className="text-white text-sm font-medium">
                      {referenceImage?.name}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !description.trim()}
            className="w-full mt-8 bg-[#d4a574] hover:bg-[#c49564] disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-xl transition-all flex items-center justify-center gap-3 shadow-lg hover:shadow-[#d4a574]/20 hover:shadow-xl disabled:shadow-none transform hover:-translate-y-0.5 active:translate-y-0"
          >
            {isGenerating ? (
              <>
                <MdRefresh className="text-2xl animate-spin" />
                <span>Generating AI Thumbnails...</span>
              </>
            ) : (
              <>
                <MdImage className="text-2xl" />
                <span>Generate Thumbnails</span>
              </>
            )}
          </button>
        </div>

        {/* Generated Thumbnails Section */}
        <div className="bg-slate-900/40 backdrop-blur-sm rounded-2xl p-8 border-2 border-slate-700/50 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-[#d4a574]/10 rounded-xl">
              <MdDownload className="text-2xl text-[#d4a574]" />
            </div>
            <h3 className="text-2xl font-semibold text-white">Generated Thumbnails</h3>
          </div>
          
          {generatedThumbnails.length === 0 ? (
            <div className="text-center py-20">
              <div className="inline-block p-6 bg-slate-900/50 rounded-full mb-6">
                <MdImage className="text-7xl text-slate-700" />
              </div>
              <p className="text-zinc-400 mb-2 text-lg font-medium">
                No thumbnails generated yet
              </p>
              <p className="text-sm text-zinc-600">
                Describe your thumbnail and click generate to see AI-created designs
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {generatedThumbnails.map((thumbnail) => (
                <div
                  key={thumbnail.id}
                  className="relative group border-2 border-slate-700/50 rounded-xl overflow-hidden hover:border-[#d4a574] transition-all shadow-lg hover:shadow-2xl hover:shadow-[#d4a574]/10 transform hover:-translate-y-1"
                >
                  {console.log(`${serverUrl}${thumbnail.url}`)}

                  <img
                    src={`${serverUrl}${thumbnail.url}`}
                    alt={`Generated thumbnail ${thumbnail.id}`}
                    className="w-full aspect-video object-cover"
                  />
                  
                  {/* Overlay with Download Button */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                    <button
                      onClick={() => handleDownload(thumbnail.url, thumbnail.id)}
                      className="bg-[#d4a574] hover:bg-[#c49564] text-white font-semibold px-6 py-3 rounded-xl flex items-center gap-2 transition-all shadow-lg transform hover:scale-105 active:scale-95"
                    >
                      <MdDownload className="text-xl" />
                      <span>Download</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GenerateThumbnail;