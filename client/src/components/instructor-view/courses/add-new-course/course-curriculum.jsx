import MediaProgressbar from "@/components/media-progress-bar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import VideoPlayer from "@/components/video-player";
import { courseCurriculumInitialFormData } from "@/config";
import { InstructorContext } from "@/context/instructor-context";
import {
  mediaBulkUploadService,
  mediaDeleteService,
  mediaUploadService,
} from "@/services";
import { Upload } from "lucide-react";
import { useContext, useRef } from "react";

function CourseCurriculum() {
  const {
    courseCurriculumFormData,
    setCourseCurriculumFormData,
    mediaUploadProgress,
    setMediaUploadProgress,
    mediaUploadProgressPercentage,
    setMediaUploadProgressPercentage,
  } = useContext(InstructorContext);

  // Lưu ref input file bulk upload theo chapter_number
  const bulkUploadInputRefs = useRef({});

  // Lấy chapter_number lớn nhất để tạo chapter mới
  const maxChapterNumber = courseCurriculumFormData.reduce(
  (max, item) => (item.chapter_number > max ? item.chapter_number : max),
  0
);

  // Nhóm lecture theo chapter_number
  const chapters = courseCurriculumFormData.reduce((acc, item, index) => {
    const chapterKey = item.chapter_number ?? 0; // default 0 nếu không có
    if (!acc[chapterKey])
      acc[chapterKey] = { title: item.chapter_title || "", lectures: [] };
    acc[chapterKey].lectures.push({ ...item, index });
    return acc;
  }, {});

  // Thêm chapter mới (thêm 1 lecture mới thuộc chapter mới)
  function handleAddChapter() {
    const newChapterNumber = maxChapterNumber + 1;
    setCourseCurriculumFormData([
      ...courseCurriculumFormData,
      {
        ...courseCurriculumInitialFormData[0],
        chapter_number: newChapterNumber,
        chapter_title: "",
      },
    ]);
  }

  // Thêm lecture mới vào chapter
  function handleAddLectureToChapter(chapterNumber) {
    setCourseCurriculumFormData([
      ...courseCurriculumFormData,
      {
        ...courseCurriculumInitialFormData[0],
        chapter_number: chapterNumber,
        chapter_title:
          courseCurriculumFormData.find(
            (c) => c.chapter_number === chapterNumber
          )?.chapter_title || "",
      },
    ]);
  }

  // Thay đổi tiêu đề chapter
  function handleChapterTitleChange(event, chapterNumber) {
    const value = event.target.value;
    const newData = courseCurriculumFormData.map((item) =>
      item.chapter_number === chapterNumber
        ? { ...item, chapter_title: value }
        : item
    );
    setCourseCurriculumFormData(newData);
  }

  // Thay đổi tiêu đề lecture
  function handleLectureTitleChange(event, lectureIndex) {
    let cpy = [...courseCurriculumFormData];
    cpy[lectureIndex] = {
      ...cpy[lectureIndex],
      title: event.target.value,
    };
    setCourseCurriculumFormData(cpy);
  }

  // Thay đổi mô tả lecture
  function handleLectureDescriptionChange(event, lectureIndex) {
    let cpy = [...courseCurriculumFormData];
    cpy[lectureIndex] = {
      ...cpy[lectureIndex],
      description: event.target.value,
    };
    setCourseCurriculumFormData(cpy);
  }

  // Thay đổi trạng thái free preview lecture
  function handleFreePreviewChange(currentValue, lectureIndex) {
    let cpy = [...courseCurriculumFormData];
    cpy[lectureIndex] = {
      ...cpy[lectureIndex],
      free_preview: currentValue,
    };
    setCourseCurriculumFormData(cpy);
  }

  async function handleSingleLectureUpload(event, lectureIndex) {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    const videoFormData = new FormData();
    videoFormData.append("file", selectedFile);

    try {
      setMediaUploadProgress(true);
      const response = await mediaUploadService(
        videoFormData,
        setMediaUploadProgressPercentage
      );

      if (response.success) {
        const videoUrl = response?.data?.url;
        const publicId = response?.data?.public_id;

        const videoElement = document.createElement("video");
        videoElement.src = videoUrl;
        videoElement.preload = "metadata";

        videoElement.onloadedmetadata = () => {
          const duration = Math.floor(videoElement.duration);

          let cpy = [...courseCurriculumFormData];

          // Tính order dựa vào lecture trong chapter
          const lecture = cpy[lectureIndex];
          const chapterNumber = lecture.chapter_number;

          // Lọc các bài trong cùng chương và sắp xếp theo thứ tự hiện có (order hoặc index)
          const lecturesInChapter = cpy
            .map((item, idx) => ({ ...item, idx }))
            .filter((item) => item.chapter_number === chapterNumber);

          // Sắp xếp theo order nếu có, nếu không thì theo index
          lecturesInChapter.sort(
            (a, b) => (a.order ?? a.idx) - (b.order ?? b.idx)
          );

          // Tính order = vị trí của lecture trong mảng này + 1
          const order =
            lecturesInChapter.findIndex((item) => item.idx === lectureIndex) +
            1;

          cpy[lectureIndex] = {
            ...cpy[lectureIndex],
            video_url: videoUrl,
            public_id: publicId,
            duration,
            order,
          };
          setCourseCurriculumFormData(cpy);
        };
      }
    } catch (error) {
      console.log(error);
    } finally {
      setMediaUploadProgress(false);
    }
  }

  // Thay thế video lecture
  async function handleReplaceVideo(lectureIndex) {
    let cpy = [...courseCurriculumFormData];
    const currentPublicId = cpy[lectureIndex].public_id;

    const deleteResponse = await mediaDeleteService(currentPublicId);

    if (deleteResponse?.success) {
      cpy[lectureIndex] = {
        ...cpy[lectureIndex],
        video_url: "",
        public_id: "",
      };
      setCourseCurriculumFormData(cpy);
    }
  }

  // Xóa lecture
  async function handleDeleteLecture(lectureIndex) {
    let cpy = [...courseCurriculumFormData];
    const currentPublicId = cpy[lectureIndex].public_id;

    const response = await mediaDeleteService(currentPublicId);

    if (response?.success) {
      cpy = cpy.filter((_, index) => index !== lectureIndex);
      setCourseCurriculumFormData(cpy);
    }
  }

  // Bulk upload video cho 1 chapter cụ thể
  async function handleMediaBulkUpload(event, chapterNumber) {
    const selectedFiles = Array.from(event.target.files);
    const bulkFormData = new FormData();

    selectedFiles.forEach((fileItem) => bulkFormData.append("files", fileItem));

    try {
      setMediaUploadProgress(true);
      const response = await mediaBulkUploadService(
        bulkFormData,
        setMediaUploadProgressPercentage
      );

      if (response?.success) {
        let cpy =
          courseCurriculumFormData.length === 0
            ? []
            : [...courseCurriculumFormData];

        // Lấy các bài trong chapter hiện tại
        const lecturesInChapter = cpy.filter(
          (item) => item.chapter_number === chapterNumber
        );

        // Số bài trong chapter hiện có
        const currentCount = lecturesInChapter.length;

        cpy = [
          ...cpy,
          ...response?.data.map((item, index) => ({
            video_url: item?.url,
            public_id: item?.public_id,
            title: `Lecture ${cpy.length + index + 1}`,
            free_preview: false,
            chapter_number: chapterNumber,
            chapter_title:
              courseCurriculumFormData.find(
                (c) => c.chapter_number === chapterNumber
              )?.chapter_title || "",
            order: currentCount + index + 1,
            duration: 0, // Chưa tính duration, có thể xử lý sau
            description: "",
          })),
        ];
        setCourseCurriculumFormData(cpy);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setMediaUploadProgress(false);
      // Reset input để có thể upload lại cùng file nếu muốn
      if (bulkUploadInputRefs.current[chapterNumber]) {
        bulkUploadInputRefs.current[chapterNumber].value = "";
      }
    }
  }

  // Kiểm tra toàn bộ lectures hợp lệ
  function isCourseCurriculumFormDataValid() {
    return courseCurriculumFormData.every((item) => {
      return (
        item &&
        typeof item === "object" &&
        item.title.trim() !== "" &&
        item.video_url.trim() !== ""
      );
    });
  }

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle>Create Course Curriculum</CardTitle>
        <Button onClick={handleAddChapter} variant="outline">
          Add Chapter
        </Button>
      </CardHeader>
      {mediaUploadProgress && (
        <div className="mt-4">
          <MediaProgressbar
            isMediaUploading={mediaUploadProgress}
            progress={mediaUploadProgressPercentage}
          />
        </div>
      )}

      <CardContent>
        {!courseCurriculumFormData.length && (
          <p className="text-center text-gray-500">No chapters added yet.</p>
        )}

        {Object.entries(chapters).map(([chapter_number, chapter]) => (
          <div key={chapter_number} className="mb-8 border rounded-md p-4">
            <div className="mb-4 flex items-center gap-4 flex-wrap">
              <h3 className="text-xl font-semibold">Chapter {chapter_number}</h3>
              <Input
                placeholder="Chapter Title"
                value={chapter.chapter_title}
                onChange={(e) =>
                  handleChapterTitleChange(e, Number(chapter_number))
                }
                className="max-w-lg flex-grow"
              />
              <Button
                onClick={() => handleAddLectureToChapter(Number(chapter_number))}
              >
                Add Lecture
              </Button>

              {/* Bulk upload input ẩn và nút riêng theo chapter */}
              <Input
                type="file"
                accept="video/*"
                multiple
                id={`bulk-upload-${chapter_number}`}
                ref={(el) => (bulkUploadInputRefs.current[chapter_number] = el)}
                onChange={(e) =>
                  handleMediaBulkUpload(e, Number(chapter_number))
                }
                className="hidden"
              />
              <label
                htmlFor={`bulk-upload-${chapter_number}`}
                className="inline-flex cursor-pointer items-center border rounded px-3 py-1 hover:bg-gray-100"
              >
                <Upload className="w-4 h-5 mr-2" />
                Bulk Upload
              </label>
            </div>

            <div className="space-y-6">
              {chapter.lectures.map((lecture) => (
                <div
                  key={lecture.index}
                  className="border p-4 rounded-md flex flex-col gap-4"
                >
                  <div className="flex flex-wrap gap-5 items-center">
                    <h4 className="font-semibold flex-shrink-0 w-full sm:w-auto">
                      Lecture {chapter.lectures.indexOf(lecture) + 1}
                    </h4>

                    <Input
                      name={`title-${lecture.index}`}
                      placeholder="Enter lecture title"
                      className="max-w-96 flex-grow"
                      onChange={(e) =>
                        handleLectureTitleChange(e, lecture.index)
                      }
                      value={lecture.title}
                    />

                    <div className="flex items-center space-x-2">
                      <Switch
                        onCheckedChange={(value) =>
                          handleFreePreviewChange(value, lecture.index)
                        }
                        checked={lecture.free_preview}
                        id={`freePreview-${lecture.index}`}
                      />
                      <Label htmlFor={`freePreview-${lecture.index}`}>
                        Free Preview
                      </Label>
                    </div>
                  </div>
                  <div>
                    <Textarea
                      name={`des-${lecture.index}`}
                      placeholder="Enter description"
                      className="h-[100px] flex-grow"
                      onChange={(e) =>
                        handleLectureDescriptionChange(e, lecture.index)
                      }
                      value={lecture.description}
                    />
                  </div>
                  <div>
                    {lecture.video_url ? (
                      <div className="flex flex-wrap gap-3">
                        <VideoPlayer
                          url={lecture.video_url}
                          width="450px"
                          height="200px"
                        />
                        <Button
                          onClick={() => handleReplaceVideo(lecture.index)}
                        >
                          Replace Video
                        </Button>
                        <Button
                          onClick={() => handleDeleteLecture(lecture.index)}
                          className="bg-red-900"
                        >
                          Delete Lecture
                        </Button>
                      </div>
                    ) : (
                      <Input
                        type="file"
                        accept="video/*"
                        onChange={(e) =>
                          handleSingleLectureUpload(e, lecture.index)
                        }
                        className="mb-4"
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export default CourseCurriculum;
