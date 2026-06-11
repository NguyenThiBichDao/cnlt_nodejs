const validateRegister = (req, res, next) => {
  const { fullName, email, password } = req.body;
  if (!fullName || !email || !password) {
    return res.status(400).json({ success: false, message: "Thiếu dữ liệu" });
  }
  next();
};

module.exports = { validateRegister };
