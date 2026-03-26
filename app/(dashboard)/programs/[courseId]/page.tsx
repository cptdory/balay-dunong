"use client";

import { useParams } from "next/navigation";
import { useQuery, useMutation, useConvex } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState, useMemo } from "react";
import { sileo } from "sileo";
import {
  Plus, Pencil, Trash2, Save, Loader2,
  FileText, Video, Link as LinkIcon, Image as ImageIcon,
  BookOpen, Eye, ChevronDown, ChevronRight,
  GripVertical, Sparkles, FolderOpen, X,
  Upload, AlertCircle,
} from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

// ─── Types ────────────────────────────────────────────────────────────────────

type CourseSection = {
  _id: string;
  courseId: string;
  title: string;
  description?: string;
  order: number;
};

type CourseContent = {
  _id: string;
  courseId: string;
  sectionId: string;
  title: string;
  type: string;
  contentUrl?: string;
  textContent?: string;
  order: number;
};

// ─── Content Type Config ──────────────────────────────────────────────────────

const TYPE_CONFIG: Record<string, {
  icon: React.ReactNode;
  label: string;
  accent: string;
  bg: string;
  border: string;
  dot: string;
}> = {
  video: {
    icon: <Video size={13} strokeWidth={2} />,
    label: "Video",
    accent: "text-violet-400",
    bg: "bg-violet-500/10",
    border: "border-violet-500/25",
    dot: "bg-violet-400",
  },
  pdf: {
    icon: <FileText size={13} strokeWidth={2} />,
    label: "PDF",
    accent: "text-rose-400",
    bg: "bg-rose-500/10",
    border: "border-rose-500/25",
    dot: "bg-rose-400",
  },
  txt: {
    icon: <FileText size={13} strokeWidth={2} />,
    label: "Sketch",
    accent: "text-green-400",
    bg: "bg-green-500/10",
    border: "border-green-500/25",
    dot: "bg-green-400",
  },
  doc: {
    icon: <FileText size={13} strokeWidth={2} />,
    label: "Doc",
    accent: "text-sky-400",
    bg: "bg-sky-500/10",
    border: "border-sky-500/25",
    dot: "bg-sky-400",
  },
  link: {
    icon: <LinkIcon size={13} strokeWidth={2} />,
    label: "Link",
    accent: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/25",
    dot: "bg-amber-400",
  },
  image: {
    icon: <ImageIcon size={13} strokeWidth={2} />,
    label: "Image",
    accent: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/25",
    dot: "bg-emerald-400",
  },
};

