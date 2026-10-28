import { useEffect, useId, useRef, useState } from 'react'

import { site } from '../../content/site'
import styles from './AiGuide.module.css'

type Message = {
  role: 'user' | 'assistant'
  content: string
}

type ChatResponse = {
  reply?: unknown
  mode?: unknown
  error?: unknown
}

const initialMessage: Message = {
  role: 'assistant',
  content:
    'Ask me about the work, stack, or what I’m looking for. I answer from this portfolio.',
}

const suggestedQuestions = [
  'What has Adrian shipped?',
  'Which project shows backend work?',
  'What is his stack?',
  'Is he open to internships?',
]

export function AiGuide() {
  const [messages, setMessages] = useState<Message[]>([initialMessage])
  const [input, setInput] = useState('')
  const [pending, setPending] = useState(false)
  const [mode, setMode] = useState<'live' | 'preview' | null>(null)
  const [error, setError] = useState('')
  const inputId = useId()
  const logRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const node = logRef.current
    if (node && typeof node.scrollTo === 'function') {
      node.scrollTo({ top: node.scrollHeight, behavior: 'smooth' })
    }
  }, [messages, pending])

  async function ask(question: string) {
    const trimmed = question.trim()
    if (!trimmed || pending) return

    const userMessage: Message = { role: 'user', content: trimmed }
    const nextMessages = [...messages, userMessage]

    setMessages(nextMessages)
    setInput('')
    setError('')
    setPending(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: nextMessages.slice(-8) }),
      })
      const data = (await response.json().catch(() => null)) as
        | ChatResponse
        | null

      if (!response.ok) {
        throw new Error(
          typeof data?.error === 'string'
            ? data.error
            : 'The guide is unavailable right now. You can email Adrian directly.',
        )
      }

      if (typeof data?.reply !== 'string' || !data.reply.trim()) {
        throw new Error('The guide returned an empty answer. Please try again.')
      }

      setMessages([
        ...nextMessages,
        { role: 'assistant', content: data.reply.trim() },
      ])
      setMode(data.mode === 'live' ? 'live' : 'preview')
    } catch (caught) {
      setError(
        caught instanceof Error && caught.message
          ? caught.message
          : 'The guide is unavailable right now. You can email Adrian directly.',
      )
    } finally {
      setPending(false)
    }
  }

  return (
    <section
      className={styles.section}
      id="ai-guide"
      aria-labelledby="ai-guide-heading"
    >
      <div className={`page ${styles.layout}`}>
        <div className={styles.intro}>
          <p className="label">AI guide</p>
          <h2
            className={`${styles.title} display`}
            id="ai-guide-heading"
          >
            Ask about the work.
          </h2>
          <p className={styles.lead}>
            A small assistant grounded in this portfolio. Ask about the
            projects, stack, or what I’m looking for.
          </p>
          <p className={styles.note}>
            It only answers from the approved work on this site.
          </p>

          <div className={styles.prompts}>
            <p className="label">Try asking</p>
            {suggestedQuestions.map((question) => (
              <button
                className={styles.prompt}
                type="button"
                key={question}
                onClick={() => void ask(question)}
                disabled={pending}
              >
                <span>{question}</span>
                <span aria-hidden="true">→</span>
              </button>
            ))}
          </div>
        </div>

        <div className={styles.panel}>
          <div className={styles.panelHead}>
            <p className="label">Portfolio guide</p>
            <p className={styles.status}>
              {pending
                ? 'Thinking'
                : mode === 'live'
                  ? 'Live'
                  : mode === 'preview'
                    ? 'Preview'
                    : 'Ready'}
            </p>
          </div>

          <div
            className={styles.log}
            ref={logRef}
            role="log"
            aria-live="polite"
            aria-relevant="additions"
          >
            {messages.map((message, index) => (
              <article
                className={`${styles.message} ${
                  message.role === 'user' ? styles.user : ''
                }`}
                key={`${message.role}-${index}`}
              >
                <p className="label">
                  {message.role === 'user' ? 'You' : 'Guide'}
                </p>
                <p className={styles.messageBody}>{message.content}</p>
              </article>
            ))}
            {pending ? (
              <p className={styles.pending} role="status">
                Looking through the portfolio…
              </p>
            ) : null}
          </div>

          {mode === 'preview' ? (
            <p className={styles.modeNote}>Preview answer from the portfolio notes.</p>
          ) : null}

          {error ? (
            <p className={styles.error} role="alert">
              {error}{' '}
              <a href={`mailto:${site.email}`}>Email Adrian</a>.
            </p>
          ) : null}

          <form
            className={styles.form}
            onSubmit={(event) => {
              event.preventDefault()
              void ask(input)
            }}
          >
            <label className="sr-only" htmlFor={inputId}>
              Ask about Adrian’s work
            </label>
            <input
              className={styles.input}
              id={inputId}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask about the projects, stack, or availability"
              maxLength={500}
              autoComplete="off"
              disabled={pending}
            />
            <button
              className={styles.submit}
              type="submit"
              disabled={pending || !input.trim()}
            >
              Ask <span aria-hidden="true">→</span>
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
