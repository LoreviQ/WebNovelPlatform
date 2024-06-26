import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const apiBaseUrl = process.env.API_URL;

    useEffect(() => {
        // Check local storage or cookie for existing login session
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const logout = () => {
        // Clear session from backend and local storage
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("auth");
    };

    return <AuthContext.Provider value={{ user, logout }}>{children}</AuthContext.Provider>;
}

const PrivateRoute = ({ component: Component, ...rest }) => {
    const { user } = useAuth();

    return <Route {...rest} render={(props) => (user ? <Component {...props} /> : <Redirect to="/login" />)} />;
};

export const useAuth = () => useContext(AuthContext);
export default PrivateRoute;
