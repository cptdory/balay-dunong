"use client";

import { useMemo, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  BookOpen, Users, Eye, Clock, UserCircle2,
  Plus, Trash2, Edit2, ChevronRight, GraduationCap, Camera,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { sileo } from "sileo";
// ─── Types ────────────────────────────────────────────────────────────────────

type Course = {
  _id: string;
  courseCode: string;
  name: string;
  description: string;
  duration: string;
  status: string;
  category: string;
  level: string;
  price: number;
  thumbnail: string;
};

type CourseMember = {
  _id: string;
  courseId: string;
  userId: string;
  role: string;
  _creationTime: number;
  user: { name: string; email: string } | null;
};

type User = {
  _id: string;
  name: string;
  email: string;
  role: string;
};

// ─── Shared Dialog Shell ──────────────────────────────────────────────────────

function GoldDialog({ open, onClose, title, subtitle, icon, children, maxWidth = "sm:max-w-md" }: {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  maxWidth?: string;
}) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className={`bg-[#080e20] border border-[#c9a84c]/[0.13] rounded-none p-0 gap-0 ${maxWidth} [&>button]:hidden`}>
        <div className="bg-gradient-to-br from-[#0d1535] to-[#0a1628] border-b border-[#c9a84c]/[0.13] px-6 py-5">
          <div className="h-px bg-gradient-to-r from-transparent via-[#c9a84c]/40 to-transparent mb-4" />
          <DialogHeader>
            <div className="flex items-center gap-3">
              {icon && (
                <div className="w-8 h-8 bg-[#c9a84c]/10 border border-[#c9a84c]/20 flex items-center justify-center shrink-0">
                  {icon}
                </div>
              )}
              <div>
                {subtitle && <p className="page-label mb-0.5">{subtitle}</p>}
                <DialogTitle className="font-[Cinzel] text-base text-gray-100 font-bold m-0">{title}</DialogTitle>
              </div>
            </div>
          </DialogHeader>
        </div>
        {children}
      </DialogContent>
    </Dialog>
  );
}

// ─── Shared Primitives ────────────────────────────────────────────────────────

const fieldCls = "w-full mt-1.5 px-3 py-2 bg-[#0a0f1e] border border-[#c9a84c]/[0.13] text-gray-200 text-sm font-[Lato] focus:outline-none focus:border-[#c9a84c]/50 placeholder:text-[#334155]";

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-[0.6rem] font-[Lato] text-[#c9a84c] uppercase tracking-widest font-semibold block">{label}</label>
      {children}
    </div>
  );
}

// ─── Thumbnail Component ──────────────────────────────────────────────────────

function ThumbnailUpload({ thumbnail, name, editable = false, onThumbnailChange }: {
  thumbnail?: string; name: string; editable?: boolean; onThumbnailChange?: (v: string) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onThumbnailChange) return;
    const reader = new FileReader();
    reader.onload = (ev) => onThumbnailChange(ev.target?.result as string);
    reader.readAsDataURL(file);
  };
  return (
    <div className="relative w-full h-40">
      <div className="w-full h-full rounded border-2 border-[#c9a84c]/30 bg-gradient-to-br from-[#0d1535] to-[#132045] flex items-center justify-center overflow-hidden">
        {thumbnail
          ? <img src={thumbnail} alt={name} className="w-full h-full object-cover" />
          : <div className="flex flex-col items-center gap-2 text-[#c9a84c]/50">
            <BookOpen size={24} />
            <span className="font-[Lato] text-xs">No image yet</span>
          </div>
        }
      </div>
      {editable && (
        <>
          <button type="button" onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-3 right-3 w-[36px] h-[36px] rounded-full bg-[#c9a84c] border-2 border-[#080e20] flex items-center justify-center hover:bg-[#e8d49a] transition-colors">
            <Camera size={14} color="#0a0f1e" />
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
        </>
      )}
    </div>
  );
}

