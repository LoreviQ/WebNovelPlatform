import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [gettingUser, setGettingUser] = useState(true);
    const apiBaseUrl = process.env.API_URL || "https://webnovelapi-y5hewbdc4a-nw.a.run.app";

    useEffect(() => {
        setGettingUser(true);
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setGettingUser(false);
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
                localStorage.setItem("auth", JSON.stringify(data.auth));
                setUser(data.user);
                return true;
            } else {
                console.error("Login failed:", data.message);
                return false;
            }
        } catch (error) {
            console.error("Login request failed:", error);
            return false;
        }
    };

    const logout = () => {
        // Clear session from backend and local storage
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("auth");
    };

    return <AuthContext.Provider value={{ user, gettingUser, login, logout }}>{children}</AuthContext.Provider>;
}

const PrivateRoute = ({ component: Component, ...rest }) => {
    const { user } = useAuth();

    return <Route {...rest} render={(props) => (user ? <Component {...props} /> : <Redirect to="/login" />)} />;
};

export const useAuth = () => useContext(AuthContext);
export default PrivateRoute;