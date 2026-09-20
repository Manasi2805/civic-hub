const BASE_URL = '/api';

const handleResponse = async (res) => {
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    return { data: null, error: errorData.message || 'API Error' };
  }
  const data = await res.json();
  return { data, error: null };
};

export const submitComplaint = async (formData) => {
  try {
    const res = await fetch(`${BASE_URL}/complaints`, { method: 'POST', body: formData });
    return handleResponse(res);
  } catch (err) { return { data: null, error: err.message }; }
};

export const getComplaint = async (id) => {
  try {
    const res = await fetch(`${BASE_URL}/complaints/${id}`);
    return handleResponse(res);
  } catch (err) { return { data: null, error: err.message }; }
};

export const updateComplaintStatus = async (id, data) => {
  try {
    const res = await fetch(`${BASE_URL}/complaints/${id}/status`, { 
      method: 'PATCH', 
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  } catch (err) { return { data: null, error: err.message }; }
};

export const getComplaintHistory = async (id) => {
  try {
    const res = await fetch(`${BASE_URL}/complaints/${id}/history`);
    return handleResponse(res);
  } catch (err) { return { data: null, error: err.message }; }
};

export const resolveRouting = async (data) => {
  try {
    const res = await fetch(`${BASE_URL}/routing/resolve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  } catch (err) { return { data: null, error: err.message }; }
};

export const analyzeVerification = async (data) => {
  try {
    const res = await fetch(`${BASE_URL}/verification/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  } catch (err) { return { data: null, error: err.message }; }
};

export const checkDuplicate = async (data) => {
  try {
    const res = await fetch(`${BASE_URL}/verification/duplicate-check`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  } catch (err) { return { data: null, error: err.message }; }
};

export const getDashboardSummary = async () => {
  try {
    const res = await fetch(`${BASE_URL}/dashboard/summary`);
    return handleResponse(res);
  } catch (err) { return { data: null, error: err.message }; }
};

export const getDashboardIssues = async (filters = {}) => {
  try {
    const query = new URLSearchParams(filters).toString();
    const res = await fetch(`${BASE_URL}/dashboard/issues?${query}`);
    return handleResponse(res);
  } catch (err) { return { data: null, error: err.message }; }
};

export const getAreaInsight = async (areaId) => {
  try {
    const res = await fetch(`${BASE_URL}/dashboard/areas/${areaId}`);
    return handleResponse(res);
  } catch (err) { return { data: null, error: err.message }; }
};

export const getAllAreas = async () => {
  try {
    const res = await fetch(`${BASE_URL}/dashboard/areas`);
    return handleResponse(res);
  } catch (err) { return { data: null, error: err.message }; }
};

export const getInsights = async () => {
  try {
    const res = await fetch(`${BASE_URL}/dashboard/insights`);
    return handleResponse(res);
  } catch (err) { return { data: null, error: err.message }; }
};

export const getBoundaries = async () => {
  try {
    const res = await fetch(`${BASE_URL}/dashboard/boundaries`);
    return handleResponse(res);
  } catch (err) { return { data: null, error: err.message }; }
};
