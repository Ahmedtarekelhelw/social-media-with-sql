import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Link } from "react-router-dom";
import React, { useState } from "react";
import "./post.scss";
import Comments from "../comments/Comments";
import moment from "moment";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../../axios";
import { Auth } from "../../context/authContext";

const Post = ({ post }) => {
  const [commentOpen, setCommentOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = Auth();

  const { data, isLoading } = useQuery(["likes", post.id], () => {
    return axiosInstance.get(`likes?postId=${post.id}`).then((res) => res.data);
  });

  const queryClient = useQueryClient();

  const mutation = useMutation(
    (liked) => {
      if (!liked) return axiosInstance.post("likes", { postId: post.id });
      return axiosInstance.delete(`likes?postId=${post.id}`);
    },
    {
      onSuccess: (data) => {
        queryClient.setQueryData(["likes", post.id], (oldData) => {
          if (!oldData.includes(data.data)) return [...oldData, data.data];
          return oldData.filter((userId) => userId !== data.data);
        });
      },
    }
  );

  const deleteMutation = useMutation(
    (postId) => {
      return axiosInstance.delete(`posts?postId=${postId}`);
    },
    {
      onSuccess: (data) => {
        queryClient.setQueryData(["posts"], (oldData) => {
          return oldData.filter((post) => post.id !== parseInt(data.data));
        });
      },
    }
  );

  const handleDelete = () => {
    deleteMutation.mutate(post.id);
  };

  const handleLike = () => {
    mutation.mutate(data?.includes(user.id));
  };

  if (isLoading) {
    return <h2>Loading....</h2>;
  }

  return (
    <div className="post">
      <div className="container">
        <div className="user">
          <div className="userInfo">
            <img src={`/upload/${post.profilePic}`} alt="" />
            <div className="details">
              <Link
                to={`/profile/${post.userId}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <span className="name">{post.name}</span>
              </Link>
              <span className="date">{moment(post.createdAt).fromNow()}</span>
            </div>
          </div>
          <MoreHorizIcon onClick={() => setMenuOpen(!menuOpen)} />
          {menuOpen && post.userId === user.id && (
            <button onClick={handleDelete}>delete</button>
          )}
        </div>
        <div className="content">
          <p>{post.desc}</p>
          <img src={`./upload/${post.img}`} alt="" />
        </div>
        <div className="info">
          <div className="item">
            {data.includes(user.id) ? (
              <FavoriteOutlinedIcon
                style={{ color: "red" }}
                onClick={handleLike}
              />
            ) : (
              <FavoriteBorderOutlinedIcon onClick={handleLike} />
            )}
            {data.length} Likes
          </div>
          <div className="item" onClick={() => setCommentOpen(!commentOpen)}>
            <TextsmsOutlinedIcon />
            See Comments
          </div>
          <div className="item">
            <ShareOutlinedIcon />
            Share
          </div>
        </div>
        {commentOpen && <Comments postId={post.id} />}
      </div>
    </div>
  );
};

export default React.memo(Post);
