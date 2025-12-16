<script>
  import { onMount } from 'svelte';
  import { link } from 'svelte-spa-router';

  let loading = true;
  let error = null;
  let environments = [];
  let editingId = null;
  let editingPriority = null;

  async function fetchEnvironments() {
    loading = true;
    error = null;
    
    try {
      const response = await fetch('/api/admin/environments');
      if (!response.ok) throw new Error(`Failed to fetch environments: ${response.status}`);
      
      environments = await response.json();
      loading = false;
    } catch (err) {
      error = err.message;
      loading = false;
    }
  }

  async function updateEnvironmentPriority(id, priority) {
    try {
      const response = await fetch(`/api/admin/environments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priority: parseInt(priority) })
      });

      if (!response.ok) throw new Error('Failed to update priority');

      editingId = null;
      editingPriority = null;
      await fetchEnvironments();
    } catch (err) {
      alert(err.message);
    }
  }

  async function syncEnvironments() {
    try {
      const response = await fetch('/api/admin/environments/sync', {
        method: 'POST'
      });

      if (!response.ok) throw new Error('Failed to sync environments');

      await fetchEnvironments();
    } catch (err) {
      alert(err.message);
    }
  }

  function startEditing(env) {
    editingId = env.id;
    editingPriority = env.priority;
  }

  function cancelEditing() {
    editingId = null;
    editingPriority = null;
  }

  function formatDate(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleString();
  }

  onMount(fetchEnvironments);
</script>

<div class="page">
  <div class="content">
    <div class="header">
      <h1>Admin Settings</h1>
    </div>

    <nav class="subnav">
      <a href="/admin/keys" use:link class="subnav-item">
        API Keys
      </a>
      <a href="/admin/environments" use:link class="subnav-item active">
        Environment Priority
      </a>
    </nav>

    <div class="tab-header">
      <h2>Environment Priority</h2>
      <button class="btn-primary" on:click={syncEnvironments}>
        Discover New Environments
      </button>
    </div>

    <div class="info-box">
      <p><strong>Priority Ordering:</strong> Higher numbers appear first. Environments are displayed in priority order (highest first) on the dashboard and in dropdown filters. Environments without a priority are treated as 0 and shown last.</p>
      <p style="margin-top: 0.5rem;"><strong>Discover New Environments:</strong> Click the button above to scan all deployments and add any new environments that haven't been prioritized yet. They'll be added with a priority of 0.</p>
    </div>

    {#if loading}
      <div class="loading">Loading environments...</div>
    {:else if error}
      <div class="error">
        <h3>Failed to load environments</h3>
        <p>{error}</p>
      </div>
    {:else if environments.length === 0}
      <div class="empty">
        <p>No environments found. Deploy to an environment or click "Discover New Environments" to scan existing deployments.</p>
      </div>
    {:else}
      <div class="data-container">
        <table>
          <thead>
            <tr>
              <th>Environment</th>
              <th>Priority</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {#each environments as env}
              <tr>
                <td class="env-name">{env.name}</td>
                <td class="env-priority">
                  {#if editingId === env.id}
                    <input 
                      type="number" 
                      bind:value={editingPriority}
                      class="priority-input"
                      on:keydown={(e) => e.key === 'Enter' && updateEnvironmentPriority(env.id, editingPriority)}
                    />
                  {:else}
                    <span class="priority-value">{env.priority}</span>
                  {/if}
                </td>
                <td class="env-actions">
                  {#if editingId === env.id}
                    <button class="btn-save" on:click={() => updateEnvironmentPriority(env.id, editingPriority)}>
                      Save
                    </button>
                    <button class="btn-cancel" on:click={cancelEditing}>
                      Cancel
                    </button>
                  {:else}
                    <button class="btn-edit" on:click={() => startEditing(env)}>
                      Edit
                    </button>
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

  .tab-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
  }

  .tab-header h2 {
    font-size: 1.25rem;
    color: #2c3e50;
    margin: 0;
  }

  .btn-primary {
    background: #5b9dd9;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 6px;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
  }

  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  }

  .btn-edit {
    background: #3498db;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;
    margin-right: 0.5rem;
  }

  .btn-edit:hover {
    background: #2980b9;
  }

  .btn-save {
    background: #27ae60;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;
    margin-right: 0.5rem;
  }

  .btn-save:hover {
    background: #229954;
  }

  .btn-cancel {
    background: #95a5a6;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;
  }

  .btn-cancel:hover {
    background: #7f8c8d;
  }

  .info-box {
    background: #e8f4f8;
    border-left: 4px solid #3498db;
    padding: 1rem 1.5rem;
    border-radius: 6px;
    margin-bottom: 2rem;
  }

  .info-box p {
    margin: 0;
    font-size: 14px;
    color: #2c3e50;
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

  .data-container {
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

  th:last-child {
    text-align: right;
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

  .env-name {
    font-weight: 600;
    color: #2c3e50;
  }

  .env-priority {
    font-family: 'Courier New', monospace;
  }

  .priority-value {
    font-size: 16px;
    font-weight: 600;
    color: #3498db;
  }

  .priority-input {
    width: 80px;
    padding: 0.5rem;
    border: 2px solid #3498db;
    border-radius: 4px;
    font-family: 'Courier New', monospace;
    font-size: 14px;
    font-weight: 600;
  }

  .priority-input:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
  }

  .env-date {
    font-size: 13px;
    color: #7f8c8d;
  }

  .env-actions {
    text-align: right;
  }
</style>
