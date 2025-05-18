import { createContext, useState } from "react";

export const StudentContext = createContext(null);

export default function StudentProvider({ children }) {
  const [studentViewCoursesList, setStudentViewCoursesList] = useState([]);
  const [loadingState, setLoadingState] = useState(true);
  const [studentViewCourseDetails, setStudentViewCourseDetails] =
    useState(null);
  const [currentCourseDetailsId, setCurrentCourseDetailsId] = useState(null);
  const [studentBoughtCoursesList, setStudentBoughtCoursesList] = useState([]);
  const [studentCurrentCourseProgress, setStudentCurrentCourseProgress] =
    useState({});

      // ✅ Thêm danh sách khóa học yêu thích
  const [studentFavoriteCoursesList, setStudentFavoriteCoursesList] =
    useState([]);

  // ✅ Thêm giỏ hàng của học viên
  const [studentCartCoursesList, setStudentCartCoursesList] = useState([]);

  return (
    <StudentContext.Provider
      value={{
        studentViewCoursesList,
        setStudentViewCoursesList,
        studentFavoriteCoursesList,
        setStudentFavoriteCoursesList,
        studentCartCoursesList,
        setStudentCartCoursesList,
        loadingState,
        setLoadingState,
        studentViewCourseDetails,
        setStudentViewCourseDetails,
        currentCourseDetailsId,
        setCurrentCourseDetailsId,
        studentBoughtCoursesList,
        setStudentBoughtCoursesList,
        studentCurrentCourseProgress,
        setStudentCurrentCourseProgress,
      }}
    >
      {children}
    </StudentContext.Provider>
  );
}
