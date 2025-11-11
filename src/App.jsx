function Navbar() {
  const base = "px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 transition"
  return (
    <header className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between p-4">
        <a href="/" className="text-xl font-semibold">Cultura Conecta</a>
        <div className="flex gap-2">
          <a className={base} href="/">Inicio</a>
          <a className={base} href="#favoritos">Favoritos</a>
        </div>
      </nav>
    </header>
  )
}

import Home from "./pages/Home"

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Navbar />
      <Home />
    </div>
  )
}
