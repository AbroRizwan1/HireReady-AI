import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../auth.context";
import { login, register, logout, getMe } from "../services/auth.api.js";
import { AuthValidation } from "../utilities/Auth.validation.js";
import { useNavigate } from "react-router";
import { useToast } from "../../../Share/Toster/Toster.jsx";

export const useAuth = () => {
  //==== context Api
  const context = useContext(AuthContext);
  const { user, setUser, loading, setLoading } = context;

  const { showToast } = useToast();

  const navigate = useNavigate();

  const [error, setError] = useState({
    type: null, //validation / backend / netword
    message: null,
  });

  const handleLogin = async ({ email, password }) => {
    setError(null);

    //========== validation
    const validationError = AuthValidation({ email, password });

    if (validationError) {
      setError({ type: "validation", message: validationError });
      return;
    }

    setLoading(true);
    try {
      // =========== API call
      const data = await login({ email, password });

      setUser(data?.user);
      showToast("logged in successfully", "success");
      setError(null);
      navigate("/");
    } catch (err) {
      if (err.response) {
        const message = err?.response?.data?.message || "Something went wrong";
        setError({
          type: "backend",
          message: message,
        });
      } else if (err.request) {
        showToast(
          "Unable to connect to server. Please try again.",
          "error",
        );
      } else {
        showToast("Something went wrong. Please try again.", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async ({ username, email, password }) => {
    setError(null);
    //========== validation
    const validationError = AuthValidation({
      username,
      email,
      password,
      isRegister: true,
    });

    if (validationError) {
      setError({ type: "validation", message: validationError });
      return;
    }

    setLoading(true);
    try {
      // =========== API call
      const data = await register({ username, email, password });

      setUser(data.user);
      showToast("Registered Successfully", "success");
    } catch (err) {
      if (err.response) {
        const message = err?.response?.data?.message || "Something went wrong";
        setError({
          type: "backend",
          message: message,
        });
      } else if (err.request) {
        showToast(
          "Unable to connect to server. Please try again.",
          "error",
        );
      } else {
        showToast("Something went wrong. Please try again.", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);

    try {
      const data = await logout();

      setUser(null);

      showToast("Logged out successfully", "success");
    } catch (err) {
      setError(err.data.message || "SomeThing went Wrong");
    } finally {
      setLoading(false);
    }
  };

  // === Current User
  useEffect(() => {
    const getAndSetUser = async () => {
      try {
        const data = await getMe();

        setUser(data);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    getAndSetUser();
  }, []);

  return {
    error,
    setError,
    user,
    setUser,
    setLoading,
    loading,
    handleLogin,
    handleLogout,
    handleRegister,
  };
};
