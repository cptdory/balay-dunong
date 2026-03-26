import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const create = mutation({
  args: {
    studentFirstName: v.string(),
    studentLastName: v.string(),
    studentEmail: v.string(),
    studentPhone: v.string(),
    studentBirthday: v.string(),
    studentAddress: v.string(),
    studentCity: v.string(),
    studentGradeLevel: v.string(),
    guardianFirstName: v.string(),
    guardianLastName: v.string(),
    guardianRelationship: v.string(),
    guardianEmail: v.string(),
    guardianPhone: v.string(),
    guardianOccupation: v.string(),
    guardianAddress: v.string(),
    courseId: v.string(),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("enrollee", {
      ...args,
      enrollmentStatus: "pending",
    });
    return id;
  },
});
