import { query } from "./_generated/server";
import { v } from "convex/values";

export const getUserCourses = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    // Step 1: Get all courseMembers rows for this user
    const memberships = await ctx.db
      .query("courseMembers")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    // Step 2: Fetch the actual course details for each membership
    const courses = await Promise.all(
      memberships.map(async (membership) => {
        const course = await ctx.db.get(membership.courseId);
        return {
          ...course,
          role: membership.role,   // "student" | "instructor"
          joinedAt: membership.joinedAt,
        };
      })
    );

    return courses;
  },
});

export const countCourses = query ({
  args: { status: v.string() },
  handler: async (ctx, args) => {

    const courses = await ctx.db
      .query("courses")
      .filter((q) => q.eq(q.field("status"), args.status))
      .collect();
    const activeCourses = courses.length;
    return {
      activeCourses,
    };
  },
})