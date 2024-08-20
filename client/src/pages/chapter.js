import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Container from "react-bootstrap/esm/Container";

function Chapter(preFetchedChapter) {
    const { fictionid, chapterid } = useParams();
    const [chapterData, setChapterData] = useState(preFetchedChapter || null);

    return (
        <Container fluid className="py-4 px-4">
            Chapter Data!
        </Container>
    );
}

export default Chapter;
