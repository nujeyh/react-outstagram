import React from "react";
import { useSelector } from "react-redux";
import Post from "../components/Post";

const Main = () => {
  const posts = useSelector((state) => state.post);
  const user = useSelector((state) => state.user);

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
};

export default Main;
