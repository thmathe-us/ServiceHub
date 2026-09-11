import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { servicesApi } from '../services/servicesApi';
import { categoriesApi } from '../services/categoriesApi';

interface ServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  service?: any;
  onSuccess: () => void;
}

export const ServiceModal: React.FC<ServiceModalProps> = ({ isOpen, onClose, service, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    url: '',
    username: '',
    password: '',
    token: '',
    icon: '',
    category: '',
    tags: [],
    color: '#3b82f6',
    checkType: 'HTTP',
    checkInterval: 300,
    isFavorite: false,
  });

  const { data: categories } = useQuery('categories', categoriesApi.getAll);

  useEffect(() => {
    if (service) {
      setFormData({
        name: service.name || '',
        description: service.description || '',
        url: service.url || '',
        username: service.username || '',
        password: service.password || '',
        token: service.token || '',
        icon: service.icon || '',
        category: service.category || '',
        tags: service.tags || [],
        color: service.color || '#3b82f6',
        checkType: service.checkType || 'HTTP',
        checkInterval: service.checkInterval || 300,
        isFavorite: service.isFavorite || false,
      });
    } else {
      // Reset form for new service
      setFormData({
        name: '',
        description: '',
        url: '',
        username: '',
        password: '',
        token: '',
        icon: '',
        category: '',
        tags: [],
        color: '#3b82f6',
        checkType: 'HTTP',
        checkInterval: 300,
        isFavorite: false,
      });
    }
  }, [service, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (service) {
        await servicesApi.update(service.id, formData);
      } else {
        await servicesApi.create(formData);
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Erro ao salvar serviço:', error);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      window.alert('A logo deve ter no máximo 2 MB.');
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => handleInputChange('icon', reader.result as string);
    reader.readAsDataURL(file);
  };

  const isImageIcon = (icon: string) => icon.startsWith('data:image/') || icon.startsWith('http://') || icon.startsWith('https://');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-[#111827] border-border-color">
        <DialogHeader>
          <DialogTitle className="text-text-primary">{service ? 'Editar Serviço' : 'Adicionar Serviço'}</DialogTitle>
          <DialogDescription className="text-text-secondary">
            {service ? 'Atualize as informações do serviço.' : 'Adicione um novo serviço para monitorar.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-text-primary">
                Nome *</label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
                className="bg-[#09090b] border-border-color text-text-primary placeholder:text-text-secondary"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="category" className="text-sm font-medium text-text-primary">
                Categoria *</label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                <SelectTrigger className="bg-[#09090b] border-border-color text-text-primary">
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent className="bg-[#111827] border-border-color text-text-primary">
                  {categories?.map((category: any) => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium text-text-primary">
              Descrição</label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="bg-[#09090b] border-border-color text-text-primary placeholder:text-text-secondary"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="url" className="text-sm font-medium text-text-primary">
              URL *</label>
            <Input
              id="url"
              value={formData.url}
              onChange={(e) => handleInputChange('url', e.target.value)}
              placeholder="http:// ou https://"
              required
              className="bg-[#09090b] border-border-color text-text-primary placeholder:text-text-secondary"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium text-text-primary">
                Usuário</label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                className="bg-[#09090b] border-border-color text-text-primary placeholder:text-text-secondary"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-text-primary">
                Senha</label>
              <Input
                id="password"
                type="text"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className="bg-[#09090b] border-border-color text-text-primary placeholder:text-text-secondary"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="checkType" className="text-sm font-medium text-text-primary">
                Tipo de Verificação *</label>
              <Select value={formData.checkType} onValueChange={(value) => handleInputChange('checkType', value)}>
                <SelectTrigger className="bg-[#09090b] border-border-color text-text-primary">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent className="bg-[#111827] border-border-color text-text-primary">
                  <SelectItem value="HTTP">HTTP</SelectItem>
                  <SelectItem value="HTTPS">HTTPS</SelectItem>
                  <SelectItem value="HEAD">HEAD</SelectItem>
                  <SelectItem value="ICMP">ICMP (Ping)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label htmlFor="checkInterval" className="text-sm font-medium text-text-primary">
                Intervalo (segundos) *</label>
              <Input
                id="checkInterval"
                type="number"
                value={formData.checkInterval}
                onChange={(e) => handleInputChange('checkInterval', parseInt(e.target.value))}
                min={5}
                className="bg-[#09090b] border-border-color text-text-primary placeholder:text-text-secondary"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="icon" className="text-sm font-medium text-text-primary">
                Logo do serviço</label>
              <Input
                id="icon"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleLogoChange}
                className="bg-[#09090b] border-border-color text-text-primary file:mr-3 file:border-0 file:bg-transparent file:text-text-secondary"
              />
              {formData.icon && (
                <div className="flex items-center gap-3">
                  {isImageIcon(formData.icon) ? (
                    <img src={formData.icon} alt="Prévia da logo" className="h-10 w-10 rounded-md object-contain bg-[#09090b] p-1" />
                  ) : (
                    <span className="flex h-10 w-10 items-center justify-center rounded-md bg-[#09090b] text-xl">{formData.icon}</span>
                  )}
                  <Button type="button" variant="outline" size="sm" onClick={() => handleInputChange('icon', '')} className="bg-[rgba(255,255,255,0.05)] border-border-color text-text-primary hover:bg-[rgba(255,255,255,0.1)]">
                    Remover logo
                  </Button>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <label htmlFor="color" className="text-sm font-medium text-text-primary">
                Cor</label>
              <Input
                id="color"
                type="color"
                value={formData.color}
                onChange={(e) => handleInputChange('color', e.target.value)}
                className="bg-[#09090b] border-border-color text-text-primary"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isFavorite"
              checked={formData.isFavorite}
              onChange={(e) => handleInputChange('isFavorite', e.target.checked)}
              className="h-4 w-4 rounded border-border-color bg-[#09090b] text-[#3b82f6] focus:ring-[#3b82f6]"
            />
            <label htmlFor="isFavorite" className="text-sm font-medium text-text-primary">
              Marcar como favorito
            </label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} className="bg-[rgba(255,255,255,0.05)] border-border-color text-text-primary hover:bg-[rgba(255,255,255,0.1)]">
              Cancelar
            </Button>
            <Button type="submit" className="bg-[#3b82f6] hover:bg-[#2563eb] text-white">
              {service ? 'Atualizar' : 'Criar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};