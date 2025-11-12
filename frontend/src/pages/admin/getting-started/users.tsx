import { useState, useEffect } from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalContent
} from "@heroui/modal";
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

  const [isRoleChangeDialogOpen, setIsRoleChangeDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newRole, setNewRole] = useState<'admin' | 'student' | null>(null);

  useEffect(() => {
    if (isAuthLoading) return;

    if (!token || !user || user.role !== 'admin') {
      setIsLoading(false);
      setError('You are not authorized to view this page.');
      return;
    }

    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const fetchedUsers = await api.get('/users', token);
        setUsers(fetchedUsers.data || fetchedUsers);
        setError(null);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to fetch users.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [token, user, isAuthLoading]);

  const confirmRoleChange = async () => {
    if (!selectedUser || !newRole) return;
    const userId = selectedUser.id;
    const oldUsers = [...users];

    setIsLoading(true);
    setUsers(prev =>
      prev.map(u => (u.id === userId ? { ...u, role: newRole } : u))
    );

    try {
      await api.put(`/users/${userId}`, { role: newRole }, token || undefined);
      console.log(`Changed user ${userId} to ${newRole}`);
    } catch (err: unknown) {
      console.error('Error updating role:', err);
      setUsers(oldUsers);
      alert(`Failed to update role: ${err instanceof Error ? err.message : "An unknown error occurred."}`);
    } finally {
      setIsLoading(false);
      setIsRoleChangeDialogOpen(false);
      setSelectedUser(null);
      setNewRole(null);
    }
  };

  const confirmDeleteUser = async () => {
    if (!selectedUser) return;
    const userId = selectedUser.id;
    const oldUsers = [...users];

    setIsLoading(true);
    setUsers(prev => prev.filter(u => u.id !== userId));

    try {
      await api.delete(`/users/${userId}`, token || undefined);
      console.log(`Deleted user ${userId}`);
    } catch (err: unknown) {
      console.error('Error deleting user:', err);
      setUsers(oldUsers);
      alert(`Failed to delete user: ${err instanceof Error ? err.message : "An unknown error occurred."}`);
    } finally {
      setIsLoading(false);
      setIsDeleteDialogOpen(false);
      setSelectedUser(null);
    }
  };

  if (isLoading && !users.length) {
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
                          onAction={(key) => {
                            setSelectedUser(user);
                            setNewRole(key as 'admin' | 'student');
                            setIsRoleChangeDialogOpen(true);
                          }}
                        >
                          <DropdownItem key="admin">Admin</DropdownItem>
                          <DropdownItem key="student">Student</DropdownItem>
                        </DropdownMenu>
                      </Dropdown>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-600"
                        onPress={() => {
                          setSelectedUser(user);
                          setIsDeleteDialogOpen(true);
                        }}
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

      <Modal
        isOpen={isRoleChangeDialogOpen}
        onOpenChange={setIsRoleChangeDialogOpen}
        className="py-2 px-1"
      >
        <ModalContent>
          <ModalHeader>Confirm Role Change</ModalHeader>
          <ModalBody>
            <p>
              Are you sure you want to change the role of{" "}
              <strong>{selectedUser?.full_name}</strong> to{" "}
              <strong>{newRole}</strong>?
            </p>
          </ModalBody>
          <ModalFooter>
            <Button
              type="button"
              variant="bordered"
              onPress={() => setIsRoleChangeDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-[#7828C8] text-white"
              isLoading={isLoading}
              onPress={confirmRoleChange}
            >
              {isLoading ? "Updating..." : "Confirm"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        className="px-1 py-2"
      >
        <ModalContent>
          <ModalHeader>Confirm Delete</ModalHeader>
          <ModalBody>
            <p>
              Are you sure you want to delete{" "}
              <strong>{selectedUser?.full_name}</strong>? This action cannot be
              undone.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button
              type="button"
              variant="bordered"
              onPress={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-red-500 text-white"
              isLoading={isLoading}
              onPress={confirmDeleteUser}
            >
              {isLoading ? "Deleting..." : "Delete"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default AdminUsersPage;