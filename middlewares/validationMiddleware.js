const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

exports.validateRegister = (req, res, next) => {
  const { username, email, password } = req.body;

  if (!username || username.length < 3) {
    return res.status(400).json({ error: "Username must be at least 3 characters." });
  }

  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email format." });
  }

  if (!password || password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters." });
  }

  next();
};
