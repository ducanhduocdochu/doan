import { useEffect, useState, useContext, useRef } from "react";
import { AuthContext } from "@/context/auth-context";
import AvatarEditor from "react-avatar-editor";
import {
  Briefcase,
  GraduationCap,
  Languages,
  Phone,
  MapPin,
  Download,
  Linkedin,
  Globe,
  ShieldCheck,
  Pencil,
  Loader2,
  Users,
  Star,
  LayoutList,
  Camera,
} from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { getInstructorProfileService, mediaUploadService, updateInstructorProfileService } from "@/services";
import EditProfileDialog from "./edit-profile";
import { toast } from "@/hooks/use-toast";

function InstructorProfile() {
  const { auth } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);


  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await getInstructorProfileService(auth.user.id);
        console.log(res, "res");
        console.log(auth.user.id, "auth.user.id");
        if (res.success) setProfile(res.data);
      } catch (err) {
        console.error("Failed to load profile", err);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        <span>Loading profile...</span>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center text-red-500">Failed to load profile.</div>
    );
  }

// const handleAvatarChange = async (event) => {
//   const file = event.target.files[0];
//   if (!file) return;

//   const reader = new FileReader();
//   reader.onloadend = () => {
//     setProfile((prev) => ({
//       ...prev,
//       instructor_profile: {
//         ...prev.instructor_profile,
//         avatar_url: reader.result,
//       },
//     }));
//   };
//   reader.readAsDataURL(file);

//   try {
//     const formData = new FormData();
//     formData.append("file", file);

//     console.log(formData, "formData");
//     const uploadRes = await mediaUploadService(formData, (percent) => {
//       setUploadProgress(percent);
//     });
//     if (!uploadRes.success || !uploadRes.url) {
//       throw new Error("Upload avatar failed");
//     }

//     // const updateRes = await updateInstructorAvatarUrlService(uploadRes.url);
//     // if (!updateRes.success) {
//     //   throw new Error("Update avatar_url in DB failed");
//     // }

//     setProfile((prev) => ({
//       ...prev,
//       instructor_profile: {
//         ...prev.instructor_profile,
//         avatar_url: uploadRes.url,
//       },
//     }));
//   } catch (err) {
//     console.error("Avatar update error:", err);
//   }
// };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:space-x-8">
        <AvatarDialog profile={profile} setProfile={setProfile} />
        <div className="mt-4 md:mt-0">
          <h1 className="text-3xl font-bold">{profile.user_name}</h1>
          <p className="text-muted-foreground text-sm">{profile.user_email}</p>
          {profile.is_verify && (
            <p className="text-green-600 flex items-center gap-1 text-sm font-medium mt-1">
              <ShieldCheck className="w-4 h-4" /> Verified Instructor
            </p>
          )}
        </div>
        <EditProfileDialog profile={profile} setProfile={setProfile} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatBox
          icon={<Users className="w-5 h-5" />}
          label="Students"
          // value={profile.total_students.toLocaleString()}
          value={1200}
        />
        <StatBox
          icon={<LayoutList className="w-5 h-5" />}
          label="Courses"
          // value={profile.total_courses}
          value={5}
        />
        <StatBox
          icon={<Star className="w-5 h-5 text-yellow-500" />}
          label="Rating"
          // value={`${profile.rating_avg} / 5`}
          value={`4.8 / 5`}
        />
      </div>

      <div className="border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/10 p-6 rounded-md mt-8">
        <h3 className="text-lg font-semibold mb-2 text-blue-800 dark:text-blue-300">
          About
        </h3>
        <p className="text-gray-700 dark:text-gray-200 italic whitespace-pre-line leading-relaxed">
          {profile.instructor_profile.bio}
        </p>
      </div>

      {/* Box 1 */}
      <InfoBox
        title="Professional Details"
        fields={[
          {
            icon: Briefcase,
            label: "Occupation",
            value: profile.instructor_profile.occupation,
          },
          {
            icon: GraduationCap,
            label: "Education",
            value: profile.instructor_profile.education,
          },
          {
            icon: Languages,
            label: "Languages",
            value: profile.instructor_profile.language,
          },
        ]}
      />

      {/* Box 2 */}
      <InfoBox
        title="Contact & Links"
        fields={[
          {
            icon: Phone,
            label: "Phone",
            value: profile.instructor_profile.phone,
          },
          {
            icon: MapPin,
            label: "Address",
            value: profile.instructor_profile.address,
          },
          {
            icon: Download,
            label: "CV",
            value: (
              <a
                href={profile.instructor_profile.cv}
                className="text-blue-600 underline"
                target="_blank"
              >
                Download CV
              </a>
            ),
          },
          {
            icon: Linkedin,
            label: "LinkedIn",
            value: (
              <a
                href={profile.linkedin_url}
                className="text-blue-600 underline"
                target="_blank"
              >
                View Profile
              </a>
            ),
          },
          {
            icon: Globe,
            label: "Website",
            value: (
              <a
                href={profile.website_url}
                className="text-blue-600 underline"
                target="_blank"
              >
                {profile.website_url}
              </a>
            ),
          },
        ]}
      />
    </div>
  );
}

