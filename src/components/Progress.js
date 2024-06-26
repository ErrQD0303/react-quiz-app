import { useQuiz } from "../contextx/QuizContext";

function Progress() {
  const { index, numQuestions, points, maxPossiblePoints, progress } =
    useQuiz();

  return (
    <header className="progress">
      <progress max={numQuestions} value={progress} />
      <p>
        Question <strong>{index + 1}</strong> / {numQuestions}
      </p>

      <p>
        <strong>{points}</strong> / {maxPossiblePoints}
      </p>
    </header>
  );
}

export default Progress;
