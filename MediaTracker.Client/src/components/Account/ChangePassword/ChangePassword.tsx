import s from "./ChangePassword.module.css"
import {CustomInput} from "../../common/CustomInput.tsx";
import {EyeIconClosed, EyeIconOpen} from "../../common/Icons.tsx";
import RedCustomBtn from "../../common/CustomButtons/RedCustomBtn.tsx";
import {type FormEvent, useState} from "react";
import {useDispatch} from "react-redux";
import type {AppDispatch} from "../../../bll/store.ts";
import {changePassword} from "../../../bll/account/thunks.ts";
import {showSuccess} from "../../../utils/toast.ts";
import type {BackendResult} from "../../../api/types.ts";
import {mapBackendErrorsForChangePassword} from "../../../bll/helpers/errorHelpers.ts";
import {useNavigate} from "react-router-dom";

interface ChangePasswordState {
    isLoading: false,
    generalError: string | null,
    validationErrors: Record<string, string>,
    showOldPassword: boolean,
    showNewPassword: boolean,
    oldPassword: string,
    newPassword: string,
}

function ChangePassword() {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const [state, setState] = useState<ChangePasswordState>( {
        isLoading: false,
        generalError: null,
        validationErrors: {},
        showOldPassword: false,
        showNewPassword: false,
        oldPassword: "",
        newPassword: "",
    });

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setState((prev) => ({
            ...prev,
            generalError: null,
            validationErrors: {},
        }))

        try {
            await dispatch(changePassword({ oldPassword: state.oldPassword, newPassword: state.newPassword })).unwrap();
            showSuccess("Successfully change the password!");
            navigate("/account");
        }
        catch(e) {
            const apiResponse = e as BackendResult<void>;

            const fieldErrors = mapBackendErrorsForChangePassword(apiResponse);

            if(Object.keys(fieldErrors).length > 0) {
                setState(prev => {
                    return {
                        ...prev,
                        validationErrors: fieldErrors
                    }
                })
            }
            else {
                setState(prev => {
                    return {
                        ...prev,
                        generalError: apiResponse.message || "Login failed"
                    }
                })
            }
        }
    }

    return (
        <div className={s.container}>
            <form onSubmit={handleSubmit} className={s.form}>
                {state.generalError && (
                    <div className={s.error} role="alert">
                        {state.generalError}
                    </div>
                )}

                <CustomInput
                    label="Old Password"
                    type={state.showOldPassword ? "text" : "password"}
                    value={state.oldPassword}
                    onChange={(e) =>
                        setState(prev => ({
                            ...prev,
                            oldPassword: e.target.value,
                            validationErrors: { ...prev.validationErrors, oldPassword: "" }}))}
                    placeholder="Your old password"
                    errorMessage={state.validationErrors["oldPassword"]}
                    required
                    disabled={state.isLoading}
                >
                    <button
                        type="button"
                        className={s.eyeButton}
                        onClick={() => setState(prev => ({...prev, showOldPassword: !prev.showOldPassword}))}
                        disabled={state.isLoading}
                    >
                        {state.showOldPassword ? <EyeIconOpen className={s.icon}/> :
                            <EyeIconClosed className={s.icon}/>}
                    </button>
                </CustomInput>

                <CustomInput
                    label="New Password"
                    type={state.showNewPassword ? "text" : "password"}
                    value={state.newPassword}
                    onChange={(e) =>
                        setState(prev => ({
                            ...prev,
                            newPassword: e.target.value,
                            validationErrors: { ...prev.validationErrors, newPassword: "" }}))}
                    placeholder="Your new password"
                    errorMessage={state.validationErrors["newPassword"]}
                    required
                    disabled={state.isLoading}
                >
                    <button
                        type="button"
                        className={s.eyeButton}
                        onClick={() => setState(prev => ({...prev, showNewPassword: !prev.showNewPassword}))}
                        disabled={state.isLoading}
                    >
                        {state.showNewPassword ? <EyeIconOpen className={s.icon}/> :
                            <EyeIconClosed className={s.icon}/>}
                    </button>
                </CustomInput>

                <RedCustomBtn
                    isLoading={state.isLoading}
                    text={"Change password"}
                />
            </form>
        </div>
    );
}

export default ChangePassword;