function DialogActions({ onClose, onConfirm, confirmLabel, isLoading, danger }: {
  onClose: () => void;
  onConfirm: () => void;
  confirmLabel: string;
  isLoading?: boolean;
  danger?: boolean;
}) {
  return (
    <div className="flex gap-2 justify-end px-6 py-4 border-t border-[#c9a84c]/[0.13]">
      <button onClick={onClose}
        className="px-4 py-1.5 border border-[#c9a84c]/20 text-[#c9a84c]/60 hover:text-[#c9a84c] hover:border-[#c9a84c]/40 text-xs font-[Lato] uppercase tracking-widest transition-colors">
        Cancel
      </button>
      <button onClick={onConfirm} disabled={isLoading}
        className={`px-4 py-1.5 text-xs font-[Lato] uppercase tracking-widest transition-colors disabled:opacity-50 border ${danger
          ? "bg-red-500/20 hover:bg-red-500/30 border-red-500/40 text-red-400"
          : "bg-[#c9a84c]/20 hover:bg-[#c9a84c]/30 border-[#c9a84c]/40 text-[#c9a84c]"
          }`}>
        {isLoading ? "Saving…" : confirmLabel}
      </button>
    </div>
  );
}

// ─── Course Form Dialog ───────────────────────────────────────────────────────

function CourseFormDialog({ open, onClose, course, onSave }: {
  open: boolean; onClose: () => void; course?: Course;
  onSave: (data: Omit<Course, "_id">) => Promise<void>;
}) {
  const [form, setForm] = useState({
    courseCode: course?.courseCode || "", name: course?.name || "",
    description: course?.description || "", duration: course?.duration || "",
    status: course?.status || "active", category: course?.category || "",
    level: course?.level || "beginner", price: course?.price || 0,
    thumbnail: course?.thumbnail || "",
  });
  const [thumbnailPreview, setThumbnailPreview] = useState<string>(course?.thumbnail || "");
  const [isLoading, setIsLoading] = useState(false);
  const patch = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSave = async () => {
    if (!form.courseCode || !form.name || !form.description || !form.duration || !form.category || !form.thumbnail || form.price < 0) {
      sileo.error({ title: "Missing required fields", fill: "#171717" });
      return;
    }
    setIsLoading(true);
    try {
      await onSave({
        ...form,
        price: typeof form.price === 'string' ? parseFloat(form.price) : form.price,
      });
      onClose();
    }
    catch {
      sileo.error({ title: "Error saving course", fill: "#171717" });
    }
    finally { setIsLoading(false); }
  };

  return (
    <GoldDialog open={open} onClose={onClose}
      title={course ? "Edit Course" : "Create Course"} subtitle="Program Management"
      icon={<BookOpen size={15} className="text-[#c9a84c]" />}>
      <div className="px-6 py-5 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Course Code">
            <input name="courseCode" value={form.courseCode} onChange={patch} className={fieldCls} placeholder="e.g. CS101" />
          </FormField>
          <FormField label="Duration">
            <input name="duration" value={form.duration} onChange={patch} className={fieldCls} placeholder="e.g. 12 weeks" />
          </FormField>
        </div>
        <FormField label="Course Name">
          <input name="name" value={form.name} onChange={patch} className={fieldCls} placeholder="Course title" />
        </FormField>
        <FormField label="Description">
          <textarea name="description" value={form.description} onChange={patch} className={`${fieldCls} resize-none`} rows={3} placeholder="Course description" />
        </FormField>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Category">
            <select name="category" value={form.category} onChange={patch} className={fieldCls}>
              <option value="Technology">Technology</option>
              <option value="Music & Arts">Music & Arts</option>
              <option value="Science">Science</option>
              <option value="Programming">Programming</option>
              <option value="Arts">Arts</option>
            </select>
          </FormField>
          <FormField label="Level">
            <select name="level" value={form.level} onChange={patch} className={fieldCls}>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </FormField>
        </div>
        <FormField label="Price ($)">
          <input name="price" type="number" value={form.price} onChange={patch} className={fieldCls} placeholder="0.00" step="0.01" min="0" />
        </FormField>
        <FormField label="Thumbnail Image">
          <ThumbnailUpload thumbnail={thumbnailPreview} name={form.name || "Course"} editable={true} onThumbnailChange={(v) => {
            setForm((p) => ({ ...p, thumbnail: v }));
            setThumbnailPreview(v);
          }} />
        </FormField>
        <FormField label="Status">
          <select name="status" value={form.status} onChange={patch} className={fieldCls}>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </FormField>
      </div>
      <DialogActions onClose={onClose} onConfirm={handleSave} confirmLabel={course ? "Save Changes" : "Create Course"} isLoading={isLoading} />
    </GoldDialog>
  );
}

