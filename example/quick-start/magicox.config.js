module.exports = {
  dev: {
    port: 3000,
  },
  routes: [
    {
      path: '/home',
      component: '~/app.jsx#App',
      layout: '~/layouts/base.jsx#BaseLayout',
    },
    {
      exact: true,
      path: '/home/hello',
      component: '~/hello.jsx#Hello',
    },
  ],
}
