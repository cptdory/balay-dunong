import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  tasks: defineTable({
    text: v.string(),
    isCompleted: v.boolean(),
  }),

  users: defineTable({
    email: v.string(),
    createdAt: v.number(),
    role: v.string(),// developer, admin, instructor, student
  })
    .index("by_email", ["email"]),

  otps: defineTable({
    userId: v.id("users"),
    code: v.string(),
    createdAt: v.number(),
    expiresAt: v.number(),
    verified: v.boolean(),
  }).index("by_userId", ["userId"]),
});