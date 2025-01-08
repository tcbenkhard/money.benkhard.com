#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { MoneyBenkhardComStack } from '../lib/money.benkhard.com-stack';

const app = new cdk.App();
new MoneyBenkhardComStack(app, 'MoneyBenkhardComStack');