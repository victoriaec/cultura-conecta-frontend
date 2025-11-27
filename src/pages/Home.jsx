import { useState, useEffect, useMemo } from "react"
import EventCard from "../components/EventCard"
import Filters from "../components/Filters"
import Pagination from "../components/Pagination"
import Modal from "../components/Modal"
import { fetchEvents } from "../api/events"
import logo from "../assets/Logo2.png"

export default function Home() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [params, setParams] = useState({
    page: 1,
    pageSize: 9,
    search: undefined,
    sort: undefined,
    free: undefined
  })
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("favorites") || "[]")
    } catch {
      return []
    }
  })
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites))
  }, [favorites])

  useEffect(() => {
    const getEvents = async () => {
    setLoading(true)
    try {
      const res = await fetchEvents()
      console.log("Eventos del backend:", res)

      const eventsArray = res.data || []

      const mappedEvents = eventsArray.map(e => ({
        id: e.id,
        title: e.nombre,
        date: e.fecha,
        priceType: e.precio === "0.00" ? "free" : "paid",
        location: {
          commune: e.direccion || "",
          region: ""
        },
        description: e.descripcion,
        image: `https://picsum.photos/seed/${e.id}/600/400`
      }))

      setEvents(mappedEvents)
    } catch (error) {
      console.error("Error al cargar eventos:", error)
      setEvents([])
    } finally {
      setLoading(false)
    }
  }

    getEvents()
  }, [])

  const start = (params.page - 1) * params.pageSize

  // Aplicar filtros y búsqueda
  const filtered = useMemo(() => {
    let data = [...events]

    if (params.free !== undefined) {
      data = data.filter(e =>
        params.free === "true" ? e.priceType === "free" : e.priceType === "paid"
      )
    }

    if (params.search) {
      const q = params.search.toLowerCase()
      data = data.filter(
        e =>
          e.title.toLowerCase().includes(q) ||
          e.location.commune.toLowerCase().includes(q)
      )
    }

    if (params.sort) {
      if (params.sort === "date_asc") data.sort((a, b) => new Date(a.date) - new Date(b.date))
      if (params.sort === "date_desc") data.sort((a, b) => new Date(b.date) - new Date(a.date))
      if (params.sort === "title_asc") data.sort((a, b) => a.title.localeCompare(b.title))
    }

    return data
  }, [events, params])

  const total = filtered.length
  const pageData = filtered.slice(start, start + params.pageSize)

  function toggleFavorite(id) {
    setFavorites(f =>
      f.includes(id) ? f.filter(x => x !== id) : [...f, id]
    )
  }

  return (
    <main className="mx-auto max-w-6xl p-4">
      <img src={logo} alt="Cultura Conecta" className="h-16 w-auto mb-4" />

      <div className="flex items-center justify-between mb-4 gap-4">
        <div>
          <p className="text-sm text-gray-600">Resultados: <strong>{total}</strong></p>
          <p className="text-sm text-gray-600">Favoritos: <strong>{favorites.length}</strong></p>
        </div>
      </div>

      <div className="mb-4">
        <Filters value={params} onChange={v => setParams(p => ({ ...p, page: 1, ...v }))} />
      </div>

      {loading ? (
        <p>Cargando eventos...</p>
      ) : (
        <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {pageData.map(e => (
            <EventCard
              key={e.id}
              event={e}
              isFavorite={favorites.includes(e.id)}
              onToggleFavorite={() => toggleFavorite(e.id)}
              onOpen={() => setSelected(e)}
            />
          ))}
        </section>
      )}

      <div className="mt-6">
        <Pagination
          page={params.page}
          pageSize={params.pageSize}
          total={total}
          onPage={page => setParams(p => ({ ...p, page }))}
        />
      </div>

      {selected && (
        <Modal onClose={() => setSelected(null)}>
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">{selected.title}</h2>
            <img src={selected.image} alt={selected.title} className="w-full rounded" />
            <p><strong>Fecha:</strong> {new Date(selected.date).toLocaleString()}</p>
            <p><strong>Ubicación:</strong> {selected.location.commune}</p>
            <p><strong>Tipo:</strong> {selected.priceType === "free" ? "Gratis" : "Pagado"}</p>
            <p>{selected.description}</p>
            <div className="flex justify-end">
              <button onClick={() => setSelected(null)} className="btn bg-[#006A6A] text-white">Cerrar</button>
            </div>
          </div>
        </Modal>
      )}
    </main>
  )
}

