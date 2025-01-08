import {BaseHandler} from "@tcbenkhard/aws-utils/dist/lambda";
import {Administration, CreateAdministrationRequest, CreateAdministrationRequestSchema} from "./model/administration";
import {APIGatewayProxyEvent} from "aws-lambda";
import {parseBody} from "@tcbenkhard/aws-utils";

export class CreateAdministrationHandler extends BaseHandler<CreateAdministrationRequest, Administration> {
    async parseEvent(event: APIGatewayProxyEvent): Promise<CreateAdministrationRequest> {
        return parseBody(event.body, CreateAdministrationRequestSchema, {
            owner: event.requestContext.authorizer!.user
        })
    }

    async handleRequest(request: CreateAdministrationRequest): Promise<Administration> {
        return {}
    }
}