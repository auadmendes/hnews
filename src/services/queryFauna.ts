import { getSession } from "next-auth/react"
import { fauna } from "./fauna"
import { query as q } from 'faunadb'

export async function getSubscription(email: string) {
  //const session = getSession()
  
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
                  q.Casefold(email)
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

      activeSubscription: userActiveSubscription
      
      }
    
  } catch (error) {
    return {

      activeSubscription: null
    }
  }

}