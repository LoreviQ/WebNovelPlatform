import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

const LoadingAnimation = () => (
    <div style={{ textAlign: "center", marginTop: "20%" }}>
        <FontAwesomeIcon icon={faSpinner} spin size="7x" />
    </div>
);

export default LoadingAnimation;
