import { useState } from "react";
import {
  PlayCircle,
  ChevronDown,
  ChevronRight,
  Check,
} from "lucide-react";
import { CardContent } from "../ui/card";

function LecturesGroupedView({
  lectures,
  currentLecture,
  setCurrentLecture,
  progress,
}) {
  const [openChapters, setOpenChapters] = useState({});

  const grouped = lectures?.reduce((acc, lecture) => {
    const chapter = lecture.chapterTitle || "Chưa phân chương";
    if (!acc[chapter]) acc[chapter] = [];
    acc[chapter].push(lecture);
    return acc;
  }, {}) || {};

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

  const isViewed = (lectureId) =>
    progress?.some((item) => item.lecture_id === lectureId && item.viewed);

  return (
    <CardContent className="text-white">
      {sortedChapters.map(({ chapterTitle, items }) => (
        <div key={chapterTitle} className="mb-4 border border-gray-700 rounded">
          <button
            type="button"
            onClick={() => toggleChapter(chapterTitle)}
            className="flex justify-between items-center w-full px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white"
          >
            <span className="font-semibold">{chapterTitle}</span>
            {openChapters[chapterTitle] ? (
              <ChevronDown className="w-5 h-5" />
            ) : (
              <ChevronRight className="w-5 h-5" />
            )}
          </button>

          {openChapters[chapterTitle] && (
            <ul className="px-4 py-2 space-y-2 bg-[#1c1d1f]">
              {items
                .sort((a, b) => parseInt(a.id) - parseInt(b.id))
                .map((lecture) => {
                  const isCurrent = currentLecture?.id === lecture.id;
                  const viewed = isViewed(lecture.id);

                  return (
                    <li
                      key={lecture.id}
                      className={`flex items-center px-2 py-1 rounded cursor-pointer ${
                        isCurrent ? "bg-yellow-100 text-yellow-900" : ""
                      } hover:bg-gray-800 text-white`}
                      onClick={() => setCurrentLecture(lecture)}
                    >
                      {viewed ? (
                        <Check className="mr-2 h-4 w-4 text-green-400" />
                      ) : (
                        <PlayCircle className="mr-2 h-4 w-4 text-blue-400" />
                      )}
                      <span>{lecture.title}</span>
                    </li>
                  );
                })}
            </ul>
          )}
        </div>
      ))}
    </CardContent>
  );
}

export default LecturesGroupedView;
