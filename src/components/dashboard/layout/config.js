import { paths } from '@/paths';

export const layoutConfig = {
  navItems: [
    {
      key: 'general',
      title: 'General',
      items: [
        {
          key: 'my-diagrams',
          title: 'My Diagrams',
          href: paths.dashboard.myDiagrams.index,
          icon: 'gear',
          matcher: { type: 'startsWith', href: '/dashboard/my-diagrams' },
        },
      ],
    },
  ],
};
