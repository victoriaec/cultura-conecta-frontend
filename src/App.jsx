import { BrowserRouter, Routes, Route, Link } from "react-router-dom"
import Home from "./pages/Home"
import Login from "./pages/Login"
function Navbar() {
  const base = "px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 transition"
  return (
    <header className="sticky top-0 z-10 border-b bg-[#006A6A]">
      <nav className="mx-auto flex max-w-6xl items-center justify-between p-4 text-white">
         <Link to="/" className="text-xl font-semibold">Cultura Conecta</Link>
          <div className="flex gap-2">
          <Link className={base} to="/">Inicio</Link>
          <a className={base} href="#favoritos">Favoritos</a>
          <Link className={base} to="/login">Login</Link>
        </div>
      </nav>
    </header>
  )
}


export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
         <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}