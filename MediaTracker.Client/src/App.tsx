import './App.css'
import MediaSearch from "./components/MediaProvider/MediaSearch.tsx";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import NotFoundPage from "./components/NotFound/NotFoundPage.tsx";
import Login from "./components/Auth/Login.tsx";
import { Provider } from "react-redux";
import { store } from "./bll/store.ts";
import ProtectedRoute from "./components/common/ProtectedRoute/ProtectedRoute.tsx";
import Register from "./components/Auth/Register.tsx";
import MediaDetails from "./components/MediaProvider/common/MediaDetails.tsx";
import MainLayout from "./components/layout/MainLayout.tsx";
import MediaTopRated from "./components/MediaProvider/MediaTopRated.tsx";
import Account from "./components/Account/Account.tsx";
import MediaList from "./components/Media/MediaList.tsx";
import {ToastContainer} from "react-toastify";
import MediaItemDetails from "./components/Media/MediaItemDetails.tsx";
import ChangePassword from "./components/Account/ChangePassword/ChangePassword.tsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <ProtectedRoute><MainLayout /></ProtectedRoute>,
        errorElement: <NotFoundPage />,
        children: [
            {
                index: true,
                element: <Navigate to="/media/list" replace />
            },
            {
                path: "media/list",
                element: <MediaList />
            },
            {
                path: "media/list/:id",
                element: <MediaItemDetails />
            },
            {
                path: "media/search",
                element: <MediaSearch />,
                children: [
                    {
                        path: ":type/:id",
                        element: <MediaDetails />
                    }
                ]
            },
            {
                path: "media/top",
                element: <MediaTopRated />,
                children: [
                    {
                        path: ":type/:id",
                        element: <MediaDetails />
                    }
                ]
            },
            {
                path: "account",
                element: <Account />,
            },
            {
                path:"account/change-password",
                element: <ChangePassword />
            }
        ]
    },
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/register",
        element: <Register />
    }
])

function App() {
    return (
        <Provider store={store}>
            <ToastContainer
                position="bottom-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />
            <RouterProvider router={router} />
        </Provider>
    )
}

export default App
