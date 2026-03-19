import { query, mutation } from "./_generated/server";
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
          _creationTime: membership._creationTime,
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
});

export const getAllCourses = query({
  args: {},
  handler: async (ctx) => {
    const courses = await ctx.db.query("courses").collect();
    return courses;
  },
});

export const getCourseMembersByRole = query({
  args: { courseId: v.id("courses"), role: v.string() },
  handler: async (ctx, args) => {
    const members = await ctx.db
      .query("courseMembers")
      .withIndex("by_course", (q) => q.eq("courseId", args.courseId))
      .filter((q) => q.eq(q.field("role"), args.role))
      .collect();

    // Fetch user details for each member
    const membersWithDetails = await Promise.all(
      members.map(async (member) => {
        const user = await ctx.db.get(member.userId);
        return {
          ...member,
          user: user,
        };
      })
    );

    return membersWithDetails;
  },
});

export const getAllUsers = query({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    return users;
  },
});

export const addCourseMember = mutation({
  args: { courseId: v.id("courses"), userId: v.id("users"), role: v.string() },
  handler: async (ctx, args) => {
    // Check if member already exists
    const existing = await ctx.db
      .query("courseMembers")
      .withIndex("by_course_and_user", (q) => 
        q.eq("courseId", args.courseId).eq("userId", args.userId)
      )
      .first();

    if (existing) {
      throw new Error("User is already a member of this course");
    }

    const memberId = await ctx.db.insert("courseMembers", {
      courseId: args.courseId,
      userId: args.userId,
      role: args.role,
    });

    return memberId;
  },
});

export const deleteCourseMember = mutation({
  args: { memberId: v.id("courseMembers") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.memberId);
    return true;
  },
});

export const updateCourse = mutation({
  args: {
    courseId: v.id("courses"),
    courseCode: v.string(),
    name: v.string(),
    description: v.string(),
    duration: v.string(),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    const { courseId, ...updateData } = args;
    await ctx.db.patch(courseId, updateData);
    return courseId;
  },
});

export const createCourse = mutation({
  args: {
    courseCode: v.string(),
    name: v.string(),
    description: v.string(),
    duration: v.string(),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    const courseId = await ctx.db.insert("courses", args);
    return courseId;
  },
});

export const deleteCourse = mutation({
  args: { courseId: v.id("courses") },
  handler: async (ctx, args) => {
    // Delete all course members first
    const members = await ctx.db
      .query("courseMembers")
      .withIndex("by_course", (q) => q.eq("courseId", args.courseId))
      .collect();

    await Promise.all(members.map((member) => ctx.db.delete(member._id)));

    // Then delete the course
    await ctx.db.delete(args.courseId);
    return true;
  },
});