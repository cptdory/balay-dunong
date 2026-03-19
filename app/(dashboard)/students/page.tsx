"use client";

import { useMemo, useState, useRef } from "react";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Camera, User, Pencil, X, Save, Loader2, Mail, Phone, MapPin, Calendar, Hash, ShieldCheck } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type StudentStatus = "Active" | "Inactive" | "Pending";

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

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getInitials(name: string) {
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

// ─── Status Badge ─────────────────────────────────────────────────────────────

const statusStyles: Record<StudentStatus, string> = {
  Active:   "border-green-400/20 text-green-400",
  Inactive: "border-red-400/20 text-red-400",
  Pending:  "border-[#c9a84c]/30 text-[#c9a84c]",
};

const dotStyles: Record<StudentStatus, string> = {
  Active:   "bg-green-400",
  Inactive: "bg-red-400",
  Pending:  "bg-[#c9a84c]",
};

function StatusBadge({ status }: { status: StudentStatus }) {
  return (
    <span className={`inline-flex items-center gap-1.5 text-[0.6rem] tracking-widest uppercase px-2.5 py-0.5 border font-semibold font-[Lato] ${statusStyles[status]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotStyles[status]}`} />
      {status}
    </span>
  );
}

// ─── Avatar ───────────────────────────────────────────────────────────────────

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
    <div className="relative w-[88px] h-[88px]">
      <div className="w-full h-full rounded-full overflow-hidden border-2 border-[#c9a84c]/30 bg-gradient-to-br from-[#0d1535] to-[#132045] flex items-center justify-center">
        {avatar
          ? <img src={avatar} alt={name} className="w-full h-full object-cover" />
          : <span className="font-[Cinzel] text-[1.4rem] text-[#c9a84c] font-bold">{getInitials(name)}</span>
        }
      </div>
      {editable && (
        <>
          <button type="button" onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-0 right-0 w-[26px] h-[26px] rounded-full bg-[#c9a84c] border-2 border-[#080e20] flex items-center justify-center cursor-pointer hover:bg-[#e8d49a] transition-colors">
            <Camera size={12} color="#0a0f1e" />
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
        </>
      )}
    </div>
  );
}

// ─── Detail Field (View Mode) ─────────────────────────────────────────────────

function DetailField({ icon, label, value }: { icon: React.ReactNode; label: string; value?: string }) {
  return (
    <div className="flex gap-3 py-3 border-b border-[#c9a84c]/[0.07] last:border-b-0">
      <div className="w-8 h-8 shrink-0 rounded-md bg-[#c9a84c]/[0.07] border border-[#c9a84c]/[0.13] flex items-center justify-center text-[#c9a84c]/60">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="font-[Lato] text-[0.58rem] tracking-[0.18em] uppercase text-[#c9a84c]/60 mb-0.5">{label}</p>
        <p className={`font-[Lato] text-sm ${value ? "text-gray-200" : "text-[#475569] italic"}`}>
          {value || "Not provided"}
        </p>
      </div>
    </div>
  );
}

// ─── Edit Field ───────────────────────────────────────────────────────────────

function EditField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Label className="font-[Lato] text-[0.6rem] tracking-[0.18em] uppercase text-[#c9a84c] block mb-1.5">
        {label}
      </Label>
      {children}
    </div>
  );
}

const inputCls = "bg-[#080e20] border-[#c9a84c]/20 text-gray-200 focus:border-[#c9a84c] focus-visible:ring-0 placeholder:text-[#334155] rounded-none h-9 text-sm";

// ─── Mini Avatar (table) ──────────────────────────────────────────────────────

function MiniAvatar({ avatar, name }: { avatar?: string; name: string }) {
  return (
    <div className="w-7 h-7 rounded-full shrink-0 bg-gradient-to-br from-[#c9a84c]/20 to-[#c9a84c]/[0.07] border border-[#c9a84c]/20 flex items-center justify-center font-[Cinzel] text-[0.6rem] text-[#c9a84c] font-bold overflow-hidden">
      {avatar
        ? <img src={avatar} alt="" className="w-full h-full object-cover" />
        : getInitials(name)
      }
    </div>
  );
}

// ─── Student Dialog ───────────────────────────────────────────────────────────

