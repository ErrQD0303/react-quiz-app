import { useQuiz } from "../contextx/QuizContext";

function RestartButton() {
  const { dispatch } = useQuiz();

  return (
    <button
      className="btn btn-ui"
      onClick={() => dispatch({ type: "restart" })}
    >
      Restart Quiz
    </button>
  );
}

export default RestartButton;
