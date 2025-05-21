import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { getLevelColor } from "@/config";

function CourseSlider({ listOfCourses = [], renderStars, handleCourseNavigate }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const [sliderRef, instanceRef] = useKeenSlider({
    slides: {
      perView: 1,
      spacing: 24,
    },
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
  });

  const prev = () => instanceRef.current?.prev();
  const next = () => instanceRef.current?.next();

  // Nhóm 3 course mỗi slide
  const groupCourses = [];
  for (let i = 0; i < listOfCourses.length; i += 3) {
    groupCourses.push(listOfCourses.slice(i, i + 3));
  }

  // Lấy tổng số slide (pagination dots)
  const totalSlides = groupCourses.length;

  return (
    <div className="relative">
      <h3 className="text-xl font-semibold mb-4">List Courses</h3>

      <div className="keen-slider" ref={sliderRef}>
        {groupCourses.map((group, index) => (
          <div className="keen-slider__slide" key={index}>
            <div className="space-y-4">
              {group.map((courseItem) => (
                <div
                  key={courseItem.id}
                  onClick={() => handleCourseNavigate(courseItem.id)}
                  className="cursor-pointer border rounded-xl shadow-sm hover:shadow-md transition"
                >
                  <div className="flex gap-4 p-4 items-center">
                    <div className="w-48 h-32 flex-shrink-0">
                      <img
                        src={courseItem.image}
                        className="w-full h-full object-cover rounded"
                        alt={courseItem.title}
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-semibold mb-1">{courseItem.title}</h4>
                      <p className="text-sm text-gray-600">
                        {courseItem.lectures?.length || 0}{" "}
                        {courseItem.lectures?.length <= 1 ? "Lecture" : "Lectures"} -{" "}
                        <span className={getLevelColor(courseItem.level)}>
                          {courseItem.level}
                        </span>
                      </p>
                      <div className="flex items-center gap-2 text-sm mt-2">
                        <span className="font-semibold text-red-600">
                          ${courseItem.pricing_after_discount}
                        </span>
                        {courseItem.discount_pct > 0 && (
                          <>
                            <span className="line-through text-gray-400 text-xs">
                              ${courseItem.pricing}
                            </span>
                            <span className="text-green-600 font-medium text-xs">
                              -{courseItem.discount_pct}%
                            </span>
                          </>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-yellow-500 text-sm mt-1">
                        {renderStars(courseItem.average_rating || 0)}
                        <span className="text-gray-500 text-xs">
                          ({courseItem.rating_count || 0})
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Mũi tên điều hướng */}
      <button
        onClick={prev}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow hover:bg-gray-100 z-10"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={next}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow hover:bg-gray-100 z-10"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Pagination dots */}
      <div className="flex justify-center mt-4 space-x-2">
        {Array.from({ length: totalSlides }).map((_, idx) => (
          <button
            key={idx}
            onClick={() => instanceRef.current?.moveToIdx(idx)}
            className={`w-3 h-3 rounded-full transition-colors ${
              currentSlide === idx ? "bg-blue-600" : "bg-gray-300"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default CourseSlider;
