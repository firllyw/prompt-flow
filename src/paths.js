export const paths = {
  home: '/',
  checkout: '/checkout',
  contact: '/contact',
  pricing: '/pricing',
  auth: {
    signIn: '/auth/custom/sign-in',
    signUp: '/auth/custom/sign-up',
    resetPassword: '/auth/custom/reset-password',
  },
  dashboard: {
    overview: '/dashboard',
    myDiagrams: {
      index: '/dashboard/my-diagrams',
      create: '/dashboard/my-diagrams/create',
      edit: (diagramId) => `/dashboard/my-diagrams/${diagramId}/edit`,
    },
  },
};
