import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    email: v.string(),
    name: v.string(),
    birthday: v.string(),
    address: v.string(),
    phone: v.string(),
    avatar: v.string(), //base64 encoded image
    createdAt: v.number(),
    role: v.string(), // developer, admin, instructor, student
    status: v.string(), // active, inactive, pending
  }).index("by_email", ["email"]),

  enrollee: defineTable({
    // Student fields
    studentFirstName: v.string(),
    studentLastName: v.string(),
    studentEmail: v.string(),
    studentPhone: v.string(),
    studentBirthday: v.string(),
    studentAddress: v.string(),
    studentCity: v.string(),
    studentGradeLevel: v.string(),

    // Guardian fields
    guardianFirstName: v.string(),
    guardianLastName: v.string(),
    guardianRelationship: v.string(),
    guardianEmail: v.string(),
    guardianPhone: v.string(),
    guardianOccupation: v.string(),
    guardianAddress: v.string(),

    enrollmentStatus: v.string(), // pending, enrolled, rejected
    // Course selection
    courseId: v.string(),
  }),

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
    category: v.string(),
    level: v.string(), // "beginner" | "intermediate" | "advanced"
    thumbnail: v.string(), // base64 encoded image
    price: v.number(),
  })
    .index("by_courseCode", ["courseCode"])
    .index("by_status", ["status"]),

  courseMembers: defineTable({
    courseId: v.id("courses"),
    userId: v.id("users"),
    role: v.string(),       // "instructor" | "student"
  })
    .index("by_course", ["courseId"])
    .index("by_user", ["userId"])
    .index("by_course_and_user", ["courseId", "userId"]),

  courseSections: defineTable({
    courseId: v.id("courses"),
    title: v.string(), // e.g. "Lesson 1: Introduction"
    description: v.optional(v.string()),
    order: v.number(), // for sorting
  })
    .index("by_course", ["courseId"])
    .index("by_course_and_order", ["courseId", "order"]),

  courseContents: defineTable({
    courseId: v.id("courses"),
    sectionId: v.id("courseSections"),

    title: v.string(),
    type: v.string(),
    // "pdf" | "doc" | "link" | "image"
    contentUrl: v.optional(v.union(v.id("_storage"), v.string())),
    // storageId for uploaded files or raw URL for link type
    textContent: v.optional(v.string()),
    // for descriptions or rich text

    order: v.number(),
  })
    .index("by_section", ["sectionId"])
    .index("by_course", ["courseId"])
    .index("by_section_and_order", ["sectionId", "order"]),

});
