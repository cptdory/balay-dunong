"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useState, useMemo } from 'react';
import { useMutation } from 'convex/react';
import { Zap, Users, GraduationCap } from 'lucide-react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { sileo } from 'sileo';

// ─── Shared Input Style ───────────────────────────────────────────────────────

const inputCls = [
  "w-full px-4 py-3",
  "bg-[#c9a84c]/[0.05] border border-[#c9a84c]/25",
  "text-gray-200 font-[Lato] text-base",
  "outline-none transition-all duration-300",
  "focus:border-[#c9a84c] focus:bg-[#c9a84c]/10",
  "placeholder:text-[#475569]",
].join(" ");

// ─── Form Primitives ──────────────────────────────────────────────────────────

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="block mb-2 font-[Lato] text-sm text-[#c9a84c]/70">{children}</label>
  );
}

function FormInput({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <input className={inputCls} {...props} />
    </div>
  );
}

function SectionDivider({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle: string }) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <div className="w-9 h-9 shrink-0 bg-[#c9a84c]/10 border border-[#c9a84c]/25 flex items-center justify-center text-[#c9a84c]">
        {icon}
      </div>
      <div>
        <p className="font-[Lato] text-[0.6rem] tracking-[0.25em] uppercase text-[#c9a84c]/50 mb-0.5">{subtitle}</p>
        <h3 className="font-[Cinzel] text-base font-bold text-gray-100">{title}</h3>
      </div>
      <div className="flex-1 h-px bg-gradient-to-r from-[#c9a84c]/20 to-transparent ml-2" />
    </div>
  );
}

// ─── Enroll Page ──────────────────────────────────────────────────────────────

