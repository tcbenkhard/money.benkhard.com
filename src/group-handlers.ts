/*
* Create an administration and owner memberships
* */
import {CreateGroupRequest, CreateGroupRequestSchema, Group} from "./model/group";
import {BaseHandler} from "@tcbenkhard/aws-utils/dist/lambda";
import {MoneyService} from "./service/money-service";
import {APIGatewayProxyEvent} from "aws-lambda";
import {parseBody} from "@tcbenkhard/aws-utils";

export class CreateGroupHandler extends BaseHandler<CreateGroupRequest, Group> {
    constructor(private service: MoneyService) {
        super(201);
    }

    async parseEvent(event: APIGatewayProxyEvent): Promise<CreateGroupRequest> {
        return parseBody(event.body, CreateGroupRequestSchema, {
            administrationId: event.pathParameters!.administration,
            owner: event.requestContext.authorizer!.user
        })
    }

    async handleRequest(request: CreateGroupRequest): Promise<Group> {
        return await this.service.createGroup(request)
    }
}