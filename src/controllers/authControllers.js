    const authService = require("../services/authService");

    const authControllers = {
      register: async (req, res) => {
        try {
          const user = await authService.register(req.body);
          res.status(201).json(user);
        } catch (err) {
          res.status(400).json({ message: err.message });
        }
      },

      confirmUser: async (req, res) => {
        try {
          const { email, phone, username, password } = req.body;
          const result = await authService.confirmAndSaveUser(
            email,
            phone,
            username,
            password
          );
          res.status(200).json(result);
        } catch (err) {
          res.status(400).json({ message: err.message });
        }
      },
      login: async (req, res) => {
        try {
          const { email, password } = req.body;
          const { user, token } = await authService.login(email, password);
          res.status(200).json({ user, token });
        } catch (err) {
          res.status(400).json({ message: err.message });
        }
      },
    };

    module.exports = authControllers;
