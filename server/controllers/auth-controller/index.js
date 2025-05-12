const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const registerUser = async (req, res) => {
  const { userName, userEmail, password, role } = req.body;

  try {
    // Kiểm tra username hoặc email đã tồn tại
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { user_email: userEmail },
          { user_name: userName }
        ]
      }
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User name or user email already exists",
      });
    }

    // Mã hóa mật khẩu
    const hashPassword = await bcrypt.hash(password, 10);

    console.log('a')

    // Tạo người dùng mới
    await prisma.user.create({
      data: {
        user_name: userName,
        user_email: userEmail,
        role: role || 'student',
        password: hashPassword,
      }
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully!",
    });

  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const loginUser = async (req, res) => {
  const { userEmail, password } = req.body;

  try {
    const checkUser = await prisma.user.findUnique({
      where: { user_email: userEmail },
    });

    if (!checkUser || !(await bcrypt.compare(password, checkUser.password))) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const accessToken = jwt.sign(
      {
        id: checkUser.id,
        userName: checkUser.user_name,
        userEmail: checkUser.user_email,
        role: checkUser.role,
      },
      process.env.JWT_SECRET || "your_fallback_secret",
      { expiresIn: "120m" }
    );

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      data: {
        accessToken,
        user: {
          id: checkUser.id,
          userName: checkUser.user_name,
          userEmail: checkUser.user_email,
          role: checkUser.role,
        },
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = { registerUser, loginUser };
