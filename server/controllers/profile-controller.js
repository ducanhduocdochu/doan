const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const updateUserInfo = async (req, res) => {
  try {
    const user = req.user;
    const {
      user_name,
      user_email,
      bio,
      occupation,
      education,
      language,
      paypal_email,
      phone,
      address,
      linkedin_url,
      website_url,
      avatar_url,
      cv,
    } = req.body;

    if (!user?.id) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // 🔹 1. Chuẩn bị update cho bảng User
    const userUpdateData = {};
    if (user_name !== undefined) userUpdateData.user_name = user_name;
    if (user_email !== undefined) userUpdateData.user_email = user_email;

    let updatedUser = await prisma.user.findUnique({ where: { id: user.id } });

    if (Object.keys(userUpdateData).length > 0) {
      updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: userUpdateData,
      });
    }

    // 🔹 2. Chuẩn bị update cho instructorProfile nếu role là instructor
    let updatedProfile = null;

    if (user.role === "instructor") {
      const profileUpdateData = {};

      const possibleFields = {
        bio,
        occupation,
        education,
        language,
        paypal_email,
        phone,
        address,
        linkedin_url,
        website_url,
        avatar_url,
        cv,
      };

      // Lọc bỏ undefined
      for (const key in possibleFields) {
        if (possibleFields[key] !== undefined) {
          profileUpdateData[key] = possibleFields[key];
        }
      }

      if (Object.keys(profileUpdateData).length > 0) {
        const profileExist = await prisma.instructorProfile.findUnique({
          where: { user_id: user.id },
        });

        if (profileExist) {
          updatedProfile = await prisma.instructorProfile.update({
            where: { user_id: user.id },
            data: profileUpdateData,
          });
        } else {
          updatedProfile = await prisma.instructorProfile.create({
            data: {
              user_id: user.id,
              bio: "",
              occupation: "",
              education: "",
              language: "",
              paypal_email: "",
              phone: "",
              address: "",
              linkedin_url: "",
              website_url: "",
              avatar_url: "",
              cv: "",
              ...profileUpdateData,
            },
          });
        }
      } else {
        updatedProfile = await prisma.instructorProfile.findUnique({
          where: { user_id: user.id },
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: {
        user: updatedUser,
        instructor_profile: updatedProfile,
      },
    });
  } catch (error) {
    console.error("updateUserInfo error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        instructor_profile: true,
      },
    });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      data: {
        id: user.id,
        user_name: user.user_name,
        user_email: user.user_email,
        role: user.role,
        is_verify: user.is_verify,
        instructor_profile: user.role === "instructor" ? user.instructor_profile : null,
      },
    });
  } catch (error) {
    console.error("getUserById error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = {
    updateUserInfo,
    getUserById,
};
