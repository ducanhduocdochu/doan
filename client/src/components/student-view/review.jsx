import { useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "../ui/dialog";

const defaultAvatarUrl = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

function ReviewsSection({ studentViewCourseDetails, renderStars }) {
  const [showDialog, setShowDialog] = useState(false);
  const reviews = studentViewCourseDetails?.ratings || [];
  const maxShow = 4;
  const displayedReviews = reviews.slice(0, maxShow);

  // Component con để hiển thị 1 review có avatar
  const ReviewItem = ({ review }) => {
    const user = review.user || {};
    const avatarUrl = user.avatarUrl || defaultAvatarUrl;

    return (
      <li className="border rounded-lg p-4 bg-white shadow-sm" key={review.id}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <img
              src={avatarUrl}
              alt="Avatar"
              className="w-10 h-10 rounded-full object-cover"
              onError={(e) => {
                e.currentTarget.src = defaultAvatarUrl;
              }}
            />
            <div>
              <div className="font-semibold text-gray-700">
                {user.user_name || "Người dùng ẩn danh"}
              </div>
              <div className="text-sm text-gray-400">
                ({user.user_email || "Không có email"})
              </div>
            </div>
          </div>
          <span className="text-sm text-gray-600">
            {new Date(review.createdAt).toLocaleDateString("vi-VN")}
          </span>
        </div>
        <div className="flex items-center mb-2">
          {renderStars(review.rating)}
          <span className="ml-2 text-sm text-gray-500">{review.rating}/5</span>
        </div>
        <p className="text-gray-800">{review.comment || "Không có bình luận."}</p>
      </li>
    );
  };

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-semibold mb-4">Đánh giá của học viên</h2>
      {reviews.length === 0 && (
        <p className="text-gray-500">Chưa có đánh giá nào.</p>
      )}

      <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {displayedReviews.map((review) => (
          <ReviewItem key={review.id} review={review} />
        ))}
      </ul>

      {reviews.length > maxShow && (
        <Button
          onClick={() => setShowDialog(true)}
          variant="outline"
          className="mt-4 w-full"
        >
          Hiển thị thêm
        </Button>
      )}

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Toàn bộ đánh giá của học viên</DialogTitle>
          </DialogHeader>

          <ul className="space-y-4">
            {reviews.map((review) => (
              <ReviewItem key={review.id} review={review} />
            ))}
          </ul>

          <DialogFooter className="mt-6">
            <DialogClose asChild>
              <Button variant="outline" className="w-full">
                Đóng
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}

export default ReviewsSection;
