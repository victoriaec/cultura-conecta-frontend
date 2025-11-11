export default function EventCard({ event }) {
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
