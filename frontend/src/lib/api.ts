// const API_BASE_URL = 'http://localhost:5003';
const API_BASE_URL = 'https://haryana-job-alerts-backend.softricity.in';

const getHeaders = (token?: string) => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const api = {
  get: async (endpoint: string, token?: string) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: getHeaders(token),
    });
    if (!response.ok) {
      let errorData;
        try {
            errorData = await response.json();
        } catch (e) {
             errorData = { message: `HTTP error! status: ${response.status}` };
        }
      throw new Error(errorData.message || 'Network response was not ok');
    }
    return response.json();
  },

  post: async (endpoint: string, data: unknown, token?: string) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Something went wrong');
    }
    return response.json();
  },

  put: async (endpoint: string, data: unknown, token?: string) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Something went wrong');
    }
    return response.json();
  },

  patch: async (endpoint: string, data: unknown, token?: string) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PATCH', // Use PATCH method
      headers: getHeaders(token),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Something went wrong on PATCH request');
    }
    // Often PATCH requests return 204 No Content or the updated resource
    // Handle potential empty response body for 204
    if (response.status === 204) {
        return null; // Or return an empty object/success status
    }
    return response.json();
  },

  delete: async (endpoint: string, token?: string) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: getHeaders(token),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Something went wrong');
    }
    if (response.status === 204) {
        return null;
    }
    return response.json();
  },

  // Method for uploading files with FormData
  postFormData: async (endpoint: string, formData: FormData, token?: string) => {
    const headers: HeadersInit = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    // Don't set Content-Type header, let browser set it with boundary for FormData
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: formData,
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to upload' }));
      throw new Error(errorData.message || 'Upload failed');
    }
    return response.json();
  },

  // Method for updating formdata with PUT
  putFormData: async (endpoint: string, formData: FormData, token?: string) => {
    const headers: HeadersInit = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    // Don't set Content-Type header, let browser set it with boundary for FormData
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers,
      body: formData,
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to update' }));
      throw new Error(errorData.message || 'Update failed');
    }
    return response.json();
  }
};