function normalizeUrl(url: string) {
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

// ─── Type Badge ───────────────────────────────────────────────────────────────

function TypeBadge({ type }: { type: string }) {
  const cfg = TYPE_CONFIG[type] ?? TYPE_CONFIG.doc;
  return (
    <span
      className={`
        inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full
        text-[10px] font-bold uppercase tracking-wider font-mono
        border ${cfg.accent} ${cfg.bg} ${cfg.border}
      `}
    >
      {cfg.icon}
      {cfg.label}
    </span>
  );
}

// ─── Shared Form Primitives ───────────────────────────────────────────────────

const inputCls = `
  w-full mt-1.5 px-3.5 py-2.5 rounded-lg text-sm
  bg-[#0d1117] border border-white/[0.07]
  text-gray-200 placeholder:text-gray-600
  focus:outline-none focus:border-[#c9a84c]/40 focus:ring-1 focus:ring-[#c9a84c]/20
  transition-all duration-200 font-[Lato]
`;

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-0.5">
      <div className="flex items-baseline justify-between">
        <label className="text-[10px] font-bold uppercase tracking-widest text-[#c9a84c]/80 font-[Lato]">
          {label}
        </label>
        {hint && <span className="text-[10px] text-gray-600 font-[Lato]">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

// ─── Modal Shell ──────────────────────────────────────────────────────────────

function ModalShell({
  open, onClose, title, subtitle, children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="
        bg-[#0a0f1e] border border-white/[0.06] rounded-2xl p-0 gap-0
        shadow-2xl shadow-black/60 sm:max-w-lg [&>button]:hidden
        overflow-hidden
      ">
        {/* Gradient top bar */}
        <div className="h-px bg-gradient-to-r from-transparent via-[#c9a84c]/50 to-transparent" />

        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-5 pb-4">
          <div>
            {subtitle && (
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#c9a84c]/60 font-[Lato] mb-1">
                {subtitle}
              </p>
            )}
            <h2 className="font-[Cinzel] text-lg font-bold text-white">{title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-600 hover:text-gray-300 hover:bg-white/5 transition-colors mt-0.5"
          >
            <X size={16} />
          </button>
        </div>

        <div className="h-px bg-white/[0.05] mx-6" />

        {children}
      </DialogContent>
    </Dialog>
  );
}

function ModalFooter({
  onClose, onConfirm, isLoading, confirmLabel = "Save",
}: {
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
  confirmLabel?: string;
}) {
  return (
    <div className="flex items-center justify-end gap-2.5 px-6 py-4 border-t border-white/[0.05]">
      <button
        onClick={onClose}
        disabled={isLoading}
        className="
          px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-widest
          font-[Lato] text-gray-500 hover:text-gray-300 hover:bg-white/5
          transition-colors disabled:opacity-40
        "
      >
        Cancel
      </button>
      <button
        onClick={onConfirm}
        disabled={isLoading}
        className="
          inline-flex items-center gap-2 px-5 py-2 rounded-lg
          text-xs font-bold uppercase tracking-widest font-[Lato]
          bg-gradient-to-r from-[#c9a84c] to-[#e8c96a]
          text-[#0a0f1e] hover:opacity-90
          transition-all shadow-lg shadow-[#c9a84c]/20
          disabled:opacity-50 disabled:cursor-not-allowed
        "
      >
        {isLoading ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
        {isLoading ? "Saving…" : confirmLabel}
      </button>
    </div>
  );
}

// ─── Content Row ──────────────────────────────────────────────────────────────

function ContentRow({
  content, onEdit, onDelete, onView,
}: {
  content: CourseContent;
  onEdit: () => void;
  onDelete: () => Promise<void>;
  onView: () => Promise<void>;
}) {
  const [deleting, setDeleting] = useState(false);
  const [viewing, setViewing] = useState(false);
  const cfg = TYPE_CONFIG[content.type] ?? TYPE_CONFIG.doc;

  const isActionable =
    (["pdf", "doc", "image", "txt"].includes(content.type) && !!content.contentUrl) ||
    (content.type === "link" && !!content.contentUrl);

  return (
    <div className="
      group flex items-center gap-3.5 px-4 py-3
      hover:bg-white/[0.025] transition-colors duration-150
      border-b border-white/[0.04] last:border-b-0
    ">
      {/* Drag handle (visual) */}
      <GripVertical
        size={13}
        className="text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 cursor-grab"
      />

      {/* Color dot */}
      <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${cfg.dot}`} />

      {/* Type badge */}
      <TypeBadge type={content.type} />

      {/* Title */}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-200 font-[Lato] truncate">{content.title}</p>
        {content.type === "link" && content.contentUrl && (
          <p className="text-[11px] text-gray-600 font-[Lato] truncate mt-0.5">
            {content.contentUrl}
          </p>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        {isActionable && (
          <ActionButton
            onClick={async () => { setViewing(true); try { await onView(); } finally { setViewing(false); } }}
            loading={viewing}
            icon={<Eye size={13} />}
            title={content.type === "link" ? "Open link" : "Download"}
            color="text-emerald-400 hover:bg-emerald-400/10"
          />
        )}
        <ActionButton
          onClick={onEdit}
          icon={<Pencil size={13} />}
          title="Edit"
          color="text-[#c9a84c] hover:bg-[#c9a84c]/10"
        />
        <ActionButton
          onClick={async () => { setDeleting(true); try { await onDelete(); } finally { setDeleting(false); } }}
          loading={deleting}
          icon={<Trash2 size={13} />}
          title="Delete"
          color="text-red-400 hover:bg-red-400/10"
        />
      </div>
    </div>
  );
}

function ActionButton({
  onClick, loading, icon, title, color,
}: {
  onClick: () => void;
  loading?: boolean;
  icon: React.ReactNode;
  title: string;
  color: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      title={title}
      className={`p-1.5 rounded-md transition-colors disabled:opacity-40 ${color}`}
    >
      {loading ? <Loader2 size={13} className="animate-spin" /> : icon}
    </button>
  );
}

// ─── Section Card ─────────────────────────────────────────────────────────────

function SectionCard({
  section, index, onEditSection, onDeleteSection,
  onAddContent, onEditContent, onDeleteContent,
}: {
  section: CourseSection;
  index: number;
  onEditSection: () => void;
  onDeleteSection: () => void;
  onAddContent: () => void;
  onEditContent: (c: CourseContent) => void;
  onDeleteContent: (id: string) => Promise<void>;
}) {
  const convex = useConvex();
  const [expanded, setExpanded] = useState(true);
  const contents = useQuery(api._courses.getSectionContents, { sectionId: section._id as any });

  const count = contents?.length ?? 0;

  return (
    <div className="
      rounded-xl border border-white/[0.07] overflow-hidden
      bg-[#0d1117]
      shadow-lg shadow-black/30
      transition-all duration-200
    ">
      {/* Section Header */}
      <div className="
        flex items-center gap-3 px-5 py-4
        bg-gradient-to-r from-[#0f1623] to-[#0d1117]
        border-b border-white/[0.05]
        group/header
      ">
        {/* Collapse toggle + index */}
        <button
          onClick={() => setExpanded((v) => !v)}
          className="
            flex items-center gap-2.5 flex-1 min-w-0 text-left
          "
        >
          <div className="
            w-7 h-7 rounded-lg flex items-center justify-center shrink-0
            bg-[#c9a84c]/10 border border-[#c9a84c]/20
          ">
            <span className="text-[10px] font-black font-[Lato] text-[#c9a84c]">
              {String(index).padStart(2, "0")}
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-[Cinzel] text-sm font-bold text-gray-100 truncate">
                {section.title}
              </h3>
              <span className="
                shrink-0 text-[9px] font-bold uppercase tracking-widest
                font-[Lato] text-gray-600 px-1.5 py-0.5 rounded
                bg-white/[0.04] border border-white/[0.06]
              ">
                {count} item{count !== 1 ? "s" : ""}
              </span>
            </div>
            {section.description && (
              <p className="text-xs text-gray-600 font-[Lato] truncate mt-0.5">
                {section.description}
              </p>
            )}
          </div>

          <span className="text-gray-600 shrink-0">
            {expanded
              ? <ChevronDown size={15} />
              : <ChevronRight size={15} />
            }
          </span>
        </button>

        {/* Actions */}
        <div className="flex items-center gap-0.5 shrink-0 opacity-0 group-hover/header:opacity-100 transition-opacity">
          <ActionButton onClick={onEditSection} icon={<Pencil size={13} />} title="Edit section" color="text-[#c9a84c] hover:bg-[#c9a84c]/10" />
          <ActionButton onClick={onDeleteSection} icon={<Trash2 size={13} />} title="Delete section" color="text-red-400 hover:bg-red-400/10" />
        </div>
      </div>

      {/* Contents */}
      {expanded && (
        <div>
          {count > 0 ? (
            <div>
              {contents!.map((c) => (
                <ContentRow
                  key={c._id}
                  content={c}
                  onEdit={() => onEditContent(c)}
                  onDelete={() => onDeleteContent(c._id)}
                  onView={async () => {
                    if (["pdf", "doc", "image", "txt"].includes(c.type) && c.contentUrl) {
                      try {
                        const fileUrl = await convex.query(api._courses.getFileUrl, { storageId: c.contentUrl as any });
                        if (fileUrl) {
                          const res = await fetch(fileUrl);
                          const blob = await res.blob();
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement("a");
                          a.href = url;
                          a.download = c.title;
                          document.body.appendChild(a);
                          a.click();
                          a.remove();
                          URL.revokeObjectURL(url);
                        }
                      } catch {
                        sileo.error({
                          title: "Error downloading file",
                          fill: "#171717",
                        });
                      }
                    } else if (c.type === "link" && c.contentUrl) {
                      window.open(normalizeUrl(c.contentUrl), "_blank", "noopener,noreferrer");
                    }
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 py-8 px-4 text-center">
              <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center">
                <FolderOpen size={18} className="text-gray-700" />
              </div>
              <p className="text-xs text-gray-600 font-[Lato]">This section is empty</p>
            </div>
          )}

          {/* Add content button */}
          <button
            onClick={onAddContent}
            className="
              w-full flex items-center justify-center gap-2 py-3
              text-[10px] font-bold uppercase tracking-widest font-[Lato]
              text-gray-600 hover:text-[#c9a84c]
              border-t border-dashed border-white/[0.05] hover:border-[#c9a84c]/20
              hover:bg-[#c9a84c]/[0.02]
              transition-all duration-200
            "
          >
            <Plus size={12} />
            Add content
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Section Form Modal ────────────────────────────────────────────────────────

function SectionModal({
  open, onClose, section, courseId, nextOrder, onSave,
}: {
  open: boolean;
  onClose: () => void;
  section?: CourseSection;
  courseId: string;
  nextOrder: number;
  onSave: (data: any) => Promise<void>;
}) {
  const [form, setForm] = useState({ title: section?.title ?? "", description: section?.description ?? "" });
  const [loading, setLoading] = useState(false);

  const handle = async () => {
    if (!form.title.trim()) {
      sileo.error({
        title: "Missing field",
        fill: "#171717"
      });
      return;
    }
    setLoading(true);
    try {
      await onSave({
        ...form,
        order: section?.order ?? nextOrder,
        courseId: courseId as any,
        sectionId: section?._id as any,
      });
      onClose();
    } catch {
      sileo.error({
        title: "Failed to save section.",
        fill: "#171717"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title={section ? "Edit Section" : "New Section"}
      subtitle="Course Structure"
    >
      <div className="px-6 py-5 space-y-4">
        <Field label="Section Title" hint="Required">
          <input
            className={inputCls}
            value={form.title}
            onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
            placeholder="e.g. Getting Started"
            autoFocus
          />
        </Field>
        <Field label="Description" hint="Optional">
          <textarea
            className={`${inputCls} resize-none`}
            rows={3}
            value={form.description}
            onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
            placeholder="Brief overview of what learners will find here…"
          />
        </Field>
      </div>
      <ModalFooter onClose={onClose} onConfirm={handle} isLoading={loading} confirmLabel={section ? "Update Section" : "Create Section"} />
    </ModalShell>
  );
}

// ─── Content Form Modal ────────────────────────────────────────────────────────

const CONTENT_TYPES = [
  { value: "pdf", label: "PDF Document", icon: <FileText size={14} />, accept: ".pdf" },
  { value: "doc", label: "Word Document", icon: <FileText size={14} />, accept: ".doc,.docx" },
  { value: "image", label: "Image", icon: <ImageIcon size={14} />, accept: "image/*" },
  { value: "txt", label: "Sketch", icon: <ImageIcon size={14} />, accept: ".txt" },
  { value: "link", label: "External Link", icon: <LinkIcon size={14} />, accept: "" },
];

function ContentModal({
  open, onClose, content, sectionId, courseId, nextOrder, onSave,
}: {
  open: boolean;
  onClose: () => void;
  content?: CourseContent;
  sectionId: string;
  courseId: string;
  nextOrder: number;
  onSave: (data: any) => Promise<void>;
}) {
  const [form, setForm] = useState({
    title: content?.title ?? "",
    type: content?.type ?? "pdf",
    contentUrl: content?.contentUrl ?? "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const isFile = ["pdf", "doc", "image", "txt"].includes(form.type);
  const isLink = form.type === "link";
  const selectedType = CONTENT_TYPES.find((t) => t.value === form.type);

  const handle = async () => {
    if (!form.title.trim()) {
      sileo.error({
        title: "Missing field",
        fill: "#171717"
      });
      return;
    }
    if (!file && !form.contentUrl.trim()) {
      sileo.error({
        title: "Missing content",
        fill: "#171717"
      });
      return;
    }
    setLoading(true);
    try {
      await onSave({
        title: form.title, type: form.type, contentUrl: form.contentUrl,
        file,
        order: content?.order ?? nextOrder,
        courseId: courseId as any,
        sectionId: sectionId as any,
        contentId: content?._id as any,
      });
      onClose();
    } catch {
      sileo.error({
        title: "Failed to save content.",
        fill: "#171717"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title={content ? "Edit Content" : "Add Content"}
      subtitle="Section Material"
    >
      <div className="px-6 py-5 space-y-5">
        {/* Type selector */}
        <Field label="Content Type">
          <div className="grid grid-cols-2 gap-2 mt-1.5">
            {CONTENT_TYPES.map((t) => {
              const active = form.type === t.value;
              const cfg = TYPE_CONFIG[t.value];
              return (
                <button
                  key={t.value}
                  onClick={() => { setForm((p) => ({ ...p, type: t.value, contentUrl: "" })); setFile(null); }}
                  className={`
                    flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-sm
                    border transition-all duration-150 font-[Lato] text-left
                    ${active
                      ? `${cfg.bg} ${cfg.border} ${cfg.accent} font-semibold`
                      : "bg-white/[0.02] border-white/[0.06] text-gray-500 hover:border-white/[0.12] hover:text-gray-300"
                    }
                  `}
                >
                  {t.icon}
                  {t.label}
                </button>
              );
            })}
          </div>
        </Field>

        {/* Title */}
        <Field label="Title" hint="Required">
          <input
            className={inputCls}
            value={form.title}
            onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
            placeholder={`e.g. ${form.type === "link" ? "React Documentation" : "Module 1 Slides"}`}
            autoFocus
          />
        </Field>

        {/* File upload */}
        {isFile && (
          <Field label={`Upload ${selectedType?.label}`}>
            <label className="
              mt-1.5 flex flex-col items-center justify-center gap-2.5
              px-4 py-6 rounded-lg border-2 border-dashed
              border-white/[0.08] hover:border-[#c9a84c]/30
              cursor-pointer transition-colors group/upload
              bg-white/[0.01] hover:bg-[#c9a84c]/[0.02]
            ">
              <input
                type="file"
                className="hidden"
                accept={selectedType?.accept}
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) { setFile(f); setForm((p) => ({ ...p, contentUrl: f.name })); }
                }}
              />
              {file ? (
                <div className="flex items-center gap-2.5 text-emerald-400">
                  <div className="w-8 h-8 rounded-lg bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center">
                    <FileText size={15} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold font-[Lato]">{file.name}</p>
                    <p className="text-[10px] text-emerald-400/60 font-[Lato]">
                      {(file.size / 1024).toFixed(0)} KB · Ready to upload
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.07] flex items-center justify-center group-hover/upload:border-[#c9a84c]/20 transition-colors">
                    <Upload size={16} className="text-gray-600 group-hover/upload:text-[#c9a84c]/60 transition-colors" />
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500 font-[Lato]">
                      <span className="text-[#c9a84c]/70">Click to upload</span> or drag & drop
                    </p>
                    <p className="text-[10px] text-gray-700 font-[Lato] mt-0.5">
                      {selectedType?.accept?.toUpperCase().replace(/\./g, "").replace(/,/g, ", ")}
                    </p>
                  </div>
                </>
              )}
            </label>
          </Field>
        )}

        {/* Link URL */}
        {isLink && (
          <Field label="URL" hint="Required">
            <div className="relative">
              <LinkIcon size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600 mt-0.5" />
              <input
                className={`${inputCls} pl-9`}
                type="url"
                value={form.contentUrl}
                onChange={(e) => setForm((p) => ({ ...p, contentUrl: e.target.value }))}
                placeholder="https://example.com"
              />
            </div>
          </Field>
        )}
      </div>
      <ModalFooter onClose={onClose} onConfirm={handle} isLoading={loading} confirmLabel={content ? "Update" : "Add Content"} />
    </ModalShell>
  );
}

// ─── Stats Badge ──────────────────────────────────────────────────────────────

function StatBadge({ icon, value, label }: { icon: React.ReactNode; value: string | number; label: string }) {
  return (
    <div className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06]">
      <span className="text-[#c9a84c]/60">{icon}</span>
      <div>
        <p className="text-sm font-bold text-gray-200 font-[Cinzel] leading-none">{value}</p>
        <p className="text-[10px] text-gray-600 font-[Lato] mt-0.5">{label}</p>
      </div>
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-5 py-24 px-6">
      <div className="relative">
        <div className="w-16 h-16 rounded-2xl bg-[#c9a84c]/[0.07] border border-[#c9a84c]/[0.15] flex items-center justify-center">
          <BookOpen size={28} className="text-[#c9a84c]/40" />
        </div>
        <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#0d1117] border border-white/[0.08] flex items-center justify-center">
          <Sparkles size={9} className="text-[#c9a84c]/60" />
        </div>
      </div>
      <div className="text-center max-w-xs">
        <h3 className="font-[Cinzel] text-base font-bold text-gray-300 mb-1.5">
          Start building your course
        </h3>
        <p className="text-sm text-gray-600 font-[Lato] leading-relaxed">
          Organize your material into sections, then add videos, documents, and links.
        </p>
      </div>
      <button
        onClick={onAdd}
        className="
          inline-flex items-center gap-2 px-5 py-2.5 rounded-xl
          bg-gradient-to-r from-[#c9a84c] to-[#e8c96a]
          text-[#0a0f1e] text-xs font-black uppercase tracking-widest font-[Lato]
          shadow-lg shadow-[#c9a84c]/20 hover:opacity-90 transition-opacity
        "
      >
        <Plus size={13} /> Create First Section
      </button>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CourseDetailPage() {
  const params = useParams();
  const courseId = params.courseId as string;

  const courses = useQuery(api._courses.getAllCourses);
  const sections = useQuery(api._courses.getCourseSections, { courseId: courseId as any });

  const createSection = useMutation(api._courses.createSection);
  const updateSection = useMutation(api._courses.updateSection);
  const deleteSection = useMutation(api._courses.deleteSection);
  const generateUploadUrl = useMutation(api._courses.generateUploadUrl);
  const createContent = useMutation(api._courses.createContent);
  const updateContent = useMutation(api._courses.updateContent);
  const deleteContent = useMutation(api._courses.deleteContent);

  const course = useMemo(() => courses?.find((c) => c._id === courseId), [courses, courseId]);

  const [sectionModalOpen, setSectionModalOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<CourseSection | undefined>();
  const [contentModalOpen, setContentModalOpen] = useState(false);
  const [editingContent, setEditingContent] = useState<CourseContent | undefined>();
  const [activeSectionId, setActiveSectionId] = useState("");

  const activeContents = useQuery(
    api._courses.getSectionContents,
    activeSectionId ? { sectionId: activeSectionId as any } : "skip"
  );

  // ── Handlers ──

  const handleSaveSection = async (data: any) => {
    if (data.sectionId) {
      await updateSection({ sectionId: data.sectionId, title: data.title, description: data.description || undefined, order: data.order });
      sileo.success({
        title: "Section updated successfully.",
        fill: "#171717"
      });
    } else {
      await createSection({ courseId: data.courseId, title: data.title, description: data.description || undefined, order: data.order });
      sileo.success({
        title: "Section created.",
        fill: "#171717"
      });
    }
  };

  const handleDeleteSection = async (sectionId: string) => {
    try {
      await deleteSection({ sectionId: sectionId as any });
      sileo.success({
        title: "Section removed.",
        fill: "#171717"
      });
    } catch {
      sileo.error({
        title: "Failed to delete section.",
        fill: "#171717"
      });
    }
  };

  const handleSaveContent = async (data: any) => {
    let contentUrl = data.contentUrl;

    if (data.file && ["pdf", "doc", "image", "txt"].includes(data.type)) {
      const uploadUrl = await generateUploadUrl();
      const res = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": data.file.type },
        body: data.file,
      });
      const { storageId } = await res.json();
      contentUrl = storageId;
    }

    if (data.contentId) {
      await updateContent({ contentId: data.contentId, title: data.title, type: data.type, contentUrl: contentUrl || undefined, order: data.order });
      sileo.success({
        title: "Content updated.",
        fill: "#171717"
      });
    } else {
      await createContent({ courseId: data.courseId, sectionId: data.sectionId, title: data.title, type: data.type, contentUrl: contentUrl || undefined, order: data.order });
      sileo.success({
        title: "Content added.",
        fill: "#171717"
      });
    }
  };

  const handleDeleteContent = async (contentId: string) => {
    try {
      await deleteContent({ contentId: contentId as any });
      sileo.success({
        title: "Content removed.",
        fill: "#171717"
      });
    } catch {
      sileo.error({
        title: "Failed to delete content.",
        fill: "#171717"
      });
    }
  };

  // ── Loading ──

  if (!courses || !sections) {
    return (
      <div className="min-h-[480px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={20} className="animate-spin text-[#c9a84c]/40" />
          <p className="text-xs text-gray-600 font-[Lato]">Loading course…</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-[480px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-center">
          <AlertCircle size={24} className="text-red-400/40" />
          <p className="text-sm text-gray-500 font-[Lato]">Course not found.</p>
        </div>
      </div>
    );
  }

  const totalSections = sections.length;

  // ── Render ──

  return (
    <>
      <div className="min-h-[480px] max-w-8xl mx-auto px-6 py-2">

        {/* ── Page Header ── */}
        <div className="mb-4">
          {/* Label */}
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#c9a84c]/60 font-[Lato] mb-3">
            Course Editor
          </p>

          <div className="flex items-start justify-between gap-6">
            <div className="flex items-start gap-4 min-w-0">
              {/* Course icon */}
              <div className="
                w-12 h-12 shrink-0 rounded-xl
                bg-gradient-to-br from-[#c9a84c]/20 to-[#c9a84c]/5
                border border-[#c9a84c]/20
                flex items-center justify-center
                shadow-lg shadow-[#c9a84c]/5
              ">
                <BookOpen size={20} className="text-[#c9a84c]" />
              </div>

              <div className="min-w-0">
                <h1 className="font-[Cinzel] text-2xl font-bold text-white leading-tight mb-1">
                  {course.name}
                </h1>
                {course.description && (
                  <p className="text-sm text-gray-500 font-[Lato] leading-relaxed max-w-lg line-clamp-2">
                    {course.description}
                  </p>
                )}
              </div>
            </div>

            {/* Add Section CTA */}
            <button
              onClick={() => { setEditingSection(undefined); setSectionModalOpen(true); }}
              className="
                shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl
                bg-[#c9a84c]/10 hover:bg-[#c9a84c]/15
                border border-[#c9a84c]/25 hover:border-[#c9a84c]/40
                text-[#c9a84c] text-[11px] font-bold uppercase tracking-widest font-[Lato]
                transition-all duration-200 shadow-sm
              "
            >
              <Plus size={13} /> Add Section
            </button>
          </div>

          {/* Divider */}
          <div className="mt-6 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
        </div>

        {/* ── Section List ── */}
        {sections.length === 0 ? (
          <EmptyState onAdd={() => { setEditingSection(undefined); setSectionModalOpen(true); }} />
        ) : (
          <div className="space-y-1">
            {sections.map((section, i) => (
              <SectionCard
                key={section._id}
                section={section}
                index={i + 1}
                onEditSection={() => { setEditingSection(section); setSectionModalOpen(true); }}
                onDeleteSection={() => handleDeleteSection(section._id)}
                onAddContent={() => {
                  setEditingContent(undefined);
                  setActiveSectionId(section._id);
                  setContentModalOpen(true);
                }}
                onEditContent={(c) => {
                  setEditingContent(c);
                  setActiveSectionId(section._id);
                  setContentModalOpen(true);
                }}
                onDeleteContent={handleDeleteContent}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Modals ── */}
      <SectionModal
        open={sectionModalOpen}
        onClose={() => { setSectionModalOpen(false); setEditingSection(undefined); }}
        section={editingSection}
        courseId={courseId}
        nextOrder={(sections?.length ?? 0) + 1}
        onSave={handleSaveSection}
      />

      <ContentModal
        open={contentModalOpen}
        onClose={() => { setContentModalOpen(false); setEditingContent(undefined); }}
        content={editingContent}
        sectionId={activeSectionId}
        courseId={courseId}
        nextOrder={(activeContents?.length ?? 0) + 1}
        onSave={handleSaveContent}
      />
    </>
  );
}