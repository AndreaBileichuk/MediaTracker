import {useNavigate, useSearchParams} from "react-router-dom";
import {showError, showSuccess} from "../../utils/toast.ts"
import styles from "./Auth.module.css"
import Shapes, {type ShapesHandle} from "../InteractableShapes/Shapes.tsx";
import {type FormEvent, useEffect, useRef, useState} from "react";
import {CustomInput} from "../common/CustomInput.tsx";
import {EyeIconClosed, EyeIconOpen} from "../common/Icons.tsx";
import RedCustomBtn from "../common/CustomButtons/RedCustomBtn.tsx";
import {useDispatch, useSelector} from "react-redux";
import type {AppDispatch, RootState} from "../../bll/store.ts";
import {resetPassword} from "../../bll/auth/thunks.ts";
import type {BackendResult} from "../../api/types.ts";
import {mapBackendErrors} from "../../bll/helpers/errorHelpers.ts";

function ResetPasswordPage() {
    const shapesRef = useRef<ShapesHandle>(null);
    const {status, isAuthenticated} = useSelector((state: RootState) => state.auth);

    const dispatch = useDispatch<AppDispatch>();

    const [params] = useSearchParams();
    const token = params.get("token")
    const email = params.get("email")

    const navigate = useNavigate()

    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [generalError, setGeneralError] = useState<string | null>(null);
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});



    useEffect(() => {
        if (isAuthenticated) {
            navigate("/");
            return;
        }

        if (token === null || email === null) {
            showError("No reset password operation was initiated")
            navigate("/login");
        }
    }, [isAuthenticated, navigate]);

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setGeneralError(null);
        setValidationErrors({});

        try {
            await dispatch(resetPassword({ email: email!, token: token!, newPassword: password })).unwrap();
            showSuccess("Successfully reset the password!");
            navigate("/login");
        }
        catch (err) {
            const apiResponse = err as BackendResult<string>;

            const fieldErrors = mapBackendErrors(apiResponse);

            if(Object.keys(fieldErrors).length > 0) {
                setValidationErrors(fieldErrors);
            }
            else {
                setGeneralError(apiResponse.message || "Failed to reset the password");
            }
        }
    }

    const isLoading = status === 'loading';

    return (
        <div className={styles.outer}>
            <div className={styles.container}>
                <Shapes ref={shapesRef}/>
                <div className={styles.box}>
                    <h1 className={styles.title}>
                        Recover your account on <span>MediaTracker</span>!
                    </h1>

                    <form onSubmit={handleSubmit} className={styles.form}>
                        {generalError && (
                            <div className={styles.error} role="alert">
                                {generalError}
                            </div>
                        )}

                        {validationErrors["InvalidToken"] && (
                            <div className={styles.error}>{validationErrors["InvalidToken"]}</div>
                        )}

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
                            text={"Submit"}
                        />
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ResetPasswordPage;