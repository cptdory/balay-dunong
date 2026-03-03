import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Users, Music, BookOpen, Zap, Trophy } from 'lucide-react';

const testimonials = [
    {
        id: 1,
        name: 'Maria Santos',
        role: 'Parent · Robotics Program',
        content: 'The Robotics program changed everything for my son. Within three months, he built his first autonomous vehicle. Casa Del Sapere doesn\'t just teach — they transform lives.',
        rating: 5,
        icon: Users,
    },
    {
        id: 2,
        name: 'Alex Thompson',
        role: 'Student · Guitar Masterclass',
        content: 'Sofia is an incredible instructor. She took me from complete beginner to confidently performing in front of an audience. The patience and expertise here is unmatched.',
        rating: 5,
        icon: Music,
    },
    {
        id: 3,
        name: 'Dr. Patricia Lee',
        role: 'Teacher · Science Program',
        content: 'As an educator myself, I\'m impressed by the structure and depth of the Science Investigatory Projects course. My students have shown remarkable growth in critical thinking.',
        rating: 5,
        icon: BookOpen,
    },
    {
        id: 4,
        name: 'James Rivera',
        role: 'Student · Robotics Engineering',
        content: 'Dr. Rivera\'s passion for robotics is infectious. The hands-on approach and real-world projects made learning engaging and practical. Best investment in my education.',
        rating: 5,
        icon: Zap,
    },
    {
        id: 5,
        name: 'Emma Wilson',
        role: 'Parent · Music Program',
        content: 'My daughter discovered her love for music here. The supportive environment and expert guidance from Sofia have boosted her confidence tremendously.',
        rating: 5,
        icon: Music,
    },
    {
        id: 6,
        name: 'Michael Chen',
        role: 'Student · Science Projects',
        content: 'The science fair preparation was outstanding. I won regional recognition thanks to the mentorship and support from Dr. Chen. Casa Del Sapere truly invests in student success.',
        rating: 5,
        icon: Trophy,
    },
];

const stats = [
    { value: '500+', label: 'Students Transformed' },
    { value: '98%', label: 'Satisfaction Rate' },
    { value: '50+', label: '5-Star Reviews' },
    { value: '15+', label: 'Expert Instructors' },
];

