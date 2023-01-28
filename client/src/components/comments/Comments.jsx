import "./comments.scss";
import { Auth } from "../../context/authContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../../axios";
import moment from "moment";
import { useState } from "react";
const Comments = ({ postId }) => {
  const { user } = Auth();
  const [desc, setDesc] = useState("");

  const { data, isLoading, error } = useQuery(["comments"], () => {
    return axiosInstance
      .get(`comments?postId=${postId}`)
      .then((res) => res.data)
      .catch((err) => err);
  });

  const queryClient = useQueryClient();

  const mutation = useMutation(
    (newComment) => {
      return axiosInstance.post(`comments?postId=${postId}`, newComment);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["comments"]);
      },
    }
  );

  const handleClick = async () => {
    mutation.mutate({ desc });
    setDesc("");
  };

  if (isLoading) {
    return <h2>Loading....</h2>;
  }

  return (
    <div className="comments">
      <div className="write">
        <img src={user.ProfilePic} alt="" />
        <input
          type="text"
          placeholder="write a comment"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
        <button onClick={handleClick}>Send</button>
      </div>
      {data?.map((comment) => (
        <div className="comment" key={comment.id}>
          <img src={comment.profilePic} alt="" />
          <div className="info">
            <span>{comment.name}</span>
            <p>{comment.desc}</p>
          </div>
          <span className="date">{moment(comment.createdAt).fromNow()}</span>
        </div>
      ))}
    </div>
  );
};

export default Comments;
