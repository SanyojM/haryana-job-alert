import { useState } from 'react';
import type { NextPage } from 'next';
import { Card, CardBody } from "@heroui/card";
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableColumn, 
  TableRow, 
  TableCell 
} from "@heroui/table";
import { Button } from "@heroui/button";
import { 
  Dropdown, 
  DropdownTrigger, 
  DropdownMenu, 
  DropdownItem 
} from "@heroui/dropdown";
import { Chip } from "@heroui/chip";
import { Trash2, UserCog, ChevronDown } from 'lucide-react';

// 1. Define the User type (based on your API docs)
type User = {
  id: string;
  fullName: string;
  email: string;
  role: 'admin' | 'user'; // Assuming 'user' is the other role
};

// 2. Create dummy data
const DUMMY_USERS: User[] = [
  { id: '1', fullName: 'Sahil Mor', email: 'sahil@example.com', role: 'admin' },
  { id: '2', fullName: 'John Doe', email: 'john.doe@example.com', role: 'user' },
  { id: '3', fullName: 'Jane Smith', email: 'jane.smith@example.com', role: 'user' },
  { id: '4', fullName: 'Admin User', email: 'admin@example.com', role: 'admin' },
];

// 3. Create the Page Component
const AdminUsersPage: NextPage = () => {
  const [users, setUsers] = useState<User[]>(DUMMY_USERS);

  // Handle changing the user's role (updates local state for now)
  const handleRoleChange = (userId: string, newRole: 'admin' | 'user') => {
    setUsers(prevUsers =>
      prevUsers.map(user =>
        user.id === userId ? { ...user, role: newRole } : user
      )
    );
    // In a real app, you would also make an API call here
    // e.g., api.put(`/users/${userId}/role`, { role: newRole }, token)
    console.log(`Changed user ${userId} to ${newRole}`);
  };

  // Handle deleting a user (updates local state for now)
  const handleDeleteUser = (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
      // In a real app, you would also make an API call here
      // e.g., api.delete(`/users/${userId}`, token)
      console.log(`Deleted user ${userId}`);
    }
  };

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Manage Users</h1>
      <Card>
        <CardBody>
          <Table>
            <TableHeader>
              <TableColumn>Full Name</TableColumn>
              <TableColumn>Email</TableColumn>
              <TableColumn>Role</TableColumn>
              <TableColumn className="text-right">Actions</TableColumn>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.fullName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Chip 
                      color={user.role === 'admin' ? 'primary' : 'default'}
                      className={user.role === 'admin' ? 'bg-blue-100 text-blue-800' : ''}
                    >
                      {user.role}
                    </Chip>
                  </TableCell>
                  <TableCell className="flex gap-1 justify-end">
                    
                    {/* --- Role Change Dropdown --- */}
                    <Dropdown>
                      <DropdownTrigger>
                        <Button variant="light" size="sm">
                          <UserCog className="h-4 w-4 mr-1" />
                          Change Role
                          <ChevronDown className="h-4 w-4 ml-1" />
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu 
                        aria-label="Change role"
                        onAction={(key) => handleRoleChange(user.id, key as 'admin' | 'user')}
                      >
                        <DropdownItem key="admin">Admin</DropdownItem>
                        <DropdownItem key="user">User</DropdownItem>
                      </DropdownMenu>
                    </Dropdown>

                    {/* --- Delete Button --- */}
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-red-500 hover:text-red-600"
                      onPress={() => handleDeleteUser(user.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>

                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>
    </div>
  );
};

export default AdminUsersPage;