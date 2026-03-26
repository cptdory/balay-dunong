"use client";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useState, useMemo } from 'react';
import { Zap, Music, Beaker } from 'lucide-react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

const categoryIcons: Record<string, any> = {
  'Technology': Zap,
  'Music & Arts': Music,
  'Science': Beaker,
  'Programming': Zap,
  'Arts': Music,
};

export default function CoursesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);
  
  // Fetch courses from database
  const coursesData = useQuery(api._courses.getAllCourses);
  
  const courses = useMemo(() => {
    return (coursesData || []).map((course: any) => ({
      id: course._id,
      icon: categoryIcons[course.category] || Zap,
      category: course.category,
      title: course.name,
      description: course.description,
      fullDescription: course.description, // Use description as fallback
      instructor: 'TBA',
      sessions: `${Math.ceil(parseInt(course.duration) / 7)} Sessions` || '7 Sessions',
      duration: course.duration,
      level: course.level,
      schedule: 'Schedule TBA',
      price: `₱${course.price.toFixed(2)}`,
      maxStudents: 20,
      thumbnail: course.thumbnail,
    }));
  }, [coursesData]);

  const categories = useMemo(() => {
    const cats = new Set(courses.map(c => c.category));
    return Array.from(cats);
  }, [courses]);

    const filteredCourses = selectedCategory
        ? courses.filter(course => course.category === selectedCategory)
        : courses;

    return (
        <>
            <div className="min-h-screen bg-casa-gradient"
                style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                }}
            >
                <Header />

                {/* HERO SECTION */}
                <section className="relative px-4 md:px-8 py-16 md:py-20 overflow-hidden">

                    <div className="max-w-4xl mx-auto text-center">
                        <div className="subtitle mb-8 justify-center">
                            <div className="gold-divider" />
                            Our Programs
                            <div className="gold-divider" />
                        </div>

                        <h1 className="hero-title gold-text mb-6" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}>
                            Explore Our Courses
                        </h1>

                        <p className="text-subtitle max-w-2xl mx-auto">
                            Discover world-class courses in technology, arts, music, languages, and science. Expert instruction with hands-on learning experiences.
                        </p>
                    </div>
                </section>

                <div className="divider-line" style={{ margin: '20px auto', maxWidth: '90%' }} />

                {/* FILTERS */}
                <section className="px-8 py-16">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-wrap items-center justify-center gap-4">
                            <button
                                onClick={() => setSelectedCategory(null)}
                                style={{
                                    padding: '10px 20px',
                                    background: selectedCategory === null ? '#c9a84c' : 'transparent',
                                    color: selectedCategory === null ? '#0a0f1e' : '#c9a84c',
                                    border: `1px solid ${selectedCategory === null ? '#c9a84c' : '#c9a84c66'}`,
                                    fontFamily: "'Cinzel', serif",
                                    fontWeight: 600,
                                    fontSize: '0.75rem',
                                    letterSpacing: '0.1em',
                                    textTransform: 'uppercase',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                }}
                                onMouseEnter={(e) => {
                                    if (selectedCategory !== null) {
                                        e.currentTarget.style.background = '#c9a84c11';
                                        e.currentTarget.style.borderColor = '#c9a84c';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (selectedCategory !== null) {
                                        e.currentTarget.style.background = 'transparent';
                                        e.currentTarget.style.borderColor = '#c9a84c66';
                                    }
                                }}
                            >
                                All Courses
                            </button>

                            {categories.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => setSelectedCategory(category)}
                                    style={{
                                        padding: '10px 20px',
                                        background: selectedCategory === category ? '#c9a84c' : 'transparent',
                                        color: selectedCategory === category ? '#0a0f1e' : '#c9a84c',
                                        border: `1px solid ${selectedCategory === category ? '#c9a84c' : '#c9a84c66'}`,
                                        fontFamily: "'Cinzel', serif",
                                        fontWeight: 600,
                                        fontSize: '0.75rem',
                                        letterSpacing: '0.1em',
                                        textTransform: 'uppercase',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                    }}
                                    onMouseEnter={(e) => {
                                        if (selectedCategory !== category) {
                                            e.currentTarget.style.background = '#c9a84c11';
                                            e.currentTarget.style.borderColor = '#c9a84c';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (selectedCategory !== category) {
                                            e.currentTarget.style.background = 'transparent';
                                            e.currentTarget.style.borderColor = '#c9a84c66';
                                        }
                                    }}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>
                </section>

                <div className="divider-line" style={{ margin: '20px auto', maxWidth: '90%' }} />

                {/* COURSES GRID */}
                <section className="px-8 py-24">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                            {filteredCourses.map((course) => (
                                <div
                                    key={course.id}
                                    onClick={() => setExpandedCourse(expandedCourse === course.id ? null : course.id)}
                                    className="cursor-pointer card-hover"
                                >
                                    <Card
                                        style={{
                                            background: expandedCourse === course.id
                                                ? 'linear-gradient(145deg, #132045, #0d1535)'
                                                : 'linear-gradient(145deg, #0d1535, #0a1628)',
                                            border: `1px solid ${expandedCourse === course.id ? '#c9a84c' : '#c9a84c33'}`,
                                            borderRadius: 0,
                                            overflow: 'hidden',
                                            boxShadow: expandedCourse === course.id
                                                ? '0 8px 40px rgba(201, 168, 76, 0.15)'
                                                : '0 8px 40px rgba(0,0,0,0.4)',
                                            transition: 'all 0.3s ease',
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
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        alignItems: 'flex-end',
                                                        gap: 8,
                                                    }}
                                                >
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
                                                        {course.level}
                                                    </span>
                                                </div>
                                            </div>

                                            <h3
                                                style={{
                                                    fontFamily: "'Cinzel', serif",
                                                    fontWeight: 600,
                                                    fontSize: '1.4rem',
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
                                                    marginBottom: expandedCourse === course.id ? 20 : 0,
                                                    maxHeight: expandedCourse === course.id ? '500px' : '0px',
                                                    overflow: 'hidden',
                                                    transition: 'all 0.3s ease',
                                                }}
                                            >
                                                {course.description}
                                            </p>

                                            {expandedCourse === course.id && (
                                                <div
                                                    style={{
                                                        marginBottom: 20,
                                                        paddingBottom: 20,
                                                        borderBottom: '1px solid #c9a84c22',
                                                    }}
                                                >
                                                    <p
                                                        style={{
                                                            fontFamily: "'Lato', sans-serif",
                                                            fontWeight: 300,
                                                            fontSize: '0.875rem',
                                                            color: '#cbd5e1',
                                                            lineHeight: 1.7,
                                                            marginBottom: 16,
                                                        }}
                                                    >
                                                        {course.fullDescription}
                                                    </p>

                                                    <div
                                                        style={{
                                                            display: 'grid',
                                                            gridTemplateColumns: '1fr 1fr',
                                                            gap: 12,
                                                        }}
                                                    >
                                                        <div>
                                                            <div
                                                                style={{
                                                                    fontFamily: "'Lato', sans-serif",
                                                                    fontSize: '0.65rem',
                                                                    letterSpacing: '0.1em',
                                                                    textTransform: 'uppercase',
                                                                    color: '#c9a84c',
                                                                    marginBottom: 4,
                                                                }}
                                                            >
                                                                Instructor
                                                            </div>
                                                            <div
                                                                style={{
                                                                    fontFamily: "'Cinzel', serif",
                                                                    fontSize: '0.85rem',
                                                                    color: '#e2e8f0',
                                                                }}
                                                            >
                                                                {course.instructor}
                                                            </div>
                                                        </div>

                                                        <div>
                                                            <div
                                                                style={{
                                                                    fontFamily: "'Lato', sans-serif",
                                                                    fontSize: '0.65rem',
                                                                    letterSpacing: '0.1em',
                                                                    textTransform: 'uppercase',
                                                                    color: '#c9a84c',
                                                                    marginBottom: 4,
                                                                }}
                                                            >
                                                                Duration
                                                            </div>
                                                            <div
                                                                style={{
                                                                    fontFamily: "'Cinzel', serif",
                                                                    fontSize: '0.85rem',
                                                                    color: '#e2e8f0',
                                                                }}
                                                            >
                                                                {course.duration}
                                                            </div>
                                                        </div>

                                                        <div>
                                                            <div
                                                                style={{
                                                                    fontFamily: "'Lato', sans-serif",
                                                                    fontSize: '0.65rem',
                                                                    letterSpacing: '0.1em',
                                                                    textTransform: 'uppercase',
                                                                    color: '#c9a84c',
                                                                    marginBottom: 4,
                                                                }}
                                                            >
                                                                Schedule
                                                            </div>
                                                            <div
                                                                style={{
                                                                    fontFamily: "'Lato', sans-serif",
                                                                    fontSize: '0.8rem',
                                                                    color: '#cbd5e1',
                                                                }}
                                                            >
                                                                {course.schedule}
                                                            </div>
                                                        </div>

                                                        <div>
                                                            <div
                                                                style={{
                                                                    fontFamily: "'Lato', sans-serif",
                                                                    fontSize: '0.65rem',
                                                                    letterSpacing: '0.1em',
                                                                    textTransform: 'uppercase',
                                                                    color: '#c9a84c',
                                                                    marginBottom: 4,
                                                                }}
                                                            >
                                                                Class Size
                                                            </div>
                                                            <div
                                                                style={{
                                                                    fontFamily: "'Cinzel', serif",
                                                                    fontSize: '0.85rem',
                                                                    color: '#e2e8f0',
                                                                }}
                                                            >
                                                                Max {course.maxStudents} Students
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            <div
                                                className="flex items-center justify-between"
                                                style={{
                                                    borderTop: '1px solid #c9a84c22',
                                                    paddingTop: 20,
                                                }}
                                            >
                                                <div
                                                    className="gold-text"
                                                    style={{
                                                        fontFamily: "'Cinzel', serif",
                                                        fontWeight: 700,
                                                        fontSize: '1.5rem',
                                                    }}
                                                >
                                                    {course.price}
                                                </div>
                                                <Link href="/enroll">
                                                    <Button
                                                        className="btn-gold px-6 py-2 rounded-none h-auto"
                                                        style={{ fontSize: '0.65rem' }}
                                                    >
                                                        Enroll Now →
                                                    </Button>
                                                </Link>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            ))}
                        </div>

                        {filteredCourses.length === 0 && (
                            <div
                                style={{
                                    textAlign: 'center',
                                    padding: '60px 20px',
                                }}
                            >
                                <p
                                    style={{
                                        fontFamily: "'Lato', sans-serif",
                                        fontSize: '1.1rem',
                                        color: '#64748b',
                                    }}
                                >
                                    No courses found in this category.
                                </p>
                            </div>
                        )}
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
                            Get Started Today
                        </p>
                        <h2
                            className="section-title gold-text"
                            style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', marginBottom: 20 }}
                        >
                            Find Your Perfect Course
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
                            Whether you're starting your journey or advancing your skills, Casa Del Sapere has the perfect course for you. Join our community of learners today.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
                            <Button className="btn-gold px-8 md:px-10 py-3 rounded-none h-auto w-full sm:w-auto" disabled>Browse Courses</Button>
                            <Link href="/contact">
                                <Button className="btn-outline-gold px-8 md:px-10 py-3 rounded-none h-auto w-full sm:w-auto">Schedule Consultation</Button>
                            </Link>
                        </div>
                    </div>
                </section>

                <Footer />
            </div>
        </>
    );
}
