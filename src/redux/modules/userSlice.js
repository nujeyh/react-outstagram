import { createSlice } from "@reduxjs/toolkit";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase";

export const signUpFB = (user) => {
  return async function () {
    await addDoc(collection(db, "users"), user);
  };
};

export const loadUserFB = (email) => {
  return async function (dispatch) {
    const docRef = collection(db, "users");
    const newQuery = query(docRef, where("email", "==", email));
    const userData = await getDocs(newQuery);
    userData.forEach((data) => {
      dispatch(currentUser(data.data()));
    });
  };
};

const userSlice = createSlice({
  name: "userReducer",
  initialState: { email: null, nickname: null },
  reducers: {
    currentUser: (state, { payload }) => {
      state.email = payload.email;
      state.nickname = payload.nickname;
    },
  },
});

export const { currentUser } = userSlice.actions;
export default userSlice.reducer;
