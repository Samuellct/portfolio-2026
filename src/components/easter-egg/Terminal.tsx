'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useEasterEgg } from '@/context/EasterEggContext'

interface TerminalLine {
  type: 'system' | 'warning' | 'error' | 'success' | 'user' | 'hint' | 'progress'
  text: string
  instant?: boolean
}

type GamePhase = 'intro' | 'hotfix-prompt' | 'hotfix-yes' | 'hotfix-no' | 'phase2' | 'help' | 'final' | 'success' | 'fireworks'

export default function Terminal() {
  const { easterEggPhase, setEasterEggPhase } = useEasterEgg()
  const [lines, setLines] = useState<TerminalLine[]>([])
  const [currentLine, setCurrentLine] = useState('')
  const [displayedText, setDisplayedText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [userInput, setUserInput] = useState('')
  const [canType, setCanType] = useState(false)
  const [gamePhase, setGamePhase] = useState<GamePhase>('intro')
  const [lastInputTime, setLastInputTime] = useState(Date.now())
  const [showHelpHint, setShowHelpHint] = useState(false)
  
  const inputRef = useRef<HTMLInputElement>(null)
  const terminalRef = useRef<HTMLDivElement>(null)
  const typingSpeed = 25 // ms par lettre
  
  // Auto-scroll to bottom
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [lines, displayedText])
  
  // Focus input when can type
  useEffect(() => {
    if (canType && inputRef.current) {
      inputRef.current.focus()
    }
  }, [canType])
  
  // Add line instantly
  const addLine = useCallback((line: TerminalLine) => {
    setLines(prev => [...prev, line])
  }, [])
  
  // Sequence of lines with typing effect
  const typeSequence = useCallback((sequence: TerminalLine[], onComplete?: () => void) => {
    let index = 0
    
    const typeNext = () => {
      if (index >= sequence.length) {
        onComplete?.()
        return
      }
      
      const line = sequence[index]
      index++
      
      if (line.instant) {
        addLine(line)
        setTimeout(typeNext, 100)
      } else {
        setIsTyping(true)
        setDisplayedText('')
        setCurrentLine(line.text)
        
        let charIndex = 0
        const interval = setInterval(() => {
          if (charIndex < line.text.length) {
            setDisplayedText(prev => prev + line.text[charIndex])
            charIndex++
          } else {
            clearInterval(interval)
            setIsTyping(false)
            addLine(line)
            setCurrentLine('')
            setDisplayedText('')
            setTimeout(typeNext, 200)
          }
        }, typingSpeed)
      }
    }
    
    typeNext()
  }, [addLine])
  
  // Introduction sequence
  useEffect(() => {
    if (easterEggPhase !== 'terminal') return
    
    const introSequence: TerminalLine[] = [
      { type: 'system', text: '[SYSTEM] : Boot sequence initiated...' },
      { type: 'system', text: '[SYSTEM] : Loading core modules...' },
      { type: 'warning', text: '[WARNING] : Anomaly detected in memory sector 0x7F3A' },
      { type: 'error', text: '[SYSTEM] : Intrusion detected in core_v4.js' },
      { type: 'system', text: '' },
      { type: 'system', text: '[SYSTEM] : Emergency recovery available.' },
      { type: 'system', text: "[SYSTEM] : Apply 'hotfix.sh' now? (yes/no)" },
    ]
    
    setTimeout(() => {
      typeSequence(introSequence, () => {
        setGamePhase('hotfix-prompt')
        setCanType(true)
      })
    }, 500)
  }, [easterEggPhase, typeSequence])
  
  // Help hint after inactivity
  useEffect(() => {
    if (!canType || gamePhase === 'success' || gamePhase === 'fireworks') return
    
    const checkInactivity = setInterval(() => {
      const timeSinceInput = Date.now() - lastInputTime
      if (timeSinceInput > 5000 && !showHelpHint && (gamePhase === 'phase2' || gamePhase === 'final')) {
        setShowHelpHint(true)
        addLine({ type: 'hint', text: "(Type 'help()' for assistance)" })
      }
    }, 1000)
    
    return () => clearInterval(checkInactivity)
  }, [canType, lastInputTime, showHelpHint, gamePhase, addLine])
  
  // Normalize command for comparison
  const normalizeCommand = (cmd: string): string => {
    return cmd.toLowerCase().trim().replace(/\s+/g, ' ')
  }
  
  // command matches ?
  const commandMatches = (input: string, patterns: string[]): boolean => {
    const normalized = normalizeCommand(input)
    return patterns.some(p => normalized === normalizeCommand(p) || normalized.includes(normalizeCommand(p)))
  }
  
  // user input
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!canType || isTyping || !userInput.trim()) return
    
    const input = userInput.trim()
    setUserInput('')
    setLastInputTime(Date.now())
    setShowHelpHint(false)
    
    // Add user input to terminal
    addLine({ type: 'user', text: `> ${input}` })
    setCanType(false)
    
    setTimeout(() => processCommand(input), 300)
  }
  
  const processCommand = (input: string) => {
    switch (gamePhase) {
      case 'hotfix-prompt':
        handleHotfixPrompt(input)
        break
      case 'phase2':
      case 'final':
      case 'help':
        handlePhase2Command(input)
        break
      default:
        setCanType(true)
    }
  }
  
  const handleHotfixPrompt = (input: string) => {
    const normalized = normalizeCommand(input)
    
    if (normalized === 'yes' || normalized === 'y') {
      // Yes path
      setGamePhase('hotfix-yes')
      
      const yesSequence: TerminalLine[] = [
        { type: 'system', text: '[SYSTEM] : Applying hotfix.sh...' },
        { type: 'progress', text: '[████████░░] 80%' },
        { type: 'error', text: '[ERROR] : Operation aborted.' },
        { type: 'error', text: '[ERROR] : Access denied. Administrator privileges required to modify /root' },
        { type: 'system', text: '' },
      ]
      
      typeSequence(yesSequence, () => {
        startPhase2()
      })
      
    } else if (normalized === 'no' || normalized === 'n') {
      // No path
      setGamePhase('hotfix-no')
      
      const noSequence: TerminalLine[] = [
        { type: 'system', text: '[SYSTEM] : Hotfix cancelled by user.' },
        { type: 'warning', text: '[SYSTEM] : Vulnerability remains.' },
        { type: 'system', text: '[SYSTEM] : Switching to manual override mode...' },
        { type: 'system', text: '' },
      ]
      
      typeSequence(noSequence, () => {
        startPhase2()
      })
      
    } else {
      // Invalid input
      addLine({ type: 'error', text: `[ERROR] : Invalid response. Type 'yes' or 'no'.` })
      setCanType(true)
    }
  }
  
  const startPhase2 = () => {
    const phase2Sequence: TerminalLine[] = [
      { type: 'warning', text: '[SYSTEM] : Critical threat levels rising.' },
      { type: 'system', text: "[SYSTEM] : 'shield.exe' is available in the security repository." },
      { type: 'warning', text: '[WARNING] : Manual correction required.' },
      { type: 'warning', text: '[WARNING] : Administrator privileges mandatory for this action.' },
      { type: 'system', text: '' },
    ]
    
    typeSequence(phase2Sequence, () => {
      setGamePhase('phase2')
      setCanType(true)
      setLastInputTime(Date.now())
    })
  }
  
  const handlePhase2Command = (input: string) => {
    const normalized = normalizeCommand(input)
    
    // Help command
    if (normalized === 'help()' || normalized === 'help') {
      setGamePhase('help')
      const helpSequence: TerminalLine[] = [
        { type: 'system', text: '[HELP] : Available commands:' },
        { type: 'system', text: '  sudo [cmd]  - Execute with administrator privileges' },
        { type: 'system', text: '  run [file]  - Execute a program' },
        { type: 'system', text: '' },
      ]
      typeSequence(helpSequence, () => {
        setGamePhase('final')
        setCanType(true)
      })
      return
    }
    
    // Secret exit command
    if (commandMatches(input, ['sudo exit', 'sudoexit'])) {
      setGamePhase('fireworks')
      addLine({ type: 'system', text: '[SYSTEM] : Administrator override accepted.' })
      addLine({ type: 'success', text: '[SYSTEM] : Bypassing security protocols...' })
      
      setTimeout(() => {
        setEasterEggPhase('fireworks')
      }, 1000)
      return
    }
    
    // Main solution
    if (commandMatches(input, [
      'sudo run shield.exe',
      'sudo run shield',
      'sudorunshield.exe',
      'sudorunshield',
      'sudo shield.exe',
      'sudo shield',
      'run sudo shield.exe',
      'sudo execute shield.exe',
      'sudo ./shield.exe',
      'sudo run ./shield.exe'
    ])) {
      setGamePhase('success')
      
      const successSequence: TerminalLine[] = [
        { type: 'system', text: '[SYSTEM] : Authenticating administrator...' },
        { type: 'success', text: '[SUCCESS] : Access granted.' },
        { type: 'system', text: '[SYSTEM] : Deploying shield.exe...' },
        { type: 'progress', text: '[██████████] 100%' },
        { type: 'success', text: '[SUCCESS] : Security protocols restored.' },
        { type: 'success', text: '[SYSTEM] : Threat neutralized. System integrity verified.' },
        { type: 'system', text: '' },
        { type: 'success', text: '[SYSTEM] : Rebooting interface...' },
      ]
      
      typeSequence(successSequence, () => {
        setTimeout(() => {
          setEasterEggPhase('restored')
        }, 1500)
      })
      return
    }
    
    // Alternatives
    if (commandMatches(input, ['run shield.exe', 'run shield', 'shield.exe', 'shield', './shield.exe'])) {
      addLine({ type: 'error', text: '[ERROR] : Permission denied. Administrator privileges required.' })
      addLine({ type: 'hint', text: "(Hint: Use 'sudo' for elevated permissions)" })
      setCanType(true)
      return
    }
    
    // .
    if (normalized === 'sudo') {
      addLine({ type: 'error', text: '[ERROR] : Missing command. Usage: sudo [command]' })
      setCanType(true)
      return
    }
    
    // .
    if (normalized === 'run') {
      addLine({ type: 'error', text: '[ERROR] : Missing file. Usage: run [filename]' })
      setCanType(true)
      return
    }
    
    // .
    addLine({ type: 'error', text: `[ERROR] : Command not recognized: '${input}'` })
    setCanType(true)
  }
  
  // Style for different line types
  const getLineStyle = (type: TerminalLine['type']) => {
    switch (type) {
      case 'error':
        return 'text-red-400'
      case 'warning':
        return 'text-yellow-400'
      case 'success':
        return 'text-green-400'
      case 'user':
        return 'text-accent-cyan'
      case 'hint':
        return 'text-white/40 italic'
      case 'progress':
        return 'text-accent-cyan font-bold'
      default:
        return 'text-white/80'
    }
  }
  
  if (easterEggPhase !== 'terminal') return null
  
  return (
    <motion.div
      className="fixed inset-0 z-[200] bg-[#0a0a0a] flex items-center justify-center p-4 md:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="w-full max-w-4xl h-full max-h-[80vh] bg-[#0d0d0d] border border-white/10 rounded-lg overflow-hidden flex flex-col shadow-2xl">
        {/* Terminal header */}
        <div className="flex items-center gap-2 px-4 py-3 bg-white/5 border-b border-white/10">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
          <span className="ml-4 text-xs text-white/40 font-mono">system_recovery.sh</span>
        </div>
        
        {/* Terminal content */}
        <div 
          ref={terminalRef}
          className="flex-1 p-4 md:p-6 overflow-y-auto font-mono text-sm md:text-base"
          onClick={() => inputRef.current?.focus()}
        >
          {/* Rendered lines */}
          {lines.map((line, i) => (
            <div key={i} className={`${getLineStyle(line.type)} leading-relaxed`}>
              {line.text || '\u00A0'}
            </div>
          ))}
          
          {/* Currently typing line */}
          {isTyping && currentLine && (
            <div className="text-white/80">
              {displayedText}
              <span className="animate-pulse">▋</span>
            </div>
          )}
          
          {/* User input line */}
          {canType && !isTyping && (
            <form onSubmit={handleSubmit} className="flex items-center">
              <span className="text-accent-cyan mr-2">&gt;</span>
              <input
                ref={inputRef}
                type="text"
                value={userInput}
                onChange={e => setUserInput(e.target.value)}
                className="flex-1 bg-transparent text-white outline-none font-mono"
                autoFocus
                autoComplete="off"
                spellCheck={false}
              />
              <span className="animate-pulse text-white">▋</span>
            </form>
          )}
        </div>
      </div>
    </motion.div>
  )
}
