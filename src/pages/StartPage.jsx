
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const VIDEO_SRC =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260717_120352_eb988725-1351-43b3-8095-16e4a1005e3d.mp4';

function VortexLogo({ className }) {
  return (
    <svg viewBox="0 0 256 256" fill="white" className={className} aria-hidden="true">
      <path d="M128 24a104 104 0 1 0 104 104A104 104 0 0 0 128 24Zm0 192a88 88 0 1 1 88-88 88 88 0 0 1-88 88Z" opacity="0.18" />
      <path d="M128 40a88 88 0 0 1 76 44l-30 18a54 54 0 0 0-46-28Z" />
      <path d="M216 128a88 88 0 0 1-44 76l-18-30a54 54 0 0 0 28-46Z" />
      <path d="M128 216a88 88 0 0 1-76-44l30-18a54 54 0 0 0 46 28Z" />
      <path d="M40 128a88 88 0 0 1 44-76l18 30a54 54 0 0 0-28 46Z" />
    </svg>
  );
}

function IconX() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817-5.966 6.817H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117l11.966 15.644Z" />
    </svg>
  );
}

function IconLinkedIn() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.8 0 0 .78 0 1.74v20.52C0 23.22.8 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.74V1.74C24 .78 23.2 0 22.22 0Z" />
    </svg>
  );
}

function IconFacebook() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
      <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.25h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07Z" />
    </svg>
  );
}

export default function StartPage() {
  const navigate = useNavigate();
  const goToSignIn = () => navigate('/login');

  return (
    <div className="h-screen w-full bg-black p-3 md:p-4 font-inter">
      <div className="w-full h-full rounded-2xl flex flex-col overflow-hidden relative bg-black">
        <video
          src={VIDEO_SRC}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover anim-fade"
          style={{ animationDelay: '0.2s' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/60" />

        <nav className="relative z-10 flex items-center justify-between px-6 md:px-10 pt-6 md:pt-8">
          <div className="anim-stagger" style={{ animationDelay: '0.1s' }}>
            <VortexLogo className="w-14 h-14 md:w-16 md:h-16" />
            <span className="block text-white text-[10px] md:text-xs tracking-[0.4em] mt-1 font-light">
              V E R A S C O P E
            </span>
          </div>
          <div className="anim-stagger flex items-center gap-3" style={{ animationDelay: '0.2s' }}>
            <button className="hidden md:block px-5 py-2.5 text-white text-sm hover:bg-white/10 btn-cut-border transition-colors">
              <span>How It Works</span>
            </button>
            <button
              onClick={goToSignIn}
              className="hidden md:block px-5 py-2.5 bg-white text-black text-sm hover:bg-white/90 btn-cut transition-colors"
            >
              <span>Sign In</span>
            </button>
          </div>
        </nav>

        <div className="relative z-10 flex-1 flex flex-col justify-between px-6 md:px-10 pb-8 md:pb-10">
          <div className="flex-1 flex items-center relative">
            <div className="anim-stagger hidden lg:flex flex-col gap-6 absolute left-0 top-[18%]" style={{ animationDelay: '0.4s' }}>
              <p className="text-white/80 text-base leading-relaxed max-w-[220px]">
                See the evidence
                <br />
                behind every
                <br />
                claim.
              </p>
              <div className="flex flex-col gap-2 mt-4">
                <div className="flex items-center gap-1">
                  <span className="w-4 h-4 rounded-full border border-white/40" />
                  <span className="w-4 h-4 rounded-full border border-white/40" />
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-white/70 text-xs leading-tight">
                    Transparent
                    <br />
                    Verification
                  </span>
                  <span className="text-white/50 text-xs">01</span>
                </div>
              </div>
            </div>

            <div className="anim-stagger w-full text-center" style={{ animationDelay: '0.5s' }}>
              <h1
                className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-normal leading-[1.1] tracking-[-0.04em]"
                style={{ textShadow: '0 2px 12px rgba(0,0,0,0.25)' }}
              >
                Look Closer
                <br />
                Before You Believe It
                <br />
                Verascope
              </h1>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center mt-8">
            <div className="anim-stagger flex items-center justify-center md:justify-end" style={{ animationDelay: '0.7s' }}>
              <p className="text-white text-sm leading-relaxed max-w-[260px] text-center md:text-left md:ml-auto">
                We gather and weigh evidence from credible sources â€” so you see exactly what supports a claim, and what doesn't.
              </p>
            </div>

            <div className="anim-stagger flex flex-col items-center gap-8 md:gap-24" style={{ animationDelay: '0.85s' }}>
              <span className="text-white text-2xl md:text-3xl font-medium">Evidence Engine</span>
              <button
                onClick={goToSignIn}
                className="w-full max-w-[280px] py-3.5 bg-white flex items-center justify-center gap-2 text-black hover:bg-white/90 transition-colors group btn-cut"
              >
                <span className="text-sm font-medium">Get Started</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="anim-stagger flex items-center justify-center md:justify-end gap-3" style={{ animationDelay: '1s' }}>
              <button className="w-10 h-10 bg-white flex items-center justify-center text-black hover:bg-white/90 transition-colors btn-cut-sm" aria-label="X">
                <IconX />
              </button>
              <button className="w-10 h-10 bg-white flex items-center justify-center text-black hover:bg-white/90 transition-colors btn-cut-sm" aria-label="LinkedIn">
                <IconLinkedIn />
              </button>
              <button className="w-10 h-10 bg-white flex items-center justify-center text-black hover:bg-white/90 transition-colors btn-cut-sm" aria-label="Facebook">
                <IconFacebook />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

