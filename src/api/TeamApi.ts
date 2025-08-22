import { type teamMemberForm, type Project, type TeamMember, teamMembersSchema } from './../types/index';
import { isAxiosError } from "axios";
import api from "@/lib/axios";


export async function findUserByEmail({ projectId, formData }: { projectId: Project['_id']; formData: teamMemberForm }) {
    try {
        const url = `projects/${projectId}/team/find`
        const { data } = await api.post(url, formData);
        // console.log(data)
        return data;

    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}
export async function addUserToProject({ projectId, id }: { projectId: Project['_id']; id: TeamMember['_id'] }) {
    try {
        const url = `projects/${projectId}/team`
        const { data } = await api.post(url, { id });//se le envia el id del usuario a agregar al proyecto, objeto por que asi lo espera el backend
        // console.log(data)
        return data;

    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}
export async function getProjectTeam(projectId: Project['_id']) {
    try {
        const url = `projects/${projectId}/team`
        const { data } = await api.get(url);//se le envia el id del usuario a agregar al proyecto, objeto por que asi lo espera el backend
        const response = teamMembersSchema.safeParse(data);// esto es zod validation, para validar que la respuesta del backend sea un array de teamMembersSchema
        if(response.success){
            return response.data;
        }

    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}
export async function removeUserFromProject({ projectId, userId }: { projectId: Project['_id']; userId: TeamMember['_id'] }) {
    try {
        const url = `projects/${projectId}/team/${userId}`
        const { data } = await api.delete<string>(url);
        // console.log(data)
        return data;

    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}