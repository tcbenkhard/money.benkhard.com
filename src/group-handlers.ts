/*
* Create an administration and owner memberships
* */
import {
    CreateGroupRequest,
    CreateGroupRequestSchema,
    ListGroupsRequest,
    ListGroupsRequestSchema,
    Group
} from "./model/group";
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

export class ListGroupsHandler extends BaseHandler<ListGroupsRequest, Array<Group>> {
    constructor(private service: MoneyService) {
        super(201);
    }

    async parseEvent(event: APIGatewayProxyEvent): Promise<ListGroupsRequest> {
        return parseBody(event.body, ListGroupsRequestSchema, {
            administrationId: event.pathParameters!.administration,
        })
    }

    async handleRequest(request: ListGroupsRequest): Promise<Array<Group>> {
        return await this.service.getGroups(request)
    }
}