export default function TestimonialsPage() {
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
                            Success Stories
                            <div className="gold-divider" />
                        </div>

                        <h1 className="hero-title gold-text mb-6" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}>
                            Hear From Our Students
                        </h1>

                        <p className="text-subtitle max-w-2xl mx-auto">
                            Real stories from real learners. Discover how Casa Del Sapere has inspired, challenged, and transformed our community.
                        </p>
                    </div>
                </section>

                <div className="divider-line" style={{ margin: '0 auto', maxWidth: '90%' }} />

                {/* STATS SECTION */}
                <section className="px-8 py-16">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                            {stats.map((stat) => (
                                <div key={stat.label} className="text-center">
                                    <div
                                        className="gold-text"
                                        style={{
                                            fontFamily: "'Cinzel', serif",
                                            fontWeight: 700,
                                            fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
                                        }}
                                    >
                                        {stat.value}
                                    </div>
                                    <div
                                        style={{
                                            fontFamily: "'Lato', sans-serif",
                                            fontWeight: 300,
                                            fontSize: '0.75rem',
                                            letterSpacing: '0.1em',
                                            textTransform: 'uppercase',
                                            color: '#64748b',
                                            marginTop: 8,
                                            lineHeight: 1.5,
                                        }}
                                    >
                                        {stat.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <div className="divider-line" style={{ margin: '0 auto', maxWidth: '90%' }} />

                {/* TESTIMONIALS SECTION */}
                <section className="px-8 py-24">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid lg:grid-cols-2 gap-8">
                            {testimonials.map((testimonial) => (
                                <div key={testimonial.id} className="card-hover">
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
                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                                    <testimonial.icon size={32} color="#c9a84c" strokeWidth={1.5} />
                                                </div>
                                                <div className="flex gap-1">
                                                    {[...Array(testimonial.rating)].map((_, i) => (
                                                        <span key={i} style={{ fontSize: '1.2rem', color: '#c9a84c' }}>★</span>
                                                    ))}
                                                </div>
                                            </div>

                                            <p
                                                style={{
                                                    fontFamily: "'Cormorant Garamond', serif",
                                                    fontStyle: 'italic',
                                                    fontSize: '1.05rem',
                                                    color: '#cbd5e1',
                                                    lineHeight: 1.8,
                                                    marginBottom: 24,
                                                }}
                                            >
                                                "{testimonial.content}"
                                            </p>

                                            <div
                                                style={{
                                                    borderTop: '1px solid #c9a84c22',
                                                    paddingTop: 20,
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        fontFamily: "'Cinzel', serif",
                                                        fontSize: '0.9rem',
                                                        color: '#c9a84c',
                                                        fontWeight: 600,
                                                        marginBottom: 4,
                                                    }}
                                                >
                                                    {testimonial.name}
                                                </div>
                                                <div
                                                    style={{
                                                        fontFamily: "'Lato', sans-serif",
                                                        fontSize: '0.7rem',
                                                        letterSpacing: '0.1em',
                                                        color: '#475569',
                                                        textTransform: 'uppercase',
                                                    }}
                                                >
                                                    {testimonial.role}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <div className="divider-line" style={{ margin: '0 auto', maxWidth: '90%' }} />

                {/* FEATURED TESTIMONIAL */}
                <section className="px-8 py-24" style={{ background: 'rgba(201,168,76,0.04)' }}>
                    <div className="max-w-4xl mx-auto">
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
                                    padding: 60,
                                    textAlign: 'center',
                                }}
                            >
                                <div
                                    style={{
                                        fontFamily: "'Cormorant Garamond', serif",
                                        fontSize: '5rem',
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
                                        fontSize: '1.3rem',
                                        fontStyle: 'italic',
                                        color: '#cbd5e1',
                                        lineHeight: 1.9,
                                        marginBottom: 32,
                                    }}
                                >
                                    Casa Del Sapere isn't just a tutorial center — it's a launchpad for dreams. The instructors care deeply about student success, and it shows in every interaction. I've grown as a learner and as a person here.
                                </p>
                                <div style={{ borderTop: '1px solid #c9a84c22', paddingTop: 30 }}>
                                    <div
                                        style={{
                                            fontFamily: "'Cinzel', serif",
                                            fontSize: '1rem',
                                            color: '#c9a84c',
                                            fontWeight: 600,
                                            marginBottom: 8,
                                        }}
                                    >
                                        Rachel Johnson
                                    </div>
                                    <div
                                        style={{
                                            fontFamily: "'Lato', sans-serif",
                                            fontSize: '0.75rem',
                                            letterSpacing: '0.15em',
                                            color: '#475569',
                                            textTransform: 'uppercase',
                                        }}
                                    >
                                        Student · Multiple Programs
                                    </div>
                                    <div
                                        className="flex gap-1 justify-center"
                                        style={{ marginTop: 12 }}
                                    >
                                        {[...Array(5)].map((_, i) => (
                                            <span key={i} style={{ fontSize: '1.2rem', color: '#c9a84c' }}>★</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="divider-line" style={{ margin: '0 auto', maxWidth: '90%' }} />

                {/* IMPACT SECTION */}
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
                                <span className="ornament">—</span> Our Impact <span className="ornament">—</span>
                            </p>
                            <h2 className="section-title gold-text" style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)' }}>
                                Transforming Lives Through Education
                            </h2>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {[
                                {
                                    title: 'Science Fair Winners',
                                    content: '12 students have won regional and national science fair competitions with projects developed in our courses.',
                                    icon: '🏆',
                                },
                                {
                                    title: 'Career Advancement',
                                    content: 'Over 85% of students report improved career prospects or successfully pursued new career paths after our programs.',
                                    icon: '📈',
                                },
                                {
                                    title: 'Creative Confidence',
                                    content: 'Students consistently report increased confidence in their abilities to learn, create, and innovate.',
                                    icon: '⭐',
                                },
                            ].map((impact, idx) => (
                                <div key={idx} className="text-center">
                                    <div style={{ fontSize: '3rem', marginBottom: 16 }}>{impact.icon}</div>
                                    <h3
                                        style={{
                                            fontFamily: "'Cinzel', serif",
                                            fontWeight: 600,
                                            fontSize: '1.2rem',
                                            color: '#e2e8f0',
                                            marginBottom: 12,
                                        }}
                                    >
                                        {impact.title}
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
                                        {impact.content}
                                    </p>
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
                            Your Story Starts Here
                        </p>
                        <h2
                            className="section-title gold-text"
                            style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', marginBottom: 20 }}
                        >
                            Ready to Write Your Success Story?
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
                            Join hundreds of students who have already transformed their lives through Casa Del Sapere. Your journey awaits.
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
