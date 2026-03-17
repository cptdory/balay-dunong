import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    email: v.string(),
    name: v.string(),
    createdAt: v.number(),
    role: v.string(), // developer, admin, instructor, student
  }).index("by_email", ["email"]),

  otps: defineTable({
    userId: v.id("users"),
    code: v.string(),
    createdAt: v.number(),
    expiresAt: v.number(),
    verified: v.boolean(),
  }).index("by_userId", ["userId"]),

  courses: defineTable({
    courseCode: v.string(),
    name: v.string(),
    description: v.string(),
    duration: v.string(),
    status: v.string(), // "active" | "inactive"
  })
    .index("by_courseCode", ["courseCode"])
    .index("by_status", ["status"]),

  // A lesson belongs to a course — e.g. "Lesson 1: Introduction"
  lessons: defineTable({
    courseId: v.id("courses"),
    title: v.string(),
    description: v.string(),
    order: v.number(),        // controls display order within a course
    status: v.string(),       // "published" | "draft"
  })
    .index("by_course", ["courseId"])
    .index("by_course_order", ["courseId", "order"]),

  // Each learning material belongs to a lesson
  // Can be a file, plain text, or an external link
  lessonMaterials: defineTable({
    lessonId: v.id("lessons"),
    courseId: v.id("courses"),  // denormalized for easy course-level queries
    title: v.string(),
    type: v.string(),           // "file" | "text" | "link"
    order: v.number(),          // display order within the lesson

    // type = "text"
    textContent: v.optional(v.string()),

    // type = "link"
    url: v.optional(v.string()),
    linkLabel: v.optional(v.string()),

    // type = "file" — storageId comes from Convex file storage
    storageId: v.optional(v.id("_storage")),
    fileName: v.optional(v.string()),
    fileType: v.optional(v.string()),   // "pdf", "docx", "mp4", etc.
    fileSize: v.optional(v.number()),   // bytes
  })
    .index("by_lesson", ["lessonId"])
    .index("by_course", ["courseId"]),

  courseMembers: defineTable({
    courseId: v.id("courses"),
    userId: v.id("users"),
    role: v.string(),       // "instructor" | "student"
    joinedAt: v.number(),
  })
    .index("by_course", ["courseId"])
    .index("by_user", ["userId"])
    .index("by_course_and_user", ["courseId", "userId"]),

  // Track which materials a student has completed
  materialProgress: defineTable({
    userId: v.id("users"),
    materialId: v.id("lessonMaterials"),
    courseId: v.id("courses"),    // denormalized for fast course-progress queries
    completedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_and_course", ["userId", "courseId"])
    .index("by_user_and_material", ["userId", "materialId"]),
});