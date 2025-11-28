import {useSelector} from "react-redux";
import type {RootState} from "../../../bll/store.ts";
import {Navigate} from "react-router-dom";
import type {ReactNode} from "react";

interface ProtectedRouteProps {
    children: ReactNode;
}

function ProtectedRoute({ children } : Readonly<ProtectedRouteProps>) {
    const isAuth = useSelector((state : RootState) => state.auth.isAuth);

    if(!isAuth) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

export default ProtectedRoute;