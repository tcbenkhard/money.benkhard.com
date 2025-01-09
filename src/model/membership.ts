import {DocumentClient} from "aws-sdk/clients/dynamodb";
import {Administration} from "./administration";

export class Membership {
    static PREFIX = "memb#"
    administration: string
    user: string
    createdOn: string
    createdBy: string
    role: 'OWNER'|'EDITOR'|'VIEWER'


    constructor(administration: string, user: string, createdOn: string, createdBy: string, role: "OWNER" | "EDITOR" | "VIEWER") {
        this.administration = administration;
        this.user = user;
        this.createdOn = createdOn;
        this.createdBy = createdBy;
        this.role = role;
    }

    toUserItem() {
        return {
            pk: Membership.PREFIX + this.user,
            sk: Administration.PREFIX + this.administration,
            createdOn: this.createdOn,
            createdBy: this.createdBy,
            role: this.role
        }
    }

    toAdministrationItem() {
        return {
            pk: Administration.PREFIX + this.administration,
            sk: Membership.PREFIX + this.user,
            createdOn: this.createdOn,
            createdBy: this.createdBy,
            role: this.role,
        }
    }

    static fromUserItem(i: DocumentClient.AttributeMap) {
        return new Membership(
            i.sk.slice(i.sk.indexOf('#')), i.pk.slice(i.pk.indexOf('#')), i.createdOn, i.createdBy, i.role
        )
    }

    static fromAdministrationItem(i: DocumentClient.AttributeMap) {
        return new Membership(
            i.pk.slice(i.pk.indexOf('#')), i.sk.slice(i.sk.indexOf('#')), i.createdOn, i.createdBy, i.role
        )
    }
}