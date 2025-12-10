import Link from 'next/link'
import Image from 'next/image'
import React from 'react'


interface LogoProps {
  className?: string
}

const Logo: React.FC<LogoProps> = ({ className = 'w-22 sm:w-24' }) => {
  return (
    <Link href="/" className={`inline-block text-primary-600 focus:ring-0 focus:outline-hidden ${className}`}>
        <Image
          src="/logoDark1.svg"
          alt="PickIt Logo"
          width={115}
          height={59}
          className="hidden dark:block w-full h-auto"
        />
        <Image
          src="/logoLight1.svg"
          alt="PickIt Logo"
          width={115}
          height={59}
          className="block dark:hidden w-full h-auto"
        />
    </Link>
  )
}

export default Logo
