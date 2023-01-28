import React from "react";
import Post from "../post/Post";
import "./posts.scss";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../../axios";
const Posts = ({ userId }) => {
  const { data, isLoading, error } = useQuery(["posts"], () =>
    axiosInstance
      .get(`posts?userId=${userId}`)
      .then((res) => res.data)
      .catch((err) => err)
  );

  if (isLoading) {
    return <h2>Loading....</h2>;
  }
  if (error) {
    return <h2>{error}</h2>;
  }

  return (
    <div className="posts">
      {data?.map((post) => (
        <Post post={post} key={post.id} />
      ))}
    </div>
  );
};

export default Posts;
