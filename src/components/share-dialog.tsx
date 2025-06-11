"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Copy, Mail, MessageCircle, Twitter, Linkedin, Check } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ShareDialogProps {
  isOpen: boolean
  onClose: () => void
  config: any
  productId: string
}

export function ShareDialog({ isOpen, onClose, config, productId }: ShareDialogProps) {
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  const demoLink = `${typeof window !== "undefined" ? window.location.origin : ""}/demo/${productId}?config=${encodeURIComponent(JSON.stringify(config))}&collapsed=true`

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(demoLink)
      setCopied(true)
      toast({
        title: "Link copied!",
        description: "Demo link has been copied to clipboard",
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Please copy the link manually",
        variant: "destructive",
      })
    }
  }

  const handleEmailShare = () => {
    const subject = "Check out this API demo"
    const body = `I've configured a demo of Setu's Personal Finance Management API. Take a look: ${demoLink}`
    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`)
  }

  const handleWhatsAppShare = () => {
    const text = `Check out this API demo I configured: ${demoLink}`
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`)
  }

  const handleTwitterShare = () => {
    const text = `Check out this interactive API demo from @setu_co`
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(demoLink)}`)
  }

  const handleLinkedInShare = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(demoLink)}`)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Demo Configuration</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="demo-link">Demo Link</Label>
            <div className="flex gap-2">
              <Input id="demo-link" value={demoLink} readOnly className="flex-1 text-sm" />
              <Button onClick={handleCopyLink} size="sm" variant="outline">
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <Label>Share via</Label>
            <div className="grid grid-cols-2 gap-3">
              <Button onClick={handleEmailShare} variant="outline" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email
              </Button>
              <Button onClick={handleWhatsAppShare} variant="outline" className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </Button>
              <Button onClick={handleTwitterShare} variant="outline" className="flex items-center gap-2">
                <Twitter className="h-4 w-4" />
                Twitter
              </Button>
              <Button onClick={handleLinkedInShare} variant="outline" className="flex items-center gap-2">
                <Linkedin className="h-4 w-4" />
                LinkedIn
              </Button>
            </div>
          </div>

          <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
            <p className="font-medium mb-1">What's included:</p>
            <ul className="text-xs space-y-1">
              <li>• Your custom branding and colors</li>
              <li>• Selected modules and features</li>
              <li>• Privacy and UI preferences</li>
              <li>• Interactive demo experience</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
