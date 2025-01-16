'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X } from 'lucide-react'

export default function WelcomeModal({ onClose }: { onClose: () => void }) {
  const [isOpen, setIsOpen] = useState(false)
  const [showUpdates, setShowUpdates] = useState(false)

  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem('hasSeenWelcome')
    if (!hasSeenWelcome) {
      setIsOpen(true)
      localStorage.setItem('hasSeenWelcome', 'true')
    }
  }, [])

  const upcomingUpdates = [
    "Integración de llamadas y videollamadas",
    "Integración de mensajes directos a tus amigos",
    "Nueva UI"
  ]

  const handleClose = () => {
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px] bg-[#1B3726] border-[#2A633B] text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-green-400">Bienvenido a Connect-Me</DialogTitle>
          <DialogDescription className="text-gray-300">
            Tu nueva plataforma de comunicación y colaboración académica
          </DialogDescription>
        </DialogHeader>
        <AnimatePresence mode="wait">
          {!showUpdates ? (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <p className="text-white mb-4">
                Estamos emocionados de tenerte aquí. TecmilenioChat está diseñado para mejorar tu experiencia de aprendizaje y conectarte con tus compañeros y profesores.
              </p>
              <p className="text-white mb-4">
                Explora los canales, únete a conversaciones y aprovecha al máximo esta plataforma.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="updates"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <h3 className="text-lg font-semibold text-green-400 mb-2">Próximas actualizaciones:</h3>
              <ul className="list-disc list-inside text-white space-y-1">
                {upcomingUpdates.map((update, index) => (
                  <li key={index}>{update}</li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
        <DialogFooter className="sm:justify-start">
          {!showUpdates ? (
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowUpdates(true)}
              className="bg-green-600 text-white hover:bg-green-700 transition-colors"
            >
              Ver próximas actualizaciones
            </Button>
          ) : (
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowUpdates(false)}
              className="bg-[#2A633B] text-white hover:bg-[#3A734B] transition-colors"
            >
              Volver al mensaje de bienvenida
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

