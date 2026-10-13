import { useEffect, useRef, useState } from 'react'
import { MessageCircle, Send, X } from 'lucide-react'
import { useFlights } from '@/state/use-flights'
import { useLanguage } from '@/state/use-language'
import { answer } from '@/lib/chatbot-answer'

interface Msg {
  from: 'user' | 'bot'
  text: string
}

function TypingDots() {
  return (
    <div className="flex justify-start">
      <div className="flex items-center gap-1.5 border border-white/10 bg-[#0a121c] px-4 py-3">
        {[0, 160, 320].map((delay) => (
          <span
            key={delay}
            className="typing-dot inline-block h-1.5 w-1.5 rounded-full bg-slate-400"
            style={{ animationDelay: `${delay}ms` }}
          />
        ))}
      </div>
    </div>
  )
}

export function Chatbot() {
  const { flights } = useFlights()
  const { lang, t } = useLanguage()
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [msgs, setMsgs] = useState<Msg[]>([{ from: 'bot', text: t.chatbot.greeting }])
  const [typing, setTyping] = useState(false)
  const bodyRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const replyTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  // Reset greeting message when language changes
  useEffect(() => {
    const timer = window.setTimeout(() => setMsgs([{ from: 'bot', text: t.chatbot.greeting }]))
    return () => clearTimeout(timer)
  }, [lang, t.chatbot.greeting])

  useEffect(() => () => clearTimeout(replyTimer.current), [])

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: 'smooth' })
  }, [msgs, open, typing])

  useEffect(() => {
    if (!open) return
    inputRef.current?.focus()
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open])

  const send = () => {
    const q = input.trim()
    if (!q) return
    setInput('')

    const reply = answer(q, flights, lang)
    setMsgs((m) => [...m, { from: 'user', text: q }])
    setTyping(true)
    replyTimer.current = setTimeout(() => {
      setTyping(false)
      setMsgs((m) => [...m, { from: 'bot', text: reply }])
    }, 600)
  }

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Chat assistant"
        className="fixed right-5 bottom-5 z-50 flex h-14 w-14 items-center justify-center border border-[#af915f] bg-[#af915f] text-[#0a121c] shadow-[0_8px_30px_rgba(175,145,95,0.35)] transition-transform hover:scale-105"
      >
        {open ? <X className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={t.chatbot.title}
          className="fixed right-5 bottom-24 z-50 flex h-[460px] w-[min(92vw,360px)] flex-col border border-white/15 bg-[#0e1a26] shadow-2xl"
        >
          <div className="border-b border-[#af915f]/30 px-5 py-4">
            <p className="font-display text-lg tracking-wide text-white">{t.chatbot.title}</p>
            <p className="font-mono2 text-[10px] tracking-[0.25em] text-[#af915f] uppercase">{t.chatbot.online}</p>
          </div>

          <div ref={bodyRef} role="log" aria-live="polite" className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {msgs.map((m, i) => (
              <div key={i} className={m.from === 'user' ? 'flex justify-end' : 'flex justify-start'}>
                <div
                  className={
                    m.from === 'user'
                      ? 'max-w-[80%] whitespace-pre-line bg-[#af915f] px-3.5 py-2.5 text-[13px] leading-relaxed text-[#0a121c]'
                      : 'max-w-[85%] whitespace-pre-line border border-white/10 bg-[#0a121c] px-3.5 py-2.5 text-[13px] leading-relaxed font-light text-slate-200'
                  }
                >
                  {m.text}
                </div>
              </div>
            ))}
            {typing && <TypingDots />}
          </div>

          <div className="flex items-center gap-2 border-t border-white/10 p-3">
            <input
              ref={inputRef}
              aria-label={t.chatbot.placeholder}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send()}
              placeholder={t.chatbot.placeholder}
              className="h-10 w-full border border-white/15 bg-transparent px-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-[#af915f]/60"
            />
            <button
              onClick={send}
              aria-label="Send"
              className="flex h-10 w-10 shrink-0 items-center justify-center bg-[#af915f] text-[#0a121c] transition-colors hover:bg-[#c8ab74]"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </>
  )
}
