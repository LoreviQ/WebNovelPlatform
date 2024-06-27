import React, { useEffect } from "react";

function Index() {
    useEffect(() => {
        document.title = "Home | WebNovelPlatform";
    }, []);
    return <h1>Index Page here</h1>;
}

export default Index;
export { default as Error } from "./error";
export { default as Index } from "./index";
export { default as Login } from "./login";
export { default as Register } from "./register";
export { default as ForgotPassword } from "./forgotpassword";
export { default as User } from "./user";
