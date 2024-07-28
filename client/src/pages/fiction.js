import React, { useEffect, useState } from "react";

import { apiEndpoints, axiosAuthed } from "../utils/api";
import Container from "react-bootstrap/esm/Container";

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

    return (
        <Container fluid className="my-4 ms-2">
            <div style={{ display: "flex", alignItems: "center" }}>
                <img
                    className="me-4"
                    src={`${process.env.PUBLIC_URL}/image-placeholder.png`}
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
