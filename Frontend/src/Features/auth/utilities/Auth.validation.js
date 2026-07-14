export const AuthValidation = ({
  username,
  email,
  password,
  isRegister = false,
}) => {

  if (!email || !password) {
    return "All fields are required";
  }

  if (isRegister) {
    if (!username || username.length < 3) {
      return "Username must be at least 3 characters";
    }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return "Invalid email format";
  }

  if (password.length < 6) {
    return "Password must be at least 6 characters";
  }

  return null; // no error
};
