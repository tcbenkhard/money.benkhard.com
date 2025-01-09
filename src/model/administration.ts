import {z} from "zod";
import {DocumentClient} from "aws-sdk/clients/dynamodb";
import {v4 as uuidv4} from "uuid";

export const CreateAdministrationRequestSchema = z.object({
    name: z.string(),
    owner: z.string(),
})

export const ListAdministrationsRequestSchema = z.object({
    email: z.string()
})

export type ListAdministrationsRequest = z.infer<typeof ListAdministrationsRequestSchema>

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
    static PREFIX = "admin#"
    name: string
    owner: string
    id: string
    createdOn: string

    constructor(name: string, owner: string, id: string, createdOn: string) {
        this.name = name;
        this.owner = owner;
        this.id = id;
        this.createdOn = createdOn;
    }

    toItem() {
        return {
            pk: Administration.PREFIX + this.id,
            sk: Administration.PREFIX + this.id,
            name: this.name,
            owner: this.owner,
            id: this.id,
            createdOn: this.createdOn,
        }
    }

    static fromItem(item: DocumentClient.AttributeMap) {
        return new this(
            item.name,
            item.owner,
            item.id.slice(item.pk.indexOf('#')),
            item.createdOn
        )
    }

    static fromRequest(request: CreateAdministrationRequest) {
        return new this(
            request.name,
            request.owner,
            uuidv4(),
            new Date().toISOString()
        )
    }
}