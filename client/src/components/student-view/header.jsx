import {
  BookOpen,
  ShoppingCart,
  Heart,
  UserCircle,
  LogOut,
  KeyRound,
  Settings,
  LayoutDashboard,
  Languages,
  User,
  Bell,
  StarOff,
  StarHalf,
  Star,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/auth-context";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../ui/dropdown-menu";
import { Card, CardContent, CardTitle } from "../ui/card";
import { StudentContext } from "@/context/student-context";
import {
  fetchStudentBoughtCoursesService,
  fetchStudentViewCourseCartListService,
  fetchStudentViewCourseFavoriteListService,
} from "@/services";
import { getCategoryColor, getLevelColor } from "@/config";
import { Button } from "../ui/button";

function StudentViewCommonHeader() {
  const navigate = useNavigate();
  const { resetCredentials, auth } = useContext(AuthContext);
  const {
    studentFavoriteCoursesList,
    setStudentFavoriteCoursesList,
    studentCartCoursesList,
    setStudentCartCoursesList,
    studentBoughtCoursesList,
    setStudentBoughtCoursesList,
    setLoadingState,
  } = useContext(StudentContext);

  const [openMenu, setOpenMenu] = useState(null);

  const handleLogout = () => {
    resetCredentials();
    sessionStorage.clear();
  };

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

  const renderHoverMenu = (
    menuKey,
    icon,
    title,
    items,
    label,
    seeMorePath,
    count
  ) => {
    const getActionButton = (itemId) => {
      switch (menuKey) {
        case "favorites":
          return (
            <Button
              onClick={() => navigate(`/course/details/${itemId}`)}
              className="w-full"
            >
              Xem chi tiết →
            </Button>
          );
        case "cart":
          return (
            <Button
              onClick={() => navigate(`/checkout/${itemId}`)}
              className="w-full"
            >
            Thanh toán →
            </Button>
          );
        case "myCourses":
          return (
            <Button
              onClick={() => navigate(`/course-progress/${itemId}`)}
              className="w-full"
            >
              Học khóa học →
            </Button>
          );
        default:
          return null;
      }
    };

    return (
      <div
        className="relative inline-block"
        onMouseEnter={() => setOpenMenu(menuKey)}
        onMouseLeave={() => setOpenMenu(null)}
      >
        {/* Icon + badge */}
        <div
          onClick={() => navigate(`${seeMorePath}`)}
          className="relative flex items-center gap-1 cursor-pointer px-2 py-1"
        >
          <div className="relative">
            {icon}
            {count > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold px-[5px] py-[1px] rounded-full leading-none">
                {count}
              </span>
            )}
          </div>
          <span className="text-sm font-medium hidden md:inline">{label}</span>
        </div>

        {/* Dropdown content */}
        <div
          className={`absolute top-full right-0 w-[360px] bg-white shadow-lg border rounded z-50`}
          style={{ display: openMenu === menuKey ? "block" : "none" }}
        >
          <div className="font-bold px-4 py-2 border-b">{title}</div>
          <div>
            {items && items.length > 0 ? (
              <div>
                {items.slice(0, 3).map((item) => (
                  <Card key={item.id} className="m-2 border">
                    {/* Nội dung thông tin khóa học */}
                    <CardContent className="flex gap-3 items-center p-3">
                      <img
                        src={item.image || "/default-course.jpg"}
                        alt={item.title}
                        className="w-20 h-20 object-cover rounded"
                      />
                      <div className="flex-1">
                        <CardTitle className="text-base mb-1 line-clamp-2">
                          {item.title}
                        </CardTitle>

                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`text-xs border px-2 py-1 rounded-full ${getCategoryColor(
                              item.category
                            )}`}
                          >
                            {item.category
                              ?.split("-")
                              .map((w) => w[0].toUpperCase() + w.slice(1))
                              .join(" ")}
                          </span>
                          <p className="text-xs text-gray-500 font-medium">
                            {item.instructor_name}
                          </p>
                        </div>

                        <p className="text-xs mt-1 text-gray-600">
                          {item.lectures?.length || 0} bài giảng -{" "}
                          <span className={getLevelColor(item.level)}>
                            {item.level?.charAt(0).toUpperCase() +
                              item.level?.slice(1)}{" "}
                            level
                          </span>
                        </p>

                        <div className="flex items-center gap-1 mt-1">
                          <span className="text-xs text-gray-800 font-bold">
                            {item.averageRating || 0}
                          </span>
                          {renderStars(item.averageRating || 0)}
                          <span className="text-xs text-gray-500 ml-1">
                            ({item.ratingCount || 0})
                          </span>
                        </div>

                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm font-bold text-red-600">
                            ${item.pricingAfterDiscount}
                          </span>
                          {item.discountPct > 0 && (
                            <>
                              <span className="text-xs line-through text-gray-400">
                                ${item.pricing}
                              </span>
                              <span className="text-xs text-green-600 font-semibold">
                                -{item.discountPct}%
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </CardContent>

                    {/* Nút hành động nằm dưới toàn bộ thẻ */}
                    <div className="px-3 pb-3">{getActionButton(item.id)}</div>
                  </Card>
                ))}
              </div>
            ) : (
              <div>not found</div>
            )}

            {/* Nút xem thêm */}
            <button
              onClick={() => navigate(seeMorePath)}
              className="w-full text-center py-1 text-sm font-medium text-blue-600 hover:bg-gray-100 border-t"
            >
              Xem thêm
            </button>
          </div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    const fetchCart = async () => {
      const response = await fetchStudentViewCourseCartListService();
      if (response?.success) {
        setStudentCartCoursesList(response?.data.courses || []);
        setLoadingState(false);
      }
    };
    fetchCart();
  }, []);

  useEffect(() => {
    const fetchFavorites = async () => {
      const response = await fetchStudentViewCourseFavoriteListService();
      if (response?.success) {
        setStudentFavoriteCoursesList(response?.data || []);
        setLoadingState(false);
      }
    };
    fetchFavorites();
  }, []);

  useEffect(() => {
    const fetchStudentBoughtCourses = async () => {
      const response = await fetchStudentBoughtCoursesService(auth?.user?.id);
      if (response?.success) {
        setStudentBoughtCoursesList(response?.data.courses || []);
      }
    };
    fetchStudentBoughtCourses();
  }, []);

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Bạn đã được tặng khóa học React",
      time: "2 giờ trước",
      isRead: false,
    },
    {
      id: 2,
      title: "Khóa học Flutter đã cập nhật nội dung mới",
      time: "Hôm qua",
      isRead: true,
    },
    {
      id: 3,
      title: "Cập nhật bảo mật tài khoản",
      time: "2 ngày trước",
      isRead: false,
    },
    {
      id: 4,
      title: "Chúc mừng bạn đã hoàn thành khóa học",
      time: "3 ngày trước",
      isRead: true,
    },
    {
      id: 5,
      title: "Khóa học mới: Next.js nâng cao",
      time: "4 ngày trước",
      isRead: false,
    },
    {
      id: 6,
      title: "Khóa học mới: Next.js nâng cao",
      time: "4 ngày trước",
      isRead: false,
    },
    {
      id: 7,
      title: "Khóa học mới: Next.js nâng cao",
      time: "4 ngày trước",
      isRead: false,
    },
    {
      id: 8,
      title: "Khóa học mới: Next.js nâng cao",
      time: "4 ngày trước",
      isRead: false,
    },
    {
      id: 9,
      title: "Khóa học mới: Next.js nâng cao",
      time: "4 ngày trước",
      isRead: false,
    },
    {
      id: 10,
      title: "Khóa học mới: Next.js nâng cao",
      time: "4 ngày trước",
      isRead: false,
    },

    {
      id: 11,
      title: "Khóa học mới: Next.js nâng cao",
      time: "4 ngày trước",
      isRead: false,
    },
    {
      id: 12,
      title: "Khóa học mới: Next.js nâng cao",
      time: "4 ngày trước",
      isRead: false,
    },
    {
      id: 13,
      title: "Khóa học mới: Next.js nâng cao",
      time: "4 ngày trước",
      isRead: false,
    },
    {
      id: 14,
      title: "Khóa học mới: Next.js nâng cao",
      time: "4 ngày trước",
      isRead: false,
    },
  ]);

  return (
    <header className="flex items-center justify-between p-4 border-b relative">
      {/* Logo + Nav */}
      <div className="flex items-center space-x-4">
        <Link to="/home" className="flex items-center hover:text-black">
          <span className="font-extrabold md:text-xl text-[14px]">
            E-learning
          </span>
        </Link>
        <Button
          variant="ghost"
          onClick={() => {
            if (!location.pathname.includes("/courses")) {
              navigate("/courses");
            }
          }}
          className="text-[14px] md:text-[16px] font-medium"
        >
          Khám phá khóa học
        </Button>
      </div>

      {/* Right side controls */}
      <div className="flex items-center gap-6">
        {/* Dropdown menus */}
        {renderHoverMenu(
          "myCourses",
          <BookOpen className="w-6 h-6" />,
          "Khóa học của tôi",
          studentBoughtCoursesList,
          "Khóa học của tôi",
          "/student-courses",
          studentBoughtCoursesList.length
        )}

        {renderHoverMenu(
          "cart",
          <ShoppingCart className="w-6 h-6" />,
          "Giỏ hàng",
          studentCartCoursesList,
          "Giỏ hàng",
          "/cart",
          studentCartCoursesList.length
        )}

        {renderHoverMenu(
          "favorites",
          <Heart className="w-6 h-6" />,
          "Yêu thích",
          studentFavoriteCoursesList,
          "Yêu thích",
          "/favorites",
          studentFavoriteCoursesList.length
        )}

        {/* Notification menu */}
        <div className="relative inline-block">
          <div
            onClick={() =>
              setOpenMenu(openMenu === "notifications" ? null : "notifications")
            }
            className="relative flex items-center cursor-pointer px-2 py-1"
          >
            <Bell className="w-6 h-6" />
            {notifications.length > 0 && (
              <span className="absolute -top-0 -right-0 bg-red-600 text-white text-[10px] font-bold px-[6px] py-[1px] rounded-full leading-none shadow-sm">
                {notifications.filter((n) => !n.isRead).length}
              </span>
            )}
          </div>

          {openMenu === "notifications" && (
            <div className="absolute top-full right-0 w-[320px] max-h-[400px] overflow-y-auto bg-white shadow-lg border rounded z-50">
              <div className="font-bold px-4 py-2 border-b">Thông báo</div>

              <div className="px-4 pt-2 space-y-3 pb-3">
                {notifications.length > 0 ? (
                  notifications.map((item) => (
                    <div
                      key={item.id}
                      className={`cursor-pointer text-sm p-2 rounded-md transition-all ${
                        item.isRead
                          ? "bg-gray-50 text-gray-700"
                          : "bg-blue-50 text-black"
                      }`}
                      onClick={() => {
                        setNotifications((prev) =>
                          prev.map((n) =>
                            n.id === item.id ? { ...n, isRead: true } : n
                          )
                        );
                        navigate("/notifications");
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={`font-medium ${
                            item.isRead ? "text-gray-700" : "text-black"
                          }`}
                        >
                          {item.title}
                        </span>
                        {!item.isRead && (
                          <span className="w-2 h-2 rounded-full bg-blue-500 ml-2"></span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{item.time}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 py-4 text-center">
                    Không có thông báo.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger>
            <UserCircle className="w-8 h-8 cursor-pointer" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem onClick={() => navigate("/profile")}>
              <User className="w-4 h-4 mr-2" />
              Thông tin cá nhân
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/language")}>
              <Languages className="w-4 h-4 mr-2" />
              Ngôn ngữ
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/theme")}>
              <LayoutDashboard className="w-4 h-4 mr-2" />
              Giao diện (Theme)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/settings")}>
              <Settings className="w-4 h-4 mr-2" />
              Cài đặt
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/change-password")}>
              <KeyRound className="w-4 h-4 mr-2" />
              Đổi mật khẩu
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2 text-red-600" />
              <span className="text-red-600">Sign Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

export default StudentViewCommonHeader;
