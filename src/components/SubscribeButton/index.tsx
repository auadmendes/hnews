import { useSession, signIn } from "next-auth/react"
import { api } from "../../services/api";
import { getStripeJs } from "../../services/stripe-js";

interface SubscribeButtonProps {
  priceId: string;
}

export function SubscribeButton({ priceId }: SubscribeButtonProps) {
  const { data } = useSession()

  async function handleSubscribe() {
    if (!data) {
      signIn('google')
      return
    }
    try {
      const response = await api.post('/subscribe')
      const { checkoutUrl } = response.data

      console.log(checkoutUrl)

      const stripe = await getStripeJs()

      window.location.href = checkoutUrl
      // await stripe.redirectToCheckout({ sessionId: sessionId })
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <button
      onClick={handleSubscribe}
      type="button"
      className="h-16 w-64 border-0 rounded-full bg-yellow-500 text-gray-900
      font-bold flex items-center justify-center transition-all hover:opacity-80 mt-10"
    >
      Inscreva-se agora
    </button>
  )
}