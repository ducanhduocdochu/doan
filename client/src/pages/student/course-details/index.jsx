import LecturesGrouped from "@/components/student-view/lecture-group";
import ReviewsSection from "@/components/student-view/review";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import VideoPlayer from "@/components/video-player";
import {
  courseCategories,
  getCategoryColor,
  getLevelColor,
  toSlug,
} from "@/config";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import { toast } from "@/hooks/use-toast";
import {
  addCourseToCartService,
  addFavoriteCourseService,
  checkCoursePurchaseInfoService,
  fetchStudentViewCourseCartListService,
  createPaymentService,
  fetchStudentViewCourseDetailsService,
  fetchStudentViewCourseListService,
  removeFavoriteCourseService,
  fetchStudentViewCourseFavoriteListService,
} from "@/services";
import {
  BookOpen,
  CheckCircle,
  Globe,
  Heart,
  Lock,
  MessageCircle,
  PlayCircle,
  Star,
  StarHalf,
  StarOff,
  Users,
} from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

function StudentViewCourseDetailsPage() {
  const {
    studentViewCourseDetails,
    setStudentViewCourseDetails,
    currentCourseDetailsId,
    setCurrentCourseDetailsId,
    loadingState,
    setLoadingState,
    setStudentCartCoursesList,
    setStudentViewCoursesList,
    studentViewCoursesList,
    setStudentFavoriteCoursesList
  } = useContext(StudentContext);
  const { auth } = useContext(AuthContext);

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

  useEffect(() => {
    async function fetchAllStudentViewCourses() {
      const response = await fetchStudentViewCourseListService();
      if (response?.success) setStudentViewCoursesList(response?.data?.courses);
    }
    fetchAllStudentViewCourses();
  }, []);

  const [showAllObjectives, setShowAllObjectives] = useState(false);
  const objectivesArray = studentViewCourseDetails?.objectives
    ? studentViewCourseDetails.objectives.split(",")
    : [];

  const maxShow = 6;
  const isLongObj = objectivesArray.length > maxShow;
  const displayedObjectives = showAllObjectives
    ? objectivesArray
    : objectivesArray.slice(0, maxShow);

  const [displayCurrentVideoFreePreview, setDisplayCurrentVideoFreePreview] =
    useState(null);
  const [showFreePreviewDialog, setShowFreePreviewDialog] = useState(false);
  const [approvalUrl, setApprovalUrl] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  const [expanded, setExpanded] = useState(false);
  const limit = 200;

  const description = studentViewCourseDetails?.description || "";
  const isLong = description.length > limit;

  const displayedText = expanded
    ? description
    : description.slice(0, limit) + (isLong ? "..." : "");

  async function fetchStudentViewCourseDetails() {
    // const checkCoursePurchaseInfoResponse =
    //   await checkCoursePurchaseInfoService(
    //     currentCourseDetailsId,
    //     auth?.user._id
    //   );

    // if (
    //   checkCoursePurchaseInfoResponse?.success &&
    //   checkCoursePurchaseInfoResponse?.data
    // ) {
    //   navigate(`/course-progress/${currentCourseDetailsId}`);
    //   return;
    // }
    const response = await fetchStudentViewCourseDetailsService(
      currentCourseDetailsId
    );

    if (response?.success) {
      setStudentViewCourseDetails(response?.data);
      setLoadingState(false);
    } else {
      setStudentViewCourseDetails(null);
      setLoadingState(false);
    }
  }

  function handleSetFreePreview(getCurrentVideoInfo) {
    setDisplayCurrentVideoFreePreview(getCurrentVideoInfo?.video_url);
    setShowFreePreviewDialog(true);
  }
  async function handleCreatePayment() {
    const paymentPayload = {
      userId: auth?.user?._id,
      userName: auth?.user?.userName,
      userEmail: auth?.user?.userEmail,
      orderStatus: "pending",
      paymentMethod: "paypal",
      paymentStatus: "initiated",
      orderDate: new Date(),
      paymentId: "",
      payerId: "",
      instructorId: studentViewCourseDetails?.instructor_id,
      instructorName: studentViewCourseDetails?.instructor_name,
      courseImage: studentViewCourseDetails?.image,
      courseTitle: studentViewCourseDetails?.title,
      courseId: studentViewCourseDetails?.id,
      coursePricing: studentViewCourseDetails?.pricing,
    };

    console.log(paymentPayload, "paymentPayload");
    const response = await createPaymentService(paymentPayload);

    if (response.success) {
      sessionStorage.setItem(
        "currentOrderId",
        JSON.stringify(response?.data?.orderId)
      );
      setApprovalUrl(response?.data?.approveUrl);
    }
  }

  useEffect(() => {
    if (displayCurrentVideoFreePreview !== null) setShowFreePreviewDialog(true);
  }, [displayCurrentVideoFreePreview]);

  useEffect(() => {
    if (currentCourseDetailsId !== null) fetchStudentViewCourseDetails();
  }, [currentCourseDetailsId]);

  useEffect(() => {
    if (id) setCurrentCourseDetailsId(id);
  }, [id]);

  useEffect(() => {
    if (!location.pathname.includes("course/details"))
      setStudentViewCourseDetails(null),
        setCurrentCourseDetailsId(null),
        setCoursePurchaseId(null);
  }, [location.pathname]);

  if (loadingState) return <Skeleton />;

  if (approvalUrl !== "") {
    window.location.href = approvalUrl;
  }

  const getIndexOfFreePreviewUrl =
    studentViewCourseDetails !== null
      ? studentViewCourseDetails?.lectures?.findIndex(
          (item) => item.free_preview
        )
      : -1;

  return (
    <div className=" mx-auto p-4">
      <div className="bg-gray-900 text-white p-8 rounded-t-lg">
        <h1 className="text-3xl font-bold mb-4">
          {studentViewCourseDetails?.title}
        </h1>
        <p className="text-xl mb-4">{studentViewCourseDetails?.subtitle}</p>
        <div className="flex items-center space-x-4 mt-2 text-sm flex-wrap">
          <span>Created By {studentViewCourseDetails?.instructor_name}</span>
          <span>
            Created On {studentViewCourseDetails?.created_at.split("T")[0]}
          </span>
          <span className="flex items-center">
            <Globe className="mr-1 h-4 w-4" />
            {studentViewCourseDetails?.primaryLanguage}
          </span>
          <span>
            {/* {studentViewCourseDetails?.students.length}{" "}
          {studentViewCourseDetails?.students.length <= 1
            ? "Student"
            : "Students"} */}
            0 students
          </span>
        </div>
        <div className="flex items-center space-x-4 mt-2 text-sm flex-wrap">
          <span className="flex items-center space-x-1">
            {studentViewCourseDetails?.averageRating || 0}
            {renderStars(studentViewCourseDetails?.averageRating || 0)}
            <span className="text-gray-400 ml-1">
              ({studentViewCourseDetails?.ratingCount || 0})
            </span>
          </span>

          <div className="flex flex-wrap gap-2">
            <span
              className={`text-xs border px-2 py-1 rounded-full cursor-pointer ${getCategoryColor(
                studentViewCourseDetails?.category
              )}`}
            >
              {studentViewCourseDetails?.category
                ?.split("-")
                .map((word) => word[0].toUpperCase() + word.slice(1))
                .join(" ")}
            </span>
          </div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-8 mt-8">
        <main className="flex-grow">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>What you'll learn</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {displayedObjectives.map((objective, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="mr-2 h-5 w-5 text-green-500 flex-shrink-0" />
                    <span>{objective}</span>
                  </li>
                ))}
              </ul>
              {isLongObj && (
                <button
                  className="mt-2 text-blue-600 hover:underline focus:outline-none"
                  onClick={() => setShowAllObjectives(!showAllObjectives)}
                >
                  {showAllObjectives ? "Show less" : "Load more"}
                </button>
              )}
            </CardContent>
          </Card>
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Course Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{displayedText}</p>
              {isLong && (
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="mt-2 text-blue-600 hover:underline focus:outline-none"
                >
                  {expanded ? "Show less" : "Load more"}
                </button>
              )}
            </CardContent>
          </Card>
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Course Lectures</CardTitle>
            </CardHeader>
            <LecturesGrouped
              lectures={studentViewCourseDetails?.lectures || []}
              handleSetFreePreview={handleSetFreePreview}
            />
          </Card>
        </main>
        <aside className="w-full md:w-[500px]">
          <Card className="sticky top-4">
            <CardContent className="p-6">
              <div className="aspect-video mb-4 rounded-lg flex items-center justify-center">
                <VideoPlayer
                  url={
                    getIndexOfFreePreviewUrl !== -1
                      ? studentViewCourseDetails?.lectures[
                          getIndexOfFreePreviewUrl
                        ].video_url
                      : ""
                  }
                  width="450px"
                  height="200px"
                />
              </div>
              <div className="mt-4 mb-4 text-sm text-gray-700 space-y-3">
                <p className="font-bold text-base mb-2">
                  This course includes:
                </p>
                <ul className="list-none space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-gray-700 flex-shrink-0" />
                    <span>5 giờ video theo yêu cầu</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-gray-700 flex-shrink-0" />
                    <span>2 bài viết</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-gray-700 flex-shrink-0" />
                    <span>8 tài nguyên có thể tải xuống</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-gray-700 flex-shrink-0" />
                    <span>Truy cập trên thiết bị di động và TV</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-gray-700 flex-shrink-0" />
                    <span>Quyền truy cập đầy đủ suốt đời</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-gray-700 flex-shrink-0" />
                    <span>Giấy chứng nhận hoàn thành</span>
                  </li>
                </ul>
              </div>
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-1 mb-2">
                    {studentViewCourseDetails?.averageRating || 0}
                    {renderStars(studentViewCourseDetails?.averageRating || 0)}
                    <span className="text-sm text-gray-500 ml-1">
                      ({studentViewCourseDetails?.ratingCount || 0})
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-3xl font-bold text-red-600">
                      ${studentViewCourseDetails?.pricingAfterDiscount}
                    </span>
                    {studentViewCourseDetails?.discountPct > 0 && (
                      <>
                        <span className="text-lg line-through text-gray-500">
                          ${studentViewCourseDetails?.pricing}
                        </span>
                        <span className="text-md text-green-600 font-semibold">
                          -{studentViewCourseDetails?.discountPct}%
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={async (e) => {
                    e.stopPropagation();
                    const courseId = studentViewCourseDetails?.id;

                    if (studentViewCourseDetails?.isFavorite) {
                      const res = await removeFavoriteCourseService(courseId);
                      if (res?.success) {
                        setStudentViewCourseDetails((prev) => ({
                          ...prev,
                          isFavorite: false,
                        }));
                        toast({
                          title: "Removed from Favorites",
                          description:
                            "Removed from your favorites successfully.",
                          variant: "default",
                        });

                        const response = await fetchStudentViewCourseFavoriteListService();
                              if (response?.success) {
                                setStudentFavoriteCoursesList(response?.data || []);
                                setLoadingState(false);
                              }
                      }
                    } else {
                      const res = await addFavoriteCourseService(courseId);
                      if (res?.success) {
                        setStudentViewCourseDetails((prev) => ({
                          ...prev,
                          isFavorite: true,
                        }));
                        toast({
                          title: "Added to Favorites",
                          description: "Added to your favorites successfully.",
                          variant: "default",
                        });

                        const response = await fetchStudentViewCourseFavoriteListService();
      if (response?.success) {
        setStudentFavoriteCoursesList(response?.data || []);
        setLoadingState(false);
      }
                      }
                    }
                  }}
                >
                  {studentViewCourseDetails?.isFavorite ? (
                    <Heart className="w-5 h-5 text-red-500 fill-red-500 cursor-pointer" />
                  ) : (
                    <Heart className="w-5 h-5 text-red-500 cursor-pointer" />
                  )}
                </Button>
              </div>

              <Button onClick={handleCreatePayment} className="w-full">
                Buy Now
              </Button>
              <Button
                onClick={async () => {
                  const res = await addCourseToCartService(
                    studentViewCourseDetails?.id
                  );
                  if (res?.success) {
                    toast({
                      title: "Added to Cart",
                      description: "Course added to your cart successfully.",
                      variant: "default",
                    });

                    setStudentViewCourseDetails((prev) => ({
                      ...prev,
                      isInCart: true,
                    }));

                    const res = await fetchStudentViewCourseCartListService();
                  if (res.success) {
                    console.log("res", res?.data.courses);
                    setStudentCartCoursesList(res?.data.courses || []);
                  }
                }}}
                disabled={studentViewCourseDetails?.isInCart}
                className="w-full mt-2"
                variant={
                  studentViewCourseDetails?.isInCart ? "secondary" : "outline"
                }
              >
                {studentViewCourseDetails?.isInCart
                  ? "Đã thêm vào giỏ hàng"
                  : "Thêm vào giỏ hàng"}
              </Button>
            </CardContent>
          </Card>
        </aside>
      </div>
      <CardContent>
        <div className="text-gray-700 space-y-6">
          <section>
            <h3 className="text-lg font-semibold mb-2">Yêu cầu</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>
                Có kiến thức cơ bản về IT & lập trình nói chung tuy nhiên không
                bắt buộc.
              </li>
              <li>
                Bạn không cần phải biết code vì tất cả code mẫu được cung cấp
                bởi giảng viên.
              </li>
              <li>
                Những bạn có kiến thức cơ bản về Server như Linux, Windows có
                khả năng sẽ học nhanh hơn.
              </li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-2">Mô tả</h3>
            <p className="whitespace-pre-line">
              {`Chào mừng đến với khoá học AWS Cloud for beginner - Tiếng Việt!

Khoá học này tập trung vào những kiến thưc cơ bản liên quan tới Cloud Computing và AWS, lịch sử hình thành và phát triển của AWS, các dịch vụ cơ bản trên AWS, đặc trưng và usecase áp dụng các dịch vụ trong thực tế.

Khoá học thiết kế đan xen giữa lý thuyết và thực hành, giúp các bạn không chỉ nắm rõ các dịch vụ của AWS mà còn tự tin thao tác, có thể vận dụng trong dự án thực tế cũng như phát triển sản phẩm của riêng bạn.

Sau khoá học này bạn sẽ tự tin làm việc với các dịch vụ:
- Networking (VPC, Subnet, Security Group, Route53, CloudFront,...)
- Computing (EC2, Lambda, LoadBalancer)
- Database (SQL and No SQL)
- Storage (S3, EBS, EFS)
- Security (Identity & Access Manager, Security concepts, Encryption, Application Protection)
- Monitoring and Auditing (CloudWatch, CloudTrail)
- Container (Docker), ECR, ECS
- Messaging Services (SNS, SQS, SES)
- Infra as Code (basic)
- Backup and Recovery

Đặc biệt, bạn còn được hướng dẫn cách thiết kế & triển khai hệ thống theo các Best Practice của AWS, với bài tập lớn cuối khoá.`}
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-2">Đối tượng</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>
                Sinh viên, Lập trình viên, Kỹ sư hệ thống muốn tìm hiểu Cloud &
                AWS.
              </li>
              <li>
                Những người muốn nâng cao kỹ năng và tìm kiếm cơ hội việc làm
                mới.
              </li>
              <li>
                Người đã có kiến thức cơ bản về Cloud & AWS muốn đào sâu kỹ
                thuật và thực hành.
              </li>
              <li>
                Người đã học qua các khoá lý thuyết (vd: SAA) muốn thực hành
                nhiều hơn với AWS.
              </li>
            </ul>
          </section>
        </div>
      </CardContent>
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
              // onClick={() => handleNavigateToCoursesPage(categoryItem.id)}
            >
              {categoryItem.label}
            </Button>
          ))}
        </div>
      </section>
      <Dialog
        open={showFreePreviewDialog}
        onOpenChange={() => {
          setShowFreePreviewDialog(false);
          setDisplayCurrentVideoFreePreview(null);
        }}
      >
        <DialogContent className="w-[800px]">
          <DialogHeader>
            <DialogTitle>Course Preview</DialogTitle>
          </DialogHeader>
          <div className="aspect-video rounded-lg flex items-center justify-center">
            <VideoPlayer
              url={displayCurrentVideoFreePreview}
              width="450px"
              height="200px"
            />
          </div>
          <div className="mt-4">
            <LecturesGrouped
              lectures={studentViewCourseDetails?.lectures || []}
              handleSetFreePreview={handleSetFreePreview}
              isPreviewDialog={true}
            />
          </div>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <ReviewsSection
        studentViewCourseDetails={studentViewCourseDetails}
        renderStars={renderStars}
      />
      <div className="mt-12 bg-gray-900 text-white p-8 rounded-lg flex flex-col md:flex-row md:items-center md:gap-6">
        <img
          src={
            studentViewCourseDetails?.instructor.user?.avatarUrl ||
            "https://cdn-icons-png.flaticon.com/512/149/149071.png"
          }
          alt="Ảnh giảng viên"
          className="w-24 h-24 rounded-full object-cover border-2 border-white"
          onError={(e) => {
            e.currentTarget.onerror = null; // tránh lặp lại khi lỗi ảnh
            e.currentTarget.src =
              "https://cdn-icons-png.flaticon.com/512/149/149071.png";
          }}
        />

        <div className="mt-4 md:mt-0">
          <Button className="pl-0">
            <h3 className="text-2xl font-semibold">
              {studentViewCourseDetails?.instructor.user_name ||
                "Giảng viên ẩn danh"}
            </h3>
          </Button>

          {studentViewCourseDetails?.instructor?.user_email && (
            <p>
              <span className="font-semibold">Gmail: </span>
              <a
                href={`mailto:${studentViewCourseDetails.instructor.user_email}`}
                className="text-blue-400 hover:underline"
              >
                {
                  studentViewCourseDetails.instructor.instructor_profile
                    .paypal_email
                }
              </a>
            </p>
          )}

          <div className="flex items-center gap-1 mt-2">
            <Star className="w-5 h-5 text-yellow-400" />
            <span className="ml-4">Xếp hạng trung bình: </span>
            <span>
              {studentViewCourseDetails?.averageRating?.toFixed(1) || "0.0"}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <MessageCircle className="w-5 h-5 text-blue-400" />
            <span className="ml-4">Số đánh giá: </span>
            <span>{studentViewCourseDetails?.ratingCount || 0}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-5 h-5 text-green-400" />
            <span className="ml-4">Số học viên: </span>
            <span>{studentViewCourseDetails?.students?.length || 0}</span>
          </div>
          <div className="flex items-center gap-1">
            <BookOpen className="w-5 h-5 text-purple-400" />
            <span className="ml-4">Số khóa học: </span>
            <span>
              {studentViewCourseDetails?.instructor?.courses_created?.length ||
                0}
            </span>
          </div>
        </div>
      </div>
      <p className="mb-4 mt-4 whitespace-pre-wrap leading-relaxed w-full">
        {studentViewCourseDetails?.instructor.instructor_profile?.bio ||
          "Không có tiểu sử"}
      </p>
      <Button
        onClick={() => setShowDialog(true)}
        variant="outline"
        className="mt-4 w-full"
      >
        Hiển thị thêm
      </Button>

      <section className="py-12 px-4 lg:px-8">
        <h2 className="text-2xl font-bold mb-6">Khóa học cùng tác giả</h2>
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
      <Button variant="outline" className="w-full">
        Xem thêm khóa học cùng tác giả
      </Button>

      <section className="py-12 px-4 lg:px-8">
        <h2 className="text-2xl font-bold mb-6">Gợi ý các khóa học</h2>
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

      <Button variant="outline" className="w-full">
        Xem thêm khóa học gợi ý
      </Button>
    </div>
  );
}

export default StudentViewCourseDetailsPage;
