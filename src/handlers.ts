import {ProfilesRepository} from "./repository/profiles-repository";
import {MoneyService} from "./service/money-service";
import {CreateProfileHandler, GetProfileHandler} from "./profile-handlers";
import {APIGatewayProxyEvent, Context} from "aws-lambda";

const profilesRepository = new ProfilesRepository();
const moneyService = new MoneyService(profilesRepository);

const getProfileHandlerInstance = new GetProfileHandler(moneyService);
const createProfileHandlerInstance = new CreateProfileHandler(moneyService);

export const getProfileHandler = async (event: APIGatewayProxyEvent, context: Context) => { return await getProfileHandlerInstance.handle(event, context) }
export const createProfileHandler = async (event: APIGatewayProxyEvent, context: Context) => { return await createProfileHandlerInstance.handle(event, context) }