import { addUserToProject } from "@/api/TeamApi"
import type { TeamMember } from "@/types/index"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useParams } from "react-router-dom"
import { toast } from "react-toastify"

type SerchResultProps = {
    user: TeamMember
    reset: () => void
}

export default function SerchResult({ user, reset }: SerchResultProps) {
    // const navigate = useNavigate()
    const params = useParams()
    const projectId = params.projectId!
    const queryClient = useQueryClient();


    const { mutate } = useMutation({
        mutationFn: addUserToProject,
        onError: (error) => {

            toast.error(error.message)
        }, onSuccess: (data) => {
            toast.success(data)
            reset()
            // navigate(`/projects/${projectId}/team`) // cerramos el modal y vamos a la pagina del equipo del proyecto
            // navigate(location.pathname, { replace: true }) // recargamos la misma pagina para ver el nuevo integrante del equipo, cerrando el modal
            queryClient.invalidateQueries({ queryKey: ['projectTeam', projectId] }); // invalidamos el cache de la consulta del usuario
        }
    })

    const handleAddUserToProject = () => {
        const data = { projectId, id: user._id }
        mutate(data)
    }

    return (
        <>
            <p className="mt-10 text-center font-bold">Resultado:</p>
            <div className="flex justify-between items-center">
                <p>{user.name}</p>
                <button
                    className="text-gradient hover:opacity-90 transition px-10 py-3 font-bold cursor-pointer"
                    onClick={handleAddUserToProject}
                >
                    Agregar al Proyecto
                </button>
            </div>
        </>
    )
}
