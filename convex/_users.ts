import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

//users
export const getUser = mutation({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.email))
      .first();

    if (existingUser) {
      return {
        status: "success",
        user: existingUser,
      };
    } else {
      return {
        status: "error",
        message: "User not found",
      };
    }
  },
});

export const getStudents = query({
  args: { role: v.string() },
  handler: async (ctx, args) => {
    const now = new Date();

    // Start of current month
    const startOfMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    ).getTime();

    const students = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("role"), args.role))
      .collect();

    const totalStudents = students.length;

    const studentsThisMonth = students.filter(
      (student) => student._creationTime >= startOfMonth
    ).length;

    return {
      students,
      totalStudents,
      studentsThisMonth,
    };
  },
});
