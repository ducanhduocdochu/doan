import { Skeleton } from "@/components/ui/skeleton";
import {
  initialSignInFormData,
  initialSignUpForInstructorFormData,
  initialSignUpFormData,
} from "@/config";
import { toast } from "@/hooks/use-toast";
import {
  checkAuthService,
  loginService,
  registerService,
  registerInstructorService,
} from "@/services";
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
      const navigate = useNavigate();

  const [signInFormData, setSignInFormData] = useState(initialSignInFormData);
  const [signUpFormData, setSignUpFormData] = useState(initialSignUpFormData);
  const [signUpInstructorFormData, setSignUpInstructorFormData] = useState(
    initialSignUpForInstructorFormData
  );
  const [auth, setAuth] = useState({
    authenticate: false,
    user: null,
  });
  const [loading, setLoading] = useState(true);

  async function handleRegisterUser(event) {
    event.preventDefault();
    try {
      const data = await registerService(signUpFormData);
      if (data.success) {
        toast({
          title: "Registration Successful",
          description: "Please check your email to verify your account and login.",
          variant: "default", // ✅ màu xanh / nhạt
        });
        setSignUpFormData(initialSignUpFormData);
      } else {
        toast({
          title: "Registration Failed",
          description: data.message || "Something went wrong.",
          variant: "destructive", // ❌ màu đỏ
        });
      }
    } catch (error) {
      toast({
        title: "Registration Error",
        description: error?.response?.data?.message || "Server error occurred.",
        variant: "destructive",
      });
    }
  }

  async function handleLoginUser(event) {
    event.preventDefault();
    try {
      const data = await loginService(signInFormData);
      

      if (data.success) {
        toast({
          title: "Login Successful",
          description: "Welcome back!",
          variant: "default",
        });

        sessionStorage.setItem(
          "accessToken",
          JSON.stringify(data.data.accessToken)
        );
        setAuth({
          authenticate: true,
          user: data.data.user,
        });

        const { role, is_verify } = data.data.user;
        if (!is_verify) {
          navigate("/auth/unverified");
        } else if (role === "instructor") {
          navigate("/instructor");
        } else if (role === "admin") {
          navigate("/instructor"); // 👈 hoặc "/admin" nếu có
        } else {
          navigate("/home");
        }
      } else {
        toast({
          title: "Login Failed",
          description: data.message || "Invalid email or password",
          variant: "destructive",
        });
        setAuth({
          authenticate: false,
          user: null,
        });
      }

      setSignUpFormData(initialSignUpFormData);
    } catch (error) {
      toast({
        title: "Login Error",
        description: error?.response?.data?.message || "Server error occurred.",
        variant: "destructive",
      });
    }
  }

  async function handleLSignUpUserForInstructor(event) {
    event.preventDefault();
    try {
      const data = await registerInstructorService(signUpInstructorFormData);

      if (data.success) {
        toast({
          title: "Registration Successful",
          description: "Please check your email to verify your account and login.",
          variant: "default",
        });
        setSignUpInstructorFormData(initialSignUpForInstructorFormData);
      } else {
        toast({
          title: "Registration Failed",
          description: data.message || "Something went wrong.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Registration Error",
        description: error?.response?.data?.message || "Server error occurred.",
        variant: "destructive",
      });
    }
  }

  //check auth user
  async function checkAuthUser() {
    try {
      const data = await checkAuthService();
      if (data.success) {
        setAuth({
          authenticate: true,
          user: data.data.user,
        });
        setLoading(false);
      } else {
        setAuth({
          authenticate: false,
          user: null,
        });
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      if (!error?.response?.data?.success) {
        setAuth({
          authenticate: false,
          user: null,
        });
        setLoading(false);
      }
    }
  }

  function resetCredentials() {
    setAuth({
      authenticate: false,
      user: null,
    });
  }

  useEffect(() => {
    checkAuthUser();
  }, []);

  console.log(auth, "gf");

  return (
    <AuthContext.Provider
      value={{
        signInFormData,
        setSignInFormData,
        signUpFormData,
        setSignUpFormData,
        signUpInstructorFormData,
        setSignUpInstructorFormData,
        handleRegisterUser,
        handleLSignUpUserForInstructor,
        handleLoginUser,
        auth,
        resetCredentials,
      }}
    >
      {loading ? <Skeleton /> : children}
    </AuthContext.Provider>
  );
}
