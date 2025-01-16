'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { DotsBackground } from '@/components/dots-background'
import { MinimalInput } from '@/components/minimal-input'
import { motion } from 'framer-motion'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle login
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <DotsBackground />
      
      <div className="max-w-md w-full space-y-4">
        <div className="space-y-1">
          <Link href="/" className="inline-block text-green-500 hover:text-green-600">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h2 className="text-green-500 text-2xl font-medium">Conect-Mi</h2>
        </div>

        <div className="space-y-2">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-medium text-green-400"
          >
            Hello there!
          </motion.h1>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl font-semibold text-green-300"
          >
            Welcome Back
          </motion.h2>
        </div>

        <motion.form 
          onSubmit={handleSubmit} 
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <MinimalInput
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className="space-y-2">
            <MinimalInput
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div className="flex justify-end">
              <Link href="/forgot-password" className="text-sm text-green-500 hover:text-green-400">
                Forgot your password?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            Sign In
          </button>
        </motion.form>

        <motion.div 
          className="flex items-center justify-between text-sm text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <p>
            Don't have an account?{' '}
            <Link href="/register" className="text-green-500 hover:text-green-400">
              Register
            </Link>
          </p>
          <Link href="/terms" className="hover:text-gray-700 dark:hover:text-gray-300">
            Terms
          </Link>
        </motion.div>
      </div>
    </main>
  )
}

