import { type FormEvent, useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../bll/store.ts";
import { loginUser } from "../../bll/auth/thunks.ts";
import { useNavigate, Link } from "react-router-dom";
import styles from "./Login.module.css";
import Shapes, { type ShapesHandle } from "../InteractableShapes/Shapes.tsx";
import { EyeIconClosed, EyeIconOpen } from "../common/Icons.tsx";
import { CustomInput } from "../common/CustomInput.tsx";
import type { BackendResult } from "../../api/types.ts";
import {toast} from "react-toastify";

function Login() {
    const shapesRef = useRef<ShapesHandle>(null);
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    // Access auth status
    const { status, isAuthenticated } = useSelector((state: RootState) => state.auth);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const [generalError, setGeneralError] = useState<string | null>(null);
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            navigate("/");
        }
    }, [isAuthenticated, navigate]);

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setGeneralError(null);
        setValidationErrors({});

        try {
            await dispatch(loginUser({ email, password })).unwrap();
            toast.success("Login successful",
                {
                    autoClose: 2000,
                    hideProgressBar: true,
                    closeOnClick: false,
                    pauseOnHover: false,
                    draggable: false,
                });
        }
        catch (err) {
            const apiError = err as BackendResult<string>;

            if (apiError.errors && apiError.errors.length > 0) {
                const errorsMap: Record<string, string> = {};

                apiError.errors.forEach((e) => {
                    if (e.code.includes("Email")) errorsMap["Email"] = e.message || "Invalid email";
                    else if (e.code.includes("Password")) errorsMap["Password"] = e.message || "Invalid password";
                    else errorsMap[e.code] = e.message || "Error";
                });

                setValidationErrors(errorsMap);
            }
            else {
                setGeneralError(apiError.message || "Login failed");
            }
        }
    }

    const isLoading = status === 'loading';

    return (
        <div className={styles.container}>
            <Shapes ref={shapesRef} />
            <div className={styles.loginBox}>
                <h1 className={styles.title}>
                    Welcome back to <span>MediaTracker</span>!
                </h1>

                <form onSubmit={handleSubmit} className={styles.form}>
                    {generalError && (
                        <div className={styles.error} role="alert">
                            {generalError}
                        </div>
                    )}

                    <CustomInput
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        errorMessage={validationErrors["Email"]}
                        onFocus={() => shapesRef.current?.startTyping()}
                        onBlur={() => shapesRef.current?.reset()}
                        required
                        disabled={isLoading}
                    />

                    <CustomInput
                        label="Password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        errorMessage={validationErrors["Password"]}
                        onFocus={() => shapesRef.current?.showPassword()}
                        onBlur={() => shapesRef.current?.reset()}
                        required
                        disabled={isLoading}
                    >
                        <button
                            type="button"
                            className={styles.eyeButton}
                            onClick={() => setShowPassword(!showPassword)}
                            disabled={isLoading}
                        >
                            {showPassword ? <EyeIconOpen className={styles.icon} /> : <EyeIconClosed className={styles.icon} />}
                        </button>
                    </CustomInput>

                    <button type="submit" className={styles.button} disabled={isLoading}>
                        {isLoading ? <span className={styles.loader}></span> : "Sign In"}
                    </button>

                    <div className={styles.registerLink}>
                        Don't have an account? <Link to="/register">Register</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;