import React, { useEffect } from "react";
import Container from "react-bootstrap/Container";
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
                <Container fluid="xl" id="layoutSidenav">
                    <MySideNav />
                    <div id="layoutSidenav_content" className="sb-sidenav-dark">
                        <main>{React.createElement(Page, pageProps)}</main>
                    </div>
                </Container>
            </div>
        </>
    );
}

export default App;
