import { z } from 'zod'


/** Auth & user */
const authSchema = z.object({
    name: z.string(),
    email: z.email(),
    current_password: z.string(),
    password: z.string,
    password_confirmation: z.string(),
    token: z.string()
})

type Auth = z.infer<typeof authSchema>
export type UserLoginForm = Pick<Auth, 'email' | 'password'>
export type UserRegistrationForm = Pick<Auth, 'name' | 'email' | 'password' | 'password_confirmation'>
export type RequestConfirmationCodeForm = Pick<Auth, 'email'>
export type ForgotPasswordForm = Pick<Auth, 'email'>
export type NewPasswordForm = Pick<Auth, 'password' | 'password_confirmation'>
export type ConfirmToken = Pick<Auth, 'token'>
export type UpdateCurrentUserPassword = Pick<Auth, 'current_password' | 'password' | 'password_confirmation'>
export type checkPasswordForm = Pick<Auth, 'password'>

/** Users */
//de esta manera usarmos solo los campos que necesitamos de authSchema
export const userSchema = authSchema.pick({
    name: true,
    email: true,
}).extend({//agregamos atrributos adicionales
    _id: z.string(),
})
export type User = z.infer<typeof userSchema>
export type UserProfileForm = Pick<User, 'name' | 'email'> //lo que se espera de un formulario para editar el perfil del usuario

/**Notes , una nota pertenece a las tareas */
const noteSchema = z.object({
    _id: z.string(),
    content: z.string(),
    createdBy: userSchema,
    task: z.string(),
    createdAt: z.string(),
})

export type Note = z.infer<typeof noteSchema>
export type NoteFormData = Pick<Note, 'content'> //lo que se espera de un formulario para crear una nota


/** Task */
export const TaskStatusSchema = z.enum(["pending", "onHold", "inProgress", "underReview", "completed"])
export type TaskStatus = z.infer<typeof TaskStatusSchema>

export const taskSchema = z.object({
    _id: z.string(),
    name: z.string(),
    description: z.string(),
    project: z.string(),
    status: TaskStatusSchema,
    completedBy: z.array(z.object({
        _id: z.string(),
        user: userSchema,
        status: TaskStatusSchema
    })), // puede ser un usuario o null
    notes: z.array(noteSchema.extend({
        createdBy: userSchema
    })),
    createdAt: z.string(),
    updatedAt: z.string(),

})

export const taskProjectSchema = taskSchema.pick({
    _id: true,
    name: true,
    description: true,
    status: true,
})

export type Task = z.infer<typeof taskSchema> // esta es la forma que debe tener una tarea
export type TaskFormData = Pick<Task, "name" | "description">//esta es la forma que debe tener el formulario de una tarea
export type TaskProject = z.infer<typeof taskProjectSchema> //esta es la forma que debe tener una tarea en el proyecto

/** Projects */
export const projectSchema = z.object({
    _id: z.string(),
    projectName: z.string(),
    clientName: z.string(),
    description: z.string(),
    manager: z.string(),
    tasks: z.array(taskProjectSchema),
    team: z.string().array(),

})

export const dashboardProjectSchema = z.array(
    projectSchema.pick({
        _id: true,
        projectName: true,
        clientName: true,
        description: true,
        manager: true
    })
)

export const editProjectSchema = projectSchema.pick({
    projectName: true,
    clientName: true,
    description: true,
})
export type Project = z.infer<typeof projectSchema>
export type ProjectFormData = Pick<Project, 'clientName' | 'projectName' | 'description'>

/**Team */

const teamMemberSchema = userSchema.pick({//con pick seleccionamos solo los campos que necesitamos
    name: true,
    email: true,
    _id: true
})
export const teamMembersSchema = z.array(teamMemberSchema)
export type TeamMember = z.infer<typeof teamMemberSchema>//lo que se espera de un integrante del equipo
export type teamMemberForm = Pick<TeamMember, 'email'>//lo que se espera de un formulario para agregar un miembro al equipo