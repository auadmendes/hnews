import { query } from 'faunadb'
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github"
import { query as q } from 'faunadb'
import { fauna } from "../../../services/fauna";

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    GoogleProvider({
      clientId: '1023146677174-rvgemuttiq7e5ctj1pjn28qd78ebnaq9.apps.googleusercontent.com',
      //process.env.GOOGLE_CLIENT_ID,
      clientSecret: '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', //process.env.GOOGLE_CLIENT_SECRET
    }),
    // ...add more providers here
  ],
  callbacks: { 
  
    async session({ session, user, token }) {
      session.user.email

      try {
        const userActiveSubscription = await fauna.query(
          q.Get(
            q.Intersection([
              q.Match(
                q.Index('subscription_by_user_ref'),
                q.Select(
                  "ref",
                  q.Get(
                    q.Match(
                      q.Index('user_by_email'),
                      q.Casefold(session.user.email)
                    )
                  )
                )
              ),
              q.Match(
                q.Index('subscription_by_status'),
                "active"
              )
              ])
            
          )
        )
        return {
         
          ...session,

          activeSubscription: userActiveSubscription,
          
          }
        
      } catch (error) {
        return {
          
          ...session,
          activeSubscription: null
        }
      }
      
    },
    
    async signIn({ user }) {
     const { email } = user

      try {
        await fauna.query(
          query.If(
            query.Not(
              query.Exists(
                query.Match(
                  query.Index('user_by_email'),
                  query.Casefold(user.email)
                )
              )
            ),
            query.Create(
              query.Collection('users'),
              { data: { email }}
            ),
            query.Get(
              query.Match(
                query.Index('user_by_email'),
                query.Casefold(user.email)
              )
            )
          )
        )
        return true

      } catch (error) {
        return false
      }

      
    },
    
  }
  
})





// export const authOptions = {
  
//   // Configure one or more authentication providers
//   providers: [
//     GithubProvider({
//       clientId: process.env.GITHUB_ID,
//       clientSecret: process.env.GITHUB_SECRET,
//     }),
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET
//     }),
//     // ...add more providers here
//   ],
//   callbacks: { 
  
//     async session({ session, user, token }) {
//       session.user.email

//       try {
//         const userActiveSubscription = await fauna.query(
//           q.Get(
//             q.Intersection([
//               q.Match(
//                 q.Index('subscription_by_user_ref'),
//                 q.Select(
//                   "ref",
//                   q.Get(
//                     q.Match(
//                       q.Index('user_by_email'),
//                       q.Casefold(session.user.email)
//                     )
//                   )
//                 )
//               ),
//               q.Match(
//                 q.Index('subscription_by_status'),
//                 "active"
//               )
//               ])
            
//           )
//         )
//         return {
         
//           ...session,
//           activeSubscription: userActiveSubscription,
          
//           }
        
//       } catch (error) {
//         return {
          
//           ...session,
//           activeSubscription: null
//         }
//       }
      
//     },
    
//     async signIn({ user, account, profile, credentials }) {
//      const { email } = user

//       try {
//         await fauna.query(
//           query.If(
//             query.Not(
//               query.Exists(
//                 query.Match(
//                   query.Index('user_by_email'),
//                   query.Casefold(user.email)
//                 )
//               )
//             ),
//             query.Create(
//               query.Collection('users'),
//               { data: { email }}
//             ),
//             query.Get(
//               query.Match(
//                 query.Index('user_by_email'),
//                 query.Casefold(user.email)
//               )
//             )
//           )
//         )
//         return true

//       } catch (error) {
//         return false
//       }

      
//     },
    
//   }
  
// }
// export default NextAuth(authOptions)


