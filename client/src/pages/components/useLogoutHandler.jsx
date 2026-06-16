import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useLogoutMutation } from "../../redux/features/auth/authApi";
import { logout as logoutAction } from "../../redux/features/auth/authSlice";

function useLogoutHandler() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApi] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logoutApi().unwrap(); // clears cookie on backend
    } catch (err) {
      console.error("Logout API failed:", err);
    } finally {
      dispatch(logoutAction()); // clear redux no matter what
      navigate("/login"); // or "/"
    }
  };

  return handleLogout;
}

export default useLogoutHandler;
