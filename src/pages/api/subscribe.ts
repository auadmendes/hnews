import type { NextApiRequest, NextApiResponse } from 'next'

import { query as q, Ref } from 'faunadb'
import { getSession } from 'next-auth/react'
import { fauna } from '../../services/fauna'
import { stripe } from '../../services/stripe'

type User = {
  ref: {
    id: string;
  }
  data: {
    stripe_customer_id: string;
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  if(req.method === 'POST'){
    //req.cookies podemos recuperar os cookies assim
    const session = await getSession({req})
    const user = await fauna.query<User>(
      q.Get(
        q.Match(
          q.Index('user_by_email'),
          q.Casefold(session.user.email)
        )
      )
    )

    let customerId = user.data.stripe_customer_id

    if(!customerId) {
      const stripeCustomer = await stripe.customers.create({
        email: session.user.email,
        //metadata
      })

      await fauna.query(
        q.Update(
          q.Ref(q.Collection('users'), user.ref.id),
          {
            data: {
              stripe_customer_id: stripeCustomer.id
            }
          }
        )
      ) 

      customerId = stripeCustomer.id
    }

    console.log('----------------------------------------------------------' + customerId)
    const successUrl = `${process.env.NEXT_PUBLIC_STRIPE_URL}`
    const cancelUrl = `${process.env.NEXT_PUBLIC_STRIPE_URL}/`

    // /success?session_id={CHECKOUT_SESSION_ID}
    const stripeCheckoutSession = await stripe.checkout.sessions.create({
      
      customer: customerId,
      payment_method_types: ['card'],
      billing_address_collection: 'required',
      line_items: [
        {price: 'price_1M8cRNFiR7Q84H28gvrLjkVj', quantity: 1}
      ],
      mode: 'subscription',
      allow_promotion_codes: true,
      success_url: successUrl,
      cancel_url: cancelUrl
    })


    return res.status(200).json({ checkoutUrl: stripeCheckoutSession.url })

  }else {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method not allowed')
  }
}
