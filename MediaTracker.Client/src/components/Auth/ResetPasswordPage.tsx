import {useNavigate, useSearchParams} from "react-router-dom";
import {showError} from "../../utils/toast.ts"
import styles from "./Auth.module.css"
import Shapes, {type ShapesHandle} from "../InteractableShapes/Shapes.tsx";
import {useRef, useState} from "react";
import {CustomInput} from "../common/CustomInput.tsx";
import {EyeIconClosed, EyeIconOpen} from "../common/Icons.tsx";
import RedCustomBtn from "../common/CustomButtons/RedCustomBtn.tsx";
import {useSelector} from "react-redux";
import type {RootState} from "../../bll/store.ts";

function ResetPasswordPage() {
    const shapesRef = useRef<ShapesHandle>(null);
    const {status} = useSelector((state: RootState) => state.auth);

    const [params] = useSearchParams();
    const token = params.get("token")
    const email = params.get("email")

    const navigate = useNavigate()

    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [generalError, setGeneralError] = useState<string | null>(null);
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

    if (token === null || email === null) {
        showError("No reset password operation was initiated")
        navigate("login");
    }

    async function handleSubmit() {

    }

    const isLoading = status === 'loading';

    return (
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
    );
}

export default ResetPasswordPage;