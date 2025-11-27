import React, { useState, useEffect, useCallback } from "react";
import EventCard from "../components/EventCard";

const API_BASE_URL = "http://localhost:3000"; 

export default function UserFavoritesView() {
    const [favoriteEvents, setFavoriteEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const userEmail = localStorage.getItem("userEmail"); 

    const fetchFavorites = useCallback(async () => {
        if (!userEmail) {
            setError("Debes iniciar sesión para ver tus favoritos.");
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`${API_BASE_URL}/favorites/user?email=${userEmail}`);
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Error al cargar: ${response.status}`);
            }

            const res = await response.json();
            const eventsArray = res.data || [];

            const mappedEvents = eventsArray.map(e => ({
                id: e.id,
                title: e.nombre, // <-- Mapear 'nombre' a 'title'
                date: e.fecha,
                // Mapear el precio a priceType
                priceType: e.precio === "0.00" || e.precio === 0 ? "free" : "paid", 
                location: {
                    // Mapear 'direccion' a 'location.commune'
                    commune: e.direccion || "", 
                    // Si el backend no envía la región, dejarla vacía o usar un valor por defecto
                    region: e.region || "" 
                },
                description: e.descripcion,
                image: `https://picsum.photos/seed/${e.id}/600/400`
            }));

            setFavoriteEvents(mappedEvents); 

        } catch (err) {
            console.error("Error fetching favorites:", err);
            setError("No se pudieron cargar tus eventos favoritos. Intenta más tarde.");
            setFavoriteEvents([]);
        } finally {
            setIsLoading(false);
        }
    }, [userEmail]); 

    useEffect(() => {
        fetchFavorites();
    }, [fetchFavorites]);


    const handleToggleFavorite = (eventId) => {
        // Ejecutar la acción DELETE en la API (manejo de desfavorito)
        // ... (Tu lógica de API DELETE, que ya debe estar en EventCard)
        
        // Actualización local (eliminando el evento de la vista)
        setFavoriteEvents(prevEvents => prevEvents.filter(event => event.id !== eventId));
    };



    if (!userEmail) {
        return <div className="p-8 text-center text-red-500">Por favor, inicia sesión para ver tus favoritos.</div>;
    }

    if (isLoading) {
        return <div className="p-8 text-center text-gray-600">Cargando favoritos...</div>;
    }

    if (error) {
        return <div className="p-8 text-center text-red-500">Error: {error}</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Mis Eventos Favoritos</h1>
            
            {favoriteEvents.length === 0 ? (
                <p className="text-gray-600">Aún no tienes eventos marcados como favoritos. ¡Busca algo que te guste!</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {favoriteEvents.map(event => (
                        <EventCard
                            key={event.id}
                            event={event} // Evento ya mapeado y estandarizado
                            isFavorite={true} // Siempre es favorito en esta vista
                            onToggleFavorite={() => handleToggleFavorite(event.id)} 
                            onOpen={() => console.log("Abriendo detalle del evento", event.id)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}