import React, { useRef, useState, useEffect } from "react";
import { Container, Form, Button } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { SimpleEditor } from "../utils/textEditor";

function NewChapter() {
    const [title, setTitle] = useState("");
    const [releaseDate, setReleaseDate] = useState(new Date());
    const editorRef = useRef(null);
    const [editorHeight, setEditorHeight] = useState("300px");

    const handleSubmit = (e) => {
        e.preventDefault();
        const content = editorRef.current.getContent();
        console.log({ title, content, releaseDate });
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
            <Form onSubmit={handleSubmit}>
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
