import {z} from "zod";
import {DocumentClient} from "aws-sdk/clients/dynamodb";

export const CreateProfileRequestSchema = z.object({
    displayName: z.string(),
    email: z.string()
})

export type CreateProfileRequest = z.infer<typeof CreateProfileRequestSchema>

export const GetProfileRequestSchema = z.object({
    email: z.string()
})

export type GetProfileRequest = z.infer<typeof GetProfileRequestSchema>

export class Profile {
    displayName: string
    email: string
    createdOn: string


    constructor(email: string, displayName: string, createdOn: string) {
        this.displayName = displayName;
        this.email = email;
        this.createdOn = createdOn;
    }

    static fromCreateProfileRequest(request: CreateProfileRequest) {
        return new this(
            request.email,
            request.displayName,
            new Date().toISOString()
        )
    }
}