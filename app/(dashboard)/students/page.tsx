"use client";

import { useMemo, useState, useRef } from "react";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  Camera, Pencil, X, Save, Loader2,
  GraduationCap, Search,
} from "lucide-react";
import { sileo } from "sileo";

// ─── Types ────────────────────────────────────────────────────────────────────

type StudentStatus = "active" | "inactive" | "pending";

type Student = {
  id: string;
  name: string;
  email: string;
  status: StudentStatus;
  enrollmentDate: string;
  birthday?: string;
  address?: string;
  phone?: string;
  avatar?: string;
};

// ─── Shared styles ────────────────────────────────────────────────────────────

// Both view and edit use the same field container — inputs in edit, static divs in view
const fieldCls = "w-full mt-1.5 px-3 py-2 bg-[#0a0f1e] border border-[#c9a84c]/[0.13] text-gray-200 text-sm font-[Lato] focus:outline-none focus:border-[#c9a84c]/50 placeholder:text-[#334155]";
const labelCls = "text-[0.6rem] font-[Lato] text-[#c9a84c] uppercase tracking-widest font-semibold block";

// ─── ProfileField — shared shell used in both modes ───────────────────────────

function ProfileField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      {children}
    </div>
  );
}

// Static display box — looks identical to an input but is just text
function FieldValue({ value }: { value?: string }) {
  return (
    <div className={`${fieldCls} mt-1.5 ${!value ? "text-[#475569] italic" : ""}`}>
      {value || "Not provided"}
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getInitials(name: string) {
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

// ─── Status Badge ─────────────────────────────────────────────────────────────

const statusStyles: Record<StudentStatus, string> = {
  active: "bg-green-400/[0.07] border-green-400/25 text-green-400",
  inactive: "bg-red-400/[0.07] border-red-400/25 text-red-400",
  pending: "bg-[#c9a84c]/[0.07] border-[#c9a84c]/25 text-[#c9a84c]",
};

const dotStyles: Record<StudentStatus, string> = {
  active: "bg-green-400",
  inactive: "bg-red-400",
  pending: "bg-[#c9a84c]",
};

function StatusBadge({ status }: { status: StudentStatus }) {
  return (
    <span className={`inline-flex items-center gap-1.5 text-[0.55rem] tracking-[0.15em] uppercase px-2.5 py-1 border font-bold font-[Lato] ${statusStyles[status]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotStyles[status]}`} />
      {status}
    </span>
  );
}

// ─── Mini Avatar (table) ──────────────────────────────────────────────────────

function MiniAvatar({ avatar, name }: { avatar?: string; name: string }) {
  return (
    <div className="w-7 h-7 rounded-full shrink-0 overflow-hidden border border-[#c9a84c]/20 bg-gradient-to-br from-[#c9a84c]/20 to-[#c9a84c]/[0.05] flex items-center justify-center font-[Cinzel] text-[0.6rem] text-[#c9a84c] font-bold">
      {avatar ? <img src={avatar} alt="" className="w-full h-full object-cover" /> : getInitials(name)}
    </div>
  );
}

// ─── Dialog Avatar ────────────────────────────────────────────────────────────

function Avatar({ avatar, name, editable = false, onAvatarChange }: {
  avatar?: string; name: string; editable?: boolean; onAvatarChange?: (v: string) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onAvatarChange) return;
    const reader = new FileReader();
    reader.onload = (ev) => onAvatarChange(ev.target?.result as string);
    reader.readAsDataURL(file);
  };
  return (
    <div className="relative w-[80px] h-[80px]">
      <div className="w-full h-full rounded-full overflow-hidden border-2 border-[#c9a84c]/30 bg-gradient-to-br from-[#0d1535] to-[#132045] flex items-center justify-center">
        {avatar
          ? <img src={avatar} alt={name} className="w-full h-full object-cover" />
          : <span className="font-[Cinzel] text-xl text-[#c9a84c] font-bold">{getInitials(name)}</span>
        }
      </div>
      {editable && (
        <>
          <button type="button" onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-0 right-0 w-[24px] h-[24px] rounded-full bg-[#c9a84c] border-2 border-[#080e20] flex items-center justify-center hover:bg-[#e8d49a] transition-colors">
            <Camera size={11} color="#0a0f1e" />
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
        </>
      )}
    </div>
  );
}

// ─── Student Dialog ───────────────────────────────────────────────────────────

function StudentDialog({ student, onClose }: { student: Student; onClose: () => void }) {
  const updateStudentMutation = useMutation(api._users.updateUsers);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<Student>(student);
  const [isSaving, setIsSaving] = useState(false);

  const patch = (field: keyof Student, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateStudentMutation({
        id: form.id as any, name: form.name, email: form.email,
        birthday: form.birthday, address: form.address,
        phone: form.phone, avatar: form.avatar, status: form.status,
      });
      sileo.success({
        title: "Student profile updated successfully",
        fill: "#171717"
      });
      setIsEditing(false);
    } catch {
      sileo.error({
        title: "Error updating student profile",
        fill: "#171717"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => { setForm(student); setIsEditing(false); };

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="p-0 gap-0 overflow-hidden sm:max-w-xl rounded-none border-[#c9a84c]/20 bg-[#080e20] [&>button]:hidden" style={{ maxHeight: "90vh" }}>

        {/* Banner */}
        <div className="bg-gradient-to-br from-[#0d1535] to-[#0a1628] border-b border-[#c9a84c]/[0.13] px-6 pt-5 pb-5">
          <DialogTitle className="sr-only">Student Profile</DialogTitle>
          <div className="h-px bg-gradient-to-r from-transparent via-[#c9a84c]/40 to-transparent mb-5" />
          <div className="flex items-center gap-4">
            <Avatar avatar={form.avatar} name={form.name} editable={isEditing} onAvatarChange={(v) => patch("avatar", v)} />
            <div className="flex-1 min-w-0">
              <p className="page-label mb-1">Student Profile</p>
              <h2 className="font-[Cinzel] font-bold text-lg text-gray-100 mb-2 truncate">{form.name}</h2>
              <StatusBadge status={form.status} />
            </div>
            <button onClick={onClose} className="self-start text-[#475569] hover:text-gray-300 transition-colors p-1">
              <X size={15} />
            </button>
          </div>
        </div>

        {/* Mode bar */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-[#c9a84c]/[0.07] bg-[#080e20]">
          <span className="font-[Lato] text-[0.55rem] tracking-[0.2em] uppercase text-[#c9a84c]/40">
            {isEditing ? "Editing Profile" : "Profile Details"}
          </span>
          {!isEditing ? (
            <button onClick={() => setIsEditing(true)}
              className="flex items-center gap-1.5 border border-[#c9a84c]/20 text-[#c9a84c]/60 hover:border-[#c9a84c] hover:text-[#c9a84c] text-[0.6rem] tracking-widest uppercase font-[Lato] px-3 py-1 transition-colors">
              <Pencil size={11} /> Edit
            </button>
          ) : (
            <div className="flex gap-2">
              <button onClick={handleCancel} disabled={isSaving}
                className="flex items-center gap-1.5 px-3 py-1 border border-[#c9a84c]/20 text-[#c9a84c]/60 hover:text-[#c9a84c] hover:border-[#c9a84c]/40 text-[0.6rem] font-[Lato] uppercase tracking-widest transition-colors disabled:opacity-50">
                <X size={11} /> Cancel
              </button>
              <button onClick={handleSave} disabled={isSaving}
                className="flex items-center gap-1.5 px-3 py-1 bg-[#c9a84c]/20 hover:bg-[#c9a84c]/30 border border-[#c9a84c]/40 text-[#c9a84c] text-[0.6rem] font-[Lato] uppercase tracking-widest transition-colors disabled:opacity-50">
                {isSaving ? <Loader2 size={11} className="animate-spin" /> : <Save size={11} />}
                {isSaving ? "Saving…" : "Save"}
              </button>
            </div>
          )}
        </div>

        {/* Body — identical layout in both modes, only content differs */}
        <div className="overflow-y-auto px-6 py-5" style={{ maxHeight: "calc(90vh - 220px)" }}>
          <div className="flex flex-col gap-4">

            {/* Row 1: Name + Email */}
            <div className="grid grid-cols-2 gap-4">
              <ProfileField label="Full Name">
                {isEditing
                  ? <input className={fieldCls} value={form.name} onChange={(e) => patch("name", e.target.value)} placeholder="Full name" />
                  : <FieldValue value={form.name} />
                }
              </ProfileField>
              <ProfileField label="Email">
                {isEditing
                  ? <input className={fieldCls} type="email" value={form.email} onChange={(e) => patch("email", e.target.value)} placeholder="Email address" />
                  : <FieldValue value={form.email} />
                }
              </ProfileField>
            </div>

            {/* Row 2: Phone + Birthday */}
            <div className="grid grid-cols-2 gap-4">
              <ProfileField label="Phone">
                {isEditing
                  ? <input className={fieldCls} value={form.phone || ""} onChange={(e) => patch("phone", e.target.value)} placeholder="+63 912 345 6789" />
                  : <FieldValue value={form.phone} />
                }
              </ProfileField>
              <ProfileField label="Birthday">
                {isEditing
                  ? <input className={fieldCls} type="date" value={form.birthday || ""} onChange={(e) => patch("birthday", e.target.value)} />
                  : <FieldValue value={form.birthday} />
                }
              </ProfileField>
            </div>

            {/* Address */}
            <ProfileField label="Address">
              {isEditing
                ? <input className={fieldCls} value={form.address || ""} onChange={(e) => patch("address", e.target.value)} placeholder="Street, City, Province" />
                : <FieldValue value={form.address} />
              }
            </ProfileField>

            {/* Row 3: Enrolled + Status */}
            <div className="grid grid-cols-2 gap-4">
              <ProfileField label="Enrolled">
                <FieldValue value={form.enrollmentDate} />
              </ProfileField>
              <ProfileField label="Status">
                {isEditing
                  ? (
                    <select className={fieldCls} value={form.status} onChange={(e) => patch("status", e.target.value)}>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="pending">Pending</option>
                    </select>
                  )
                  : <FieldValue value={form.status} />
                }
              </ProfileField>
            </div>

            {/* Student ID — always read-only */}
            <ProfileField label="Student ID">
              <FieldValue value={form.id} />
            </ProfileField>

          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Students Page ────────────────────────────────────────────────────────────

export default function StudentsPage() {
  const studentStats = useQuery(api._users.getUsers, { role: "student" });
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [search, setSearch] = useState("");

  const studentsData = useMemo<Student[]>(
    () =>
      studentStats?.users?.map((s) => ({
        id: s._id, name: s.name, email: s.email,
        status: (s.status as StudentStatus) ?? "pending",
        enrollmentDate: new Date(s._creationTime).toISOString().split("T")[0],
        birthday: s.birthday, address: s.address, phone: s.phone, avatar: s.avatar,
      })) ?? [],
    [studentStats]
  );

  const filtered = useMemo(() =>
    studentsData.filter((s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase())
    ), [studentsData, search]
  );

  const columns = useMemo<ColumnDef<Student>[]>(() => [
    {
      accessorKey: "name", header: "Name",
      cell: ({ row }) => (
        <div className="flex items-center gap-2.5">
          <MiniAvatar avatar={row.original.avatar} name={row.original.name} />
          <span className="font-[Lato] text-sm text-gray-200">{row.original.name}</span>
        </div>
      ),
    },
    {
      accessorKey: "email", header: "Email",
      cell: ({ row }) => <span className="font-[Lato] text-sm text-gray-400">{row.original.email}</span>,
    },
    {
      accessorKey: "status", header: "Status",
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      accessorKey: "enrollmentDate", header: "Enrolled",
      cell: ({ row }) => <span className="font-[Lato] text-sm text-gray-400">{row.original.enrollmentDate}</span>,
    },
    {
      id: "actions", header: "",
      cell: ({ row }) => (
        <button onClick={() => setSelectedStudent(row.original)}
          className="border border-[#c9a84c]/20 text-[#c9a84c]/60 hover:border-[#c9a84c] hover:text-[#c9a84c] text-[0.6rem] tracking-widest uppercase font-[Lato] px-3 py-1 transition-colors">
          View →
        </button>
      ),
    },
  ], []);

  const table = useReactTable({ data: filtered, columns, getCoreRowModel: getCoreRowModel() });

  return (
    <>
      <div className="min-h-[480px] p-6">

        {/* Toolbar */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="page-label mb-0.5">Students Management</p>
            <p className="font-[Lato] text-sm text-gray-400">
              {studentsData.length} student{studentsData.length !== 1 ? "s" : ""} registered
            </p>
          </div>
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#c9a84c]/40" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search students…"
              className="pl-8 pr-4 py-2 bg-[#0a0f1e] border border-[#c9a84c]/[0.13] text-gray-200 text-sm font-[Lato] focus:outline-none focus:border-[#c9a84c]/50 placeholder:text-[#334155] w-56"
            />
          </div>
        </div>

        {/* Table */}
        <div className="border border-[#c9a84c]/[0.13]">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((hg) => (
                <TableRow key={hg.id} className="border-b border-[#c9a84c]/[0.13] hover:bg-transparent">
                  {hg.headers.map((h) => (
                    <TableHead key={h.id} className="text-[#c9a84c] font-[Lato] text-[0.65rem] tracking-widest uppercase">
                      {h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} className="border-b border-[#c9a84c]/[0.07] hover:bg-[#c9a84c]/[0.03] transition-colors">
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-32 text-center">
                    <div className="flex flex-col items-center gap-3 text-[#475569]">
                      <GraduationCap size={32} className="opacity-30" />
                      <p className="font-[Lato] text-sm">
                        {search ? "No students match your search." : "No students registered yet."}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {selectedStudent && (
        <StudentDialog student={selectedStudent} onClose={() => setSelectedStudent(null)} />
      )}
    </>
  );
}