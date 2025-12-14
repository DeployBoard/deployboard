<script>
  import { link } from 'svelte-spa-router';
  
  let currentPath = '/';
  
  // Subscribe to location changes
  import { location } from 'svelte-spa-router';
  location.subscribe(value => {
    currentPath = value;
  });
</script>

<nav>
  <div class="nav-container">
    <div class="nav-brand">
      <svg class="logo" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L4 7v10l8 5 8-5V7l-8-5z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
        <path d="M12 22V12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <path d="M12 12L4 7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <path d="M12 12L20 7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <circle cx="12" cy="12" r="2" fill="currentColor"/>
        <path d="M8 17l2-3 2 3 2-3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" opacity="0.6"/>
      </svg>
      <span class="brand-text">DeployBoard</span>
    </div>
    
    <div class="nav-links">
      <a href="/" use:link class:active={currentPath === '/'}>
        Dashboard
      </a>
      <a href="/logs" use:link class:active={currentPath === '/logs'}>
        Logs
      </a>
      <a href="/admin/keys" use:link class:active={currentPath.startsWith('/admin')}>
        Admin
      </a>
    </div>
  </div>
</nav>

<style>
  nav {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    position: sticky;
    top: 0;
    z-index: 100;
  }

  .nav-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 64px;
  }

  .nav-brand {
    display: flex;
    align-items: center;
    gap: 12px;
    color: white;
    font-weight: 700;
    font-size: 1.25rem;
  }

  .logo {
    width: 32px;
    height: 32px;
    color: white;
  }

  .brand-text {
    font-size: 1.25rem;
  }

  .nav-links {
    display: flex;
    gap: 2rem;
  }

  .nav-links a {
    color: white;
    text-decoration: none;
    font-weight: 500;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    transition: background 0.2s;
    opacity: 0.9;
  }

  .nav-links a:hover {
    background: rgba(255, 255, 255, 0.15);
    opacity: 1;
  }

  .nav-links a.active {
    background: rgba(255, 255, 255, 0.2);
    opacity: 1;
  }
</style>
