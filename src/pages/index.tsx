import { GetStaticProps } from "next"
import { useSession } from "next-auth/react"
import Head from "next/head"
import Image from "next/image"

import avatarImage from '../../public/Mulher.svg'
import { SubscribeButton } from "../components/SubscribeButton"
import { stripe } from "../services/stripe"

interface HomeProps {
  product: {
    priceId: string;
    amount: number;
  }
}

export default function Home({ product }: HomeProps) {
  const { data } = useSession()
  return (
    <>
      <Head>
        <title>HNews | Home</title>
      </Head>

      <main
        className="max-w-[1120px] my-0 m-auto pt-20 pr-8 pl-8 h-[calc(h-screen-5rem)]
      flex items-center justify-between"
      >
        <section className="max-w-[600px]">
          <span className="text-2xl font-bold">👏 Hey bem vindo {data && data.user.name}</span>
          <h1 className="text-7xl leading-[4.5rem] font-black mt-10">
            Notícias de um <span className="text-cyan-500">Curioso</span> mundo
          </h1>
          <p className="text-2xl leading-10 mt-6">
            Obtenha todas as publicações<br />
            <span className="text-cyan-500 font-bold">por {product.amount} mês</span>
          </p>
          <SubscribeButton priceId={product.priceId} />
        </section>
        <Image src={avatarImage} alt="girl coding" />
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const price = await stripe.prices.retrieve('price_1M8cRNFiR7Q84H28gvrLjkVj', {
    expand: ['product']
  })

  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price.unit_amount / 100),
  }

  return {
    props: {
      product
    },
    revalidate: 60 * 60 * 24 * 30, //30 dias
  }
}