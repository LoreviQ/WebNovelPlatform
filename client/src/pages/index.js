import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/esm/Container";
import Carousel from "react-bootstrap/Carousel";
import _ from "lodash";

import LoadingAnimation from "../components/loading";
import { getFictions } from "../utils/api";

function Index() {
    const [fictions, setFictions] = useState(null);
    const [carouselFics, setCarouselFics] = useState(null);

    useEffect(() => {
        document.title = "Home | WebNovelPlatform";
        const fetchDisplayData = async () => {
            const fictionData = await getFictions();
            setFictions(fictionData);
            const selectedFictions = _.sampleSize(fictionData, Math.min(fictionData.length, 5)); // Randomly select 5 fictions
            setCarouselFics(selectedFictions);
        };
        fetchDisplayData();
    }, []);
    if (!carouselFics) {
        return <LoadingAnimation />;
    }
    return (
        <Container fluid className="my-4 ms-2">
            <Carousel interval={10000} style={{ backgroundColor: "white", height: "400px" }}>
                {carouselFics.map((fiction, index) => (
                    <Carousel.Item key={index}>
                        <div className="carousel-item-container">
                            <img
                                className="carousel-image"
                                src={
                                    fiction.imageLocation
                                        ? fiction.imageLocation
                                        : `${process.env.PUBLIC_URL}/image-placeholder.png`
                                }
                            />
                            <div style={{ flexGrow: 1 }}></div>
                            <div className="carousel-text">
                                <h1>{fiction.title}</h1>
                                <p>{fiction.description}</p>
                            </div>
                        </div>
                    </Carousel.Item>
                ))}
            </Carousel>
            <hr />
        </Container>
    );
}

export default Index;
export { default as Error } from "./error";
export { default as Index } from "./index";
export { default as Login } from "./login";
export { default as Register } from "./register";
export { default as ForgotPassword } from "./forgotpassword";
export { default as User } from "./user";
export { default as Fictions } from "./fictions";
export { default as SubmitFiction } from "./submit-fiction";
export { default as EditFiction } from "./edit-fiction";
