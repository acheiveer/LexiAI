import Link from 'next/link'
import Logo from '@/components/logo'
import { Button } from '@/components/ui/button'
import {SignInButton, SignedIn, SignedOut, UserButton} from '@clerk/nextjs'

function Header() {
  return (
    <header className='py-3'>
      <div className='container m-auto flex max-w-3xl  items-center justify-between'>
          <Link href='/'>
          <Logo />          
        </Link>

        <SignedIn>
          <UserButton afterSwitchSessionUrl='/' />
        </SignedIn>


        <SignedOut>
          <SignInButton mode='modal'>
            <Button size='sm' variant='ghost'>
              Sign in
            </Button>
          </SignInButton>
        </SignedOut>
        
      </div>
    </header>
  )
}
export default Header