function InfoBox({ title, fields }) {
  return (
    <div className="border rounded-xl shadow-sm p-6 bg-white relative">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">{title}</h3>
      </div>
      <div className="space-y-4">
        {fields.map((field, i) => (
          <div key={i} className="flex items-start gap-3">
            <field.icon className="w-4 h-4 mt-1 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">{field.label}</p>
              <p className="text-muted-foreground text-sm">{field.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatBox({ icon, label, value }) {
  return (
    <div className=" bg-white rounded-xl p-4 flex items-center space-x-4 shadow-sm border">
      <div className="p-2 rounded-full bg-muted shadow text-gray-600">
        {icon}
      </div>
      <div>
        <p className="text-lg font-bold">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

function AvatarDialog({ profile, setProfile }) {
  const [image, setImage] = useState(null);
  const [scale, setScale] = useState(1.2);
  const editorRef = useRef(null);
    const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
  };
const handleSave = () => {
  if (!editorRef.current) return;

  const canvas = editorRef.current.getImageScaledToCanvas();

  canvas.toBlob(async (blob) => {
    if (!blob) {
      toast({
        title: "Error",
        description: "Không thể tạo ảnh từ canvas.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", blob, "avatar.png");

      const uploadRes = await mediaUploadService(formData, (percent) => {
        setUploadProgress(percent);
      });

      if (!uploadRes.success || !uploadRes.data.url) {
        throw new Error("Upload avatar thất bại");
      }

      const updateRes = await updateInstructorProfileService({
        avatar_url: uploadRes.data.url,
      });

      if (!updateRes.success) throw new Error("Update avatar_url thất bại");

      setProfile((prev) => ({
        ...prev,
        instructor_profile: {
          ...prev.instructor_profile,
          avatar_url: uploadRes.data.url,
        },
      }));

      toast({
        title: "Ảnh đại diện đã được cập nhật",
        description: "Thay đổi đã được lưu thành công.",
        variant: "default",
      });
    } catch (err) {
      console.error("❌ Upload error:", err);
      toast({
        title: "Lỗi cập nhật ảnh",
        description: err?.message || "Có lỗi xảy ra trong quá trình cập nhật.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, "image/png");
};

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <div className="relative group w-32 h-32 rounded-full overflow-hidden border shadow cursor-pointer">
          <img
            src={
              profile.instructor_profile.avatar_url ||
              "https://cdn-icons-png.flaticon.com/512/149/149071.png"
            }
            alt={profile.user_name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
            <Camera className="w-6 h-6 text-white" />
          </div>
        </div>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 shadow-lg space-y-4">
          <Dialog.Title className="text-xl font-semibold">
            Cập nhật ảnh đại diện
          </Dialog.Title>

          {/* Avatar Editor */}
          <div className="flex justify-center">
            {image ? (
              <AvatarEditor
                ref={editorRef}
                image={image}
                width={180}
                height={180}
                border={30}
                borderRadius={90}
                scale={scale}
                className="rounded-full shadow"
              />
            ) : (
              <div className="w-40 h-40 rounded-full border bg-muted flex items-center justify-center text-muted-foreground">
                Chưa chọn ảnh
              </div>
            )}
          </div>

          {/* Chọn ảnh */}
          <input type="file" accept="image/*" onChange={handleFileChange} />

          {/* Zoom */}
          {image && (
            <div className="flex items-center space-x-2">
              <span className="text-sm">Zoom:</span>
              <input
                type="range"
                min="1"
                max="3"
                step="0.1"
                value={scale}
                onChange={(e) => setScale(parseFloat(e.target.value))}
              />
            </div>
          )}

          {isUploading && (
  <div className="mt-2">
    <div className="h-2 w-full bg-gray-200 rounded">
      <div
        className="h-full bg-blue-500 rounded transition-all"
        style={{ width: `${uploadProgress}%` }}
      ></div>
    </div>
    <p className="text-sm text-muted-foreground mt-1 text-center">
      Đang tải lên: {uploadProgress}%
    </p>
  </div>
)}

          {/* Buttons */}
          <div className="flex justify-end gap-2 pt-2">
            <Dialog.Close asChild>
              <button className="px-4 py-2 bg-gray-200 rounded">Hủy</button>
            </Dialog.Close>
            <Dialog.Close asChild>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded"
                onClick={handleSave}
              >
                Lưu ảnh
              </button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default InstructorProfile;
