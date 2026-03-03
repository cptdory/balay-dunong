import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    email: v.string(),
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
    status: v.string(), // active, inactive
  }).index("by_courseCode", ["courseCode"]),

  // Junction table — one row per user-course relationship
  courseMembers: defineTable({
    courseId: v.id("courses"),
    userId: v.id("users"),
    role: v.string(),      // "instructor" | "student"
    joinedAt: v.number(),
  })
    .index("by_course", ["courseId"])         // get all members of a course
    .index("by_user", ["userId"])             // get all courses for a user
    .index("by_course_and_user", ["courseId", "userId"]), // fast membership check
});