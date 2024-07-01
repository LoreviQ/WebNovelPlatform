import React, { useEffect } from "react";
import MyFooter from "../components/footer";
import MyHead from "../components/head";
import { initTheme } from "../utils/theme";

function Register() {
    useEffect(() => {
        document.title = "Register | WebNovelPlatform";
        initTheme();
    }, []);

    const registerButton = async (event) => {
        event.preventDefault();
        const apiBaseUrl = process.env.API_URL || "https://webnovelapi-y5hewbdc4a-nw.a.run.app";
        const username = document.getElementById("inputUsername").value;
        const email = document.getElementById("inputEmail").value;
        const password = document.getElementById("inputPassword").value;
        const passwordConfirm = document.getElementById("inputPasswordConfirm").value;
        if (username === "" || email === "" || password === "" || passwordConfirm === "") {
            alert("Please fill out all fields.");
            return;
        }
        if (password !== passwordConfirm) {
            alert("Passwords do not match.");
            return;
        }
        const postData = {
            name: username,
            email: email,
            password: password,
        };
        try {
            const response = await fetch(apiBaseUrl + "/v1/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(postData),
            });
            await response.json();
            console.log("Response:", response);
            if (response.status === 201) {
                window.location.href = "/login";
            } else {
                throw new Error("Failed to create account: " + response.statusText);
            }
        } catch (error) {
            console.error("Error creating account:", error);
            alert("Failed to create account. Please try again.");
        }
    };

    return (
        <>
            <MyHead />
            <div className="sb-sidenav-dark">
                <div id="layoutAuthentication">
                    <div id="layoutAuthentication_content">
                        <main>
                            <div className="container">
                                <div className="row justify-content-center">
                                    <div className="col-lg-7">
                                        <div className="card shadow-lg border-0 rounded-lg mt-5">
                                            <div className="card-header">
                                                <h3 className="text-center font-weight-light my-4">Create Account</h3>
                                            </div>
                                            <div className="card-body">
                                                <form id="create-account-form">
                                                    <div className="form-floating mb-3">
                                                        <input
                                                            className="form-control"
                                                            id="inputUsername"
                                                            type="text"
                                                            placeholder="Username"
                                                        />
                                                        <label htmlFor="inputUsername">Username</label>
                                                    </div>
                                                    <div className="form-floating mb-3">
                                                        <input
                                                            className="form-control"
                                                            id="inputEmail"
                                                            type="email"
                                                            placeholder="name@example.com"
                                                        />
                                                        <label htmlFor="inputEmail">Email address</label>
                                                    </div>
                                                    <div className="row mb-3">
                                                        <div className="col-md-6">
                                                            <div className="form-floating mb-3 mb-md-0">
                                                                <input
                                                                    className="form-control"
                                                                    id="inputPassword"
                                                                    type="password"
                                                                    placeholder="Create a password"
                                                                />
                                                                <label htmlFor="inputPassword">Password</label>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <div className="form-floating mb-3 mb-md-0">
                                                                <input
                                                                    className="form-control"
                                                                    id="inputPasswordConfirm"
                                                                    type="password"
                                                                    placeholder="Confirm password"
                                                                />
                                                                <label htmlFor="inputPasswordConfirm">
                                                                    Confirm Password
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="mt-4 mb-0">
                                                        <div className="d-grid">
                                                            <button
                                                                className="btn btn-primary btn-block"
                                                                type="submit"
                                                                onClick={registerButton}
                                                            >
                                                                Create Account
                                                            </button>
                                                        </div>
                                                    </div>
                                                </form>
                                            </div>
                                            <div className="card-footer text-center py-3">
                                                <div className="small">
                                                    <a href="/login">Have an account? Go to login</a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </main>
                    </div>
                    <MyFooter />
                </div>
            </div>
        </>
    );
}

export default Register;