function StudentDialog({ student, onClose }: { student: Student; onClose: () => void }) {
  const updateStudentMutation = useMutation(api._users.updateStudent);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<Student>(student);
  const [isSaving, setIsSaving] = useState(false);

  const patch = (field: keyof Student, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateStudentMutation({
        id: form.id as any,
        name: form.name, email: form.email,
        birthday: form.birthday, address: form.address,
        phone: form.phone, avatar: form.avatar, status: form.status,
      });
      setIsEditing(false);
    } catch (err) {
      console.error("Save failed:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => { setForm(student); setIsEditing(false); };

  return (
    // DialogContent from shadcn already renders its own X close button.
    // We set our own header layout and suppress the default one via hideClose.
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="p-0 gap-0 overflow-hidden sm:max-w-xl rounded-none border-[#c9a84c]/20 bg-[#080e20] [&>button]:hidden"
        style={{ maxHeight: "90vh" }}
      >
        {/* ── Banner ── */}
        <div className="bg-gradient-to-br from-[#0d1535] to-[#0a1628] border-b border-[#c9a84c]/[0.13] px-7 pt-6 pb-5">
          <div className="h-px bg-gradient-to-r from-transparent via-[#c9a84c]/40 to-transparent mb-5" />
          <div className="flex items-center gap-5">
            <Avatar
              avatar={form.avatar} name={form.name}
              editable={isEditing}
              onAvatarChange={(v) => patch("avatar", v)}
            />
            <div className="flex-1 min-w-0">
              <p className="page-label mb-1">Student Profile</p>
              <h2 className="font-[Cinzel] font-bold text-lg text-gray-100 mb-2 truncate">{form.name}</h2>
              <StatusBadge status={form.status} />
            </div>
            {/* Single close button */}
            <button onClick={onClose} className="self-start text-[#475569] hover:text-gray-300 transition-colors p-1">
              <X size={16} />
            </button>
          </div>
        </div>

        {/* ── Body ── */}
        <div className="overflow-y-auto px-7 py-5" style={{ maxHeight: "calc(90vh - 220px)" }}>
          <div className="flex items-center justify-between mb-4">
            <span className="font-[Lato] text-[0.6rem] tracking-[0.2em] uppercase text-[#c9a84c]/40">
              {isEditing ? "Editing Profile" : "Profile Details"}
            </span>
            {!isEditing && (
              <button onClick={() => setIsEditing(true)}
                className="flex items-center gap-1.5 border border-[#c9a84c]/20 text-[#c9a84c]/60 hover:border-[#c9a84c] hover:text-[#c9a84c] text-[0.6rem] tracking-widest uppercase font-[Lato] px-3 py-1 transition-colors">
                <Pencil size={11} /> Edit
              </button>
            )}
          </div>

          {!isEditing ? (
            <div>
              <DetailField icon={<Hash size={13} />}        label="Student ID"      value={form.id} />
              <DetailField icon={<User size={13} />}        label="Full Name"       value={form.name} />
              <DetailField icon={<Mail size={13} />}        label="Email"           value={form.email} />
              <DetailField icon={<Phone size={13} />}       label="Phone"           value={form.phone} />
              <DetailField icon={<MapPin size={13} />}      label="Address"         value={form.address} />
              <DetailField icon={<Calendar size={13} />}    label="Birthday"        value={form.birthday} />
              <DetailField icon={<Calendar size={13} />}    label="Enrolled"        value={form.enrollmentDate} />
              <DetailField icon={<ShieldCheck size={13} />} label="Status"          value={form.status} />
            </div>
          ) : (
            <div className="flex flex-col gap-3.5">
              <div className="grid grid-cols-2 gap-3">
                <EditField label="Full Name">
                  <Input className={inputCls} value={form.name} onChange={(e) => patch("name", e.target.value)} />
                </EditField>
                <EditField label="Email">
                  <Input className={inputCls} type="email" value={form.email} onChange={(e) => patch("email", e.target.value)} />
                </EditField>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <EditField label="Phone">
                  <Input className={inputCls} value={form.phone || ""} onChange={(e) => patch("phone", e.target.value)} placeholder="+63 912 345 6789" />
                </EditField>
                <EditField label="Birthday">
                  <Input className={inputCls} type="date" value={form.birthday || ""} onChange={(e) => patch("birthday", e.target.value)} />
                </EditField>
              </div>
              <EditField label="Address">
                <Input className={inputCls} value={form.address || ""} onChange={(e) => patch("address", e.target.value)} placeholder="Street, City, Province" />
              </EditField>
              <EditField label="Status">
                <Select value={form.status} onValueChange={(v) => patch("status", v)}>
                  <SelectTrigger className={`${inputCls} w-full`}><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-[#0d1535] border-[#c9a84c]/20 rounded-none">
                    {(["Active", "Inactive", "Pending"] as StudentStatus[]).map((s) => (
                      <SelectItem key={s} value={s} className="text-gray-200 focus:bg-[#c9a84c]/[0.07] focus:text-[#c9a84c]">{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </EditField>
            </div>
          )}
        </div>

        {/* ── Footer (edit mode only) ── */}
        {isEditing && (
          <div className="flex justify-end gap-2 px-7 py-4 border-t border-[#c9a84c]/[0.13] bg-[#080e20]">
            <Button type="button" variant="outline" onClick={handleCancel} disabled={isSaving}
              className="border-[#c9a84c]/20 text-[#c9a84c]/60 hover:bg-[#c9a84c]/[0.07] hover:text-[#c9a84c] rounded-none text-[0.6rem] tracking-widest uppercase h-8">
              <X size={12} className="mr-1" /> Cancel
            </Button>
            <Button type="button" onClick={handleSave} disabled={isSaving}
              className="bg-[#c9a84c] text-[#0a0f1e] hover:bg-[#e8d49a] rounded-none text-[0.6rem] tracking-widest uppercase h-8 font-semibold">
              {isSaving ? <Loader2 size={12} className="mr-1 animate-spin" /> : <Save size={12} className="mr-1" />}
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

// ─── Students Page ────────────────────────────────────────────────────────────

export default function StudentsPage() {
  const studentStats = useQuery(api._users.getStudents, { role: "student" });
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const studentsData = useMemo<Student[]>(
    () =>
      studentStats?.students?.map((s) => ({
        id: s._id, name: s.name, email: s.email,
        status: (s.status as StudentStatus) ?? "Pending",
        enrollmentDate: new Date(s._creationTime).toISOString().split("T")[0],
        birthday: s.birthday, address: s.address, phone: s.phone, avatar: s.avatar,
      })) ?? [],
    [studentStats]
  );

  const columns = useMemo<ColumnDef<Student>[]>(() => [
    {
      accessorKey: "name", header: "Name",
      cell: ({ row }) => (
        <div className="flex items-center gap-2.5">
          <MiniAvatar avatar={row.original.avatar} name={row.original.name} />
          <span className="text-gray-200 text-sm">{row.original.name}</span>
        </div>
      ),
    },
    { accessorKey: "email", header: "Email" },
    {
      accessorKey: "status", header: "Status",
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    { accessorKey: "enrollmentDate", header: "Enrolled" },
    {
      id: "actions", header: "",
      cell: ({ row }) => (
        <button onClick={() => setSelectedStudent(row.original)}
          className="border border-[#c9a84c]/20 text-[#c9a84c]/60 hover:border-[#c9a84c] hover:text-[#c9a84c] text-[0.6rem] tracking-[0.12em] uppercase font-[Lato] px-3 py-1 transition-colors">
          View →
        </button>
      ),
    },
  ], []);

  const table = useReactTable({ data: studentsData, columns, getCoreRowModel: getCoreRowModel() });

  return (
    <>
      <div className="empty-content" style={{ minHeight: 480, display: "block", padding: "24px" }}>
        <p className="text-sm text-gray-400 mb-6">Manage and view all registered students.</p>
        <div className="rounded-md border border-[#c9a84c]/[0.13]">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((hg) => (
                <TableRow key={hg.id} className="border-b-[#c9a84c]/[0.13] hover:bg-transparent">
                  {hg.headers.map((h) => (
                    <TableHead key={h.id} className="text-[#c9a84c]">
                      {h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && "selected"} className="border-b-[#c9a84c]/[0.13] hover:bg-[#c9a84c]/[0.03]">
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="text-gray-300">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center text-gray-400">No results.</TableCell>
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