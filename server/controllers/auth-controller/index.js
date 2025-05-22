const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const sendgridMail = require("@sendgrid/mail");
const prisma = new PrismaClient();
sendgridMail.setApiKey(process.env.SENDGRID_API_KEY);

const registerInstructor = async (req, res) => {
  const {
    userName,
    userEmail,
    password,
    bio,
    occupation,
    education,
    language,
    paypalEmail,
    cv,
  } = req.body;

  try {
    // Kiểm tra user tồn tại
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ user_email: userEmail }, { user_name: userName }],
      },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User name or email already exists",
      });
    }

    // Mã hóa mật khẩu
    const hashPassword = await bcrypt.hash(password, 10);

    // Tạo user và instructor profile trong transaction
    const createdUser = await prisma.user.create({
      data: {
        user_name: userName,
        user_email: userEmail,
        password: hashPassword,
        role: "instructor",
        instructor_profile: {
          create: {
            bio,
            occupation,
            education,
            language,
            paypal_email: paypalEmail,
            cv: "link",
          },
        },
      },
      include: {
        instructor_profile: true,
      },
    });

    // 🔑 Tạo token xác thực
    const token = jwt.sign({ id: createdUser.id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    const verifyUrl = `${process.env.SERVER_URL}/auth/verify-email?token=${token}`;

    const msg = {
      to: userEmail,
      from: "tducanh263@gmail.com",
      subject: "LMS Learn - Verify Your Email",
      html: `
        <p>Hello <b>${userName}</b>,</p>
        <p>Thank you for registering as an instructor on <b>LMS Learn</b>.</p>
        <p>Click the button below to verify your email:</p>
<p><a href="${verifyUrl}">${verifyUrl}</a></p>
        <p>This link will expire in 24 hours.</p>
      `,
    };

    await sendgridMail.send(msg);

    return res.status(201).json({
      success: true,
      message: "Instructor registered successfully!",
      data: {
        userId: createdUser.id,
        instructorProfileId: createdUser.instructor_profile.id,
        is_verify: createdUser.instructor_profile.is_verify,
      },
    });
  } catch (error) {
    console.error("Register Instructor error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const registerUser = async (req, res) => {
  const { userName, userEmail, password, role } = req.body;

  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ user_email: userEmail }, { user_name: userName }],
      },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User name or user email already exists",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const createdUser = await prisma.user.create({
      data: {
        user_name: userName,
        user_email: userEmail,
        role: role || "student",
        is_verify: false,
        password: hashPassword,
      },
    });

    // Tạo token xác thực
    const token = jwt.sign({ id: createdUser.id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    const verifyUrl = `${process.env.SERVER_URL}/auth/verify-email?token=${token}`;

    const msg = {
      to: userEmail,
      from: "tducanh263@gmail.com",
      subject: "LMS Learn - Verify Your Account",
      html: `
        <p>Hello <b>${userName}</b>,</p>
        <p>Thank you for registering on <b>LMS Learn</b>.</p>
        <p>Click the button below to verify your account:</p>
<p><a href="${verifyUrl}">${verifyUrl}</a></p>
        <p>This link will expire in 24 hours.</p>
      `,
    };

    await sendgridMail.send(msg);

    return res.status(201).json({
      success: true,
      message: "User registered. Please check your email to verify.",
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
        user_name: checkUser.user_name,
        user_email: checkUser.user_email,
        role: checkUser.role,
        is_verify: checkUser.is_verify,
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
          user_name: checkUser.user_name,
          user_email: checkUser.user_email,
          role: checkUser.role,
          is_verify: checkUser.is_verify,
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

const verifyEmail = async (req, res) => {
  const { token } = req.query;

  try {
    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Missing verification token",
      });
    }

    // Giải mã token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.is_verify) {
      return res.status(200).json({
        success: true,
        message: "Your email has already been verified.",
      });
    }

    // Cập nhật is_verify
    await prisma.user.update({
      where: { id: user.id },
      data: { is_verify: true },
    });

    return res.status(200).json({
      success: true,
      message: "Email verified successfully!",
    });
  } catch (error) {
    console.error("Email verification error:", error);
    return res.status(400).json({
      success: false,
      message: "Invalid or expired verification link.",
    });
  }
};

module.exports = { registerUser, loginUser, registerInstructor, verifyEmail };
