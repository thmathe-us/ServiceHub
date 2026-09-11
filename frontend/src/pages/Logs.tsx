import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Search, Filter } from 'lucide-react';
import { logsApi, AuditLog } from '../services/logsApi';
import { useTranslation } from '../store/preferences.store';

const Logs: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAction, setFilterAction] = useState('all');
  const t = useTranslation();

  const { data: logs, isLoading, error } = useQuery<AuditLog[]>('logs', () => logsApi.getAll({ search: searchQuery, action: filterAction !== 'all' ? filterAction : undefined }), {
    keepPreviousData: true,
  });

  const errorMessage = error ? String(error) : '';

  const filteredLogs = (logs || []).filter((log) => {
    // Filter by search query
    if (searchQuery && !log.username.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !log.action.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !log.entity.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Filter by action
    if (filterAction !== 'all' && log.action.toLowerCase() !== filterAction.toLowerCase()) {
      return false;
    }

    return true;
  });

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t.auditLogs}</h1>
        <p className="text-muted-foreground">{t.logsDescription}</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t.searchLogs}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <div className="flex gap-2">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
            >
              <option value="all">{t.allActions}</option>
              <option value="LOGIN">Login</option>
              <option value="LOGOUT">Logout</option>
              <option value="SERVICE_CREATED">{t.services} Criado</option>
              <option value="SERVICE_UPDATED">{t.services} Atualizado</option>
              <option value="SERVICE_DELETED">{t.services} Excluído</option>
              <option value="USER_CREATED">Usuário Criado</option>
              <option value="USER_UPDATED">Usuário Atualizado</option>
              <option value="USER_DELETED">Usuário Excluído</option>
            </select>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t.activityRecords}</CardTitle>
          <CardDescription>
            {t.activityDescription}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && <p>{t.loadingLogs}</p>}
          {errorMessage && <p>Erro ao carregar logs: {errorMessage}</p>}
          {!isLoading && !error && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">{t.logsDate}</th>
                    <th className="text-left py-3 px-4 font-medium">{t.username}</th>
                    <th className="text-left py-3 px-4 font-medium">Ação</th>
                    <th className="text-left py-3 px-4 font-medium">{t.entity}</th>
                    <th className="text-left py-3 px-4 font-medium">{t.entityId}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4">{new Date(log.createdAt).toLocaleString()}</td>
                      <td className="py-3 px-4">{log.username}</td>
                      <td className="py-3 px-4">{log.action}</td>
                      <td className="py-3 px-4">{log.entity}</td>
                      <td className="py-3 px-4">{log.entityId}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Logs;