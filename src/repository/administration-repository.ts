import {DocumentClient} from "aws-sdk/clients/dynamodb";
import {getEnv, ServerError} from "@tcbenkhard/aws-utils";
import {Membership} from "../model/membership";
import {Administration} from "../model/administration";

/*
* The keys in this table are:
* - pk, sk
* */
export class AdministrationRepository {
    private dynamodb: DocumentClient;
    private tableName = getEnv('ADMINISTRATION_TABLE_NAME')

    constructor() {
        this.dynamodb = new DocumentClient()
    }

    async createMembership(membership: Membership) {
        await this.dynamodb.batchWrite({
            RequestItems: {
                [this.tableName]: [
                    {
                        PutRequest: {
                            Item: membership.toUserItem(),
                        }
                    },
                    {
                        PutRequest: {
                            Item: membership.toAdministrationItem(),
                        }
                    }
                ]
            }
        }).promise()
    }

    async getMembershipsForEmail(email: string) {
        const result = await this.dynamodb.query({
            TableName: this.tableName,
            KeyConditionExpression: 'pk = :pk and begins_with(sk, :sk)',
            ExpressionAttributeValues: {
                ':pk': `${Membership.PREFIX}${email}`,
                ':sk': `${Administration.PREFIX}`,
            }
        }).promise()

        if (!result.Items) return []
        return result.Items.map(Membership.fromUserItem) as Membership[]
    }

    async getMembershipsForAdministration(administration: string) {
        const result = await this.dynamodb.query({
            TableName: this.tableName,
            KeyConditionExpression: 'pk = :pk and begins_with(sk, :sk)',
            ExpressionAttributeValues: {
                ':pk': `${Administration.PREFIX}${administration}`,
                ':sk': `${Membership.PREFIX}`,
            }
        }).promise()

        if (!result.Items) return []
        return result.Items.map(Membership.fromAdministrationItem) as Membership[]
    }

    async createAdministration(administration: Administration) {
        await this.dynamodb.put({
            TableName: this.tableName,
            Item: administration.toItem(),
            ConditionExpression: 'attribute_not_exists(pk)'
        }).promise()
    }

    async getAdministration(administration: string) {
        const result = await this.dynamodb.get({
            TableName: this.tableName,
            Key: {
                pk: `${Administration.PREFIX}${administration}`,
                sk: `${Administration.PREFIX}${administration}`,
            }
        }).promise()

        if (!result.Item) throw ServerError.notFound("ADMINISTRATION_NOT_FOUND", "Administration does not exist: " + administration)
        return Administration.fromItem(result.Item)
    }

    async listAdministrationsForEmail(email: string) {
        const membershipResults = await this.dynamodb.query({
            TableName: this.tableName,
            KeyConditionExpression: 'pk = :pk and begins_with(sk, :sk)',
            ExpressionAttributeValues: {
                ':pk': `${Membership.PREFIX}${email}`,
                ':sk': `${Administration.PREFIX}`,
            }
        }).promise()
        if (!membershipResults.Items) return []
        const memberships = membershipResults.Items.map(Membership.fromUserItem)
        const administrationResults = await this.dynamodb.batchGet({
            RequestItems: {
                [this.tableName]: {
                    Keys: memberships.map(membership => ({
                        pk: `${Administration.PREFIX}${membership.administration}`,
                        sk: `${Administration.PREFIX}${membership.administration}`,
                    }))
                }
            }
        }).promise()
        if (!administrationResults.Responses) return []
        return administrationResults.Responses[this.tableName]!.map(Administration.fromItem)
    }
}