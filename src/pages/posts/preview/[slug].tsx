import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { GetStaticPaths, GetStaticProps } from "next"

import { RichText } from '@graphcms/rich-text-react-renderer';
import Head from "next/head"

import { getPostBySlug } from "../../../services/graphql";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/router";

interface PostsPreviewProps {
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

interface PostsPreviewProps2 {
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
  }
}
export default function PostPreview({ post }: PostsPreviewProps2) {
  const session = useSession()
  const router = useRouter()

  const postDate = format(new Date(post.node.date), "dd MMMM yyyy", {
    locale: ptBR
  })
  const createdAt = format(new Date(post.node.createdAt), "dd 'de ' MMMM 'de 'yyyy", {
    locale: ptBR
  })

  const dataPost = {

    id: post.node.id,
    title: post.node.title,
    slug: post.node.slug,
    data: post.node.date,
    content: post.node.content.raw,
    author: post.node.author.name,
    createdAt
  }

  useEffect(() => {
    if (session.data) {

      router.push(`/posts/${dataPost.slug}`)
    }
  }, [dataPost.slug, router, session])


  return (
    <>
      <Head>
        <title>{dataPost.title} | Posts</title>
      </Head>


      <main className="flex flex-col max-w[1120px] my-0 m-auto py-0 px-8">

        <article key={dataPost.id} className="max-w-[720px] mt-20 mx-auto mb-0">
          <h1 className="text-5xl font-black mb-6">
            {dataPost.title}
          </h1>
          <time className="block text-base text-gray-300">
            {dataPost.createdAt}
          </time>
          <div className="text-lg text-gray-100 leading-8 max-h-[300px]
              text-transparent bg-clip-text bg-gradient-to-b from-gray-300 to-black-600 mb-16
              ">
            <RichText content={dataPost.content}
              renderers={{
                h1: ({ children }) => <h1 className="text-yellow-500 text-3xl ">{children}</h1>,
                h2: ({ children }) => <h1 className="text-white text-2xl">{children}</h1>,
                bold: ({ children }) => <strong>{children}</strong>,
                p: ({ children }) => <p className=" my-6 mx-0 text-justify">{children}</p>,
                // a: ({ children }) => <a href={"#"} className="text-cyan-500 text-transparent bg-clip-text bg-gradient-to-b from-gray-300 to-black-600">
                //   {children}
                // </a>,
                code: ({ children }) => <code className="text-purple-400">{children}</code>,
                ul: ({ children }) => <code className="pl-6">{children}</code>,
                li: ({ children }) => <code className="my-2 mx-0">{children}</code>
              }}
            />
          </div>
          <span>Writen by </span> <strong className="text-cyan-500">{dataPost.author}</strong>
        </article>

        <div className="max-w[720px] mt-8 my-0 m-auto text-lg p-8 text-center rounded-full bg-gray-800">
          Wanna continue reading?
          <Link href={"/"} className="text-yellow-500 ml-2 font-bold hover:text-cyan-400">
            Subscribe now 🤗
          </Link>
        </div>
      </main>

    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [
      // { params: { slug: 'bala_goma_vaca' } }
    ],
    fallback: 'blocking'
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {

  const { slug } = params

  const data = (await getPostBySlug(String(slug)))

  const post = data[0]


  return {
    props: {
      post,
    },
    revalidate: 60 * 60 * 24 * 10 // 10 days
  }
}