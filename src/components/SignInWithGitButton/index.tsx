import { FaGithub } from 'react-icons/fa'
import { signIn, useSession } from 'next-auth/react'


export function SignInWithGitButton() {

  const { data: session } = useSession()

  return session ? (
    <button
      type="button"
      className='ml-auto transition-colors text-green-500 hover:text-green-400'>
      <FaGithub size={32} />
    </button>
  ) : (
    <button
      type="button"
      className='ml-auto transition-colors text-yellow-500 hover:text-yellow-400'>
      <FaGithub size={32}
        onClick={() => signIn('github')}
      />
    </button>
  )
}