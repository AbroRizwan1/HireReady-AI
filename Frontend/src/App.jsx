import { RouterProvider } from 'react-router'
import { router } from "./app.routes.jsx";
import { AuthProvider } from "./Features/auth/auth.context.jsx"
import { InterviewProvider } from "./Features//Interview/InterviewContext.jsx"
import { ToastProvider, ToastContainer } from "./Share/Toster/Toster.jsx";
import { MockInterviewProvider } from './Features/mockInterview/MockInterviewContext.jsx';
const App = () => {
  return (
    <>

      <ToastProvider>
        <AuthProvider>
          <InterviewProvider>
            <MockInterviewProvider>
              <RouterProvider router={router} />
              <ToastContainer />
            </MockInterviewProvider>
          </InterviewProvider>
        </AuthProvider>
      </ToastProvider>

    </>
  )
}

export default App
