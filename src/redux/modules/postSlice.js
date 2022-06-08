import { createSlice } from "@reduxjs/toolkit";
import {
  addDoc,
  collection,
  getDocs,
  query,
  orderBy,
  deleteDoc,
  doc,
  where,
  updateDoc,
} from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { db, storage } from "../../firebase";

// 파이어베이스에서 게시물 불러오기
export const loadPostFB = () => {
  return async function (dispatch) {
    let posts = [];
    const loadQuery = query(
      collection(db, "posts"),
      orderBy("createdAt", "desc")
    );
    const postData = await getDocs(loadQuery);

    postData.forEach((data) => {
      posts.push({ id: data.id, ...data.data() });
    });

    dispatch(loadedPosts(posts));
  };
};

// 파이어베이스에 게시물 추가하기
export const postingFB = (post) => {
  return async function (dispatch) {
    await addDoc(collection(db, "posts"), post);
    await dispatch(addPost(post));
  };
};

// 파이어베이스 게시물 수정하기
export const updateFB = (postObj) => {
  return async function (dispatch) {
    const docRef = collection(db, "posts");
    const newQuery = query(docRef, where("uid", "==", postObj.uid));
    let id = "";

    const _id = await getDocs(newQuery);
    _id.forEach((doc) => {
      id = doc.id;
    });

    const _docRef = doc(db, "posts", id);
    await updateDoc(_docRef, {
      text: postObj.text,
      fileUrl: postObj.fileUrl,
      layout: postObj.layout,
    });

    dispatch(editPost(postObj.uid));
  };
};

// 파이어베이스에서 게시물 삭제하기
export const deleteFB = (postObj) => {
  return async function (dispatch) {
    const docRef = collection(db, "posts");
    const newQuery = query(docRef, where("uid", "==", postObj.uid));
    let id = "";

    const _id = await getDocs(newQuery);
    _id.forEach((doc) => {
      id = doc.id;
    });

    await deleteDoc(doc(db, "posts", id));
    await deleteObject(ref(storage, postObj.fileUrl));

    dispatch(deletePost(postObj));
  };
};

const postSlice = createSlice({
  name: "postReducer",
  initialState: {
    post: [
      {
        createdAt: 0,
        email: "",
        fileUrl: "",
        layout: "",
        nickname: "",
        text: "",
        uid: "",
      },
    ],
  },
  reducers: {
    // 게시물 불러오기
    loadedPosts: (state, { payload }) => {
      state.post = payload;
    },
    // 게시물 추가하기
    addPost: (state, { payload }) => {
      state.post.unshift(payload);
    },
    // 게시물 수정하기
    editPost: (state, { payload }) => {
      state.post = state.post.map((post) => {
        if (post.uid === payload.uid)
          post = {
            text: payload.text,
            fileUrl: payload.fileUrl,
            layout: payload.layout,
          };
      });
    },
    //게시물 삭제하기
    deletePost: (state, { payload }) => {
      state.post = state.post.filter((post) => {
        return payload.uid !== post.uid;
      });
    },
  },
});

export const { loadedPosts, addPost, deletePost, editPost } = postSlice.actions;
export default postSlice.reducer;
