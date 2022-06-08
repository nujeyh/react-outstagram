import React, { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";
import { v4 as uuid } from "uuid";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase";
import { postingFB, updateFB } from "../redux/modules/postSlice";

import styled from "styled-components";
import * as Layout from "../components/postLayout";

const Write = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const postObj = location.state;

  const layoutRef = useRef(postObj ? postObj.layout : "1");
  const textRef = useRef(null);
  const fileUrlRef = useRef(null);

  const author = useSelector((state) => state.user);

  const [preview, setPreview] = useState(postObj ? postObj.fileUrl : null);
  const [inputs, setInputs] = useState({
    text: postObj ? postObj.text : "",
    layout: postObj ? postObj.layout : "1",
  });

  const { text, layout } = inputs;

  // input 상태관리
  const onChange = (event) => {
    const { name, value } = event.target;
    setInputs({ ...inputs, [name]: value });
  };

  // 라디오 버튼 값 받아오기
  const getRadioValue = (event) => {
    layoutRef.current = event.target.id;
    onChange(event);
  };

  ////////// 파이어베이스 //////////
  // 사진 미리보기
  // FileReader API 사용
  const filePreview = (event) => {
    const {
      target: { files },
    } = event;
    const file = files[0];

    if (!file) {
      setPreview(null);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      setPreview(result);
    };
    reader.readAsDataURL(file);
  };

  // 파이어베이스에 사진 업로드하기
  const uploadPhotoFB = async () => {
    const fileRef = ref(storage, `images/${author.email}/${uuid()}`);
    const response = await uploadString(fileRef, preview, "data_url");
    const fileUrl = await getDownloadURL(response.ref);
    fileUrlRef.current = { url: fileUrl };
  };

  // 파이어베이스에 게시물 등록하기
  const createPost = async (event) => {
    event.preventDefault();

    await uploadPhotoFB();

    dispatch(
      postingFB({
        uid: uuid(),
        layout: layoutRef.current,
        text: textRef.current.value,
        fileUrl: fileUrlRef.current.url,
        email: author.email,
        nickname: author.nickname,
        createdAt: Date.now(),
      })
    );
    navigate("/");
  };

  // 파이어베이스 게시물 수정하기
  const editPost = async (event) => {
    event.preventDefault();

    // 수정사항 없으면 리턴
    if (
      layoutRef.current === postObj.layout &&
      textRef.current.value === postObj.text &&
      preview === postObj.fileUrl
    )
      return;

    // 사진 변경했을 때만 업로드
    if (preview === postObj.fileUrl) {
      fileUrlRef.current = { url: preview };
    } else {
      await uploadPhotoFB();
    }

    dispatch(
      updateFB({
        uid: postObj.uid,
        layout: layoutRef.current,
        text: textRef.current.value,
        fileUrl: fileUrlRef.current.url,
      })
    );

    navigate("/");
  };
  /////////////////////////

  return (
    <FormWrap>
      <form onSubmit={postObj ? editPost : createPost}>
        <h2>{postObj ? "게시물 수정하기" : "새 게시물"}</h2>
        <InputWrap>
          <div>
            <input
              type="radio"
              id="1"
              name="layout"
              onChange={getRadioValue}
              value="1"
              defaultChecked={postObj ? postObj.layout === "1" : true}
              required
            />
            <label htmlFor="1">기본 배치</label>

            <input
              type="radio"
              id="2"
              name="layout"
              onChange={getRadioValue}
              value="2"
              defaultChecked={postObj ? postObj.layout === "2" : false}
            />
            <label htmlFor="2">반전 배치</label>

            <input
              type="radio"
              id="3"
              name="layout"
              onChange={getRadioValue}
              value="3"
              defaultChecked={postObj ? postObj.layout === "3" : false}
            />
            <label htmlFor="3">수직 배치</label>
          </div>
          <input
            className="file"
            type="file"
            accept="image/*"
            onChange={filePreview}
            required={postObj ? false : true}
          />
          <textarea
            rows="3"
            cols="50"
            name="text"
            value={text}
            onChange={onChange}
            ref={textRef}
            maxLength={140}
            placeholder="문구 입력..."
            required
          />
          <span>{text.length + "/140"}</span>
        </InputWrap>
        <h3>미리보기</h3>

        <Layout.PostWrap>
          {
            {
              1: (
                <Layout.PostLayout1>
                  <div>{text}</div>
                  <Layout.ImgWrap>
                    {preview && <img src={preview} />}
                  </Layout.ImgWrap>
                </Layout.PostLayout1>
              ),
              2: (
                <Layout.PostLayout1>
                  <Layout.ImgWrap>
                    {preview && <img src={preview} />}
                  </Layout.ImgWrap>
                  <div>{text}</div>
                </Layout.PostLayout1>
              ),
              3: (
                <Layout.PostLayout3>
                  <div>{text}</div>
                  <Layout.ImgWrap>
                    {preview && <img src={preview} />}
                  </Layout.ImgWrap>
                </Layout.PostLayout3>
              ),
            }[layout]
          }
        </Layout.PostWrap>
        <div className="btn">
          <button type="submit" disabled={!(text && preview)}>
            {postObj ? "수정하기" : "작성하기"}
          </button>
          <button onClick={() => navigate(-1)}>뒤로가기</button>
        </div>
      </form>
    </FormWrap>
  );
};
const FormWrap = styled.div`
  background-color: white;
  border: solid lightgray 1px;
  border-radius: 3px;
  form {
    display: flex;
    flex-flow: column wrap;
    padding: 1em;
  }
  textarea {
    resize: none;
  }
`;

const InputWrap = styled.div`
  padding: 1em;
  width: 80%;
  span {
    width: 100%;
  }

  .file {
    width: 100%;
  }
`;
export default Write;
