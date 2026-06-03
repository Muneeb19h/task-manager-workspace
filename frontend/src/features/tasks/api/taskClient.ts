import axios from 'axios';

export const taskClient = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',
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
taskClient.interceptors.response.use(
  (response) => {
    // 1. If the request URL contains 'token', bypass mapping completely
    if (response.config.url?.includes('token')) {
      return response;
    }

    // 2. If the response data is an array (TaskList API view)
    if (Array.isArray(response.data)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      response.data = response.data.map((djangoTask: any) => ({
        id: String(djangoTask.id),
        title: djangoTask.title,
        description: djangoTask.description || '',
        status: djangoTask.status,
        dueDate: djangoTask.due_date || djangoTask.dueDate,
      }));
    }
    // 3. Only parse as a single task if it looks like a valid task object (has an id or title)
    // This prevents parsing Django error structures like { detail: "..." }
    else if (
      response.data &&
      typeof response.data === 'object' &&
      ('id' in response.data || 'title' in response.data)
    ) {
      response.data = {
        id: String(response.data.id),
        title: response.data.title,
        description: response.data.description || '',
        status: response.data.status,
        dueDate: response.data.due_date || response.data.dueDate,
      };
    }

    return response;
  },
  (error) => {
    // Pass errors straight down to the catch block in useTaskOperations where they belong!
    return Promise.reject(error);
  }
);

export default taskClient;
