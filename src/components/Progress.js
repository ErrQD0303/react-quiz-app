function Progress({
  index,
  numQuestions,
  points,
  maxPossiblePoints,
  progress,
}) {
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
