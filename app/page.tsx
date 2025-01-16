import Link from 'next/link'
import { DotsBackground } from '@/components/dots-background'

export default function WelcomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <DotsBackground />
      
      <div className="w-full max-w-md space-y-8">
        <div className="space-y-6">
          <h2 className="text-green-500 text-2xl font-medium">Connect-Mi</h2>
          <h1 className="text-4xl font-semibold text-green-500 dark:text-green-400">
            Easiest way to be Connected
          </h1>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Link
            href="/login"
            className="text-center py-3 px-6 border-2 border-green-500 text-green-500 rounded-lg hover:bg-green-500 hover:text-white transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="text-center py-3 px-6 border-2 border-green-500 text-green-500 rounded-lg hover:bg-green-500 hover:text-white transition-colors"
          >
            Register
          </Link>
        </div>
      </div>
    </main>
  )
}

