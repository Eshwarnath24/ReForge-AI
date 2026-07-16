import { Leaf } from "./Icons.jsx";

function AnimatedBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-[#f4fcf6]">
      {/* Soft animated gradient blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-emerald-200/40 rounded-full blur-[80px] animate-blob mix-blend-multiply" />
      <div className="absolute top-[20%] right-[-10%] w-[50vw] h-[50vw] bg-teal-100/60 rounded-full blur-[100px] animate-blob animation-delay-2000 mix-blend-multiply" />
      <div className="absolute bottom-[-20%] left-[20%] w-[60vw] h-[60vw] bg-lime-100/40 rounded-full blur-[120px] animate-blob animation-delay-4000 mix-blend-multiply" />

      {/* The Sun */}
      <div
        className="absolute top-[15%] left-[60%] md:left-[75%] w-32 h-32 md:w-48 md:h-48 bg-gradient-to-tr from-yellow-300 to-orange-200 rounded-full blur-[4px] opacity-90 shadow-[0_0_80px_30px_rgba(253,224,71,0.5)] animate-pulse"
        style={{ animationDuration: "6s" }}
      />
      <div className="absolute top-[15%] left-[60%] md:left-[75%] w-32 h-32 md:w-48 md:h-48 bg-yellow-100 rounded-full blur-[40px] opacity-60" />

      {/* Falling Leaves */}
      <div className="absolute -top-10 left-[15%] animate-float-leaf" style={{ animationDelay: "0s", animationDuration: "12s" }}>
        <Leaf className="w-6 h-6 text-emerald-500/30" />
      </div>
      <div className="absolute -top-10 left-[45%] animate-float-leaf" style={{ animationDelay: "5s", animationDuration: "15s" }}>
        <Leaf className="w-5 h-5 text-teal-500/20" />
      </div>
      <div className="absolute -top-10 right-[25%] animate-float-leaf" style={{ animationDelay: "2s", animationDuration: "14s" }}>
        <Leaf className="w-7 h-7 text-green-500/30" />
      </div>
      <div className="absolute -top-10 right-[10%] animate-float-leaf" style={{ animationDelay: "8s", animationDuration: "11s" }}>
        <Leaf className="w-4 h-4 text-emerald-600/20" />
      </div>

      {/* Nature Landscape Bottom Overlay */}
      <div className="absolute bottom-0 left-0 w-full opacity-70">
        <svg viewBox="0 0 1440 320" className="w-full h-auto block" preserveAspectRatio="none" style={{ minHeight: "25vh" }}>
          <path fill="#d1fae5" fillOpacity="0.7" d="M0,256L48,229.3C96,203,192,149,288,154.7C384,160,480,224,576,218.7C672,213,768,139,864,128C960,117,1056,171,1152,197.3C1248,224,1344,224,1392,224L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
          <path fill="#a7f3d0" fillOpacity="0.8" d="M0,128L60,144C120,160,240,192,360,186.7C480,181,600,139,720,149.3C840,160,960,224,1080,240C1200,256,1320,224,1380,208L1440,192L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z" />
        </svg>

        {/* Pine Trees */}
        <div className="absolute bottom-0 w-full h-full flex items-end justify-between px-4 sm:px-12 pb-2 pointer-events-none opacity-90 overflow-hidden">
          <svg width="60" height="100" viewBox="0 0 60 100" className="text-emerald-400 fill-current ml-[5%]">
            <polygon points="30,0 60,40 45,40 60,75 40,75 55,100 5,100 20,75 0,75 15,40 0,40" />
          </svg>
          <svg width="40" height="70" viewBox="0 0 60 100" className="text-emerald-500 fill-current ml-[2%] mb-4 hidden sm:block">
            <polygon points="30,0 60,40 45,40 60,75 40,75 55,100 5,100 20,75 0,75 15,40 0,40" />
          </svg>
          <svg width="85" height="140" viewBox="0 0 60 100" className="text-teal-300 fill-current ml-[15%] mb-[-10px]">
            <polygon points="30,0 60,40 45,40 60,75 40,75 55,100 5,100 20,75 0,75 15,40 0,40" />
          </svg>
          <svg width="50" height="90" viewBox="0 0 60 100" className="text-emerald-400 fill-current mr-[12%] hidden md:block">
            <polygon points="30,0 60,40 45,40 60,75 40,75 55,100 5,100 20,75 0,75 15,40 0,40" />
          </svg>
          <svg width="70" height="115" viewBox="0 0 60 100" className="text-green-400 fill-current mr-[8%] mb-2">
            <polygon points="30,0 60,40 45,40 60,75 40,75 55,100 5,100 20,75 0,75 15,40 0,40" />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default AnimatedBackground;
