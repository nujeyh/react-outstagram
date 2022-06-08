import React from "react";
import { useLocation } from "react-router-dom";

import Post from "../components/Post";

const Detail = () => {
  const location = useLocation();
  const postObj = location.state;
  return (
    <>
      <h2>상세페이지</h2>
      <Post postObj={postObj} isOwner={postObj.isOwner} />
    </>
  );
};

export default Detail;
