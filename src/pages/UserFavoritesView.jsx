import React, { useState, useEffect, useCallback } from "react";
import EventCard from "../components/EventCard";

// URL base de tu backend
const API_BASE_URL = "http://localhost:3000"; 

export default function UserFavoritesView() {
    const [favoriteEvents, setFavoriteEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const userEmail = localStorage.getItem("userEmail"); // Obtener email al inicio

    // Función para obtener los eventos favoritos
    const fetchFavorites = useCallback(async () => {
        if (!userEmail) {
            setError("Debes iniciar sesión para ver tus favoritos.");
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            // Llama a la nueva ruta GET para favoritos, pasando el email como parámetro de consulta
            const response = await fetch(`${API_BASE_URL}/favorites/user?email=${userEmail}`);
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Error al cargar: ${response.status}`);
            }

            const data = await response.json();
            // Suponemos que la API devuelve un array de eventos
            setFavoriteEvents(data.data || []); 

        } catch (err) {
            console.error("Error fetching favorites:", err);
            setError("No se pudieron cargar tus eventos favoritos. Intenta más tarde.");
            setFavoriteEvents([]);
        } finally {
            setIsLoading(false);
        }
    }, [userEmail]); // Dependencia: userEmail

    useEffect(() => {
        fetchFavorites();
    }, [fetchFavorites]);


    // Función que se pasa a EventCard para que se actualice después de un "desfavorito"
    const handleToggleFavorite = (eventId) => {
        // Opción 1: Re-fetch completo (más simple, menos eficiente)
        // fetchFavorites();

        // Opción 2: Actualización local (más rápido)
        setFavoriteEvents(prevEvents => prevEvents.filter(event => event.id !== eventId));
    };


    // --- Renderizado de la Vista ---

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
                    {favoriteEvents.map(item => (
                        <EventCard
                            // ⚠️ IMPORTANTE: El backend debe devolver el objeto Evento
                            key={item.id}
                            event={item}
                            isFavorite={true} // Siempre será true en esta vista
                            onToggleFavorite={handleToggleFavorite} 
                            onOpen={() => console.log("Abriendo detalle del evento", item.id)} // Implementa tu función de detalle aquí
                        />
                    ))}
                </div>
            )}
        </div>
    );
}