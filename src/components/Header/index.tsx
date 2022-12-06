import Link from "next/link";
import { SigInWithGoogleButton } from "../SigInWithGoogleButton";
import { SignInWithFacebookButton } from "../SignInWithFacebookButton";
import { SignInWithGitButton } from "../SignInWithGitButton";

import { IoExit } from 'react-icons/io5'

import { useSession, signOut } from "next-auth/react"
import Image from "next/image";
import { useRouter } from "next/router";

export function Header() {
  const { data } = useSession()

  const { asPath, query } = useRouter()

  return (
    <header className="h-20 border-b-2 border-gray-800">
      <div className="max-w-[1120px] h-20 my-0 m-auto pr-8 pl-8 flex items-center"
      >
        <Link href={'/'}>
          <strong className="lg:text-2xl sm:text-md  text-gray-200">h.news</strong>
        </Link>
        <nav className="lg:ml-20 h-20 sm:ml-2 flex w-40">

          <Link href={"/"} className={`inline-block relative pr-2 p-8 h-20 leading-20
          text-gray-300 transition-colors hover:text-white ${asPath === '/' ? 'text-yellow-500' : ''}`}>
            Home
          </Link>
          <Link href={"/posts"} className={`inline-block relative pr-8 p-8 h-20 leading-20 
          text-gray-300 transition-colors hover:text-white 
          ${asPath === `/posts/${query.slug}` ? 'text-cyan-300' : ''} 
          ${asPath === '/posts' ? 'text-yellow-500' : ''}
          `}
          >
            Posts
          </Link>
        </nav>
        <div className="ml-auto flex gap-2">
          {data ? (
            <div className="flex gap-2 items-center justify-center">
              <Image src={data.user.image} alt="image of the user" width={25} height={25} className="rounded-full lg:w-8 lg:h-8 sm:w-6 sm:h-6" />
              <span className="lg:text-sm sm:text-sm">{data.user.name}</span>
              <button onClick={() => signOut()}>
                <IoExit size={24} className="text-cyan-500" title="Log off" />
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <SignInWithGitButton />
              <SigInWithGoogleButton />
              <SignInWithFacebookButton />
            </div>
          )}

        </div>
      </div>
    </header >
  )
}