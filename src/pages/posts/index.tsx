import Head from "next/head";
import Link from "next/link";
import { format } from 'date-fns'
import { ptBR } from "date-fns/locale";
import { GetServerSideProps } from "next";
import { getPost } from "../../services/graphql";



interface PostsProps {
  posts: {
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
    }
  }[]
}

export default function Post({ posts }: PostsProps) {
  //const [resume, setResume] = useState(false)

  const newPost = posts.map(post => {

    const createdAt = format(new Date(post.node.createdAt), "dd 'de ' MMMM 'de 'yyyy", {
      locale: ptBR
    })

    return {
      id: post.node.id,
      title: post.node.title,
      slug: post.node.slug,
      excerpt: post.node.excerpt,
      content: post.node.content.raw,
      author: post.node.author.name,
      createdAt
    }
  })

  return (
    <>
      <Head>
        <title>Posts | hnews</title>
      </Head>

      <main className="max-w[1120px] my-0 m-auto py-0 px-8">

        <div className="max-w-[720px] mt-20 mx-auto mb-0">


          {newPost.map(post => {
            return (
              <div key={post.id} className="block mt-8 pt-8 pb-4 border-b-[1px] border-solid border-gray-700">
                <div className="flex gap-2">
                  <time className="text-sm flex items-center text-gray-300">
                    {post.createdAt}
                  </time>
                  <span className=" text-sm text-cyan-500">by {post.author}</span>
                </div>
                <Link href={`/posts/${post.slug}`} className="block text-2xl transition-all mb-4 hover:text-yellow-500">
                  <strong>{post.title}</strong>
                </Link>


                <p className="text-gray-300 mt-2 leading-5">{post.excerpt}</p>
              </div>
            )
          })}

        </div>

      </main>
    </>
  )
}
export const getServerSideProps: GetServerSideProps = async () => {
  const posts = (await getPost() || [])

  return {
    props: {
      posts
    },
    revalidate: 60 * 60 * 24
  }
}