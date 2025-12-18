import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

export default function ProfileOverview() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="max-w-5xl p-6 space-y-6">
      {/* HEADER */}
      <Card>
        <CardContent className="flex items-center gap-6 py-6">
          <Avatar className="h-20 w-20">
            {user.Photo || user.avatar || user.picture ? (
              <AvatarImage src={user.Photo || user.avatar || user.picture} />
            ) : (
              <AvatarFallback className="text-xl">
                {user.userFName?.[0]}
              </AvatarFallback>
            )}
          </Avatar>

          <div className="flex-1">
            <h2 className="text-2xl font-bold">{user.userFName}</h2>
            <p className="text-muted-foreground">{user.emailId}</p>

            <div className="mt-2 flex gap-2">
              <Badge variant="secondary">{user.area_Type}</Badge>
              <Badge variant={user.isVerified ? "default" : "destructive"}>
                {user.isVerified ? "Verified" : "Unverified"}
              </Badge>
              <Badge variant="outline">
                Status: {user.status === "A" ? "Active" : "Inactive"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* DETAILS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* PERSONAL INFO */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <ReadonlyField label="Full Name" value={user.userFName} />
            <ReadonlyField label="Staff ID" value={user.userName} />
            <ReadonlyField label="Phone Number" value={user.phoneNo} />
            <ReadonlyField label="Email" value={user.emailId} />
          </CardContent>
        </Card>

        {/* ORGANIZATION */}
        <Card>
          <CardHeader>
            <CardTitle>Organization</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <ReadonlyField label="Department" value={user.departmentName} />
            <ReadonlyField label="Department ID" value={user.departmentId} />
            <ReadonlyField label="Group ID" value={String(user.groupId)} />
            <ReadonlyField label="Region ID" value={user.region_Id} />
          </CardContent>
        </Card>

        {/* SECURITY */}
        <Card>
          <CardHeader>
            <CardTitle>Security</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <ReadonlyField label="Role ID" value={String(user.smf_role_id)} />
            <ReadonlyField
              label="OTP Last Verified"
              value={user.otpLastVerifiedTime}
            />
            <ReadonlyField
              label="Last IP Address"
              value={user.lastIpAddress || "N/A"}
            />
          </CardContent>
        </Card>

        {/* ACTIVITY */}
        <Card>
          <CardHeader>
            <CardTitle>Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <ReadonlyField label="Account Created" value={user.createdDate} />
            <ReadonlyField label="Last Login" value={user.lstLoginDate} />
            <ReadonlyField
              label="Password Updated"
              value={user.lstPswdUpdatedDate || "N/A"}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

/* ------------------ */
/* Read-only Field */
/* ------------------ */
function ReadonlyField({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <div className="text-xs text-muted-foreground mb-1">{label}</div>
      <Input value={value || ""} disabled />
    </div>
  );
}
