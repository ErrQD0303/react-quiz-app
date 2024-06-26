import { useEffect } from "react";
import Button from "./Button";
import Options from "./Options";
import { useQuiz } from "../contextx/QuizContext";

function Question() {
  const { questions, index, numQuestions, dispatch } = useQuiz();
  const question = questions[index];
  const hasNext = index >= 0 && index < numQuestions - 1;
  const hasPrev = index > 0 && index < numQuestions;

  return (
    <div>
      <h4>{question.question}</h4>
      <Options>
        <>
          {hasNext && (
            <Button
              className="btn btn-ui-right"
              onClick={() => dispatch({ type: "nextQuestion" })}
            >
              Next
            </Button>
          )}
          {hasPrev && (
            <Button
              className="btn btn-ui-left"
              onClick={() => dispatch({ type: "prevQuestion" })}
            >
              Previous
            </Button>
          )}
        </>
      </Options>
    </div>
  );
}

export default Question;
