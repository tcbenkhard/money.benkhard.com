import {Entry} from "./entry";
import {z} from "zod";
import {Administration} from "./administration";
import {DocumentClient} from "aws-sdk/clients/dynamodb";
import {stripPrefix} from "../utils/string";
import {v4 as uuidv4} from "uuid";

export const CreateGroupRequestSchema = z.object({
    administrationId: z.string().uuid(),
    name: z.string(),
    description: z.string(),
    type: z.string(),
    createdBy: z.string(),
})

export type CreateGroupRequest = z.infer<typeof CreateGroupRequestSchema>

export class Group {
    static PREFIX = "group#"

    id: string
    administrationId: string
    name: string
    description: string
    type: string
    createdOn: string
    createdBy: string
    entries: Array<Entry>


    constructor(id: string, administrationId: string, name: string, description: string, type: string, createdOn: string, createdBy: string) {
        this.id = id;
        this.administrationId = administrationId;
        this.name = name;
        this.description = description;
        this.type = type;
        this.createdOn = createdOn;
        this.createdBy = createdBy;
    }

    toItem() {
        return {
            pk: Administration.PREFIX + this.administrationId,
            sk: Group.PREFIX + this.id,
            name: this.name,
            description: this.description,
            type: this.type,
            createdOn: this.createdOn,
            createdBy: this.createdBy
        }
    }

    static fromItem(item: DocumentClient.AttributeMap) {
        return new Group(
            stripPrefix(item.sk),
            stripPrefix(item.pk),
            item.name,
            item.description,
            item.type,
            item.createdOn,
            item.createdBy
        )
    }

    static fromRequest(request: CreateGroupRequest) {
        return new Group(
            uuidv4(),
            request.administrationId,
            request.name,
            request.description,
            request.type,
            new Date().toISOString(),
            request.createdBy,
        )
    }
}