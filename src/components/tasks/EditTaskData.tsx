import { getTaskById } from "@/api/TaskAPI"
import { useQuery } from "@tanstack/react-query"
import { Navigate, useLocation, useParams } from "react-router-dom"
import EditTaskModal from "./EditTaskModal"

export default function EditTaskData() {

    const params = useParams()
    const projectId = params.projectId!

    const location = useLocation()
    const queryParams = new URLSearchParams(location.search) // con esto obtenemos los query params de la url
    const taskId = queryParams.get('editTask')! // con esto podemos saber si taskId existe

    const { data, isError } = useQuery({
        queryKey: ['task', taskId],
        queryFn: () => getTaskById({ projectId: projectId, taskId: taskId }), // el projectId no es necesario para este caso
        enabled: !!taskId, // solo se ejecuta si taskId existe, *el !! convierte a booleano*
        retry: false
    })
    if (isError) return <Navigate to={'/404'} />

    if (data) return <EditTaskModal data={data} taskId={taskId} />
}
