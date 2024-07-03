import React from "react";
import Container from "react-bootstrap/esm/Container";

function MyFooter() {
    return (
        <footer className="sb-sidenav-footer">
            <Container fluid className="mt-auto px-4 py-4">
                <div className="d-flex align-items-center justify-content-between small">
                    <div className="text-muted">WebNovelPlatform &copy; 2024</div>
                    <div>
                        <a href="#">Privacy Policy</a>
                        &middot;
                        <a href="#">Terms &amp; Conditions</a>
                    </div>
                </div>
            </Container>
        </footer>
    );
}

export default MyFooter;
