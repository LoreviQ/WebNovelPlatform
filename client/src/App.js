import React, { useEffect } from "react";
import MyNavbar from "./components/navbar";
import MySideNav from "./components/sidenav";
import MyFooter from "./components/footer";
import MyHead from "./components/head";
import { initTheme } from "./utils/theme";
import { AuthProvider } from "./utils/auth";

function App({ Page, pageProps }) {
    useEffect(() => {
        initTheme();
    }, []);
    return (
        <>
            <MyHead />
            <AuthProvider>
                <div className="sb-nav-fixed">
                    <MyNavbar />
                    <div id="layoutSidenav">
                        <MySideNav />
                        <div id="layoutSidenav_content" className="sb-sidenav-dark">
                            <main>{React.createElement(Page, pageProps)}</main>
                            <MyFooter />
                        </div>
                    </div>
                </div>
            </AuthProvider>
        </>
    );
}

export default App;
