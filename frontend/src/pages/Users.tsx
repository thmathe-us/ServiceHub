import React, { useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Plus, Search, Edit, Trash2, UserCheck, UserX } from 'lucide-react';
import { UsersServiceModal } from '../components/UsersServiceModal';
import { usersApi, User } from '../services/usersApi';
import { useTranslation } from '../store/preferences.store';

const Users: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const queryClient = useQueryClient();
  const t = useTranslation();

  const { data: users, isLoading, error } = useQuery<User[]>('users', usersApi.getAll);

  const errorMessage = error ? String(error) : '';

  const handleAddUser = () => {
    setSelectedUser(null);
    setIsUserModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsUserModalOpen(true);
  };

  const handleDeleteUser = async (id: string) => {
    if (window.confirm(t.confirmDeleteUser)) {
      try {
        await usersApi.delete(id);
        queryClient.invalidateQueries('users');
      } catch (error) {
        console.error('Error deleting user:', error);
        alert(t.deleteUserError);
      }
    }
  };

  const handleToggleUserStatus = async (id: string, isActive: boolean) => {
    try {
      await usersApi.toggleStatus(id, !isActive);
      queryClient.invalidateQueries('users');
    } catch (error) {
      console.error('Error toggling user status:', error);
      alert(t.toggleUserError);
    }
  };

  const filteredUsers = (users || []).filter((user) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      user.username.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.name.toLowerCase().includes(query) ||
      user.lastName.toLowerCase().includes(query) ||
      user.role.toLowerCase().includes(query)
    );
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t.users}</h1>
          <p className="text-muted-foreground">{t.usersDescription}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleAddUser}>
            <Plus className="mr-2 h-4 w-4" />
            {t.addUser}
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t.searchUsers}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t.userList}</CardTitle>
          <CardDescription>
            {t.allUsers}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && <p>{t.loadingUsers}</p>}
          {errorMessage && <p>Erro ao carregar usuários: {errorMessage}</p>}
          {!isLoading && !error && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">{t.username}</th>
                    <th className="text-left py-3 px-4 font-medium">{t.name}</th>
                    <th className="text-left py-3 px-4 font-medium">Email</th>
                    <th className="text-left py-3 px-4 font-medium">{t.role}</th>
                    <th className="text-left py-3 px-4 font-medium">{t.status}</th>
                    <th className="text-left py-3 px-4 font-medium">{t.actions}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4">{user.username}</td>
                      <td className="py-3 px-4">{user.name} {user.lastName}</td>
                      <td className="py-3 px-4">{user.email}</td>
                      <td className="py-3 px-4">{user.role}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {user.isActive ? t.active : t.inactive}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEditUser(user)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleToggleUserStatus(user.id, user.isActive)}
                          >
                            {user.isActive ? <UserX className="h-4 w-4 text-destructive" /> : <UserCheck className="h-4 w-4 text-green-600" />}
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteUser(user.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {isUserModalOpen && (
        <UsersServiceModal
          isOpen={isUserModalOpen}
          onClose={() => setIsUserModalOpen(false)}
          user={selectedUser}
          onSuccess={() => {
            setIsUserModalOpen(false);
            queryClient.invalidateQueries('users');
          }}
        />
      )}
    </div>
  );
};

export default Users;