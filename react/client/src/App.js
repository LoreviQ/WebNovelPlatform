import React from "react";
import MyNavbar from "./components/navbar";
import MySideNav from "./components/sidenav";
import MyFooter from "./components/footer";

import "./css/styles.css";

function App({ Page }) {
    return (
        <body className="sb-nav-fixed">
            <MyNavbar />
            <div id="layoutSidenav">
                <MySideNav />
                <div id="layoutSidenav_content" className="sb-sidenav-dark">
                    <main>
                        <Page />
                    </main>
                    <MyFooter />
                </div>
            </div>
        </body>
    );
}

export default App;
