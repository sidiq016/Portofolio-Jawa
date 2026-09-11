import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Github, Instagram, Sparkles, MapPin, Mail, MessageCircle, User, ExternalLink, HardDrive, GraduationCap, Briefcase } from "lucide-react";
import { AdminPanel } from "./components/AdminPanel";

type Project = { id: string; title: string; desc: string; imageUrl?: string; link?: string };
type PortfolioData = { photoUrl: string; wallpaperUrl?: string; bio: string; education?: string; experience?: string; driveLink?: string; github: string; ig: string; projects: Project[] };

export default function App() {
  const [activeTab, setActiveTab] = useState<"about" | "projects" | "contact">("about");
  const [isLoading, setIsLoading] = useState(true);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [portfolioData, setPortfolioData] = useState<PortfolioData>({
    photoUrl: "", wallpaperUrl: "", bio: "", github: "", ig: "", projects: []
  });

  useEffect(() => {
    fetch("/api/portfolio")
      .then(res => res.json())
      .then(data => {
        setPortfolioData(data);
        setTimeout(() => setIsLoading(false), 1500); // Tampilkan loading screen minimal 1.5 detik
      });

    const handleKeyDown = (e: KeyboardEvent) => {
      // Shortcut: Shift + Ctrl + J
      if (e.shiftKey && e.ctrlKey && e.key.toLowerCase() === 'j') {
        setIsAdminOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-neutral-900 via-neutral-950 to-black flex flex-col items-center justify-center text-white">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5], rotate: [0, 180, 360] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="w-16 h-16 border-t-2 border-l-2 border-white rounded-full mb-8"
        />
        <motion.h2 
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="text-xl md:text-2xl font-bold tracking-widest uppercase text-neutral-400 flex items-center gap-2"
        >
          Selamat Datang ✨
        </motion.h2>
      </div>
    );
  }

  const isVideoWallpaper = portfolioData?.wallpaperUrl?.startsWith('data:video/') || portfolioData?.wallpaperUrl?.match(/\.(mp4|webm|ogg)$/i);

  return (
    <div className="min-h-screen text-neutral-100 font-sans selection:bg-neutral-700 selection:text-white flex flex-col relative overflow-x-hidden">
      {/* Dynamic Wallpaper */}
      {portfolioData.wallpaperUrl ? (
        <div className="fixed inset-0 z-0 pointer-events-none bg-black">
          {isVideoWallpaper ? (
            <video 
              src={portfolioData.wallpaperUrl} 
              autoPlay 
              loop 
              muted 
              playsInline 
              className="w-full h-full object-cover transition-opacity duration-1000 ease-in-out" 
              style={{ opacity: 0.6 }}
              onTimeUpdate={(e) => {
                const video = e.currentTarget;
                if (!video.duration) return;
                const timeLeft = video.duration - video.currentTime;
                // Fade out smoothly 1.5 seconds before it ends, and fade back in 0.5 seconds after it loops
                if (timeLeft <= 1.5) {
                  video.style.opacity = '0';
                } else if (video.currentTime <= 0.5) {
                  video.style.opacity = '0';
                } else {
                  video.style.opacity = '0.6';
                }
              }}
            />
          ) : (
            <img src={portfolioData.wallpaperUrl} alt="Wallpaper" className="w-full h-full object-cover opacity-60" />
          )}
        </div>
      ) : (
        <div className="fixed inset-0 z-0 bg-gradient-to-b from-neutral-900 via-neutral-950 to-black pointer-events-none" />
      )}

      {/* Background Orbs */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-white/5 blur-[120px] pointer-events-none" />

      {/* Hero Section */}
      <header className="relative z-10 w-full pt-16 md:pt-24 pb-12 overflow-hidden flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-12"
        >
          <Sparkles className="w-4 h-4 text-neutral-300" />
          <span className="text-sm font-medium tracking-wide text-neutral-300 uppercase">Creative Developer 🚀</span>
        </motion.div>

        <div className="relative flex items-center justify-center w-full max-w-[1400px] mx-auto px-4 sm:px-6 h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px] mt-4 mb-0">
          
          {/* Background Text Layer */}
          <div className="absolute inset-0 flex flex-col md:flex-row items-center md:items-stretch justify-between w-full z-0 pointer-events-none pb-12 md:pb-0">
            <motion.h1 
              initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}
              className="text-[4rem] sm:text-[5rem] md:text-[7rem] lg:text-[9rem] xl:text-[11rem] leading-[0.85] font-black text-center md:text-left uppercase tracking-tighter text-white w-full md:w-auto"
              style={{
                textShadow: "1px 1px 0 #a3a3a3, 2px 2px 0 #8b8b8b, 3px 3px 0 #737373, 4px 4px 0 #5a5a5a, 5px 5px 0 #404040, 6px 6px 0 #262626, 12px 12px 25px rgba(0,0,0,0.8)"
              }}
            >
              Firman <br className="hidden md:block" /> Sidiq
            </motion.h1>
            
            <motion.h1 
              initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}
              className="text-[4rem] sm:text-[5rem] md:text-[7rem] lg:text-[9rem] xl:text-[11rem] leading-[0.85] font-black text-center md:text-right uppercase tracking-tighter text-neutral-400 w-full md:w-auto mt-auto md:mt-0 md:flex md:items-end mb-16 md:mb-32 lg:mb-40"
              style={{
                textShadow: "1px 1px 0 #525252, 2px 2px 0 #404040, 3px 3px 0 #262626, 4px 4px 0 #171717, 5px 5px 0 #0a0a0a, 12px 12px 25px rgba(0,0,0,0.9)"
              }}
            >
              Java's <br className="hidden md:block" /> Studios
            </motion.h1>
          </div>

          {/* Foreground Photo Layer */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            className="absolute bottom-0 w-full max-w-[320px] sm:max-w-[400px] md:max-w-[550px] lg:max-w-[700px] h-[115%] flex items-end justify-center z-10 pointer-events-none"
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 rounded-full bg-white/5 blur-3xl opacity-50 z-0" />
            <img 
              src={portfolioData.photoUrl || "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"} 
              alt="Profile" 
              className="w-full h-full object-contain object-bottom relative z-10 grayscale hover:grayscale-0 transition-all duration-700 drop-shadow-[0_25px_35px_rgba(0,0,0,0.9)] pointer-events-auto"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const parent = e.currentTarget.parentElement;
                if (parent && !parent.querySelector('span')) {
                  const span = document.createElement('span');
                  span.className = 'text-neutral-500 text-sm text-center px-6 absolute z-0 bottom-1/4 pointer-events-auto';
                  span.innerHTML = 'Foto Profil <br/> (Unggah via Admin)';
                  parent.appendChild(span);
                }
              }}
            />
          </motion.div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-20 container mx-auto px-6 py-12 max-w-4xl flex-1 -mt-24 sm:-mt-32 md:-mt-40 lg:-mt-48">
        {/* Navigation Tabs */}
        <div className="flex justify-center mb-12">
          <div className="flex p-1 bg-white/5 border border-white/10 rounded-full backdrop-blur-md">
            {(["about", "projects", "contact"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeTab === tab ? "text-neutral-950" : "text-neutral-400 hover:text-white"
                }`}
              >
                {activeTab === tab && (
                  <motion.div
                    layoutId="active-tab"
                    className="absolute inset-0 bg-neutral-200 rounded-full"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10 capitalize flex items-center gap-1">
                  {tab} {tab === 'about' ? '✌️' : tab === 'projects' ? '🎨' : '🤙'}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="min-h-[400px]">
          <AnimatePresence mode="wait">
            {activeTab === "about" && (
              <motion.div
                key="about"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md">
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <User className="w-6 h-6 text-neutral-400" /> Bio Data 👨‍💻
                  </h2>
                  <p className="text-lg leading-relaxed text-neutral-300">
                    {portfolioData.bio || "Biodata belum diisi. Tekan Shift+Ctrl+J untuk mengisi biodata."}
                  </p>
                  
                  <div className="flex flex-wrap gap-4 mt-8 pt-6 border-t border-white/10">
                    {portfolioData.github && (
                      <a href={portfolioData.github} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors bg-white/5 px-4 py-2 rounded-full border border-white/5">
                        <Github className="w-5 h-5" /> <span className="text-sm font-medium">GitHub</span>
                      </a>
                    )}
                    {portfolioData.ig && (
                      <a href={portfolioData.ig} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors bg-white/5 px-4 py-2 rounded-full border border-white/5">
                        <Instagram className="w-5 h-5" /> <span className="text-sm font-medium">Instagram</span>
                      </a>
                    )}
                    {portfolioData.driveLink && (
                      <a href={portfolioData.driveLink} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors bg-white/5 px-4 py-2 rounded-full border border-white/5">
                        <HardDrive className="w-5 h-5" /> <span className="text-sm font-medium">Drive</span>
                      </a>
                    )}
                  </div>
                </div>

                {/* Education & Experience Sections */}
                <div className="grid md:grid-cols-2 gap-6">
                  {(portfolioData.education || !portfolioData.experience) && (
                    <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md">
                      <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-neutral-200">
                        <GraduationCap className="w-5 h-5 text-neutral-400" /> History Pendidikan
                      </h2>
                      <p className="text-neutral-400 text-sm leading-relaxed whitespace-pre-wrap">
                        {portfolioData.education || "Riwayat pendidikan belum ditambahkan."}
                      </p>
                    </div>
                  )}

                  {(portfolioData.experience || !portfolioData.education) && (
                    <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md">
                      <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-neutral-200">
                        <Briefcase className="w-5 h-5 text-neutral-400" /> Pengalaman
                      </h2>
                      <p className="text-neutral-400 text-sm leading-relaxed whitespace-pre-wrap">
                        {portfolioData.experience || "Pengalaman belum ditambahkan."}
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === "projects" && (
              <motion.div
                key="projects"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="grid sm:grid-cols-2 gap-6"
              >
                {portfolioData.projects.length > 0 ? portfolioData.projects.map((project) => {
                  const cardContent = (
                    <div className="p-6 rounded-3xl bg-neutral-900 border border-white/10 backdrop-blur-md group hover:-translate-y-1 transition-transform hover:border-white/30 flex flex-col h-full overflow-hidden">
                      {project.imageUrl && (
                        <div className="w-full h-40 mb-4 rounded-xl overflow-hidden bg-neutral-800 shrink-0">
                          <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                      )}
                      <h3 className="text-xl font-bold mb-2 group-hover:text-white transition-colors text-neutral-200 flex items-center gap-2">{project.title} ✨</h3>
                      <p className="text-neutral-400 text-sm leading-relaxed flex-grow">{project.desc}</p>
                      
                      {project.link && (
                        <div className="mt-4 pt-4 border-t border-white/10 flex items-center gap-1 text-sm font-medium text-neutral-300 group-hover:text-white transition-colors">
                          <ExternalLink className="w-4 h-4" /> Kunjungi Project
                        </div>
                      )}
                    </div>
                  );

                  return project.link ? (
                    <a href={project.link} target="_blank" rel="noreferrer" key={project.id} className="block cursor-pointer">
                      {cardContent}
                    </a>
                  ) : (
                    <div key={project.id}>
                      {cardContent}
                    </div>
                  );
                }) : (
                  <div className="col-span-1 sm:col-span-2 text-center py-16 bg-white/5 border border-white/10 rounded-3xl">
                    <p className="text-neutral-400 text-lg">Belum ada project yang ditambahkan 🥺<br/><span className="text-sm">Tekan <b>Shift + Ctrl + J</b> untuk menambahkan project.</span></p>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === "contact" && (
              <motion.div
                key="contact"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="max-w-xl mx-auto"
              >
                <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md relative overflow-hidden space-y-6">
                  <h2 className="text-2xl font-bold mb-8 text-center">Get in touch 🔥</h2>
                  
                  <a href="https://maps.app.goo.gl/1f4cae8mY4vLzt8T6" target="_blank" rel="noreferrer" className="flex items-center gap-4 p-4 rounded-xl bg-neutral-900 border border-white/5 hover:border-white/20 transition-colors group">
                    <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-neutral-300 group-hover:text-white transition-colors">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-neutral-200">Google Maps 📍</p>
                      <p className="text-sm text-neutral-500">Temukan lokasi studio kami</p>
                    </div>
                  </a>

                  <a href="https://wa.me/6285184571939" target="_blank" rel="noreferrer" className="flex items-center gap-4 p-4 rounded-xl bg-neutral-900 border border-white/5 hover:border-white/20 transition-colors group">
                    <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center text-green-500 group-hover:bg-green-500 group-hover:text-white transition-colors">
                      <MessageCircle className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-neutral-200">WhatsApp 💬</p>
                      <p className="text-sm text-neutral-500">0851-8457-1939</p>
                    </div>
                  </a>

                  <a href="mailto:email@example.com" className="flex items-center gap-4 p-4 rounded-xl bg-neutral-900 border border-white/5 hover:border-white/20 transition-colors group">
                    <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-neutral-300 group-hover:text-white transition-colors">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-neutral-200">Email 📧</p>
                      <p className="text-sm text-neutral-500">Kirimkan pesan ke email kami</p>
                    </div>
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full text-center py-8 text-neutral-400 text-sm mt-auto relative z-10 bg-black/40 backdrop-blur-xl">
        Property By Firman.s x Java's Company
      </footer>

      {/* Floating WA Button */}
      <a href="https://wa.me/6285184571939" target="_blank" rel="noreferrer" className="fixed bottom-6 right-6 z-40 bg-green-500 text-white p-4 rounded-full shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:bg-green-400 hover:scale-105 transition-all flex items-center justify-center group">
        <MessageCircle className="w-7 h-7" />
        <span className="absolute right-full mr-4 bg-white text-neutral-900 px-3 py-1.5 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-sm font-bold pointer-events-none">
          Hubungi saya 👋
        </span>
      </a>

      {/* Admin Panel Modal */}
      {isAdminOpen && (
        <AdminPanel 
          data={portfolioData} 
          onClose={() => setIsAdminOpen(false)} 
          onSave={setPortfolioData} 
        />
      )}
    </div>
  );
}
