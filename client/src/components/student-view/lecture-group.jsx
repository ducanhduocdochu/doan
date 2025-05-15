import { useState } from "react";
import { PlayCircle, Lock, ChevronDown, ChevronRight } from "lucide-react";
import { CardContent } from "../ui/card";

function LecturesGrouped({ lectures, handleSetFreePreview }) {
  const [openChapters, setOpenChapters] = useState({});

  // Nhóm theo chapterTitle
  const grouped = lectures?.reduce((acc, lecture) => {
    const chapter = lecture.chapterTitle || "Chưa phân chương";
    if (!acc[chapter]) acc[chapter] = [];
    acc[chapter].push(lecture);
    return acc;
  }, {}) || {};

  // Sắp xếp nhóm theo chapterNumber (nếu có)
  const sortedChapters = Object.entries(grouped)
    .map(([chapterTitle, items]) => {
      const chapterNumber = items[0]?.chapterNumber ?? 0;
      return { chapterTitle, chapterNumber, items };
    })
    .sort((a, b) => a.chapterNumber - b.chapterNumber);

  const toggleChapter = (chapterTitle) => {
    setOpenChapters((prev) => ({
      ...prev,
      [chapterTitle]: !prev[chapterTitle],
    }));
  };

  return (
    <CardContent>
      {sortedChapters.map(({ chapterTitle, items }) => (
        <div key={chapterTitle} className="mb-4 border rounded">
          <button
            type="button"
            onClick={() => toggleChapter(chapterTitle)}
            className="flex justify-between items-center w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 cursor-pointer text-left"
          >
            <span className="font-semibold">{chapterTitle}</span>
            {openChapters[chapterTitle] ? (
              <ChevronDown className="w-5 h-5" />
            ) : (
              <ChevronRight className="w-5 h-5" />
            )}
          </button>

          {openChapters[chapterTitle] && (
            <ul className="px-4 py-2 space-y-2 bg-white">
              {items
                .sort((a, b) => {
                  const idA = parseInt(a.id, 10);
                  const idB = parseInt(b.id, 10);
                  return idA - idB;
                })
                .map((lecture) => (
                  <li
                    key={lecture.id}
                    className={`flex items-center cursor-pointer ${
                      lecture.free_preview ? "text-blue-600" : "text-gray-400 cursor-not-allowed"
                    }`}
                    onClick={
                      lecture.free_preview ? () => handleSetFreePreview(lecture) : undefined
                    }
                  >
                    {lecture.free_preview ? (
                      <PlayCircle className="mr-2 h-4 w-4" />
                    ) : (
                      <Lock className="mr-2 h-4 w-4" />
                    )}
                    <span>{lecture.title}</span>
                  </li>
                ))}
            </ul>
          )}
        </div>
      ))}
    </CardContent>
  );
}

export default LecturesGrouped;
