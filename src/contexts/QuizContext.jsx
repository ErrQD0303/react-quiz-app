import { createContext, useContext, useReducer, useEffect } from "react";

const QuizContext = createContext();

const SECS_PER_QUESTION = 20;

const initialState = {
  questions: [],
  status: "loading",
  index: 0,
  answers: [],
  points: 0,
  highscore: 0,
  secondsRemaining: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "dataReceived":
      return {
        ...state,
        questions: action.payload.questions,
        highscore: action.payload.highscore,
        answers: Array.from(
          { length: action.payload.questions.length },
          () => null
        ),
        status: "ready",
      };
    case "dataFailed":
      return {
        ...state,
        status: "error",
      };
    case "start":
      return {
        ...state,
        status: "active",
        secondsRemaining: state.questions.length * SECS_PER_QUESTION,
      };
    case "newAnswer":
      const question = state.questions.at(state.index);
      const newAnswerArray = [...state.answers];
      newAnswerArray[state.index] = action.payload;
      console.log(newAnswerArray);
      return {
        ...state,
        answers: newAnswerArray,
        points:
          action.payload === question.correctOption
            ? state.points + question.points
            : state.points,
      };
    case "nextQuestion":
      return { ...state, index: state.index + 1, answer: null };
    case "prevQuestion":
      return { ...state, index: state.index - 1, answer: null };
    case "finish":
      return {
        ...state,
        status: "finished",
        highscore:
          state.points > state.highscore ? state.points : state.highscore,
      };
    case "restart":
      return {
        ...initialState,
        questions: state.questions,
        answers: Array.from({ length: state.questions.length }, () => null),
        highscore: state.highscore,
        status: "ready",
      };
    // return {
    //   ...state,
    //   status: "ready",
    //   index: 0,
    //   answer: null,
    //   points: 0,
    // };
    case "tick":
      return {
        ...state,
        secondsRemaining: state.secondsRemaining - 1,
        status: state.secondsRemaining === 0 ? "finished" : state.status,
      };

    default:
      throw new Error("Action unknown");
  }
}

function QuizProvider({ children }) {
  const [
    { questions, status, index, answers, points, highscore, secondsRemaining },
    dispatch,
  ] = useReducer(reducer, initialState);

  const numQuestions = questions.length;
  const maxPossiblePoints = questions.reduce(
    (prev, cur) => prev + cur.points,
    0
  );
  const progress = answers.filter((val) => val !== null).length;

  useEffect(function () {
    const fetchQuestions = fetch("http://localhost:8000/questions").then(
      (res) => res.json()
    );
    const fetchHighscore = fetch("http://localhost:8000/appData").then((res) =>
      res.json()
    );

    Promise.all([fetchQuestions, fetchHighscore])
      .then(([questions, { highscore }]) => {
        dispatch({ type: "dataReceived", payload: { questions, highscore } });
      })
      .catch((err) => dispatch({ type: "dataFailed" }));
  }, []);

  /* Handle Write highscore to files */
  useEffect(
    function () {
      async function updateHighscore() {
        fetch("http://localhost:8000/appData", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ highscore }),
        }).then((res) => {
          if (!res.ok) throw new Error("Failed to update highscore");
        });
      }
      updateHighscore();
    },
    [highscore]
  );

  useEffect(
    function () {
      if (status !== "active") return;

      const arrowLeftPress = function (e) {
        if (
          status === "active" &&
          e.key === "ArrowLeft" &&
          index > 0 &&
          index < numQuestions
        )
          dispatch({ type: "prevQuestion" });
      };

      const arrowRightPress = function (e) {
        if (
          status === "active" &&
          e.key === "ArrowRight" &&
          index >= 0 &&
          index < numQuestions - 1
        )
          dispatch({ type: "nextQuestion" });
      };

      document.addEventListener("keydown", arrowLeftPress);
      document.addEventListener("keydown", arrowRightPress);

      return () => {
        document.removeEventListener("keydown", arrowLeftPress);
        document.removeEventListener("keydown", arrowRightPress);
      };
    },
    [status, index, numQuestions]
  );

  return (
    <QuizContext.Provider
      value={{
        questions,
        status,
        index,
        answers,
        points,
        highscore,
        secondsRemaining,
        numQuestions,
        maxPossiblePoints,
        progress,
        dispatch,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}

function useQuiz() {
  const context = useContext(QuizContext);

  return context;
}

export { QuizProvider, useQuiz };
