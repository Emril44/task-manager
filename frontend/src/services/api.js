import axios from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL,
    withCredentials: false
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('authToken');
    console.log('Authorization token:', token); // Verify token format
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Define functions
export const getUser = async (userId) => {
    const response = await api.get(`/api/users/${userId}`); // Update to use `users` and pass `userId`
    return response.data;
};

const getTaskBoards = async () => {
    try {
        const { data } = await api.get('/api/task_boards');

        const taskBoardList = Array.isArray(data) ? data : data.taskBoards; // Adjust if necessary

        if (!taskBoardList || taskBoardList.length === 0) {
            throw new Error("No task boards found.");
        }

        // Filter out only required fields if the data is still deeply nested
        const simplifiedTaskBoards = taskBoardList.map(({ id, name, description }) => ({ id, name, description }));

        return simplifiedTaskBoards;

    } catch (error) {
        console.error('Error fetching task boards:', error);
        return [];
    }
};

const getAllUsers = async () => {
    const res = await api.get('/api/users');
    return res.data;
};

const getTasksByBoardId = async (boardId) => {
    try {
        const { data } = await api.get(`/api/task_boards/${boardId}/tasks`);
        return data;
    } catch (error) {
        console.error(`Error fetching tasks for board ${boardId}:`, error);
        return [];
    }
};

export const createTaskBoard = async (boardData) => {
    const token = localStorage.getItem('authToken');
    console.log(boardData);
    const response = await api.post('/api/task_boards', boardData, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const updateTaskBoard = async (boardId, boardData) => {
    const token = localStorage.getItem('authToken');
    const response = await api.put(`/api/task_boards/${boardId}`, boardData, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const deleteBoard = async (id) => {
    const res = await api.delete(`/api/task_boards/${id}`);
    return res.data;
};

export const getActiveBoards = async () => {
    const response = await api.get('/api/task_boards/active');
    return response.data;
};

export const getArchivedBoards = async () => {
    const response = await api.get('/api/task_boards/archived');
    return response.data;
};

export const archiveBoard = async (boardId, archived) => {
    const response = await api.put(`/api/task_boards/${boardId}/archive?archived=${archived}`);
    return response.data;
};

// Create a new task
export const createTask = async (taskData) => {
    const response = await api.post(`/api/tasks`, taskData);
    return response.data;
};

// Update an existing task
export const updateTask = async (taskId, taskData) => {
    const response = await api.put(`/api/tasks/${taskId}`, taskData);
    return response.data;
};

// Delete a task
const deleteTask = async (taskId) => {
    const response = await api.delete(`/api/tasks/${taskId}`);
    return response.data;
};

const getBoardStats = async (boardId) => {
    const response = await api.get(`/api/task_boards/${boardId}/stats`);
    return response.data;
};

const getGlobalStats = async () => {
    const response = await api.get('/api/task_boards/stats/global');
    return response.data;
};

const assignUserToTask = async (taskId, userId) => {
    const response = await api.put(`/api/tasks/${taskId}/assign`, { userId });
    return response.data;
};

// Attach functions to the `api` instance
api.getUser = getUser;
api.getTaskBoards = getTaskBoards;
api.getTasksByBoardId = getTasksByBoardId;
api.createTask = createTask;
api.updateTask = updateTask;
api.deleteTask = deleteTask;
api.updateTaskBoard = updateTaskBoard;
api.createTaskBoard = createTaskBoard;
api.archiveBoard = archiveBoard;
api.getActiveBoards = getActiveBoards;
api.getArchivedBoards = getArchivedBoards;
api.deleteBoard = deleteBoard;
api.getBoardStats = getBoardStats;
api.getGlobalStats = getGlobalStats;
api.assignUserToTask = assignUserToTask;
api.getAllUsers = getAllUsers;

export default api;