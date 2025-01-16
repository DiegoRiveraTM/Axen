import React from 'react'
import { motion } from 'framer-motion'
import { X, AlertCircle, Bell } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"

interface ComingSoonModalProps {
  isOpen: boolean
  onClose: () => void
  featureName: string
}

export function ComingSoonModal({ isOpen, onClose, featureName }: ComingSoonModalProps) {
  const [email, setEmail] = React.useState('')
  const [emailError, setEmailError] = React.useState('')

  const validateEmail = (email: string) => {
    if (!email) {
      return 'El correo electrónico es requerido';
    }
    if (!email.includes('@') || !email.endsWith('@tecmilenio.mx')) {
      return 'Debe ser un correo electrónico válido de Tecmilenio (@tecmilenio.mx)';
    }
    return '';
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const error = validateEmail(email);
    if (error) {
      setEmailError(error);
      return;
    }

    toast({
      title: "¡Notificación registrada!",
      description: `Te avisaremos en ${email} cuando ${featureName} esté disponible.`,
      className: "bg-[#1B3726] border-green-500/20 text-white",
    });

    setEmail('');
    setEmailError('');
    onClose();
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-[#1B3726] border-[#2A633B] text-white fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[99999]">
        <div className="flex flex-col items-center justify-center text-center">
          <AlertCircle className="w-12 h-12 text-green-400 mb-2" />
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-green-400">
              Próximamente: {featureName}
            </DialogTitle>
            <DialogDescription className="text-gray-300">
              Esta función aún no está disponible, pero estamos trabajando en ello.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 w-full">
            <p className="text-white mb-6">
              {featureName.includes('voz') 
                ? "Los canales de voz te permitirán comunicarte en tiempo real con otros usuarios. Estamos finalizando los detalles para asegurar la mejor experiencia posible."
                : "Esta función te permitirá mejorar tu experiencia en TecmilenioChat. Estamos trabajando duro para implementarla pronto."}
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white block text-left">
                  ¿Quieres que te avisemos cuando esté listo?
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@tecmilenio.mx"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailError('');
                  }}
                  className={`bg-[#2A633B] border-green-500/30 text-white ${
                    emailError ? 'border-red-500' : ''
                  }`}
                />
                {emailError && (
                  <p className="text-red-400 text-sm mt-1 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    {emailError}
                  </p>
                )}
              </div>
              <DialogFooter>
                <Button type="submit" className="w-full bg-green-500 text-white hover:bg-green-600">
                  <Bell className="w-4 h-4 mr-2" />
                  Notifícame
                </Button>
              </DialogFooter>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

