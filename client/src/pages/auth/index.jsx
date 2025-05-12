import CommonForm from "@/components/common-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  signInFormControls,
  signUpFormControls,
  signUpInstructorFormControls,
} from "@/config";
import { AuthContext } from "@/context/auth-context";
import { GraduationCap } from "lucide-react";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";

function AuthPage() {
  const [activeTab, setActiveTab] = useState("signin");
  const {
    signInFormData,
    setSignInFormData,
    signUpFormData,
    setSignUpFormData,
    signUpInstructorFormData,
    setSignUpInstructorFormData,
    handleRegisterUser,
    handleLoginUserForInstructor,
    handleLoginUser,
  } = useContext(AuthContext);

  function handleTabChange(value) {
    setActiveTab(value);
  }

  function checkIfSignInFormIsValid() {
    return signInFormData?.userEmail && signInFormData?.password;
  }

  function checkIfSignUpFormIsValid() {
    return signUpFormData?.userName && signUpFormData?.userEmail && signUpFormData?.password;
  }

  function checkIfSignUpInstructorFormIsValid() {
    const f = signUpInstructorFormData;
    return f?.userName && f?.userEmail && f?.password && f?.bio && f?.occupation && f?.education && f?.language && f?.paypalEmail;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b">
        <Link to={"/"} className="flex items-center justify-center">
          <GraduationCap className="h-8 w-8 mr-4" />
          <span className="font-extrabold text-xl">LMS LEARN</span>
        </Link>
      </header>
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-full max-w-xl"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up (Student)</TabsTrigger>
            <TabsTrigger value="signup-instructor">Sign Up (Instructor)</TabsTrigger>
          </TabsList>

          {/* Sign In Tab */}
          <TabsContent value="signin">
            <Card className="p-6 space-y-4">
              <CardHeader>
                <CardTitle>Sign in to your account</CardTitle>
                <CardDescription>Enter your email and password</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <CommonForm
                  formControls={signInFormControls}
                  buttonText="Sign In"
                  formData={signInFormData}
                  setFormData={setSignInFormData}
                  isButtonDisabled={!checkIfSignInFormIsValid()}
                  handleSubmit={handleLoginUser}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sign Up Student */}
          <TabsContent value="signup">
            <Card className="p-6 space-y-4">
              <CardHeader>
                <CardTitle>Create a student account</CardTitle>
                <CardDescription>Enter basic information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <CommonForm
                  formControls={signUpFormControls}
                  buttonText="Sign Up"
                  formData={signUpFormData}
                  setFormData={setSignUpFormData}
                  isButtonDisabled={!checkIfSignUpFormIsValid()}
                  handleSubmit={() => handleRegisterUser("student")}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sign Up Instructor */}
          <TabsContent value="signup-instructor">
            <Card className="p-6 space-y-4">
              <CardHeader>
                <CardTitle>Create an instructor account</CardTitle>
                <CardDescription>Enter full instructor details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <CommonForm
                  formControls={signUpInstructorFormControls}
                  buttonText="Register as Instructor"
                  formData={signUpInstructorFormData}
                  setFormData={setSignUpInstructorFormData}
                  isButtonDisabled={!checkIfSignUpInstructorFormIsValid()}
                  handleSubmit={() => handleLoginUserForInstructor()}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default AuthPage;
