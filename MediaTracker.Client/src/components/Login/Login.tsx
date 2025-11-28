import {type FormEvent, useRef, useState} from "react";
import {useDispatch} from "react-redux";
import type {AppDispatch} from "../../bll/store.ts";
import {login} from "../../bll/authSlice.ts";
import {useNavigate} from "react-router-dom";
import styles from "./Login.module.css"
import Shapes, {type ShapesHandle} from "../InteractableShapes/Shapes.tsx";
import {EyeIconClosed, EyeIconOpen} from "../common/Icons.tsx";
import {CustomInput} from "../common/CustomInput.tsx";

interface Error {
    code: string,
    message: string
}

interface ApiResponse {
    isSuccess: boolean;
    code?: string;
    message?: string;
    errors?: Error[];
    value?: string
}

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
            const response = await fetch("https://localhost:7283/auth/login", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({email, password}),
            });

            const data: ApiResponse = await response.json();

            if (data.isSuccess) {
                dispatch(login());
                navigate("/");
                return;
            }
            
            if (data.code === "Validation.Error" && data.errors) {
                const errorsMap: Record<string, string> = {};
                data.errors.forEach(err => {
                    errorsMap[err.code] = err.message;
                });
                setValidationErrors(errorsMap);
            } else if (data.code === "Auth.InvalidCredentials") {
                setGeneralError(data.message ?? "Invalid credentials.");
            } else {
                setGeneralError(data.message ?? "Something went wrong.");
            }
        } catch (error) {
            console.error(error);
            setGeneralError("Network error. Please check your connection.");
        }
    }

    return (
        <div className={styles.container}>
            <Shapes ref={shapesRef}/>

            <div className={styles.loginBox}>
                <img
                    className={styles.logo}
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Mickey_Mouse_%28poster_version%29.svg/1070px-Mickey_Mouse_%28poster_version%29.svg.png"
                    alt="Main application logo"
                />
                <h1 className={styles.title}>
                    Welcome back to <span style={{color: "blue"}}>MediaTracker</span>!
                </h1>

                <form onSubmit={handleSubmit} className={styles.form}>
                    {generalError && (
                        <div className={styles.error}>
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
                        onFocus={() => {
                            if (showPassword) {
                                shapesRef.current?.showPassword();
                            }

                            if (!showPassword) {
                                shapesRef.current?.startTyping()
                            }
                        }}
                        onBlur={() => {
                            if (!showPassword) {
                                shapesRef.current?.reset()
                            }
                        }}
                        required
                    >
                        <button
                            type="button"
                            className={styles.eyeButton}
                            onClick={() => {
                                setShowPassword(prevState => {
                                    if (prevState) {
                                        shapesRef.current?.reset()
                                    } else {
                                        shapesRef.current?.showPassword()
                                    }

                                    return !prevState;
                                })
                            }}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? (
                                <EyeIconOpen className={styles.icon}/>
                            ) : (
                                <EyeIconClosed className={styles.icon}/>
                            )}
                        </button>
                    </CustomInput>

                    <button type="submit" className={styles.button}>
                        Sign In
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Login;