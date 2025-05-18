import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight, Star, StarHalf, StarOff, Watch } from "lucide-react";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import { fetchStudentBoughtCoursesService } from "@/services";
import { getCategoryColor, getLevelColor } from "@/config";

function StudentCoursesPage() {
  const { auth } = useContext(AuthContext);
  const {
    studentBoughtCoursesList,
    setStudentBoughtCoursesList,
    loadingState,
    setLoadingState,
  } = useContext(StudentContext);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalCourses, setTotalCourses] = useState(0);
  const pageSize = 6;
  const navigate = useNavigate();

  const renderStars = (rating) => {
    const stars = [];
    const full = Math.floor(rating);
    const hasHalf = rating - full >= 0.5;
    const empty = 5 - full - (hasHalf ? 1 : 0);

    for (let i = 0; i < full; i++) {
      stars.push(<Star key={`f-${i}`} className="w-4 h-4 text-yellow-400 fill-yellow-400" />);
    }
    if (hasHalf) {
      stars.push(<StarHalf key="h" className="w-4 h-4 text-yellow-400 fill-yellow-400" />);
    }
    for (let i = 0; i < empty; i++) {
      stars.push(<StarOff key={`e-${i}`} className="w-4 h-4 text-yellow-400" />);
    }
    return stars;
  };

  const handleCourseNavigate = (id) => {
    navigate(`/course-progress/${id}`);
  };

  useEffect(() => {
    const fetchCourses = async () => {
      setLoadingState(true);
      const query = new URLSearchParams({
        page: currentPage,
        limit: pageSize,
      });

      const response = await fetchStudentBoughtCoursesService(auth?.user?.id, query.toString());
      if (response?.success) {
        setStudentBoughtCoursesList(response.data?.courses || []);
        setTotalCourses(response.data?.totalItems || 0);
        setLoadingState(false);
      }
    };
    fetchCourses();
  }, [auth?.user?.id, currentPage]);

  const totalPages = Math.ceil(totalCourses / pageSize);

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6">Khóa học của tôi</h1>

      <div className="space-y-4">
        {loadingState ? (
          <Skeleton className="h-48 w-full" />
        ) : studentBoughtCoursesList && studentBoughtCoursesList.length > 0 ? (
          studentBoughtCoursesList.map((courseItem) => (
            <Card
              key={courseItem.id}
              onClick={() => handleCourseNavigate(courseItem?.id)}
              className="cursor-pointer"
            >
              <CardContent className="flex gap-4 p-4 items-center">
                <div className="w-48 h-32 flex-shrink-0">
                  <img
                    src={courseItem?.image || "/default-course.jpg"}
                    className="w-full h-full object-cover rounded"
                    alt={courseItem?.title}
                  />
                </div>

                <div className="flex-1">
                  <CardTitle className="text-xl mb-2 line-clamp-2">
                    {courseItem?.title}
                  </CardTitle>

                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-xs border px-2 py-1 rounded-full ${getCategoryColor(
                        courseItem?.category
                      )}`}
                    >
                      {courseItem?.category
                        ?.split("-")
                        .map((w) => w[0].toUpperCase() + w.slice(1))
                        .join(" ")}
                    </span>
                    <p className="text-sm text-gray-600">
                      Created by <span className="font-semibold">{courseItem?.instructorName}</span>
                    </p>
                  </div>

                  <p className="text-sm mt-2 mb-1">
                    {courseItem?.lectures?.length || 0} Lectures -{" "}
                    <span className={getLevelColor(courseItem?.level)}>
                      {courseItem?.level?.charAt(0).toUpperCase() + courseItem?.level?.slice(1)} Level
                    </span>
                  </p>

                  <div className="flex items-center gap-1 mb-2">
                    <span className="text-sm font-medium text-gray-800">
                      {courseItem.averageRating || 0}
                    </span>
                    {renderStars(courseItem.averageRating || 0)}
                    <span className="text-sm text-gray-500 ml-1">
                      ({courseItem.ratingCount || 0})
                    </span>
                  </div>

                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCourseNavigate(courseItem?.id);
                    }}
                    className="mt-4 w-full"
                  >
                    <Watch className="mr-2 w-4 h-4" />
                    Học khóa học
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-lg font-semibold">Không có khóa học phù hợp.</p>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-8 gap-4 items-center">
          <Button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            variant="ghost"
            size="sm"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Trước
          </Button>
          <span className="text-sm">
            Trang {currentPage} / {totalPages}
          </span>
          <Button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            variant="ghost"
            size="sm"
          >
            Sau
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
}

export default StudentCoursesPage;
