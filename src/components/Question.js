import { useEffect } from "react";
import Button from "./Button";
import Options from "./Options";

function Question({ question, dispatch, answer, hasNext, hasPrev }) {
  return (
    <div>
      <h4>{question.question}</h4>
      <Options question={question} dispatch={dispatch} answer={answer}>
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
