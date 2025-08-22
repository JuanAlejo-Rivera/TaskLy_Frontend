import { DndContext, type DragEndEvent } from "@dnd-kit/core"
import type { Project, TaskProject, TaskStatus } from "@/types/index"
import TaskCard from "./TaskCard"
import { statusTraslation } from "@/locales/es"
import { DropTask } from "./DropTask"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateStatus } from "@/api/TaskAPI"
import { toast } from "react-toastify"
import { useParams } from "react-router-dom"

type TaskListProps = {
    tasks: TaskProject[],
    canEdit: boolean
}

type GroupTasks = {
    [key: string]: TaskProject[]
}

const initialStatusGroups: GroupTasks = {
    pending: [],
    onHold: [],
    inProgress: [],
    underReview: [],
    completed: [],
}


const statusStyles: { [key: string]: string } = {
    pending: 'border-t-slate-500',
    onHold: 'border-t-red-500',
    inProgress: 'border-t-blue-500',
    underReview: 'border-t-amber-500',
    completed: 'border-t-emerald-500',
}

export default function TaskList({ tasks, canEdit }: TaskListProps) {

    const params = useParams();
    
    const projectId = params.projectId!;



    const queryClient = useQueryClient();
    const { mutate } = useMutation({
        mutationFn: updateStatus,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            toast.success(data)
            queryClient.invalidateQueries({ queryKey: ['project', projectId] })//invalidamos porject para que se actualice la lista de tareas
            queryClient.invalidateQueries({ queryKey: ['task'] })//invalidamos task para que se actualice el estado de la tarea
        }
    })

    const groupedTasks = tasks.reduce((acc, task) => {
        let currentGroup = acc[task.status] ? [...acc[task.status]] : [];
        currentGroup = [...currentGroup, task]
        return { ...acc, [task.status]: currentGroup };
    }, initialStatusGroups);

    const handleDragEnd = (e: DragEndEvent) => {
        const { active, over } = e
        console.log(over)
        if (over && over.id) {
            const taskId = active.id.toString()
            const status = over.id as TaskStatus
            mutate({ projectId, taskId, status })

            //optimistic update, se ejecuta antes del invalidateQueries
            //esto actualiza el estado de la tarea en el cache de react-query
            queryClient.setQueryData(['project', projectId], (prevData: Project) => {// se le pone el type de project por que la data anterior era un project
                const updatedTasks = prevData.tasks.map((task) => {
                    if (task._id === taskId) {
                        return {
                            ...task,
                            status
                        }
                    }
                    return task
                })
                return {
                    ...prevData,
                    tasks: updatedTasks
                }
            })

        }
    }


    return (
        <>
            <h1 className="text-5xl font-black my-10">Tareas</h1>

            <div className='flex gap-5 overflow-x-scroll 2xl:overflow-auto pb-32'>
                {/* //este elemento es el que recibe el drop */}
                <DndContext onDragEnd={handleDragEnd}>
                    {Object.entries(groupedTasks).map(([status, tasks]) => (
                        <div key={status} className='min-w-[300px] 2xl:min-w-0 2xl:w-1/5'>

                            <h3
                                className={`capitalize text-xl font-light border border-slate-300 bg-white p-3 border-t-8 ${statusStyles[status]} `}
                            >{statusTraslation[status]}</h3>

                            <DropTask status={status} />

                            <ul className='mt-5 space-y-5'>
                                {tasks.length === 0 ? (
                                    <li className="text-gray-500 text-center pt-3">No Hay tareas</li>
                                ) : (
                                    tasks.map(task => <TaskCard key={task._id} task={task} canEdit={canEdit} />)
                                )}
                            </ul>
                        </div>
                    ))}
                </DndContext>
            </div>

        </>
    )
}

