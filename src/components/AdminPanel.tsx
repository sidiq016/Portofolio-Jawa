import { useState } from "react";
import { motion } from "motion/react";
import { X, Plus, Trash2, Upload, Link as LinkIcon, Image as ImageIcon } from "lucide-react";

type Project = { id: string; title: string; desc: string; imageUrl?: string; link?: string };

type PortfolioData = {
  photoUrl: string;
  wallpaperUrl?: string;
  bio: string;
  education?: string;
  experience?: string;
  driveLink?: string;
  github: string;
  ig: string;
  projects: Project[];
};

export function AdminPanel({ 
  onClose, 
  data, 
  onSave 
}: { 
  onClose: () => void; 
  data: PortfolioData; 
  onSave: (newData: PortfolioData) => void;
}) {
  const [formData, setFormData] = useState<PortfolioData>(data);
  const [isSaving, setIsSaving] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (base64: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      // Perbesar limit sedikit jika ini hanya prototype, 
      // idealnya di production akan di-resize dulu di frontend
      const reader = new FileReader();
      reader.onloadend = () => {
        callback(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const result = await res.json();
      if (result.success) {
        onSave(result.data);
        onClose();
      }
    } catch (error) {
      console.error(error);
      alert("Gagal menyimpan data. Mungkin gambar terlalu besar.");
    } finally {
      setIsSaving(false);
    }
  };

  const addProject = () => {
    const newProject = { id: Date.now().toString(), title: "Judul Project", desc: "Deskripsi project" };
    setFormData({ ...formData, projects: [...formData.projects, newProject] });
  };

  const removeProject = (id: string) => {
    setFormData({ ...formData, projects: formData.projects.filter(p => p.id !== id) });
  };

  const updateProject = (id: string, field: keyof Project, value: string) => {
    setFormData({
      ...formData,
      projects: formData.projects.map(p => p.id === id ? { ...p, [field]: value } : p)
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-neutral-900 border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative"
      >
        <div className="sticky top-0 bg-neutral-900/90 backdrop-blur border-b border-white/10 p-6 flex items-center justify-between z-10">
          <h2 className="text-2xl font-bold text-white">Admin Dashboard</h2>
          <button onClick={onClose} className="p-2 text-neutral-400 hover:text-white transition-colors rounded-full hover:bg-white/10">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm text-neutral-400 font-medium">Foto Profil</label>
              <div className="flex items-center gap-4">
                {formData.photoUrl ? (
                  <img src={formData.photoUrl} alt="Preview" className="w-16 h-16 rounded-full object-cover border border-white/10" />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-neutral-800 border border-white/10 flex items-center justify-center text-neutral-500">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                )}
                <label className="flex items-center gap-2 cursor-pointer bg-neutral-950 border border-white/10 px-4 py-2 rounded-xl hover:bg-white/5 transition-colors text-white text-sm font-medium">
                  <Upload className="w-4 h-4" />
                  Pilih File Foto
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={e => handleImageUpload(e, (b64) => setFormData({...formData, photoUrl: b64}))} 
                  />
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-neutral-400 font-medium">Wallpaper Background</label>
              <div className="flex items-center gap-4">
                {formData.wallpaperUrl ? (
                  formData.wallpaperUrl.startsWith('data:video/') || formData.wallpaperUrl.match(/\.(mp4|webm|ogg)$/i) ? (
                    <video src={formData.wallpaperUrl} autoPlay loop muted playsInline className="w-24 h-16 rounded-lg object-cover border border-white/10" />
                  ) : (
                    <img src={formData.wallpaperUrl} alt="Preview" className="w-24 h-16 rounded-lg object-cover border border-white/10" />
                  )
                ) : (
                  <div className="w-24 h-16 rounded-lg bg-neutral-800 border border-white/10 flex items-center justify-center text-neutral-500">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                )}
                <label className="flex items-center gap-2 cursor-pointer bg-neutral-950 border border-white/10 px-4 py-2 rounded-xl hover:bg-white/5 transition-colors text-white text-sm font-medium">
                  <Upload className="w-4 h-4" />
                  Upload
                  <input 
                    type="file" 
                    accept="image/*,video/*" 
                    className="hidden" 
                    onChange={e => handleImageUpload(e, (b64) => setFormData({...formData, wallpaperUrl: b64}))} 
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-neutral-400 font-medium">Bio Data</label>
            <textarea 
              rows={4}
              value={formData.bio} 
              onChange={e => setFormData({...formData, bio: e.target.value})}
              className="w-full bg-neutral-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30 resize-none"
              placeholder="Deskripsi singkat diri Anda..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-neutral-400 font-medium">History Pendidikan</label>
              <textarea 
                rows={3}
                value={formData.education || ''} 
                onChange={e => setFormData({...formData, education: e.target.value})}
                className="w-full bg-neutral-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30 resize-none"
                placeholder="Riwayat pendidikan..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-neutral-400 font-medium">Pengalaman</label>
              <textarea 
                rows={3}
                value={formData.experience || ''} 
                onChange={e => setFormData({...formData, experience: e.target.value})}
                className="w-full bg-neutral-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30 resize-none"
                placeholder="Pengalaman kerja / organisasi..."
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-neutral-400 font-medium">Link Google Drive</label>
            <div className="relative">
              <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input 
                type="url" 
                value={formData.driveLink || ''} 
                onChange={e => setFormData({...formData, driveLink: e.target.value})}
                className="w-full bg-neutral-950 border border-white/10 rounded-xl pl-9 pr-4 py-3 text-white focus:outline-none focus:border-white/30"
                placeholder="https://drive.google.com/..."
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-neutral-400 font-medium">Link GitHub</label>
              <input 
                type="text" 
                value={formData.github} 
                onChange={e => setFormData({...formData, github: e.target.value})}
                className="w-full bg-neutral-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-neutral-400 font-medium">Link Instagram</label>
              <input 
                type="text" 
                value={formData.ig} 
                onChange={e => setFormData({...formData, ig: e.target.value})}
                className="w-full bg-neutral-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30"
              />
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-white/10">
            <div className="flex items-center justify-between">
              <label className="text-sm text-neutral-400 font-medium">Kelola Projects</label>
              <button onClick={addProject} className="flex items-center gap-1 text-sm bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg text-white transition-colors">
                <Plus className="w-4 h-4" /> Tambah Project
              </button>
            </div>
            
            <div className="space-y-4">
              {formData.projects.map((project) => (
                <div key={project.id} className="p-4 bg-neutral-950 border border-white/5 rounded-xl space-y-3 relative group">
                  <button onClick={() => removeProject(project.id)} className="absolute top-4 right-4 text-neutral-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <Trash2 className="w-4 h-4" />
                  </button>
                  
                  {/* Upload Image for Project */}
                  <div className="flex items-center gap-4 mb-2">
                    {project.imageUrl ? (
                      <img src={project.imageUrl} alt="Project Preview" className="w-24 h-16 rounded-lg object-cover border border-white/10" />
                    ) : (
                      <div className="w-24 h-16 rounded-lg bg-neutral-900 border border-white/10 flex items-center justify-center text-neutral-500">
                        <ImageIcon className="w-5 h-5" />
                      </div>
                    )}
                    <label className="flex items-center gap-2 cursor-pointer bg-neutral-900 border border-white/5 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors text-white text-xs font-medium">
                      <Upload className="w-4 h-4" />
                      Upload Gambar Project
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={e => handleImageUpload(e, (b64) => updateProject(project.id, 'imageUrl', b64))} 
                      />
                    </label>
                  </div>

                  <input 
                    type="text" 
                    value={project.title} 
                    onChange={e => updateProject(project.id, 'title', e.target.value)}
                    className="w-[90%] bg-transparent border-b border-white/10 px-0 py-1 text-white focus:outline-none focus:border-white/30 font-medium"
                    placeholder="Judul Project"
                  />
                  <textarea 
                    rows={2}
                    value={project.desc} 
                    onChange={e => updateProject(project.id, 'desc', e.target.value)}
                    className="w-full bg-neutral-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30 resize-none"
                    placeholder="Deskripsi singkat"
                  />
                  <div className="relative">
                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                    <input 
                      type="url" 
                      value={project.link || ''} 
                      onChange={e => updateProject(project.id, 'link', e.target.value)}
                      className="w-full bg-neutral-900 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-white/30"
                      placeholder="https://link-hasil-project.com"
                    />
                  </div>
                </div>
              ))}
              {formData.projects.length === 0 && (
                <p className="text-sm text-neutral-500 text-center py-4">Belum ada project. Klik tambah project.</p>
              )}
            </div>
          </div>

        </div>

        <div className="sticky bottom-0 bg-neutral-900/90 backdrop-blur border-t border-white/10 p-6 flex justify-end gap-3 z-10">
          <button onClick={onClose} className="px-6 py-2 rounded-xl font-medium text-neutral-400 hover:text-white transition-colors">
            Batal
          </button>
          <button 
            onClick={handleSave} 
            disabled={isSaving}
            className="px-6 py-2 bg-white text-black font-bold rounded-xl hover:bg-neutral-200 transition-colors disabled:opacity-50"
          >
            {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
