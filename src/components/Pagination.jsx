export default function Pagination({ page, pageSize, total, onPage }) {
  const pages = Math.max(1, Math.ceil(total / pageSize))
  return (
    <div className="flex items-center justify-center gap-2">
      <button
        disabled={page <= 1}
        onClick={() => onPage(page - 1)}
        className="rounded border px-3 py-1 disabled:opacity-50"
      >
        Anterior
      </button>
      <span className="text-sm">Página {page} de {pages}</span>
      <button
        disabled={page >= pages}
        onClick={() => onPage(page + 1)}
        className="rounded border px-3 py-1 disabled:opacity-50"
      >
        Siguiente
      </button>
    </div>
  )
}
