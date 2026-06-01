import axios from 'axios';

export const taskClient = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

taskClient.interceptors.response.use((response) => {
  // If the response is a list of tasks from Django
  if (Array.isArray(response.data)) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    response.data = response.data.map((djangoTask: any) => ({
      id: String(djangoTask.id), // Safely converts Django's integer primary key to string
      title: djangoTask.title,
      description: djangoTask.description || '',
      status: djangoTask.status,
      dueDate: djangoTask.due_date || djangoTask.dueDate, // Handles Django snake_case due_date
    }));
    // If the response is a single task object (from POST or PUT requests)
  } else if (response.data && typeof response.data === 'object') {
    response.data = {
      id: String(response.data.id),
      title: response.data.title,
      description: response.data.description || '',
      status: response.data.status,
      dueDate: response.data.due_date || response.data.dueDate,
    };
  }
  return response;
});
