import {BaseHandler} from "@tcbenkhard/aws-utils/dist/lambda";
import {
    Administration,
    CreateAdministrationRequest,
    CreateAdministrationRequestSchema,
    ListAdministrationsRequest, ListAdministrationsRequestSchema
} from "./model/administration";
import {APIGatewayProxyEvent} from "aws-lambda";
import {parseBody} from "@tcbenkhard/aws-utils";
import {MoneyService} from "./service/money-service";

/*
* Create an administration and owner memberships
* */
export class CreateAdministrationHandler extends BaseHandler<CreateAdministrationRequest, Administration> {
    constructor(private service: MoneyService) {
        super();
    }

    async parseEvent(event: APIGatewayProxyEvent): Promise<CreateAdministrationRequest> {
        return parseBody(event.body, CreateAdministrationRequestSchema, {
            owner: event.requestContext.authorizer!.user
        })
    }

    async handleRequest(request: CreateAdministrationRequest): Promise<Administration> {
        return await this.service.createAdministration(request)
    }
}

/*
* List all administrations that you have access to
* */
export class ListAdministrationsHandler extends BaseHandler<ListAdministrationsRequest, Administration[]> {
    constructor(private service: MoneyService) {
        super();
    }

    async parseEvent(event: APIGatewayProxyEvent): Promise<ListAdministrationsRequest> {
        return parseBody(event.body, ListAdministrationsRequestSchema, {
            email: event.requestContext.authorizer!.user
        })
    }

    async handleRequest(request: ListAdministrationsRequest): Promise<Administration[]> {
        return await this.service.listAdministrationsForUser(request)
    }
}