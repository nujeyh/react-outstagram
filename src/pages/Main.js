import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { loadPostFB } from "../redux/modules/postSlice";
import Post from "../components/Post";

const Main = () => {
  const dispatch = useDispatch();

  const posts = useSelector((state) => state.post);
  const user = useSelector((state) => state.user);

  if (posts.post[0]) {
    return (
      <div>
        {posts.post.map((post) => {
          return (
            <Post
              key={post.uid}
              postObj={post}
              isOwner={post.email === user.email}
            />
          );
        })}
      </div>
    );
  } else {
    dispatch(loadPostFB());
    return null;
  }
};

export default Main;
