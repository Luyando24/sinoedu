import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Under Maintenance – Sinoway Education',
  description: 'We are performing scheduled maintenance. Back shortly.',
  robots: { index: false, follow: false },
};

export default function MaintenancePage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .maint-root {
          font-family: 'Inter', system-ui, sans-serif;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: #03040a;
          color: #fff;
          overflow: hidden;
          position: relative;
          padding: 2rem 1.5rem;
        }

        /* ── Ambient background blobs ── */
        .blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(120px);
          opacity: 0.18;
          pointer-events: none;
          animation: drift 12s ease-in-out infinite alternate;
        }
        .blob-1 {
          width: 650px; height: 650px;
          background: radial-gradient(circle, #3b82f6, #1d4ed8);
          top: -180px; left: -160px;
        }
        .blob-2 {
          width: 500px; height: 500px;
          background: radial-gradient(circle, #8b5cf6, #6d28d9);
          bottom: -140px; right: -140px;
          animation-delay: -6s;
        }
        .blob-3 {
          width: 300px; height: 300px;
          background: radial-gradient(circle, #06b6d4, #0284c7);
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          animation-delay: -3s;
        }
        @keyframes drift {
          from { transform: translate(0, 0) scale(1); }
          to   { transform: translate(30px, 20px) scale(1.08); }
        }

        /* ── Grid overlay ── */
        .grid-overlay {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
          background-size: 48px 48px;
          mask-image: radial-gradient(ellipse at center, black 0%, transparent 72%);
          pointer-events: none;
        }

        /* ── Card ── */
        .card {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 520px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.10);
          border-radius: 24px;
          padding: 3rem 2.5rem;
          text-align: center;
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          box-shadow:
            0 0 0 1px rgba(255,255,255,0.06) inset,
            0 32px 80px rgba(0,0,0,0.5);
          animation: fadeUp 0.8s cubic-bezier(0.22,1,0.36,1) both;
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(32px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── Icon badge ── */
        .icon-ring {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 80px; height: 80px;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(59,130,246,0.2), rgba(139,92,246,0.2));
          border: 1px solid rgba(139,92,246,0.35);
          margin-bottom: 1.75rem;
          position: relative;
          animation: pulse-ring 2.5s ease-in-out infinite;
        }
        @keyframes pulse-ring {
          0%, 100% { box-shadow: 0 0 0 0 rgba(99,102,241,0.4); }
          50%       { box-shadow: 0 0 0 14px rgba(99,102,241,0); }
        }
        .icon-ring svg {
          width: 36px; height: 36px;
          stroke: #818cf8;
          fill: none;
          stroke-width: 1.75;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        /* ── Badge pill ── */
        .badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(16,185,129,0.12);
          border: 1px solid rgba(16,185,129,0.3);
          color: #34d399;
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 4px 12px;
          border-radius: 999px;
          margin-bottom: 1.25rem;
        }
        .badge-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #34d399;
          animation: blink 1.4s ease-in-out infinite;
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.3; }
        }

        /* ── Typography ── */
        .title {
          font-size: 2rem;
          font-weight: 800;
          letter-spacing: -0.03em;
          line-height: 1.15;
          background: linear-gradient(135deg, #e2e8f0 0%, #94a3b8 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 1rem;
        }
        .subtitle {
          font-size: 0.9375rem;
          color: rgba(148,163,184,0.85);
          line-height: 1.75;
          margin-bottom: 2rem;
        }

        /* ── Progress bar ── */
        .progress-wrap {
          background: rgba(255,255,255,0.06);
          border-radius: 999px;
          height: 4px;
          overflow: hidden;
          margin-bottom: 2rem;
        }
        .progress-bar {
          height: 100%;
          width: 65%;
          background: linear-gradient(90deg, #6366f1, #8b5cf6, #3b82f6);
          border-radius: 999px;
          animation: shimmer 2.2s ease-in-out infinite alternate;
        }
        @keyframes shimmer {
          from { width: 55%; opacity: 0.8; }
          to   { width: 78%; opacity: 1; }
        }

        /* ── Divider ── */
        .divider {
          border: none;
          border-top: 1px solid rgba(255,255,255,0.07);
          margin: 0 0 1.5rem;
        }

        /* ── Footer ── */
        .footer-text {
          font-size: 0.75rem;
          color: rgba(100,116,139,0.8);
          letter-spacing: 0.02em;
        }
        .footer-text a {
          color: rgba(99,102,241,0.8);
          text-decoration: none;
          transition: color 0.2s;
        }
        .footer-text a:hover { color: #818cf8; }

        /* ── Floating particles ── */
        .particles {
          position: absolute;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
        }
        .particle {
          position: absolute;
          width: 2px; height: 2px;
          border-radius: 50%;
          background: rgba(255,255,255,0.4);
          animation: float-particle linear infinite;
        }
        @keyframes float-particle {
          0%   { transform: translateY(100vh) translateX(0); opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { transform: translateY(-10vh) translateX(40px); opacity: 0; }
        }
      `}</style>

      <div className="maint-root">
        {/* Background elements */}
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
        <div className="grid-overlay" />

        {/* Floating particles */}
        <div className="particles">
          {[...Array(14)].map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                left: `${(i * 7.3 + 3) % 100}%`,
                animationDuration: `${8 + (i * 1.3) % 8}s`,
                animationDelay: `${(i * 0.7) % 6}s`,
              }}
            />
          ))}
        </div>

        {/* Main card */}
        <div className="card">
          {/* Gear icon */}
          <div className="icon-ring">
            <svg viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </div>

          {/* Live status badge */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <span className="badge">
              <span className="badge-dot" />
              Scheduled Maintenance
            </span>
          </div>

          <h1 className="title">We&rsquo;ll be back shortly</h1>

          <p className="subtitle">
            We&rsquo;re currently performing scheduled maintenance to improve your experience.
            Our team is working hard and we&rsquo;ll be online again very soon.
          </p>

          {/* Animated progress bar */}
          <div className="progress-wrap">
            <div className="progress-bar" />
          </div>

          <hr className="divider" />

          <p className="footer-text">
            &copy; {new Date().getFullYear()} Sinoway Education &mdash; All rights reserved.
          </p>
        </div>
      </div>
    </>
  );
}
