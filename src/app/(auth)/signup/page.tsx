'use client'

import Logo from '@/shared/Logo'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { SignUp } from '@clerk/nextjs'

function SignupContent() {
  const searchParams = useSearchParams()
  const type = searchParams.get('type') || 'client'
  const isMover = type === 'mover'

  return (
    <div className="container pb-16">
      <div className="my-16 flex justify-center">
        <Logo className="w-32" />
      </div>

      <div className="mx-auto max-w-md space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
            {isMover ? 'Mover Sign Up' : 'Client Sign Up'}
          </h2>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
            {isMover
              ? 'Join our network of professional movers'
              : 'Create an account to book your moves'}
          </p>
        </div>

        {/* Clerk SignUp Component */}
        <div className="flex justify-center">
          <SignUp
            appearance={{
              elements: {
                rootBox: 'w-full',
                cardBox: 'w-full shadow-none',
                card: 'w-full shadow-none p-0',
              },
            }}
            fallbackRedirectUrl={isMover ? '/dashboard' : '/'}
            signInUrl={isMover ? '/login?type=mover' : '/login?type=client'}
          />
        </div>

        {/* Already have an account */}
        <div className="block text-center text-sm text-neutral-700 dark:text-neutral-300">
          Already have an account?{' '}
          <Link href={`/login?type=${type}`} className="font-medium underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function Page() {
  return (
    <Suspense fallback={<div className="container py-16 text-center">Loading...</div>}>
      <SignupContent />
    </Suspense>
  )
}
