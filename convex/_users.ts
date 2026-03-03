import { mutation } from "./_generated/server";
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


// export const createUser = mutation({
//   args: {email: v.string()},
//   handler: async (convexToJson, args) => {
//     const newUser = await convexToJson.db.insert("users",{
//       email: args.email,
//       createdAt: Date.now(),
//     })
//   }
// })