const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// ✅ Đánh dấu bài giảng là đã xem
const markCurrentLectureAsViewed = async (req, res) => {
  try {
    const { userId, courseId, lectureId } = req.body;

    let progress = await prisma.courseProgress.findUnique({
      where: {
        user_id_course_id: {
          user_id: userId,
          course_id: courseId,
        },
      },
      include: { lectures: true },
    });

    if (!progress) {
      progress = await prisma.courseProgress.create({
        data: {
          id: require("crypto").randomUUID(),
          user_id: userId,
          course_id: courseId,
          lectures: {
            create: {
              lecture_id: lectureId,
              viewed: true,
              date_viewed: new Date(),
            },
          },
        },
        include: { lectures: true },
      });
    } else {
      const lecture = progress.lectures.find(l => l.lecture_id === lectureId);

      if (lecture) {
        await prisma.lectureProgress.update({
          where: { id: lecture.id },
          data: {
            viewed: true,
            date_viewed: new Date(),
          },
        });
      } else {
        await prisma.lectureProgress.create({
          data: {
            course_progress_id: progress.id,
            lecture_id: lectureId,
            viewed: true,
            date_viewed: new Date(),
          },
        });
      }
    }

    // Kiểm tra đã xem hết chưa
    const totalLectures = await prisma.courseLecture.count({
      where: { course_id: courseId },
    });

    const viewedLectures = await prisma.lectureProgress.findMany({
      where: {
        course_progress_id: progress.id,
        viewed: true,
      },
    });

    if (viewedLectures.length === totalLectures) {
      await prisma.courseProgress.update({
        where: { id: progress.id },
        data: {
          completed: true,
          completion_date: new Date(),
        },
      });
    }

    res.status(200).json({
      success: true,
      message: "Lecture marked as viewed",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Some error occurred" });
  }
};

// ✅ Lấy tiến độ khóa học
const getCurrentCourseProgress = async (req, res) => {
  try {
    const { userId, courseId } = req.params;

    const purchased = await prisma.studentCourse.findFirst({
      where: { user_id: userId, course_id: courseId },
    });

    if (!purchased) {
      return res.status(200).json({
        success: true,
        data: { isPurchased: false },
        message: "You need to purchase this course to access it.",
      });
    }

    const progress = await prisma.courseProgress.findUnique({
      where: {
        user_id_course_id: {
          user_id: userId,
          course_id: courseId,
        },
      },
      include: { lectures: true },
    });

    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!progress) {
      return res.status(200).json({
        success: true,
        message: "No progress found, you can start watching the course",
        data: {
          courseDetails: course,
          progress: [],
          isPurchased: true,
        },
      });
    }

    res.status(200).json({
      success: true,
      data: {
        courseDetails: course,
        progress: progress.lectures,
        completed: progress.completed,
        completionDate: progress.completion_date,
        isPurchased: true,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Some error occurred" });
  }
};

// ✅ Reset tiến độ khóa học
const resetCurrentCourseProgress = async (req, res) => {
  try {
    const { userId, courseId } = req.body;

    const progress = await prisma.courseProgress.findUnique({
      where: {
        user_id_course_id: {
          user_id: userId,
          course_id: courseId,
        },
      },
    });

    if (!progress) {
      return res.status(404).json({
        success: false,
        message: "Progress not found!",
      });
    }

    await prisma.lectureProgress.deleteMany({
      where: { course_progress_id: progress.id },
    });

    await prisma.courseProgress.update({
      where: { id: progress.id },
      data: {
        completed: false,
        completion_date: null,
      },
    });

    res.status(200).json({
      success: true,
      message: "Course progress has been reset",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Some error occurred" });
  }
};

module.exports = {
  markCurrentLectureAsViewed,
  getCurrentCourseProgress,
  resetCurrentCourseProgress,
};
