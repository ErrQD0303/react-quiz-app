function FinishButton({ dispatch, index, numQuestions }) {
  return (
    <button className="btn btn-ui" onClick={() => dispatch({ type: "finish" })}>
      Finish
    </button>
  );
}

export default FinishButton;
