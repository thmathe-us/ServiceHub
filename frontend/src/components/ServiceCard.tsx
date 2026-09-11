import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { ExternalLink, Copy, Edit, Trash2, Star, CopyCheck, Eye, EyeOff } from 'lucide-react';
import { cn } from '../lib/utils';

interface ServiceCardProps {
  service: any;
  viewMode: 'grid' | 'list';
  onEdit: () => void;
  onDelete: () => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, viewMode, onEdit, onDelete }) => {

  const [copied, setCopied] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ONLINE':
        return 'bg-status-green';
      case 'OFFLINE':
        return 'bg-status-red';
      case 'UNAVAILABLE':
        return 'bg-status-yellow';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ONLINE':
        return 'Online';
      case 'OFFLINE':
        return 'Offline';
      case 'UNAVAILABLE':
        return 'Atenção';
      default:
        return 'Desconhecido';
    }
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(service.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const getDisplayPassword = () => {
    if (!service.password) return 'N/A';
    if (showPassword) {
      return service.password;
    }
    return '******';
  };

  const isImageIcon = (icon: string) => icon.startsWith('data:image/') || icon.startsWith('http://') || icon.startsWith('https://');


  if (viewMode === 'list') {
    return (
      <Card className="w-full bg-card-bg border-border-color backdrop-blur-sm hover:bg-card-bg-hover transition-all duration-200 rounded-2xl shadow-sm">
        <CardContent className="p-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(220px,0.8fr)_minmax(300px,1fr)] lg:items-center">
          <div className="flex items-center space-x-4 min-w-0">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center" 
              style={{ backgroundColor: `${service.color || '#3b82f6'}20`, color: service.color || '#3b82f6' }}
            >
              {service.icon && isImageIcon(service.icon) ? <img src={service.icon} alt={`Logo do ${service.name}`} className="h-7 w-7 object-contain" /> : service.icon ? <span>{service.icon}</span> : <span className="text-lg">🌐</span>}
            </div>
            <div>
              <CardTitle className="text-base font-semibold text-text-primary">{service.name}</CardTitle>
              <CardDescription className="text-sm text-text-secondary">
                {service.description || 'Sem descrição'}
              </CardDescription>
              <div className="flex items-center gap-2 mt-1">
                <span className={cn('w-2 h-2 rounded-full', getStatusColor(service.status))}></span>
                <span className={cn('text-xs font-medium', service.status === 'ONLINE' ? 'text-status-green' : service.status === 'OFFLINE' ? 'text-status-red' : 'text-status-yellow')}>
                  {getStatusText(service.status)}
                </span>
                <span className="text-xs text-text-secondary">•</span>
                <span className="text-xs text-text-secondary">{service.category}</span>
                <span className="text-xs text-text-secondary">•</span>
                <span className="text-xs text-text-secondary">{service.lastCheck ? new Date(service.lastCheck).toLocaleTimeString() : 'Nunca'}</span>
              </div>
            </div>
          </div>

          <div className="grid gap-y-2 text-sm min-w-0">
            <div className="text-text-secondary">
              <span className="font-medium text-text-primary">Login:</span> {service.username || 'N/A'}
            </div>
            <div className="text-text-secondary flex items-center gap-2">
              <span><span className="font-medium text-text-primary">Senha:</span> {getDisplayPassword()}</span>
              <Button variant="ghost" size="icon" className="h-6 w-6 text-text-secondary hover:text-text-primary hover:bg-[rgba(255,255,255,0.05)]" onClick={togglePasswordVisibility}>
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            {service.tags?.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {service.tags.map((tag: string, index: number) => (
                  <span key={index} className="px-2 py-0.5 bg-[rgba(255,255,255,0.05)] text-text-secondary text-xs rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="min-w-0 lg:justify-self-end lg:w-full">
            <div className="truncate text-sm text-text-secondary mb-2" title={service.url}>
              {service.url}
            </div>
            <div className="flex items-center gap-2 lg:justify-end">
              <Button variant="ghost" size="icon" onClick={() => window.open(service.url, '_blank')} className="text-text-secondary hover:text-text-primary hover:bg-[rgba(255,255,255,0.05)]">
                <ExternalLink className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleCopyUrl} className="text-text-secondary hover:text-text-primary hover:bg-[rgba(255,255,255,0.05)]">
                {copied ? <CopyCheck className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
              <Button variant="ghost" size="icon" onClick={onEdit} className="text-text-secondary hover:text-text-primary hover:bg-[rgba(255,255,255,0.05)]">
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={onDelete} className="text-status-red hover:bg-[rgba(239,68,68,0.1)]">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full bg-card-bg border-border-color backdrop-blur-sm hover:bg-card-bg-hover transition-all duration-200 rounded-2xl shadow-sm hover:shadow-md hover:shadow-[#3b82f6]/10">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div 
            className="w-12 h-12 rounded-full flex items-center justify-center mb-2" 
            style={{ backgroundColor: `${service.color || '#3b82f6'}20`, color: service.color || '#3b82f6' }}
          >
            {service.icon && isImageIcon(service.icon) ? <img src={service.icon} alt={`Logo do ${service.name}`} className="h-8 w-8 object-contain" /> : service.icon ? <span>{service.icon}</span> : <span className="text-xl">🌐</span>}
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-text-secondary hover:text-text-primary hover:bg-[rgba(255,255,255,0.05)]">
              <Star 
                className={cn('h-4 w-4', service.isFavorite ? 'fill-status-yellow text-status-yellow' : 'text-text-secondary')} 
              />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-text-secondary hover:text-text-primary hover:bg-[rgba(255,255,255,0.05)]" onClick={onEdit}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-status-red hover:bg-[rgba(239,68,68,0.1)]" onClick={onDelete}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <CardTitle className="text-lg font-semibold text-text-primary truncate">{service.name}</CardTitle>
        <CardDescription className="line-clamp-2 text-text-secondary">{service.description || 'Sem descrição'}</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex items-center gap-2 mb-3">
          <span className={cn('w-2 h-2 rounded-full', getStatusColor(service.status))}></span>
          <span className={cn('text-sm font-medium', service.status === 'ONLINE' ? 'text-status-green' : service.status === 'OFFLINE' ? 'text-status-red' : 'text-status-yellow')}>
            {getStatusText(service.status)}
          </span>
          <span className="text-xs text-text-secondary ml-auto">{service.lastCheck ? new Date(service.lastCheck).toLocaleTimeString() : 'Nunca'}</span>
        </div>
        <div className="text-sm text-text-secondary mb-3 truncate">{service.url}</div>
        <div className="flex flex-wrap gap-1 mb-3">
          {service.tags?.map((tag: string, index: number) => (
            <span key={index} className="px-2 py-0.5 bg-[rgba(255,255,255,0.05)] text-text-secondary text-xs rounded-full">
              {tag}
            </span>
          ))}
        </div>
      </CardContent>
      <CardFooter className="pt-2 flex flex-col gap-2">
        <div className="flex gap-1 w-full">
          <Button variant="outline" size="sm" onClick={() => window.open(service.url, '_blank')} className="flex-1 bg-[rgba(255,255,255,0.05)] border-border-color text-text-primary hover:bg-[rgba(255,255,255,0.1)]">
            <ExternalLink className="h-3 w-3 mr-1" />
            Abrir
          </Button>
          <Button variant="outline" size="sm" onClick={handleCopyUrl} className="flex-1 bg-[rgba(255,255,255,0.05)] border-border-color text-text-primary hover:bg-[rgba(255,255,255,0.1)]">
            {copied ? <CopyCheck className="h-3 w-3 mr-1" /> : <Copy className="h-3 w-3 mr-1" />}
            Copiar URL
          </Button>
        </div>
        <div className="flex gap-1 w-full items-center">
          <div className="flex-1 text-sm text-text-secondary">
            <div className="font-medium text-text-primary">Login:</div>
            <div>{service.username || 'N/A'}</div>
          </div>
          <div className="flex-1 text-sm text-text-secondary relative">
            <div className="font-medium text-text-primary">Senha:</div>
            <div className="flex items-center justify-between">
              <span>{getDisplayPassword()}</span>
              <Button variant="ghost" size="icon" className="h-6 w-6 absolute right-0 text-text-secondary hover:text-text-primary hover:bg-[rgba(255,255,255,0.05)]" onClick={togglePasswordVisibility}>
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};