// ─── Add Member Dialog ────────────────────────────────────────────────────────

function AddMemberDialog({ open, onClose, courseId, role, allUsers, currentMembers, onAdd }: {
  open: boolean; onClose: () => void; courseId: string; role: "instructor" | "student";
  allUsers: User[] | undefined; currentMembers: CourseMember[] | undefined;
  onAdd: (userId: string, role: string) => Promise<void>;
}) {
  const [selectedUserId, setSelectedUserId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const currentMemberIds = new Set(currentMembers?.map((m) => m.userId) || []);
  const availableUsers = useMemo(
    () => (allUsers || []).filter((u) => !currentMemberIds.has(u._id) && u.role === role),
    [allUsers, currentMemberIds, role]
  );
  const handleAdd = async () => {
    if (!selectedUserId) return;
    setIsLoading(true);
    try { await onAdd(selectedUserId, role); setSelectedUserId(""); onClose(); }
    catch {
      sileo.error({
        title: `Error adding ${role}`, fill: "#171717",
      });
    }
    finally { setIsLoading(false); }
  };
  const label = role === "instructor" ? "Instructor" : "Student";
  return (
    <GoldDialog open={open} onClose={onClose} title={`Add ${label}`} subtitle="Member Management"
      icon={<UserCircle2 size={15} className="text-[#c9a84c]" />}>
      <div className="px-6 py-5">
        <FormField label={`Select ${label}`}>
          <select value={selectedUserId} onChange={(e) => setSelectedUserId(e.target.value)} className={fieldCls}>
            <option value="">Choose a user…</option>
            {availableUsers.map((u) => <option key={u._id} value={u._id}>{u.name} ({u.email})</option>)}
          </select>
        </FormField>
      </div>
      <DialogActions onClose={onClose} onConfirm={handleAdd} confirmLabel={`Add ${label}`} isLoading={isLoading} />
    </GoldDialog>
  );
}

// ─── Students Dialog ──────────────────────────────────────────────────────────

function StudentsDialog({ course, open, onClose, students, allUsers, onAddStudent, onDeleteStudent }: {
  course: Course; open: boolean; onClose: () => void;
  students: CourseMember[] | undefined; allUsers: User[] | undefined;
  onAddStudent: (userId: string) => Promise<void>;
  onDeleteStudent: (memberId: string) => Promise<void>;
}) {
  const [addOpen, setAddOpen] = useState(false);
  return (
    <>
      <GoldDialog open={open} onClose={onClose} title={course.name} subtitle="Enrolled Students"
        icon={<Users size={15} className="text-green-400" />} maxWidth="sm:max-w-2xl">
        <div className="px-6 pt-4 flex justify-end">
          <button onClick={() => setAddOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#c9a84c]/10 border border-[#c9a84c]/25 text-[#c9a84c] text-[0.6rem] tracking-widest uppercase font-[Lato] font-semibold hover:bg-[#c9a84c]/20 transition-colors">
            <Plus size={11} /> Add Student
          </button>
        </div>
        <div className="px-6 py-4">
          {students && students.length > 0 ? (
            <div className="border border-[#c9a84c]/[0.13]">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-[#c9a84c]/[0.13] hover:bg-transparent">
                    <TableHead className="text-[#c9a84c] font-semibold">Name</TableHead>
                    <TableHead className="text-[#c9a84c] font-semibold">Email</TableHead>
                    <TableHead className="w-10" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((s) => (
                    <TableRow key={s._id} className="border-b border-[#c9a84c]/[0.07] hover:bg-[#c9a84c]/[0.03]">
                      <TableCell className="text-gray-200 font-[Lato] text-sm">{s.user?.name || "Unknown"}</TableCell>
                      <TableCell className="text-gray-400 font-[Lato] text-sm">{s.user?.email || "N/A"}</TableCell>
                      <TableCell>
                        <button onClick={() => onDeleteStudent(s._id)}
                          className="p-1 hover:bg-red-400/10 text-gray-500 hover:text-red-400 transition-colors">
                          <Trash2 size={13} />
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 py-10">
              <GraduationCap size={36} className="text-[#475569] opacity-40" />
              <p className="font-[Lato] text-sm text-gray-400">No students enrolled yet.</p>
            </div>
          )}
        </div>
        {students && students.length > 0 && (
          <div className="px-6 py-3 border-t border-[#c9a84c]/[0.13] flex justify-between items-center">
            <span className="font-[Lato] text-[0.6rem] tracking-widest uppercase text-[#c9a84c]/50">Total Enrolled</span>
            <span className="font-[Cinzel] text-sm text-[#c9a84c]">{students.length}</span>
          </div>
        )}
      </GoldDialog>
      <AddMemberDialog open={addOpen} onClose={() => setAddOpen(false)} courseId={course._id} role="student"
        allUsers={allUsers} currentMembers={students} onAdd={(uid) => onAddStudent(uid)} />
    </>
  );
}

// ─── Delete Confirm ───────────────────────────────────────────────────────────

function DeleteConfirmDialog({ open, onClose, courseName, onConfirm }: {
  open: boolean; onClose: () => void; courseName: string; onConfirm: () => Promise<void>;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const handleConfirm = async () => { setIsLoading(true); try { await onConfirm(); } finally { setIsLoading(false); } };
  return (
    <GoldDialog open={open} onClose={onClose} title="Delete Course" subtitle="Confirm Action"
      icon={<Trash2 size={15} className="text-red-400" />}>
      <div className="px-6 py-5">
        <p className="font-[Lato] text-sm text-gray-300 leading-relaxed">
          Are you sure you want to delete{" "}
          <span className="text-[#c9a84c] font-semibold">{courseName}</span>?{" "}
          This cannot be undone and will remove all enrolled members.
        </p>
      </div>
      <DialogActions onClose={onClose} onConfirm={handleConfirm} confirmLabel="Delete Course" isLoading={isLoading} danger />
    </GoldDialog>
  );
}

// ─── Course Card ──────────────────────────────────────────────────────────────

function CourseCard({ course }: { course: Course }) {
  const router = useRouter();
  const [studentsOpen, setStudentsOpen] = useState(false);
  const [addInstructorOpen, setAddInstructorOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const instructors = useQuery(api._courses.getCourseMembersByRole, { courseId: course._id as any, role: "instructor" });
  const students = useQuery(api._courses.getCourseMembersByRole, { courseId: course._id as any, role: "student" });
  const allUsers = useQuery(api._courses.getAllUsers);

  const addCourseMember = useMutation(api._courses.addCourseMember);
  const deleteCourseMember = useMutation(api._courses.deleteCourseMember);
  const updateCourse = useMutation(api._courses.updateCourse);
  const deleteCourse = useMutation(api._courses.deleteCourse);

  const instructorNames = useMemo(
    () => instructors?.map((i: CourseMember) => i.user?.name || "Unknown").join(", ") || "-",
    [instructors]
  );

  const isActive = course.status === "active";

  const handleAddMember = async (userId: string, role: string): Promise<void> => { await addCourseMember({ courseId: course._id as any, userId: userId as any, role }); };
  const handleDeleteMember = async (memberId: string): Promise<void> => { await deleteCourseMember({ memberId: memberId as any }); };
  const handleUpdate = async (data: Omit<Course, "_id">): Promise<void> => { await updateCourse({ courseId: course._id as any, ...data }); };
  const handleDelete = async () => {
    await deleteCourse({ courseId: course._id as any });
    sileo.error({
      title: "Course deleted", fill: "#171717",
    });
    setDeleteOpen(false);
  };

  return (
    <>
      {/* ── Card ── */}
      <div className="group relative flex flex-col bg-[#080e20] border border-[#c9a84c]/[0.13] overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-[#c9a84c]/30 hover:shadow-[0_24px_56px_rgba(201,168,76,0.1)]">

        {/* Gold top line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#c9a84c]/80 to-transparent" />

        {/* ── Thumbnail Image ── */}
        {course.thumbnail && (
          <div className="w-full h-40 bg-gradient-to-br from-[#0d1535] to-[#132045] overflow-hidden border-b border-[#c9a84c]/[0.07]">
            <img src={course.thumbnail} alt={course.name} className="w-full h-full object-cover" />
          </div>
        )}

        {/* ── Header: Code strip ── */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <div className="flex items-center gap-2.5">
            <div>
              <p className="font-[Lato] text-[0.55rem] tracking-[0.25em] uppercase text-[#c9a84c]/50 leading-none mb-0.5">Course Code</p>
              <p className="font-[Cinzel] text-sm font-bold text-[#c9a84c] tracking-wide leading-none">{course.courseCode}</p>
            </div>
          </div>

          {/* Status pill */}
          <span className={`text-[0.55rem] tracking-[0.15em] uppercase px-2.5 py-1 border font-bold font-[Lato] ${isActive
            ? "bg-green-400/[0.07] border-green-400/25 text-green-400"
            : "bg-red-400/[0.07] border-red-400/25 text-red-400"
            }`}>
            {isActive ? "● Active" : "○ Inactive"}
          </span>
        </div>

        {/* ── Title + Description ── */}
        <div className="px-5 pb-4 border-b border-[#c9a84c]/[0.07]">
          <h3 className="font-[Cinzel] text-[1.05rem] font-bold text-gray-50 leading-snug mb-2">
            {course.name}
          </h3>
          <p className="font-[Lato] text-[0.82rem] text-slate-400 leading-relaxed line-clamp-2">
            {course.description}
          </p>
        </div>

        {/* ── Meta: Duration + Students ── */}
        <div className="grid grid-cols-2 divide-x divide-[#c9a84c]/[0.07] border-b border-[#c9a84c]/[0.07]">
          {/* Duration */}
          <div className="flex items-center gap-2.5 px-5 py-3">
            <Clock size={13} className="text-[#c9a84c]/50 shrink-0" />
            <div>
              <p className="font-[Lato] text-[0.55rem] tracking-widest uppercase text-[#c9a84c]/40 mb-0.5">Duration</p>
              <p className="font-[Lato] text-xs text-gray-300 font-medium">{course.duration}</p>
            </div>
          </div>

          {/* Students — clickable */}
          <button onClick={() => setStudentsOpen(true)}
            className="flex items-center gap-2.5 px-5 py-3 hover:bg-green-400/[0.04] transition-colors text-left group/stat">
            <GraduationCap size={13} className="text-green-400/50 shrink-0 group-hover/stat:text-green-400 transition-colors" />
            <div>
              <p className="font-[Lato] text-[0.55rem] tracking-widest uppercase text-green-400/40 mb-0.5">Students</p>
              <p className="font-[Lato] text-xs text-gray-300 font-medium group-hover/stat:text-green-400 transition-colors">
                {students?.length ?? "—"} enrolled
              </p>
            </div>
          </button>
        </div>

        {/* ── Instructor Row ── */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-[#c9a84c]/[0.07]">
          <div className="flex items-center gap-2 min-w-0">
            <UserCircle2 size={13} className="text-[#c9a84c]/40 shrink-0" />
            <div className="min-w-0">
              <p className="font-[Lato] text-[0.55rem] tracking-widest uppercase text-[#c9a84c]/40 mb-0.5">Instructor</p>
              <p className="font-[Lato] text-xs text-gray-300 truncate">{instructorNames}</p>
            </div>
          </div>
          <button onClick={() => setAddInstructorOpen(true)} title="Assign instructor"
            className="shrink-0 w-6 h-6 flex items-center justify-center text-[#c9a84c]/30 hover:text-[#c9a84c] hover:bg-[#c9a84c]/10 transition-colors ml-2">
            <Plus size={13} />
          </button>
        </div>

        {/* ── Secondary Actions ── */}
        <div className="flex mt-auto divide-x divide-[#c9a84c]/[0.07]">
          <button onClick={() => setEditOpen(true)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[#c9a84c]/40 hover:text-[#c9a84c] hover:bg-[#c9a84c]/[0.05] text-[0.58rem] uppercase tracking-widest font-[Lato] font-semibold transition-colors">
            <Edit2 size={11} /> Edit
          </button>
          <button onClick={() => router.push(`/programs/${course._id}`)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[#c9a84c]/40 hover:text-[#c9a84c] hover:bg-[#c9a84c]/[0.05] text-[0.58rem] uppercase tracking-widest font-[Lato] font-semibold transition-colors">
            <Eye size={11} /> View
          </button>
          <button onClick={() => setDeleteOpen(true)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-red-400/30 hover:text-red-400 hover:bg-red-400/[0.05] text-[0.58rem] uppercase tracking-widest font-[Lato] font-semibold transition-colors">
            <Trash2 size={11} /> Delete
          </button>
        </div>
      </div>

      {/* Dialogs */}
      <CourseFormDialog open={editOpen} onClose={() => setEditOpen(false)} course={course} onSave={handleUpdate} />
      <StudentsDialog course={course} open={studentsOpen} onClose={() => setStudentsOpen(false)}
        students={students} allUsers={allUsers}
        onAddStudent={(uid) => handleAddMember(uid, "student")}
        onDeleteStudent={handleDeleteMember} />
      <AddMemberDialog open={addInstructorOpen} onClose={() => setAddInstructorOpen(false)}
        courseId={course._id} role="instructor" allUsers={allUsers} currentMembers={instructors}
        onAdd={(uid) => handleAddMember(uid, "instructor")} />
      <DeleteConfirmDialog open={deleteOpen} onClose={() => setDeleteOpen(false)}
        courseName={course.name} onConfirm={handleDelete} />
    </>
  );
}

// ─── Programs Page ────────────────────────────────────────────────────────────

export default function ProgramsPage() {
  const courses = useQuery(api._courses.getAllCourses);
  const coursesData = useMemo<Course[]>(() => courses ?? [], [courses]);
  const [createOpen, setCreateOpen] = useState(false);
  const createCourse = useMutation(api._courses.createCourse);

  const handleCreate = async (data: Omit<Course, "_id">) => {
    await createCourse(data);
    sileo.success({
      title: "Course created successfully",
      fill: "#171717",
    });
    setCreateOpen(false);
  };

  return (
    <div className="min-h-[480px] p-6">
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="page-label mb-0.5">Programs Management</p>
          <p className="font-[Lato] text-sm text-gray-400">
            {coursesData.length} course{coursesData.length !== 1 ? "s" : ""} available
          </p>
        </div>
        <button onClick={() => setCreateOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#c9a84c]/10 hover:bg-[#c9a84c]/20 border border-[#c9a84c]/25 text-[#c9a84c] text-[0.65rem] font-[Lato] font-semibold uppercase tracking-widest transition-colors">
          <Plus size={14} /> Create Course
        </button>
      </div>

      {/* Grid */}
      {coursesData.length > 0 ? (
        <div className="grid gap-5" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" }}>
          {coursesData.map((course) => <CourseCard key={course._id} course={course} />)}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-4 py-20 border border-dashed border-[#c9a84c]/10">
          <BookOpen size={40} className="text-[#475569] opacity-30" />
          <div className="text-center">
            <p className="font-[Cinzel] text-sm text-gray-500 mb-1">No courses yet</p>
            <p className="font-[Lato] text-xs text-gray-600">Click "Create Course" to get started.</p>
          </div>
        </div>
      )}

      <CourseFormDialog open={createOpen} onClose={() => setCreateOpen(false)} onSave={handleCreate} />
    </div>
  );
}
