import Link from 'next/link'

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full bg-black/80 backdrop-blur-xl border-b border-zinc-900">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-11 px-6 md:px-8">
        <Link
          href="/"
          className="text-sm font-semibold tracking-tight text-zinc-100 hover:text-zinc-300 transition-colors"
        >
          From Adam to Jesus
        </Link>
        <nav className="flex items-center gap-4 text-xs font-medium text-zinc-400">
          <Link href="/lineage" className="hover:text-zinc-200 transition">Genealogy</Link>
          <Link href="/disciples/martyrdom" className="hover:text-zinc-200 transition">Disciples</Link>
          <Link href="/bible" className="text-[#00f0ff] hover:underline font-mono font-semibold transition">Bible TUI</Link>
        </nav>
      </div>
    </header>
  )
}
