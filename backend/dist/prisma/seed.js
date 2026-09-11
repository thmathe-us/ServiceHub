const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();
async function main() {
    console.log('Start seeding...');
    const hashedPassword = await bcrypt.hash('admin', 10);
    const adminUser = await prisma.user.upsert({
        where: { username: 'admin' },
        update: {},
        create: {
            username: 'admin',
            email: 'admin@servicehub.local',
            name: 'Administrador',
            lastName: 'Sistema',
            password: hashedPassword,
            role: 'ADMIN',
            isActive: true,
        },
    });
    console.log('Created admin user:', adminUser);
    const categories = [
        { name: 'Infraestrutura', color: '#3b82f6', icon: 'server' },
        { name: 'Streaming', color: '#ef4444', icon: 'play' },
        { name: 'Monitoramento', color: '#10b981', icon: 'chart-line' },
        { name: 'Firewall', color: '#f59e0b', icon: 'shield-alt' },
        { name: 'Containers', color: '#6366f1', icon: 'docker' },
        { name: 'Backup', color: '#8b5cf6', icon: 'database' },
        { name: 'Cloud', color: '#06b6d4', icon: 'cloud' },
    ];
    for (const category of categories) {
        await prisma.category.upsert({
            where: { name: category.name },
            update: {},
            create: category,
        });
    }
    console.log('Created default categories.');
    const defaultConfigs = [
        { key: 'check_interval', value: '300', description: 'Intervalo padrão de verificação de serviços (em segundos)' },
        { key: 'theme', value: 'light', description: 'Tema da aplicação (light/dark)' },
        { key: 'language', value: 'pt-BR', description: 'Idioma da aplicação' },
        { key: 'notifications_enabled', value: 'true', description: 'Habilitar notificações' },
    ];
    for (const config of defaultConfigs) {
        await prisma.systemConfig.upsert({
            where: { key: config.key },
            update: {},
            create: {
                key: config.key,
                value: { type: 'string', value: config.value },
                description: config.description,
            },
        });
    }
    console.log('Created default system configurations.');
    console.log('Seeding finished.');
}
main()
    .then(async () => {
    await prisma.$disconnect();
})
    .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
});
//# sourceMappingURL=seed.js.map