"use client";

import { useParams } from "next/navigation";
import { useQuery, useMutation, useConvex } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState, useMemo } from "react";
import { useAlert } from "../../alert-context";
import {
  Plus, Pencil, Trash2, Save, Loader2,
  FileText, Video, Link as LinkIcon, Image as ImageIcon,
  BookOpen, Clock, Eye,
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

// ─── Shared Styles ─────────────────────────────────────────────────────────────

const fieldCls = "w-full mt-1.5 px-3 py-2 bg-[#0a0f1e] border border-[#c9a84c]/[0.13] text-gray-200 text-sm font-[Lato] focus:outline-none focus:border-[#c9a84c]/50 placeholder:text-[#334155]";
const labelCls = "text-[0.6rem] font-[Lato] text-[#c9a84c] uppercase tracking-widest font-semibold block";

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      {children}
    </div>
  );
}

function DialogActions({ onClose, onConfirm, isLoading }: {
  onClose: () => void; onConfirm: () => void; isLoading: boolean;
}) {
  return (
    <div className="flex gap-2 justify-end border-t border-[#c9a84c]/[0.13] pt-4">
      <button onClick={onClose} disabled={isLoading}
        className="px-4 py-1.5 border border-[#c9a84c]/20 text-[#c9a84c]/60 hover:text-[#c9a84c] text-xs font-[Lato] uppercase tracking-widest transition-colors disabled:opacity-50">
        Cancel
      </button>
      <button onClick={onConfirm} disabled={isLoading}
        className="px-4 py-1.5 bg-[#c9a84c]/20 hover:bg-[#c9a84c]/30 border border-[#c9a84c]/40 text-[#c9a84c] text-xs font-[Lato] uppercase tracking-widest transition-colors disabled:opacity-50 flex items-center gap-1.5">
        {isLoading ? <Loader2 size={11} className="animate-spin" /> : <Save size={11} />}
        {isLoading ? "Saving…" : "Save"}
      </button>
    </div>
  );
}

// ─── Content Type ─────────────────────────────────────────────────────────────

const typeConfig: Record<string, { icon: React.ReactNode; label: string; color: string; bg: string }> = {
  video:  { icon: <Video size={12} />,    label: "Video",    color: "text-blue-400",   bg: "bg-blue-400/10 border-blue-400/20" },
  pdf:    { icon: <FileText size={12} />, label: "PDF",      color: "text-red-400",    bg: "bg-red-400/10 border-red-400/20" },
  doc:    { icon: <FileText size={12} />, label: "Doc",      color: "text-sky-400",    bg: "bg-sky-400/10 border-sky-400/20" },
  link:   { icon: <LinkIcon size={12} />, label: "Link",     color: "text-purple-400", bg: "bg-purple-400/10 border-purple-400/20" },
  image:  { icon: <ImageIcon size={12} />,label: "Image",    color: "text-pink-400",   bg: "bg-pink-400/10 border-pink-400/20" },
};

function TypeChip({ type }: { type: string }) {
  const cfg = typeConfig[type] ?? typeConfig.doc;
  return (
    <span className={`inline-flex items-center gap-1 text-[0.55rem] uppercase tracking-widest px-2 py-0.5 border font-bold font-[Lato] ${cfg.color} ${cfg.bg}`}>
      {cfg.icon} {cfg.label}
    </span>
  );
}

