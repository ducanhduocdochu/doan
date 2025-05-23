import axiosInstance from "@/api/axiosInstance";

export async function registerService(formData) {
  const { data } = await axiosInstance.post("/auth/register", {
    ...formData,
    role: "student",
  });

  return data;
}

export async function registerInstructorService(formData) {
  const { data } = await axiosInstance.post("/auth/register/instructor", {
    ...formData,
    role: "instructor",
  });

  return data;
}

export async function loginService(formData) {
  const { data } = await axiosInstance.post("/auth/login", formData);

  return data;
}

export async function checkAuthService() {
  const { data } = await axiosInstance.get("/auth/check-auth");

  return data;
}

export async function mediaUploadService(formData, onProgressCallback) {

  console.log("mediaUploadService", formData);
  const { data } = await axiosInstance.post("/media/upload", formData, {
    onUploadProgress: (progressEvent) => {
      const percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      );
      onProgressCallback(percentCompleted);
    },
  });

  return data;
}

export async function mediaDeleteService(id) {
  const { data } = await axiosInstance.delete(`/media/delete/${id}`);

  return data;
}

export async function fetchInstructorCourseListService() {
  const { data } = await axiosInstance.get(`/instructor/course/get`);

  return data;
}

export async function addNewCourseService(formData) {
  const { data } = await axiosInstance.post(`/instructor/course/add`, formData);

  return data;
}

export async function fetchInstructorCourseDetailsService(id) {
  const { data } = await axiosInstance.get(
    `/instructor/course/get/details/${id}`
  );

  return data;
}

export async function updateCourseByIdService(id, formData) {
  const { data } = await axiosInstance.put(
    `/instructor/course/update/${id}`,
    formData
  );

  return data;
}

export async function mediaBulkUploadService(formData, onProgressCallback) {
  const { data } = await axiosInstance.post("/media/bulk-upload", formData, {
    onUploadProgress: (progressEvent) => {
      const percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      );
      onProgressCallback(percentCompleted);
    },
  });

  return data;
}

export async function fetchStudentViewCourseListService(query) {
  const { data } = await axiosInstance.get(`/student/course/get?${query}`);
  return data;
}

export async function fetchStudentViewCourseCartListService() {
  const { data } = await axiosInstance.get(`/student/course/cart-courses`);
  return data;
}

export async function fetchStudentViewCourseFavoriteListService() {
  const { data } = await axiosInstance.get(`/student/course/favorite-courses`);
  return data;
}

export async function fetchStudentViewCoursePurchased() {
  const { data } = await axiosInstance.get(`/student/course/purchased`);
  return data;
}

export async function addFavoriteCourseService(idCourse) {
  const { data } = await axiosInstance.post(`/student/course/favorite-course/add/${idCourse}`);
  return data;
}

export async function removeFavoriteCourseService(idCourse) {
  const { data } = await axiosInstance.delete(`/student/course/favorite-course/remove/${idCourse}`);
  return data;
}

export async function fetchStudentViewCourseDetailsService(courseId) {
  const { data } = await axiosInstance.get(
    `/student/course/get/details/${courseId}`
  );

  return data;
}

export async function addCourseToCartService(courseId) {
  const { data } = await axiosInstance.post(
    `/student/course/cart-courses/add/${courseId}`
  );

  return data;
}


export async function removeCourseFromCartService(courseId) {
  const { data } = await axiosInstance.delete(
    `/student/course/cart-courses/remove/${courseId}`
  );

  return data;
}


export async function checkCoursePurchaseInfoService(courseId, studentId) {
  const { data } = await axiosInstance.get(
    `/student/course/purchase-info/${courseId}/${studentId}`
  );

  return data;
}

export async function createPaymentService(formData) {
  const { data } = await axiosInstance.post(`/student/order/create`, formData);

  return data;
}

export async function captureAndFinalizePaymentService(
  paymentId,
  payerId,
  orderId
) {
  const { data } = await axiosInstance.post(`/student/order/capture`, {
    paymentId,
    payerId,
    orderId,
  });

  return data;
}

export async function fetchStudentBoughtCoursesService(studentId, query) {
  const { data } = await axiosInstance.get(
    `/student/courses-bought/get/${studentId}?${query}`
  );

  return data;
}

export async function getCurrentCourseProgressService(userId, courseId) {
  const { data } = await axiosInstance.get(
    `/student/course-progress/get/${userId}/${courseId}`
  );

  return data;
}

export async function getInstructorProfileService(userId) {
  const { data } = await axiosInstance.get(
    `/profile/get-user/${userId}`
  );

  return data;
}

export async function updateInstructorProfileService(updatedData) {
  const { data } = await axiosInstance.put(
    `/profile/update-user`,
    updatedData
  );

  return data;
}

export async function markLectureAsViewedService(userId, courseId, lectureId) {
  const { data } = await axiosInstance.post(
    `/student/course-progress/mark-lecture-viewed`,
    {
      userId,
      courseId,
      lectureId,
    }
  );

  return data;
}

export async function resetCourseProgressService(userId, courseId) {
  const { data } = await axiosInstance.post(
    `/student/course-progress/reset-progress`,
    {
      userId,
      courseId,
    }
  );

  return data;
}
