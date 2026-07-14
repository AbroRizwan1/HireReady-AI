
import { createContext } from "react"
import { useState } from "react"

export const mockInterviewContext = createContext()

export const MockInterviewProvider = ({ children }) => {

    const [mockInterview, setMockInterview] = useState([])
    const [mockInterviewLoading, setMockInterviewLoading] = useState(false)
    const [mockReports, setMockReports] = useState([])

    return (

        <mockInterviewContext.Provider value={{
            mockInterview,
            setMockInterview,
            mockInterviewLoading,
            setMockInterviewLoading,
            mockReports,
            setMockReports
        }} >
            {children}
        </mockInterviewContext.Provider>
    )

}