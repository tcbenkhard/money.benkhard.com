import {DocumentClient} from "aws-sdk/clients/dynamodb";
import {getEnv, ServerError} from "@tcbenkhard/aws-utils";
import {Profile} from "../model/profile";

export class ProfilesRepository {
    private dynamodb: DocumentClient;
    private tableName = getEnv('PROFILES_TABLE_NAME')
    constructor() {
        this.dynamodb = new DocumentClient()
    }

    async getProfile(email: string) {
        const result = await this.dynamodb.get({
            TableName: this.tableName,
            Key: {
                email,
            }
        }).promise()

        if (!result.Item) {
            throw ServerError.notFound("NO_PROFILE_EXISTS", "No profile found for email: " + email + "")
        }
        return result.Item as Profile;
    }

    async createProfile(profile: Profile) {
        const result = await this.dynamodb.put({
            TableName: this.tableName,
            Item: profile,
            ConditionExpression: 'attribute_not_exists(email)'
        }).promise()
    }
}