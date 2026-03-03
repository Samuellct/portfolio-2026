import TransitionLink from '@/components/navigation/TransitionLink'
import content from '@/lib/content.json'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-primary">
      <div className="text-center px-6">
        <h1 className="font-display text-[clamp(6rem,20vw,15rem)] leading-none text-white/10">
          {content.common.notFound.code}
        </h1>
        <h2 className="font-display text-2xl md:text-4xl mb-4 -mt-8">
          {content.common.notFound.title}
        </h2>
        <p className="text-white/50 mb-8 max-w-md mx-auto">
          {content.common.notFound.description}
        </p>
        <TransitionLink
          href="/"
          className="inline-flex items-center gap-3 px-8 py-4 bg-accent-cyan text-black text-sm font-medium tracking-[0.15em] uppercase transition-all hover:bg-white"
        >
          {content.common.notFound.backHome}
        </TransitionLink>
      </div>
    </div>
  )
}
