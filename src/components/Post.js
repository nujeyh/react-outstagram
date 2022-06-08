import React from "react";
import { useDispatch } from "react-redux";

import displayedAt from "./displayedAt";
import { deleteFB } from "../redux/modules/postSlice";
import { useNavigate } from "react-router-dom";

import * as Layout from "../components/postLayout";

const Post = ({ postObj, isOwner }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 상세페이지로 이동
  const onClickPost = () => {
    navigate("/" + postObj.id, {
      state: {
        isOwner,
        uid: postObj.uid,
        layout: postObj.layout,
        text: postObj.text,
        fileUrl: postObj.fileUrl,
        email: postObj.email,
        nickname: postObj.nickname,
        createdAt: postObj.createdAt,
      },
    });
  };

  // 수정페이지로 이동
  const onClickEdit = () => {
    navigate("/edit", {
      state: {
        uid: postObj.uid,
        layout: postObj.layout,
        text: postObj.text,
        fileUrl: postObj.fileUrl,
        createdAt: postObj.createdAt,
      },
    });
  };

  // 게시물 삭제하기
  const onClickDelete = () => {
    const confirm = window.confirm("정말 삭제하시겠어요?");
    if (confirm) {
      dispatch(deleteFB(postObj));
      navigate("/");
    }
    return;
  };

  return (
    <Layout.PostWrap>
      <Layout.PostHeader>
        <span>작성자 : {postObj.nickname}</span>
        <span className="time">{displayedAt(postObj.createdAt)}</span>
        {isOwner && (
          <div>
            <button onClick={onClickEdit}>수정</button>
            <button onClick={onClickDelete}>삭제</button>
          </div>
        )}
      </Layout.PostHeader>

      {
        {
          1: (
            <div>
              <Layout.PostLayout1 onClick={onClickPost}>
                <span>{postObj.text}</span>
                <Layout.ImgWrap>
                  <img src={postObj.fileUrl} />
                </Layout.ImgWrap>
              </Layout.PostLayout1>
            </div>
          ),
          2: (
            <Layout.PostLayout1 onClick={onClickPost}>
              <Layout.ImgWrap>
                <img src={postObj.fileUrl} />
              </Layout.ImgWrap>
              <span>{postObj.text}</span>
            </Layout.PostLayout1>
          ),
          3: (
            <Layout.PostLayout3 onClick={onClickPost}>
              <span>{postObj.text}</span>
              <Layout.ImgWrap>
                <img src={postObj.fileUrl} />
              </Layout.ImgWrap>
            </Layout.PostLayout3>
          ),
        }[postObj.layout]
      }
    </Layout.PostWrap>
  );
};

export default Post;
