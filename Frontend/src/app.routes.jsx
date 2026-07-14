import { createBrowserRouter } from "react-router";
import Login from "./Features/auth/pages/Login"
import Register from "./Features/auth/pages/Register"
import ProtectedRouter from "./Features/auth/components/ProtectedRouter";
import Home from "./Features/Interview/pages/Home";
import Interview from "./Features/Interview/pages/Interview";
import MockInterview from "./Features/mockInterview/pages/MockInterview";
import MockInterviewReport from "./Features/mockInterview/pages/MockInterviewReport";


export const router = createBrowserRouter([
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/register",
        element: <Register />
    },
    {
        path: "/",
        element: <ProtectedRouter><Home /></ProtectedRouter>
    },
    {
        path: "/interview/:interviewId",
        element: (
            <ProtectedRouter>
                <Interview />
            </ProtectedRouter>
        )
    },
    {
        path: "/mock-interview/:mockInterviewId",
        element: (
            <ProtectedRouter>
                <MockInterview />
            </ProtectedRouter>
        )
    },

    {
        path: "/mock-interview/report/:mockInterviewId",
        element: (
            <ProtectedRouter>
                <MockInterviewReport />
            </ProtectedRouter>
        )
    },




])

