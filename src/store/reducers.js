export const playerReducer = (state, action) => {
  switch (action.type) {
    case "play": {
      const { id, name, title, author, thumbnail } = action.data;
      return { id, name, title, author, thumbnail };
    }

    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
};
