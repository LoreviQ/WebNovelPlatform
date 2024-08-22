import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DOMPurify from "dompurify";
import Container from "react-bootstrap/esm/Container";

import { apiEndpoints, axiosAuthed } from "../utils/api";
import { useAuth } from "../utils/auth";

function Chapter(preFetchedFiction, preFetchedChapter) {
    const { user } = useAuth();
    const { fictionid, chapterid } = useParams();
    const [fictionData, setFictionData] = useState(preFetchedFiction || null);
    const [chapterData, setChapterData] = useState(preFetchedChapter || null);
    const [isAuthor, setIsAuthor] = useState(false);

    useEffect(() => {
        const fetchDislayData = async () => {
            const { data: fData, fError } = await axiosAuthed("GET", apiEndpoints.fiction(fictionid));
            if (fError) {
                alert("Failed to fetch fiction data");
                navigate(-1);
                return;
            }
            setFictionData(fData);
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
            <div style={{ display: "flex", justifyContent: "center", alignItems: "baseline" }}>
                <a
                    href={`/fictions/${fictionData.id}`}
                    style={{ fontSize: "2rem", textDecoration: "none", lineHeight: "1" }}
                >
                    {fictionData.title}
                </a>
                <p
                    className="ms-2"
                    style={{ fontStyle: "italic", margin: 0, lineHeight: "2rem", verticalAlign: "baseline" }}
                >
                    By <a href={`/user/${fictionData.authorid}/fictions`}>{fictionData.author}</a>
                </p>
            </div>
            <h1 style={{ display: "flex", justifyContent: "center" }}>{chapterData.title}</h1>
            <hr />
            <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(chapterData.body) }} />
        </Container>
    );
}

export default Chapter;
