const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// POST /instructor/course
const addNewCourse = async (req, res) => {
  try {
    const courseData = req.body;
    const instructor = req.user;
    console.log(instructor)

    const saveCourse = await prisma.course.create({
      data: {
        id: courseData.id || require('crypto').randomUUID(),
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
  try {
    const coursesList = await prisma.course.findMany();
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
    if (e.code === 'P2025') {
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
