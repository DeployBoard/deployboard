<script>
  import { link, location, replace } from 'svelte-spa-router';
  import ApiKeys from './admin/ApiKeys.svelte';
  import Environments from './admin/Environments.svelte';

  $: currentPath = $location;
  $: isKeys = currentPath === '/admin' || currentPath === '/admin/keys';
  $: isEnvironments = currentPath === '/admin/environments';

  // Redirect /admin to /admin/keys
  $: if ($location === '/admin') {
    replace('/admin/keys');
  }
</script>

<div class="page">
  <div class="content">
    <div class="header">
      <h1>Admin Settings</h1>
    </div>

    <nav class="subnav">
      <a 
        href="/admin/keys" 
        use:link
        class="subnav-item" 
        class:active={isKeys}
      >
        API Keys
      </a>
      <a 
        href="/admin/environments" 
        use:link
        class="subnav-item" 
        class:active={isEnvironments}
      >
        Environment Priority
      </a>
    </nav>

    {#if isKeys}
      <ApiKeys />
    {:else if isEnvironments}
      <Environments />
    {/if}
  </div>
</div>

<style>
  .page {
    min-height: calc(100vh - 64px);
    background: #f5f5f5;
  }

  .content {
    max-width: 1200px;
    margin: 2rem auto;
    padding: 0 1rem;
  }

  .header {
    margin-bottom: 1.5rem;
  }

  .header h1 {
    font-size: 1.75rem;
    color: #2c3e50;
    margin: 0;
  }

  .subnav {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 2rem;
    background: white;
    padding: 0.5rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }

  .subnav-item {
    padding: 0.75rem 1.5rem;
    background: transparent;
    color: #7f8c8d;
    font-weight: 600;
    font-size: 14px;
    border-radius: 6px;
    text-decoration: none;
    transition: all 0.2s;
    display: inline-block;
  }

  .subnav-item:hover {
    background: #f5f5f5;
    color: #2c3e50;
  }

  .subnav-item.active {
    background: #5b9dd9;
    color: white;
  }
</style>
