import {z} from "zod";

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
    email: string
    displayName: string
    createdOn: string


    constructor(email: string, displayName: string, createdOn: string) {
        this.email = email;
        this.displayName = displayName;
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