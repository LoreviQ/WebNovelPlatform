import React, { useEffect } from "react";
import MyNavbar from "./components/navbar";
import MySideNav from "./components/sidenav";
import MyFooter from "./components/footer";
import MyHead from "./components/head";
import { initTheme } from "./utils/theme";

function App({ Page, pageProps }) {
    useEffect(() => {
        initTheme();
    }, []);
    return (
        <>
            <MyHead />
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
        </>
    );
}

export default App;
