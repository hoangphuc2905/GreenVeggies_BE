module.exports = function (req, res, next) {
  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Truy cập bị từ chối. Chỉ admin mới có quyền." });
  }
  next();
};
