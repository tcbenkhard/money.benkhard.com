import {ProfilesRepository} from "./repository/profiles-repository";
import {MoneyService} from "./service/money-service";
import {CreateProfileHandler, GetProfileHandler} from "./profile-handlers";
import {APIGatewayProxyEvent, Context} from "aws-lambda";
import {CreateAdministrationHandler, ListAdministrationsHandler} from "./administration-handlers";
import {AdministrationRepository} from "./repository/administration-repository";
import {AcceptInvitationHandler, CreateInvitationHandler} from "./invitation-handlers";
import {CreateGroupHandler, ListGroupsHandler} from "./group-handlers";

/*
Instances
 */
const profilesRepository = new ProfilesRepository();
const administrationsRepository = new AdministrationRepository()
const moneyService = new MoneyService(profilesRepository, administrationsRepository);

const getProfileHandlerInstance = new GetProfileHandler(moneyService);
const createProfileHandlerInstance = new CreateProfileHandler(moneyService);

const createAdministrationHandlerInstance = new CreateAdministrationHandler(moneyService);
const listAdministrationsHandlerInstance = new ListAdministrationsHandler(moneyService)

const createInvitationHandlerInstance = new CreateInvitationHandler(moneyService);
const acceptInvitationHandlerInstance = new AcceptInvitationHandler(moneyService);

const createGroupHandlerInstance = new CreateGroupHandler(moneyService);
const listGroupsHandlerInstance = new ListGroupsHandler(moneyService)
/*
Handlers
 */

export const getProfileHandler = async (event: APIGatewayProxyEvent, context: Context) => { return await getProfileHandlerInstance.handle(event, context) }
export const createProfileHandler = async (event: APIGatewayProxyEvent, context: Context) => { return await createProfileHandlerInstance.handle(event, context) }

export const createAdministrationHandler = async (event: APIGatewayProxyEvent, context: Context) => { return await createAdministrationHandlerInstance.handle(event, context) }
export const listAdministrationsHandler = async (event: APIGatewayProxyEvent, context: Context) => { return await listAdministrationsHandlerInstance.handle(event, context) }

export const createInvitationHandler = async (event: APIGatewayProxyEvent, context: Context) => { return await createInvitationHandlerInstance.handle(event, context) }
export const acceptInvitationHandler = async (event: APIGatewayProxyEvent, context: Context) => { return await acceptInvitationHandlerInstance.handle(event, context) }

export const createGroupHandler = async (event: APIGatewayProxyEvent, context: Context) => { return await createGroupHandlerInstance.handle(event, context) }
export const listGroupsHandler = async (event: APIGatewayProxyEvent, context: Context) => { return await listGroupsHandlerInstance.handle(event, context) }