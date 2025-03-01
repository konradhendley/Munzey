export const fetchExpenses = async () => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) return []; 
  
    try {
      const response = await fetch('https://fb8a21npal.execute-api.us-east-1.amazonaws.com/dev/expenses', {
        method: 'GET',
        headers: { Authorization: `Bearer ${accessToken}` },
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch expenses.');
      }
  
      const data = await response.json();
      localStorage.setItem('expenses', JSON.stringify(data)); 
      return data;
    } catch (err) {
      console.error('Error fetching expenses:', err);
      return [];
    }
  };