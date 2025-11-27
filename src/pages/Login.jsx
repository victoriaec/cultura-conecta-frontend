import React, { useState } from "react";

export default function Login({ onLogin }) {
    // 1. **Nuevo estado para username**
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState(""); 
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false); 

    // URL a la que deseas hacer la solicitud POST (ajusta esta URL)
    const LOGIN_API_URL = "http://localhost:3000/users"; 

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Incluir el username en las credenciales
        const creds = { email, username, password }; 

        // 1. **Guardar el correo electrónico en localStorage** (sin cambios)
        localStorage.setItem("userEmail", email);
        console.log("Email guardado en localStorage:", email);

        // 2. **Realizar la solicitud POST a la API** (cuerpo de la solicitud actualizado)
        try {
            const response = await fetch(LOGIN_API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(creds), // <-- ENVÍA username, email, y password
            });

            // 3. Manejar la respuesta
            if (response.ok) {
                const data = await response.json();
                console.log("Login exitoso. Respuesta del servidor:", data);
                
                if (typeof onLogin === "function") {
                    onLogin(creds);
                }

            } else {
                console.error("Error en el login. Código de estado:", response.status);
            }
        } catch (error) {
            console.error("Error de red o del servidor:", error);
        } finally {
            setLoading(false);
            // Resetear campos (opcional)
            setPassword("");
        }
    };

    const containerStyle = {
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f4f6f8",
        fontFamily: "sans-serif",
        padding: "16px",
    };

    const cardStyle = {
        width: "100%",
        maxWidth: 420,
        background: "#fff",
        padding: "24px",
        borderRadius: 8,
        boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
    };

    const labelStyle = {
        display: "block",
        fontSize: 14,
        marginBottom: 6,
        color: "#333",
    };

    const inputStyle = {
        width: "100%",
        padding: "10px 12px",
        fontSize: 14,
        borderRadius: 6,
        border: "1px solid #dcdfe6",
        marginBottom: 16,
        boxSizing: "border-box",
    };

    const buttonStyle = {
        width: "100%",
        padding: "10px 12px",
        fontSize: 15,
        borderRadius: 6,
        border: "none",
        background: "#2f80ed",
        color: "#fff",
        cursor: loading ? "not-allowed" : "pointer", 
        opacity: loading ? 0.7 : 1,
    };

    return (
        <div style={containerStyle}>
            <div style={cardStyle}>
                <h2 style={{ marginTop: 0, marginBottom: 8 }}>Sign in</h2>
                <p style={{ marginTop: 0, marginBottom: 20, color: "#666" }}>
                    Enter your credentials to continue.
                </p>

                <form onSubmit={handleSubmit} noValidate>
                    <label style={labelStyle} htmlFor="username">
                        Username
                    </label>
                    <input
                        id="username"
                        name="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        style={inputStyle}
                        autoComplete="username"
                    />

                    <label style={labelStyle} htmlFor="email">
                        Email
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={inputStyle}
                        autoComplete="email"
                    />
                    <label style={labelStyle} htmlFor="password">
                        Password
                    </label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={inputStyle}
                        autoComplete="current-password"
                    />

                    <button type="submit" style={buttonStyle} disabled={loading}>
                        {loading ? "Logging in..." : "Log in"}
                    </button>
                </form>
            </div>
        </div>
    );
}