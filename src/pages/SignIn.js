import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import styled from "styled-components";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // 로그인하기
  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      if (error.code === "auth/user-not-found")
        setError("존재하지 않는 아이디입니다.");
      else if (error.code === "auth/wrong-password")
        setError("비밀번호가 틀렸습니다.");
      else if (error.code === "auth/too-many-requests")
        setError(
          "너무 많은 로그인 실패로 인해 계정이 일시적으로 비활성화 되었습니다. 잠시 후에 다시 시도 해주세요."
        );
      else setError(error.message);
      return;
    }
    navigate("/");
  };

  return (
    <FormWrap onSubmit={onSubmit}>
      <h2>로그인</h2>
      <input
        type="email"
        placeholder="이메일"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="비밀번호"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <p>{error}</p>
      <button type="submit" disabled={!(email && password)}>
        로그인
      </button>
    </FormWrap>
  );
};

const FormWrap = styled.form`
  height: 100vh;
  input {
    display: block;
    margin: 10px;
    padding: 10px;
    width: 200px;
  }
  p {
    color: red;
  }
`;

export default SignIn;
