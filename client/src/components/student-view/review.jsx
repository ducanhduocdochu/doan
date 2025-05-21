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
import { Star } from "lucide-react";
import { toast } from "@/hooks/use-toast"; // nếu bạn dùng toast thông báo
import { AuthContext } from "@/context/auth-context";
import { useContext } from "react";

const defaultAvatarUrl = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

function ReviewsSection({ studentViewCourseDetails, renderStars, isStudent = true }) {
  const { auth } = useContext(AuthContext);

  const [showDialog, setShowDialog] = useState(false);
  const [reviewInput, setReviewInput] = useState("");
  const [ratingInput, setRatingInput] = useState(0);

  const reviews = studentViewCourseDetails?.ratings || [];
  const maxShow = 4;
  const displayedReviews = reviews.slice(0, maxShow);

  // Component con để hiển thị 1 review có avatar
  const ReviewItem = ({ review }) => {
    const user = review.user || {};
    const avatar_url = user.avatar_url || defaultAvatarUrl;

    return (
      <li className="border rounded-lg p-4 bg-white shadow-sm" key={review.id}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <img
              src={avatar_url}
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
            {new Date(review.created_at).toLocaleDateString("vi-VN")}
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

  const handleSubmitReview = () => {
    if (!reviewInput || ratingInput === 0) {
      toast({
        title: "Thiếu thông tin",
        description: "Vui lòng chọn số sao và nhập nội dung đánh giá.",
        variant: "destructive",
      });
      return;
    }

    // Gửi đánh giá ở đây nếu có API
    const payload = {
      userId: auth?.user?._id,
      courseId: studentViewCourseDetails?.id,
      comment: reviewInput,
      rating: ratingInput,
    };

    console.log("Đánh giá gửi đi:", payload);

    // Reset form
    setReviewInput("");
    setRatingInput(0);
    toast({
      title: "Gửi đánh giá thành công",
      description: "Cảm ơn bạn đã để lại phản hồi!",
    });
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

      {/* Gửi đánh giá */}
      {isStudent && 
      <div className="mt-8 border rounded p-6 bg-white shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Gửi đánh giá của bạn</h3>

        {/* Chọn sao */}
        <div className="flex items-center gap-2 mb-4">
          <span className="font-medium">Chọn số sao:</span>
          {[1, 2, 3, 4, 5].map((value) => (
            <Star
              key={value}
              className={`w-6 h-6 cursor-pointer ${
                value <= ratingInput ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
              }`}
              onClick={() => setRatingInput(value)}
            />
          ))}
        </div>

        {/* Nội dung đánh giá */}
        <textarea
          className="w-full border rounded p-2 mb-4 text-sm"
          rows="4"
          placeholder="Nhập nhận xét của bạn..."
          value={reviewInput}
          onChange={(e) => setReviewInput(e.target.value)}
        />

        <Button onClick={handleSubmitReview}>Gửi đánh giá</Button>
      </div>}

      {/* Dialog hiển thị tất cả đánh giá */}
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
