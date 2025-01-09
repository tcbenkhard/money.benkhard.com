/*
* Invite someone to an administration
* */
import {BaseHandler} from "@tcbenkhard/aws-utils/dist/lambda";
import {MoneyService} from "./service/money-service";
import {APIGatewayProxyEvent} from "aws-lambda";
import {parseBody} from "@tcbenkhard/aws-utils";
import {
    CreateInvitationRequest,
    CreateInvitationRequestSchema,
    InvitationRequest,
    InvitationRequestSchema
} from "./model/invitation";

/*
* Invite someone to your administration
* */
export class CreateInvitationHandler extends BaseHandler<CreateInvitationRequest, void> {
    constructor(private service: MoneyService) {
        super(201);
    }

    async parseEvent(event: APIGatewayProxyEvent): Promise<CreateInvitationRequest> {
        return parseBody(event.body, CreateInvitationRequestSchema, {
            createdBy: event.requestContext.authorizer!.user
        })
    }

    async handleRequest(request: CreateInvitationRequest): Promise<void> {
        await this.service.inviteUserToAdministration(request)
    }
}

/*
* Accept the invitation
* */
export class AcceptInvitationHandler extends BaseHandler<InvitationRequest, void> {
    constructor(private service: MoneyService) {
        super(201);
    }

    async parseEvent(event: APIGatewayProxyEvent): Promise<InvitationRequest> {
        return parseBody(null, InvitationRequestSchema, {
            user: event.requestContext.authorizer!.user,
            administration: event.pathParameters!.administration,
        })
    }

    async handleRequest(request: InvitationRequest): Promise<void> {
        await this.service.acceptInvitation(request)
    }
}