const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET /student/course?category=&level=&primaryLanguage=&sortBy=
const getAllStudentViewCourses = async (req, res) => {
  try {
    const {
      category = "",
      level = "",
      primaryLanguage = "",
      sortBy = "price-lowtohigh",
    } = req.query;

    // Xử lý bộ lọc
    const filters = {};

    if (category) {
      filters.category = { in: category.split(",") };
    }

    if (level) {
      filters.level = { in: level.split(",") };
    }

    if (primaryLanguage) {
      filters.primary_language = { in: primaryLanguage.split(",") };
    }

    // Xử lý sort
    let orderBy = {};
    switch (sortBy) {
      case "price-lowtohigh":
        orderBy = { pricing: "asc" };
        break;
      case "price-hightolow":
        orderBy = { pricing: "desc" };
        break;
      case "title-atoz":
        orderBy = { title: "asc" };
        break;
      case "title-ztoa":
        orderBy = { title: "desc" };
        break;
      default:
        orderBy = { pricing: "asc" };
        break;
    }

    const coursesList = await prisma.course.findMany({
      where: filters,
      orderBy,
    });

    res.status(200).json({
      success: true,
      data: coursesList,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

// GET /student/course/:id
const getStudentViewCourseDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const courseDetails = await prisma.course.findUnique({
      where: { id },
    });

    if (!courseDetails) {
      return res.status(404).json({
        success: false,
        message: "No course details found",
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      data: courseDetails,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

// GET /student/course/check/:id/:studentId
const checkCoursePurchaseInfo = async (req, res) => {
  try {
    const { id, studentId } = req.params;

    const existing = await prisma.studentCourse.findFirst({
      where: {
        user_id: studentId,
        course_id: id,
      },
    });

    const alreadyBought = !!existing;

    res.status(200).json({
      success: true,
      data: alreadyBought,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

module.exports = {
  getAllStudentViewCourses,
  getStudentViewCourseDetails,
  checkCoursePurchaseInfo,
};
