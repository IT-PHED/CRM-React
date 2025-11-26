import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { updateProfile } from "@/services/authService";

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    StaffName: user?.StaffName || user?.name || "",
    Email: user?.Email || user?.email || "",
    PhoneNo: user?.PhoneNo || user?.phone || "",
    StaffId: user?.StaffId || user?.StaffID || "",
    Role: user?.Role || user?.role || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const result = await updateProfile(form);
      // try to pick updated user from result
      const updated = result?.User || result?.user || result || form;
      updateUser(updated);
      setSuccess("Profile updated");
    } catch (err: any) {
      setError(err?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl">
      <h1 className="text-2xl font-bold mb-4">My Profile</h1>
      <div className="bg-background p-6 rounded-md shadow-sm">
        <div className="flex items-center gap-4 mb-4">
          <Avatar className="h-16 w-16">
            {user?.Photo || user?.avatar || user?.picture ? (
              <AvatarImage src={user?.Photo || user?.avatar || user?.picture} />
            ) : (
              <AvatarFallback>
                {(user?.StaffName || user?.name || "User")[0]}
              </AvatarFallback>
            )}
          </Avatar>
          <div>
            <div className="text-lg font-semibold">
              {user?.StaffName || user?.name || "Guest User"}
            </div>
            <div className="text-sm text-muted-foreground">
              {user?.Email || user?.email}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <label className="block">
            <div className="text-xs text-muted-foreground mb-1">Full name</div>
            <Input
              name="StaffName"
              value={form.StaffName}
              onChange={handleChange}
            />
          </label>
          <label className="block">
            <div className="text-xs text-muted-foreground mb-1">Email</div>
            <Input name="Email" value={form.Email} onChange={handleChange} />
          </label>
          <label className="block">
            <div className="text-xs text-muted-foreground mb-1">Phone</div>
            <Input
              name="PhoneNo"
              value={form.PhoneNo}
              onChange={handleChange}
            />
          </label>
          <label className="block">
            <div className="text-xs text-muted-foreground mb-1">Staff ID</div>
            <Input
              name="StaffId"
              value={form.StaffId}
              onChange={handleChange}
            />
          </label>
          <label className="block md:col-span-2">
            <div className="text-xs text-muted-foreground mb-1">Role</div>
            <Input name="Role" value={form.Role} onChange={handleChange} />
          </label>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <Button onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save changes"}
          </Button>
          {error ? (
            <span className="text-sm text-destructive">{error}</span>
          ) : null}
          {success ? (
            <span className="text-sm text-success">{success}</span>
          ) : null}
        </div>
      </div>
    </div>
  );
}
