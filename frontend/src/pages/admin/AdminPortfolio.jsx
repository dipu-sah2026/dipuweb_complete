import React, { useState, useEffect } from 'react';
import { 
  Film, 
  Plus, 
  Trash2, 
  X, 
  Play, 
  Tag, 
  UploadCloud, 
  Loader2, 
  CheckCircle, 
  AlertCircle,
  Video,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import api, { DEFAULT_PORTFOLIO } from '../../services/api';

const AdminPortfolio = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [previewVideoItem, setPreviewVideoItem] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    category: 'Doctor / Hospital',
    videoUrl: '',
    thumbnailUrl: '',
    aspectRatio: '9:16',
    description: '',
    toolsUsed: 'CapCut, Midjourney, VN',
  });

  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadingThumb, setUploadingThumb] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [publishing, setPublishing] = useState(false);

  const fetchPortfolio = async () => {
    setLoading(true);
    try {
      const res = await api.get('/portfolio');
      if (res.data?.data) {
        setItems(res.data.data);
      }
    } catch (err) {
      setItems(DEFAULT_PORTFOLIO);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const resetModal = () => {
    setFormData({
      title: '',
      category: 'Doctor / Hospital',
      videoUrl: '',
      thumbnailUrl: '',
      aspectRatio: '9:16',
      description: '',
      toolsUsed: 'CapCut, Midjourney, VN',
    });
    setUploadError('');
    setUploadingVideo(false);
    setUploadingThumb(false);
    setPublishing(false);
    setModalOpen(false);
  };

  const handleVideoFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingVideo(true);
    setUploadError('');
    try {
      const data = new FormData();
      data.append('file', file);
      data.append('folder', 'dipueditx_portfolio');

      const res = await api.post('/upload/media', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data?.success) {
        setFormData((prev) => ({
          ...prev,
          videoUrl: res.data.url,
          thumbnailUrl: prev.thumbnailUrl || res.data.thumbnailUrl,
        }));
      }
    } catch (err) {
      setUploadError(
        err.response?.data?.message ||
        'Video upload to Cloudinary failed. Check Cloudinary settings in Site & UPI Settings.'
      );
    } finally {
      setUploadingVideo(false);
    }
  };

  const handleThumbFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingThumb(true);
    setUploadError('');
    try {
      const data = new FormData();
      data.append('file', file);
      data.append('folder', 'dipueditx_portfolio_thumbs');

      const res = await api.post('/upload/media', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data?.success) {
        setFormData((prev) => ({
          ...prev,
          thumbnailUrl: res.data.url,
        }));
      }
    } catch (err) {
      setUploadError(err.response?.data?.message || 'Thumbnail upload failed');
    } finally {
      setUploadingThumb(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.videoUrl) {
      setUploadError('Kripya pehle video file upload karein!');
      return;
    }

    setPublishing(true);
    try {
      const payload = {
        ...formData,
        toolsUsed: formData.toolsUsed.split(',').map((t) => t.trim()),
      };

      await api.post('/portfolio', payload);
      resetModal();
      fetchPortfolio();
    } catch (err) {
      setUploadError(err.response?.data?.message || 'Failed to add portfolio item');
    } finally {
      setPublishing(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this project?')) return;
    try {
      await api.delete(`/portfolio/${id}`);
      setItems(items.filter((i) => i._id !== id));
    } catch (err) {
      alert('Failed to delete item');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
            <Film className="w-7 h-7 text-brand-yellow" />
            <span>Manage Project Showcase</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Directly upload video editing samples & doctor AI reels to Cloudinary. No manual links needed!
          </p>
        </div>

        <button
          onClick={() => {
            setFormData({
              title: '',
              category: 'Doctor / Hospital',
              videoUrl: '',
              thumbnailUrl: '',
              aspectRatio: '9:16',
              description: '',
              toolsUsed: 'CapCut, Midjourney, VN',
            });
            setUploadError('');
            setModalOpen(true);
          }}
          className="bg-brand-yellow hover:bg-brand-yellowHover text-black font-black text-xs sm:text-sm px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-lg shadow-yellow-500/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Video Project (Cloudinary)</span>
        </button>
      </div>

      {/* Cloudinary Info Banner */}
      <div className="bg-cyan-950/40 border border-cyan-500/30 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-cyan-300 font-bold">
          <Sparkles className="w-4 h-4 shrink-0 text-cyan-400" />
          <span>All showcase media is directly uploaded and high-speed streamed via Cloudinary CDN.</span>
        </div>
        <span className="text-[11px] text-slate-400">
          Auto video compression & high-res thumbnail posters enabled.
        </span>
      </div>

      {/* Grid of Showcase items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div
            key={item._id}
            className="bg-brand-card border border-brand-border rounded-2xl overflow-hidden shadow-lg flex flex-col justify-between group hover:border-brand-yellow/60 transition-all"
          >
            <div className="relative aspect-video bg-slate-900 overflow-hidden">
              <img
                src={item.thumbnailUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80'}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  onClick={() => setPreviewVideoItem(item)}
                  className="w-12 h-12 rounded-full bg-brand-yellow text-black flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                  title="Play Video"
                >
                  <Play className="w-6 h-6 fill-black ml-0.5" />
                </button>
              </div>
              <div className="absolute top-2 left-2">
                <span className="bg-black/70 text-brand-yellow text-[10px] font-bold px-2 py-0.5 rounded border border-yellow-500/30">
                  {item.category}
                </span>
              </div>
              <div className="absolute top-2 right-2">
                <span className="bg-red-600/90 text-white font-extrabold text-[9px] px-1.5 py-0.5 rounded">
                  {item.aspectRatio}
                </span>
              </div>
            </div>

            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <h4 className="text-sm font-black text-white mb-1">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-400 line-clamp-2">
                  {item.description || 'Custom video created by Dipu Sah'}
                </p>
                {item.videoUrl && item.videoUrl.includes('cloudinary') && (
                  <span className="inline-flex items-center gap-1 text-[10px] text-cyan-400 font-bold mt-2">
                    <Video className="w-3 h-3" /> Cloudinary Stream
                  </span>
                )}
              </div>

              <div className="pt-3 mt-3 border-t border-brand-border flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => setPreviewVideoItem(item)}
                  className="text-xs text-brand-yellow hover:underline flex items-center gap-1 font-bold"
                >
                  <Play className="w-3 h-3" />
                  <span>Preview</span>
                </button>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="p-1.5 rounded-lg bg-red-950/40 text-red-400 hover:bg-red-900/60 transition-colors"
                  title="Delete Project"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Project Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
          <div className="relative w-full max-w-xl bg-brand-card border border-brand-border rounded-3xl p-6 sm:p-8 shadow-2xl my-8">
            
            <button
              onClick={resetModal}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-xl font-black text-white mb-1 flex items-center gap-2">
              <UploadCloud className="w-6 h-6 text-brand-yellow" />
              <span>Direct Video Upload to Cloudinary</span>
            </h3>
            <p className="text-xs text-slate-400 mb-5">
              Select your video file directly. It will be uploaded straight to your Cloudinary storage and showcased on the website.
            </p>

            {uploadError && (
              <div className="p-3 mb-4 rounded-xl bg-red-950/70 border border-red-500 text-red-300 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Project Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Kidney Stone Removal (Doctor AI Animation)"
                  className="w-full bg-slate-900 border border-brand-border rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-yellow"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-slate-900 border border-brand-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-yellow"
                  >
                    <option value="Doctor / Hospital">Doctor / Hospital</option>
                    <option value="School / Education">School / Education</option>
                    <option value="AI Realistic">AI Realistic</option>
                    <option value="YouTube Shorts / Reels">YouTube Shorts / Reels</option>
                    <option value="Travel & Lifestyle">Travel & Lifestyle</option>
                    <option value="Business / Brand">Business / Brand</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Aspect Ratio</label>
                  <select
                    value={formData.aspectRatio}
                    onChange={(e) => setFormData({ ...formData, aspectRatio: e.target.value })}
                    className="w-full bg-slate-900 border border-brand-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-yellow"
                  >
                    <option value="9:16">9:16 (Shorts / Reels)</option>
                    <option value="16:9">16:9 (Landscape / YouTube)</option>
                    <option value="1:1">1:1 (Square)</option>
                  </select>
                </div>
              </div>

              {/* 1. Direct Video File Upload to Cloudinary */}
              <div className="p-4 rounded-2xl bg-slate-900/90 border-2 border-dashed border-brand-yellow/40 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-black text-brand-yellow flex items-center gap-1.5">
                    <Video className="w-4 h-4" />
                    <span>Upload Video File to Cloudinary *</span>
                  </label>
                  {formData.videoUrl && (
                    <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-emerald-500/30">
                      <CheckCircle className="w-3 h-3" /> Uploaded
                    </span>
                  )}
                </div>

                <input
                  type="file"
                  accept="video/mp4,video/quicktime,video/webm,video/mkv,video/x-matroska"
                  disabled={uploadingVideo}
                  onChange={handleVideoFileChange}
                  className="w-full text-xs text-slate-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-brand-yellow file:text-black hover:file:bg-brand-yellowHover cursor-pointer"
                />

                {uploadingVideo && (
                  <div className="flex items-center gap-2 text-xs text-cyan-400 font-bold animate-pulse">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Uploading video directly to Cloudinary... Please wait.</span>
                  </div>
                )}

                {formData.videoUrl && (
                  <div className="space-y-2 pt-2 border-t border-slate-800">
                    <span className="text-[10px] text-slate-400 block font-mono break-all">
                      Cloudinary URL: {formData.videoUrl}
                    </span>
                    <div className="relative aspect-video max-h-40 rounded-xl overflow-hidden bg-black mx-auto">
                      <video
                        src={formData.videoUrl}
                        controls
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* 2. Cover Thumbnail Upload (Optional - Auto-generated from Video) */}
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-300">
                    Cover Thumbnail (Auto-generated from Video, or Upload Custom Image)
                  </label>
                  {uploadingThumb && <Loader2 className="w-3.5 h-3.5 animate-spin text-brand-yellow" />}
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    accept="image/*"
                    disabled={uploadingThumb}
                    onChange={handleThumbFileChange}
                    className="flex-1 text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-slate-800 file:text-slate-200 hover:file:bg-slate-700 cursor-pointer"
                  />
                  {formData.thumbnailUrl && (
                    <img
                      src={formData.thumbnailUrl}
                      alt="Thumbnail Preview"
                      className="w-12 h-12 object-cover rounded-lg border border-brand-border shrink-0"
                    />
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Tools Used (comma separated)</label>
                <input
                  type="text"
                  value={formData.toolsUsed}
                  onChange={(e) => setFormData({ ...formData, toolsUsed: e.target.value })}
                  placeholder="CapCut Pro, Midjourney, ElevenLabs, VN"
                  className="w-full bg-slate-900 border border-brand-border rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-brand-yellow"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Description (Optional)</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of the project"
                  className="w-full bg-slate-900 border border-brand-border rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-brand-yellow resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={uploadingVideo || publishing || !formData.videoUrl}
                className="w-full py-3.5 bg-brand-yellow hover:bg-brand-yellowHover text-black font-black text-sm rounded-xl transition-all shadow-lg shadow-yellow-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {publishing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Publishing Project...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Publish Video to Showcase</span>
                  </>
                )}
              </button>
            </form>

          </div>
        </div>
      )}

      {/* Admin Video Player Preview Modal */}
      {previewVideoItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
          <div className="relative w-full max-w-2xl bg-brand-card border border-brand-border rounded-3xl overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-brand-border bg-slate-900/90">
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-brand-yellow" />
                <h3 className="text-sm font-black text-white">{previewVideoItem.title}</h3>
              </div>
              <button
                onClick={() => setPreviewVideoItem(null)}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="relative aspect-video bg-black flex items-center justify-center">
              <video
                src={previewVideoItem.videoUrl}
                controls
                autoPlay
                className="w-full h-full object-contain"
              />
            </div>
            <div className="p-4 bg-brand-dark flex items-center justify-between text-xs text-slate-400">
              <span>Category: <strong className="text-white">{previewVideoItem.category}</strong></span>
              <a
                href={previewVideoItem.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:underline flex items-center gap-1 font-bold"
              >
                <span>Direct Cloudinary Stream</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminPortfolio;
