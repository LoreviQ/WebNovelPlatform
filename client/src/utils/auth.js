import React, { createContext, useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import LoadingAnimation from "../components/loading";
import Login from "../pages/login";
import Error from "../pages/error";
import App from "../App";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [gettingUser, setGettingUser] = useState(true);
    const apiBaseUrl = process.env.API_URL || "https://webnovelapi-y5hewbdc4a-nw.a.run.app";

    // Gets the user data from local storage and checks if the user is authenticated
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

    // Logs the user in and stores the user data and access token
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

    // Logs the user out by removing all stored data
    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("access");
        revokeRefresh();
    };

    const revokeRefresh = () => {
        const refresh = JSON.parse(localStorage.getItem("refresh"));
        if (refresh) {
            fetch(apiBaseUrl + "/v1/revoke", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + refresh.token,
                },
            });
        }
        localStorage.removeItem("refresh");
    };

    const awaitUser = async () => {
        // Wait for gettingUser to be false if uid is 'me'
        await new Promise((resolve) => {
            const checkUserInterval = setInterval(() => {
                if (!gettingUser) {
                    clearInterval(checkUserInterval);
                    resolve();
                }
            }, 5);
        });
    };

    const authApi = (apiFunction, ...args) => {
        const access = JSON.parse(localStorage.getItem("access"));
        return apiFunction(access.token, ...args);
    };

    return (
        <AuthContext.Provider value={{ user, gettingUser, awaitUser, login, logout, authApi }}>
            {children}
        </AuthContext.Provider>
    );
}

const PrivateRoute = ({ children }) => {
    const { user, gettingUser } = useAuth();
    if (gettingUser) {
        return <LoadingAnimation />;
    }
    return user ? children : <Login />;
};

const PrivateRouteUserid = ({ children }) => {
    const { userid } = useParams();
    const { user, gettingUser } = useAuth();
    if (gettingUser) {
        return <LoadingAnimation />;
    }
    return userid === user.id ? children : <App Page={Error} pageProps={{ statusCode: 401 }} />;
};

//automatically applies correct router based on userid
const UserIDRouter = ({ children }) => {
    const { userid } = useParams();
    if (userid === "me") {
        return <PrivateRoute>{children}</PrivateRoute>;
    } else {
        return <PrivateRouteUserid>{children}</PrivateRouteUserid>;
    }
};

export const useAuth = () => useContext(AuthContext);
export { PrivateRoute, PrivateRouteUserid, UserIDRouter };
