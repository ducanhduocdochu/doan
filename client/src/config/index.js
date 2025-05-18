import { Star, StarHalf, StarOff } from "lucide-react";

export const signUpFormControls = [
  {
    name: "userName",
    label: "User Name",
    placeholder: "Enter your user name",
    type: "text",
    componentType: "input",
  },
  {
    name: "userEmail",
    label: "User Email",
    placeholder: "Enter your user email",
    type: "email",
    componentType: "input",
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Enter your password",
    type: "password",
    componentType: "input",
  },
  {
    name: "confirmPassword",
    label: "Confirm password",
    placeholder: "Enter again your password",
    type: "password",
    componentType: "input",
  },
];

export const signUpInstructorFormControls = [
  {
    name: "userName",
    label: "User Name",
    placeholder: "Enter your user name",
    type: "text",
    componentType: "input",
  },
  {
    name: "userEmail",
    label: "User Email",
    placeholder: "Enter your user email",
    type: "email",
    componentType: "input",
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Enter your password",
    type: "password",
    componentType: "input",
  },
  {
    name: "confirmPassword",
    label: "Confirm password",
    placeholder: "Enter again your password",
    type: "password",
    componentType: "input",
  },
  {
    name: "bio",
    label: "Bio",
    placeholder: "Short description about you",
    type: "text",
    componentType: "textarea",
  },
  {
    name: "occupation",
    label: "Occupation",
    placeholder: "What is your current role?",
    type: "text",
    componentType: "input",
  },
  {
    name: "education",
    label: "Education",
    placeholder: "Your educational background",
    type: "text",
    componentType: "input",
  },
  {
    name: "language",
    label: "Language",
    placeholder: "Language(s) you will teach in",
    type: "text",
    componentType: "input",
  },
  {
    name: "paypalEmail",
    label: "PayPal Email",
    placeholder: "Your PayPal email for payouts",
    type: "email",
    componentType: "input",
  },
  {
    name: "cv",
    label: "CV",
    placeholder: "Upload your CV file",
    type: "file", // ✅ đánh dấu là file
    componentType: "file", // ✅ thêm componentType mới
  },
];

export const signInFormControls = [
  {
    name: "userEmail",
    label: "User Email",
    placeholder: "Enter your user email",
    type: "email",
    componentType: "input",
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Enter your password",
    type: "password",
    componentType: "input",
  },
];

export const initialSignInFormData = {
  userEmail: "",
  password: "",
};

export const initialSignUpFormData = {
  userName: "",
  userEmail: "",
  password: "",
  confirmPassword: "",
};

export const initialSignUpForInstructorFormData = {
  userName: "",
  userEmail: "",
  password: "",
  confirmPassword: "",
  bio: "",
  occupation: "",
  education: "",
  language: "",
  paypalEmail: "",
  cv: null,
};

export const languageOptions = [
  { id: "english", label: "English" },
  { id: "spanish", label: "Spanish" },
  { id: "french", label: "French" },
  { id: "german", label: "German" },
  { id: "chinese", label: "Chinese" },
  { id: "japanese", label: "Japanese" },
  { id: "korean", label: "Korean" },
  { id: "portuguese", label: "Portuguese" },
  { id: "arabic", label: "Arabic" },
  { id: "russian", label: "Russian" },
  { id: "vietnamese", label: "Vietnamese" },
];

export const courseLevelOptions = [
  { id: "beginner", label: "Beginner" },
  { id: "intermediate", label: "Intermediate" },
  { id: "advanced", label: "Advanced" },
];

export const courseCategories = [
  { id: "web-development", label: "Web Development" },
  { id: "backend-development", label: "Backend Development" },
  { id: "data-science", label: "Data Science" },
  { id: "machine-learning", label: "Machine Learning" },
  { id: "artificial-intelligence", label: "Artificial Intelligence" },
  { id: "cloud-computing", label: "Cloud Computing" },
  { id: "cyber-security", label: "Cyber Security" },
  { id: "mobile-development", label: "Mobile Development" },
  { id: "game-development", label: "Game Development" },
  { id: "software-engineering", label: "Software Engineering" },
  { id: "language", label: "Language" },
  { id: "business", label: "Business" },
  { id: "marketing", label: "Marketing" },
  { id: "finance", label: "Finance" },
  { id: "photography", label: "Photography" },
  { id: "graphic-design", label: "Graphic Design" },
  { id: "personal-development", label: "Personal Development" },
];

