import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { usersApi } from '../services/usersApi';

type UserRole = 'ADMIN' | 'OPERATOR' | 'READER';

interface UsersServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: any;
  onSuccess: () => void;
}

export const UsersServiceModal: React.FC<UsersServiceModalProps> = ({ isOpen, onClose, user, onSuccess }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    name: '',
    lastName: '',
    password: '',
    role: 'OPERATOR' as UserRole,
    isActive: true,
  });

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        name: user.name || '',
        lastName: user.lastName || '',
        password: '', // Passwords shouldn't be pre-filled for security reasons
        role: (user.role || 'OPERATOR') as UserRole,
        isActive: user.isActive !== undefined ? user.isActive : true,
      });
    } else {
      // Reset form for new user
      setFormData({
        username: '',
        email: '',
        name: '',
        lastName: '',
        password: '',
        role: 'OPERATOR' as UserRole,
        isActive: true,
      });
    }
  }, [user, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (user) {
        const updateData = {
          email: formData.email,
          name: formData.name,
          lastName: formData.lastName,
          role: formData.role as 'ADMIN' | 'OPERATOR' | 'READER',
          isActive: formData.isActive,
          ...(formData.password && { password: formData.password }),
        };
        await usersApi.update(user.id, updateData);
      } else {
        await usersApi.create(formData);
      }
      onSuccess();
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
      alert('Não foi possível salvar o usuário.');
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{user ? 'Editar Usuário' : 'Adicionar Usuário'}</DialogTitle>
          <DialogDescription>
            {user ? 'Atualize as informações do usuário.' : 'Adicione um novo usuário ao sistema.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium">
                Usuário *
              </label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                required
                disabled={!!user}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email *
              </label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Nome *
              </label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="lastName" className="text-sm font-medium">
                Sobrenome *
              </label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Senha {user && '(Deixe em branco para manter a atual)'}
            </label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              required={!user}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="role" className="text-sm font-medium">
                Cargo *
              </label>
              <Select value={formData.role} onValueChange={(value) => handleInputChange('role', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o cargo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADMIN">Administrador</SelectItem>
                  <SelectItem value="OPERATOR">Operador</SelectItem>
                  <SelectItem value="READER">Leitor</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 flex items-end">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => handleInputChange('isActive', e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label htmlFor="isActive" className="text-sm font-medium">
                  Usuário Ativo
                </label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {user ? 'Atualizar' : 'Criar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};