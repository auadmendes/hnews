import Stripe from 'stripe'
//import { version } from '../../package.json' use later

export const stripe = new Stripe(
  process.env.STRIPE_API_KEY,
  {
    apiVersion: '2022-11-15',
    appInfo: {
      name: 'Hnews',
      version: '0.1.0',
    }
  }
)