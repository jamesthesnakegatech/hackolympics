'use client'

import { useState, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { CustomBadge } from '@/components/ui/custom-badge'
import { Label } from '@/components/ui/label'
import { 
  Upload, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2,
  Loader2,
  Download,
  Copy,
  Wand2,
  FileImage
} from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface ManualBadgeForm {
  title: string
  description: string
  eventDescription: string
  uploadedImage?: File
  imageUrl?: string
}

interface GeneratedBadge {
  title: string
  subtitle: string
  color: string
  icon: string
  svgPath?: string
}

export function BadgeCreator() {
  // Manual badge generator states
  const [manualBadge, setManualBadge] = useState<ManualBadgeForm>({
    title: '',
    description: '',
    eventDescription: ''
  })
  const [generatedBadge, setGeneratedBadge] = useState<GeneratedBadge | null>(null)
  const [generatingBadge, setGeneratingBadge] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setManualBadge({ ...manualBadge, uploadedImage: file })
      
      // Create preview URL
      const reader = new FileReader()
      reader.onload = (e) => {
        setManualBadge(prev => ({ ...prev, imageUrl: e.target?.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }

  const generateManualBadge = async () => {
    if (!manualBadge.title || !manualBadge.eventDescription) return

    setGeneratingBadge(true)
    setError('')

    try {
      // This would be replaced with your actual AI API endpoint
      // For now, creating a mock response similar to the HTML example
      const mockBadgeData: GeneratedBadge = {
        title: manualBadge.title,
        subtitle: manualBadge.description || 'Achievement Unlocked',
        color: '#667eea',
        icon: '🏆',
        svgPath: ''
      }

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setGeneratedBadge(mockBadgeData)
    } catch (err) {
      setError('Failed to generate badge. Please try again.')
    } finally {
      setGeneratingBadge(false)
    }
  }

  const downloadBadge = () => {
    if (!generatedBadge) return

    const svg = document.querySelector('#generated-badge-svg') as SVGElement
    if (!svg) return

    const svgData = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = document.createElement('img')
    
    canvas.width = 400
    canvas.height = 400
    
    img.onload = function() {
      if (ctx) {
        ctx.fillStyle = 'white'
        ctx.fillRect(0, 0, 400, 400)
        ctx.drawImage(img, 0, 0, 400, 400)
        canvas.toBlob(function(blob) {
          if (blob) {
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `merit-badge-${Date.now()}.png`
            a.click()
            URL.revokeObjectURL(url)
          }
        })
      }
    }
    
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData)
  }

  const copyBadgeInfo = () => {
    if (!generatedBadge) return
    
    const shareText = `🏆 I earned the "${generatedBadge.title}" merit badge! ${generatedBadge.subtitle}`
    navigator.clipboard.writeText(shareText)
    alert('Badge info copied to clipboard!')
  }

  const renderGeneratedBadge = (badge: GeneratedBadge) => (
    <div className="text-center">
      <div className="mb-4 flex justify-center">
        <svg 
          id="generated-badge-svg"
          viewBox="0 0 200 200" 
          width="200" 
          height="200"
          className="filter drop-shadow-lg"
        >
          {/* Outer ring */}
          <circle cx="100" cy="100" r="95" fill={badge.color} stroke="#fff" strokeWidth="3"/>
          <circle cx="100" cy="100" r="85" fill="none" stroke="#fff" strokeWidth="2"/>
          
          {/* Inner circle */}
          <circle cx="100" cy="100" r="75" fill="#fff"/>
          
          {/* Icon background */}
          <circle cx="100" cy="90" r="40" fill={badge.color} opacity="0.1"/>
          
          {/* Emoji or icon */}
          <text x="100" y="105" fontSize="50" textAnchor="middle" fill={badge.color}>{badge.icon}</text>
          
          {/* Title */}
          <text x="100" y="155" fontSize="12" textAnchor="middle" fill={badge.color} fontWeight="bold">
            {badge.title.toUpperCase()}
          </text>
          
          {/* Decorative stars */}
          <path d="M 50 30 L 52 36 L 58 36 L 53 40 L 55 46 L 50 42 L 45 46 L 47 40 L 42 36 L 48 36 Z" fill="#fff"/>
          <path d="M 150 30 L 152 36 L 158 36 L 153 40 L 155 46 L 150 42 L 145 46 L 147 40 L 142 36 L 148 36 Z" fill="#fff"/>
        </svg>
      </div>
      
      <h3 className="text-xl font-bold text-gray-900 mb-2">{badge.title}</h3>
      <p className="text-gray-600 mb-4">{badge.subtitle}</p>
      
      <div className="flex flex-wrap gap-2 justify-center">
        <Button onClick={downloadBadge} variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Download PNG
        </Button>
        <Button onClick={copyBadgeInfo} variant="outline">
          <Copy className="w-4 h-4 mr-2" />
          Copy Info
        </Button>
        <Button 
          onClick={() => {
            setGeneratedBadge(null)
            setManualBadge({title: '', description: '', eventDescription: ''})
          }}
          variant="outline"
        >
          Create Another
        </Button>
      </div>
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Sparkles className="w-6 h-6 text-purple-600" />
            <span>Merit Badge Generator</span>
          </CardTitle>
          <p className="text-gray-600">
            Create custom merit badges for any event or achievement! Design beautiful downloadable badges with custom titles, descriptions, and images.
          </p>
        </CardHeader>
      </Card>

      {/* Manual Badge Generator */}
      {!generatedBadge && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Wand2 className="w-6 h-6 text-purple-600" />
              <span>Design Your Badge</span>
            </CardTitle>
            <p className="text-gray-600">
              Fill in the details below to generate your custom merit badge!
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="manual-title">Badge Title *</Label>
                  <Input
                    id="manual-title"
                    value={manualBadge.title}
                    onChange={(e) => setManualBadge({...manualBadge, title: e.target.value})}
                    placeholder="e.g., Karaoke Champion"
                    maxLength={30}
                  />
                  <p className="text-xs text-gray-500 mt-1">{manualBadge.title.length}/30 characters</p>
                </div>
                <div>
                  <Label htmlFor="manual-description">Badge Subtitle</Label>
                  <Input
                    id="manual-description"
                    value={manualBadge.description}
                    onChange={(e) => setManualBadge({...manualBadge, description: e.target.value})}
                    placeholder="e.g., Survived 3 Hours of Off-Key Singing"
                    maxLength={50}
                  />
                  <p className="text-xs text-gray-500 mt-1">{manualBadge.description.length}/50 characters</p>
                </div>
              </div>
              
              <div>
                <Label htmlFor="manual-event-desc">Event Description *</Label>
                <textarea
                  id="manual-event-desc"
                  value={manualBadge.eventDescription}
                  onChange={(e) => setManualBadge({...manualBadge, eventDescription: e.target.value})}
                  placeholder="Describe what this badge is for... (e.g., 'Attended the best karaoke night ever!' or 'Survived the spiciest chili cook-off')"
                  className="w-full p-3 border border-gray-300 rounded-md resize-vertical min-h-[100px] focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                  aria-label="Event Description"
                />
              </div>

              <div>
                <Label htmlFor="badge-image-upload">Badge Image (Optional)</Label>
                <div className="mt-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    id="badge-image-upload"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full"
                  >
                    <FileImage className="w-4 h-4 mr-2" />
                    {manualBadge.uploadedImage ? 'Change Image' : 'Upload Image'}
                  </Button>
                  {manualBadge.imageUrl && (
                    <div className="mt-3 flex justify-center">
                      <img 
                        src={manualBadge.imageUrl} 
                        alt="Badge preview" 
                        className="max-w-32 max-h-32 object-cover rounded-lg border"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-center">
                <Button 
                  onClick={generateManualBadge}
                  disabled={!manualBadge.title || !manualBadge.eventDescription || generatingBadge}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-8 py-3 text-lg"
                  size="lg"
                >
                  {generatingBadge ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      Generating Badge...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Generate Merit Badge
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Generated Badge Display */}
      {generatedBadge && (
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Your Merit Badge</CardTitle>
          </CardHeader>
          <CardContent>
            {renderGeneratedBadge(generatedBadge)}
          </CardContent>
        </Card>
      )}

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  )
} 