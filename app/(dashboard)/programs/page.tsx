"use client";

import { useMemo, useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { BookOpen, Users, Eye, Clock, UserCircle2, Plus, X, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// ─── Types ────────────────────────────────────────────────────────────────────

type Course = {
  _id: string;
  courseCode: string;
  name: string;
  description: string;
  duration: string;
  status: string;
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

// ─── Add Member Dialog ────────────────────────────────────────────────────────

function AddMemberDialog({ open, onClose, courseId, role, allUsers, currentMembers, onAdd }: {
  open: boolean;
  onClose: () => void;
  courseId: string;
  role: "instructor" | "student";
  allUsers: User[] | undefined;
  currentMembers: CourseMember[] | undefined;
  onAdd: (userId: string, role: string) => Promise<void>;
}) {
  const [selectedUserId, setSelectedUserId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const currentMemberIds = new Set(currentMembers?.map((m) => m.userId) || []);

  // Filter out users who are already members and filter by role
  const availableUsers = useMemo(() => {
    return (allUsers || []).filter((user) => 
      !currentMemberIds.has(user._id) && user.role === role
    );
  }, [allUsers, currentMemberIds, role]);

  const handleAdd = async () => {
    if (!selectedUserId) return;
    setIsLoading(true);
    try {
      await onAdd(selectedUserId, role);
      setSelectedUserId("");
      onClose();
    } catch (error) {
      console.error("Error adding member:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="bg-[#080e20] border border-[#c9a84c]/[0.13] rounded-none p-6 gap-4 sm:max-w-md [&>button]:hidden">
        <DialogHeader>
          <DialogTitle className="font-[Cinzel] text-gray-100">
            Add {role === "instructor" ? "Instructor" : "Student"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-[Lato] text-[#c9a84c] uppercase tracking-widest font-semibold">
              Select User
            </label>
            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              className="w-full mt-2 px-3 py-2 bg-[#0a0f1e] border border-[#c9a84c]/[0.13] text-gray-200 text-sm font-[Lato] focus:outline-none focus:border-[#c9a84c]/50"
            >
              <option value="">Choose a user...</option>
              {availableUsers.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-2 justify-end pt-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-gray-200 text-sm font-[Lato] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAdd}
              disabled={!selectedUserId || isLoading}
              className="px-3 py-1.5 bg-[#c9a84c]/20 hover:bg-[#c9a84c]/30 border border-[#c9a84c]/40 text-[#c9a84c] text-sm font-[Lato] disabled:opacity-50 transition-colors"
            >
              {isLoading ? "Adding..." : "Add"}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Students Dialog ──────────────────────────────────────────────────────────

function StudentsDialog({ 
  course, 
  open, 
  onClose, 
  students,
  allUsers,
  onAddStudent,
  onDeleteStudent,
}: {
  course: Course;
  open: boolean;
  onClose: () => void;
  students: CourseMember[] | undefined;
  allUsers: User[] | undefined;
  onAddStudent: (userId: string) => Promise<void>;
  onDeleteStudent: (memberId: string) => Promise<void>;
}) {
  const [addStudentOpen, setAddStudentOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  return (
    <>
      <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
        <DialogContent className="bg-[#080e20] border border-[#c9a84c]/[0.13] rounded-none p-0 gap-0 sm:max-w-2xl [&>button]:hidden">

          {/* Header */}
          <div className="bg-gradient-to-br from-[#0d1535] to-[#0a1628] border-b border-[#c9a84c]/[0.13] px-6 py-5">
            <div className="h-px bg-gradient-to-r from-transparent via-[#c9a84c]/40 to-transparent mb-4" />
            <DialogHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-none bg-green-400/10 border border-green-400/20 flex items-center justify-center">
                    <Users size={15} className="text-green-400" />
                  </div>
                  <div>
                    <p className="page-label mb-0.5">Enrolled Students</p>
                    <DialogTitle className="font-[Cinzel] text-base text-gray-100 font-bold m-0">
                      {course.name}
                    </DialogTitle>
                  </div>
                </div>
                <button
                  onClick={() => setAddStudentOpen(true)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#c9a84c]/15 border border-[#c9a84c]/30 text-[#c9a84c] text-[0.6rem] tracking-widest uppercase font-[Lato] font-semibold hover:bg-[#c9a84c]/25 transition-colors"
                >
                  <Plus size={12} />
                  Add
                </button>
              </div>
            </DialogHeader>
          </div>

          {/* Body */}
          <div className="px-6 py-4">
            {students && students.length > 0 ? (
              <div className="border border-[#c9a84c]/[0.13]">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-[#c9a84c]/[0.13] hover:bg-transparent">
                      <TableHead className="text-[#c9a84c] font-semibold">Name</TableHead>
                      <TableHead className="text-[#c9a84c] font-semibold">Email</TableHead>
                      <TableHead className="text-[#c9a84c] font-semibold text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.map((s) => (
                      <TableRow key={s._id} className="border-b border-[#c9a84c]/[0.07] hover:bg-[#c9a84c]/[0.03]">
                        <TableCell className="text-gray-200 font-[Lato] text-sm">{s.user?.name || "Unknown"}</TableCell>
                        <TableCell className="text-gray-400 font-[Lato] text-sm">{s.user?.email || "N/A"}</TableCell>
                        <TableCell className="text-right">
                          <button
                            onClick={() => onDeleteStudent(s._id)}
                            disabled={deletingId === s._id}
                            className="p-1 hover:bg-red-400/10 text-gray-400 hover:text-red-400 transition-colors disabled:opacity-50"
                          >
                            <Trash2 size={14} />
                          </button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-3 py-10 text-[#475569]">
                <Users size={36} className="opacity-40" />
                <p className="font-[Lato] text-sm text-gray-400">No students enrolled yet.</p>
              </div>
            )}
          </div>

          {/* Footer count */}
          {students && students.length > 0 && (
            <div className="px-6 py-3 border-t border-[#c9a84c]/[0.13] flex justify-between items-center">
              <span className="font-[Lato] text-[0.6rem] tracking-widest uppercase text-[#c9a84c]/50">
                Total Enrolled
              </span>
              <span className="font-[Cinzel] text-sm text-[#c9a84c]">{students.length}</span>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AddMemberDialog
        open={addStudentOpen}
        onClose={() => setAddStudentOpen(false)}
        courseId={course._id}
        role="student"
        allUsers={allUsers}
        currentMembers={students}
        onAdd={(userId) => onAddStudent(userId)}
      />
    </>
  );
}

// ─── Course Card ──────────────────────────────────────────────────────────────

function CourseCard({ course }: { course: Course }) {
  const [studentsOpen, setStudentsOpen] = useState(false);
  const [addInstructorOpen, setAddInstructorOpen] = useState(false);
  const [deletingInstructor, setDeletingInstructor] = useState<string | null>(null);

  const instructors = useQuery(api._courses.getCourseMembersByRole, {
    courseId: course._id as any,
    role: "instructor",
  });
  const students = useQuery(api._courses.getCourseMembersByRole, {
    courseId: course._id as any,
    role: "student",
  });
  const allUsers = useQuery(api._courses.getAllUsers);

  const addCourseMember = useMutation(api._courses.addCourseMember);
  const deleteCourseMember = useMutation(api._courses.deleteCourseMember);

  const instructorNames = useMemo(
    () => instructors?.map((i: CourseMember) => i.user?.name || "Unknown").join(", ") || "N/A",
    [instructors]
  );

  const isActive = course.status === "active";

  const handleAddMember = async (userId: string, role: string) => {
    try {
      await addCourseMember({
        courseId: course._id as any,
        userId: userId as any,
        role,
      });
    } catch (error) {
      console.error("Error adding member:", error);
      alert("Error adding member. User might already be in this course.");
    }
  };

  const handleDeleteMember = async (memberId: string) => {
    setDeletingInstructor(memberId);
    try {
      await deleteCourseMember({ memberId: memberId as any });
    } catch (error) {
      console.error("Error deleting member:", error);
      alert("Error deleting member");
    } finally {
      setDeletingInstructor(null);
    }
  };

  return (
    <>
      <div className="group relative bg-gradient-to-br from-[#0a0f1e] to-[#0d1535] border border-[#c9a84c]/[0.13] p-[22px] overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-[#c9a84c]/30 hover:shadow-[0_20px_40px_rgba(201,168,76,0.08)] cursor-pointer">

        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#c9a84c] to-transparent opacity-60" />

        {/* Code + Status */}
        <div className="flex justify-between items-start mb-3.5">
          <div className="flex items-center gap-2 font-[Lato] text-[0.7rem] tracking-[0.2em] uppercase text-[#c9a84c] font-bold">
            <BookOpen size={13} />
            {course.courseCode}
          </div>
          <span className={`text-[0.6rem] tracking-widest uppercase px-2.5 py-1 border font-semibold
            ${isActive
              ? "bg-green-400/[0.07] border-green-400/25 text-green-400"
              : "bg-red-400/[0.07] border-red-400/25 text-red-400"
            }`}>
            {course.status}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-[Cinzel] text-[1.05rem] font-bold text-gray-100 mb-2 leading-snug">
          {course.name}
        </h3>

        {/* Description */}
        <p className="font-[Lato] text-sm text-slate-300 mb-4 leading-relaxed line-clamp-2">
          {course.description}
        </p>

        {/* Meta rows */}
        <div className="space-y-2.5 pb-4 mb-4 border-b border-[#c9a84c]/[0.07]">
          <div className="flex items-center gap-2 font-[Lato] text-sm text-gray-400">
            <Clock size={12} className="text-[#c9a84c] shrink-0" />
            <span className="text-[#c9a84c] font-semibold text-xs mr-1">Duration:</span>
            {course.duration}
          </div>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 font-[Lato] text-sm text-gray-400">
              <UserCircle2 size={12} className="text-[#c9a84c] shrink-0" />
              <span className="text-[#c9a84c] font-semibold text-xs mr-1">Instructor:</span>
              <span className="truncate">{instructorNames}</span>
            </div>
            <button
              onClick={() => setAddInstructorOpen(true)}
              title="Assign Instructor"
              className="p-1 hover:bg-[#c9a84c]/20 text-[#c9a84c] transition-colors shrink-0"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setStudentsOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-green-400/10 border border-green-400/20 text-green-400 text-[0.65rem] tracking-widest uppercase font-[Lato] font-semibold transition-all hover:bg-green-400/20 hover:border-green-400/50"
          >
            <Users size={13} />
            Students
            {students && (
              <span className="ml-1 bg-green-400/20 px-1.5 py-0.5 text-[0.55rem]">
                {students.length}
              </span>
            )}
          </button>

          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#c9a84c]/[0.13] border border-[#c9a84c]/25 text-[#c9a84c] text-[0.65rem] tracking-widest uppercase font-[Lato] font-semibold transition-all hover:bg-[#c9a84c]/25 hover:border-[#c9a84c]/60">
            <Eye size={13} />
            View
          </button>
        </div>
      </div>

      <StudentsDialog
        course={course}
        open={studentsOpen}
        onClose={() => setStudentsOpen(false)}
        students={students}
        allUsers={allUsers}
        onAddStudent={(userId) => handleAddMember(userId, "student")}
        onDeleteStudent={handleDeleteMember}
      />

      <AddMemberDialog
        open={addInstructorOpen}
        onClose={() => setAddInstructorOpen(false)}
        courseId={course._id}
        role="instructor"
        allUsers={allUsers}
        currentMembers={instructors}
        onAdd={(userId) => handleAddMember(userId, "instructor")}
      />
    </>
  );
}

// ─── Programs Page ────────────────────────────────────────────────────────────

export default function ProgramsPage() {
  const courses = useQuery(api._courses.getAllCourses);
  const coursesData = useMemo<Course[]>(() => courses ?? [], [courses]);

  return (
    <div className="min-h-[480px] p-6">
      {coursesData.length > 0 ? (
        <div className="grid gap-6" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))" }}>
          {coursesData.map((course) => (
            <CourseCard key={course._id} course={course} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-4 py-16 text-[#475569]">
          <BookOpen size={40} className="opacity-40" />
          <p className="font-[Lato] text-sm text-gray-400">No courses available yet.</p>
        </div>
      )}
    </div>
  );
}