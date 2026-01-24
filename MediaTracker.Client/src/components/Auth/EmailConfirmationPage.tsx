import styles from "./Auth.module.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { CheckCircle, Loader2, XCircle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../bll/store.ts";
import { confirmEmail } from "../../bll/auth/thunks.ts";
import type { BackendResult } from "../../api/types.ts";
import { showError } from "../../utils/toast.ts";

function EmailConfirmationPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const { status } = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch<AppDispatch>();

    const [message, setMessage] = useState("Verifying your email...");
    const calledOnce = useRef(false);

    useEffect(() => {
        async function confirm() {
            const userId = searchParams.get("userId");
            const code = searchParams.get("code");

            if (!userId || !code) {
                setMessage("Invalid link. Missing parameters.");
                return;
            }

            try {
                await dispatch(confirmEmail({ userId, code })).unwrap();
                setMessage("Email confirmed successfully! You can now login.");
            } catch (err) {
                const apiResponse = err as BackendResult<string>;
                showError(apiResponse.message ?? "Something went wrong.");
                setMessage(apiResponse.message ?? "Verification failed.");
            }
        }

        if (!calledOnce.current) {
            calledOnce.current = true;
            confirm();
        }
    }, [searchParams, dispatch]);

    const textStyle = { color: "#b3b3b3", fontSize: "16px", lineHeight: "1.5" };

    const buttonStyle: React.CSSProperties = {
        marginTop: "16px",
        width: "100%",
        padding: "14px 16px",
        fontSize: "16px",
        fontWeight: 600,
        color: "#fff",
        background: "#e50914",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
    };

    return (
        <div className={styles.outer} style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className={styles.container} style={{ gridTemplateColumns: '1fr', maxWidth: '600px', height: 'auto', minHeight: '500px' }}>

                <div className={styles['login-section']} style={{ width: '100%' }}>
                    <div className={styles.box} style={{ background: 'rgba(25, 25, 25, 0.8)' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '16px' }}>

                            {status === 'loading' && (
                                <>
                                    <Loader2 size={64} color="#e50914" style={{ animation: 'spin 1s linear infinite' }} />
                                    <h2 className={styles.title} style={{ color: 'white' }}>Verifying...</h2>
                                    <p style={textStyle}>Please wait while we confirm your email.</p>
                                </>
                            )}

                            {status === 'succeeded' && (
                                <>
                                    <CheckCircle size={64} color="#46d369" />
                                    <h2 className={styles.title} style={{ color: 'white' }}>Success!</h2>
                                    <p style={textStyle}>{message}</p>
                                    <button
                                        style={buttonStyle}
                                        onClick={() => navigate("/login")}
                                        onMouseOver={(e) => e.currentTarget.style.background = "#f40612"}
                                        onMouseOut={(e) => e.currentTarget.style.background = "#e50914"}
                                    >
                                        Go to Login
                                    </button>
                                </>
                            )}

                            {status === 'failed' && (
                                <>
                                    <XCircle size={64} color="#e50914" />
                                    <h2 className={styles.title} style={{ color: 'white' }}>Error</h2>
                                    <p style={textStyle}>{message}</p>
                                    <button
                                        style={{ ...buttonStyle, background: "#333" }}
                                        onClick={() => navigate("/")}
                                        onMouseOver={(e) => e.currentTarget.style.background = "#444"}
                                        onMouseOut={(e) => e.currentTarget.style.background = "#333"}
                                    >
                                        Go Home
                                    </button>
                                </>
                            )}

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EmailConfirmationPage;