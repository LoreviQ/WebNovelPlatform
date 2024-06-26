import React, { useEffect } from "react";

function Index() {
    useEffect(() => {
        document.title = "Home | WebNovelPlatform";
    }, []);
    return <h1>Index Page here</h1>;
}

export default Index;
