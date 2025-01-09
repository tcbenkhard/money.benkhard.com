import {ProfilesRepository} from "./repository/profiles-repository";
import {MoneyService} from "./service/money-service";
import {CreateProfileHandler, GetProfileHandler} from "./profile-handlers";
import {APIGatewayProxyEvent, Context} from "aws-lambda";
import {CreateAdministrationHandler} from "./administration-handlers";
import {AdministrationRepository} from "./repository/administration-repository";

const profilesRepository = new ProfilesRepository();
const administrationsRepository = new AdministrationRepository()
const moneyService = new MoneyService(profilesRepository, administrationsRepository);

const getProfileHandlerInstance = new GetProfileHandler(moneyService);
const createProfileHandlerInstance = new CreateProfileHandler(moneyService);
const createAdministrationHandlerInstance = new CreateAdministrationHandler(moneyService);

export const getProfileHandler = async (event: APIGatewayProxyEvent, context: Context) => { return await getProfileHandlerInstance.handle(event, context) }
export const createProfileHandler = async (event: APIGatewayProxyEvent, context: Context) => { return await createProfileHandlerInstance.handle(event, context) }
export const createAdministrationHandler = async (event: APIGatewayProxyEvent, context: Context) => { return await createAdministrationHandlerInstance.handle(event, context) }