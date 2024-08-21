import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DOMPurify from "dompurify";
import Container from "react-bootstrap/esm/Container";

import { apiEndpoints, axiosAuthed } from "../utils/api";
import { useAuth } from "../utils/auth";

function Chapter(preFetchedChapter) {
    const { user } = useAuth();
    const { fictionid, chapterid } = useParams();
    const [chapterData, setChapterData] = useState(preFetchedChapter || null);
    const [isAuthor, setIsAuthor] = useState(false);

    useEffect(() => {
        const fetchDislayData = async () => {
            const { data: cData, cError } = await axiosAuthed("GET", apiEndpoints.chapter(fictionid, chapterid));
            if (cError) {
                alert("Failed to fetch chapters");
                navigate(-1);
                return;
            }
            setChapterData(cData);
            if (user && cData && cData.authorid && cData.authorid === user.id) {
                setIsAuthor(true);
            } else {
                setIsAuthor(false);
            }
        };
        fetchDislayData();
    }, [user, fictionid, chapterid]);

    return (
        <Container fluid className="py-4 px-4">
            <h1>{chapterData.title}</h1>
            <hr />
            <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(chapterData.body) }} />
        </Container>
    );
}

export default Chapter;
