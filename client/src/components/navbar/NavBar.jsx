import "./navbar.scss";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { Link } from "react-router-dom";
import { DarkMode } from "../../context/darkModeContext";
import { Auth } from "../../context/authContext";
const NavBar = () => {
  const { toggle, darkMode } = DarkMode();
  const { user } = Auth();
  return (
    <header>
      <nav>
        <div className="left">
          <Link to="/">Elhelw</Link>
          <div className="icons">
            <HomeOutlinedIcon />
            {darkMode ? (
              <WbSunnyOutlinedIcon onClick={toggle} />
            ) : (
              <DarkModeOutlinedIcon onClick={toggle} />
            )}
            <GridViewOutlinedIcon />
          </div>
          <div className="input">
            <SearchOutlinedIcon />
            <input type="text" placeholder="Search" />
          </div>
        </div>
        <div className="right">
          <PersonOutlinedIcon />
          <EmailOutlinedIcon />
          <NotificationsOutlinedIcon />
          <div className="avatar">
            <img src={`/upload/${user.profilePic}`} alt="User-logo" />
            <span>{user.name}</span>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default NavBar;
