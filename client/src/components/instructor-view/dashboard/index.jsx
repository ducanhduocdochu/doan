import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DollarSign, Users, BookOpen, CheckCircle, Star, Tag } from "lucide-react";
import DashboardCharts from "./chart";

function InstructorDashboard({ listOfCourses }) {
  // Tính toán các dữ liệu tổng quan và chi tiết sử dụng useMemo để tránh tính lại nhiều lần
  const {
    totalCourses,
    publishedCourses,
    totalLectures,
    totalStudents,
    totalRevenue,

    coursePerformance,  // mảng chi tiết theo khóa
    studentProgress,    // tổng học viên hoàn thành
    studentsList,       // danh sách học viên từng khóa
    ratingsSummary,     // tổng quan rating
    activeDiscounts,    // khóa học giảm giá đang hoạt động
  } = useMemo(() => {
    let totalCourses = listOfCourses.length;
    let publishedCourses = 0;
    let totalLectures = 0;
    let totalStudents = 0;
    let totalRevenue = 0;

    let totalCompletedProgress = 0;
    let totalProgressCount = 0;

    const studentsList = [];
    const coursePerformance = [];
    const ratingsSummary = {
      totalRatingCount: 0,
      sumRating: 0,
    };
    const activeDiscounts = [];

    for (const course of listOfCourses) {
      if (course.is_published) publishedCourses++;
      totalLectures += course.lectures?.length || 0;

      // Học viên khóa này
      const studentCount = course.student_courses?.length || 0;
      totalStudents += studentCount;

      // Doanh thu khóa này = tổng paid_amount của học viên trong khóa (giả sử course.student_courses có paid_amount)
      const revenueCourse = (course.student_courses || []).reduce(
        (sum, sc) => sum + Number(sc.paid_amount || 0),
        0
      );
      totalRevenue += revenueCourse;

      // Tỉ lệ hoàn thành khóa học dựa trên course.progresses (CourseProgress)
      const completed = (course.progresses || []).filter(p => p.completed).length;
      const totalProg = (course.progresses || []).length;
      totalCompletedProgress += completed;
      totalProgressCount += totalProg;

      // Rating trung bình từng khóa
      const ratings = course.ratings || [];
      const ratingCount = ratings.length;
      const ratingSum = ratings.reduce((sum, r) => sum + (r.rating || 0), 0);
      const averageRating = ratingCount > 0 ? ratingSum / ratingCount : 0;

      ratingsSummary.totalRatingCount += ratingCount;
      ratingsSummary.sumRating += ratingSum;

      // Thêm dữ liệu hiệu suất từng khóa
      coursePerformance.push({
        courseId: course.id,
        title: course.title,
        revenue: revenueCourse,
        studentCount,
        averageRating: averageRating.toFixed(2),
        ratingCount,
        completionRate: totalProg > 0 ? ((completed / totalProg) * 100).toFixed(1) : "0",
      });

      // Danh sách học viên từng khóa
      for (const student of course.students || []) {
        studentsList.push({
          courseId: course.id,
          courseTitle: course.title,
          studentName: student.student_name,
          studentEmail: student.student_email,
          completedProgress:
            course.progresses?.find(p => p.user_id === student.student_id)?.completed ||
            false,
        });
      }

      // Khuyến mãi đang hoạt động
      if (
        course.discount &&
        course.discount.is_active &&
        new Date() >= new Date(course.discount.start_date) &&
        new Date() <= new Date(course.discount.end_date)
      ) {
        activeDiscounts.push({
          courseId: course.id,
          title: course.title,
          discountPct: course.discount.discount_pct,
          startDate: course.discount.start_date,
          endDate: course.discount.end_date,
        });
      }
    }

    const avgCompletionRate =
      totalProgressCount > 0
        ? ((totalCompletedProgress / totalProgressCount) * 100).toFixed(1)
        : "0";

    const avgRatingAll =
      ratingsSummary.totalRatingCount > 0
        ? (ratingsSummary.sumRating / ratingsSummary.totalRatingCount).toFixed(2)
        : "0";

    return {
      totalCourses,
      publishedCourses,
      totalLectures,
      totalStudents,
      totalRevenue: totalRevenue.toFixed(2),

      coursePerformance,
      studentProgress: {
        completed: totalCompletedProgress,
        total: totalProgressCount,
        avgCompletionRate,
      },
      studentsList,
      ratingsSummary: {
        ...ratingsSummary,
        avgRatingAll,
      },
      activeDiscounts,
    };
  }, [listOfCourses]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Instructor Dashboard</h1>

      {/* 1. Tổng quan khóa học */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Total Courses</CardTitle>
            <BookOpen className="w-5 h-5" />
          </CardHeader>
          <CardContent className="text-2xl font-bold">{totalCourses}</CardContent>
        </Card>

        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Published Courses</CardTitle>
            <BookOpen className="w-5 h-5 text-green-600" />
          </CardHeader>
          <CardContent className="text-2xl font-bold">{publishedCourses}</CardContent>
        </Card>

        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Total Lectures</CardTitle>
            <BookOpen className="w-5 h-5 text-blue-600" />
          </CardHeader>
          <CardContent className="text-2xl font-bold">{totalLectures}</CardContent>
        </Card>

        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Total Students</CardTitle>
            <Users className="w-5 h-5 text-purple-600" />
          </CardHeader>
          <CardContent className="text-2xl font-bold">{totalStudents}</CardContent>
        </Card>

        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Total Revenue</CardTitle>
            <DollarSign className="w-5 h-5 text-red-600" />
          </CardHeader>
          <CardContent className="text-2xl font-bold">${totalRevenue}</CardContent>
        </Card>
      </div>

      {/* 2. Hiệu suất khóa học */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Course Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course Title</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Students</TableHead>
                <TableHead>Avg. Rating</TableHead>
                <TableHead>Completion Rate (%)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {coursePerformance.map((course) => (
                <TableRow key={course.courseId}>
                  <TableCell className="font-medium">{course.title}</TableCell>
                  <TableCell>${course.revenue.toFixed(2)}</TableCell>
                  <TableCell>{course.studentCount}</TableCell>
                  <TableCell>{course.averageRating}</TableCell>
                  <TableCell>{course.completionRate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 3. Tiến độ học tập học viên */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Student Progress</CardTitle>
          <div>
            <p>
              Completed: {studentProgress.completed} / {studentProgress.total} (
              {studentProgress.avgCompletionRate}%)
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course</TableHead>
                <TableHead>Student Name</TableHead>
                <TableHead>Student Email</TableHead>
                <TableHead>Completed</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {studentsList.map((item, idx) => (
                <TableRow key={idx}>
                  <TableCell>{item.courseTitle}</TableCell>
                  <TableCell>{item.studentName}</TableCell>
                  <TableCell>{item.studentEmail}</TableCell>
                  <TableCell>{item.completedProgress ? "Yes" : "No"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 4. Đánh giá & Phản hồi */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Ratings & Feedback</CardTitle>
          <div className="text-lg font-semibold">
            Average Rating: {ratingsSummary.avgRatingAll} (
            {ratingsSummary.totalRatingCount} reviews)
          </div>
        </CardHeader>
        {/* Bạn có thể mở rộng thêm bảng đánh giá, bình luận nếu có dữ liệu */}
      </Card>

      {/* 5. Quản lý khuyến mãi */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Active Discounts</CardTitle>
        </CardHeader>
        <CardContent>
          {activeDiscounts.length === 0 ? (
            <p>No active discounts</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course</TableHead>
                  <TableHead>Discount (%)</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activeDiscounts.map((d, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{d.title}</TableCell>
                    <TableCell>{d.discountPct}%</TableCell>
                    <TableCell>{new Date(d.startDate).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(d.endDate).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <DashboardCharts />
    </div>
  );
}

export default InstructorDashboard;
