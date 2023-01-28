import {
  Form,
  Link,
  redirect,
  useActionData,
  useNavigate,
} from "react-router-dom";
import axios from "axios";
import "./register.scss";

const Register = () => {
  const data = useActionData();
  return (
    <div className="register">
      <div className="card">
        <div className="left">
          <h1> Hello World.</h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero cum,
            alias totam numquam ipsa exercitationem dignissimos, error nam,
            consequatur.
          </p>
          <span>Do you have an account?</span>
          <Link to="/login">
            <button>Login</button>
          </Link>
        </div>
        <div className="right">
          <h2>Register</h2>
          <Form method="post" action="/register">
            <input
              type="text"
              placeholder="Username"
              name="username"
              required
            />
            <input type="email" placeholder="Email" name="email" required />
            <input
              type="password"
              placeholder="Password"
              name="password"
              required
            />
            <input type="text" placeholder="Name" name="name" required />
            <button>Register</button>
            {data && data.error && <p className="error">{data.error}</p>}
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Register;

export const registerForm = async ({ request }) => {
  const data = await request.formData();

  const userData = {
    username: data.get("username"),
    password: data.get("password"),
    email: data.get("email"),
    name: data.get("name"),
  };

  if (
    !userData.username ||
    !userData.password ||
    !userData.email ||
    !userData.name
  ) {
    return { error: "Please Put Your Information Right" };
  }

  try {
    await axios.post("http://localhost:5000/api/auth/register", userData);
    return redirect("/login");
  } catch (error) {
    return { error: error.response.data };
  }
};
