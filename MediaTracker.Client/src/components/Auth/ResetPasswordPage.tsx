import {useNavigate, useSearchParams} from "react-router-dom";
import {showError} from "../../utils/toast.ts";

function ResetPasswordPage() {
    const [params] = useSearchParams();
    const token = params.get("token")
    const email = params.get("email")

    const navigate = useNavigate()

    if(token === null || email === null) {
        showError("No reset password operation was initiated")
        navigate("login");
    }

    return (
        <div>
            Enter you new password
            <input type="password" placeholder="Enter Password" />
        </div>
    );
}

export default ResetPasswordPage;