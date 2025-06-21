'use client'

import { useEffect, useState } from 'react'
import '@n8n/chat/dist/chat.css'
import { createChat } from '@n8n/chat'
import { MessageCircle, Heart, Users, Sparkles } from 'lucide-react'

export default function ChatWidget() {
  const [isHovered, setIsHovered] = useState(false)
  const [chatLoaded, setChatLoaded] = useState(false)

  useEffect(() => {
    // Initialize the chat widget
    createChat({
      webhookUrl: 'https://workflow.thinkbuddy.ai/webhook/12b4a4bd-abba-430f-86ea-01cbc844b55c/chat'
    })

    // Add custom styling and hover listeners to the n8n chat widget
    const addCustomStyling = () => {
      const chatContainer = document.querySelector('[data-test-id="chat-widget"]') || 
                           document.querySelector('.n8n-chat') ||
                           document.querySelector('[class*="chat"]')
      
      if (chatContainer) {
        const customButton = chatContainer.querySelector('button')
        if (customButton) {
          customButton.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          customButton.style.boxShadow = '0 8px 32px rgba(102, 126, 234, 0.4)'
          customButton.style.border = '2px solid rgba(255, 255, 255, 0.2)'
          
          // Add hover listeners
          customButton.addEventListener('mouseenter', () => setIsHovered(true))
          customButton.addEventListener('mouseleave', () => setIsHovered(false))
        }
        setChatLoaded(true)
      }
    }

    // Try to style the chat widget once it's loaded
    const styleTimer = setTimeout(addCustomStyling, 3000)

    return () => {
      clearTimeout(styleTimer)
    }
  }, [])

  return (
    <>
      {/* Custom matchmaker indicator - only show on hover */}
      {isHovered && chatLoaded && (
        <div className="fixed bottom-6 right-24 z-40 animate-fade-in">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-full shadow-lg text-sm font-medium flex items-center space-x-2 border-2 border-white/20 backdrop-blur-sm">
            <Heart className="w-4 h-4 text-pink-200 animate-pulse" />
            <span>Profile Matchmaker</span>
            <Sparkles className="w-4 h-4 text-yellow-200" />
          </div>
          {/* Arrow pointing to chat */}
          <div className="absolute -right-2 top-1/2 transform -translate-y-1/2">
            <div className="w-0 h-0 border-l-[8px] border-l-purple-600 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent"></div>
          </div>
        </div>
      )}

      {/* Floating info panel - only show on hover */}
      {isHovered && chatLoaded && (
        <div className="fixed bottom-24 right-6 z-30 max-w-xs">
          <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-xl border border-purple-200 p-4 animate-fade-in">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Users className="w-4 h-4 text-white" />
              </div>
              <h3 className="font-semibold text-gray-800">AI Matchmaker</h3>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Find your perfect hacker house match! Get personalized recommendations based on your interests and goals 🏠✨
            </p>
            <div className="flex items-center space-x-1 text-xs text-purple-600">
              <MessageCircle className="w-3 h-3" />
              <span>Click to get started</span>
            </div>
          </div>
        </div>
      )}

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }

        /* Override n8n chat styles */
        :global([data-test-id="chat-widget"]) {
          z-index: 50 !important;
        }
        
        :global([data-test-id="chat-widget"] button) {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
          box-shadow: 0 8px 32px rgba(102, 126, 234, 0.4) !important;
          border: 2px solid rgba(255, 255, 255, 0.2) !important;
          transition: all 0.3s ease !important;
        }
        
        :global([data-test-id="chat-widget"] button:hover) {
          transform: scale(1.05) !important;
          box-shadow: 0 12px 40px rgba(102, 126, 234, 0.6) !important;
        }
      `}</style>
    </>
  )
} 