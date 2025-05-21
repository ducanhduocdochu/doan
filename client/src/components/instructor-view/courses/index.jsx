import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  courseCurriculumInitialFormData,
  courseLandingInitialFormData,
} from "@/config";
import { InstructorContext } from "@/context/instructor-context";
import { Delete, Edit } from "lucide-react";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

function TextWithPopup({ label, content }) {
  const [open, setOpen] = useState(false);

  if (!content) return <span>-</span>;

  const isLong = content.length > 100;

  return (
    <>
      <span
        title={isLong ? content : undefined}
        className="max-w-[200px] inline-block align-top truncate whitespace-nowrap"
      >
        {isLong ? `${content.slice(0, 100)}...` : content}
      </span>
      {isLong && (
        <>
          <Button
            variant="link"
            size="sm"
            className="ml-1 p-0 underline"
            onClick={() => setOpen(true)}
          >
            Xem thêm
          </Button>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>{label}</DialogTitle>
              </DialogHeader>
              <div className="whitespace-pre-wrap">{content}</div>
            </DialogContent>
          </Dialog>
        </>
      )}
    </>
  );
}

function InstructorCourses({ listOfCourses }) {
  const navigate = useNavigate();
  const {
    setCurrentEditedCourseId,
    setCourseLandingFormData,
    setCourseCurriculumFormData,
  } = useContext(InstructorContext);

  const [page, setPage] = useState(1);
  const itemsPerPage = 6;

  const totalPages = Math.ceil((listOfCourses?.length || 0) / itemsPerPage);

  const currentPageData = listOfCourses?.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const handleEdit = (course) => {
    setCurrentEditedCourseId(course.id);
    setCourseLandingFormData(courseLandingInitialFormData);
    setCourseCurriculumFormData(courseCurriculumInitialFormData);
    navigate(`/instructor/edit-course/${course.id}`);
  };

  const handleDelete = (courseId) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      console.log("Delete course", courseId);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Courses</h1>
      <Card>
        <CardHeader className="flex justify-between flex-row items-center">
          <CardTitle className="text-3xl font-extrabold">All Courses</CardTitle>
          <Button
            onClick={() => {
              setCurrentEditedCourseId(null);
              setCourseLandingFormData(courseLandingInitialFormData);
              setCourseCurriculumFormData(courseCurriculumInitialFormData);
              navigate("/instructor/create-new-course");
            }}
            className="p-6"
          >
            Create New Course
          </Button>
        </CardHeader>
        <CardContent>
          {/* Thanh cuộn ngang bao ngoài */}
          <div
            style={{ overflowX: "auto" }}
            className="max-h-[600px]" // Nếu muốn giới hạn chiều cao và cho phép scroll dọc
          >
            <Table
              className="min-w-[1400px]"
              style={{ tableLayout: "fixed" }} // Cố định chiều rộng cột theo class width bên TableHead
            >
              <TableHeader>
                <TableRow>
                  <TableHead className="w-48 min-w-[180px]">Title</TableHead>
                  <TableHead className="w-32 min-w-[120px]">Category</TableHead>
                  <TableHead className="w-24 min-w-[100px]">Level</TableHead>
                  <TableHead className="w-32 min-w-[100px]">Image</TableHead>

                  <TableHead className="w-32 min-w-[130px]">Language</TableHead>
                  <TableHead className="w-48 min-w-[200px]">Subtitle</TableHead>
                  <TableHead className="w-24 min-w-[80px]">Published</TableHead>
                  <TableHead className="w-32 min-w-[130px]">
                    Date Created
                  </TableHead>
                  <TableHead className="w-24 min-w-[80px]">Discount</TableHead>
                  <TableHead className="w-24 min-w-[80px]">
                    Avg. Rating
                  </TableHead>
                  <TableHead className="w-24 min-w-[120px]">
                    Rating Count
                  </TableHead>
                  <TableHead className="w-24 min-w-[80px]">Students</TableHead>
                  <TableHead className="w-32 min-w-[100px]">Revenue</TableHead>
                  <TableHead className="w-56 min-w-[220px]">
                    Description
                  </TableHead>
                  <TableHead className="w-48 min-w-[200px]">
                    Objectives
                  </TableHead>
                  <TableHead className="w-48 min-w-[200px]">
                    Welcome Message
                  </TableHead>
                  <TableHead className="w-32 min-w-[150px]">
                    Instructor Name
                  </TableHead>
                  <TableHead className="w-56 min-w-[250px]">Bio</TableHead>
                  <TableHead className="w-40 min-w-[180px]">
                    Occupation
                  </TableHead>
                  <TableHead className="w-56 min-w-[250px]">Address</TableHead>
                  <TableHead className="w-48 min-w-[200px]">LinkedIn</TableHead>
                  <TableHead
                    className="text-right w-32 min-w-[120px] sticky right-0 bg-white z-20"
                    style={{ top: 0 }}
                  >
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentPageData && currentPageData.length > 0 ? (
                  currentPageData.map((course) => {
                    const revenue = (
                      (course.student_courses?.length || 0) *
                      parseFloat(
                        course.pricing_after_discount || course.pricing || 0
                      )
                    ).toFixed(2);

                    const instructorProfile =
                      course.instructor?.instructor_profile;

                    return (
                      <TableRow key={course.id}>
                        <TableCell className="font-medium whitespace-nowrap truncate">
                          {course.title}
                        </TableCell>
                        <TableCell className="whitespace-nowrap truncate">
                          {course.category}
                        </TableCell>
                        <TableCell className="whitespace-nowrap truncate">
                          {course.level}
                        </TableCell>
<TableCell className="whitespace-nowrap">
  <ImagePopup imageUrl={course.image} />
</TableCell>



                        <TableCell className="whitespace-nowrap truncate">
                          {course.primary_language}
                        </TableCell>
                        <TableCell
                          className="max-w-[200px] truncate"
                          title={course.subtitle}
                        >
                          {course.subtitle}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {course.is_published ? "Yes" : "No"}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {new Date(course.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {course.discount_pct || 0}%
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {course.average_rating?.toFixed(1) || 0}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {course.rating_count || 0}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {course.student_courses?.length || 0}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          ${revenue}
                        </TableCell>

                        <TableCell>
                          <TextWithPopup
                            label="Description"
                            content={course.description}
                          />
                        </TableCell>
                        <TableCell>
                          <TextWithPopup
                            label="Objectives"
                            content={course.objectives}
                          />
                        </TableCell>
                        <TableCell>
                          <TextWithPopup
                            label="Welcome Message"
                            content={course.welcome_message}
                          />
                        </TableCell>

                        <TableCell className="whitespace-nowrap">
                          {course.instructor?.user_name || "-"}
                        </TableCell>
                        <TableCell>
                          <TextWithPopup
                            label="Bio"
                            content={instructorProfile?.bio}
                          />
                        </TableCell>
                        <TableCell
                          className="whitespace-nowrap truncate"
                          title={instructorProfile?.occupation || ""}
                        >
                          {instructorProfile?.occupation || "-"}
                        </TableCell>
                        <TableCell>
                          <TextWithPopup
                            label="Address"
                            content={instructorProfile?.address}
                          />
                        </TableCell>
                        <TableCell className="whitespace-nowrap truncate">
                          {instructorProfile?.linkedin_url ? (
                            <a
                              href={instructorProfile.linkedin_url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-blue-600 underline"
                              title={instructorProfile.linkedin_url}
                            >
                              LinkedIn
                            </a>
                          ) : (
                            "-"
                          )}
                        </TableCell>

                        <TableCell
                          className="text-right whitespace-nowrap sticky right-0 bg-white z-20"
                          style={{ top: 40 }}
                        >
                          <Button
                            onClick={() => handleEdit(course)}
                            variant="ghost"
                            size="sm"
                            className="mr-2"
                          >
                            <Edit className="h-6 w-6" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(course.id)}
                          >
                            <Delete className="h-6 w-6" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={22} className="text-center py-8">
                      No courses found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Phân trang */}
          <div className="flex justify-center gap-2 mt-4">
            <Button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <span className="flex items-center px-4">
              Page {page} / {totalPages}
            </span>
            <Button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default InstructorCourses;

function ImagePopup({ imageUrl }) {
  const [open, setOpen] = useState(false);

  if (!imageUrl) return <span>-</span>;

  return (
    <>
      <span
        onClick={() => setOpen(true)}
        className="text-blue-600 underline cursor-pointer"
      >
        Xem ảnh
      </span>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Course Image</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center">
            <img
              src={imageUrl}
              alt="Course Preview"
              className="max-w-full max-h-[70vh] object-contain rounded"
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
