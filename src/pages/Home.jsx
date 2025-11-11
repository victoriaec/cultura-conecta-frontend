import { useMemo, useState } from "react"
import EventCard from "../components/EventCard"
import Filters from "../components/Filters"
import Pagination from "../components/Pagination"

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
  const [params, setParams] = useState({ page: 1, pageSize: 9 })
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
    return data
  }, [params])

  const total = filtered.length
  const pageData = filtered.slice(start, start + params.pageSize)

  return (
    <main className="mx-auto max-w-6xl p-4">
      <h1 className="text-3xl font-bold mb-4">¡Cultura Conecta!</h1>

      <div className="mb-4">
        <Filters value={params} onChange={(v) => setParams(p => ({ ...p, page: 1, ...v }))} />
      </div>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {pageData.map(e => <EventCard key={e.id} event={e} />)}
      </section>

      <div className="mt-6">
        <Pagination
          page={params.page}
          pageSize={params.pageSize}
          total={total}
          onPage={(page) => setParams(p => ({ ...p, page }))}
        />
      </div>
    </main>
  )
}
