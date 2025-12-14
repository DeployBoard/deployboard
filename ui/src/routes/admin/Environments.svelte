<script>
  import { onMount } from 'svelte';

  let loading = true;
  let error = null;
  let environments = [];
  let editingEnv = null;
  let editingPriority = 0;

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

  async function updateEnvironmentPriority(id, priority) {
    try {
      const response = await fetch(`/api/admin/environments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priority })
      });

      if (!response.ok) throw new Error('Failed to update priority');

      editingEnv = null;
      await fetchEnvironments();
    } catch (err) {
      alert(err.message);
    }
  }

  function startEditPriority(env) {
    editingEnv = env.id;
    editingPriority = env.priority;
  }

  function cancelEdit() {
    editingEnv = null;
    editingPriority = 0;
  }

  onMount(fetchEnvironments);
</script>

<div class="tab-header">
  <h2>Environment Priority</h2>
  <button class="btn-primary" on:click={syncEnvironments}>
    Sync Environments
  </button>
</div>

<div class="info-box">
  <p>Set priority for each environment. Higher priority environments appear first in dropdowns and the dashboard. Environments with the same priority are sorted alphabetically.</p>
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
    <p>No environments found. Click "Sync Environments" to import from deployments.</p>
  </div>
{:else}
  <div class="data-container">
    <table>
      <thead>
        <tr>
          <th>Environment Name</th>
          <th>Priority</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {#each environments as env}
          <tr>
            <td class="env-name">{env.name}</td>
            <td class="env-priority">
              {#if editingEnv === env.id}
                <input 
                  type="number" 
                  bind:value={editingPriority} 
                  class="priority-input"
                />
              {:else}
                <span class="priority-badge">{env.priority}</span>
              {/if}
            </td>
            <td class="env-actions">
              {#if editingEnv === env.id}
                <button class="btn-save" on:click={() => updateEnvironmentPriority(env.id, editingPriority)}>
                  Save
                </button>
                <button class="btn-cancel" on:click={cancelEdit}>
                  Cancel
                </button>
              {:else}
                <button class="btn-edit" on:click={() => startEditPriority(env)}>
                  Edit Priority
                </button>
              {/if}
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
{/if}

<style>
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
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
    border-radius: 4px;
    margin-bottom: 2rem;
  }

  .info-box p {
    margin: 0;
    color: #2c3e50;
    font-size: 14px;
    line-height: 1.6;
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
    background: #34495e;
    color: white;
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

  .env-name {
    font-weight: 600;
    color: #2c3e50;
    text-transform: capitalize;
  }

  .env-priority {
    font-family: 'Courier New', monospace;
  }

  .priority-badge {
    display: inline-block;
    background: #667eea;
    color: white;
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 600;
  }

  .priority-input {
    width: 100px;
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
    font-family: 'Courier New', monospace;
  }

  .priority-input:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  .env-actions {
    text-align: right;
  }
</style>
