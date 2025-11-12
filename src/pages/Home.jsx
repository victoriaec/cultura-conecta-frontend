// ...existing code...
import { useMemo, useState, useEffect } from "react"
import EventCard from "../components/EventCard"
import Filters from "../components/Filters"
import Pagination from "../components/Pagination"
import Modal from "../components/Modal"

// Mock temporal (luego lo moveremos a services/mock.js)
const MOCK_EVENTS = Array.from({ length: 120 }).map((_, i) => ({
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

export default function Home() {
  const [params, setParams] = useState({ page: 1, pageSize: 9, search: undefined, sort: undefined })
  const [favorites, setFavorites] = useState(() => {
    try { return JSON.parse(localStorage.getItem("favorites") || "[]") } catch { return [] }
  })
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites))
  }, [favorites])

  const start = (params.page - 1) * params.pageSize

  const filtered = useMemo(() => {
    let data = [...MOCK_EVENTS]
    if (params.category) data = data.filter(e => e.category === params.category)
    if (params.region) data = data.filter(e => e.location.region === params.region)
    if (params.free !== undefined) {
      data = data.filter(e =>
        params.free === "true" ? e.priceType === "free" : e.priceType === "paid"
      )
    }
    if (params.search) {
      const q = params.search.toLowerCase()
      data = data.filter(e => e.title.toLowerCase().includes(q) || e.location.commune.toLowerCase().includes(q))
    }
    if (params.sort) {
      if (params.sort === "date_asc") data.sort((a,b) => new Date(a.date) - new Date(b.date))
      if (params.sort === "date_desc") data.sort((a,b) => new Date(b.date) - new Date(a.date))
      if (params.sort === "title_asc") data.sort((a,b) => a.title.localeCompare(b.title))
    }
    return data
  }, [params])

  const total = filtered.length
  const pageData = filtered.slice(start, start + params.pageSize)

  function toggleFavorite(id) {
    setFavorites(f => (f.includes(id) ? f.filter(x => x !== id) : [...f, id]))
  }

  return (
    <main className="mx-auto max-w-6xl p-4">
      <h1 className="text-3xl font-bold mb-4">¡Cultura Conecta!</h1>

      <div className="flex items-center justify-between mb-4 gap-4">
        <div>
          <p className="text-sm text-gray-600">Resultados: <strong>{total}</strong></p>
          <p className="text-sm text-gray-600">Favoritos: <strong>{favorites.length}</strong></p>
        </div>
      </div>

      <div className="mb-4">
        <Filters value={params} onChange={(v) => setParams(p => ({ ...p, page: 1, ...v }))} />
      </div>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {pageData.map(e =>
          <EventCard
            key={e.id}
            event={e}
            isFavorite={favorites.includes(e.id)}
            onToggleFavorite={() => toggleFavorite(e.id)}
            onOpen={() => setSelected(e)}
          />
        )}
      </section>

      <div className="mt-6">
        <Pagination
          page={params.page}
          pageSize={params.pageSize}
          total={total}
          onPage={(page) => setParams(p => ({ ...p, page }))}
        />
      </div>

      {selected && (
        <Modal onClose={() => setSelected(null)}>
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">{selected.title}</h2>
            <img src={selected.image} alt={selected.title} className="w-full rounded" />
            <p><strong>Fecha:</strong> {new Date(selected.date).toLocaleString()}</p>
            <p><strong>Ubicación:</strong> {selected.location.commune}, {selected.location.region}</p>
            <p><strong>Tipo:</strong> {selected.priceType === "free" ? "Gratis" : "Pagado"}</p>
            <div className="flex justify-end">
              <button onClick={() => setSelected(null)} className="btn bg-black text-white">Cerrar</button>
            </div>
          </div>
        </Modal>
      )}
    </main>
  )
}
// ...existing code...