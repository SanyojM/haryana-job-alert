import {Card, CardHeader, CardBody, CardFooter} from "@heroui/card";

export default function AdminIndex() {
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <Card className="w-full max-w-md bg-white border border-gray-300 rounded-xl p-4">
                <CardHeader>
                    <h1>Admin Dashboard</h1>
                </CardHeader>
                <CardBody>
                    <p>Welcome to the admin panel. Use the navigation to manage the site.</p>
                </CardBody>
            </Card>
        </div>
    );
}