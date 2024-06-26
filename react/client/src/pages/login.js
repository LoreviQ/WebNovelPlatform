import React, { useEffect } from "react";

function Login() {
    useEffect(() => {
        document.title = "Login | WebNovelPlatform";
    }, []);
    return <h1>Login Page here</h1>;
}

export default Login;
