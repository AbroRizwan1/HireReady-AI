import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import MockInterviewPage from "../components/MockInterviewPage";
import { useMockInterview } from "../Hooks/useMockInterview";
import { PageLoader } from "../../Interview/Components/Loading";

const MockInterview = () => {
    const navigate = useNavigate()
    const { mockInterviewId } = useParams();

    const {
        mockInterviewQuestions,
        mockInterviewReport,
        mockInterview,
        mockInterviewLoading,
        mockInterviewAnswer,
        setMockInterview,
        setCurrentIndex,
        currentIndex
    } = useMockInterview();


    const handleSubmit = async ({ questionIndex, answer, isSkip = false, }) => {

        const isLastQuestion =
            questionIndex === mockInterview.questions.length - 1;

        if (isLastQuestion) {

            const data = await mockInterviewReport(mockInterviewId)

            navigate(`/mock-interview/report/${data?._id}`)

        } else {
            await mockInterviewAnswer({
                mockInterviewId,
                questionIndex,
                answer,
            });
        }
    };


    if (!mockInterview) {
        return (
            <main>
                {mockInterviewLoading && (
                    <PageLoader label="Fetching your Mock Interview Questions..." />
                )}
            </main>
        );
    }


    useEffect(() => {
        if (!mockInterviewId) return;
        mockInterviewQuestions(mockInterviewId);
        setCurrentIndex(
            mockInterview.questionIndex || 0
        );

    }, [mockInterviewId]);



    return (
        <MockInterviewPage
            questions={mockInterview?.questions?.map((q) => q.question) || []}
            currentIndex={currentIndex}
            setCurrentIndex={setCurrentIndex}
            mockInterviewLoading={mockInterviewLoading}
            onSubmit={handleSubmit}

        />
    );
};

export default MockInterview;