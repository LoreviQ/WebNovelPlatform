import React, { useEffect } from "react";
import MyFooter from "../components/footer";
import MyHead from "../components/head";
import { initTheme } from "../utils/theme";
import { AuthProvider } from "../utils/auth";

function ForgotPassword() {
    return (
        <AuthProvider>
            <ForgotPasswordAuthed />
        </AuthProvider>
    );
}

function ForgotPasswordAuthed() {
    useEffect(() => {
        document.title = "ForgotPassword | WebNovelPlatform";
        initTheme();
    }, []);

    const notYetImplemented = (event) => {
        event.preventDefault();
        alert("Not yet implemented.");
    };

    return (
        <>
            <MyHead />
            <div className="sb-sidenav-dark">
                <div id="layoutAuthentication">
                    <div id="layoutAuthentication_content">
                        <main>
                            <div class="container">
                                <div class="row justify-content-center">
                                    <div class="col-lg-5">
                                        <div class="card shadow-lg border-0 rounded-lg mt-5">
                                            <div class="card-header">
                                                <h3 class="text-center font-weight-light my-4">Password Recovery</h3>
                                            </div>
                                            <div class="card-body">
                                                <div class="small mb-3 text-muted">
                                                    Enter your email address and we will send you a link to reset your
                                                    password.
                                                </div>
                                                <form>
                                                    <div class="form-floating mb-3">
                                                        <input
                                                            class="form-control"
                                                            id="inputEmail"
                                                            type="email"
                                                            placeholder="name@example.com"
                                                        />
                                                        <label for="inputEmail">Email address</label>
                                                    </div>
                                                    <div class="d-flex align-items-center justify-content-between mt-4 mb-0">
                                                        <a class="small" href="/login">
                                                            Return to login
                                                        </a>
                                                        <a
                                                            class="btn btn-primary"
                                                            href="/login"
                                                            onClick={notYetImplemented}
                                                        >
                                                            Reset Password
                                                        </a>
                                                    </div>
                                                </form>
                                            </div>
                                            <div class="card-footer text-center py-3">
                                                <div class="small">
                                                    <a href="/register">Need an account? Sign up!</a>
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

export default ForgotPassword;
