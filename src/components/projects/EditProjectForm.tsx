import { useForm } from 'react-hook-form'
import ProjectForm from './ProjectForm'
import { Link, useNavigate } from 'react-router-dom'
import type { Project, ProjectFormData } from '@/types/index'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { UpdateProject } from '@/api/ProjectAPI'
import { toast } from 'react-toastify'

type EditProjectFormProps = {
    data: ProjectFormData
    projectId: Project['_id']
}


export default function EditProjectForm({ data, projectId }: EditProjectFormProps) {

    const navigate = useNavigate()
    const initialValues: ProjectFormData = {
        projectName: data.projectName,
        clientName: data.clientName,
        description: data.description

    }
    const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: initialValues })

    const queryClient = useQueryClient()

    const { mutate } = useMutation({
        mutationFn: UpdateProject,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({queryKey: ['projects']}) // esta linea actualiza la cache de los proyectos, hace un query nuevo
            queryClient.invalidateQueries({queryKey: ['editProject', projectId]}) // esta linea actualiza la cache de los proyectos, hace un query nuevo
            
            toast.success(data)
            navigate('/')
        }
    })

    const handleForm = (formData: ProjectFormData) => {
        // se hace de esta manera en caso de que quiera pasar multiple datos
        const data = {
            formData,
            projectId
        }
        mutate(data)
    }

    return (
        <>
            <div className="max-w-3xl mx-auto">
                <h1 className="text-5-xl font-black">Editar Proyecto</h1>
                <p className="text-2xl font-light text-gray-500 mt-5">Llena el siguiente formulario para editar el proyecto</p>

                <nav className="my-5">
                    <Link
                        className="btn-primary px-10 py-3 text-white text-xl font-bold cursor-pointer transition-colors"
                        to={"/"}
                    >Volver a Proyectos</Link>
                </nav>

                <form
                    className="mt-10 bg-white shadow-lg p-10 rounded-lg"
                    onSubmit={handleSubmit(handleForm)}
                    noValidate
                >
                    <ProjectForm
                        register={register}
                        errors={errors}
                    />
                    <input
                        type="submit"
                        value='Guardar Cambios'
                        className=" btn-primary w-full p-3 text-white uppercase font-bold cursor-pointer transition-colors"
                    />
                </form>

            </div>
        </>
    )
}