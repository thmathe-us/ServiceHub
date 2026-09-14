import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Switch } from '../components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { configsApi, SystemConfig } from '../services/configsApi';
import { updateApi } from '../services/updateApi';
import { authApi } from '../services/authApi';
import { usePreferencesStore, useTranslation } from '../store/preferences.store';

const Settings: React.FC = () => {
  const { checkInterval, theme, language, notificationsEnabled, setPreferences } = usePreferencesStore();
  const t = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [versionInfo, setVersionInfo] = useState<{ currentVersion: string; latestVersion: string } | null>(null);
  const [versionLoading, setVersionLoading] = useState(false);
  const [versionError, setVersionError] = useState<string | null>(null);
  const [clickMessage, setClickMessage] = useState('');

  useEffect(() => {
    configsApi.getAll()
      .then((configs) => {
        const values = Object.fromEntries(configs.map((config: SystemConfig) => {
          const value = typeof config.value === 'string' ? config.value : config.value?.value;
          return [config.key, value];
        }));
        setPreferences({
          ...(values.check_interval && { checkInterval: values.check_interval }),
          ...(values.theme && { theme: values.theme as 'light' | 'dark' }),
          ...(values.language && { language: values.language as 'pt-BR' | 'en-US' | 'es-ES' }),
          ...(values.notifications_enabled && { notificationsEnabled: values.notifications_enabled === 'true' }),
        });
      })
      .catch(() => setMessage('Não foi possível carregar as configurações.'))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    async function loadVersion() {
      setVersionLoading(true);
      setVersionError(null);
      try {
        const data = await updateApi.getVersion();
        setVersionInfo(data);
      } catch (err) {
        setVersionError('Falha ao carregar informações de versão');
      } finally {
        setVersionLoading(false);
      }
    }
    loadVersion();
  }, []);

  const handleSaveSettings = async () => {
    setIsSaving(true);
    setMessage('');
    try {
      await Promise.all([
        configsApi.update('check_interval', checkInterval),
        configsApi.update('theme', theme),
        configsApi.update('language', language),
        configsApi.update('notifications_enabled', String(notificationsEnabled)),
      ]);
      setMessage(t.saved);
    } catch {
      setMessage('Não foi possível salvar as configurações.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    const currentPassword = window.prompt('Digite sua senha atual:');
    const newPassword = window.prompt('Digite a nova senha:');
    if (!currentPassword || !newPassword) return;
    if (newPassword.length < 6) {
      setMessage('A nova senha deve ter pelo menos 6 caracteres.');
      return;
    }

    try {
      await authApi.changePassword(currentPassword, newPassword);
      setMessage('Senha alterada com sucesso.');
    } catch {
      setMessage('Não foi possível alterar a senha.');
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t.settings}</h1>
        <p className="text-muted-foreground">{t.settingsDescription}</p>
      </div>

      {message && <p className="text-sm text-text-secondary" role="status">{message}</p>}
      {clickMessage && <p className="text-sm text-info">{clickMessage}</p>}
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">{t.general}</TabsTrigger>
          <TabsTrigger value="notifications">{t.notifications}</TabsTrigger>
          <TabsTrigger value="security">{t.security}</TabsTrigger>
          <TabsTrigger value="update">Atualizações</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>{t.generalTitle}</CardTitle>
              <CardDescription>
                {t.generalDescription}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading && <p className="text-sm text-muted-foreground">Carregando configurações...</p>}
              <div className="space-y-2">
                <label htmlFor="checkInterval" className="text-sm font-medium">
                  {t.interval}
                </label>
                <Select value={checkInterval} onValueChange={(value) => setPreferences({ checkInterval: value })}>
                  <SelectTrigger id="checkInterval">
                    <SelectValue placeholder={t.interval} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 segundos</SelectItem>
                    <SelectItem value="10">10 segundos</SelectItem>
                    <SelectItem value="30">30 segundos</SelectItem>
                    <SelectItem value="60">1 minuto</SelectItem>
                    <SelectItem value="300">5 minutos</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label htmlFor="theme" className="text-sm font-medium">
                  Tema
                </label>
                <Select value={theme} onValueChange={(value) => setPreferences({ theme: value as 'light' | 'dark' })}>
                  <SelectTrigger id="theme">
                    <SelectValue placeholder={t.theme} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">{t.light}</SelectItem>
                    <SelectItem value="dark">{t.dark}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label htmlFor="language" className="text-sm font-medium">
                  Idioma
                </label>
                <Select value={language} onValueChange={(value) => setPreferences({ language: value as 'pt-BR' | 'en-US' | 'es-ES' })}>
                  <SelectTrigger id="language">
                    <SelectValue placeholder={t.language} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pt-BR">{t.portuguese}</SelectItem>
                    <SelectItem value="en-US">{t.english}</SelectItem>
                    <SelectItem value="es-ES">{t.spanish}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings} disabled={isLoading || isSaving}>
                {isSaving ? 'Salvando...' : t.save}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Notificações</CardTitle>
              <CardDescription>
                Gerencie suas preferências de notificações.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label htmlFor="notifications" className="text-sm font-medium">
                    Habilitar Notificações
                  </label>
                  <p className="text-sm text-muted-foreground">
                    Receba notificações sobre status dos serviços.
                  </p>
                </div>
                <Switch
                  id="notifications"
                  checked={notificationsEnabled}
                  onCheckedChange={(checked) => setPreferences({ notificationsEnabled: checked })}
                />
              </div>
              <Button onClick={handleSaveSettings} disabled={isSaving}>
                {isSaving ? 'Salvando...' : 'Salvar Preferências'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Segurança</CardTitle>
              <CardDescription>
                Gerencie as configurações de segurança da aplicação.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Button variant="outline" onClick={handleChangePassword}>Alterar Senha</Button>
              </div>
              <div className="space-y-2">
                <Button variant="outline">Habilitar 2FA</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="update">
          <Card>
            <CardHeader>
              <CardTitle>Atualizar ServiceHub</CardTitle>
              <CardDescription>
                Clique no botão abaixo para forçar a verificação de atualizações e, se houver, a aplicação será atualizada automaticamente.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {versionLoading ? (
                <p className="text-sm text-muted-foreground">Carregando informações de versão...</p>
              ) : versionError ? (
                <p className="text-sm text-destructive">{versionError}</p>
              ) : versionInfo ? (
                <>
                  <div className="space-y-4">
                    <div className="text-sm font-medium">Versão atual: {versionInfo.currentVersion}</div>
                    <div className="text-sm font-medium">Última versão disponível: {versionInfo.latestVersion}</div>
                    {versionInfo.latestVersion !== versionInfo.currentVersion && (
                      <div className="text-sm text-muted-foreground">
                        Uma nova versão está disponível. Clique no botão abaixo para atualizar.
                      </div>
                    )}
                  </div>
                  <div className="space-y-4">
                    <Button onClick={() => {
                      setClickMessage('Checar Atualizações clicked');
                      updateApi.getVersion()
                        .then(data => {
                          setVersionInfo(data);
                          setClickMessage(`Versão verificada: ${data.currentVersion} -> ${data.latestVersion}`);
                        })
                        .catch(() => {
                          setClickMessage('Erro ao verificar atualizações');
                          setVersionError('Erro ao verificar atualizações');
                        });
                    }}>
                      Checar Atualizações
                    </Button>
                    <Button
                      onClick={() => {
                        setClickMessage('Atualizar clicked');
                        updateApi.trigger()
                          .then(() => {
                            // After triggering update, we may want to refetch version info
                            return updateApi.getVersion()
                              .then(data => {
                                setVersionInfo(data);
                                setClickMessage(`Atualização concluída: ${data.currentVersion} -> ${data.latestVersion}`);
                              })
                              .catch(() => {
                                setClickMessage('Erro ao verificar atualizações pós-update');
                                setVersionError('Erro ao verificar atualizações pós-update');
                              });
                          })
                          .catch(() => {
                            setClickMessage('Erro ao iniciar atualização');
                            setVersionError('Erro ao iniciar atualização');
                          });
                      }}
                      disabled={versionInfo.latestVersion === versionInfo.currentVersion}
                    >
                      Atualizar
                    </Button>
                  </div>
                </>
              ) : (
                <p>Nenhuma informação de versão disponível.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;