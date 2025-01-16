'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { DotsBackground } from '@/components/dots-background'
import { MinimalInput } from '@/components/minimal-input'
import { ThemeToggle } from '@/components/theme-toggle'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle registration
  }

  return (
    <main className="min-h-screen p-4">
      <ThemeToggle />
      <DotsBackground />
      
      <div className="max-w-md mx-auto pt-48 space-y-8">
        <div className="space-y-1">
          <Link href="/" className="inline-block text-green-500 hover:text-green-600">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h2 className="text-green-500 text-2xl font-medium">ConnectMe</h2>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-medium text-green-600 dark:text-green-400">Join us!</h1>
          <h2 className="text-3xl font-semibold text-green-700 dark:text-green-300">Create Account</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <MinimalInput
            label="Name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <MinimalInput
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <MinimalInput
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            Create Account
          </button>
        </form>

        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <p>
            Already have an account?{' '}
            <Link href="/login" className="text-green-500 hover:text-green-400">
              Sign In
            </Link>
          </p>
          <Link href="/terms" className="hover:text-gray-700 dark:hover:text-gray-300">
            Terms
          </Link>
        </div>
      </div>
    </main>
  )
}

