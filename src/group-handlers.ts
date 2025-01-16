/*
* Create an administration and owner memberships
* */
import {CreateGroupRequest, CreateGroupRequestSchema, GetGroupsRequest, Group} from "./model/group";
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
            createdBy: event.requestContext.authorizer!.user
        })
    }

    async handleRequest(request: CreateGroupRequest): Promise<Group> {
        return await this.service.createGroup(request)
    }
}

export class ListGroupsHandler extends BaseHandler<GetGroupsRequest, Array<Group>> {
    constructor(private service: MoneyService) {
        super(201);
    }

    async parseEvent(event: APIGatewayProxyEvent): Promise<GetGroupsRequest> {
        return parseBody(event.body, CreateGroupRequestSchema, {
            administrationId: event.pathParameters!.administration,
            createdBy: event.requestContext.authorizer!.user
        })
    }

    async handleRequest(request: GetGroupsRequest): Promise<Array<Group>> {
        return await this.service.getGroups(request)
    }
}