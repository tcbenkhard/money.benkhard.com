import {z} from "zod";

export const CreateAdministrationRequestSchema = z.object({
    name: z.string(),
    owner: z.string(),
})

export type CreateAdministrationRequest = z.infer<typeof CreateAdministrationRequestSchema>

const CreateMembershipSchema = z.object({
    administrationId: z.string().uuid(),
    user: z.string(),
    role: z.string(),
    grantedBy: z.string(),
    grantedOn: z.string().date()
})

const CreateGroupSchema = z.object({
    id: z.string().uuid(),
    administrationId: z.string().uuid(),
    name: z.string(),
    type: z.string()
})

export class Administration {
    private name: string
    private owner: string
    private id: string
}