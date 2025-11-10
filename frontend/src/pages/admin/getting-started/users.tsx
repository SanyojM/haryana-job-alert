import { useState, useEffect } from 'react';
import type { NextPage } from 'next';
import { api } from '@/lib/api'; 
import { useAuth } from '@/context/AuthContext'; 
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

type User = {
  id: number;
  full_name: string;
  email: string;
  role: 'admin' | 'student';
};

const AdminUsersPage: NextPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const { token, isLoading: isAuthLoading, user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthLoading) {
      return; 
    }

    if (!token) {
      setIsLoading(false);
      setError('You are not authorized to view this page.');
      return;
    }

    if (!user || user.role !== 'admin') {
    setIsLoading(false);
    setError('You are not authorized to view this page.');
    return;
  }

    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const fetchedUsers = await api.get('/users', token);
        setUsers(fetchedUsers);
        setError(null);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to fetch users.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();

  }, [token, user, isAuthLoading]);

  const handleRoleChange = async (userId: number, newRole: 'admin' | 'student') => {
    const authToken = token || undefined;
    const oldUsers = users; 

    setUsers(prevUsers =>
      prevUsers.map(user =>
        user.id === userId ? { ...user, role: newRole } : user
      )
    );

    try {
      await api.put(`/users/${userId}`, { role: newRole }, authToken);
      console.log(`Changed user ${userId} to ${newRole}`);
    } catch (err: unknown) {
      console.error('Error updating role:', err);
      setUsers(oldUsers); 
      alert(`Failed to update role: ${err instanceof Error ? err.message : "An unknown error occurred."}`);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    
    const authToken = token || undefined;
    const oldUsers = users; 
      
    setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));

    try {
      await api.delete(`/users/${userId}`, authToken);
      console.log(`Deleted user ${userId}`);
    } catch (err: unknown) {
      console.error('Error deleting user:', err);
      setUsers(oldUsers); 
      alert(`Failed to delete user: ${err instanceof Error ? err.message : "An unknown error occurred."}`);
    }
  };

  if (isLoading || isAuthLoading) {
    return (
      <div className="p-4 md:p-8 text-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 md:p-8 text-center text-red-500">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Manage Users</h1>
      <Card>
        <CardBody>
          {users.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No users found.
            </div>
          ) : (
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
                    <TableCell className="font-medium">{user.full_name}</TableCell>
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
                          onAction={(key) => handleRoleChange(user.id, key as 'admin' | 'student')}
                        >
                          <DropdownItem key="admin">Admin</DropdownItem>
                          <DropdownItem key="student">Student</DropdownItem> 
                        </DropdownMenu>
                      </Dropdown>

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
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default AdminUsersPage;