export default function EnrollPage() {
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [student, setStudent] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    birthday: '', address: '', city: '', gradeLevel: '',
  });

  const [guardian, setGuardian] = useState({
    firstName: '', lastName: '', relationship: '',
    email: '', phone: '', occupation: '', address: '',
  });

  const patchStudent = (field: keyof typeof student) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setStudent((p) => ({ ...p, [field]: e.target.value }));

  const patchGuardian = (field: keyof typeof guardian) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setGuardian((p) => ({ ...p, [field]: e.target.value }));

  const coursesData = useQuery(api._courses.getAllCourses);

  const courses = useMemo(() =>
    (coursesData || []).map((course: any) => ({
      id: course._id,
      icon: Zap,
      category: course.category,
      title: course.name,
      sessions: `${Math.ceil(parseInt(course.duration) / 7)} Sessions`,
      level: course.level,
      price: `₱${course.price.toFixed(2)}`,
    })), [coursesData]
  );

  const selectedCourseObj = courses.find((c) => c.id === selectedCourse);

  const createEnrollee = useMutation(api._enrollee.create);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse) return;
    await createEnrollee({
      studentFirstName: student.firstName,
      studentLastName: student.lastName,
      studentEmail: student.email,
      studentPhone: student.phone,
      studentBirthday: student.birthday,
      studentAddress: student.address,
      studentCity: student.city,
      studentGradeLevel: student.gradeLevel,
      guardianFirstName: guardian.firstName,
      guardianLastName: guardian.lastName,
      guardianRelationship: guardian.relationship,
      guardianEmail: guardian.email,
      guardianPhone: guardian.phone,
      guardianOccupation: guardian.occupation,
      guardianAddress: guardian.address,
      courseId: selectedCourse,
    });
    // Optionally reset form or show success message here
    setSelectedCourse(null);
    setStudent({ firstName: '', lastName: '', email: '', phone: '', birthday: '', address: '', city: '', gradeLevel: '' });
    setGuardian({ firstName: '', lastName: '', relationship: '', email: '', phone: '', occupation: '', address: '' });
    sileo.success({ title: "Enrollment successful!", fill: "#171717",
});
  };

  return (
    <div className="min-h-screen bg-casa-gradient font-[Cormorant_Garamond,Georgia,serif]">
      <Header />
      {/* ── Hero ── */}
      <section className="relative px-4 md:px-8 py-16 md:py-24 overflow-hidden">
        <div className="max-w-4xl mx-auto text-center">
          <div className="subtitle mb-8 justify-center">
            <div className="gold-divider" />
            Begin Your Journey
            <div className="gold-divider" />
          </div>
          <h1 className="hero-title gold-text mb-6" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}>
            Unlock Your Potential
          </h1>
          <p className="text-subtitle max-w-xl mx-auto">
            Choose your course and start your learning journey today. Limited spots available for our upcoming semester.
          </p>
        </div>
      </section>

      <div className="divider-line mx-auto max-w-[90%]" />

      {/* ── Enrollment Section ── */}
      <section className="px-4 md:px-8 py-24">
        <div className="max-w-5xl mx-auto">

          {/* Course Cards */}
          <div className="grid lg:grid-cols-3 gap-8 mb-20">
            {courses.map((course) => (
              <div key={course.id} onClick={() => setSelectedCourse(course.id)}
                className="cursor-pointer card-hover transition-opacity duration-300"
                style={{ opacity: selectedCourse === null || selectedCourse === course.id ? 1 : 0.5 }}>
                <Card className="rounded-none overflow-hidden border-2 transition-all duration-300"
                  style={{
                    background: selectedCourse === course.id
                      ? 'linear-gradient(145deg, #132045, #0d1535)'
                      : 'linear-gradient(145deg, #0d1535, #0a1628)',
                    borderColor: selectedCourse === course.id ? '#c9a84c' : '#c9a84c33',
                    boxShadow: selectedCourse === course.id
                      ? '0 8px 40px rgba(201,168,76,0.15)' : '0 8px 40px rgba(0,0,0,0.4)',
                  }}>
                  <div className="h-0.5 bg-gradient-to-r from-[#c9a84c] via-[#e8c97a] to-[#c9a84c]" />
                  <CardContent className="pt-8 pb-8 text-center">
                    <div className="flex justify-center mb-3">
                      <course.icon size={48} color="#c9a84c" strokeWidth={1.5} />
                    </div>
                    <p className="font-[Lato] text-[0.65rem] tracking-[0.15em] text-slate-500 uppercase mb-2">
                      {course.category}
                    </p>
                    <h3 className="gold-text font-[Cinzel] font-semibold text-xl mb-3 leading-snug">
                      {course.title}
                    </h3>
                    <p className="font-[Lato] text-sm text-slate-400 mb-4">
                      {course.sessions} · {course.level}
                    </p>
                    <p className="gold-text font-[Cinzel] font-bold text-3xl">{course.price}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>

          {/* Enrollment Form */}
          {selectedCourse ? (
            <div className="bg-gradient-to-br from-[#0d1535] to-[#0a1628] border border-[#c9a84c]/25 p-8 md:p-10">

              {/* Selected course reminder */}
              {selectedCourseObj && (
                <div className="flex items-center gap-3 mb-8 pb-6 border-b border-[#c9a84c]/[0.13]">
                  <div className="w-8 h-8 bg-[#c9a84c]/10 border border-[#c9a84c]/25 flex items-center justify-center">
                    <selectedCourseObj.icon size={16} color="#c9a84c" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="font-[Lato] text-[0.6rem] tracking-[0.2em] uppercase text-[#c9a84c]/50 mb-0.5">Selected Course</p>
                    <p className="font-[Cinzel] text-sm font-bold text-gray-100">{selectedCourseObj.title}</p>
                  </div>
                  <div className="ml-auto">
                    <p className="gold-text font-[Cinzel] font-bold text-xl">{selectedCourseObj.price}</p>
                  </div>
                </div>
              )}

              <p className="font-[Lato] text-[0.7rem] tracking-[0.25em] uppercase text-[#c9a84c] mb-2">Your Information</p>
              <h2 className="section-title gold-text mb-10 text-[1.8rem]">Complete Your Enrollment</h2>

              <form onSubmit={handleSubmit} className="space-y-10">

                {/* ── Student Information ── */}
                <div>
                  <SectionDivider icon={<GraduationCap size={16} />} title="Student Information" subtitle="Enrollee" />
                  <div className="space-y-5">
                    <div className="grid md:grid-cols-2 gap-5">
                      <FormInput label="First Name" name="firstName" type="text" value={student.firstName} onChange={patchStudent("firstName")} placeholder="e.g. Maria" required />
                      <FormInput label="Last Name" name="lastName" type="text" value={student.lastName} onChange={patchStudent("lastName")} placeholder="e.g. Santos" required />
                    </div>
                    <div className="grid md:grid-cols-2 gap-5">
                      <FormInput label="Email Address" name="email" type="email" value={student.email} onChange={patchStudent("email")} placeholder="student@email.com" required />
                      <FormInput label="Phone Number" name="phone" type="tel" value={student.phone} onChange={patchStudent("phone")} placeholder="+63 912 345 6789" required />
                    </div>
                    <div className="grid md:grid-cols-2 gap-5">
                      <FormInput label="Date of Birth" name="birthday" type="date" value={student.birthday} onChange={patchStudent("birthday")} required />
                      <FormInput label="Grade / Year Level" name="gradeLevel" type="text" value={student.gradeLevel} onChange={patchStudent("gradeLevel")}
                        placeholder="e.g. Grade 10, College, Adult" required />
                    </div>
                    <FormInput label="Home Address" name="address" type="text" value={student.address} onChange={patchStudent("address")} placeholder="Street, Barangay, City, Province" />
                  </div>
                </div>

                {/* ── Guardian / Parent Information ── */}
                <div>
                  <SectionDivider icon={<Users size={16} />} title="Parent / Guardian Information" subtitle="Emergency Contact" />
                  <div className="space-y-5">
                    <div className="grid md:grid-cols-2 gap-5">
                      <FormInput label="First Name" name="guardianFirstName" type="text" value={guardian.firstName} onChange={patchGuardian("firstName")} placeholder="e.g. Jose" required />
                      <FormInput label="Last Name" name="guardianLastName" type="text" value={guardian.lastName} onChange={patchGuardian("lastName")} placeholder="e.g. Santos" required />
                    </div>
                    <div className="grid md:grid-cols-2 gap-5">
                      <FormInput label="Relationship to Student" name="relationship" type="text" value={guardian.relationship} onChange={patchGuardian("relationship")}
                        placeholder="e.g. Mother, Father, Guardian" required />
                      <FormInput label="Occupation" name="occupation" type="text" value={guardian.occupation} onChange={patchGuardian("occupation")} placeholder="e.g. Engineer" />
                    </div>
                    <div className="grid md:grid-cols-2 gap-5">
                      <FormInput label="Email Address" name="guardianEmail" type="email" value={guardian.email} onChange={patchGuardian("email")} placeholder="parent@email.com" />
                      <FormInput label="Phone Number" name="guardianPhone" type="tel" value={guardian.phone} onChange={patchGuardian("phone")} placeholder="+63 912 345 6789" required />
                    </div>
                    <FormInput label="Address (if different from student)" name="guardianAddress" type="text" value={guardian.address} onChange={patchGuardian("address")} placeholder="Leave blank if same as student" />
                  </div>
                </div>

                {/* ── Submit ── */}
                <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-[#c9a84c]/[0.13]">
                  <Button type="submit" className="btn-gold px-10 py-3 rounded-none h-auto">
                    Submit Enrollment
                  </Button>
                  <Button type="button" className="btn-outline-gold px-10 py-3 rounded-none h-auto" onClick={() => setSelectedCourse(null)}>
                    Clear Selection
                  </Button>
                </div>
              </form>
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="font-[Lato] text-slate-500">Select a course above to continue with enrollment.</p>
            </div>
          )}
        </div>
      </section>

      <div className="divider-line mx-auto max-w-[90%]" />
      <Footer />
    </div>
  );
}