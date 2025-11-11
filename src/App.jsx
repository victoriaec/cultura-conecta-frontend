import { useMemo, useState } from "react"

// --- MOCK: 12 eventos de ejemplo ---
const MOCK_EVENTS = Array.from({ length: 12 }).map((_, i) => ({
  id: i + 1,
  title: `Evento cultural #${i + 1}`,
  date: new Date(Date.now() + i * 86400000).toISOString(),
  priceType: i % 3 === 0 ? "free" : "paid",
  category: ["Teatro", "Música", "Exposición", "Danza"][i % 4],
  location: {
    commune: ["Santiago", "Providencia", "Recoleta", "Ñuñoa"][i % 4],
    region: ["RM", "Valparaíso", "Biobío", "Los Lagos"][i % 4],
  },
  image: `https://picsum.photos/seed/cultura${i}/600/400`,
}))

function Navbar() {
  const link =
    "px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 transition"
  return (
    <header className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between p-4">
        <a href="/" className="text-xl font-semibold">
          Cultura Conecta
        </a>
        <div className="flex gap-2">
          <a className={link} href="/">Inicio</a>
          <a className={link} href="#favoritos">Favoritos</a>
        </div>
      </nav>
    </header>
  )
}

function Filters({ value, onChange }) {
  const [local, setLocal] = useState(value)
  // sincroniza si cambia desde afuera
  useMemo(() => local, [value])

  const CATEGORIES = ["Teatro", "Música", "Exposición", "Danza"]
  const REGIONS = ["RM", "Valparaíso", "Biobío", "Los Lagos"]

  function apply() {
    onChange(local)
  }

  return (
    <div className="grid gap-3 rounded-xl border p-3 md:grid-cols-4 bg-white">
      <select
        value={local.category || ""}
        onChange={(e) =>
          setLocal((v) => ({ ...v, category: e.target.value || undefined }))
        }
        className="rounded border p-2"
      >
        <option value="">Todas las categorías</option>
        {CATEGORIES.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      <select
        value={local.region || ""}
        onChange={(e) =>
          setLocal((v) => ({ ...v, region: e.target.value || undefined }))
        }
        className="rounded border p-2"
      >
        <option value="">Todas las regiones</option>
        {REGIONS.map((r) => (
          <option key={r} value={r}>
            {r}
          </option>
        ))}
      </select>

      <select
        value={local.free ?? ""}
        onChange={(e) =>
          setLocal((v) => ({ ...v, free: e.target.value || undefined }))
        }
        className="rounded border p-2"
      >
        <option value="">Gratis o pagado</option>
        <option value="true">Gratis</option>
        <option value="false">Pagado</option>
      </select>

      <button
        onClick={apply}
        className="rounded bg-black px-4 py-2 text-white"
      >
        Aplicar filtros
      </button>
    </div>
  )
}

function EventCard({ event }) {
  return (
    <div className="rounded-2xl overflow-hidden border bg-white shadow-sm">
      <img
        src={event.image}
        alt={event.title}
        className="h-40 w-full object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold line-clamp-2">{event.title}</h3>
        <p className="text-sm text-gray-600 mt-1">
          {new Date(event.date).toLocaleDateString()}
        </p>
        <p className="text-sm text-gray-600">
          {event.location?.commune}, {event.location?.region}
        </p>
        <div className="mt-2 inline-flex items-center gap-2 text-xs">
          <span className="rounded-full border px-2 py-0.5">{event.category}</span>
          <span className="rounded-full border px-2 py-0.5">
            {event.priceType === "free" ? "Gratis" : "Pagado"}
          </span>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  // estado de filtros + “paginación mínima” (page/pageSize)
  const [query, setQuery] = useState({ page: 1, pageSize: 9 })
  const start = (query.page - 1) * query.pageSize

  // filtra mock en memoria (luego lo reemplazamos por API)
  const filtered = useMemo(() => {
    let data = [...MOCK_EVENTS]
    if (query.category) data = data.filter((e) => e.category === query.category)
    if (query.region) data = data.filter((e) => e.location.region === query.region)
    if (query.free !== undefined) {
      data = data.filter((e) =>
        query.free === "true" ? e.priceType === "free" : e.priceType === "paid"
      )
    }
    return data
  }, [query])

  const pageData = filtered.slice(start, start + query.pageSize)
  const pages = Math.max(1, Math.ceil(filtered.length / query.pageSize))

  function goTo(p) {
    if (p < 1 || p > pages) return
    setQuery((q) => ({ ...q, page: p }))
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Navbar />

      <main className="mx-auto max-w-6xl p-4">
        <h1 className="text-3xl font-bold mb-4">¡Cultura Conecta!</h1>

        <div className="mb-4">
          <Filters
            value={query}
            onChange={(v) => setQuery((q) => ({ ...q, page: 1, ...v }))}
          />
        </div>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {pageData.map((e) => (
            <EventCard key={e.id} event={e} />
          ))}
        </section>

        {/* Paginación simple */}
        <div className="mt-6 flex items-center justify-center gap-2">
          <button
            onClick={() => goTo(query.page - 1)}
            disabled={query.page <= 1}
            className="rounded border px-3 py-1 disabled:opacity-50"
          >
            Anterior
          </button>
          <span className="text-sm">
            Página {query.page} de {pages}
          </span>
          <button
            onClick={() => goTo(query.page + 1)}
            disabled={query.page >= pages}
            className="rounded border px-3 py-1 disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>
      </main>
    </div>
  )
}
