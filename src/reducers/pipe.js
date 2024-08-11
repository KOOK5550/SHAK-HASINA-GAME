const initialState = {
  x: 300,
  pipes: [],
};

const pipeRed = (state = initialState, action = {}) => {
  switch (action.type) {
    case "RUNNING":
      if (!state.pipes.length) {
        return state;
      }
      return { ...state, x: state.x - 10 };

    case "GENERATE":
      const topHeight = Math.round(Math.random() * 200) + 40;
      return {
        ...state,
        pipes: [...state.pipes, { topHeight, passed: false }], // Add `passed` property
      };

    case "GAME_OVER":
      return initialState;

    case "MARK_PASSED":
      return {
        ...state,
        pipes: state.pipes.map((pipe, index) =>
          index === action.index ? { ...pipe, passed: true } : pipe
        ),
      };

    default:
      return state;
  }
};

export default pipeRed;
