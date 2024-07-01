import { useNavigate } from "react-router-dom";

function useNavigateUp() {
    const navigate = useNavigate();

    return () => {
        const path = window.location.pathname;
        const segments = path.split("/").filter(Boolean); // Remove empty segments
        segments.pop(); // Remove the last segment
        const newPath = `/${segments.join("/")}`;
        navigate(newPath);
    };
}

export { useNavigateUp };
