import React, { useEffect } from "react";

function Fictions() {
    useEffect(() => {
        document.title = "Fictions | WebNovelPlatform";
    }, []);

    return (
        <div className="container-fluid px-4">
            <h1 className="mt-4">Fictions</h1>
            <hr />
        </div>
    );
}

export default Fictions;
