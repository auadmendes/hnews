import { FaFacebook } from 'react-icons/fa'
export function SignInWithFacebookButton() {

  function buttonNotWorking() {
    alert('Sorry! This method was not implemented')
  }

  return (
    <button
      onClick={buttonNotWorking}
      type="button"
      className='ml-auto text-blue-400'>
      <FaFacebook size={32} />
    </button>
  )
}