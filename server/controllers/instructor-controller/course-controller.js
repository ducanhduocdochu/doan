const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// POST /instructor/course
const addNewCourse = async (req, res) => {
  try {
    const courseData = req.body;
    const instructor = req.user;

    const saveCourse = await prisma.course.create({
      data: {
        id: courseData.id || require("crypto").randomUUID(),
        instructor_id: instructor.id,
        instructor_name: instructor.userName,
        created_at: new Date(),
        title: courseData.title,
        category: courseData.category,
        level: courseData.level,
        primary_language: courseData.primary_language,
        subtitle: courseData.subtitle,
        description: courseData.description,
        image: courseData.image,
        welcome_message: courseData.welcome_message,
        pricing: courseData.pricing,
        objectives: courseData.objectives,
        is_published: courseData.is_published || false,
        targetStudents: courseData.target_students,
        requirements: courseData.requirements,
        fullDescription: courseData.full_description,
      },
    });

    res.status(201).json({
      success: true,
      message: "Course saved successfully",
      data: saveCourse,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

// GET /instructor/course
const getAllCourses = async (req, res) => {
  const instructor_id = req.user.id;
  try {
    const {
      category = "",
      level = "",
      primary_language = "",
      sortBy = "price-lowtohigh",
      page = 1,
      limit = 9999,
      search = "",
    } = req.query;

    const filters = {
      AND: [{ instructor_id }],
    };

    if (category) {
      filters.AND.push({ category: { in: category.split(",") } });
    }

    if (level) {
      filters.AND.push({ level: { in: level.split(",") } });
    }

    if (primary_language) {
      filters.AND.push({
        primary_language: { in: primary_language.split(",") },
      });
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
          ratings: true,
          discount: true,
          student_courses: true,
          students: true,
        },
        skip: (pageNumber - 1) * pageSize,
        take: pageSize,
      }),
      prisma.course.count({ where: filters }),
    ]);

    const coursesWithRating = coursesList.map((course) => {
      const discount_pct = course.discount ? course.discount.discount_pct : 0;
      const pricing_after_discount = (
        course.pricing -
        (discount_pct * course.pricing) / 100
      ).toFixed(2);

      const ratingValues = course.ratings.map((r) => r.rating);
      const rating_count = ratingValues.length;
      const average_rating =
        rating_count > 0
          ? Number(
              (
                ratingValues.reduce((sum, r) => sum + r, 0) / rating_count
              ).toFixed(1)
            )
          : 0;

      return {
        ...course,
        pricing_after_discount,
        discount_pct,
        average_rating,
        rating_count,
      };
    });

    res.status(200).json({
      success: true,
      data: {
        courses: coursesWithRating,
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

// GET /instructor/course/:id
const getCourseDetailsByID = async (req, res) => {
  try {
    const { id } = req.params;

    const courseDetails = await prisma.course.findUnique({
      where: { id },
    });

    if (!courseDetails) {
      return res.status(404).json({
        success: false,
        message: "Course not found!",
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

// PUT /instructor/course/:id
const updateCourseByID = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedCourseData = req.body;

    const updatedCourse = await prisma.course.update({
      where: { id },
      data: updatedCourseData,
    });

    res.status(200).json({
      success: true,
      message: "Course updated successfully",
      data: updatedCourse,
    });
  } catch (e) {
    if (e.code === "P2025") {
      // Prisma: Record not found
      return res.status(404).json({
        success: false,
        message: "Course not found!",
      });
    }

    console.error(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

module.exports = {
  addNewCourse,
  getAllCourses,
  getCourseDetailsByID,
  updateCourseByID,
};
