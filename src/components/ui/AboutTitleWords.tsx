// "De physicien à … développeur": one treatment on the home section and the About
// page (V6-DES-09). The two trades read in pink Fraunces italic, misregistered, the
// ellipsis stays light, the rest is set in black capitals. Each word is a
// `.title-word` span, which the home section reveals word by word.
const ACCENT_WORDS = ['physicien', 'developpeur', 'physicist', 'developer']

export function AboutTitleWords({ text }: { text: string }) {
  return text.split(' ').map((word, i) => {
    const clean = word.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    const style = ACCENT_WORDS.includes(clean)
      ? 'fraunces-display-italic text-riso-pinkTitle misregister'
      : word === '…'
        ? 'font-display font-light text-subtle'
        : 'font-display uppercase font-black tracking-wide'
    return (
      <span key={i} className={`title-word inline-block mr-[0.2em] ${style}`}>
        {word}
      </span>
    )
  })
}
