const middlewareControllers = require("../controllers/middlewareControllers");
const userControllers = require("../controllers/userControllers");

const router = require("express").Router();

//GET ALL USERS
router.get("/", userControllers.getAllUsers);

//DELETE USER
router.delete("/:id", middlewareControllers.verifyTokenAndAdminAuth, userControllers.deleteUser);

//GET USER INFO
router.get("/account-info", middlewareControllers.verifyToken, userControllers.getUserInfo);
module.exports = router;