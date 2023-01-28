import React, { useState } from "react";
import "./update.scss";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { Auth } from "../../context/authContext";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { axiosInstance } from "../../axios";

const Update = ({ setOpenUpdate }) => {
  const { user, setUser } = Auth();
  const [cover, setCover] = useState(null);
  const [profile, setProfile] = useState(null);
  const [texts, setTexts] = useState({
    email: user.email,
    password: "",
    name: user.name,
    city: user.city,
    website: user.website,
  });
  const handleChange = (e) => {
    setTexts((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const upload = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await axiosInstance.post("upload", formData);
      return res.data;
    } catch (error) {
      console.log(error);
    }
  };

  const queryClient = useQueryClient();

  const mutation = useMutation(
    (user) => {
      return axiosInstance.put("users", user);
    },

    {
      onSuccess: () => {
        queryClient.invalidateQueries(["users"]);
      },
    }
  );

  const handleClick = async (e) => {
    e.preventDefault();
    let profileUrl;
    let coverUrl;
    profileUrl = profile ? await upload(profile) : user.profilePic;
    coverUrl = cover ? await upload(cover) : user.coverPic;
    mutation.mutate({ ...texts, coverPic: coverUrl, profilePic: profileUrl });
    const { password, success, ...others } = texts;
    const values = {
      ...user,
      ...others,
      profilePic: profileUrl,
      coverPic: coverUrl,
    };
    setUser(values);
    setOpenUpdate(false);
    setCover(null);
    setProfile(null);
  };
  return (
    <div className="update">
      <div className="wrapper">
        <h1>Update Your Profile</h1>
        <form>
          <div className="input half">
            <label>Email</label>
            <input
              type="text"
              value={texts.email}
              name="email"
              onChange={handleChange}
            />
          </div>
          <div className="input half">
            <label>Password</label>
            <input
              type="text"
              value={texts.password}
              name="password"
              onChange={handleChange}
            />
          </div>

          <div className="input half">
            <label>Name</label>
            <input
              type="text"
              value={texts.name}
              name="name"
              onChange={handleChange}
            />
          </div>
          <div className="input half">
            <label>Country / City</label>
            <input
              type="text"
              name="city"
              value={texts.city}
              onChange={handleChange}
            />
          </div>
          <div className="input full">
            <label>Website</label>
            <input
              type="text"
              name="website"
              value={texts.website}
              onChange={handleChange}
            />
          </div>
          <div className="files">
            <div className="file-input">
              <label htmlFor="cover">
                <span>Cover Picture</span>
                <div className="imgContainer">
                  <img
                    src={
                      cover
                        ? URL.createObjectURL(cover)
                        : "/upload/" + user.coverPic
                    }
                    alt=""
                  />
                  <CloudUploadIcon className="icon" />
                </div>
              </label>
              <input
                type="file"
                id="cover"
                style={{ display: "none" }}
                onChange={(e) => setCover(e.target.files[0])}
              />
            </div>
            <div className="file-input">
              <label htmlFor="profile">
                <span>Profile Picture</span>
                <div className="imgContainer">
                  <img
                    src={
                      profile
                        ? URL.createObjectURL(profile)
                        : "/upload/" + user.profilePic
                    }
                    alt=""
                  />
                  <CloudUploadIcon className="icon" />
                </div>
              </label>
              <input
                type="file"
                id="profile"
                style={{ display: "none" }}
                onChange={(e) => setProfile(e.target.files[0])}
              />
            </div>
          </div>
          <button onClick={handleClick}>Update</button>
        </form>
        <button className="close" onClick={() => setOpenUpdate(false)}>
          close
        </button>
      </div>
    </div>
  );
};

export default Update;
