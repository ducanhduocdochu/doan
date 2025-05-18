import {
  courseCategories,
  getCategoryColor,
  getLevelColor,
  toSlug,
} from "@/config";
import banner from "../../../../public/banner-img.png";
import { Button } from "@/components/ui/button";
import { useContext, useEffect } from "react";
import { StudentContext } from "@/context/student-context";
import {
  checkCoursePurchaseInfoService,
  fetchStudentViewCourseListService,
} from "@/services";
import { AuthContext } from "@/context/auth-context";
import { useNavigate } from "react-router-dom";
import { Star, StarHalf, StarOff } from "lucide-react";

function StudentHomePage() {
  const { studentViewCoursesList, setStudentViewCoursesList } =
    useContext(StudentContext);
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();

  function handleNavigateToCoursesPage(getCurrentId) {
    console.log(getCurrentId);
    sessionStorage.removeItem("filters");
    const currentFilter = {
      category: [getCurrentId],
    };

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));

    navigate("/courses");
  }

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating - fullStars >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star
          key={`full-${i}`}
          className="w-4 h-4 text-yellow-400 fill-yellow-400"
        />
      );
    }
    if (hasHalfStar) {
      stars.push(
        <StarHalf
          key="half"
          className="w-4 h-4 text-yellow-400 fill-yellow-400"
        />
      );
    }
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <StarOff key={`empty-${i}`} className="w-4 h-4 text-yellow-400" />
      );
    }

    return stars;
  };

  async function fetchAllStudentViewCourses() {
    const response = await fetchStudentViewCourseListService();
    console.log("response", response.data.courses);
    if (response?.success) setStudentViewCoursesList(response?.data?.courses);
  }

  async function handleCourseNavigate(getCurrentCourseId) {
    const response = await checkCoursePurchaseInfoService(
      getCurrentCourseId,
      auth?.user?._id
    );

    if (response?.success) {
      if (response?.data) {
        navigate(`/course-progress/${getCurrentCourseId}`);
      } else {
        navigate(`/course/details/${getCurrentCourseId}`);
      }
    }
  }

  useEffect(() => {
    fetchAllStudentViewCourses();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <section className="flex flex-col lg:flex-row items-center justify-between py-8 px-4 lg:px-8">
        <div className="lg:w-1/2 lg:pr-12">
          <h1 className="text-4xl font-bold mb-4">Learning thet gets you</h1>
          <p className="text-xl">
            Skills for your present and your future. Get Started with US
          </p>
        </div>
        <div className="lg:w-full mb-8 lg:mb-0">
          <img
            src={banner}
            width={600}
            height={400}
            className="w-full h-auto rounded-lg shadow-lg"
          />
        </div>
      </section>
      <section className="py-8 px-4 lg:px-8 bg-gray-100">
        <h2 className="text-2xl font-bold mb-6">Course Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {courseCategories.map((categoryItem) => (
            <Button
              className={`justify-start ${getCategoryColor(
                toSlug(categoryItem.label)
              )}`}
              variant="outline"
              key={categoryItem.id}
              onClick={() => handleNavigateToCoursesPage(categoryItem.id)}
            >
              {categoryItem.label}
            </Button>
          ))}
        </div>
      </section>
      <section className="py-12 px-4 lg:px-8">
        <h2 className="text-2xl font-bold mb-6">Featured Courses</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {studentViewCoursesList && studentViewCoursesList.length > 0 ? (
            studentViewCoursesList.map((courseItem) => (
              <div
                onClick={() => handleCourseNavigate(courseItem?.id)}
                key={courseItem?.id}
                className="border rounded-lg overflow-hidden shadow cursor-pointer"
              >
                <img
                  src={courseItem?.image || "/default-course.jpg"}
                  width={300}
                  height={150}
                  className="w-full h-40 object-cover"
                  alt={courseItem?.title}
                />
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-1 line-clamp-2">
                    {courseItem?.title}
                  </h3>

                  <p className="text-sm text-gray-600 mb-1">
                    Created by{" "}
                    <span className="font-semibold">
                      {courseItem?.instructorName}
                    </span>
                  </p>

                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span
                      className={`text-xs border px-2 py-1 rounded-full ${getCategoryColor(
                        courseItem?.category
                      )}`}
                    >
                      {courseItem?.category
                        ?.split("-")
                        .map((word) => word[0].toUpperCase() + word.slice(1))
                        .join(" ")}
                    </span>

                    <span className="text-xs text-gray-500">
                      {courseItem?.lectures?.length || 0} lectures
                    </span>

                    <span
                      className={`text-xs ${getLevelColor(courseItem?.level)}`}
                    >
                      {courseItem?.level?.charAt(0).toUpperCase() +
                        courseItem?.level?.slice(1)}{" "}
                      level
                    </span>
                  </div>

                  <div className="flex items-center gap-1 mb-1 text-sm">
                    <span className="font-medium">
                      {courseItem?.averageRating || 0}
                    </span>
                    {renderStars && renderStars(courseItem?.averageRating || 0)}
                    <span className="text-gray-500 ml-1">
                      ({courseItem?.ratingCount || 0})
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-lg font-bold text-red-600">
                      ${courseItem?.pricingAfterDiscount}
                    </span>
                    {courseItem?.discountPct > 0 && (
                      <>
                        <span className="text-sm line-through text-gray-500">
                          ${courseItem?.pricing}
                        </span>
                        <span className="text-sm text-green-600 font-semibold">
                          -{courseItem?.discountPct}%
                        </span>
                      </>
                    )}
                  </div>
                  <div className="mt-4">
                    <Button
                      onClick={() => handleCourseNavigate(courseItem?.id)}
                      className="w-full"
                    >
                      Xem chi tiết →
                    </Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <h1 className="text-2xl font-bold text-gray-600">
              No Courses Found
            </h1>
          )}
        </div>
      </section>
    </div>
  );
}

export default StudentHomePage;
