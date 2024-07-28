import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Container from "react-bootstrap/esm/Container";

import { apiEndpoints, axiosAuthed } from "../utils/api";
import LoadingAnimation from "../components/loading";

function Fiction() {
    const { fictionid } = useParams();
    const [fictionData, setFictionData] = useState(null);

    useEffect(() => {
        const fetchFictionData = async () => {
            const { data, error } = await axiosAuthed("GET", apiEndpoints.getFictionByID + fictionid);
            if (error) {
                alert("Failed to fetch fiction data");
                navigate(-1);
                return;
            }
            setFictionData(data);
        };

        fetchFictionData();
        document.title = " | WebNovelPlatform";
    }, []);
    if (!fictionData) {
        return <LoadingAnimation />;
    }
    return (
        <Container fluid className="my-4 ms-2">
            <div id="div1" style={{ display: "flex", alignItems: "flex-start", position: "relative" }}>
                <img
                    className="me-4"
                    src={fictionData.imageLocation || `${process.env.PUBLIC_URL}/image-placeholder.png`}
                    alt="ProfilePicture"
                    style={{
                        width: "auto",
                        maxWidth: "25%",
                        maxHeight: "200px",
                        backgroundColor: "#f0f0f0",
                        objectFit: "cover",
                    }}
                />
                <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                    <h1 style={{ textAlign: "center", transform: "translateX(-12.5%)" }}>{fictionData.title}</h1>
                    <p style={{ textAlign: "left", margin: "0 auto" }}>{fictionData.description}</p>
                </div>
            </div>
            <hr />
        </Container>
    );
}

export default Fiction;
