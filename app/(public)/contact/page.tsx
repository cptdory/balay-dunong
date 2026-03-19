"use client";
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useState } from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

const contactMethods = [
    {
        icon: MapPin,
        title: 'Address',
        content: "D'Barn, Poblacion, Cataingan, Masbate",
    },
    {
        icon: Phone,
        title: 'Phone',
        content: '+63 946 805 9320',
    },
    {
        icon: Mail,
        title: 'Email',
        content: 'info@casadelsapere.com',
    },
    {
        icon: Clock,
        title: 'Hours',
        content: 'Mon - Sat: 9:00 AM - 7:00 PM',
    },
];

export default function ContactPage() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
    });

    const [submitted, setSubmitted] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission
        console.log('Form submitted:', formData);
        setSubmitted(true);
        setTimeout(() => {
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                subject: '',
                message: '',
            });
            setSubmitted(false);
        }, 3000);
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
                        <div className="subtitle mb-8 justify-center">
                            <div className="gold-divider" />
                            Get in Touch
                            <div className="gold-divider" />
                        </div>

                        <h1 className="hero-title gold-text mb-6" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}>
                            Contact Casa Del Sapere
                        </h1>

                        <p className="text-subtitle max-w-2xl mx-auto">
                            Have questions about our courses? Want to schedule a tour? We'd love to hear from you. Reach out and let's start a conversation.
                        </p>
                    </div>
                </section>

                <div className="divider-line" style={{ margin: '0 auto', maxWidth: '90%' }} />

                {/* CONTACT INFO */}
                <section className="px-4 md:px-8 py-16 md:py-24">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-12 md:mb-24">
                            {contactMethods.map((method, idx) => (
                                <div key={idx} className="text-center">
                                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
                                        <method.icon size={40} color="#c9a84c" strokeWidth={1.5} />
                                    </div>
                                    <h3
                                        style={{
                                            fontFamily: "'Cinzel', serif",
                                            fontWeight: 600,
                                            fontSize: '1.1rem',
                                            color: '#e2e8f0',
                                            marginBottom: 8,
                                        }}
                                    >
                                        {method.title}
                                    </h3>
                                    <p
                                        style={{
                                            fontFamily: "'Lato', sans-serif",
                                            fontWeight: 300,
                                            fontSize: '0.9rem',
                                            color: '#64748b',
                                            lineHeight: 1.6,
                                        }}
                                    >
                                        {method.content}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <div className="divider-line" style={{ margin: '0 auto', maxWidth: '90%' }} />

                {/* CONTACT FORM SECTION */}
                <section className="px-4 md:px-8 py-16 md:py-24">
                    <div className="max-w-5xl mx-auto">
                        <div className="grid lg:grid-cols-3 gap-16 items-start">
                            {/* Form */}
                            <div style={{ gridColumn: '1 / -1', order: 1 }}>
                                <div className="mb-16">
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
                                        Send us a Message
                                    </p>
                                    <h2 className="section-title gold-text" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', marginBottom: 24 }}>
                                        We're Here to Help
                                    </h2>
                                </div>

                                <div
                                    style={{
                                        background: 'linear-gradient(145deg, #0d1535, #0a1628)',
                                        border: '1px solid #c9a84c44',
                                        padding: 40,
                                    }}
                                >
                                    {submitted ? (
                                        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                                            <div style={{ fontSize: '3rem', marginBottom: 16 }}>✓</div>
                                            <h3
                                                style={{
                                                    fontFamily: "'Cinzel', serif",
                                                    fontWeight: 600,
                                                    fontSize: '1.5rem',
                                                    color: '#c9a84c',
                                                    marginBottom: 12,
                                                }}
                                            >
                                                Message Sent!
                                            </h3>
                                            <p
                                                style={{
                                                    fontFamily: "'Lato', sans-serif",
                                                    fontSize: '0.95rem',
                                                    color: '#64748b',
                                                    lineHeight: 1.7,
                                                }}
                                            >
                                                Thank you for reaching out. We'll get back to you shortly.
                                            </p>
                                        </div>
                                    ) : (
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

                                            <div className="mb-6">
                                                <label
                                                    style={{
                                                        fontFamily: "'Lato', sans-serif",
                                                        fontSize: '0.85rem',
                                                        color: '#c9a84c99',
                                                        display: 'block',
                                                        marginBottom: 8,
                                                    }}
                                                >
                                                    Subject
                                                </label>
                                                <input
                                                    type="text"
                                                    name="subject"
                                                    value={formData.subject}
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

                                            <div className="mb-8">
                                                <label
                                                    style={{
                                                        fontFamily: "'Lato', sans-serif",
                                                        fontSize: '0.85rem',
                                                        color: '#c9a84c99',
                                                        display: 'block',
                                                        marginBottom: 8,
                                                    }}
                                                >
                                                    Message
                                                </label>
                                                <textarea
                                                    name="message"
                                                    value={formData.message}
                                                    onChange={handleInputChange}
                                                    required
                                                    rows={5}
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
                                                        resize: 'none',
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

                                            <Button type="submit" className="btn-gold px-8 md:px-10 py-3 rounded-none h-auto w-full md:w-auto">
                                                Send Message
                                            </Button>
                                        </form>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="divider-line" style={{ margin: '0 auto', maxWidth: '90%' }} />

                {/* MAP SECTION */}
                <section className="px-4 md:px-8 py-16 md:py-24" style={{ background: 'rgba(201,168,76,0.02)' }}>
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
                                <span className="ornament">—</span> Visit Us <span className="ornament">—</span>
                            </p>
                            <h2 className="section-title gold-text" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', marginBottom: 24 }}>
                                Find Us at Our Location
                            </h2>
                        </div>

                        <div
                            style={{
                                width: '100%',
                                height: 400,
                                background: 'linear-gradient(135deg, #132045 0%, #0a0f1e 100%)',
                                border: '1px solid #c9a84c33',
                                borderRadius: 0,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                position: 'relative',
                                overflow: 'hidden',
                            }}
                        >
                            {/* Decorative elements */}
                            <div
                                className="geometric-accent"
                                style={{
                                    width: 300,
                                    height: 300,
                                    borderRadius: '50%',
                                    right: -50,
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    borderColor: '#c9a84c18',
                                }}
                            />
                            <div
                                className="geometric-accent"
                                style={{
                                    width: 200,
                                    height: 200,
                                    borderRadius: '50%',
                                    left: -50,
                                    bottom: '10%',
                                    borderColor: '#c9a84c14',
                                }}
                            />

                            <div style={{ textAlign: 'center', position: 'relative', zIndex: 10 }}>
                                <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'center' }}>
                                    <MapPin size={56} color="#c9a84c" strokeWidth={1.5} />
                                </div>
                                <h3
                                    style={{
                                        fontFamily: "'Cinzel', serif",
                                        fontWeight: 600,
                                        fontSize: '1.3rem',
                                        color: '#e2e8f0',
                                        marginBottom: 8,
                                    }}
                                >
                                    D'Barn, Poblacion 
                                </h3>
                                <p
                                    style={{
                                        fontFamily: "'Lato', sans-serif",
                                        fontSize: '1rem',
                                        color: '#64748b',
                                    }}
                                >
                                    Cataingan, Masbate
                                </p>
                                <p
                                    style={{
                                        fontFamily: "'Lato', sans-serif",
                                        fontSize: '0.9rem',
                                        color: '#475569',
                                        marginTop: 12,
                                    }}
                                >
                                    Open Monday - Saturday, 9:00 AM - 7:00 PM
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="divider-line" style={{ margin: '0 auto', maxWidth: '90%' }} />

                {/* FAQ SECTION */}
                <section className="px-4 md:px-8 py-16 md:py-24">
                    <div className="max-w-4xl mx-auto">
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
                                <span className="ornament">—</span> Questions? <span className="ornament">—</span>
                            </p>
                            <h2 className="section-title gold-text" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)' }}>
                                Frequently Asked Questions
                            </h2>
                        </div>

                        <div>
                            {[
                                {
                                    q: 'What are the course prerequisites?',
                                    a: 'Most of our courses are designed for all skill levels. Some advanced courses may recommend prior experience, but we always provide guidance.',
                                },
                                {
                                    q: 'Do you offer online classes?',
                                    a: 'Currently, we offer in-person classes at our location. We\'re exploring online options for the future.',
                                },
                                {
                                    q: 'What is your refund policy?',
                                    a: 'We offer full refunds within 7 days of course start. Please contact us for more details.',
                                },
                                {
                                    q: 'Can I get a course schedule in advance?',
                                    a: 'Yes! Contact us and we can provide detailed course schedules for the upcoming semester.',
                                },
                            ].map((faq, idx) => (
                                <div
                                    key={idx}
                                    style={{
                                        borderBottom: idx !== 3 ? '1px solid #c9a84c22' : 'none',
                                        paddingBottom: 20,
                                        marginBottom: 20,
                                    }}
                                >
                                    <h3
                                        style={{
                                            fontFamily: "'Cinzel', serif",
                                            fontWeight: 600,
                                            fontSize: '1.1rem',
                                            color: '#c9a84c',
                                            marginBottom: 12,
                                        }}
                                    >
                                        {faq.q}
                                    </h3>
                                    <p
                                        style={{
                                            fontFamily: "'Lato', sans-serif",
                                            fontWeight: 300,
                                            fontSize: '0.95rem',
                                            color: '#64748b',
                                            lineHeight: 1.7,
                                        }}
                                    >
                                        {faq.a}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <Footer />
            </div>
        </>
    );
}
