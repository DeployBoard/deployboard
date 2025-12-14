const API_KEY = 'dev-key-12345';

export async function fetchDeployments() {
  try {
    const response = await fetch('/api/deployments?limit=1000', {
      headers: {
        'X-API-Key': API_KEY
      }
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch deployments:', error);
    throw error;
  }
}

// Fetch metadata with priority-sorted environments
export async function fetchMetadata() {
  try {
    const response = await fetch('/api/metadata');
    if (!response.ok) {
      throw new Error(`Failed to fetch metadata: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch metadata:', error);
    throw error;
  }
}

// Transform flat deployment list into a matrix of apps x environments
// Uses priorityOrderedEnvs if provided, otherwise falls back to default ordering
export function transformToMatrix(deployments, priorityOrderedEnvs = null) {
  const matrix = {};
  const environments = new Set();

  // Build matrix and collect environments
  deployments.forEach(deployment => {
    const { application, environment, version, timestamp, meta } = deployment;
    
    environments.add(environment);

    if (!matrix[application]) {
      matrix[application] = {};
    }

    // Keep only the most recent deployment for each app+env combination
    if (!matrix[application][environment] || 
        new Date(timestamp) > new Date(matrix[application][environment].timestamp)) {
      matrix[application][environment] = { version, timestamp, meta };
    }
  });

  // Sort applications alphabetically
  const applications = Object.keys(matrix).sort();
  
  let sortedEnvironments;
  if (priorityOrderedEnvs) {
    // Use priority ordering from metadata, but only include environments that exist in deployments
    sortedEnvironments = priorityOrderedEnvs.filter(env => environments.has(env));
  } else {
    // Fallback: Sort environments with default order
    const envOrder = ['production', 'staging', 'development'];
    sortedEnvironments = Array.from(environments).sort((a, b) => {
      const aIndex = envOrder.indexOf(a);
      const bIndex = envOrder.indexOf(b);
      
      if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
      if (aIndex !== -1) return -1;
      if (bIndex !== -1) return 1;
      return a.localeCompare(b);
    });
  }

  return {
    applications,
    environments: sortedEnvironments,
    matrix
  };
}
