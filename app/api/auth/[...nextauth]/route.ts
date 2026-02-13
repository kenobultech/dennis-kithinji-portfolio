import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/lib/mongoose";
import Admin from "@/models/Admin";
import bcrypt from "bcryptjs";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Admin Access",
      credentials: {
        username: { label: "Username", type: "text" }, // Changed to Username
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        await dbConnect();

        // 1. Seed if empty (One-time setup)
        const adminCount = await Admin.countDocuments();
        if (adminCount === 0) {
          const envUser = process.env.ADMIN_USERNAME; // Check .env for username
          const envPass = process.env.ADMIN_PASSWORD;
          
          if (envUser && envPass) {
             const hashedPassword = await bcrypt.hash(envPass, 10);
             await Admin.create({ username: envUser, password: hashedPassword });
          }
        }

        // 2. Find Admin by USERNAME
        const user = await Admin.findOne({ username: credentials?.username });
        if (!user) throw new Error("User not found");

        // 3. Verify Password
        const isValid = await bcrypt.compare(credentials!.password, user.password);
        if (!isValid) throw new Error("Invalid password");

        return { id: user._id.toString(), name: user.username };
      }
    })
  ],
  pages: { signIn: "/admin/login" },
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };