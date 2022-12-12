import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { GetServerSideProps } from "next"
import { getSession, useSession } from "next-auth/react"
import { getPostBySlug } from "../../services/graphql"
import { RichText } from '@graphcms/rich-text-react-renderer';
import Head from "next/head"

import { getSubscription } from "../../services/queryFauna"


interface PostsProps {
  post: {
    node: {
      title: string;
      slug: string;
      excerpt: string;
      content:
      {
        raw: undefined;
        html: undefined;
      }

      author: {
        name: string;
      }
      id: string;
      createdAt: string;
      date: string;
    }
  }[]
}

export default function Post({ post }: PostsProps) {
  //const { data } = useSession()


  const response = post.map(post => {

    const postDate = format(new Date(post.node.date), "dd MMMM yyyy", {
      locale: ptBR
    })
    const createdAt = format(new Date(post.node.createdAt), "dd 'de ' MMMM 'de 'yyyy", {
      locale: ptBR
    })

    return {
      id: post.node.id,
      title: post.node.title,
      slug: post.node.slug,
      data: post.node.date,
      content: post.node.content.raw,
      author: post.node.author.name,
      createdAt
    }
  })


  return (
    <>
      <Head>
        {/* <title>{post.map(item => item.node.title)} | hnews</title> */}
        <title>Posts</title>
      </Head>

      <main className="max-w[1120px] my-0 m-auto py-0 px-8">
        {response.map(post => {
          return (
            <article key={post.id} className="max-w-[720px] mt-20 mx-auto mb-0">
              <h1 className="text-5xl font-black mb-6">
                {post.title}
              </h1>
              <time className="block text-base text-gray-300">
                {post.createdAt}
              </time>
              <div className="text-lg text-gray-100 leading-8">
                <RichText content={post.content}
                  renderers={{
                    h1: ({ children }) => <h1 className="text-yellow-500 text-3xl">{children}</h1>,
                    h2: ({ children }) => <h1 className="text-white text-2xl">{children}</h1>,
                    bold: ({ children }) => <strong>{children}</strong>,
                    p: ({ children }) => <p className=" my-6 mx-0 text-justify">{children}</p>,
                    a: ({ children }) => <a href={"#"} className="text-cyan-500">{children}</a>,
                    code: ({ children }) => <code className="text-purple-400">{children}</code>,
                    ul: ({ children }) => <code className="pl-6">{children}</code>,
                    li: ({ children }) => <code className="my-2 mx-0">{children}</code>
                  }}
                />
              </div>
              <span>Writen by </span> <strong className="text-cyan-500">{post.author}</strong>
            </article>
          )
        })}

      </main>

    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
  const session = await getSession({ req });
  const { slug } = query


  const userActiveSubscription = await getSubscription(session?.user.email)

  const post = (await getPostBySlug(String(slug)))

  if (!userActiveSubscription?.activeSubscription) {
    return {
      redirect: {
        destination: `/posts/preview/${slug}`,
        permanent: false
      }
    }
  }


  return {
    props: { post }
  }
}