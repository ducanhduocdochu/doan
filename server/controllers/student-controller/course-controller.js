const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// GET /student/course?category=&level=&primary_language=&sortBy=
const getAllStudentViewCourses = async (req, res) => {
  try {
    const {
      category = "",
      level = "",
      primary_language = "",
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

const getStudentViewCourseDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const courseDetails = await prisma.course.findUnique({
      where: { id },
      include: {
        lectures: {
          orderBy: {
            id: "asc",
          },
        },
        instructor: {
          select: {
            user_name: true,
            user_email: true,
            instructor_profile: true,
          },
        },
        discount: true,
        ratings: {
          include: {
            user: {
              select: {
                id: true,
                user_name: true,
                user_email: true,
              },
            },
          },
        },
      },
    });

    if (!courseDetails) {
      return res.status(404).json({
        success: false,
        message: "No course details found",
        data: null,
      });
    }

    const discount_pct = courseDetails.discount
      ? courseDetails.discount.discount_pct
      : 0;
    const pricing_after_discount = (
      courseDetails.pricing - (discount_pct * courseDetails.pricing) / 100
    ).toFixed(2);
    const ratingValues = courseDetails.ratings.map((r) => r.rating);
    const rating_count = ratingValues.length;
    const average_rating =
      rating_count > 0
        ? Number((ratingValues.reduce((sum, r) => sum + r, 0) / rating_count).toFixed(1))
        : 0;

    // Check yêu thích
    let is_favorite = false;
    const favorite = await prisma.favoriteCourse.findUnique({
      where: {
        user_id_course_id: {
          user_id: userId,
          course_id: id,
        },
      },
    });
    is_favorite = !!favorite;

    // Check giỏ hàng
    let is_in_cart = false;
    const cartItem = await prisma.cartCourse.findUnique({
      where: {
        user_id_course_id: {
          user_id: userId,
          course_id: id,
        },
      },
    });
    is_in_cart = !!cartItem;

    return res.status(200).json({
      success: true,
      data: {
        ...courseDetails,
        pricing_after_discount,
        discount_pct,
        average_rating,
        rating_count,
        is_favorite,
        is_in_cart,
      },
    });
  } catch (e) {
    console.error("getStudentViewCourseDetails error:", e);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

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
  const { courseId } = req.params;
  const userId = req.user.id;

  if (!userId || !courseId) {
    return res
      .status(400)
      .json({ success: false, message: "Missing userId or courseId" });
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
      return res
        .status(409)
        .json({ success: false, message: "Course already in favorites" });
    }

    console.error("Add favorite error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const removeFavoriteCourse = async (req, res) => {
  const { courseId } = req.params;
  const userId = req.user.id;

  if (!userId || !courseId) {
    return res
      .status(400)
      .json({ success: false, message: "Missing userId or courseId" });
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

const getFavoriteCourses = async (req, res) => {
  const userId = req.user.id;

  try {
    const favorites = await prisma.favoriteCourse.findMany({
      where: { user_id: userId },
      orderBy: { createdAt: 'desc' },
      include: {
        course: {
          include: {
            discount: true,
            ratings: true,
            instructor: {
              select: {
                user_name: true,
              },
            },
          },
        },
      },
    });

    const result = favorites.map(({ course }) => {
      const discount_pct = course.discount ? course.discount.discount_pct : 0;
      const pricing_after_discount = (
        course.pricing - (discount_pct * course.pricing) / 100
      ).toFixed(2);
      const ratingValues = course.ratings.map((r) => r.rating);
      const ratingCount = ratingValues.length;
      const averageRating =
        ratingCount > 0
          ? Number(
              (
                ratingValues.reduce((sum, r) => sum + r, 0) / ratingCount
              ).toFixed(1)
            )
          : 0;

      return {
        ...course,
        discount_pct,
        pricing_after_discount,
        averageRating,
        ratingCount,
      };
    });

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    console.error("Get favorite courses error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const getCartCourses = async (req, res) => {
  const userId = req.user.id;

  const {
    category = "",
    level = "",
    primary_language = "",
    sortBy = "title-atoz",
    search = "",
    page = 1,
    limit = 6,
  } = req.query;

  try {
    const filters = {
      AND: [
        { in_cart_by_users: { some: { user_id: userId } } },
      ],
    };

    if (category) {
      filters.AND.push({ category: { in: category.split(",") } });
    }
    if (level) {
      filters.AND.push({ level: { in: level.split(",") } });
    }
    if (primary_language) {
      filters.AND.push({ primary_language: { in: primary_language.split(",") } });
    }

    if (search) {
      filters.AND.push({
        OR: [
          { title: { contains: search} },
          { subtitle: { contains: search} },
          { description: { contains: search} },
        ],
      });
    }

    // Sắp xếp
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
        orderBy = { title: "asc" };
    }

    const pageNumber = parseInt(page);
    const pageSize = parseInt(limit);

    const [courses, totalItems] = await Promise.all([
      prisma.course.findMany({
        where: filters,
        orderBy,
        include: {
          discount: true,
          ratings: true,
          instructor: {
            select: {
              user_name: true,
            },
          },
        },
        skip: (pageNumber - 1) * pageSize,
        take: pageSize,
      }),
      prisma.course.count({ where: filters }),
    ]);

    const result = courses.map((course) => {
      const discount_pct = course.discount ? course.discount.discount_pct : 0;
      const pricing_after_discount = (
        course.pricing - (discount_pct * course.pricing) / 100
      ).toFixed(2);
      const ratingValues = course.ratings.map((r) => r.rating);
      const ratingCount = ratingValues.length;
      const averageRating =
        ratingCount > 0
          ? Number((ratingValues.reduce((sum, r) => sum + r, 0) / ratingCount).toFixed(1))
          : 0;

      return {
        ...course,
        discount_pct,
        pricing_after_discount,
        averageRating,
        ratingCount,
      };
    });

    return res.status(200).json({
      success: true,
      data: {
        courses: result,
        totalItems,
      },
    });
  } catch (err) {
    console.error("Get cart courses error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};


const getPurchasedCourses = async (req, res) => {
  const userId = req.user.id;

  try {
    const purchased = await prisma.studentCourse.findMany({
      where: { user_id: userId },
      orderBy: { date_of_purchase: 'desc' },
      include: {
        course: {
          include: {
            discount: true,
            ratings: true,
            lectures: true,
            instructor: {
              select: { user_name: true },
            },
          },
        },
      },
    });

    const result = purchased.map(({ course }) => {
      const discount_pct = course.discount ? course.discount.discount_pct : 0;
      const pricing_after_discount = (
        course.pricing - (discount_pct * course.pricing) / 100
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
        discount_pct,
        pricing_after_discount,
        average_rating,
        rating_count,
      };
    });

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    console.error("Get purchased courses error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const addToCart = async (req, res) => {
  const { courseId } = req.params;
  const userId = req.user.id;

  if (!userId || !courseId) {
    return res.status(400).json({
      success: false,
      message: "Missing userId or courseId",
    });
  }

  try {
    const existing = await prisma.cartCourse.findUnique({
      where: {
        user_id_course_id: {
          user_id: userId,
          course_id: courseId,
        },
      },
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Course already in cart",
      });
    }

    const result = await prisma.cartCourse.create({
      data: {
        user_id: userId,
        course_id: courseId,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Course added to cart",
      data: result,
    });
  } catch (err) {
    console.error("Add to cart error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const removeFromCart = async (req, res) => {
  const { courseId } = req.params;
  const userId = req.user.id;

  if (!userId || !courseId) {
    return res.status(400).json({
      success: false,
      message: "Missing userId or courseId",
    });
  }

  try {
    await prisma.cartCourse.delete({
      where: {
        user_id_course_id: {
          user_id: userId,
          course_id: courseId,
        },
      },
    });

    return res.status(200).json({
      success: true,
      message: "Course removed from cart",
    });
  } catch (err) {
    console.error("Remove from cart error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  getAllStudentViewCourses,
  getStudentViewCourseDetails,
  checkCoursePurchaseInfo,
  removeFavoriteCourse,
  addFavoriteCourse,
  getFavoriteCourses,
  getCartCourses,
  getPurchasedCourses,
  addToCart,
  removeFromCart,
};
