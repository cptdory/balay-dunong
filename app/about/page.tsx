import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { User, Music, Beaker } from 'lucide-react';

const team = [
    {
        id: 1,
        name: 'Juan Dela Cruz',
        title: 'Robotics Instructor',
        bio: 'Ph.D. in Robotics Engineering with 15+ years of industry experience.',
        icon: User,
    },
    {
        id: 2,
        name: 'Juan Dela Cruz',
        title: 'Music Instructor',
        bio: 'Award-winning guitarist and music educator with international performance experience.',
        icon: Music,
    },
    {
        id: 3,
        name: 'Juan Dela Cruz',
        title: 'Science Instructor',
        bio: 'Molecular biologist with passion for mentoring the next generation of scientists.',
        icon: Beaker,
    },
];

const values = [
    {
        title: 'Excellence',
        description: 'We maintain the highest standards in education and training, ensuring every program exceeds expectations.',
    },
    {
        title: 'Innovation',
        description: 'Constant evolution of our curriculum to reflect industry trends and emerging technologies.',
    },
    {
        title: 'Inclusivity',
        description: 'Creating welcoming spaces for learners of all backgrounds and skill levels.',
    },
    {
        title: 'Mentorship',
        description: 'Building meaningful relationships between instructors and students for personalized growth.',
    },
];

