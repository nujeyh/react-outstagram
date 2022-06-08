import React from "react";
import { useNavigate } from "react-router-dom";

import { signOut } from "firebase/auth";
import { auth } from "../firebase";

import { useDispatch, useSelector } from "react-redux";
import { currentUser } from "../redux/modules/userSlice";

import styled from "styled-components";

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user);

  // 로그아웃하기
  const onClickSignOut = () => {
    const confirm = window.confirm("로그아웃 하시겠어요?");
    if (confirm) {
      signOut(auth);
      dispatch(currentUser({ email: null, nickname: null }));
      navigate("/");
    }
  };

  return (
    <HeaderWrap>
      <img src="/images/logo.png" alt="logo" onClick={() => navigate("/")} />
      {user.email ? (
        <div>
          <span>{user.nickname}님</span>
          <button onClick={() => navigate("/")}>메인</button>
          <button onClick={() => navigate("/write")}>글쓰기</button>
          <button onClick={onClickSignOut}>로그아웃</button>
        </div>
      ) : (
        <div>
          <button onClick={() => navigate("/signin")}>로그인</button>
          <button onClick={() => navigate("/signup")}>가입하기</button>
        </div>
      )}
    </HeaderWrap>
  );
};
const HeaderWrap = styled.header`
  display: flex;

  background-color: white;
  border-bottom: solid lightgray 1px;
  padding: 20px 0px 10px 15px;
  margin-bottom: 1em;
  position: sticky;
  top: 0;
  img {
    height: 35px;
  }
  div {
    margin-left: auto;
  }
  button {
    margin: 0 5px;
  }
`;
export default Header;
