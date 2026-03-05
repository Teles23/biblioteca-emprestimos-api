import { prisma } from '../../../../shared/infra/database/prisma/client';

export class GetDashboardStatsUseCase {
  async execute() {
    const [bookCount, userCount, activeLoanCount, overdueLoanCount] = await Promise.all([
      prisma.book.count(),
      prisma.user.count(),
      prisma.loan.count({ where: { status: 'ACTIVE' } }),
      prisma.loan.count({ where: { status: 'OVERDUE' } }),
    ]);

    const recentLoans = await prisma.loan.findMany({
      take: 6,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true } },
        book: { select: { title: true } },
      },
    });

    const overdueItems = await prisma.loan.findMany({
      where: { status: 'OVERDUE' },
      take: 5,
      orderBy: { dueDate: 'asc' },
      include: {
        user: { select: { name: true } },
        book: { select: { title: true } },
      },
    });

    // Mocking some "activities" based on loans to match the UI's activity feed
    const activities = recentLoans.map((loan) => ({
      type: loan.status === 'RETURNED' ? 'success' : 'info',
      text: `<strong>${loan.user.name}</strong> ${
        loan.status === 'RETURNED' ? 'devolveu' : 'emprestou'
      } <em>${loan.book.title}</em>`,
      time: loan.createdAt,
    }));

    return {
      stats: [
        { label: 'Total de Livros', value: bookCount.toString(), icon: '📚', type: 'accent', change: 'Dados em tempo real', trend: 'up' },
        { label: 'Usuários Cadastrados', value: userCount.toString(), icon: '👥', type: 'info', change: 'Dados em tempo real', trend: 'up' },
        { label: 'Empréstimos Ativos', value: activeLoanCount.toString(), icon: '📖', type: 'success', change: 'Dados em tempo real', trend: 'up' },
        { label: 'Livros em Atraso', value: overdueLoanCount.toString(), icon: '⚠️', type: 'danger', change: 'Ação necessária', trend: 'down' },
      ],
      activities,
      overdueItems: overdueItems.map((item) => ({
        title: item.book.title,
        user: item.user.name,
        days: `${item.lateDays} dias`,
      })),
      summary: {
        available: bookCount - activeLoanCount,
        borrowed: activeLoanCount,
      }
    };
  }
}
