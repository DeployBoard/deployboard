<script>
  import { formatDateTime } from './dateUtils.js';
  
  export let deployment;
</script>

<div class="deployment-cell">
  <div class="version">{deployment.version}</div>
  <div class="timestamp">{formatDateTime(deployment.timestamp)}</div>
  {#if deployment.meta?.commit}
    <div class="commit" title="Commit: {deployment.meta.commit}">
      {deployment.meta.commit.substring(0, 7)}
    </div>
  {/if}
</div>

<style>
  .deployment-cell {
    padding: 12px;
    min-height: 80px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .version {
    font-weight: 600;
    font-size: 16px;
    color: #2c3e50;
  }

  .timestamp {
    font-size: 12px;
    color: #7f8c8d;
  }

  .commit {
    font-family: 'Courier New', monospace;
    font-size: 11px;
    color: #95a5a6;
    background: #ecf0f1;
    padding: 2px 6px;
    border-radius: 3px;
    width: fit-content;
  }
</style>
