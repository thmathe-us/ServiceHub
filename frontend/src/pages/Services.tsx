import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { servicesApi } from '../services/servicesApi';

import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Plus, Search, Grid, List, RefreshCw, Star as StarIcon } from 'lucide-react';
import { ServiceCard } from '../components/ServiceCard';
import { ServiceModal } from '../components/ServiceModal';
import { useTranslation } from '../store/preferences.store';
import { usePreferencesStore } from '../store/preferences.store';

const Services: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'online' | 'offline' | 'favorites'>('all');
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);
  const checkInterval = usePreferencesStore((state) => state.checkInterval);
  const t = useTranslation();

  const { data: services, refetch: refetchServices } = useQuery('services', servicesApi.getAll);
  const { data: favorites } = useQuery('favorites', servicesApi.getFavorites);

  // Atualizar status dos serviços ao carregar a página
  useEffect(() => {
    const initializeStatusCheck = async () => {
      try {
        await servicesApi.checkAllStatuses();
        refetchServices();
      } catch (error) {
        console.error('Erro ao verificar status inicial:', error);
      }
    };

    if (services && services.length > 0) {
      initializeStatusCheck();
    }
  }, []); // Executar apenas uma vez ao montar o componente

  // Recria o timer quando o intervalo salvo nas configurações muda.
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        await servicesApi.checkAllStatuses();
        refetchServices();
      } catch (error) {
        console.error('Erro ao atualizar status automático:', error);
      }
    }, Math.max(Number(checkInterval) || 300, 5) * 1000);

    return () => clearInterval(interval);
  }, [checkInterval, refetchServices]);

  const handleAddService = () => {
    setSelectedService(null);
    setIsServiceModalOpen(true);
  };

  const handleEditService = (service: any) => {
    setSelectedService(service);
    setIsServiceModalOpen(true);
  };

  const handleDeleteService = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este serviço?')) {
      try {
        await servicesApi.delete(id);
        refetchServices();
      } catch (error) {
        console.error('Erro ao excluir serviço:', error);
      }
    }
  };

  const handleRefreshStatuses = async () => {
    try {
      await servicesApi.checkAllStatuses();
      refetchServices();
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    }
  };

  const filteredServices = services?.filter((service: any) => {
    if (filterStatus === 'online') return service.status === 'ONLINE';
    if (filterStatus === 'offline') return service.status === 'OFFLINE' || service.status === 'UNAVAILABLE';
    if (filterStatus === 'favorites') return service.isFavorite;
    return true;
  }).filter((service: any) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      service.name.toLowerCase().includes(query) ||
      service.url.toLowerCase().includes(query) ||
      service.category.toLowerCase().includes(query) ||
      service.tags?.some((tag: string) => tag.toLowerCase().includes(query))
    );
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-text-primary">{t.services}</h1>
          <p className="text-text-secondary">{t.servicesDescription}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleRefreshStatuses} variant="outline" size="icon" className="bg-[rgba(255,255,255,0.05)] border-border-color text-text-primary hover:bg-[rgba(255,255,255,0.1)]">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button onClick={handleAddService} className="bg-[#3b82f6] hover:bg-[#2563eb] text-white">
            <Plus className="mr-2 h-4 w-4" />
            {t.addService}
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-secondary" />
          <Input
            placeholder={t.search}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12 bg-background border-border-color text-text-primary placeholder:text-text-secondary"
          />
        </div>
        <div className="flex gap-2">
          <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
            <SelectTrigger className="w-[180px] bg-background border-border-color text-text-primary">
              <SelectValue placeholder={t.filterStatus} />
            </SelectTrigger>
            <SelectContent className="bg-card border-border-color text-text-primary">
              <SelectItem value="all">{t.all}</SelectItem>
              <SelectItem value="online">Online</SelectItem>
              <SelectItem value="offline">Offline</SelectItem>
              <SelectItem value="favorites">{t.favorites}</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex border border-border-color rounded-md">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="icon"
              onClick={() => setViewMode('grid')}
              className={viewMode === 'grid' ? 'bg-[#3b82f6] text-white hover:bg-[#2563eb]' : 'bg-transparent text-text-secondary hover:text-text-primary hover:bg-[rgba(255,255,255,0.05)]'}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="icon"
              onClick={() => setViewMode('list')}
              className={viewMode === 'list' ? 'bg-[#3b82f6] text-white hover:bg-[#2563eb]' : 'bg-transparent text-text-secondary hover:text-text-primary hover:bg-[rgba(255,255,255,0.05)]'}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {filterStatus === 'favorites' && favorites && favorites.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2 text-text-primary">
            <StarIcon className="h-5 w-5 text-[#f59e0b]" />
            {t.favorites}
          </h2>
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4' : 'space-y-2'}>
            {favorites
              .filter((service: any) => {
                if (!searchQuery) return true;
                const query = searchQuery.toLowerCase();
                return (
                  service.name.toLowerCase().includes(query) ||
                  service.url.toLowerCase().includes(query) ||
                  service.category.toLowerCase().includes(query) ||
                  service.tags?.some((tag: string) => tag.toLowerCase().includes(query))
                );
              })
              .map((service: any) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  viewMode={viewMode}
                  onEdit={() => handleEditService(service)}
                  onDelete={() => handleDeleteService(service.id)}
                />
              ))}
          </div>
        </div>
      )}

      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-text-primary">{t.allServices}</h2>
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4' : 'space-y-2'}>
          {filteredServices?.map((service: any) => (
            <ServiceCard
              key={service.id}
              service={service}
              viewMode={viewMode}
              onEdit={() => handleEditService(service)}
              onDelete={() => handleDeleteService(service.id)}
            />
          ))}
        </div>
      </div>

      {isServiceModalOpen && (
        <ServiceModal
          isOpen={isServiceModalOpen}
          onClose={() => setIsServiceModalOpen(false)}
          service={selectedService}
          onSuccess={() => {
            refetchServices();
            setIsServiceModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default Services;