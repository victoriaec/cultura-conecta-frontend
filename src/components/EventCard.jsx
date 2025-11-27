import React, { useState } from "react"


const API_BASE_URL = "http://localhost:3000"; 

export default function EventCard({ event, isFavorite, onToggleFavorite, onOpen }) {
    const [isLoading, setIsLoading] = useState(false);

    // Función para manejar el favorito/desfavorito
    const handleToggleFavorite = async () => {
        const userEmail = localStorage.getItem("userEmail");

        if (!userEmail) {
            alert("Debes iniciar sesión para marcar favoritos.");
            console.error("No se encontró 'userEmail' en localStorage.");
            return;
        }

        setIsLoading(true);

        const method = isFavorite ? "DELETE" : "POST";
        const url = `${API_BASE_URL}/favorites`;
        
        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ 
                    userEmail: userEmail, 
                    eventId: event.id 
                }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Respuesta de favoritos:", data);
                
                if (typeof onToggleFavorite === "function") {
                    onToggleFavorite(event.id);
                }

            } else {
                const errorData = await response.json();
                alert(`Error al procesar favoritos: ${errorData.error}`);
                console.error("Error en la solicitud:", errorData);
            }

        } catch (error) {
            console.error("Error de red:", error);
            alert("Error de conexión con el servidor.");
        } finally {
            setIsLoading(false);
        }
    };


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
                <p className="mt-2 text-sm">
                    {/* Si event.location existe, lee commune. Si no, usa una cadena vacía o un valor por defecto. */}
                    {event.location?.commune || 'Ubicación Desconocida'} 
                    {' · '} 
                    {event.location?.region || 'Región Desconocida'}
                </p>
                
                <div className="mt-4 flex items-center justify-between">
                    <span className="text-sm font-medium">{event.priceType === "free" ? "Gratis" : "Pagado"}</span>
                    <button onClick={onOpen} className="btn bg-black text-white">Ver</button>
                </div>
            </div>
        </article>
    )
}