<script>
  import { onMount } from 'svelte';
  import { fetchDeployments, fetchMetadata, transformToMatrix } from '../lib/api.js';
  import DeploymentCell from '../lib/DeploymentCell.svelte';

  let loading = true;
  let error = null;
  let applications = [];
  let environments = [];
  let matrix = {};

  onMount(async () => {
    try {
      // Fetch metadata first to get priority-ordered environments
      const metadata = await fetchMetadata();
      const deployments = await fetchDeployments();
      const transformed = transformToMatrix(deployments, metadata.environments);
      applications = transformed.applications;
      environments = transformed.environments;
      matrix = transformed.matrix;
      loading = false;
    } catch (err) {
      error = err.message;
      loading = false;
    }
  });
</script>

<div class="page">
  <div class="content">
    {#if loading}
      <div class="loading">Loading deployments...</div>
    {:else if error}
      <div class="error">
        <h3>Failed to load deployments</h3>
        <p>{error}</p>
      </div>
    {:else if applications.length === 0}
      <div class="empty">
        <p>No deployments found</p>
      </div>
    {:else}
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th class="app-column">Application</th>
              {#each environments as env}
                <th class="env-column">
                  <div class="env-header">
                    <span class="env-badge" class:prod={env === 'production'} class:staging={env === 'staging'} class:dev={env === 'development'}>
                      {env}
                    </span>
                  </div>
                </th>
              {/each}
            </tr>
          </thead>
          <tbody>
            {#each applications as app}
              <tr>
                <td class="app-name">{app}</td>
                {#each environments as env}
                  <td class="deployment-td">
                    {#if matrix[app]?.[env]}
                      <DeploymentCell deployment={matrix[app][env]} />
                    {:else}
                      <div class="no-deployment">—</div>
                    {/if}
                  </td>
                {/each}
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

  .error h3 {
    margin-bottom: 0.5rem;
  }

  .table-wrapper {
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
    padding: 1rem;
    text-align: left;
    font-weight: 600;
    font-size: 14px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .app-column {
    min-width: 200px;
    position: sticky;
    left: 0;
    background: #34495e;
    z-index: 10;
  }

  .env-column {
    min-width: 180px;
  }

  .env-header {
    display: flex;
    justify-content: center;
  }

  .env-badge {
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 600;
    text-transform: capitalize;
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

  tbody tr {
    border-bottom: 1px solid #ecf0f1;
  }

  tbody tr:hover {
    background: #f8f9fa;
  }

  tbody tr:last-child {
    border-bottom: none;
  }

  td {
    padding: 0;
  }

  .app-name {
    padding: 1rem;
    font-weight: 600;
    font-size: 15px;
    color: #2c3e50;
    position: sticky;
    left: 0;
    background: white;
    z-index: 5;
  }

  tbody tr:hover .app-name {
    background: #f8f9fa;
  }

  .deployment-td {
    border-left: 1px solid #ecf0f1;
  }

  .no-deployment {
    padding: 12px;
    text-align: center;
    color: #bdc3c7;
    font-size: 20px;
    min-height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
