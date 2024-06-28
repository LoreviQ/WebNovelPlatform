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
        const verifyAuth = async () => {
            if (!(await checkAuth())) {
                logout();
            }
        };
        verifyAuth();
    }, []);

    const login = async (email, password, remember_me) => {
        try {
            const response = await fetch(apiBaseUrl + "/v1/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: email, password: password, remember_me: remember_me }),
            });
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem("user", JSON.stringify(data.user));
                localStorage.setItem("access", JSON.stringify(data.auth.access));
                if (remember_me) {
                    localStorage.setItem("refresh", JSON.stringify(data.auth.refresh));
                }
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
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
    };

    // Checks the current time against the expiry time of the access token
    const checkAuth = async () => {
        const access = JSON.parse(localStorage.getItem("access"));
        if (access) {
            const expires = new Date(access.expires);
            if (expires > new Date()) {
                return true;
            }
        }
        return await refreshAuth();
    };

    // Refreshes the access token using the refresh token
    const refreshAuth = async () => {
        const refresh = JSON.parse(localStorage.getItem("refresh"));
        if (!refresh) {
            return false;
        }
        const expires = new Date(refresh.expires);
        if (expires < new Date()) {
            return false;
        }
        try {
            const response = await fetch(apiBaseUrl + "/v1/refresh", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + refresh.token,
                },
            });
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem("access", JSON.stringify(data));
                return true;
            } else {
                console.error("Refresh failed:", data.message);
                return false;
            }
        } catch (error) {
            console.error("Refresh request failed:", error);
            return false;
        }
    };

    return <AuthContext.Provider value={{ user, gettingUser, login, logout }}>{children}</AuthContext.Provider>;
}

const PrivateRoute = ({ component: Component, ...rest }) => {
    const { user } = useAuth();

    return <Route {...rest} render={(props) => (user ? <Component {...props} /> : <Redirect to="/login" />)} />;
};

export const useAuth = () => useContext(AuthContext);
export default PrivateRoute;
