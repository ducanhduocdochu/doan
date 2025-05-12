const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getCoursesByStudentId = async (req, res) => {
  try {
    const { studentId } = req.params;

    const studentBoughtCourses = await prisma.studentCourse.findMany({
      where: {
        user_id: studentId,
      },
      include: {
        course: true, // Lấy chi tiết khóa học nếu cần
      },
    });

    res.status(200).json({
      success: true,
      data: studentBoughtCourses,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

module.exports = { getCoursesByStudentId };
