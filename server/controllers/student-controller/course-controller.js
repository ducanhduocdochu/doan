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
      page = 1,
      limit = 6,
      search = "",
    } = req.query;

    const filters = {
      AND: [],
    };

    if (category) {
      filters.AND.push({ category: { in: category.split(",") } });
    }

    if (level) {
      filters.AND.push({ level: { in: level.split(",") } });
    }

    if (primaryLanguage) {
      filters.AND.push({ primary_language: { in: primaryLanguage.split(",") } });
    }

    if (search) {
      filters.AND.push({
        OR: [
          { title: { contains: search } },
          { subtitle: { contains: search } },
          { description: { contains: search } },
        ],
      });
    }

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
    }

    const pageNumber = parseInt(page);
    const pageSize = parseInt(limit);

    const [coursesList, totalItems] = await Promise.all([
      prisma.course.findMany({
        where: filters,
        orderBy,
        include: {
          lectures: true,
          instructor: {
            select: {
              user_name: true,
              user_email: true,
              instructor_profile: true,
            },
          },
        },
        skip: (pageNumber - 1) * pageSize,
        take: pageSize,
      }),
      prisma.course.count({ where: filters }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        courses: coursesList,
        totalItems,
      },
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
    const userId = req.user.id; 

    const courseDetails = await prisma.course.findUnique({
      where: { id },
      include: {
        lectures: true,
        instructor: {
          select: {
            user_name: true,
            user_email: true,
            instructor_profile: true
          }
        }
      },
    });

    if (!courseDetails) {
      return res.status(404).json({
        success: false,
        message: "No course details found",
        data: null,
      });
    }

    let isFavorite = false;
    if (userId) {
      const favorite = await prisma.favoriteCourse.findUnique({
        where: {
          user_id_course_id: {
            user_id: userId,
            course_id: id,
          }
        }
      });
      isFavorite = !!favorite;
    }

    res.status(200).json({
      success: true,
      data: {
        ...courseDetails,
        isFavorite,
      },
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

const addFavoriteCourse = async (req, res) => {
  const {courseId } = req.params;
  const userId = req.user.id;

  if (!userId || !courseId) {
    return res.status(400).json({ success: false, message: "Missing userId or courseId" });
  }

  try {
    const favorite = await prisma.favoriteCourse.create({
      data: {
        user_id: userId,
        course_id: courseId,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Course added to favorites",
      data: favorite,
    });
  } catch (err) {
    if (err.code === "P2002") {
      return res.status(409).json({ success: false, message: "Course already in favorites" });
    }

    console.error("Add favorite error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const removeFavoriteCourse = async (req, res) => {
  const { courseId } = req.params;
  const userId = req.user.id; 

  if (!userId || !courseId) {
    return res.status(400).json({ success: false, message: "Missing userId or courseId" });
  }

  try {
    await prisma.favoriteCourse.delete({
      where: {
        user_id_course_id: {
          user_id: userId,
          course_id: courseId,
        },
      },
    });

    return res.status(200).json({
      success: true,
      message: "Course removed from favorites",
    });
  } catch (err) {
    console.error("Remove favorite error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  getAllStudentViewCourses,
  getStudentViewCourseDetails,
  checkCoursePurchaseInfo,
  removeFavoriteCourse,
  addFavoriteCourse
};
