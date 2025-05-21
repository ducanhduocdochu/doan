import InstructorCourses from "@/components/instructor-view/courses";
import InstructorDashboard from "@/components/instructor-view/dashboard";
import InstructorProfile from "@/components/instructor-view/profile";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { AuthContext } from "@/context/auth-context";
import { InstructorContext } from "@/context/instructor-context";
import { fetchInstructorCourseListService } from "@/services";
import { BarChart, Book, DollarSign, FileText, LogOut, Settings, Tag, Upload, UserCircle, Users } from "lucide-react";
import { useContext, useEffect, useState } from "react";

function InstructorDashboardpage() {
  const [activeTab, setActiveTab] = useState("profile");
  const { resetCredentials } = useContext(AuthContext);
  const { instructorCoursesList, setInstructorCoursesList } =
    useContext(InstructorContext);

  async function fetchAllCourses() {
    const response = await fetchInstructorCourseListService();
    console.log(response, "response");
    if (response?.success) setInstructorCoursesList(response?.data?.courses || []);
  }

  useEffect(() => {
    fetchAllCourses();
  }, []);

const menuItems = [
  {
    icon: UserCircle,
    label: "Profile",
    value: "profile",
    component: <InstructorProfile listOfCourses={instructorCoursesList} />,
  },
  {
    icon: BarChart,
    label: "Dashboard",
    value: "dashboard",
    component: <InstructorDashboard listOfCourses={instructorCoursesList} />,
  },
  {
    icon: Book,
    label: "Courses",
    value: "courses",
    component: <InstructorCourses listOfCourses={instructorCoursesList} />,
  },
  {
    icon: Users,
    label: "Students",
    value: "students",
    component: <div>Student Analytics & Messaging (Coming soon)</div>,
  },
  {
    icon: DollarSign,
    label: "Earnings",
    value: "earnings",
    component: <div>Earnings Overview (Coming soon)</div>,
  },
  {
    icon: Upload,
    label: "Resources",
    value: "resources",
    component: <div>Upload and Manage Resources (Coming soon)</div>,
  },
  {
    icon: Tag, 
    label: "Promotions",
    value: "promotions",
    component: <div>Promotion Management (Coming soon)</div>,
  },
  {
    icon: Settings,
    label: "Settings",
    value: "settings",
    component: <div>Account & Teaching Settings (Coming soon)</div>,
  },
  {
    icon: LogOut,
    label: "Logout",
    value: "logout",
    component: null,
  },
];


  function handleLogout() {
    resetCredentials();
    sessionStorage.clear();
  }

  console.log(instructorCoursesList, "instructorCoursesList");

  return (
    <div className="flex h-full min-h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow-md hidden md:block">
        <div className="p-4">
          <h2 className="text-2xl font-bold mb-4">Instructor View</h2>
          <nav>
            {menuItems.map((menuItem) => (
              <Button
                className="w-full justify-start mb-2"
                key={menuItem.value}
                variant={activeTab === menuItem.value ? "secondary" : "ghost"}
                onClick={
                  menuItem.value === "logout"
                    ? handleLogout
                    : () => setActiveTab(menuItem.value)
                }
              >
                <menuItem.icon className="mr-2 h-4 w-4" />
                {menuItem.label}
              </Button>
            ))}
          </nav>
        </div>
      </aside>
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            {menuItems.map((menuItem) => (

              <TabsContent  value={menuItem.value}>
                {menuItem.component !== null ? menuItem.component : null}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </main>
    </div>
  );
}

export default InstructorDashboardpage;
