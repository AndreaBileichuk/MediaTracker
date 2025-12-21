import './App.css'
import MediaSearch from "./components/MediaProvider/MediaSearch.tsx";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import NotFoundPage from "./components/common/NotFound/NotFoundPage.tsx";
import Login from "./components/Login/Login.tsx";
import { Provider } from "react-redux";
import { store } from "./bll/store.ts";
import ProtectedRoute from "./components/common/ProtectedRoute/ProtectedRoute.tsx";
import Register from "./components/Register/Register.tsx";
import MediaDetails from "./components/MediaProvider/MediaDetails.tsx";
import MainLayout from "./components/layout/MainLayout.tsx";
import MediaTop from "./components/MediaProvider/MediaTop.tsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <ProtectedRoute><MainLayout /></ProtectedRoute>,
        errorElement: <NotFoundPage />,
        children: [
            {
                index: true,
                element: <Navigate to="/media/search" replace />
            },
            {
                path: "media/search",
                element: <MediaSearch />,
                children: [
                    {
                        path: ":id",
                        element: <MediaDetails />
                    }
                ]
            },
            {
                path: "media/top",
                element: <MediaTop />
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
            <RouterProvider router={router} />
        </Provider>
    )
}

export default App