export const courseLandingPageFormControls = [
  {
    name: "title",
    label: "Title",
    componentType: "input",
    type: "text",
    placeholder: "Enter course title",
  },
  {
    name: "category",
    label: "Category",
    componentType: "select",
    type: "text",
    placeholder: "",
    options: courseCategories,
  },
  {
    name: "level",
    label: "Level",
    componentType: "select",
    type: "text",
    placeholder: "",
    options: courseLevelOptions,
  },
  {
    name: "primaryLanguage",
    label: "Primary Language",
    componentType: "select",
    type: "text",
    placeholder: "",
    options: languageOptions,
  },
  {
    name: "subtitle",
    label: "Subtitle",
    componentType: "input",
    type: "text",
    placeholder: "Enter course subtitle",
  },
  {
    name: "description",
    label: "Description",
    componentType: "textarea",
    type: "text",
    placeholder: "Enter course description",
  },
  {
    name: "pricing",
    label: "Pricing",
    componentType: "input",
    type: "number",
    placeholder: "Enter course pricing",
  },
  {
    name: "objectives",
    label: "Objectives",
    componentType: "textarea",
    type: "text",
    placeholder: "Enter course objectives",
  },
  {
    name: "welcomeMessage",
    label: "Welcome Message",
    componentType: "textarea",
    placeholder: "Welcome message for students",
  },
];

export const courseLandingInitialFormData = {
  title: "",
  category: "",
  level: "",
  primaryLanguage: "",
  subtitle: "",
  description: "",
  pricing: "",
  objectives: "",
  welcomeMessage: "",
  image: "",
};

export const courseCurriculumInitialFormData = [
  {
    title: "",
    videoUrl: "",
    freePreview: false,
    public_id: "",
  },
];

export const sortOptions = [
  { id: "price-lowtohigh", label: "Price: Low to High" },
  { id: "price-hightolow", label: "Price: High to Low" },
  { id: "title-atoz", label: "Title: A to Z" },
  { id: "title-ztoa", label: "Title: Z to A" },
];

export const filterOptions = {
  category: courseCategories,
  level: courseLevelOptions,
  primaryLanguage: languageOptions,
};

export const getLevelColor = (level) => {
  switch (level.toLowerCase()) {
    case "beginner":
      return "text-green-600 font-semibold";
    case "intermediate":
      return "text-yellow-600 font-semibold";
    case "advanced":
      return "text-red-600 font-semibold";
    default:
      return "text-gray-600";
  }
};

export const getCategoryColor = (id) => {
  const colorMap = {
    "web-development": "border-blue-500 text-blue-500",
    "backend-development": "border-indigo-500 text-indigo-500",
    "data-science": "border-purple-500 text-purple-500",
    "machine-learning": "border-pink-500 text-pink-500",
    "artificial-intelligence": "border-red-500 text-red-500",
    "cloud-computing": "border-cyan-500 text-cyan-500",
    "cyber-security": "border-orange-500 text-orange-500",
    "mobile-development": "border-green-500 text-green-500",
    "game-development": "border-amber-500 text-amber-500",
    "software-engineering": "border-emerald-500 text-emerald-500",
    language: "border-teal-500 text-teal-500",
    business: "border-yellow-500 text-yellow-500",
    marketing: "border-pink-600 text-pink-600",
    finance: "border-lime-500 text-lime-500",
    photography: "border-violet-500 text-violet-500",
    "graphic-design": "border-fuchsia-500 text-fuchsia-500",
    "personal-development": "border-rose-500 text-rose-500",
  };

  return colorMap[id] || "border-gray-400 text-gray-600";
};

export const toSlug = (text) => {
  return text
    .toLowerCase() // viết thường hết
    .trim() // bỏ khoảng trắng đầu cuối
    .replace(/\s+/g, "-") // thay khoảng trắng (1 hoặc nhiều) thành dấu '-'
    .replace(/[^\w\-]+/g, "") // loại bỏ ký tự không phải chữ số, chữ cái, hoặc dấu '-'
    .replace(/\-\-+/g, "-"); // loại bỏ dấu '-' lặp lại liên tiếp
};


