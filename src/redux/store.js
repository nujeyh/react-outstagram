import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./modules/userSlice";
import postReducer from "./modules/postSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    post: postReducer,
  },
});

export default store;
