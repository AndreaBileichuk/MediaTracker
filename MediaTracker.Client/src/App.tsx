import './App.css'
import MediaSearch from "./components/MediaSearch/MediaSearch.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import NotFoundPage from "./components/common/NotFound/NotFoundPage.tsx";
import Login from "./components/Login/Login.tsx";
import {Provider} from "react-redux";
import {store} from "./bll/store.ts";
import ProtectedRoute from "./components/common/ProtectedRoute/ProtectedRoute.tsx";
import Register from "./components/Register/Register.tsx";

const router= createBrowserRouter([
    {
        path: "/",
        element: <ProtectedRoute><MediaSearch /></ProtectedRoute>,
        errorElement: <NotFoundPage />
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
