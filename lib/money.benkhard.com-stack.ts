import {aws_apigateway, aws_dynamodb, aws_lambda, aws_ssm} from 'aws-cdk-lib';
import {Construct} from 'constructs';
import {b_cdk, b_dynamodb, b_lambda} from '@tcbenkhard/benkhard-cdk'

export class MoneyBenkhardComStack extends b_cdk.Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id, 'money-benkhard-com');

    const authorizerHandlerArn = aws_ssm.StringParameter.valueForStringParameter(this, '/benkhard/auth/lambda-authorizer-arn')
    const authorizerHandler = aws_lambda.Function.fromFunctionArn(this, 'AuthorizerHandler', authorizerHandlerArn)

    const profilesTable = new b_dynamodb.Table(this, 'ProfilesTable', {
      tableName: 'profile',
      partitionKey: {
        name: 'email',
        type: aws_dynamodb.AttributeType.STRING
      }
    })

    const administrationTable = new b_dynamodb.Table(this, 'AdministrationTable', {
      tableName: 'administration',
      partitionKey: {
        name: 'pk',
        type: aws_dynamodb.AttributeType.STRING
      },
      sortKey: {
        name: 'sk',
        type: aws_dynamodb.AttributeType.STRING
      }
    })

    const environment = {
      PROFILES_TABLE_NAME: profilesTable.tableName,
      ADMINISTRATION_TABLE_NAME: administrationTable.tableName,
    }

    const getProfileHandler = new b_lambda.NodejsFunction(this, 'GetProfileHandler', {
      functionName: 'get-profile-handler',
      entry: 'src/handlers.ts',
      handler: 'getProfileHandler',
      environment
    })

    const createProfileHandler = new b_lambda.NodejsFunction(this, 'CreateProfileHandler', {
      functionName: 'create-profile-handler',
      entry: 'src/handlers.ts',
      handler: 'createProfileHandler',
      environment
    })

    const createAdministrationHandler = new b_lambda.NodejsFunction(this, 'CreateAdministrationHandler', {
      functionName: 'create-administration-handler',
      entry: 'src/handlers.ts',
      handler: 'createAdministrationHandler',
      environment
    })

    const listAdministrationsHandler = new b_lambda.NodejsFunction(this, 'ListAdministrationsHandler', {
      functionName: 'list-administrations-handler',
      entry: 'src/handlers.ts',
      handler: 'listAdministrationsHandler',
      environment
    })

    const createInvitationHandler = new b_lambda.NodejsFunction(this, 'CreateInvitationHandler', {
      functionName: 'create-invitation-handler',
      entry: 'src/handlers.ts',
      handler: 'createInvitationHandler',
      environment
    })

    const acceptInvitationHandler = new b_lambda.NodejsFunction(this, 'AcceptInvitationHandler', {
      functionName: 'accept-invitation-handler',
      entry: 'src/handlers.ts',
      handler: 'acceptInvitationHandler',
      environment
    })

    const apigw = new aws_apigateway.RestApi(this, 'ApiGateway', {
      restApiName: 'money.benkhard.com',
      description: 'Money administration api',
      deployOptions: {
        stageName: 'prod',
      },
      defaultCorsPreflightOptions: {
        allowOrigins: aws_apigateway.Cors.ALL_ORIGINS,
      }
    })

    const authorizerConfig = {
      authorizer: new aws_apigateway.TokenAuthorizer(this, 'TokenAuthorizer', {
        handler: authorizerHandler,
        identitySource: 'method.request.header.Authorization',
      }),
      authorizationType: aws_apigateway.AuthorizationType.CUSTOM,
    }

    const profileResource = apigw.root.addResource('profile')
    profileResource.addMethod('GET', new aws_apigateway.LambdaIntegration(getProfileHandler), authorizerConfig)
    profileResource.addMethod('POST', new aws_apigateway.LambdaIntegration(createProfileHandler), authorizerConfig)

    const administrationResource = apigw.root.addResource('administration')
    administrationResource.addMethod('POST', new aws_apigateway.LambdaIntegration(createAdministrationHandler), authorizerConfig)
    administrationResource.addMethod('GET', new aws_apigateway.LambdaIntegration(listAdministrationsHandler), authorizerConfig)

    const invitationResource = apigw.root.addResource('invitation')
    const invitationDetailResource = invitationResource.addResource('{administrationId}')
    const invitationAcceptResource = invitationDetailResource.addResource('accept')
    const invitationRejectResource = invitationDetailResource.addResource('reject')

    invitationResource.addMethod('POST', new aws_apigateway.LambdaIntegration(createInvitationHandler), authorizerConfig)
    invitationAcceptResource.addMethod('POST', new aws_apigateway.LambdaIntegration(acceptInvitationHandler), authorizerConfig)
  }
}
