const User = require("../models/User");
const Task = require("../models/Task");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ error: "User already exists" });

        const passwordHash = await bcrypt.hash(password, 10);
        const user = await User.create({ username, email, passwordHash });

        res.status(201).json({ message: "User registered successfully" });
    } catch {
        res.status(500).json({ error: "Registration failed" });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: "User not found" });

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) return res.status(400).json({ error: "Invalid credentials" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "3min" });
        const tasks = await Task.find({ userId: user._id });

        res.json({
            token,
            user: { id: user._id, username: user.username, email: user.email },
            tasks,
        });
    } catch {
        res.status(500).json({ error: "Login failed" });
    }
};
