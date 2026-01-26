import Shapes, {type ShapesHandle} from "../InteractableShapes/Shapes.tsx";
import styles from "./Auth.module.css";
import {CustomInput} from "../common/CustomInput.tsx";
import {EyeIconClosed, EyeIconOpen} from "../common/Icons.tsx";
import RedCustomBtn from "../common/CustomButtons/RedCustomBtn.tsx";
import {Link, useNavigate} from "react-router-dom";
import {type FormEvent, useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import type {AppDispatch, RootState} from "../../bll/store.ts";
import {registerUser, resendConfirmation} from "../../bll/auth/thunks.ts";
import {showError, showSuccess} from "../../utils/toast.ts";
import type {BackendResult} from "../../api/types.ts";
import {mapBackendErrors} from "../../bll/helpers/errorHelpers.ts";
import SendVerificationModal from "./SendVerificationModal/SendVerificationModal.tsx";

function Register() {
    const shapesRef = useRef<ShapesHandle>(null);
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const { status, isAuthenticated } = useSelector((state: RootState) => state.auth);

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const [generalError, setGeneralError] = useState<string | null>(null);
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

    const [showConfirmationModal, setShowConfirmationModal] = useState(false);

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
            await dispatch(registerUser({ username, email, password })).unwrap();
            showSuccess("User registered. Please confirm your email.");
            setShowConfirmationModal(true);
        }
        catch (err) {
            const apiResponse = err as BackendResult<string>;

            const fieldErrors = mapBackendErrors(apiResponse);

            if(Object.keys(fieldErrors).length > 0) {
                setValidationErrors(fieldErrors);
            }
            else {
                setGeneralError(apiResponse.message || "Signing up failed");
            }
        }
    }

    async function handleResendEmailConfirmation(email: string) {
        try {
            await dispatch(resendConfirmation({email})).unwrap()
            showSuccess("Verification sent to email successfully!");
        }
        catch(err) {
            const apiResponse = err as BackendResult<string>;
            showError(apiResponse.message ?? "Something went wrong.");
        }
    }

    const isLoading = status === 'loading';

    return (
        <div className={styles.outer}>
            <div className={styles.container}>
                <Shapes ref={shapesRef}/>
                <div className={styles.box}>
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
                            label="Username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Your name"
                            errorMessage={validationErrors["username"]}
                            onFocus={() => shapesRef.current?.startTyping()}
                            onBlur={() => shapesRef.current?.reset()}
                            required
                            disabled={isLoading}
                        />

                        <CustomInput
                            label="Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="your@email.com"
                            errorMessage={validationErrors["email"]}
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
                            errorMessage={validationErrors["password"]}
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
                                {showPassword ? <EyeIconOpen className={styles.icon}/> :
                                    <EyeIconClosed className={styles.icon}/>}
                            </button>
                        </CustomInput>

                        <RedCustomBtn
                            isLoading={isLoading}
                            text={"Sign Up"}
                        />

                        <div className={styles.registerLink}>
                            Already have an account? <Link to="/login">Login</Link>
                        </div>
                    </form>
                </div>
            </div>

            <SendVerificationModal
                isOpen={showConfirmationModal}
                onClose={() => setShowConfirmationModal(false)}
                onConfirm={handleResendEmailConfirmation}
                isLoading={isLoading}
                initialEmail={email}
            />
        </div>
    );
}

export default Register;