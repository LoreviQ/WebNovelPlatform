import React, { useEffect } from "react";

function Error({ statusCode }) {
    useEffect(() => {
        document.title = `${statusCode} Error | WebNovelPlatform`;
    }, [statusCode]);
    let message, details;
    switch (statusCode) {
        case 401:
            message = "Unauthorized";
            details = "You are not authorized to view this page.";
            break;
        case 403:
            message = "Forbidden";
            details = "You do not have permission to view this page.";
            break;
        case 404:
            message = "Not Found";
            details = "The requested page could not be found.";
            break;
        case 500:
            message = "Internal Server Error";
            details = "An error occurred on the server.";
            break;
        default:
            message = "Error";
            details = "An error occurred.";
    }
    return (
        <main>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-6">
                        <div className="text-center mt-4">
                            <h1 className="display-1">{statusCode}</h1>
                            <p className="lead">{message}</p>
                            <p>{details}</p>
                            <a href="/">
                                <i className="fas fa-arrow-left me-1"></i>
                                Return to Dashboard
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default Error;
