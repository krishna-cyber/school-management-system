"use client"

import Link from "next/link"
import { useEffect, useRef } from "react"

// ─── Types ────────────────────────────────────────────────────────────────────

interface FeatureCard {
  icon: string
  title: string
  desc: string
  tag?: string
}

interface Testimonial {
  stars: number
  text: string
  initials: string
  name: string
  role: string
}

interface Step {
  num: number
  title: string
  desc: string
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const features: FeatureCard[] = [
  {
    icon: "📥",
    title: "Bulk Student Import",
    desc: "Upload a CSV or Excel sheet and onboard hundreds of students in seconds. Smart validation catches errors before they hit the database — with row-level error reporting.",
    tag: "✦ Unique",
  },
  {
    icon: "💳",
    title: "Smart Fee Management",
    desc: "Assign fee structures by class, track payments, mark overdue records nightly via cron, and issue waivers — all with full audit trails per student.",
  },
  {
    icon: "📅",
    title: "Attendance Tracking",
    desc: "Mark, edit, and export attendance by class and subject. Real-time dashboards show patterns across the whole school at a glance.",
  },
  {
    icon: "📊",
    title: "Result & Marksheets",
    desc: "Generate beautiful PDF marksheets at scale using background queues. No server timeouts, no waiting — results land in a download link.",
  },
  {
    icon: "🏢",
    title: "Multi-Tenant Architecture",
    desc: "Each school operates in its own isolated database context. One deployment, complete data separation — enterprise-grade without the enterprise price tag.",
    tag: "✦ Unique",
  },
  {
    icon: "🔐",
    title: "Secure Auth & Roles",
    desc: "Role-based access for Admins, Teachers, and Parents. Session management with cookie-based auth so every action is traceable and safe.",
  },
]

const testimonials: Testimonial[] = [
  {
    stars: 5,
    text: "The bulk import alone saved our admin team two full days at the start of every academic year. We used to dread enrollment season — now it's done before lunch.",
    initials: "RB",
    name: "Ramesh Bhandari",
    role: "Principal, Shree Secondary School",
  },
  {
    stars: 5,
    text: "Fee tracking used to be a nightmare of Excel sheets and missed follow-ups. EduNest auto-marks overdue fees and the waiver flow is incredibly smooth for edge cases.",
    initials: "SP",
    name: "Sunita Pradhan",
    role: "Finance Head, Everest Academy",
  },
  {
    stars: 5,
    text: "Multi-tenant architecture means each of our three campus branches has completely separate data. No more accidental cross-contamination. The security posture is excellent.",
    initials: "AJ",
    name: "Anil Joshi",
    role: "IT Director, Himalayan Edu Group",
  },
  {
    stars: 4,
    text: "Marksheet generation used to crash our server at exam time. EduNest queues everything in the background — teachers get a download link and the server doesn't break a sweat.",
    initials: "ML",
    name: "Maya Lama",
    role: "Exam Controller, Pokhara Public School",
  },
  {
    stars: 5,
    text: "Onboarding took less than a day. The interface is genuinely clean — our non-technical staff picked it up without any training. That's rare in school software.",
    initials: "BT",
    name: "Binod Tamang",
    role: "Admin Officer, Kathmandu Model School",
  },
  {
    stars: 5,
    text: "We self-host EduNest on our own server — no vendor lock-in, full data ownership. The observability setup with SigNoz gives us confidence that everything is running smoothly.",
    initials: "KS",
    name: "Krishna Shrestha",
    role: "Lead Developer, EduNest Early Adopter",
  },
]

const steps: Step[] = [
  {
    num: 1,
    title: "Register Your School",
    desc: "Create an account and your school gets its own isolated tenant environment instantly.",
  },
  {
    num: 2,
    title: "Import Students",
    desc: "Upload your roster via CSV or add students manually. Bulk or one at a time — your choice.",
  },
  {
    num: 3,
    title: "Configure Modules",
    desc: "Set up fee structures, class schedules, subjects, and roles for your staff in minutes.",
  },
  {
    num: 4,
    title: "Run Your School",
    desc: "Track attendance, collect fees, generate reports, and stay in control — from any device.",
  },
]

// ─── Scroll Reveal Hook ───────────────────────────────────────────────────────

function useReveal() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) el.classList.add("visible")
      },
      { threshold: 0.12 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  return ref
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Reveal({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) {
  const ref = useReveal()
  return (
    <div ref={ref} className={`reveal ${className}`}>
      {children}
    </div>
  )
}

function StarRating({ count }: { count: number }) {
  return (
    <div className="stars">
      {"★".repeat(count)}
      {"☆".repeat(5 - count)}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <>
      {/* ── Global styles ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400;0,700;0,900;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');

        :root {
          --green-900: #0d2b1a;
          --green-800: #14412a;
          --green-700: #1a5c3a;
          --green-600: #1e7a4b;
          --green-500: #22a060;
          --green-400: #34c97a;
          --green-300: #6fdea3;
          --green-100: #d4f5e3;
          --green-50:  #f0fdf7;
          --cream:     #faf8f3;
          --ink:       #0d1a12;
          --muted:     #4a6357;
          --border:    rgba(30,122,75,0.15);
        }

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body {
          font-family: 'DM Sans', sans-serif;
          background: var(--cream);
          color: var(--ink);
          overflow-x: hidden;
        }

        /* NAV */
        .edunest-nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 5%; height: 68px;
          background: rgba(250,248,243,0.85);
          backdrop-filter: blur(14px);
          border-bottom: 1px solid var(--border);
        }
        .logo { display: flex; align-items: center; gap: 10px; text-decoration: none; color: var(--ink); }
        .logo-icon {
          width: 38px; height: 38px;
          background: linear-gradient(135deg, var(--green-500), var(--green-700));
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-size: 20px;
          box-shadow: 0 4px 12px rgba(34,160,96,.35);
        }
        .logo-text { font-family: 'Fraunces', serif; font-weight: 900; font-size: 1.4rem; letter-spacing: -0.03em; }
        .logo-text span { color: var(--green-500); }
        .nav-links { display: flex; align-items: center; gap: 2rem; }
        .nav-links a { text-decoration: none; color: var(--muted); font-size: 0.9rem; font-weight: 500; transition: color .2s; }
        .nav-links a:hover { color: var(--ink); }
        .nav-ctas { display: flex; gap: 10px; }

        /* BUTTONS */
        .btn-ghost {
          padding: 8px 20px; border-radius: 8px;
          border: 1.5px solid var(--border); background: transparent;
          font-family: 'DM Sans', sans-serif; font-size: 0.875rem; font-weight: 600;
          color: var(--ink); cursor: pointer;
          transition: border-color .2s, background .2s;
        }
        .btn-ghost:hover { border-color: var(--green-500); background: var(--green-50); }
        .btn-primary {
          padding: 8px 22px; border-radius: 8px; border: none;
          background: linear-gradient(135deg, var(--green-500), var(--green-700));
          font-family: 'DM Sans', sans-serif; font-size: 0.875rem; font-weight: 600;
          color: #fff; cursor: pointer;
          box-shadow: 0 4px 14px rgba(34,160,96,.3);
          transition: box-shadow .2s, transform .15s;
        }
        .btn-primary:hover { box-shadow: 0 6px 20px rgba(34,160,96,.4); transform: translateY(-1px); }
        .btn-lg { padding: 14px 32px !important; font-size: 1rem !important; border-radius: 10px !important; }

        /* HERO */
        .hero {
          min-height: 100vh;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          text-align: center; padding: 120px 5% 80px;
          position: relative; overflow: hidden;
        }
        .hero-bg {
          position: absolute; inset: 0; z-index: 0;
          background:
            radial-gradient(ellipse 70% 60% at 50% 0%, rgba(34,160,96,.13) 0%, transparent 70%),
            radial-gradient(ellipse 40% 40% at 80% 80%, rgba(52,201,122,.08) 0%, transparent 60%);
        }
        .hero-bg::after {
          content:''; position: absolute; inset: 0;
          background-image:
            linear-gradient(var(--border) 1px, transparent 1px),
            linear-gradient(90deg, var(--border) 1px, transparent 1px);
          background-size: 48px 48px;
          mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 0%, transparent 100%);
        }
        .hero-badge {
          display: inline-flex; align-items: center; gap: 8px;
          background: var(--green-50); border: 1px solid var(--green-300);
          border-radius: 999px; padding: 6px 16px;
          font-size: 0.8rem; font-weight: 600; color: var(--green-700);
          margin-bottom: 2rem; position: relative; z-index: 1;
          animation: fadeUp .6s ease both;
        }
        .badge-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: var(--green-500);
          animation: pulse 2s ease-in-out infinite;
        }
        .hero h1 {
          font-family: 'Fraunces', serif;
          font-size: clamp(2.8rem, 6vw, 5.2rem);
          font-weight: 900; line-height: 1.05; letter-spacing: -0.03em;
          max-width: 820px; position: relative; z-index: 1;
          animation: fadeUp .7s .1s ease both;
        }
        .hero h1 em { font-style: italic; color: var(--green-500); }
        .hero-sub {
          margin-top: 1.5rem; font-size: 1.1rem; line-height: 1.7;
          color: var(--muted); max-width: 540px;
          position: relative; z-index: 1;
          animation: fadeUp .7s .2s ease both;
        }
        .hero-ctas {
          display: flex; gap: 14px; margin-top: 2.5rem;
          position: relative; z-index: 1;
          animation: fadeUp .7s .3s ease both;
        }
        .hero-stats {
          display: flex; gap: 3rem; margin-top: 5rem;
          position: relative; z-index: 1;
          animation: fadeUp .7s .45s ease both;
        }
        .stat { text-align: center; }
        .stat-num { font-family: 'Fraunces', serif; font-size: 2.2rem; font-weight: 900; color: var(--green-600); line-height: 1; }
        .stat-label { font-size: 0.8rem; color: var(--muted); margin-top: 4px; font-weight: 500; }

        /* SECTION COMMON */
        .page-section { padding: 100px 5%; }
        .section-eyebrow { font-size: 0.78rem; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: var(--green-600); margin-bottom: 1rem; }
        .section-title { font-family: 'Fraunces', serif; font-size: clamp(1.9rem, 3.5vw, 2.9rem); font-weight: 900; line-height: 1.15; letter-spacing: -0.025em; max-width: 640px; }
        .section-sub { color: var(--muted); font-size: 1.05rem; line-height: 1.7; max-width: 520px; margin-top: .75rem; }

        /* FEATURES */
        .features-section { background: var(--green-900); color: var(--cream); padding: 100px 5%; }
        .features-section .section-title { color: var(--cream); }
        .features-section .section-eyebrow { color: var(--green-300); }
        .features-section .section-sub { color: rgba(212,245,227,.65); }
        .features-header { margin-bottom: 4rem; }
        .features-grid {
          display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5px; background: rgba(255,255,255,.08);
          border: 1.5px solid rgba(255,255,255,.08); border-radius: 16px; overflow: hidden;
        }
        .feat-card { background: var(--green-900); padding: 2.5rem; transition: background .25s; position: relative; overflow: hidden; }
        .feat-card::before {
          content:''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
          background: linear-gradient(90deg, var(--green-500), var(--green-300));
          transform: scaleX(0); transform-origin: left; transition: transform .35s ease;
        }
        .feat-card:hover { background: rgba(34,160,96,.08); }
        .feat-card:hover::before { transform: scaleX(1); }
        .feat-icon {
          width: 48px; height: 48px;
          background: linear-gradient(135deg, var(--green-700), var(--green-500));
          border-radius: 12px; display: flex; align-items: center; justify-content: center;
          font-size: 1.4rem; margin-bottom: 1.25rem;
          box-shadow: 0 4px 16px rgba(34,160,96,.25);
        }
        .feat-title { font-family: 'Fraunces', serif; font-size: 1.2rem; font-weight: 700; color: var(--cream); margin-bottom: .6rem; }
        .feat-desc { font-size: 0.9rem; line-height: 1.65; color: rgba(212,245,227,.65); }
        .feat-tag {
          display: inline-block; margin-top: 1rem; padding: 3px 10px; border-radius: 999px;
          background: rgba(52,201,122,.15); border: 1px solid rgba(52,201,122,.3);
          font-size: 0.72rem; font-weight: 600; letter-spacing: .06em; color: var(--green-300); text-transform: uppercase;
        }

        /* BULK SPOTLIGHT */
        .spotlight { display: grid; grid-template-columns: 1fr 1fr; gap: 5rem; align-items: center; }
        .spotlight-visual {
          position: relative; background: var(--green-900); border-radius: 16px; padding: 2rem;
          overflow: hidden; box-shadow: 0 24px 64px rgba(13,43,26,.15); border: 1px solid var(--border);
        }
        .csv-preview { font-family: 'Courier New', monospace; font-size: 0.78rem; color: var(--green-300); line-height: 1.8; }
        .csv-header { color: var(--green-400); font-weight: 700; border-bottom: 1px solid rgba(52,201,122,.2); padding-bottom: .5rem; margin-bottom: .5rem; }
        .csv-row { opacity: .8; }
        .csv-row:hover { opacity: 1; }
        .upload-zone {
          margin-top: 1.5rem; border: 2px dashed rgba(52,201,122,.4); border-radius: 10px;
          padding: 1.2rem; text-align: center; color: var(--green-400); font-size: 0.85rem; font-weight: 600;
        }
        .progress-bar { margin-top: 1rem; height: 6px; border-radius: 999px; background: rgba(52,201,122,.15); overflow: hidden; }
        .progress-fill {
          height: 100%; background: linear-gradient(90deg, var(--green-500), var(--green-300));
          border-radius: 999px; width: 0;
          animation: fill 2.5s 1s ease forwards;
        }
        .progress-label { font-size: 0.75rem; color: var(--green-400); margin-top: .5rem; text-align: right; }
        .spotlight-badge {
          position: absolute; top: 1rem; right: 1rem;
          background: var(--green-500); color: #fff;
          font-size: 0.7rem; font-weight: 700; padding: 4px 10px; border-radius: 999px; letter-spacing: .05em;
        }
        .bulk-list { list-style: none; display: flex; flex-direction: column; gap: .85rem; }
        .bulk-list li { display: flex; align-items: flex-start; gap: .75rem; font-size: .93rem; color: var(--ink); }
        .bulk-check { color: var(--green-500); font-weight: 700; flex-shrink: 0; }

        /* HOW IT WORKS */
        .how-section { background: var(--green-50); padding: 100px 5%; }
        .steps-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 2rem; margin-top: 3.5rem; position: relative; }
        .steps-grid::before {
          content:''; position: absolute; top: 28px; left: 10%; right: 10%; height: 1px;
          background: linear-gradient(90deg, transparent, var(--green-300), transparent);
        }
        .step { text-align: center; }
        .step-num {
          width: 56px; height: 56px; border-radius: 50%;
          background: linear-gradient(135deg, var(--green-500), var(--green-700));
          color: #fff; font-family: 'Fraunces', serif; font-size: 1.4rem; font-weight: 900;
          display: flex; align-items: center; justify-content: center; margin: 0 auto 1.25rem;
          box-shadow: 0 8px 24px rgba(34,160,96,.3); position: relative; z-index: 1;
        }
        .step-title { font-family: 'Fraunces', serif; font-size: 1.1rem; font-weight: 700; margin-bottom: .5rem; }
        .step-desc { font-size: 0.88rem; color: var(--muted); line-height: 1.6; }

        /* TESTIMONIALS */
        .testi-section { background: var(--green-50); padding: 100px 5%; }
        .testi-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; margin-top: 3.5rem; }
        .testi-card {
          background: #fff; border: 1px solid var(--border); border-radius: 16px; padding: 2rem;
          position: relative; transition: transform .25s, box-shadow .25s;
        }
        .testi-card:hover { transform: translateY(-4px); box-shadow: 0 20px 48px rgba(13,43,26,.1); }
        .testi-quote { font-family: 'Fraunces', serif; font-size: 2.5rem; color: var(--green-300); line-height: 1; margin-bottom: .5rem; }
        .testi-text { font-size: 0.95rem; line-height: 1.75; color: #2d3a31; margin-bottom: 1.5rem; }
        .testi-author { display: flex; align-items: center; gap: 12px; }
        .testi-avatar {
          width: 44px; height: 44px; border-radius: 50%;
          background: linear-gradient(135deg, var(--green-400), var(--green-700));
          display: flex; align-items: center; justify-content: center;
          font-weight: 700; color: #fff; font-size: 1rem; flex-shrink: 0;
        }
        .testi-name { font-weight: 600; font-size: 0.9rem; }
        .testi-role { font-size: 0.8rem; color: var(--muted); }
        .stars { color: var(--green-500); font-size: 0.85rem; margin-bottom: .75rem; }

        /* CTA BANNER */
        .cta-banner {
          background: linear-gradient(135deg, var(--green-700) 0%, var(--green-900) 100%);
          border-radius: 24px; margin: 0 5% 100px; padding: 5rem;
          text-align: center; color: #fff; position: relative; overflow: hidden;
        }
        .cta-banner::before {
          content:''; position: absolute; inset: 0;
          background-image:
            radial-gradient(circle at 20% 50%, rgba(52,201,122,.2) 0%, transparent 50%),
            radial-gradient(circle at 80% 50%, rgba(34,160,96,.15) 0%, transparent 50%);
        }
        .cta-banner h2 { font-family: 'Fraunces', serif; font-size: clamp(2rem, 4vw, 3.2rem); font-weight: 900; line-height: 1.15; position: relative; }
        .cta-banner p { color: rgba(212,245,227,.75); margin-top: .75rem; font-size: 1.05rem; position: relative; }
        .cta-ctas { display: flex; gap: 14px; margin-top: 2rem; justify-content: center; position: relative; }

        /* FOOTER */
        .site-footer {
          border-top: 1px solid var(--border); padding: 2.5rem 5%;
          display: flex; align-items: center; justify-content: space-between;
          font-size: 0.85rem; color: var(--muted);
        }
        .site-footer a { color: var(--muted); text-decoration: none; }
        .site-footer a:hover { color: var(--green-600); }
        .footer-links { display: flex; gap: 2rem; }

        /* ANIMATIONS */
        @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: .5; transform: scale(1.4); } }
        @keyframes fill { from { width: 0; } to { width: 78%; } }

        /* SCROLL REVEAL */
        .reveal { opacity: 0; transform: translateY(30px); transition: opacity .65s ease, transform .65s ease; }
        .reveal.visible { opacity: 1; transform: none; }

        /* RESPONSIVE */
        @media (max-width: 768px) {
          .spotlight { grid-template-columns: 1fr; }
          .steps-grid::before { display: none; }
          .hero-stats { gap: 2rem; }
          .nav-links { display: none; }
          .cta-banner { padding: 3rem 2rem; }
        }
      `}</style>

      {/* ── Nav ── */}
      <nav className="edunest-nav">
        <Link href="/" className="logo">
          <div className="logo-icon">🌱</div>
          <div className="logo-text">
            Edu<span>Nest</span>
          </div>
        </Link>

        <div className="nav-links">
          <Link href="#features">Features</Link>
          <Link href="#how">How it Works</Link>
          <Link href="#testimonials">Reviews</Link>
        </div>

        <div className="nav-ctas">
          <Link href="/sign-in">
            <button className="btn-ghost">Log in</button>
          </Link>
          <Link href="/register">
            <button className="btn-primary">Get Started</button>
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-bg" />

        <div className="hero-badge">
          <div className="badge-dot" />
          Built for modern schools — not spreadsheets
        </div>

        <h1>
          Where <em>School Admin</em>
          <br />
          Finally Makes Sense
        </h1>

        <p className="hero-sub">
          EduNest unifies students, fees, attendance, and results in one clean
          platform — built on multi-tenant architecture so every school gets its
          own secure space.
        </p>

        <div className="hero-ctas">
          <Link href="/register">
            <button className="btn-primary btn-lg">Start Free Trial</button>
          </Link>
          <Link href="#features">
            <button className="btn-ghost btn-lg">See Features →</button>
          </Link>
        </div>

        <div className="hero-stats">
          <div className="stat">
            <div className="stat-num">10k+</div>
            <div className="stat-label">Students Managed</div>
          </div>
          <div className="stat">
            <div className="stat-num">99.9%</div>
            <div className="stat-label">Uptime SLA</div>
          </div>
          <div className="stat">
            <div className="stat-num">5 min</div>
            <div className="stat-label">Setup Time</div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="features-section" id="features">
        <div className="features-header">
          <div className="section-eyebrow">What&apos;s inside</div>
          <h2 className="section-title">
            Everything your school needs, nothing it doesn&apos;t
          </h2>
          <p className="section-sub">
            Purpose-built modules that replace a dozen disconnected tools.
          </p>
        </div>

        <div className="features-grid">
          {features.map((f) => (
            <div className="feat-card" key={f.title}>
              <div className="feat-icon">{f.icon}</div>
              <div className="feat-title">{f.title}</div>
              <p className="feat-desc">{f.desc}</p>
              {f.tag && <span className="feat-tag">{f.tag}</span>}
            </div>
          ))}
        </div>
      </section>

      {/* ── Bulk Import Spotlight ── */}
      <section
        className="page-section"
        id="bulk"
        style={{ background: "var(--cream)" }}
      >
        <Reveal>
          <div className="spotlight">
            <div className="spotlight-visual">
              <div className="spotlight-badge">LIVE DEMO</div>
              <div className="csv-preview">
                <div className="csv-header">
                  name, class, rollNo, parentEmail
                </div>
                {[
                  ["Aarav Sharma", "10-A", "001", "sharma@mail.com"],
                  ["Priya Thapa", "10-A", "002", "thapa@mail.com"],
                  ["Rajan Karki", "10-B", "003", "karki@mail.com"],
                  ["Sita Rai", "10-B", "004", "rai@mail.com"],
                  ["Dev Magar", "11-A", "005", "magar@mail.com"],
                  ["Anita Bk", "11-A", "006", "anita@mail.com"],
                ].map((row) => (
                  <div className="csv-row" key={row[2]}>
                    {row.join(", ")}
                  </div>
                ))}
              </div>
              <div className="upload-zone">
                ⬆ Drop your .csv or .xlsx file here
              </div>
              <div className="progress-bar">
                <div className="progress-fill" />
              </div>
              <div className="progress-label">Importing 847 records… 78%</div>
            </div>

            <div>
              <div className="section-eyebrow">Bulk Import</div>
              <h2 className="section-title">
                Onboard an entire school in one upload
              </h2>
              <p className="section-sub" style={{ marginBottom: "1.75rem" }}>
                Stop entering students one by one. Drop a spreadsheet and
                EduNest will validate, transform, and insert every row —
                reporting errors line-by-line so nothing slips through.
              </p>
              <ul className="bulk-list">
                {[
                  "CSV & Excel (.xlsx) support with SheetJS parsing",
                  "Row-level validation with collected error reporting",
                  "Bulk insertMany — no N+1 inserts slowing you down",
                  "Duplicate guard prevents double-registration",
                ].map((item) => (
                  <li key={item}>
                    <span className="bulk-check">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── How It Works ── */}
      <section className="how-section" id="how">
        <Reveal>
          <div className="section-eyebrow">How it works</div>
        </Reveal>
        <Reveal>
          <h2 className="section-title">Up and running in four steps</h2>
        </Reveal>
        <div className="steps-grid">
          {steps.map((s) => (
            <Reveal key={s.num}>
              <div className="step">
                <div className="step-num">{s.num}</div>
                <div className="step-title">{s.title}</div>
                <p className="step-desc">{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="testi-section" id="testimonials">
        <Reveal>
          <div className="section-eyebrow">What admins say</div>
        </Reveal>
        <Reveal>
          <h2 className="section-title">
            Schools that switched, never looked back
          </h2>
        </Reveal>

        <div className="testi-grid">
          {testimonials.map((t) => (
            <Reveal key={t.name}>
              <div className="testi-card">
                <StarRating count={t.stars} />
                <div className="testi-quote">&ldquo;</div>
                <p className="testi-text">{t.text}</p>
                <div className="testi-author">
                  <div className="testi-avatar">{t.initials}</div>
                  <div>
                    <div className="testi-name">{t.name}</div>
                    <div className="testi-role">{t.role}</div>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <Reveal>
        <div className="cta-banner">
          <h2>Ready to modernize your school?</h2>
          <p>Join hundreds of schools already running smoother on EduNest.</p>
          <div className="cta-ctas">
            <Link href="/register">
              <button className="btn-primary btn-lg">
                Create Free Account
              </button>
            </Link>
            <button
              className="btn-ghost btn-lg"
              style={{ color: "#fff", borderColor: "rgba(255,255,255,.35)" }}
            >
              Book a Demo
            </button>
          </div>
        </div>
      </Reveal>

      {/* ── Footer ── */}
      <footer className="site-footer">
        <Link href="/" className="logo">
          <div
            className="logo-icon"
            style={{ width: 28, height: 28, fontSize: 14 }}
          >
            🌱
          </div>
          <div className="logo-text" style={{ fontSize: "1rem" }}>
            Edu<span>Nest</span>
          </div>
        </Link>
        <div className="footer-links">
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
          <Link href="/contact">Contact</Link>
        </div>
        <div>© 2026 EduNest. Built with ☕ and NestJS.</div>
      </footer>
    </>
  )
}
