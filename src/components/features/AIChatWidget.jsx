import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, Bot, User, Sparkles, Mic, MicOff, Volume2, VolumeX, Zap } from 'lucide-react'
import ReactMarkdown from 'react-markdown'

export default function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'assistant', text: "Hi! I'm G-ONE 🚀 I can answer questions, estimate costs, **book services**, and even **process payments** — all right here. How can I help?" }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [executing, setExecuting] = useState(false) // true when AI is running a real action
  const [sessionId, setSessionId] = useState(null)
  const [isListening, setIsListening] = useState(false)
  const [ttsEnabled, setTtsEnabled] = useState(true)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const recognitionRef = useRef(null)
  const audioRef = useRef(null)
  const abortControllerRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition()
        recognitionRef.current.continuous = false
        recognitionRef.current.interimResults = false
        recognitionRef.current.lang = 'en-US'

        recognitionRef.current.onresult = (event) => {
          const transcript = event.results[0][0].transcript
          setInput(prev => (prev ? prev + ' ' : '') + transcript)
          setIsListening(false)
        }

        recognitionRef.current.onerror = () => setIsListening(false)
        recognitionRef.current.onend = () => setIsListening(false)
      }
    }
  }, [])

  // Optional: pre-load audio or clean up object URLs
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop()
      setIsListening(false)
    } else {
      recognitionRef.current?.start()
      setIsListening(true)
    }
  }

  const speak = async (text, force = false) => {
    if (!ttsEnabled && !force) return
    
    // Abort any ongoing fetch request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    abortControllerRef.current = new AbortController()
    const { signal } = abortControllerRef.current

    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      audioRef.current = null
    }

    try {
      const API_BASE = import.meta.env.DEV
        ? 'http://localhost:3001'
        : (import.meta.env.VITE_API_BACKEND_URL || '')

      const res = await fetch(`${API_BASE.replace(/\/$/, '')}/api/tts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
        signal
      })

      if (res.ok) {
        if (signal.aborted) return

        const blob = await res.blob()
        const url = URL.createObjectURL(blob)
        const audio = new Audio(url)
        
        if (signal.aborted) return

        audioRef.current = audio
        audio.play()
      } else {
        const errJson = await res.json().catch(() => ({}));
        console.error('TTS API error:', errJson.error || res.statusText || res.status)
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        console.log('TTS fetch request aborted.')
      } else {
        console.error('Failed to play audio:', err)
      }
    }
  }

  const openRazorpayCheckout = (action) => {
    const loadScript = () => new Promise((resolve) => {
      if (window.Razorpay) return resolve(true)
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })

    loadScript().then((loaded) => {
      if (!loaded) {
        setMessages(prev => [...prev, { role: 'assistant', text: 'Payment gateway failed to load. Please try again or use WhatsApp to pay.' }])
        return
      }
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        order_id: action.order.id,
        amount: action.order.amount,
        currency: 'INR',
        name: 'G-One Media',
        description: action.service_description,
        prefill: { name: action.client_name, email: action.client_email },
        theme: { color: '#00f0ff' },
        handler: () => {
          setMessages(prev => [...prev, { role: 'assistant', text: `✅ Payment of ₹${action.amount_inr} received! We'll get started on "${action.service_description}" right away. Check your email for a receipt.` }])
        },
        modal: {
          ondismiss: () => {
            setMessages(prev => [...prev, { role: 'assistant', text: 'Payment window was closed. You can try again anytime or ask me to recreate the payment link.' }])
          }
        }
      }
      const rzp = new window.Razorpay(options)
      rzp.open()
    })
  }

  const sendMessage = async () => {
    const trimmed = input.trim()
    if (!trimmed || loading) return

    setInput('')
    setMessages(prev => [...prev, { role: 'user', text: trimmed }])
    setLoading(true)

    try {
      const API_BASE = import.meta.env.DEV
        ? 'http://localhost:3001'
        : (import.meta.env.VITE_API_BACKEND_URL || '')

      const res = await fetch(`${API_BASE.replace(/\/$/, '')}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed, sessionId }),
      })

      if (res.ok) {
        const data = await res.json()
        if (data.sessionId) setSessionId(data.sessionId)

        // Check if this response includes a real action to execute
        if (data.action) {
          setExecuting(true)
          setLoading(false)
          // Brief pause to show the "executing" state to the user
          await new Promise(r => setTimeout(r, 600))
          setExecuting(false)

          if (data.action.type === 'OPEN_CHECKOUT') {
            setMessages(prev => [...prev, { role: 'assistant', text: data.reply }])
            speak(data.reply)
            openRazorpayCheckout(data.action)
          } else {
            setMessages(prev => [...prev, { role: 'assistant', text: data.reply }])
            speak(data.reply)
          }
        } else {
          setMessages(prev => [...prev, { role: 'assistant', text: data.reply }])
          speak(data.reply)
        }
      } else {
        setMessages(prev => [...prev, { role: 'assistant', text: "Sorry, I couldn't connect. Please try again!" }])
      }
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', text: "Connection error. Please check your internet and try again." }])
    } finally {
      setLoading(false)
      setExecuting(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <>
      {/* Floating Toggle Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 0.4 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed right-6 bottom-6 md:right-8 md:bottom-8 z-50 w-14 h-14 rounded-full flex items-center justify-center cursor-pointer shadow-[0_0_25px_rgba(0,240,255,0.3)] hover:shadow-[0_0_40px_rgba(0,240,255,0.5)] hover:-translate-y-1 transition-all duration-300 active:scale-95 border border-cyan-500/30"
        style={{ background: 'linear-gradient(135deg, #00f0ff 0%, #ff00e5 100%)' }}
        aria-label="Chat with AI Assistant"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
              <X size={22} className="text-black" />
            </motion.div>
          ) : (
            <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
              <MessageCircle size={22} className="text-black" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Notification dot */}
        {!isOpen && messages.length <= 1 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-cyan-500 border-2 border-[var(--bg-deep)]" />
          </span>
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed right-4 bottom-24 md:right-8 md:bottom-28 z-50 w-[calc(100vw-2rem)] max-w-[380px] h-[500px] rounded-2xl border border-white/10 overflow-hidden flex flex-col shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
            style={{ background: 'var(--bg-glass)', backdropFilter: 'blur(24px)' }}
          >
            {/* Header */}
            <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between" style={{ background: 'rgba(0,0,0,0.3)' }}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #00f0ff 0%, #ff00e5 100%)' }}>
                  <Sparkles size={18} className="text-black" />
                </div>
                <div>
                  <div className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>G-ONE AI</div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#10b981]" />
                    <span className="text-[10px] font-semibold text-emerald-400">Online</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => {
                  const targetTts = !ttsEnabled
                  setTtsEnabled(targetTts)
                  if (!targetTts) {
                    if (abortControllerRef.current) {
                      abortControllerRef.current.abort()
                    }
                    if (audioRef.current) {
                      audioRef.current.pause()
                      audioRef.current = null
                    }
                  }
                }}
                className="text-[var(--text-muted)] hover:text-white transition-colors p-2 cursor-pointer"
                title={ttsEnabled ? "Mute Voice" : "Enable Voice"}
              >
                {ttsEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-none">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-fuchsia-500/20' : 'bg-cyan-500/20'
                    }`}>
                    {msg.role === 'user' ? <User size={14} className="text-fuchsia-400" /> : <Bot size={14} className="text-cyan-400" />}
                  </div>
                  <div className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed relative group ${msg.role === 'user'
                    ? 'bg-fuchsia-500/15 border border-fuchsia-500/20 text-[var(--text-primary)] rounded-tr-md'
                    : 'bg-white/5 border border-white/10 text-[var(--text-secondary)] rounded-tl-md'
                    }`}>
                    {msg.role === 'user' ? (
                      msg.text
                    ) : (
                      <div className="markdown-chat">
                        <ReactMarkdown
                          components={{
                            p: ({...props}) => <p className="mb-3 last:mb-0 leading-relaxed" {...props} />,
                            ul: ({...props}) => <ul className="list-disc ml-5 mb-3 space-y-1" {...props} />,
                            ol: ({...props}) => <ol className="list-decimal ml-5 mb-3 space-y-1" {...props} />,
                            li: ({...props}) => <li className="pl-1" {...props} />,
                            strong: ({...props}) => <strong className="font-bold text-cyan-300" {...props} />,
                            a: ({...props}) => <a className="text-cyan-400 hover:underline" target="_blank" rel="noopener noreferrer" {...props} />
                          }}
                        >
                          {msg.text}
                        </ReactMarkdown>
                      </div>
                    )}
                    {msg.role === 'assistant' && (
                      <button 
                        onClick={() => speak(msg.text, true)}
                        className="absolute -right-10 bottom-2 p-1.5 rounded-full bg-white/5 text-[var(--text-muted)] hover:text-cyan-400 hover:bg-white/10 opacity-60 hover:opacity-100 transition-all cursor-pointer border border-white/10 shadow-lg"
                        title="Replay Audio"
                      >
                        <Volume2 size={14} />
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              {loading && !executing && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-2.5"
                >
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 bg-cyan-500/20">
                    <Bot size={14} className="text-cyan-400" />
                  </div>
                  <div className="px-4 py-3 rounded-2xl rounded-tl-md bg-white/5 border border-white/10 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-cyan-400/60 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 rounded-full bg-cyan-400/60 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 rounded-full bg-cyan-400/60 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </motion.div>
              )}

              {/* Executing action indicator */}
              {executing && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-2.5"
                >
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 bg-fuchsia-500/20">
                    <Zap size={14} className="text-fuchsia-400 animate-pulse" />
                  </div>
                  <div className="px-4 py-3 rounded-2xl rounded-tl-md bg-fuchsia-500/10 border border-fuchsia-500/20 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-fuchsia-400/80 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 rounded-full bg-fuchsia-400/80 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 rounded-full bg-fuchsia-400/80 animate-bounce" style={{ animationDelay: '300ms' }} />
                    <span className="text-[11px] font-semibold text-fuchsia-300 ml-1">Executing action…</span>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 border-t border-white/10" style={{ background: 'rgba(0,0,0,0.2)' }}>
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleListening}
                  className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                    isListening ? 'bg-fuchsia-500 text-white animate-pulse' : 'bg-white/5 text-[var(--text-muted)] hover:bg-white/10 hover:text-white'
                  }`}
                  title={isListening ? "Stop Listening" : "Start Speaking"}
                >
                  {isListening ? <MicOff size={16} /> : <Mic size={16} />}
                </button>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask me anything..."
                  className="flex-1 min-w-0 px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none focus:border-cyan-500/40 transition-all"
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || loading}
                  className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all cursor-pointer ${!input.trim() || loading
                    ? 'bg-white/5 text-[var(--text-muted)] cursor-not-allowed'
                    : 'bg-cyan-400 text-black hover:shadow-[0_0_15px_rgba(0,240,255,0.4)]'
                    }`}
                >
                  <Send size={16} />
                </button>
              </div>
              <p className="text-center text-[9px] mt-2 font-semibold tracking-wider uppercase" style={{ color: 'var(--text-muted)' }}>
                Powered by Gemini AI
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
