import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, StarHalf, StarOff, Heart } from "lucide-react";
import { StudentContext } from "@/context/student-context";
import { getCategoryColor, getLevelColor } from "@/config";

function StudentFavoriteCoursesPage() {
  const navigate = useNavigate();
  const { studentFavoriteCoursesList, loadingState } = useContext(StudentContext);

  const renderStars = (rating) => {
    const stars = [];
    const full = Math.floor(rating);
    const half = rating - full >= 0.5;
    const empty = 5 - full - (half ? 1 : 0);

    for (let i = 0; i < full; i++) stars.push(<Star key={`f-${i}`} className="w-4 h-4 text-yellow-400 fill-yellow-400" />);
    if (half) stars.push(<StarHalf key="h" className="w-4 h-4 text-yellow-400 fill-yellow-400" />);
    for (let i = 0; i < empty; i++) stars.push(<StarOff key={`e-${i}`} className="w-4 h-4 text-yellow-400" />);
    return stars;
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6">Khóa học yêu thích</h1>
      <div className="space-y-4">
        {loadingState ? (
          <Skeleton className="h-48 w-full" />
        ) : studentFavoriteCoursesList.length > 0 ? (
          studentFavoriteCoursesList.map((course) => (
            <Card key={course.id} onClick={() => navigate(`/courses/${course.id}`)} className="cursor-pointer">
              <CardContent className="flex gap-4 p-4 items-center">
                <div className="w-48 h-32 flex-shrink-0">
                  <img src={course.image} alt={course.title} className="w-full h-full object-cover rounded" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-xl mb-2">{course.title}</CardTitle>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-xs border px-2 py-1 rounded-full ${getCategoryColor(course.category)}`}>
                      {course.category}
                    </span>
                    <p className="text-sm text-gray-600">Created by <span className="font-semibold">{course.instructorName}</span></p>
                  </div>
                  <p className="text-sm mt-2 mb-1">
                    {course.lectures?.length || 0} Lectures -{" "}
                    <span className={getLevelColor(course.level)}>
                      {course.level?.charAt(0).toUpperCase() + course.level?.slice(1)} Level
                    </span>
                  </p>
                  <div className="flex items-center gap-1 mb-2">
                    <span className="text-sm font-medium text-gray-800">{course.averageRating || 0}</span>
                    {renderStars(course.averageRating || 0)}
                    <span className="text-sm text-gray-500 ml-1">({course.ratingCount || 0})</span>
                  </div>
                                    <div className="flex items-center gap-2">
                    <p className="text-lg font-bold text-red-600">
                      ${course?.pricingAfterDiscount}
                    </p>
                    {course.discountPct > 0 && (
                      <>
                        <p className="text-sm line-through text-gray-500">
                          ${course?.pricing}
                        </p>
                        <p className="text-sm text-green-600 font-semibold">
                          -{course.discountPct}%
                        </p>
                      </>
                    )}
                  </div>
                  <Button onClick={(e) => { e.stopPropagation(); navigate(`/course/details/${course.id}`); }} className="mt-4 w-full">
                    <Heart className="mr-2 w-4 h-4" />
                    Xem chi tiết
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-lg font-semibold">Không có khóa học yêu thích.</p>
        )}
      </div>
    </div>
  );
}

export default StudentFavoriteCoursesPage;
