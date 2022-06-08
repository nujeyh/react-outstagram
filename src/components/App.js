import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { auth } from "../firebase";
import styled from "styled-components";

import { loadUserFB } from "../redux/modules/userSlice";
import { loadPostFB } from "../redux/modules/postSlice";

import Header from "./Header";
import Footer from "./Footer";
import Main from "../pages/Main";
import SignUp from "../pages/SignUp";
import SignIn from "../pages/SignIn";
import MyPage from "../pages/MyPage";
import Write from "../pages/Write";
import Detail from "../pages/Detail";

function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  useEffect(() => {
    // 파이어베이스 로그인 여부 확인
    auth.onAuthStateChanged((userAuth) => {
      if (userAuth) {
        dispatch(loadUserFB(userAuth.email));
      } else {
      }
    });
  }, []);

  useEffect(() => {
    dispatch(loadPostFB());
  }, []);

  return (
    <AppWrap>
      <Header />
      <MainWrap>
        <Routes>
          {user.email ? (
            <>
              <Route path="/my" element={<MyPage />} />
              <Route path="/write" element={<Write />} />
              <Route path="/edit" element={<Write />} />
            </>
          ) : (
            <>
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
            </>
          )}
          <Route path="/:id" element={<Detail />} />
          <Route path="*" element={<Main />} />
        </Routes>
      </MainWrap>
      <Footer />
    </AppWrap>
  );
}

const AppWrap = styled.div`
  background-color: #f9f9f9;
  button {
    padding: 0.4em 0.8em;
    color: white;
    background-color: black;
    border: 0;
    border-radius: 7px;
    cursor: pointer;
    &:hover {
      opacity: 0.7;
    }
    &:disabled {
      opacity: 1;
      cursor: default;
      background-color: #8f8f8f;
    }
  }
`;
const MainWrap = styled.main`
  max-width: 800px;
  margin: 0 auto;
  div {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5em;
  }
`;

export default App;
