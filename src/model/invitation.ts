import {z} from "zod";
import {Administration} from "./administration";
import {Membership, MembershipRole} from "./membership";
import {DocumentClient} from "aws-sdk/clients/dynamodb";
import {stripPrefix} from "../utils/string";

export const CreateInvitationRequestSchema = z.object({
    user: z.string(),
    administration: z.string(),
    role: z.enum(["OWNER", "EDITOR", "VIEWER"]),
    createdBy: z.string(),
})

export type CreateInvitationRequest = z.infer<typeof CreateInvitationRequestSchema>

export const InvitationRequestSchema = z.object({
    user: z.string(),
    administration: z.string(),
})

export type InvitationRequest = z.infer<typeof InvitationRequestSchema>

export class Invitation {
    static PREFIX = 'invt#'

    administration: string
    createdBy: string;
    createdOn: string;
    role: MembershipRole
    email: string;


    constructor(administration: string, createdBy: string, createdOn: string, role: MembershipRole, email: string) {
        this.administration = administration;
        this.createdBy = createdBy;
        this.createdOn = createdOn;
        this.role = role;
        this.email = email;
    }

    toItem() {
        return {
            pk: `${Invitation.PREFIX}${this.email}`,
            sk: `${Administration.PREFIX}${this.administration}`,
            createdBy: this.createdBy,
            createdOn: this.createdOn,
            user: this.email
        }
    }

    toMembership() {
        return new Membership(
            this.administration,
            this.email,
            this.createdOn,
            this.createdBy,
            this.role
        )
    }

    static fromItem(item: DocumentClient.AttributeMap) {
        return new Invitation(
            stripPrefix(item.sk), item.createdBy, item.createdOn, item.role, stripPrefix(item.pk)
        )
    }

    static fromRequest(request: CreateInvitationRequest) {
        return new Invitation(
            request.administration, request.createdBy, new Date().toISOString(), MembershipRole[request.role], request.user
        )
    }
}