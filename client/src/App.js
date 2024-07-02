import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import MyNavbar from "./components/navbar";
import MySideNav from "./components/sidenav";
import MyFooter from "./components/footer";
import MyHead from "./components/head";
import { initTheme } from "./utils/theme";

function App({ Page, pageProps }) {
    const [isSideNavVisible, setIsSideNavVisible] = useState(true);
    const toggleSideNav = () => {
        setIsSideNavVisible(!isSideNavVisible);
    };
    useEffect(() => {
        initTheme();
    }, []);
    return (
        <>
            <MyHead />
            <div className="sb-nav-fixed">
                <MyNavbar toggleSideNav={toggleSideNav} />
                <Container fluid="xl" id="layoutSidenav">
                    <MySideNav />
                    <div id="layoutSidenav_content" className="sb-sidenav-dark">
                        <main id="content_main">{React.createElement(Page, pageProps)}</main>
                    </div>
                </Container>
                <MyFooter />
            </div>
        </>
    );
}

export default App;
