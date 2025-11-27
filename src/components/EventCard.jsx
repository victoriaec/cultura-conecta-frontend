import React, { useState } from "react"


const API_BASE_URL = "http://localhost:3000"; 

export default function EventCard({ event, isFavorite, onToggleFavorite, onOpen }) {
  return (
    <article className="border rounded-lg overflow-hidden bg-white shadow-sm">
      <div className="relative">
        <img src={event.image} alt={event.title} className="w-full h-48 object-cover" />
        <button
          onClick={onToggleFavorite}
          aria-label="Favorito"
          className={`absolute top-2 right-2 p-2 rounded-full transition ${isFavorite ? "bg-red-500 text-white" : "bg-white text-gray-700"}`}
        >
          {isFavorite ? "♥" : "♡"}
        </button>
      </div>
      <div className="p-4">
        <h3 className="font-semibold">{event.title}</h3>
        <p className="text-sm text-gray-500">{new Date(event.date).toLocaleDateString()}</p>
        <p className="mt-2 text-sm">{event.location.commune} · {event.location.region}</p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm font-medium">{event.priceType === "free" ? "Gratis" : "Pagado"}</span>
          <button onClick={onOpen} className="btn bg-[#006A6A] text-white">Ver</button>
        </div>
      </div>
    </article>
  )
}


    return (
        <article className="border rounded-lg overflow-hidden bg-white shadow-sm">
            <div className="relative">
                <img src={event.image} alt={event.title} className="w-full h-48 object-cover" />
                <button
                    onClick={handleToggleFavorite} 
                    aria-label="Toggle Favorito"
                    disabled={isLoading} 
                    className={`absolute top-2 right-2 p-2 rounded-full transition ${isFavorite ? "bg-red-500 text-white" : "bg-white text-gray-700"} ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                    {isLoading ? "..." : isFavorite ? "♥" : "♡"}
                </button>
            </div>
            <div className="p-4">
                <h3 className="font-semibold">{event.title}</h3>
                <p className="text-sm text-gray-500">{new Date(event.date).toLocaleDateString()}</p>
                <p className="mt-2 text-sm">{event.location.commune} · {event.location.region}</p>
                <div className="mt-4 flex items-center justify-between">
                    <span className="text-sm font-medium">{event.priceType === "free" ? "Gratis" : "Pagado"}</span>
                    <button onClick={onOpen} className="btn bg-black text-white">Ver</button>
                </div>
            </div>
        </article>
    )
}