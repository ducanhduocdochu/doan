import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Pencil } from "lucide-react";
import FormControls from "../common-form/form-controls";
import { mediaUploadService, updateInstructorProfileService } from "@/services";
import { toast } from "@/hooks/use-toast";

function EditProfileDialog({ profile, setProfile }) {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [formData, setFormData] = useState({
    bio: profile.instructor_profile.bio || "",
    occupation: profile.instructor_profile.occupation || "",
    education: profile.instructor_profile.education || "",
    language: profile.instructor_profile.language || "",
    paypal_email: profile.instructor_profile.paypal_email || "",
    phone: profile.instructor_profile.phone || "",
    address: profile.instructor_profile.address || "",
    linkedin_url: profile.instructor_profile.linkedin_url || "",
    website_url: profile.instructor_profile.website_url || "",
    cv: "", // sẽ xử lý riêng nếu là File
  });

  const formControls = [
    { name: "occupation", label: "Occupation", componentType: "input", type: "text" },
    { name: "education", label: "Education", componentType: "input", type: "text" },
    { name: "language", label: "Languages", componentType: "input", type: "text" },
    { name: "paypal_email", label: "PayPal Email", componentType: "input", type: "text" },
    { name: "phone", label: "Phone", componentType: "input", type: "text" },
    { name: "address", label: "Address", componentType: "input", type: "text" },
    { name: "linkedin_url", label: "LinkedIn URL", componentType: "input", type: "text" },
    { name: "website_url", label: "Website URL", componentType: "input", type: "text" },
    { name: "cv", label: "CV File", componentType: "file" },
    { name: "bio", label: "Bio", componentType: "textarea" },
  ];

  const handleSave = async () => {

    // Nếu có file mới cho CV
    if (formData.cv instanceof File) {
      const formDataUpload = new FormData();
      formDataUpload.append("file", formData.cv);
      const uploadRes = await mediaUploadService(formDataUpload, (percent) => {
        setUploadProgress(percent);
      });

      if (!uploadRes.success || !uploadRes.data.url) {
        throw new Error("Upload cv thất bại");
      }
      
      console.log("url", uploadRes.data.url);
      const updateRes = await updateInstructorProfileService({
        ...formData,
        cv: uploadRes.data.url,
      });
      console.log("updateRes", {
        ...formData,
        cv: uploadRes.data.url,
      });

      if (!updateRes.success) throw new Error("Update cv thất bại");

      setProfile((prev) => ({
        ...prev,
        instructor_profile: {
          ...prev.instructor_profile,
          cv: uploadRes.data.url,
        },
      }));

      toast({
        title: "Thông tin đã được cập nhật",
        description: "Thay đổi đã được lưu thành công.",
        variant: "default",
      });
    }
    else {
      const updateRes = await updateInstructorProfileService(formData);
      if (!updateRes.success) throw new Error("Update CV thất bại");
       toast({
        title: "Thông tin đã được cập nhật",
        description: "Thay đổi đã được lưu thành công.",
        variant: "default",
      });
    }

    // Gửi payload lên server tại đây
    // await axios.put('/api/instructor/profile', payload);

    // Cập nhật local UI
    setProfile((prev) => ({
      ...prev,
      instructor_profile: {
        ...prev.instructor_profile,
        ...formData,
      },
    }));
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button className="flex items-center gap-1 text-sm text-blue-600 hover:underline">
          <Pencil className="w-4 h-4" /> Edit Profile
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 z-40" />
        <Dialog.Content className="fixed top-1/2 left-1/2 z-50 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg space-y-6 max-h-[90vh] overflow-y-auto">
          <Dialog.Title className="text-xl font-semibold">
            Edit Instructor Profile
          </Dialog.Title>

          <FormControls
            formControls={formControls}
            formData={formData}
            setFormData={setFormData}
          />

          <div className="flex justify-end gap-2">
            <Dialog.Close asChild>
              <button className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
            </Dialog.Close>
            <Dialog.Close asChild>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded"
                onClick={handleSave}
              >
                Save Changes
              </button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default EditProfileDialog;
