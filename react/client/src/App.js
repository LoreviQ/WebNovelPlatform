import React from "react";
import MyNavbar from "./components/navbar";
import MySideNav from "./components/sidenav";
import MyFooter from "./components/footer";

function App({ Page, pageProps }) {
    return (
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
    );
}

export default App;
