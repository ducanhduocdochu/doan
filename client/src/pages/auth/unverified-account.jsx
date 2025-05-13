import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "@/context/auth-context";

function UnverifiedAccountPage() {
  const navigate = useNavigate();
  const { resetCredentials } = useContext(AuthContext);

  function handleLogout() {
    resetCredentials();
    sessionStorage.clear();
    navigate("/auth");
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background text-center px-4">
      <div className="max-w-md bg-white p-6 rounded-lg shadow-md border">
        <div className="flex justify-center mb-4 text-yellow-500">
          <AlertTriangle className="w-12 h-12" />
        </div>
        <h2 className="text-xl font-semibold mb-2">Your account is not verified</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Please check your email inbox for a verification link to activate your account.
        </p>
        <Button onClick={handleLogout} className="w-full">
          Sign Out
        </Button>
      </div>
    </div>
  );
}

export default UnverifiedAccountPage;
