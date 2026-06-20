import axios from 'axios';

export const taskClient = axios.create({
  baseURL: import.meta.env.DEV ? 'http://127.0.0.1:8000/api/' : '/api/',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

taskClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// GUARD: Ensure response parsing only triggers for legitimate successful payloads
const isTaskEndpoint = (url?: string) => {
  if (!url) return false;
  return /(^|\/)tasks(\/|$)/.test(url);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const normalizeTask = (djangoTask: any) => ({
  ...djangoTask,
  id: String(djangoTask.id),
  title: djangoTask.title,
  description: djangoTask.description || '',
  status: djangoTask.status,
  dueDate: djangoTask.due_date || djangoTask.dueDate,
});

taskClient.interceptors.response.use(
  (response) => {
    // 1. If the request URL contains 'token', bypass mapping completely
    if (response.config.url?.includes('token')) {
      return response;
    }

    // 2. Only normalize task payloads for task-specific endpoints.
    const taskEndpoint = isTaskEndpoint(response.config.url);

    if (taskEndpoint) {
      if (Array.isArray(response.data)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        response.data = response.data.map((djangoTask: any) => normalizeTask(djangoTask));
      } else if (response.data && typeof response.data === 'object') {
        if (
          'task' in response.data &&
          response.data.task &&
          typeof response.data.task === 'object'
        ) {
          response.data.task = normalizeTask(response.data.task);
        } else if ('id' in response.data || 'title' in response.data) {
          response.data = normalizeTask(response.data);
        }
      }
    }

    return response;
  },
  (error) => {
    // Pass errors straight down to the catch block in useTaskOperations where they belong!
    return Promise.reject(error);
  }
);

export default taskClient;
