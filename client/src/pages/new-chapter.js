import React, { useRef, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Form, Button } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { SimpleEditor } from "../utils/textEditor";
import { apiEndpoints, axiosAuthed } from "../utils/api";

function NewChapter() {
    const { fictionid } = useParams();
    const [title, setTitle] = useState("");
    const [releaseDate, setReleaseDate] = useState(new Date());
    const editorRef = useRef(null);
    const [editorHeight, setEditorHeight] = useState("300px");
    const navigate = useNavigate();

    const formSubmission = async (event) => {
        event.preventDefault();
        try {
            const { data, error } = await axiosAuthed("POST", apiEndpoints.chapters(fictionid), {
                title: title,
                body: editorRef.current.getContent(),
                published: 1,
            });
            if (error) {
                throw new Error("Failed POST request to API");
            }
            navigate(-1);
        } catch (error) {
            alert("Failed to submit fiction, error: " + error);
        }
    };

    useEffect(() => {
        const handleResize = () => {
            const height = window.innerHeight - 456; // Adjust based on your layout
            setEditorHeight(`${height}px`);
        };

        window.addEventListener("resize", handleResize);
        handleResize(); // Initial call

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <Container fluid className="my-4 ms-2">
            <Form onSubmit={formSubmission}>
                <Form.Group controlId="chapterTitle">
                    <Form.Label>Chapter Title</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter chapter title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </Form.Group>
                <Form.Group controlId="chapterContent" className="my-4">
                    <Form.Label>Chapter Content</Form.Label>
                    <SimpleEditor ref={editorRef} />
                </Form.Group>
                <Form.Group controlId="releaseDate" className="my-4">
                    <Form.Label>Release Date</Form.Label>
                    <div>
                        <DatePicker selected={releaseDate} onChange={(date) => setReleaseDate(date)} />
                    </div>
                </Form.Group>
                <div className="d-grid gap-2">
                    <Button variant="outline-theme" type="submit">
                        Submit
                    </Button>
                </div>
            </Form>
        </Container>
    );
}

export default NewChapter;
