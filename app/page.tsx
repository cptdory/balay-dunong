import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Zap, Music, Beaker } from 'lucide-react';

const courses = [
    {
        id: 1,
        icon: Zap,
        category: 'Technology',
        title: 'Robotics Engineering',
        description:
            'Dive into the world of robotics — from circuit design to programming autonomous machines. Hands-on projects every session.',
        sessions: '7 Sessions',
        level: 'All Levels',
        accent: 'from-amber-400/20 to-yellow-600/10',
        border: 'border-amber-500/30',
        glow: 'shadow-amber-500/20',
    },
    {
        id: 2,
        icon: Music,
        category: 'Music & Arts',
        title: 'Guitar Masterclass',
        description:
            'Learn from classical fundamentals to modern techniques. Acoustic or electric — master chords, melody, and your own musical voice.',
        sessions: '7 Sessions',
        level: 'All Levels',
        accent: 'from-blue-400/20 to-indigo-600/10',
        border: 'border-blue-400/30',
        glow: 'shadow-blue-400/20',
    },
    {
        id: 3,
        icon: Beaker,
        category: 'Science',
        title: 'Science Investigatory Projects',
        description:
            'Design, conduct, and present your own scientific experiments. Build critical thinking skills and compete at regional science fairs.',
        sessions: '7 Sessions',
        level: 'All Levels',
        accent: 'from-emerald-400/20 to-teal-600/10',
        border: 'border-emerald-400/30',
        glow: 'shadow-emerald-400/20',
    },
];

const stats = [
    { value: 'xxx+', label: 'Students Enrolled' },
    { value: 'xxx+', label: 'Expert Instructors' },
    { value: 'xxx%', label: 'Satisfaction Rate' },
];

