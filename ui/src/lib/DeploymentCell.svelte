<script>
  export let deployment;

  function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
  }
</script>

<div class="deployment-cell">
  <div class="version">{deployment.version}</div>
  <div class="timestamp">{formatTimestamp(deployment.timestamp)}</div>
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
