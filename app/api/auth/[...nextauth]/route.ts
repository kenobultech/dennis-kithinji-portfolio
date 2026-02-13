import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Admin Access",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "admin@dennis.dev" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Simple check against Environment Variables
        const isValid = 
          credentials?.email === process.env.ADMIN_EMAIL &&
          credentials?.password === process.env.ADMIN_PASSWORD;

        if (isValid) {
          return { id: "1", name: "Dennis Kithinji", email: "admin@dennis.dev" };
        }
        return null;
      }
    })
  ],
  pages: {
    signIn: "/admin/login", // Custom login page
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };