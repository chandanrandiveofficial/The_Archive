import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Mail, Lock } from "lucide-react";

export default function ProfileSettings() {
  const [profile, setProfile] = useState({
    firstName: "Alex",
    lastName: "Doe",
    email: "alex.doe@admin.com",
    avatar: "/avatar.png",
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold">Profile Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your account details and preferences.
        </p>
      </div>

      {/* PROFILE CARD */}
      <Card>
        <CardContent className="flex flex-col sm:flex-row sm:items-center gap-4 py-6">
          <Avatar className="h-16 w-16">
            <AvatarImage
              src="https://github.com/evilrabbit.png"
              alt="@evilrabbit"
            />
            <AvatarFallback>AD</AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <p className="font-medium">Alex Doe</p>
            <p className="text-sm text-muted-foreground">
              alex.doe@admin.com · Administrator
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              <Button size="sm">Upload New Photo</Button>
              <Button size="sm" variant="outline">
                Remove
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* PERSONAL INFO */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 font-medium">
          <Mail className="h-4 w-4" />
          Personal Information
        </div>
        <Separator />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            placeholder="First Name"
            value={profile.firstName}
            onChange={(e) =>
              setProfile({ ...profile, firstName: e.target.value })
            }
          />
          <Input
            placeholder="Last Name"
            value={profile.lastName}
            onChange={(e) =>
              setProfile({ ...profile, lastName: e.target.value })
            }
          />
        </div>

        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-9"
            value={profile.email}
            disabled
          />
        </div>
      </div>

      {/* SECURITY */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 font-medium">
          <Lock className="h-4 w-4" />
          Security
        </div>
        <Separator />

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm">Password</CardTitle>
            <Button variant="link" size="sm">
              Reset via Email
            </Button>
          </CardHeader>

          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input type="password" value="password" disabled />
            <Input type="password" placeholder="Enter new password" />
          </CardContent>
        </Card>
      </div>

      {/* STICKY FOOTER */}
      <div className="fixed bottom-0 left-0 right-0 bg-black text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row gap-3 sm:gap-0 sm:justify-between sm:items-center">
          <p className="text-sm text-gray-400">
            Unsaved changes will be lost
          </p>

          <div className="flex w-full sm:w-auto gap-2 justify-end">
            <Button  className="cursor-pointer">
              Cancel
            </Button>
            <Button className="cursor-pointer">
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
