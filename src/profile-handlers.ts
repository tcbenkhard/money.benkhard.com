import {BaseHandler} from "@tcbenkhard/aws-utils/dist/lambda";
import {APIGatewayProxyEvent} from "aws-lambda";
import {parseBody} from "@tcbenkhard/aws-utils";
import {
    CreateProfileRequest,
    CreateProfileRequestSchema,
    GetProfileRequest,
    GetProfileRequestSchema,
    Profile
} from "./model/profile";
import {MoneyService} from "./service/money-service";

/*
 * This handler returns the user's profile, if it exists.
 * */
export class GetProfileHandler extends BaseHandler<GetProfileRequest, Profile> {

    constructor(private service: MoneyService) {
        super();
    }

    async parseEvent(event: APIGatewayProxyEvent): Promise<GetProfileRequest> {
        return parseBody(event.body, GetProfileRequestSchema, {
            email: event.requestContext.authorizer!.user
        })
    }

    async handleRequest(request: GetProfileRequest): Promise<Profile> {
        return this.service.getProfile(request)
    }
}


/*
 * This handler creates a new profile if it does not exist yet.
 * */
export class CreateProfileHandler extends BaseHandler<CreateProfileRequest, Profile> {
    constructor(private service: MoneyService) {
        super();
    }

    parseEvent(event: APIGatewayProxyEvent): Promise<CreateProfileRequest> {
        return parseBody(event.body, CreateProfileRequestSchema, {
            email: event.requestContext.authorizer!.user
        })
    }

    handleRequest(request: CreateProfileRequest): Promise<Profile> {
        return this.service.createProfile(request)
    }
}