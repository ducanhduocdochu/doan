import { useEffect, useState, useContext } from "react";
import { AuthContext } from "@/context/auth-context";
// import { getInstructorProfileService } from "@/services";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

function InstructorProfile() {
  const { auth } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  // useEffect(() => {
  //   async function fetchProfile() {
  //     try {
  //       // const res = await getInstructorProfileService();
  //       if (res.success) {
  //         setProfile(res.data);
  //       }
  //     } catch (err) {
  //       console.error("Failed to load profile", err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   }
  //   fetchProfile();
  // }, []);

  // if (loading) {
  //   return (
  //     <div className="flex justify-center items-center h-full">
  //       <Loader2 className="h-6 w-6 animate-spin" />
  //       <span className="ml-2">Loading profile...</span>
  //     </div>
  //   );
  // }

  // if (!profile) {
  //   return <div className="text-red-500">Failed to load profile.</div>;
  // }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Profile</h1>
      <Card>
        <CardHeader>
          <CardTitle>Ducanh</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p><strong>Email:</strong> tducanh263@gmail.com</p>
          <p><strong>Bio:</strong> aaaaaaaaaaaaaaaa</p>
          <p><strong>Occupation:</strong> aaaaaaaaaaaaaaaa</p>
          <p><strong>Education:</strong> aaaaaaaaaaaaaaaa</p>
          <p><strong>Language:</strong> aaaaaaaaaaaaaaaa</p>
          <p><strong>PayPal Email:</strong> aaaaaaaaaaaaaaaa</p>
          <p><strong>CV:</strong> <a href={'aaaaaaa'} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">Download CV</a></p>
        </CardContent>
      </Card>
    </div>
  );
}

export default InstructorProfile;
