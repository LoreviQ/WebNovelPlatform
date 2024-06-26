import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const apiBaseUrl = "https://webnovelapi-y5hewbdc4a-nw.a.run.app";

    useEffect(() => {
        // Check local storage or cookie for existing login session
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = async (email, password) => {
        try {
            const response = await fetch(apiBaseUrl + "/v1/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: email, password: password }),
            });
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem("user", JSON.stringify(data.user));
                localStorage.setItem("auth", JSON.stringify(data.auth)); // Assuming the token is in data.token
            } else {
                // Handle login error (e.g., invalid credentials)
                console.error("Login failed:", data.message);
            }
        } catch (error) {
            console.error("Login request failed:", error);
        }
    };

    const logout = () => {
        // Clear session from backend and local storage
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("auth");
    };

    return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}

const PrivateRoute = ({ component: Component, ...rest }) => {
    const { user } = useAuth();

    return <Route {...rest} render={(props) => (user ? <Component {...props} /> : <Redirect to="/login" />)} />;
};

export const useAuth = () => useContext(AuthContext);
export default PrivateRoute;