function normalizeUrl(url: string) {
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

// ─── Content Item ─────────────────────────────────────────────────────────────

function ContentItem({ content, onEdit, onDelete, onDownload }: {
  content: CourseContent;
  onEdit: () => void;
  onDelete: () => Promise<void>;
  onDownload: () => Promise<void>;
}) {
  const [deleting, setDeleting] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const handleDelete = async () => { setDeleting(true); try { await onDelete(); } finally { setDeleting(false); } };
  const handleDownload = async () => { setDownloading(true); try { await onDownload(); } finally { setDownloading(false); } };
  const isFile = ["pdf", "doc", "image"].includes(content.type);
  const isLink = content.type === "link" && !!content.contentUrl;
  const linkUrl = isLink ? normalizeUrl(content.contentUrl as string) : "";

  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-[#060b18] border border-[#c9a84c]/[0.07] hover:border-[#c9a84c]/20 transition-colors group/item">
      {/* Order number */}
      <span className="font-[Lato] text-[0.6rem] text-[#c9a84c]/30 w-5 text-right shrink-0">
        {String(content.order).padStart(2, "0")}
      </span>

      {/* Type chip */}
      <TypeChip type={content.type} />

      {/* Title + URL */}
      <div className="flex-1 min-w-0">
        <p className="font-[Lato] text-sm text-gray-300 truncate">{content.title}</p>
        {isLink && (
          <a
            href={linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-[Lato] text-xs text-blue-400/90 hover:text-blue-300 underline underline-offset-2 truncate block"
            title={content.contentUrl}
          >
            {content.contentUrl}
          </a>
        )}
      </div>

      {/* Actions — visible on hover */}
      <div className="flex items-center gap-0.5 opacity-0 group-hover/item:opacity-100 transition-opacity">
        {(isFile || isLink) && (
          <button onClick={handleDownload} disabled={downloading}
            className="p-1.5 text-green-400/40 hover:text-green-400 hover:bg-green-400/10 transition-colors disabled:opacity-50"
            title={isLink ? "Open link" : "Download file"}>
            {downloading ? <Loader2 size={12} className="animate-spin" /> : <Eye size={12} />}
          </button>
        )}
        <button onClick={onEdit}
          className="p-1.5 text-[#c9a84c]/40 hover:text-[#c9a84c] hover:bg-[#c9a84c]/10 transition-colors">
          <Pencil size={12} />
        </button>
        <button onClick={handleDelete} disabled={deleting}
          className="p-1.5 text-red-400/40 hover:text-red-400 hover:bg-red-400/10 transition-colors disabled:opacity-50">
          {deleting ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
        </button>
      </div>
    </div>
  );
}

// ─── Section Block ────────────────────────────────────────────────────────────

function SectionBlock({ section, onEditSection, onDeleteSection, onAddContent, onEditContent, onDeleteContent }: {
  section: CourseSection;
  onEditSection: () => void;
  onDeleteSection: () => void;
  onAddContent: () => void;
  onEditContent: (c: CourseContent) => void;
  onDeleteContent: (id: string) => Promise<void>;
}) {
  const convex = useConvex();
  const { showAlert } = useAlert();
  const contents = useQuery(api._courses.getSectionContents, { sectionId: section._id as any });

  return (
    <div className="relative border border-[#c9a84c]/[0.13] bg-[#080e20] overflow-hidden">
      {/* Gold top line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#c9a84c]/60 to-transparent" />

      {/* Section Header */}
      <div className="flex items-start justify-between px-5 py-4 bg-gradient-to-r from-[#0d1535] to-[#0a1628] border-b border-[#c9a84c]/[0.07]">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          {/* Section number */}
          <div className="w-7 h-7 shrink-0 bg-[#c9a84c]/10 border border-[#c9a84c]/20 flex items-center justify-center mt-0.5">
            <span className="font-[Cinzel] text-[0.6rem] text-[#c9a84c] font-bold">{String(section.order).padStart(2, "0")}</span>
          </div>
          <div className="min-w-0">
            <h3 className="font-[Cinzel] font-bold text-gray-100 leading-snug">{section.title}</h3>
            {section.description && (
              <p className="font-[Lato] text-xs text-gray-500 mt-0.5 leading-relaxed">{section.description}</p>
            )}
            <p className="font-[Lato] text-[0.6rem] text-[#c9a84c]/40 uppercase tracking-widest mt-1">
              {contents?.length ?? 0} item{(contents?.length ?? 0) !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0 ml-3">
          <button onClick={onEditSection}
            className="p-1.5 text-[#c9a84c]/40 hover:text-[#c9a84c] hover:bg-[#c9a84c]/10 transition-colors" title="Edit section">
            <Pencil size={13} />
          </button>
          <button onClick={onDeleteSection}
            className="p-1.5 text-red-400/40 hover:text-red-400 hover:bg-red-400/10 transition-colors" title="Delete section">
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {/* Contents — always visible */}
      <div>
        {contents && contents.length > 0 ? (
          <div className="divide-y divide-[#c9a84c]/[0.04]">
            {contents.map((content) => (
              <ContentItem
                key={content._id}
                content={content}
                onEdit={() => onEditContent(content)}
                onDelete={() => onDeleteContent(content._id)}
                onDownload={async () => {
                  if (["pdf", "doc", "image"].includes(content.type) && content.contentUrl) {
                    try {
                      const fileUrl = await convex.query(api._courses.getFileUrl, { storageId: content.contentUrl as any });
                      if (fileUrl) {
                        const response = await fetch(fileUrl);
                        if (!response.ok) throw new Error("Failed to fetch file");

                        const blob = await response.blob();
                        const downloadUrl = URL.createObjectURL(blob);
                        const anchor = document.createElement("a");
                        anchor.href = downloadUrl;
                        anchor.download = content.title;
                        document.body.appendChild(anchor);
                        anchor.click();
                        anchor.remove();
                        URL.revokeObjectURL(downloadUrl);
                      }
                    } catch (error) {
                      showAlert({ message: "Error downloading file", variant: "destructive", title: "Error" });
                    }
                  } else if (content.type === "link" && content.contentUrl) {
                    window.open(normalizeUrl(content.contentUrl), "_blank", "noopener,noreferrer");
                  }
                }}
              />
            ))}
          </div>
        ) : (
          <div className="px-5 py-6 flex flex-col items-center gap-2 text-center">
            <BookOpen size={24} className="text-[#c9a84c]/20" />
            <p className="font-[Lato] text-xs text-gray-600">No content yet in this section.</p>
          </div>
        )}

        {/* Add content row */}
        <button onClick={onAddContent}
          className="w-full flex items-center justify-center gap-2 px-5 py-2.5 border-t border-dashed border-[#c9a84c]/[0.13] hover:border-[#c9a84c]/30 text-[#c9a84c]/40 hover:text-[#c9a84c] text-[0.6rem] font-[Lato] uppercase tracking-widest transition-colors hover:bg-[#c9a84c]/[0.03]">
          <Plus size={11} /> Add Content
        </button>
      </div>
    </div>
  );
}

// ─── Section Form Dialog ───────────────────────────────────────────────────────

function SectionFormDialog({ open, onClose, section, courseId, nextOrder, onSave }: {
  open: boolean; onClose: () => void; section?: CourseSection;
  courseId: string; nextOrder: number; onSave: (data: any) => Promise<void>;
}) {
  const { showAlert } = useAlert();
  const [form, setForm] = useState({ title: section?.title || "", description: section?.description || "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!form.title.trim()) { showAlert({ message: "Title is required", variant: "info", title: "Missing Field" }); return; }
    setIsLoading(true);
    try {
      await onSave({ ...form, order: section?.order ?? nextOrder, courseId: courseId as any, sectionId: section?._id as any });
      onClose();
    } catch { showAlert({ message: "Error saving section", variant: "destructive", title: "Error" }); }
    finally { setIsLoading(false); }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="bg-[#080e20] border border-[#c9a84c]/[0.13] rounded-none p-0 gap-0 [&>button]:hidden">
        <div className="bg-gradient-to-br from-[#0d1535] to-[#0a1628] border-b border-[#c9a84c]/[0.13] px-6 py-5">
          <div className="h-px bg-gradient-to-r from-transparent via-[#c9a84c]/40 to-transparent mb-4" />
          <p className="page-label mb-1">Course Content</p>
          <h2 className="font-[Cinzel] text-base font-bold text-gray-100">{section ? "Edit Section" : "Add Section"}</h2>
        </div>
        <div className="px-6 py-5 space-y-4">
          <FormField label="Section Title">
            <input className={fieldCls} value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} placeholder="e.g. Introduction to Basics" />
          </FormField>
          <FormField label="Description">
            <textarea className={`${fieldCls} resize-none`} rows={3} value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} placeholder="Optional section description" />
          </FormField>
        </div>
        <div className="px-6 pb-5">
          <DialogActions onClose={onClose} onConfirm={handleSave} isLoading={isLoading} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Content Form Dialog ───────────────────────────────────────────────────────

function ContentFormDialog({ open, onClose, content, sectionId, courseId, nextOrder, onSave }: {
  open: boolean; onClose: () => void; content?: CourseContent;
  sectionId: string; courseId: string; nextOrder: number; onSave: (data: any) => Promise<void>;
}) {
  const { showAlert } = useAlert();
  const [form, setForm] = useState({
    title: content?.title || "", type: content?.type || "pdf",
    contentUrl: content?.contentUrl || "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setForm((p) => ({ ...p, contentUrl: file.name }));
    }
  };

  const handleSave = async () => {
    if (!form.title.trim()) { showAlert({ message: "Title is required", variant: "info", title: "Missing Field" }); return; }
    if (!selectedFile && !form.contentUrl.trim()) { showAlert({ message: "Please select a file or enter a link", variant: "info", title: "Missing Content" }); return; }
    setIsLoading(true);
    try {
      await onSave({
        title: form.title,
        type: form.type,
        contentUrl: form.contentUrl,
        file: selectedFile,
        order: content?.order ?? nextOrder, 
        courseId: courseId as any,
        sectionId: sectionId as any, 
        contentId: content?._id as any,
      });
      onClose();
    } catch { showAlert({ message: "Error saving content", variant: "destructive", title: "Error" }); }
    finally { setIsLoading(false); }
  };

  const isFileType = ["pdf", "doc", "image"].includes(form.type);
  const isLinkType = form.type === "link";

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="bg-[#080e20] border border-[#c9a84c]/[0.13] rounded-none p-0 gap-0 sm:max-w-2xl [&>button]:hidden">
        <div className="bg-gradient-to-br from-[#0d1535] to-[#0a1628] border-b border-[#c9a84c]/[0.13] px-6 py-5">
          <div className="h-px bg-gradient-to-r from-transparent via-[#c9a84c]/40 to-transparent mb-4" />
          <p className="page-label mb-1">Section Management</p>
          <h2 className="font-[Cinzel] text-base font-bold text-gray-100">{content ? "Edit Content" : "Add Content"}</h2>
        </div>
        <div className="px-6 py-5 space-y-4 max-h-[60vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Title">
              <input className={fieldCls} value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} placeholder="e.g. Introduction Video" />
            </FormField>
            <FormField label="Type">
              <select className={fieldCls} value={form.type} onChange={(e) => { setForm((p) => ({ ...p, type: e.target.value, contentUrl: "" })); setSelectedFile(null); }}>
                <option value="pdf">PDF</option>
                <option value="doc">Document</option>
                <option value="image">Image</option>
                <option value="link">Link</option>
              </select>
            </FormField>
          </div>

          {isFileType && (
            <FormField label={form.type === "image" ? "Upload Image" : `Upload ${form.type.toUpperCase()}`}>
              <div className="flex items-center gap-3">
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept={form.type === "pdf" ? ".pdf" : form.type === "image" ? "image/*" : ".doc,.docx"}
                  className="flex-1 text-xs text-gray-400 file:mr-2 file:px-3 file:py-1.5 file:border file:border-[#c9a84c]/20 file:bg-[#c9a84c]/10 file:text-[#c9a84c] file:text-xs file:font-[Lato] file:uppercase file:tracking-widest file:cursor-pointer hover:file:border-[#c9a84c]/40 hover:file:bg-[#c9a84c]/20 transition-colors"
                />
              </div>
              {selectedFile && (
                <div className="mt-2 text-xs font-[Lato] text-green-400 bg-green-400/10 border border-green-400/20 px-3 py-2 rounded">
                  ✓ {selectedFile.name}
                </div>
              )}
            </FormField>
          )}

          {isLinkType && (
            <FormField label="Link URL">
              <input
                className={fieldCls}
                type="url"
                value={form.contentUrl}
                onChange={(e) => setForm((p) => ({ ...p, contentUrl: e.target.value }))}
                placeholder="https://example.com"
              />
            </FormField>
          )}
        </div>
        <div className="px-6 pb-5">
          <DialogActions onClose={onClose} onConfirm={handleSave} isLoading={isLoading} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Course Detail Page ────────────────────────────────────────────────────────

export default function CourseDetailPage() {
  const params = useParams();
  const courseId = params.courseId as string;
  const { showAlert } = useAlert();

  const courses  = useQuery(api._courses.getAllCourses);
  const sections = useQuery(api._courses.getCourseSections, { courseId: courseId as any });

  const createSection = useMutation(api._courses.createSection);
  const updateSection = useMutation(api._courses.updateSection);
  const deleteSection = useMutation(api._courses.deleteSection);
  const generateUploadUrl = useMutation(api._courses.generateUploadUrl);
  const createContent = useMutation(api._courses.createContent);
  const updateContent = useMutation(api._courses.updateContent);
  const deleteContent = useMutation(api._courses.deleteContent);

  const course = useMemo(() => courses?.find((c) => c._id === courseId), [courses, courseId]);

  const [sectionFormOpen, setSectionFormOpen]   = useState(false);
  const [editingSection, setEditingSection]     = useState<CourseSection | undefined>();
  const [contentFormOpen, setContentFormOpen]   = useState(false);
  const [editingContent, setEditingContent]     = useState<CourseContent | undefined>();
  const [selectedSectionId, setSelectedSectionId] = useState("");

  const selectedSectionContents = useQuery(
    api._courses.getSectionContents,
    selectedSectionId ? { sectionId: selectedSectionId as any } : "skip"
  );

  const handleSaveSection = async (data: any) => {
    try {
      if (data.sectionId) {
        await updateSection({ sectionId: data.sectionId, title: data.title, description: data.description || undefined, order: data.order });
        showAlert({ message: "Section updated", variant: "success", title: "Success" });
      } else {
        await createSection({ courseId: data.courseId, title: data.title, description: data.description || undefined, order: data.order });
        showAlert({ message: "Section created", variant: "success", title: "Success" });
      }
    } catch { throw new Error("Failed"); }
  };

  const handleDeleteSection = async (sectionId: string) => {
    try {
      await deleteSection({ sectionId: sectionId as any });
      showAlert({ message: "Section deleted", variant: "success", title: "Deleted" });
    } catch { showAlert({ message: "Error deleting section", variant: "destructive", title: "Error" }); }
  };

  const handleSaveContent = async (data: any) => {
    try {
      let contentUrl = data.contentUrl;

      // Handle file upload for pdf, doc, image types
      if (data.file && ["pdf", "doc", "image"].includes(data.type)) {
        const uploadUrl = await generateUploadUrl();
        const result = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": data.file.type },
          body: data.file,
        });
        const { storageId } = await result.json();
        contentUrl = storageId;
      }

      if (data.contentId) {
        await updateContent({ contentId: data.contentId, title: data.title, type: data.type, contentUrl: contentUrl || undefined, order: data.order });
        showAlert({ message: "Content updated", variant: "success", title: "Success" });
      } else {
        await createContent({ courseId: data.courseId, sectionId: data.sectionId, title: data.title, type: data.type, contentUrl: contentUrl || undefined, order: data.order });
        showAlert({ message: "Content added", variant: "success", title: "Success" });
      }
    } catch (error) { 
      showAlert({ message: "Error saving content", variant: "destructive", title: "Error" });
      throw error;
    }
  };

  const handleDeleteContent = async (contentId: string) => {
    try {
      await deleteContent({ contentId: contentId as any });
      showAlert({ message: "Content deleted", variant: "success", title: "Deleted" });
    } catch { showAlert({ message: "Error deleting content", variant: "destructive", title: "Error" }); }
  };

  if (!course) return (
    <div className="min-h-[480px] p-6 flex items-center justify-center">
      <p className="font-[Lato] text-gray-400">Course not found.</p>
    </div>
  );

  return (
    <>
      <div className="min-h-[480px] p-6">

        {/* ── Page Header ── */}
        <div className="flex items-start justify-between gap-4 mb-8 pb-6 border-b border-[#c9a84c]/[0.07]">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 shrink-0 bg-[#c9a84c]/10 border border-[#c9a84c]/20 flex items-center justify-center mt-0.5">
              <BookOpen size={16} className="text-[#c9a84c]" />
            </div>
            <div>
              <p className="page-label mb-1">Course Content</p>
              <h1 className="font-[Cinzel] text-xl font-bold text-gray-100 mb-1">{course.name}</h1>
              <p className="font-[Lato] text-sm text-gray-500 leading-relaxed max-w-xl">{course.description}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="text-right mr-2">
              <p className="font-[Lato] text-[0.6rem] tracking-widest uppercase text-[#c9a84c]/40 mb-0.5">Sections</p>
              <p className="font-[Cinzel] text-lg text-[#c9a84c] font-bold">{sections?.length ?? 0}</p>
            </div>
            <button onClick={() => { setEditingSection(undefined); setSectionFormOpen(true); }}
              className="flex items-center gap-2 px-4 py-2 bg-[#c9a84c]/10 hover:bg-[#c9a84c]/20 border border-[#c9a84c]/25 text-[#c9a84c] text-[0.65rem] font-[Lato] font-semibold uppercase tracking-widest transition-colors">
              <Plus size={13} /> Add Section
            </button>
          </div>
        </div>

        {/* ── Sections ── */}
        {sections && sections.length > 0 ? (
          <div className="space-y-4">
            {sections.map((section) => (
              <SectionBlock
                key={section._id}
                section={section}
                onEditSection={() => { setEditingSection(section); setSectionFormOpen(true); }}
                onDeleteSection={() => handleDeleteSection(section._id)}
                onAddContent={() => { setEditingContent(undefined); setSelectedSectionId(section._id); setContentFormOpen(true); }}
                onEditContent={(c) => { setEditingContent(c); setSelectedSectionId(section._id); setContentFormOpen(true); }}
                onDeleteContent={handleDeleteContent}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-4 py-20 border border-dashed border-[#c9a84c]/10">
            <BookOpen size={40} className="text-[#475569] opacity-30" />
            <div className="text-center">
              <p className="font-[Cinzel] text-sm text-gray-500 mb-1">No sections yet</p>
              <p className="font-[Lato] text-xs text-gray-600 mb-4">Add your first section to start building the course.</p>
              <button onClick={() => { setEditingSection(undefined); setSectionFormOpen(true); }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#c9a84c]/10 hover:bg-[#c9a84c]/20 border border-[#c9a84c]/25 text-[#c9a84c] text-[0.65rem] font-[Lato] font-semibold uppercase tracking-widest transition-colors">
                <Plus size={13} /> Create First Section
              </button>
            </div>
          </div>
        )}
      </div>

      <SectionFormDialog
        open={sectionFormOpen}
        onClose={() => { setSectionFormOpen(false); setEditingSection(undefined); }}
        section={editingSection} courseId={courseId}
        nextOrder={(sections?.length ?? 0) + 1}
        onSave={handleSaveSection}
      />

      <ContentFormDialog
        open={contentFormOpen}
        onClose={() => { setContentFormOpen(false); setEditingContent(undefined); }}
        content={editingContent} sectionId={selectedSectionId} courseId={courseId}
        nextOrder={(selectedSectionContents?.length ?? 0) + 1}
        onSave={handleSaveContent}
      />
    </>
  );
}
