'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { DotsBackground } from '@/components/dots-background'
import { MinimalInput } from '@/components/minimal-input'
import { MinimalSelect } from '@/components/minimal-select'
import { motion } from 'framer-motion'

const careerOptions = [
  {
    category: "Ingeniería",
    color: "text-orange-500",
    programs: [
      "Ingeniería en Logística y Cadena de Suministro",
      "Ingeniería en Mecatrónica",
      "Ingeniería Industrial",
      "Ingeniería en Desarrollo de Software"
    ]
  },
  {
    category: "Negocios",
    color: "text-red-700",
    programs: [
      "Licenciatura en Mercadotecnia",
      "Licenciatura en Creación y Desarrollo de Empresas",
      "Licenciatura en Comercio y Negocios Internacionales",
      "Licenciatura en Contabilidad y Estrategia Financiera",
      "Licenciatura en Administración de Empresas"
    ]
  },
  {
    category: "Otras Disciplinas",
    color: "text-purple-600",
    programs: [
      "Licenciatura en Derecho",
      "Licenciatura en Gastronomía Internacional",
      "Licenciatura en Diseño Gráfico y Animación",
      "Licenciatura en Psicología",
      "Licenciatura en Nutrición"
    ]
  }
]

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [career, setCareer] = useState(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      alert("Passwords don't match")
      return
    }
    // Handle registration
    console.log({ name, email, password, career })
  }

  const customStyles = {
    menu: (provided: any) => ({
      ...provided,
      maxHeight: '200px', // Establecer una altura máxima para el menú
      overflowY: 'auto', // Permitir el desplazamiento vertical
    })
  }

  return (
    <main className="h-screen overflow-hidden p-4">
      <DotsBackground />
      
      <div className="max-w-md mx-auto h-full flex flex-col justify-center space-y-4">
        <div className="space-y-1">
          <Link href="/" className="inline-block text-green-500 hover:text-green-600">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h2 className="text-green-500 text-2xl font-medium">Connect-Mi</h2>
        </div>

        <div className="space-y-2">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-medium text-green-400"
          >
            Join us!
          </motion.h1>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl font-semibold text-green-300"
          >
            Create Account
          </motion.h2>
        </div>

        <motion.form 
          onSubmit={handleSubmit} 
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <MinimalInput
            label="Name on screen"
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

          <MinimalInput
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <MinimalSelect
            label="Select your career"
            value={career}
            onChange={(selectedOption) => setCareer(selectedOption)}
            options={careerOptions}
            styles={customStyles}
          />

          <button
            type="submit"
            className="w-full py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            Create Account
          </button>
        </motion.form>

        <motion.div 
          className="flex items-center justify-between text-sm text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <p>
            Already have an account?{' '}
            <Link href="/login" className="text-green-500 hover:text-green-400">
              Sign In
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

