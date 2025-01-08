import {GetProfileHandler} from "../src/profile-handlers";
import {MoneyService} from "../src/service/money-service";
import {APIGatewayProxyEvent, Context} from "aws-lambda";

describe('profile-handlers', () => {
    it('should accept empty body', () => {
        const handler = new GetProfileHandler({ getProfile: jest.fn() } as unknown as MoneyService);
        handler.handle({
            body: null,
            requestContext: {
                authorizer: {
                    user: "<EMAIL>"
                }
            }} as unknown as APIGatewayProxyEvent, {} as Context)
    });
})