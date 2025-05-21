const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getCoursesByStudentId = async (req, res) => {
  try {
    const { studentId } = req.params;
    const {
      category = "",
      level = "",
      search = "",
      sortBy = "price-lowtohigh",
      page = 1,
      limit = 6,
    } = req.query;

    if (!studentId) {
      return res.status(400).json({
        success: false,
        message: "Missing studentId",
      });
    }

    const filters = {
      user_id: studentId,
      course: {
        AND: [],
      },
    };

    if (category) {
      filters.course.AND.push({ category: { in: category.split(",") } });
    }

    if (level) {
      filters.course.AND.push({ level: { in: level.split(",") } });
    }

    if (search) {
      filters.course.AND.push({
        OR: [
          { title: { contains: search } },
          { subtitle: { contains: search } },
          { description: { contains: search } },
        ],
      });
    }

    const allStudentCourses = await prisma.studentCourse.findMany({
      where: filters,
      include: {
        course: {
          include: {
            discount: true,
            ratings: true,
            lectures: true,
            instructor: {
              select: {
                user_name: true,
              },
            },
          },
        },
      },
    });

    // Sort thủ công
    let sorted = [...allStudentCourses];

    switch (sortBy) {
      case "price-lowtohigh":
        sorted.sort((a, b) => a.course.pricing - b.course.pricing);
        break;
      case "price-hightolow":
        sorted.sort((a, b) => b.course.pricing - a.course.pricing);
        break;
      case "title-atoz":
        sorted.sort((a, b) =>
          a.course.title.localeCompare(b.course.title)
        );
        break;
      case "title-ztoa":
        sorted.sort((a, b) =>
          b.course.title.localeCompare(a.course.title)
        );
        break;
      case "latest":
        sorted.sort(
          (a, b) =>
            new Date(b.date_of_purchase) - new Date(a.date_of_purchase)
        );
        break;
      default:
        break;
    }

    const pageNumber = parseInt(page);
    const pageSize = parseInt(limit);
    const paginated = sorted.slice(
      (pageNumber - 1) * pageSize,
      pageNumber * pageSize
    );

    const result = paginated.map(({ course }) => {
      const discount_pct = course.discount?.discount_pct || 0;
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
        id: course.id,
        title: course.title,
        subtitle: course.subtitle,
        category: course.category,
        level: course.level,
        primary_language: course.primary_language,
        description: course.description,
        image: course.image,
        pricing: course.pricing,
        pricing_after_discount: pricing_after_discount,
        discount_pct: discount_pct,
        rating_count: rating_count,
        average_rating: average_rating,
        lectures: course.lectures,
        instructor_name: course.instructor?.user_name || "Unknown",
        created_at: course.created_at,
      };
    });

    res.status(200).json({
      success: true,
      data: {
        courses: result,
        totalItems: sorted.length,
      },
    });
  } catch (error) {
    console.error("Get courses by studentId error:", error);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

module.exports = { getCoursesByStudentId };
