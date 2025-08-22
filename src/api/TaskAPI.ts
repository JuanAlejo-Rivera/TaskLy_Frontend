import { isAxiosError } from "axios";
import api from '@/lib/axios';
import { taskSchema, type Project, type Task, type TaskFormData } from './../types/index';

type TaskAPI = {
    formData: TaskFormData
    projectId: Project['_id']
    taskId: Task['_id']
    status: Task['status']
}
//con el pick puedo seleccionar las propiedades que quiero del type, sin importar todo el type
export async function createTask({ formData, projectId }: Pick<TaskAPI, 'formData' | 'projectId'>) {
    try {
        const url = `/projects/${projectId}/tasks`
        const { data } = await api.post(url, formData)// al ser post necesita dos argumentos 
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}
export async function getTaskById({ taskId, projectId }: Pick<TaskAPI, 'taskId' | 'projectId'>) {
    try {
        const url = `/projects/${projectId}/tasks/${taskId}`
        const { data } = await api(url)
        const response = taskSchema.safeParse(data)//esta es una validación de zod, si la respuesta es correcta, devuelve un objeto con success: true y data: el objeto validado, tambien le da type a data
        if (response.success) {
            return response.data
        }
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}
export async function updateTask({ projectId, taskId, formData }: Pick<TaskAPI, 'projectId' | 'taskId' | 'formData'>) {
    try {
        const url = `/projects/${projectId}/tasks/${taskId}`
        const { data } = await api.put<string>(url, formData)// al ser put necesita dos argumentos 
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}

export async function deleteTask({ taskId, projectId }: Pick<TaskAPI, 'taskId' | 'projectId'>) {
    try {
        const url = `/projects/${projectId}/tasks/${taskId}`
        const { data } = await api.delete<string>(url)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}
export async function updateStatus({ taskId, projectId, status }: Pick<TaskAPI, 'taskId' | 'projectId' | 'status'>) {
    try {
        const url = `/projects/${projectId}/tasks/${taskId}/status`
        const { data } = await api.post<string>(url, { status })
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}