<script>
  import { onMount } from 'svelte';
  import { link } from 'svelte-spa-router';

  let loading = true;
  let error = null;
  let apiKeys = [];
  let showCreateForm = false;
  let newKeyName = '';
  let newKeyValue = '';
  let visibleKeys = new Set();

  async function fetchAPIKeys() {
    loading = true;
    error = null;
    
    try {
      const response = await fetch('/api/admin/keys');
      if (!response.ok) throw new Error(`Failed to fetch API keys: ${response.status}`);
      
      apiKeys = await response.json();
      loading = false;
    } catch (err) {
      error = err.message;
      loading = false;
    }
  }

  async function createAPIKey() {
    if (!newKeyName || !newKeyValue) {
      alert('Please fill in both fields');
      return;
    }

    try {
      const response = await fetch('/api/admin/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newKeyName, key: newKeyValue })
      });

      if (!response.ok) throw new Error('Failed to create API key');

      newKeyName = '';
      newKeyValue = '';
      showCreateForm = false;
      await fetchAPIKeys();
    } catch (err) {
      alert(err.message);
    }
  }

  async function deleteAPIKey(id) {
    if (!confirm('Are you sure you want to delete this API key?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/keys/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete API key');

      await fetchAPIKeys();
    } catch (err) {
      alert(err.message);
    }
  }

  function formatDate(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleString();
  }

  function toggleKeyVisibility(keyId) {
    if (visibleKeys.has(keyId)) {
      visibleKeys.delete(keyId);
    } else {
      visibleKeys.add(keyId);
    }
    visibleKeys = visibleKeys;
  }

  onMount(fetchAPIKeys);
</script>

<div class="page">
  <div class="content">
    <div class="header">
      <h1>Admin Settings</h1>
    </div>

    <nav class="subnav">
      <a href="/admin/keys" use:link class="subnav-item active">
        API Keys
      </a>
      <a href="/admin/environments" use:link class="subnav-item">
        Environment Priority
      </a>
    </nav>

    <div class="tab-header">
      <h2>API Key Management</h2>
      <button class="btn-primary" on:click={() => showCreateForm = !showCreateForm}>
        {showCreateForm ? 'Cancel' : 'Create New Key'}
      </button>
    </div>

    {#if showCreateForm}
      <div class="create-form">
        <h3>Create New API Key</h3>
        <div class="form-group">
          <label for="keyName">Key Name</label>
          <input 
            id="keyName" 
            type="text" 
            bind:value={newKeyName} 
            placeholder="e.g., Production Deploy Key"
          />
        </div>
        <div class="form-group">
          <label for="keyValue">Key Value</label>
          <input 
            id="keyValue" 
            type="text" 
            bind:value={newKeyValue} 
            placeholder="e.g., prod-key-abc123"
          />
        </div>
        <div class="form-actions">
          <button class="btn-primary" on:click={createAPIKey}>Create Key</button>
          <button class="btn-secondary" on:click={() => showCreateForm = false}>Cancel</button>
        </div>
      </div>
    {/if}

    {#if loading}
      <div class="loading">Loading API keys...</div>
    {:else if error}
      <div class="error">
        <h3>Failed to load API keys</h3>
        <p>{error}</p>
      </div>
    {:else if apiKeys.length === 0}
      <div class="empty">
        <p>No API keys found. Create one to get started.</p>
      </div>
    {:else}
      <div class="data-container">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Key</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {#each apiKeys as key}
              <tr>
                <td class="key-name">{key.name}</td>
                <td class="key-value">
                  <div class="key-value-container">
                    <code>{visibleKeys.has(key.id) ? key.key : '••••••••••••••••'}</code>
                    <button class="btn-toggle-visibility" on:click={() => toggleKeyVisibility(key.id)} title="{visibleKeys.has(key.id) ? 'Hide' : 'Show'} key">
                      {#if visibleKeys.has(key.id)}
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                      {:else}
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                          <line x1="1" y1="1" x2="23" y2="23"></line>
                        </svg>
                      {/if}
                    </button>
                  </div>
                </td>
                <td class="key-date">{formatDate(key.created_at)}</td>
                <td class="key-actions">
                  <button class="btn-delete" on:click={() => deleteAPIKey(key.id)}>
                    Delete
                  </button>
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
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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

  .btn-secondary {
    background: #95a5a6;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 6px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;
  }

  .btn-secondary:hover {
    background: #7f8c8d;
  }

  .btn-delete {
    background: #e74c3c;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;
  }

  .btn-delete:hover {
    background: #c0392b;
  }

  .create-form {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    margin-bottom: 2rem;
  }

  .create-form h3 {
    font-size: 1.1rem;
    color: #2c3e50;
    margin-bottom: 1.5rem;
  }

  .form-group {
    margin-bottom: 1.5rem;
  }

  .form-group label {
    display: block;
    font-weight: 600;
    font-size: 14px;
    color: #2c3e50;
    margin-bottom: 0.5rem;
  }

  .form-group input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 14px;
    transition: border-color 0.2s;
  }

  .form-group input:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  .form-actions {
    display: flex;
    gap: 1rem;
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

  .key-name {
    font-weight: 600;
    color: #2c3e50;
  }

  .key-value-container {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .key-value code {
    font-family: 'Courier New', monospace;
    font-size: 14px;
    background: #ecf0f1;
    padding: 4px 8px;
    border-radius: 4px;
    color: #2c3e50;
  }

  .btn-toggle-visibility {
    background: transparent;
    border: none;
    color: #7f8c8d;
    cursor: pointer;
    padding: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    transition: all 0.2s;
  }

  .btn-toggle-visibility:hover {
    background: #ecf0f1;
    color: #2c3e50;
  }

  .key-date {
    font-size: 13px;
    color: #7f8c8d;
  }

  .key-actions {
    text-align: right;
  }
</style>
