import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Language = 'pt-BR' | 'en-US' | 'es-ES';
export type Theme = 'light' | 'dark';

interface PreferencesState {
  checkInterval: string;
  theme: Theme;
  language: Language;
  notificationsEnabled: boolean;
  setPreferences: (preferences: Partial<PreferencesState>) => void;
}

const applyTheme = (theme: Theme) => {
  document.documentElement.classList.toggle('dark', theme === 'dark');
  document.documentElement.style.colorScheme = theme;
};

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      checkInterval: '300',
      theme: 'light',
      language: 'pt-BR',
      notificationsEnabled: true,
      setPreferences: (preferences) => {
        if (preferences.theme) applyTheme(preferences.theme);
        set(preferences);
      },
    }),
    {
      name: 'preferences-storage',
      onRehydrateStorage: () => (state) => {
        if (state) applyTheme(state.theme);
      },
    },
  ),
);

export const translations = {
  'pt-BR': {
    dashboard: 'Dashboard', services: 'Serviços', users: 'Usuários', logs: 'Logs', settings: 'Configurações', profile: 'Perfil', logout: 'Sair',
    settingsDescription: 'Gerencie as configurações do sistema e da aplicação.', general: 'Geral', notifications: 'Notificações', security: 'Segurança', sessions: 'Sessões Ativas', dashboardDescription: 'Monitoramento e gerenciamento de serviços self-hosted', servicesDescription: 'Gerencie seus serviços self-hosted.', total: 'Total de Serviços', online: 'Serviços Online', offline: 'Serviços Offline', favorites: 'Serviços Favoritos', allServices: 'Todos os Serviços', addService: 'Adicionar Serviço', all: 'Todos', filterStatus: 'Filtrar por status',
    generalTitle: 'Configurações Gerais', generalDescription: 'Altere as configurações gerais da aplicação.', interval: 'Intervalo de Verificação', theme: 'Tema', language: 'Idioma', save: 'Salvar Configurações', saved: 'Configurações salvas.', loading: 'Carregando configurações...',
    light: 'Claro', dark: 'Escuro', portuguese: 'Português (Brasil)', english: 'English (US)', spanish: 'Español', search: 'Buscar serviços...', profileDescription: 'Gerencie suas informações de perfil e configurações de conta.', profileInfo: 'Informações do Perfil', profileInfoDescription: 'Atualize suas informações de perfil e endereço de email.', firstName: 'Nome', lastName: 'Sobrenome', avatarUrl: 'URL do Avatar', saveChanges: 'Salvar Alterações', changePassword: 'Alterar Senha', currentPassword: 'Senha Atual', newPassword: 'Nova Senha', confirmPassword: 'Confirmar Nova Senha', updatePassword: 'Atualizar Senha', auditLogs: 'Logs de Auditoria', logsDescription: 'Registros de atividades e eventos do sistema.', searchLogs: 'Pesquisar logs...', activityRecords: 'Registros de Atividades', activityDescription: 'Histórico de ações e eventos no sistema.', loadingLogs: 'Carregando logs...', usersDescription: 'Gerencie os usuários do sistema.', addUser: 'Adicionar Usuário', searchUsers: 'Pesquisar usuários...', userList: 'Lista de Usuários', allUsers: 'Todos os usuários do sistema.', loadingUsers: 'Carregando usuários...', username: 'Usuário', name: 'Nome', role: 'Cargo', status: 'Status', actions: 'Ações', active: 'Ativo', inactive: 'Inativo', yes: 'Sim', no: 'Não', logsDate: 'Data/Hora', entity: 'Entidade', entityId: 'ID da Entidade', allActions: 'Todas as ações', confirmDeleteUser: 'Tem certeza que deseja excluir este usuário?', deleteUserError: 'Erro ao excluir usuário.', toggleUserError: 'Erro ao alterar status do usuário.', passwordsMismatch: 'As senhas não coincidem.',
  },
  'en-US': {
    dashboard: 'Dashboard', services: 'Services', users: 'Users', logs: 'Logs', settings: 'Settings', profile: 'Profile', logout: 'Sign out',
    settingsDescription: 'Manage system and application settings.', general: 'General', notifications: 'Notifications', security: 'Security', sessions: 'Active Sessions', dashboardDescription: 'Monitor and manage self-hosted services', servicesDescription: 'Manage your self-hosted services.', total: 'Total Services', online: 'Online Services', offline: 'Offline Services', favorites: 'Favorite Services', allServices: 'All Services', addService: 'Add Service', all: 'All', filterStatus: 'Filter by status',
    generalTitle: 'General Settings', generalDescription: 'Change the general application settings.', interval: 'Check Interval', theme: 'Theme', language: 'Language', save: 'Save Settings', saved: 'Settings saved.', loading: 'Loading settings...',
    light: 'Light', dark: 'Dark', portuguese: 'Portuguese (Brazil)', english: 'English (US)', spanish: 'Spanish', search: 'Search services...', profileDescription: 'Manage your profile information and account settings.', profileInfo: 'Profile Information', profileInfoDescription: 'Update your profile information and email address.', firstName: 'First name', lastName: 'Last name', avatarUrl: 'Avatar URL', saveChanges: 'Save Changes', changePassword: 'Change Password', currentPassword: 'Current Password', newPassword: 'New Password', confirmPassword: 'Confirm New Password', updatePassword: 'Update Password', auditLogs: 'Audit Logs', logsDescription: 'System activity and event records.', searchLogs: 'Search logs...', activityRecords: 'Activity Records', activityDescription: 'History of actions and events in the system.', loadingLogs: 'Loading logs...', usersDescription: 'Manage system users.', addUser: 'Add User', searchUsers: 'Search users...', userList: 'User List', allUsers: 'All system users.', loadingUsers: 'Loading users...', username: 'Username', name: 'Name', role: 'Role', status: 'Status', actions: 'Actions', active: 'Active', inactive: 'Inactive', yes: 'Yes', no: 'No', logsDate: 'Date/Time', entity: 'Entity', entityId: 'Entity ID', allActions: 'All actions', confirmDeleteUser: 'Are you sure you want to delete this user?', deleteUserError: 'Error deleting user.', toggleUserError: 'Error changing user status.', passwordsMismatch: 'Passwords do not match.',
  },
  'es-ES': {
    dashboard: 'Panel', services: 'Servicios', users: 'Usuarios', logs: 'Registros', settings: 'Configuración', profile: 'Perfil', logout: 'Salir',
    settingsDescription: 'Administra la configuración del sistema y la aplicación.', general: 'General', notifications: 'Notificaciones', security: 'Seguridad', sessions: 'Sesiones Activas', dashboardDescription: 'Monitoreo y gestión de servicios self-hosted', servicesDescription: 'Administra tus servicios self-hosted.', total: 'Total de Servicios', online: 'Servicios En Línea', offline: 'Servicios Fuera de Línea', favorites: 'Servicios Favoritos', allServices: 'Todos los Servicios', addService: 'Añadir Servicio', all: 'Todos', filterStatus: 'Filtrar por estado',
    generalTitle: 'Configuración General', generalDescription: 'Cambia la configuración general de la aplicación.', interval: 'Intervalo de Verificación', theme: 'Tema', language: 'Idioma', save: 'Guardar Configuración', saved: 'Configuración guardada.', loading: 'Cargando configuración...',
    light: 'Claro', dark: 'Oscuro', portuguese: 'Portugués (Brasil)', english: 'Inglés (EE. UU.)', spanish: 'Español', search: 'Buscar servicios...', profileDescription: 'Administra la información de tu perfil y la configuración de tu cuenta.', profileInfo: 'Información del Perfil', profileInfoDescription: 'Actualiza la información de tu perfil y correo electrónico.', firstName: 'Nombre', lastName: 'Apellido', avatarUrl: 'URL del Avatar', saveChanges: 'Guardar Cambios', changePassword: 'Cambiar Contraseña', currentPassword: 'Contraseña Actual', newPassword: 'Nueva Contraseña', confirmPassword: 'Confirmar Nueva Contraseña', updatePassword: 'Actualizar Contraseña', auditLogs: 'Registros de Auditoría', logsDescription: 'Registros de actividades y eventos del sistema.', searchLogs: 'Buscar registros...', activityRecords: 'Registros de Actividad', activityDescription: 'Historial de acciones y eventos del sistema.', loadingLogs: 'Cargando registros...', usersDescription: 'Administra los usuarios del sistema.', addUser: 'Añadir Usuario', searchUsers: 'Buscar usuarios...', userList: 'Lista de Usuarios', allUsers: 'Todos los usuarios del sistema.', loadingUsers: 'Cargando usuarios...', username: 'Usuario', name: 'Nombre', role: 'Rol', status: 'Estado', actions: 'Acciones', active: 'Activo', inactive: 'Inactivo', yes: 'Sí', no: 'No', logsDate: 'Fecha/Hora', entity: 'Entidad', entityId: 'ID de Entidad', allActions: 'Todas las acciones', confirmDeleteUser: '¿Seguro que deseas eliminar este usuario?', deleteUserError: 'Error al eliminar el usuario.', toggleUserError: 'Error al cambiar el estado del usuario.', passwordsMismatch: 'Las contraseñas no coinciden.',
  },
} as const;

export const useTranslation = () => {
  const language = usePreferencesStore((state) => state.language);
  return translations[language];
};