export default function Page() {
    return (
        <>
            <div className="min-h-screen bg-casa-gradient"
                style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                }}
            >
                <Header />

                {/* HERO */}
                <section className="relative min-h-screen flex items-center overflow-hidden px-4 md:px-8">
                    {/* Star background */}
                    <div className="star-bg">
                        {[...Array(60)].map((_, i) => (
                            <div
                                key={i}
                                className="star"
                                style={{
                                    left: `${Math.random() * 100}%`,
                                    top: `${Math.random() * 100}%`,
                                    animationDelay: `${Math.random() * 3}s`,
                                    animationDuration: `${2 + Math.random() * 3}s`,
                                    opacity: Math.random() * 0.6 + 0.1,
                                    width: Math.random() > 0.8 ? '3px' : '2px',
                                    height: Math.random() > 0.8 ? '3px' : '2px',
                                }}
                            />
                        ))}
                    </div>

                    {/* Geometric accents */}
                    <div
                        className="geometric-accent"
                        style={{
                            width: 500,
                            height: 500,
                            borderRadius: '50%',
                            right: -100,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            borderColor: '#c9a84c18',
                        }}
                    />
                    <div
                        className="geometric-accent"
                        style={{
                            width: 350,
                            height: 350,
                            borderRadius: '50%',
                            right: 75,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            borderColor: '#c9a84c14',
                        }}
                    />

                    <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-center py-12 md:py-24">
                        <div className="text-center lg:text-left">
                            <div className="subtitle mb-8 lg:justify-start">
                                <div className="gold-divider" />
                                Established 2026 · Excellence in Education
                                <div className="gold-divider" />
                            </div>

                            <h1 className="hero-title gold-text mb-6" style={{ fontSize: 'clamp(3rem, 6vw, 5.5rem)' }}>
                                Where Knowledge
                                <br />
                                <span className="text-slate-200">Meets</span> Mastery
                            </h1>

                            <p className="text-subtitle max-w-md mb-10 mx-auto lg:mx-0 lg:text-left">
                                An elite tutorial center offering immersive learning in Robotics, Music, and Science.
                                Cultivating curious minds through expert instruction and hands-on discovery.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
                                <Link href="/courses" className="w-full sm:w-auto">
                                    <Button className="btn-gold px-6 md:px-8 py-2 md:py-3 rounded-none h-auto text-sm w-full sm:w-auto">
                                        Explore Courses
                                    </Button>
                                </Link>
                                <Link href="/contact" className="w-full sm:w-auto">
                                    <Button className="btn-outline-gold px-6 md:px-8 py-2 md:py-3 rounded-none h-auto text-sm w-full sm:w-auto">
                                        Schedule a Tour
                                    </Button>
                                </Link>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 mt-8 md:mt-16 pt-8 md:pt-10" style={{ borderTop: '1px solid #c9a84c22' }}>
                                {stats.map((stat) => (
                                    <div key={stat.label} className="text-center md:text-left">
                                        <div
                                            className="gold-text"
                                            style={{
                                                fontFamily: "'Cinzel', serif",
                                                fontWeight: 700,
                                                fontSize: '1.6rem',
                                            }}
                                        >
                                            {stat.value}
                                        </div>
                                        <div
                                            style={{
                                                fontFamily: "'Lato', sans-serif",
                                                fontWeight: 300,
                                                fontSize: '0.65rem',
                                                letterSpacing: '0.12em',
                                                textTransform: 'uppercase',
                                                color: '#64748b',
                                                marginTop: 2,
                                            }}
                                        >
                                            {stat.label}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right side decorative element */}
                        <div className="hidden lg:flex items-center justify-center relative">
                            <div
                                style={{
                                    width: 380,
                                    height: 380,
                                    border: '1px solid #c9a84c33',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    position: 'relative',
                                }}
                            >
                                <div
                                    style={{
                                        width: 280,
                                        height: 280,
                                        border: '1px solid #c9a84c22',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        background: 'radial-gradient(circle, #132045 0%, #0a0f1e 70%)',
                                    }}
                                >
                                    <div style={{ textAlign: 'center' }}>
                                        <img
                                            src="/casa-del-sapere-logo.png"
                                            alt="Casa Del Sapere logo"
                                            style={{
                                                width: 120,
                                                height: 120,
                                                objectFit: 'contain',
                                                margin: '0 auto',
                                                filter: 'drop-shadow(0 0 16px rgba(201,168,76,0.28))',
                                            }}
                                        />
                                        <div
                                            className="gold-text"
                                            style={{
                                                fontFamily: "'Cinzel', serif",
                                                fontSize: '0.7rem',
                                                letterSpacing: '0.3em',
                                                textTransform: 'uppercase',
                                                marginTop: 12,
                                            }}
                                        >
                                            Casa Del Sapere
                                        </div>
                                    </div>
                                </div>

                                {/* Orbiting icons */}
                                {[
                                    { Icon: Zap, angle: 0 },
                                    { Icon: Music, angle: 120 },
                                    { Icon: Beaker, angle: 240 },
                                ].map(({ Icon, angle }) => {
                                    const rad = ((angle - 90) * Math.PI) / 180;
                                    const r = 190;
                                    const x = Math.cos(rad) * r;
                                    const y = Math.sin(rad) * r;
                                    return (
                                        <div
                                            key={angle}
                                            style={{
                                                position: 'absolute',
                                                left: '50%',
                                                top: '50%',
                                                transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                                                width: 56,
                                                height: 56,
                                                background: '#0d1535',
                                                border: '1px solid #c9a84c55',
                                                borderRadius: '50%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <Icon size={24} color="#c9a84c" strokeWidth={1.5} />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </section>

                {/* COURSES */}
                <section className="px-4 md:px-8 py-16 md:py-24 relative">
                    <div className="divider-line mb-20" />

                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <p
                                style={{
                                    fontFamily: "'Lato', sans-serif",
                                    fontSize: '0.7rem',
                                    letterSpacing: '0.25em',
                                    textTransform: 'uppercase',
                                    color: '#c9a84c',
                                    marginBottom: 16,
                                }}
                            >
                                <span className="ornament">—</span> Our Programs <span className="ornament">—</span>
                            </p>
                            <h2 className="section-title gold-text" style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)' }}>
                                Curated Courses
                            </h2>
                            <p
                                style={{
                                    fontFamily: "'Lato', sans-serif",
                                    fontWeight: 300,
                                    color: '#64748b',
                                    maxWidth: 520,
                                    margin: '16px auto 0',
                                    lineHeight: 1.7,
                                    fontSize: '0.95rem',
                                }}
                            >
                                Each program is meticulously designed to challenge, inspire, and empower every student to
                                reach their highest potential.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-8">
                            {courses.map((course) => (
                                <div key={course.id} className="card-hover">
                                    <Card
                                        style={{
                                            background: `linear-gradient(145deg, #0d1535, #0a1628)`,
                                            border: `1px solid`,
                                            borderColor: '#c9a84c33',
                                            borderRadius: 0,
                                            overflow: 'hidden',
                                            boxShadow: '0 8px 40px rgba(0,0,0,0.4)',
                                        }}
                                    >
                                        {/* Top accent bar */}
                                        <div
                                            style={{
                                                height: 2,
                                                background: 'linear-gradient(90deg, #c9a84c, #e8c97a, #c9a84c)',
                                            }}
                                        />
                                        <CardContent className="p-8">
                                            <div className="flex items-start justify-between mb-6">
                                                <div
                                                    style={{
                                                        width: 60,
                                                        height: 60,
                                                        background: '#132045',
                                                        border: '1px solid #c9a84c44',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                    }}
                                                >
                                                    <course.icon size={28} color="#c9a84c" strokeWidth={1.5} />
                                                </div>
                                                <span
                                                    style={{
                                                        fontFamily: "'Lato', sans-serif",
                                                        fontSize: '0.6rem',
                                                        letterSpacing: '0.18em',
                                                        textTransform: 'uppercase',
                                                        color: '#c9a84c',
                                                        border: '1px solid #c9a84c44',
                                                        padding: '4px 10px',
                                                    }}
                                                >
                                                    {course.category}
                                                </span>
                                            </div>

                                            <h3
                                                style={{
                                                    fontFamily: "'Cinzel', serif",
                                                    fontWeight: 600,
                                                    fontSize: '1.25rem',
                                                    color: '#e2e8f0',
                                                    marginBottom: 12,
                                                    lineHeight: 1.3,
                                                }}
                                            >
                                                {course.title}
                                            </h3>

                                            <p
                                                style={{
                                                    fontFamily: "'Lato', sans-serif",
                                                    fontWeight: 300,
                                                    fontSize: '0.875rem',
                                                    color: '#64748b',
                                                    lineHeight: 1.7,
                                                    marginBottom: 24,
                                                }}
                                            >
                                                {course.description}
                                            </p>

                                            <div
                                                className="flex items-center justify-between"
                                                style={{
                                                    borderTop: '1px solid #c9a84c22',
                                                    paddingTop: 20,
                                                }}
                                            >
                                                <div>
                                                    <div
                                                        style={{
                                                            fontFamily: "'Lato', sans-serif",
                                                            fontSize: '0.7rem',
                                                            letterSpacing: '0.1em',
                                                            textTransform: 'uppercase',
                                                            color: '#c9a84c',
                                                        }}
                                                    >
                                                        {course.sessions}
                                                    </div>
                                                    <div
                                                        style={{
                                                            fontFamily: "'Lato', sans-serif",
                                                            fontSize: '0.65rem',
                                                            color: '#475569',
                                                            marginTop: 2,
                                                        }}
                                                    >
                                                        {course.level}
                                                    </div>
                                                </div>
                                                <Link href="/courses">
                                                    <Button
                                                        className="btn-outline-gold px-5 py-2 rounded-none h-auto"
                                                        style={{ fontSize: '0.65rem' }}
                                                    >
                                                        Learn More →
                                                    </Button>
                                                </Link>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="divider-line mt-20" />
                </section>

                {/* WHY US */}
                <section className="px-4 md:px-8 py-16 md:py-24">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid lg:grid-cols-2 gap-20 items-center">
                            <div className="text-center lg:text-left">
                                <p
                                    style={{
                                        fontFamily: "'Lato', sans-serif",
                                        fontSize: '0.7rem',
                                        letterSpacing: '0.25em',
                                        textTransform: 'uppercase',
                                        color: '#c9a84c',
                                        marginBottom: 16,
                                    }}
                                >
                                    Why Choose Us
                                </p>
                                <h2
                                    className="section-title"
                                    style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', color: '#e2e8f0', marginBottom: 24 }}
                                >
                                    Crafted for{' '}
                                    <span className="gold-text">Extraordinary</span>
                                    <br />
                                    Learners
                                </h2>
                                <p
                                    style={{
                                        fontFamily: "'Lato', sans-serif",
                                        fontWeight: 300,
                                        color: '#64748b',
                                        lineHeight: 1.8,
                                        fontSize: '0.95rem',
                                        marginBottom: 32,
                                    }}
                                >
                                    Casa Del Sapere — House of Knowledge — was built on the belief that every student
                                    deserves expert guidance, a nurturing environment, and courses that genuinely ignite
                                    their passion.
                                </p>

                                {[
                                    { label: 'Expert Instructors', desc: 'Industry professionals with deep domain expertise.' },
                                    { label: 'Small Class Sizes', desc: 'Maximum 10 students per session for personalized attention.' },
                                    { label: 'Proven Outcomes', desc: '98% of students report measurable skill improvement.' },
                                ].map((item) => (
                                    <div key={item.label} className="flex gap-4 mb-6 text-left max-w-md mx-auto lg:mx-0">
                                        <div
                                            style={{
                                                width: 8,
                                                minWidth: 8,
                                                height: 8,
                                                background: '#c9a84c',
                                                marginTop: 6,
                                                transform: 'rotate(45deg)',
                                            }}
                                        />
                                        <div>
                                            <div
                                                style={{
                                                    fontFamily: "'Cinzel', serif",
                                                    fontWeight: 600,
                                                    fontSize: '0.85rem',
                                                    color: '#e2e8f0',
                                                    marginBottom: 4,
                                                }}
                                            >
                                                {item.label}
                                            </div>
                                            <div
                                                style={{
                                                    fontFamily: "'Lato', sans-serif",
                                                    fontWeight: 300,
                                                    fontSize: '0.85rem',
                                                    color: '#64748b',
                                                }}
                                            >
                                                {item.desc}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Testimonial card */}
                            <div style={{ position: 'relative' }}>
                                <div
                                    style={{
                                        position: 'absolute',
                                        inset: -16,
                                        border: '1px solid #c9a84c22',
                                        pointerEvents: 'none',
                                    }}
                                />
                                <div
                                    style={{
                                        background: '#0d1535',
                                        border: '1px solid #c9a84c33',
                                        padding: 40,
                                    }}
                                >
                                    <div
                                        style={{
                                            fontFamily: "'Cormorant Garamond', serif",
                                            fontSize: '4rem',
                                            lineHeight: 1,
                                            color: '#c9a84c44',
                                            marginBottom: -8,
                                        }}
                                    >
                                        "
                                    </div>
                                    <p
                                        style={{
                                            fontFamily: "'Cormorant Garamond', serif",
                                            fontSize: '1.15rem',
                                            fontStyle: 'italic',
                                            color: '#cbd5e1',
                                            lineHeight: 1.75,
                                            marginBottom: 24,
                                        }}
                                    >
                                        The Robotics program changed everything for my son. Within three months, he built
                                        his first autonomous vehicle. Casa Del Sapere doesn't just teach — they transform.
                                    </p>
                                    <div style={{ borderTop: '1px solid #c9a84c22', paddingTop: 20 }}>
                                        <div
                                            style={{
                                                fontFamily: "'Cinzel', serif",
                                                fontSize: '0.8rem',
                                                color: '#c9a84c',
                                                fontWeight: 600,
                                            }}
                                        >
                                            Maria Santos
                                        </div>
                                        <div
                                            style={{
                                                fontFamily: "'Lato', sans-serif",
                                                fontSize: '0.7rem',
                                                letterSpacing: '0.1em',
                                                color: '#475569',
                                                marginTop: 4,
                                            }}
                                        >
                                            Parent · Robotics Program
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="px-4 md:px-8 py-16 md:py-24" style={{ background: 'rgba(201,168,76,0.04)' }}>
                    <div
                        className="max-w-4xl mx-auto text-center"
                        style={{ border: '1px solid #c9a84c33', position: 'relative' }}
                    >
                        <div className="px-5 py-10 md:px-12 md:py-16">
                        <div
                            className="geometric-accent"
                            style={{ width: 16, height: 16, top: -8, left: -8, borderColor: '#c9a84c' }}
                        />
                        <div
                            className="geometric-accent"
                            style={{ width: 16, height: 16, top: -8, right: -8, borderColor: '#c9a84c' }}
                        />
                        <div
                            className="geometric-accent"
                            style={{ width: 16, height: 16, bottom: -8, left: -8, borderColor: '#c9a84c' }}
                        />
                        <div
                            className="geometric-accent"
                            style={{ width: 16, height: 16, bottom: -8, right: -8, borderColor: '#c9a84c' }}
                        />

                        <p
                            style={{
                                fontFamily: "'Lato', sans-serif",
                                fontSize: '0.7rem',
                                letterSpacing: '0.25em',
                                textTransform: 'uppercase',
                                color: '#c9a84c',
                                marginBottom: 16,
                            }}
                        >
                            Begin Your Journey
                        </p>
                        <h2
                            className="section-title gold-text"
                            style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', marginBottom: 20 }}
                        >
                            Ready to Unlock Your Potential?
                        </h2>
                        <p
                            style={{
                                fontFamily: "'Lato', sans-serif",
                                fontWeight: 300,
                                color: '#64748b',
                                fontSize: '0.95rem',
                                lineHeight: 1.7,
                                marginBottom: 36,
                                maxWidth: 480,
                                margin: '0 auto 36px',
                            }}
                        >
                            Enrollment is now open for our upcoming semester. Spots are limited — reserve your place in
                            the program that will shape your future.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
                            <Link href="/enroll" className="w-full sm:w-auto">
                                <Button className="btn-gold px-8 md:px-10 py-3 rounded-none h-auto w-full sm:w-auto">Enroll Today</Button>
                            </Link>
                            <Link href="/contact" className="w-full sm:w-auto">
                                <Button className="btn-outline-gold px-8 md:px-10 py-3 rounded-none h-auto w-full sm:w-auto">Contact Us</Button>
                            </Link>
                        </div>
                        </div>
                    </div>
                </section>

                {/* FOOTER */}
                <Footer />
            </div>
        </>
    );
}
