<script>
  import Router from 'svelte-spa-router';
  import Navbar from './lib/Navbar.svelte';
  import Dashboard from './routes/Dashboard.svelte';
  import Logs from './routes/Logs.svelte';
  import Admin from './routes/Admin.svelte';

  const routes = {
    '/': Dashboard,
    '/logs': Logs,
    '/admin': Admin,
  };
</script>

<Navbar />
<Router {routes} />
