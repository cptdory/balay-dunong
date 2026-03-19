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


  courseMembers: defineTable({
    courseId: v.id("courses"),
    userId: v.id("users"),
    role: v.string(),       // "instructor" | "student"
  })
    .index("by_course", ["courseId"])
    .index("by_user", ["userId"])
    .index("by_course_and_user", ["courseId", "userId"]),

});