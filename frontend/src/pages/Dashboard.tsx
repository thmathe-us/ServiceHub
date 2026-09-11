import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { servicesApi } from '../services/servicesApi';

import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Plus, Search, Grid, List, RefreshCw, Server, CheckCircle2, XCircle, Star as StarIcon } from 'lucide-react';
import { ServiceCard } from '../components/ServiceCard';
import { ServiceModal } from '../components/ServiceModal';
import { useTranslation } from '../store/preferences.store';

const Dashboard: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'online' | 'offline' | 'favorites'>('all');
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const t = useTranslation();

  const { data: services, refetch: refetchServices, isFetching: isFetchingServices } = useQuery('services', servicesApi.getAll);
  const { data: favorites, refetch: refetchFavorites } = useQuery('favorites', servicesApi.getFavorites);

  // Calcular métricas
  const totalServices = services?.length || 0;
  const onlineServices = services?.filter((s: any) => s.status === 'ONLINE').length || 0;
  const offlineServices = services?.filter((s: any) => s.status === 'OFFLINE' || s.status === 'UNAVAILABLE').length || 0;
  const favoriteServices = favorites?.length || 0;

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
    if (isRefreshing) return;

    setIsRefreshing(true);
    try {
      await servicesApi.checkAllStatuses();
      await refetchServices();
      await refetchFavorites();
      setLastRefresh(new Date());
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    } finally {
      setIsRefreshing(false);
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

  const metricCards = [
    { label: t.total, value: totalServices, icon: Server, color: '#3b82f6', background: 'rgba(59,130,246,0.1)', filter: 'all' as const },
    { label: t.online, value: onlineServices, icon: CheckCircle2, color: '#22c55e', background: 'rgba(34,197,94,0.1)', filter: 'online' as const },
    { label: t.offline, value: offlineServices, icon: XCircle, color: '#ef4444', background: 'rgba(239,68,68,0.1)', filter: 'offline' as const },
    { label: t.favorites, value: favoriteServices, icon: StarIcon, color: '#f59e0b', background: 'rgba(245,158,11,0.1)', filter: 'favorites' as const },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-text-primary">{t.dashboard}</h1>
          <p className="text-text-secondary">{t.dashboardDescription}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            onClick={handleRefreshStatuses} 
            variant="outline" 
            size="icon"
            disabled={isRefreshing || isFetchingServices}
            aria-label="Atualizar status dos serviços"
            title={lastRefresh ? `Atualizado às ${lastRefresh.toLocaleTimeString()}` : 'Atualizar status dos serviços'}
            className="bg-[rgba(255,255,255,0.05)] border-border-color text-text-primary hover:bg-[rgba(255,255,255,0.1)]"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing || isFetchingServices ? 'animate-spin' : ''}`} />
          </Button>
          <Button onClick={handleAddService} className="bg-[#3b82f6] hover:bg-[#2563eb] text-white">
            <Plus className="mr-2 h-4 w-4" />
            {t.addService}
          </Button>
        </div>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricCards.map(({ label, value, icon: Icon, color, background, filter }) => (
          <button
            key={filter}
            type="button"
            onClick={() => setFilterStatus(filter)}
            aria-pressed={filterStatus === filter}
            className={`text-left bg-card-bg border border-border-color backdrop-blur-sm rounded-2xl p-4 shadow-sm hover:bg-card-bg-hover transition-all duration-200 ${filterStatus === filter ? 'ring-2 ring-[#3b82f6]' : ''}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-secondary text-sm font-medium">{label}</p>
                <p className="text-2xl font-bold text-text-primary mt-1">{value}</p>
              </div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: background }}>
                <Icon className="h-6 w-6" style={{ color }} />
              </div>
            </div>
          </button>
        ))}
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

      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-text-primary">
          {filterStatus === 'all' ? t.allServices : metricCards.find((metric) => metric.filter === filterStatus)?.label}
        </h2>
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

export default Dashboard;