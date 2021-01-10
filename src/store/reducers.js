export const playerReducer = (state, action) => {
  switch (action.type) {
    case "play": {
      const { id, name, title, author, thumbnail, duration } = action.data;
      return { id, name, title, author, thumbnail, fakeDuration: duration };
    }

    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
};
