import "./login.scss";
import { Form, Link, useActionData } from "react-router-dom";
import { Auth } from "../../context/authContext";
import axios from "axios";
import { useEffect, useState } from "react";

const Login = () => {
  const data = useActionData();
  const { setUser } = Auth();
  const [page, setPage] = useState(1);

  const [loadingMore, setLoadingMore] = useState(false);
  // Watch Scrolling If reach to bottom
  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.pageYOffset;
      // const scrollTop = document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;
      if (scrollTop + clientHeight >= scrollHeight) {
        setLoadingMore(true);
        setPage(page + 1);
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [page]);

  useEffect(() => {
    if (data?.success) {
      setUser(data);
    }
  }, [data?.success]);
  return (
    <div className="login">
      <div className="card">
        <div className="left">
          <h1>Hello World.</h1>
          <p className="error">{page}</p>

          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero cum,
            alias totam numquam ipsa exercitationem dignissimos, error nam,
            consequatur.
          </p>
          <span>Don't you have an account?</span>
          <Link to="/register">
            <button>Register</button>
          </Link>
        </div>
        <div className="right">
          <h2>Login</h2>

          <Form method="post" action="/login">
            <input
              type="text"
              name="username"
              required
              placeholder="Username"
            />
            <input
              type="password"
              name="password"
              required
              placeholder="Password"
            />
            <button>Login</button>
          </Form>
          {data && data.error && <p className="error">{data.error}</p>}
        </div>
      </div>
    </div>
  );
};

export default Login;

export const loginForm = async ({ request }) => {
  const data = await request.formData();

  const userData = {
    username: data.get("username"),
    password: data.get("password"),
  };

  if (!userData.username || !userData.password) {
    return { error: "Please Put Your Information Right" };
  }

  try {
    const res = await axios.post(
      "http://localhost:5000/api/auth/login",
      userData,
      { withCredentials: true }
    );
    return { ...res.data, success: true };
  } catch (error) {
    return { error: error.response.data };
  }
};
