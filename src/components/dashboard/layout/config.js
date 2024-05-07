import { paths } from '@/paths';

export const layoutConfig = {
  navItems: [
    {
      key: 'general',
      title: 'General',
      items: [
        {
          key: 'my-diagrams',
          title: 'Diagrams',
          href: paths.dashboard.myDiagrams.create,
          icon: 'file',
          matcher: { type: 'startsWith', href: '/dashboard/my-diagrams/create' },
        },
      ],
    },
  ],
};
