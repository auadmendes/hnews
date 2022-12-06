import { FaGoogle } from 'react-icons/fa'

import { signIn, useSession } from 'next-auth/react'

export function SigInWithGoogleButton() {
  return (
    <button
      onClick={() => signIn('google')}
      type="button"
      className='ml-auto text-blue-500'>
      <FaGoogle size={32} />
    </button>
  )
}