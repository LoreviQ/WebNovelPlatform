import React from "react";
import MyNavbar from "./Navbar";
import MySideNav from "./Sidenav";
import MyFooter from "./Footer";

function App() {
    return (
        <body className="sb-nav-fixed">
            <MyNavbar />
            <div id="layoutSidenav">
                <MySideNav />
                <div id="layoutSidenav_content" className="sb-sidenav-dark">
                    <main>{/* Placeholder for dynamic main component */}</main>
                    <MyFooter />
                </div>
            </div>
        </body>
    );
}

export default App;
