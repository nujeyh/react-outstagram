import styled from "styled-components";

export const PostWrap = styled.article`
  background-color: white;
  border: solid lightgray 1px;
  border-radius: 3px;
  margin: 0 auto 0.5em auto;
`;
export const PostHeader = styled.div`
  border-bottom: solid lightgray 1px;
  padding: 1em;
  align-items: center;
  .time {
    color: #929292;
  }
  div {
    margin-left: auto;
  }
`;
export const PostLayout1 = styled.div`
  padding: 1em;
  span {
    width: 50%;
    min-width: 360px;
  }
  div {
    margin-right: auto;
  }
`;
export const PostLayout3 = styled.div`
  padding: 1em;
  flex-direction: column;
  width: 350px;
`;

export const ImgWrap = styled.div`
  img {
    width: 345px;
    height: 300px;
    object-fit: cover;
  }
`;
