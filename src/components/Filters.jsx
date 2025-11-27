import { useEffect, useState } from "react"

const CATEGORIES = ["Cultural"]

export default function Filters({ value, onChange }) {
  const [local, setLocal] = useState(value)

  useEffect(() => setLocal(value), [value])

  function apply() {
    onChange(local)
  }

  return (
    <div className="grid gap-3 rounded-xl border p-3 md:grid-cols-4 bg-white">
      {/* search */}
      <input
        type="search"
        placeholder="Buscar eventos..."
        value={local.search || ""}
        onChange={(e) => setLocal((v) => ({ ...v, search: e.target.value || undefined }))}
        className="rounded border p-2 md:col-span-2"
      />

      {/* category */}
      <select
        value={local.category || ""}
        onChange={(e) =>
          setLocal((v) => ({ ...v, category: e.target.value || undefined }))
        }
        className="rounded border p-2"
      >
        <option value="">Todas las categorías</option>
        {CATEGORIES.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>

      {/* free / paid */}
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

      {/* sort */}
      <select
        value={local.sort || ""}
        onChange={(e) => setLocal((v) => ({ ...v, sort: e.target.value || undefined }))}
        className="rounded border p-2"
      >
        <option value="">Orden por</option>
        <option value="date_asc">Fecha: más cercanas</option>
        <option value="date_desc">Fecha: más lejanas</option>
        <option value="title_asc">Título A→Z</option>
      </select>

      <button onClick={apply} className="rounded bg-[#006A6A] px-4 py-2 text-white">
        Aplicar filtros
      </button>
    </div>
  )
}
