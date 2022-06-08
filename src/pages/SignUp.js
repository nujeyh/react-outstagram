import React, { useRef, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { signUpFB } from "../redux/modules/userSlice";
import { useNavigate } from "react-router-dom";

import styled from "styled-components";

const SignUp = () => {
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const passwordRef2 = useRef("");
  const nicknameRef = useRef("");
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const users = useSelector((state) => state.user);

  // 입력값 유효성 검사
  const verifySignIn = (email, password1, password2) => {
    const regEmail =
      /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
    const regPassword = /^(?=.*\d)(?=.*[a-zA-Z])[0-9a-zA-Z!@#$%^&*]{6,20}$/;

    // 이메일 확인
    if (regEmail.test(email)) {
      setError("");
    } else {
      setError("이메일 형식이 올바르지 않습니다.");
      return false;
    }

    // 비밀번호 확인
    if (regPassword.test(password1)) {
      setError("");
    } else {
      setError(
        "영문과 숫자 조합의 6-20자의 비밀번호를 설정해주세요. 특수문자(!@#$%^&*)도 사용 가능합니다."
      );
      return false;
    }

    // 비밀번호 재확인
    if (password1 === password2) {
      setError("");
    } else {
      setError("비밀번호가 일치하지 않습니다.");
      return false;
    }
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    if (
      verifySignIn(
        emailRef.current.value,
        passwordRef.current.value,
        passwordRef2.current.value
      ) === false
    )
      return;
    try {
      const user = await createUserWithEmailAndPassword(
        auth,
        emailRef.current.value,
        passwordRef.current.value
      );
    } catch (error) {
      setError("이미 사용 중인 이메일입니다.");
      return;
    }
    // 이메일, 닉네임 정보 파이어스토어에 저장하기
    dispatch(
      signUpFB({
        email: emailRef.current.value,
        nickname: nicknameRef.current.value,
      })
    );

    alert(`${nicknameRef.current.value}님, 환영합니다! 🎉`);

    navigate("/");
  };

  return (
    <FormWrap onSubmit={onSubmit}>
      <h2>회원가입</h2>
      <input ref={emailRef} type="email" placeholder="이메일" required />
      <input
        ref={nicknameRef}
        type="text"
        placeholder="별명"
        required
        maxLength={7}
      />
      <input
        ref={passwordRef}
        type="password"
        placeholder="비밀번호"
        required
      />
      <input
        ref={passwordRef2}
        type="password"
        placeholder="비밀번호 재입력"
        required
      />
      <p>{error}</p>
      <button type="submit">가입하기</button>
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
export default SignUp;
