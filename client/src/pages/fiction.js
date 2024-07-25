import React, { useEffect, useState } from "react";

import Container from "react-bootstrap/esm/Container";

function Fiction() {
    useEffect(() => {
        document.title = " | WebNovelPlatform";
    }, []);

    return (
        <Container fluid className="my-4 ms-2">
            <div style={{ display: "flex", alignItems: "center" }}>
                <img
                    className="me-4"
                    src={
                        fiction.imageLocation
                            ? fiction.imageLocation
                            : `${process.env.PUBLIC_URL}/image-placeholder.png`
                    }
                    alt="ProfilePicture"
                    style={{
                        width: "100px",
                        height: "100px",
                        backgroundColor: "#f0f0f0",
                        objectFit: "cover",
                    }}
                />
            </div>
            <hr />
        </Container>
    );
}

export default Fiction;
