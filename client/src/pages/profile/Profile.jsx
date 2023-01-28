import { useParams } from "react-router-dom";
import FacebookTwoToneIcon from "@mui/icons-material/FacebookTwoTone";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import PlaceIcon from "@mui/icons-material/Place";
import LanguageIcon from "@mui/icons-material/Language";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";

import Posts from "../../components/posts/Posts";
import "./profile.scss";
import { axiosInstance } from "../../axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Auth } from "../../context/authContext";
import { useState } from "react";
import Update from "../../components/update/Update";
const Profile = () => {
  const [openUpdate, setOpenUpdate] = useState(false);
  const { id } = useParams();
  const { user } = Auth();

  const { data, isLoading } = useQuery(["users"], () => {
    return axiosInstance.get(`users/find/${id}`).then((res) => res.data);
  });

  const { data: followUser } = useQuery(["follow"], () => {
    return axiosInstance
      .get(`relationships?followedUserId=${id}`)
      .then((res) => res.data);
  });

  const queryClient = useQueryClient();

  const mutation = useMutation(
    (follow) => {
      if (!follow)
        return axiosInstance.post(`relationships?followedUserId=${id}`);
      return axiosInstance.delete(`relationships?followedUserId=${id}`);
    },
    {
      onSuccess: (data) => {
        queryClient.setQueryData(["follow"], (oldData) => {
          if (!oldData.includes(data.data)) return [...oldData, data.data];
          return oldData.filter((userId) => userId !== data.data);
        });
      },
    }
  );

  const handleFollow = () => {
    mutation.mutate(followUser.includes(user.id));
  };

  if (isLoading) return <h2>Loading...</h2>;
  return (
    <div className="profile">
      <div className="images">
        <img src={`/upload/${data?.coverPic}`} alt="" className="cover" />
        <img
          src={`/upload/${data?.profilePic}`}
          alt=""
          className="profilePic"
        />
      </div>
      <div className="profileContainer">
        <div className="uInfo">
          <div className="left">
            <a href="http://facebook.com">
              <FacebookTwoToneIcon fontSize="large" />
            </a>
            <a href="http://facebook.com">
              <InstagramIcon fontSize="large" />
            </a>
            <a href="http://facebook.com">
              <TwitterIcon fontSize="large" />
            </a>
          </div>
          <div className="center">
            <span>{data.name}</span>
            <div className="info">
              <div className="item">
                <PlaceIcon />
                <span>{data.city}</span>
              </div>
              <div className="item">
                <LanguageIcon />
                <span>{data.website}</span>
              </div>
            </div>
            {user.id === parseInt(id) ? (
              <button onClick={() => setOpenUpdate(true)}>Update</button>
            ) : (
              <button onClick={handleFollow}>
                {followUser?.includes(user.id) ? "Unfollow" : "Follow"}
              </button>
            )}
          </div>
          <div className="right">
            <EmailOutlinedIcon />
            <MoreVertIcon />
          </div>
        </div>
        <Posts userId={id} />
      </div>
      {openUpdate && <Update setOpenUpdate={setOpenUpdate} />}
    </div>
  );
};

export default Profile;
