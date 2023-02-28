import NextAuth, { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"

export default NextAuth({
    providers: [
        GoogleProvider({
            clientId: {GOOGLE_ID},
            clientSecret: {GOOGLE_SECRET}
        })
    ],
    secret: {JWT_SECRET}
})
