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
        <!-- Rocket body -->
        <path d="M12 2L9 6V16H15V6L12 2Z" fill="currentColor"/>
        <!-- Window -->
        <circle cx="12" cy="9" r="1.5" fill="rgba(255,255,255,0.9)"/>
        <!-- Left wing -->
        <path d="M9 12L6 18L9 16Z" fill="currentColor"/>
        <!-- Right wing -->
        <path d="M15 12L18 18L15 16Z" fill="currentColor"/>
        <!-- Flame -->
        <path d="M9 16L12 22L15 16" fill="#f59e0b"/>
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
    background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
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