export default function AboutPage() {
    return (
        <>
            <div className="min-h-screen bg-casa-gradient"
                style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                }}
            >
                <Header />

                {/* HERO SECTION */}
                <section className="relative px-8 py-24 overflow-hidden">
                    {/* Star background */}
                    <div className="star-bg">
                        {[...Array(40)].map((_, i) => (
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

                    <div className="max-w-4xl mx-auto text-center">
                        <div className="subtitle mb-8 justify-center">
                            <div className="gold-divider" />
                            Our Story
                            <div className="gold-divider" />
                        </div>

                        <h1 className="hero-title gold-text mb-6" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}>
                            About Casa Del Sapere
                        </h1>

                        <p className="text-subtitle max-w-2xl mx-auto">
                            Founded in 2026, Casa Del Sapere — the House of Knowledge — has been transforming lives through education, innovation, and mentorship.
                        </p>
                    </div>
                </section>

                <div className="divider-line" style={{ margin: '0 auto', maxWidth: '90%' }} />

                {/* MISSION SECTION */}
                <section className="px-8 py-24">
                    <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
                        <div>
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
                                Our Mission
                            </p>
                            <h2
                                className="section-title"
                                style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', color: '#e2e8f0', marginBottom: 24 }}
                            >
                                Empowering the <span className="gold-text">Next Generation</span> of Learners
                            </h2>
                            <p
                                style={{
                                    fontFamily: "'Lato', sans-serif",
                                    fontWeight: 300,
                                    color: '#64748b',
                                    lineHeight: 1.8,
                                    fontSize: '0.95rem',
                                    marginBottom: 24,
                                }}
                            >
                                At Casa Del Sapere, we believe that education transcends the classroom. We're committed to fostering curiosity, creativity, and critical thinking in every student. Our mission is simple: to provide world-class instruction that transforms dreams into achievements.
                            </p>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <div
                                        className="gold-text"
                                        style={{
                                            fontFamily: "'Cinzel', serif",
                                            fontWeight: 700,
                                            fontSize: '2rem',
                                        }}
                                    >
                                        98%
                                    </div>
                                    <div
                                        style={{
                                            fontFamily: "'Lato', sans-serif",
                                            fontWeight: 300,
                                            fontSize: '0.75rem',
                                            letterSpacing: '0.1em',
                                            textTransform: 'uppercase',
                                            color: '#64748b',
                                            marginTop: 4,
                                        }}
                                    >
                                        Satisfaction Rate
                                    </div>
                                </div>
                                <div>
                                    <div
                                        className="gold-text"
                                        style={{
                                            fontFamily: "'Cinzel', serif",
                                            fontWeight: 700,
                                            fontSize: '2rem',
                                        }}
                                    >
                                        500+
                                    </div>
                                    <div
                                        style={{
                                            fontFamily: "'Lato', sans-serif",
                                            fontWeight: 300,
                                            fontSize: '0.75rem',
                                            letterSpacing: '0.1em',
                                            textTransform: 'uppercase',
                                            color: '#64748b',
                                            marginTop: 4,
                                        }}
                                    >
                                        Students Served
                                    </div>
                                </div>
                            </div>
                        </div>

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
                                        fontFamily: "'Lato', sans-serif",
                                        fontWeight: 300,
                                        fontSize: '1rem',
                                        color: '#cbd5e1',
                                        lineHeight: 1.8,
                                    }}
                                >
                                    <p style={{ marginBottom: 16 }}>
                                        Casa Del Sapere was born from a simple belief: <span className="gold-text">every student deserves excellence</span>.
                                    </p>
                                    <p>
                                        Our founders created this space to bridge the gap between passion and expertise, offering immersive learning experiences that go beyond traditional education. Today, we're proud to be a beacon of knowledge and innovation for hundreds of students.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="divider-line" style={{ margin: '0 auto', maxWidth: '90%' }} />

                {/* VALUES SECTION */}
                <section className="px-8 py-24">
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
                                <span className="ornament">—</span> Our Values <span className="ornament">—</span>
                            </p>
                            <h2 className="section-title gold-text" style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)' }}>
                                What We Stand For
                            </h2>
                        </div>

                        <div className="grid lg:grid-cols-2 gap-8">
                            {values.map((value, idx) => (
                                <div key={idx} className="flex gap-6">
                                    <div
                                        style={{
                                            width: 12,
                                            minWidth: 12,
                                            height: 12,
                                            background: '#c9a84c',
                                            marginTop: 8,
                                            transform: 'rotate(45deg)',
                                        }}
                                    />
                                    <div>
                                        <h3
                                            style={{
                                                fontFamily: "'Cinzel', serif",
                                                fontWeight: 600,
                                                fontSize: '1.2rem',
                                                color: '#e2e8f0',
                                                marginBottom: 8,
                                            }}
                                        >
                                            {value.title}
                                        </h3>
                                        <p
                                            style={{
                                                fontFamily: "'Lato', sans-serif",
                                                fontWeight: 300,
                                                fontSize: '0.9rem',
                                                color: '#64748b',
                                                lineHeight: 1.7,
                                            }}
                                        >
                                            {value.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <div className="divider-line" style={{ margin: '0 auto', maxWidth: '90%' }} />

                {/* TEAM SECTION */}
                <section className="px-4 md:px-8 py-16 md:py-24">
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
                                <span className="ornament">—</span> Our Faculty <span className="ornament">—</span>
                            </p>
                            <h2 className="section-title gold-text" style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)' }}>
                                Meet Our Instructors
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
                                Experienced professionals dedicated to your success
                            </p>
                        </div>

                        <div className="grid lg:grid-cols-3 gap-8">
                            {team.map((member) => (
                                <div key={member.id} className="card-hover">
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
                                        <CardContent className="p-8 text-center">
                                            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'center' }}>
                                                <member.icon size={48} color="#c9a84c" strokeWidth={1.5} />
                                            </div>

                                            <h3
                                                style={{
                                                    fontFamily: "'Cinzel', serif",
                                                    fontWeight: 600,
                                                    fontSize: '1.25rem',
                                                    color: '#e2e8f0',
                                                    marginBottom: 4,
                                                    lineHeight: 1.3,
                                                }}
                                            >
                                                {member.name}
                                            </h3>

                                            <div
                                                className="gold-text"
                                                style={{
                                                    fontFamily: "'Lato', sans-serif",
                                                    fontSize: '0.7rem',
                                                    letterSpacing: '0.1em',
                                                    textTransform: 'uppercase',
                                                    marginBottom: 12,
                                                }}
                                            >
                                                {member.title}
                                            </div>

                                            <p
                                                style={{
                                                    fontFamily: "'Lato', sans-serif",
                                                    fontWeight: 300,
                                                    fontSize: '0.875rem',
                                                    color: '#64748b',
                                                    lineHeight: 1.7,
                                                }}
                                            >
                                                {member.bio}
                                            </p>
                                        </CardContent>
                                    </Card>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <div className="divider-line" style={{ margin: '0 auto', maxWidth: '90%' }} />

                {/* CTA */}
                <section className="px-8 py-24" style={{ background: 'rgba(201,168,76,0.04)' }}>
                    <div
                        className="max-w-4xl mx-auto text-center"
                        style={{ border: '1px solid #c9a84c33', padding: '64px 48px', position: 'relative' }}
                    >
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
                            Join Our Community
                        </p>
                        <h2
                            className="section-title gold-text"
                            style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', marginBottom: 20 }}
                        >
                            Be Part of the Casa Del Sapere Family
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
                            Whether you're seeking knowledge, mentorship, or transformation, Casa Del Sapere welcomes you. Start your journey today.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
                            <Link href="/courses">
                                <Button className="btn-gold px-8 md:px-10 py-3 rounded-none h-auto w-full sm:w-auto">Explore Courses</Button>
                            </Link>
                            <Link href="/contact">
                                <Button className="btn-outline-gold px-8 md:px-10 py-3 rounded-none h-auto w-full sm:w-auto">Contact Us</Button>
                            </Link>
                        </div>
                    </div>
                </section>

                <Footer />
            </div>
        </>
    );
}
