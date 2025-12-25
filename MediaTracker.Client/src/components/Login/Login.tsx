import { type FormEvent, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../bll/store.ts";
import { loginUser } from "../../bll/auth/thunks.ts";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";
import Shapes, { type ShapesHandle } from "../InteractableShapes/Shapes.tsx";
import { EyeIconClosed, EyeIconOpen } from "../common/Icons.tsx";
import { CustomInput } from "../common/CustomInput.tsx";
import type {BackendResult} from "../../api/types.ts";

function Login() {
    const shapesRef = useRef<ShapesHandle>(null);
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const [generalError, setGeneralError] = useState<string | null>(null);
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

    async function handleSubmit(e: FormEvent): Promise<void> {
        e.preventDefault();

        setGeneralError(null);
        setValidationErrors({});

        try {
            await dispatch(loginUser({ email, password })).unwrap();

            navigate("/");
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

    return (
        <div className={styles.container}>
            <Shapes ref={shapesRef} />
            <div className={styles.loginBox}>
                <h1 className={styles.title}>
                    Welcome back to <span style={{ color: "blue" }}>MediaTracker</span>!
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
                    >
                        <button
                            type="button"
                            className={styles.eyeButton}
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeIconOpen className={styles.icon}/> : <EyeIconClosed className={styles.icon}/>}
                        </button>
                    </CustomInput>

                    <button type="submit" className={styles.button}>
                        Sign In
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;