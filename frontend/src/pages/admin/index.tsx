import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/dist/client/link";

export default function AdminIndex() {
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Admin Dashboard</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>Welcome to the admin panel. Use the navigation to manage the site.</p>
                </CardContent>
            </Card>
        </div>
    );
}