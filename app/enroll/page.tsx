"use client";
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useState } from 'react';
import { Zap, Music, Beaker } from 'lucide-react';

const courses = [
    {
        id: 1,
        icon: Zap,
        category: 'Technology',
        title: 'Robotics Engineering',
        sessions: '7 Sessions',
        level: 'All Levels',
        price: '₱0.00',
    },
    {
        id: 2,
        icon: Music,
        category: 'Music & Arts',
        title: 'Guitar Masterclass',
        sessions: '7 Sessions',
        level: 'All Levels',
        price: '₱0.00',
    },
    {
        id: 3,
        icon: Beaker,
        category: 'Science',
        title: 'Science Investigatory Projects',
        sessions: '7 Sessions',
        level: 'All Levels',
        price: '₱0.00',
    },
];

export default function EnrollPage() {
    const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission
        console.log('Form submitted:', { ...formData, selectedCourse });
    };

    return (
        <>
            <div className="min-h-screen bg-casa-gradient"
                style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                }}
            >
                <Header />

                {/* HERO SECTION */}
                <section className="relative px-4 md:px-8 py-16 md:py-24 overflow-hidden">
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
                        <div
                            className="flex items-center justify-center gap-3 mb-8"
                            style={{
                                fontFamily: "'Lato', sans-serif",
                                fontSize: '0.7rem',
                                letterSpacing: '0.25em',
                                textTransform: 'uppercase',
                                color: '#c9a84c',
                            }}
                        >
                            <div style={{ width: 32, height: 1, background: '#c9a84c' }} />
                            Begin Your Journey
                            <div style={{ width: 32, height: 1, background: '#c9a84c' }} />
                        </div>

                        <h1 className="hero-title gold-text mb-6" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}>
                            Unlock Your Potential
                        </h1>

                        <p
                            style={{
                                fontFamily: "'Lato', sans-serif",
                                fontWeight: 300,
                                fontSize: '1.05rem',
                                lineHeight: 1.8,
                                color: '#94a3b8',
                                maxWidth: 500,
                                margin: '0 auto',
                            }}
                        >
                            Choose your course and start your learning journey today. Limited spots available for our upcoming semester.
                        </p>
                    </div>
                </section>

                <div className="divider-line" style={{ margin: '0 auto', maxWidth: '90%' }} />

                {/* ENROLLMENT FORM */}
                <section className="px-8 py-24">
                    <div className="max-w-5xl mx-auto">
                        <div className="grid lg:grid-cols-3 gap-8 mb-20">
                            {courses.map((course) => (
                                <div
                                    key={course.id}
                                    onClick={() => setSelectedCourse(course.id)}
                                    className="cursor-pointer card-hover"
                                    style={{
                                        opacity: selectedCourse === null || selectedCourse === course.id ? 1 : 0.5,
                                        transition: 'opacity 0.3s ease',
                                    }}
                                >
                                    <Card
                                        style={{
                                            background: selectedCourse === course.id
                                                ? 'linear-gradient(145deg, #132045, #0d1535)'
                                                : 'linear-gradient(145deg, #0d1535, #0a1628)',
                                            border: `2px solid ${selectedCourse === course.id ? '#c9a84c' : '#c9a84c33'}`,
                                            borderRadius: 0,
                                            overflow: 'hidden',
                                            boxShadow: selectedCourse === course.id
                                                ? '0 8px 40px rgba(201, 168, 76, 0.15)'
                                                : '0 8px 40px rgba(0,0,0,0.4)',
                                        }}
                                    >
                                        <div
                                            style={{
                                                height: 2,
                                                background: 'linear-gradient(90deg, #c9a84c, #e8c97a, #c9a84c)',
                                            }}
                                        />
                                        <CardContent className="pt-8 pb-8">
                                            <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'center' }}>
                                                <course.icon size={48} color="#c9a84c" strokeWidth={1.5} />
                                            </div>
                                            <div
                                                style={{
                                                    fontFamily: "'Lato', sans-serif",
                                                    fontSize: '0.65rem',
                                                    letterSpacing: '0.15em',
                                                    color: '#64748b',
                                                    textTransform: 'uppercase',
                                                    marginBottom: 8,
                                                }}
                                            >
                                                {course.category}
                                            </div>
                                            <h3
                                                className="gold-text"
                                                style={{
                                                    fontFamily: "'Cinzel', serif",
                                                    fontWeight: 600,
                                                    fontSize: '1.3rem',
                                                    marginBottom: 12,
                                                    lineHeight: 1.3,
                                                }}
                                            >
                                                {course.title}
                                            </h3>
                                            <div style={{ marginBottom: 16 }}>
                                                <div
                                                    style={{
                                                        fontFamily: "'Lato', sans-serif",
                                                        fontSize: '0.85rem',
                                                        color: '#94a3b8',
                                                        marginBottom: 6,
                                                    }}
                                                >
                                                    {course.sessions} • {course.level}
                                                </div>
                                            </div>
                                            <div
                                                className="gold-text"
                                                style={{
                                                    fontFamily: "'Cinzel', serif",
                                                    fontWeight: 700,
                                                    fontSize: '1.8rem',
                                                }}
                                            >
                                                {course.price}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            ))}
                        </div>

                        {selectedCourse && (
                            <div
                                style={{
                                    background: 'linear-gradient(145deg, #0d1535, #0a1628)',
                                    border: '1px solid #c9a84c44',
                                    padding: 40,
                                }}
                            >
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
                                    Your Information
                                </p>
                                <h2 className="section-title gold-text mb-8" style={{ fontSize: '1.8rem' }}>
                                    Complete Your Enrollment
                                </h2>

                                <form onSubmit={handleSubmit}>
                                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                                        <div>
                                            <label
                                                style={{
                                                    fontFamily: "'Lato', sans-serif",
                                                    fontSize: '0.85rem',
                                                    color: '#c9a84c99',
                                                    display: 'block',
                                                    marginBottom: 8,
                                                }}
                                            >
                                                First Name
                                            </label>
                                            <input
                                                type="text"
                                                name="firstName"
                                                value={formData.firstName}
                                                onChange={handleInputChange}
                                                required
                                                style={{
                                                    width: '100%',
                                                    padding: '12px 16px',
                                                    background: 'rgba(201, 168, 76, 0.05)',
                                                    border: '1px solid #c9a84c44',
                                                    color: '#e2e8f0',
                                                    fontFamily: "'Lato', sans-serif",
                                                    fontSize: '1rem',
                                                    outline: 'none',
                                                    transition: 'all 0.3s ease',
                                                }}
                                                onFocus={(e) => {
                                                    e.currentTarget.style.borderColor = '#c9a84c';
                                                    e.currentTarget.style.background = 'rgba(201, 168, 76, 0.1)';
                                                }}
                                                onBlur={(e) => {
                                                    e.currentTarget.style.borderColor = '#c9a84c44';
                                                    e.currentTarget.style.background = 'rgba(201, 168, 76, 0.05)';
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <label
                                                style={{
                                                    fontFamily: "'Lato', sans-serif",
                                                    fontSize: '0.85rem',
                                                    color: '#c9a84c99',
                                                    display: 'block',
                                                    marginBottom: 8,
                                                }}
                                            >
                                                Last Name
                                            </label>
                                            <input
                                                type="text"
                                                name="lastName"
                                                value={formData.lastName}
                                                onChange={handleInputChange}
                                                required
                                                style={{
                                                    width: '100%',
                                                    padding: '12px 16px',
                                                    background: 'rgba(201, 168, 76, 0.05)',
                                                    border: '1px solid #c9a84c44',
                                                    color: '#e2e8f0',
                                                    fontFamily: "'Lato', sans-serif",
                                                    fontSize: '1rem',
                                                    outline: 'none',
                                                    transition: 'all 0.3s ease',
                                                }}
                                                onFocus={(e) => {
                                                    e.currentTarget.style.borderColor = '#c9a84c';
                                                    e.currentTarget.style.background = 'rgba(201, 168, 76, 0.1)';
                                                }}
                                                onBlur={(e) => {
                                                    e.currentTarget.style.borderColor = '#c9a84c44';
                                                    e.currentTarget.style.background = 'rgba(201, 168, 76, 0.05)';
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                                        <div>
                                            <label
                                                style={{
                                                    fontFamily: "'Lato', sans-serif",
                                                    fontSize: '0.85rem',
                                                    color: '#c9a84c99',
                                                    display: 'block',
                                                    marginBottom: 8,
                                                }}
                                            >
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                required
                                                style={{
                                                    width: '100%',
                                                    padding: '12px 16px',
                                                    background: 'rgba(201, 168, 76, 0.05)',
                                                    border: '1px solid #c9a84c44',
                                                    color: '#e2e8f0',
                                                    fontFamily: "'Lato', sans-serif",
                                                    fontSize: '1rem',
                                                    outline: 'none',
                                                    transition: 'all 0.3s ease',
                                                }}
                                                onFocus={(e) => {
                                                    e.currentTarget.style.borderColor = '#c9a84c';
                                                    e.currentTarget.style.background = 'rgba(201, 168, 76, 0.1)';
                                                }}
                                                onBlur={(e) => {
                                                    e.currentTarget.style.borderColor = '#c9a84c44';
                                                    e.currentTarget.style.background = 'rgba(201, 168, 76, 0.05)';
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <label
                                                style={{
                                                    fontFamily: "'Lato', sans-serif",
                                                    fontSize: '0.85rem',
                                                    color: '#c9a84c99',
                                                    display: 'block',
                                                    marginBottom: 8,
                                                }}
                                            >
                                                Phone Number
                                            </label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                required
                                                style={{
                                                    width: '100%',
                                                    padding: '12px 16px',
                                                    background: 'rgba(201, 168, 76, 0.05)',
                                                    border: '1px solid #c9a84c44',
                                                    color: '#e2e8f0',
                                                    fontFamily: "'Lato', sans-serif",
                                                    fontSize: '1rem',
                                                    outline: 'none',
                                                    transition: 'all 0.3s ease',
                                                }}
                                                onFocus={(e) => {
                                                    e.currentTarget.style.borderColor = '#c9a84c';
                                                    e.currentTarget.style.background = 'rgba(201, 168, 76, 0.1)';
                                                }}
                                                onBlur={(e) => {
                                                    e.currentTarget.style.borderColor = '#c9a84c44';
                                                    e.currentTarget.style.background = 'rgba(201, 168, 76, 0.05)';
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <Button type="submit" className="btn-gold px-10 py-3 rounded-none h-auto">
                                            Enroll Now
                                        </Button>
                                        <Button
                                            type="button"
                                            className="btn-outline-gold px-10 py-3 rounded-none h-auto"
                                            onClick={() => setSelectedCourse(null)}
                                        >
                                            Clear Selection
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {!selectedCourse && (
                            <div
                                style={{
                                    textAlign: 'center',
                                    padding: 40,
                                }}
                            >
                                <p
                                    style={{
                                        fontFamily: "'Lato', sans-serif",
                                        fontSize: '1rem',
                                        color: '#64748b',
                                    }}
                                >
                                    Select a course above to continue with enrollment
                                </p>
                            </div>
                        )}
                    </div>
                </section>

                <div className="divider-line" style={{ margin: '0 auto', maxWidth: '90%' }} />

                <Footer />
            </div>
        </>
    );
}
