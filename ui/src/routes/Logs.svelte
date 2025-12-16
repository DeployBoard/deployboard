<script>
  import { onMount } from 'svelte';
  import { formatDateTime } from '../lib/dateUtils.js';

  const API_KEY = 'dev-key-12345';

  let loading = true;
  let error = null;
  let logs = [];
  let applications = [];
  let environments = [];
  
  let selectedApp = '';
  let selectedEnv = '';
  let limit = 25;

  async function fetchMetadata() {
    const response = await fetch('/api/metadata');
    if (!response.ok) throw new Error('Failed to fetch metadata');
    return response.json();
  }

  async function fetchLogs() {
    loading = true;
    error = null;
    
    try {
      const params = new URLSearchParams();
      if (selectedApp) params.append('application', selectedApp);
      if (selectedEnv) params.append('environment', selectedEnv);
      params.append('limit', limit.toString());

      const response = await fetch(`/api/logs?${params}`, {
        headers: { 'X-API-Key': API_KEY }
      });

      if (!response.ok) throw new Error(`API error: ${response.status}`);

      logs = await response.json();
      loading = false;
    } catch (err) {
      error = err.message;
      loading = false;
    }
  }

  onMount(async () => {
    try {
      const metadata = await fetchMetadata();
      applications = metadata.applications;
      environments = metadata.environments;
      await fetchLogs();
    } catch (err) {
      error = err.message;
      loading = false;
    }
  });



  function handleFilterChange() {
    fetchLogs();
  }
</script>

<div class="page">
  <div class="content">
    <div class="filters">
      <div>
        <label>Application</label>
        <select bind:value={selectedApp} on:change={handleFilterChange}>
          <option value="">All Applications</option>
          {#each applications as app}
            <option value={app}>{app}</option>
          {/each}
        </select>
      </div>

      <div>
        <label>Environment</label>
        <select bind:value={selectedEnv} on:change={handleFilterChange}>
          <option value="">All Environments</option>
          {#each environments as env}
            <option value={env}>{env}</option>
          {/each}
        </select>
      </div>

      <div>
        <label>Limit</label>
        <select bind:value={limit} on:change={handleFilterChange}>
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
      </div>
    </div>

    {#if loading}
      <div class="loading">Loading logs...</div>
    {:else if error}
      <div class="error">
        <h3>Failed to load logs</h3>
        <p>{error}</p>
      </div>
    {:else if logs.length === 0}
      <div class="empty">
        <p>No deployment logs found</p>
      </div>
    {:else}
      <div class="logs-container">
        <table>
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Application</th>
              <th>Version</th>
              <th>Environment</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {#each logs as log}
              <tr>
                <td>{formatDateTime(log.timestamp)}</td>
                <td>{log.application}</td>
                <td>{log.version}</td>
                <td>
                  <span class="env-badge" class:prod={log.environment === 'production'} class:staging={log.environment === 'staging'} class:dev={log.environment === 'development'}>
                    {log.environment}
                  </span>
                </td>
                <td>
                  {#if log.meta?.commit}
                    <code class="commit">{log.meta.commit.substring(0, 7)}</code>
                  {/if}
                  {#if log.meta?.branch}
                    <span class="branch">{log.meta.branch}</span>
                  {/if}
                  {#if log.meta?.committer}
                    <span class="committer">{log.meta.committer}</span>
                  {/if}
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {/if}
  </div>
</div>

<style>
  .page {
    min-height: calc(100vh - 64px);
    background: #f5f5f5;
  }

  .content {
    max-width: 1400px;
    margin: 2rem auto;
    padding: 0 1rem;
  }

  .filters {
    display: flex;
    gap: 1.5rem;
    margin-bottom: 2rem;
    background: white;
    padding: 1.5rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    align-items: flex-end;
  }

  .filters > div {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .filters label {
    font-weight: 600;
    font-size: 14px;
    color: #2c3e50;
    display: block;
  }

  .filters select {
    padding: 0.5rem 2rem 0.5rem 0.75rem;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 14px;
    background-color: white;
    cursor: pointer;
    transition: all 0.2s;
    width: 200px;
  }

  .filters select:hover {
    border-color: #2563eb;
  }

  .filters select:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  }

  .loading, .error, .empty {
    text-align: center;
    padding: 3rem;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }

  .error {
    color: #e74c3c;
  }

  .logs-container {
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    overflow: hidden;
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }

  thead {
    background: #d1dce8;
    color: #2c3e50;
  }

  th {
    padding: 1rem 1.5rem;
    text-align: left;
    font-weight: 600;
    font-size: 14px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  tbody tr {
    border-bottom: 1px solid #ecf0f1;
    transition: background 0.2s;
  }

  tbody tr:hover {
    background: #f8f9fa;
  }

  tbody tr:last-child {
    border-bottom: none;
  }

  td {
    padding: 1rem 1.5rem;
  }

  .env-badge {
    padding: 4px 10px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 600;
    text-transform: capitalize;
    color: white;
  }

  .env-badge.dev {
    background: #3498db;
  }

  .env-badge.staging {
    background: #f39c12;
  }

  .env-badge.prod {
    background: #e74c3c;
  }

  .commit {
    font-family: 'Courier New', monospace;
    font-size: 12px;
    background: #ecf0f1;
    padding: 2px 6px;
    border-radius: 3px;
    color: #2c3e50;
  }

  .branch {
    color: #7f8c8d;
    font-size: 12px;
  }

  .committer {
    color: #95a5a6;
    font-size: 12px;
  }
</style>
