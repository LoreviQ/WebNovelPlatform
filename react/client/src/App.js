import React from "react";
import MyNavbar from "./Navbar";
import SideNav from "./Sidenav";

function App() {
    return (
        <body className="sb-nav-fixed">
            <MyNavbar />
            <div id="layoutSidenav">
                <SideNav />
                <div id="layoutSidenav_content" className="sb-sidenav-dark">
                    <main>{/* Placeholder for dynamic main component */}</main>
                    {/* Placeholder for Footer component */}
                </div>
            </div>
            {/* Import your scripts.js here if it's a module */}
            {/* For Bootstrap JS, consider using React-Bootstrap or include it in your public/index.html */}
        </body>
    );
}

export default App;
