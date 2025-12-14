<script>
  import Router from 'svelte-spa-router';
  import { wrap } from 'svelte-spa-router/wrap';
  import Navbar from './lib/Navbar.svelte';
  import Dashboard from './routes/Dashboard.svelte';
  import Logs from './routes/Logs.svelte';
  import AdminKeys from './routes/AdminKeys.svelte';
  import AdminEnvironments from './routes/AdminEnvironments.svelte';

  const routes = {
    '/': Dashboard,
    '/logs': Logs,
    '/admin': wrap({
      asyncComponent: () => import('./routes/AdminKeys.svelte'),
      conditions: [
        () => {
          window.location.hash = '#/admin/keys';
          return false;
        }
      ]
    }),
    '/admin/keys': AdminKeys,
    '/admin/environments': AdminEnvironments,
  };
</script>

<Navbar />
<Router {routes} />
