import { Navigate, useLocation } from "react-router-dom";
import { Fragment } from "react";

function RouteGuard({ authenticated, user, element }) {
  const location = useLocation();
  const pathname = location.pathname;

  const isAtAuth = pathname.startsWith("/auth");
  const isAtUnverified = pathname === "/auth/unverified";
  const isInstructorRoute = pathname.startsWith("/instructor");
  const isStudentRoute = pathname === "/" || pathname.startsWith("/home") || pathname.startsWith("/course") || pathname.startsWith("/student");

  // ❌ Chưa đăng nhập → Redirect về /auth
  if (!authenticated && !isAtAuth) {
    return <Navigate to="/auth" />;
  }

  // ❌ Đã đăng nhập nhưng chưa verify → Chuyển về trang unverified
  if (authenticated && user?.isVerify === false && !isAtUnverified) {
    return <Navigate to="/auth/unverified" />;
  }

  // ✅ Nếu là admin → Có thể vào mọi route
  if (authenticated && user?.role === "admin") {
    return <Fragment>{element}</Fragment>;
  }

  // ❌ Nếu là student mà vào /instructor → Redirect về /home
  if (authenticated && user?.role === "student" && isInstructorRoute) {
    return <Navigate to="/home" />;
  }

  // ❌ Nếu là instructor mà vào student route → Redirect về /instructor
  if (authenticated && user?.role === "instructor" && isStudentRoute && !isAtAuth) {
    return <Navigate to="/instructor" />;
  }

  // ✅ Trường hợp hợp lệ
  return <Fragment>{element}</Fragment>;
}

export default RouteGuard;
