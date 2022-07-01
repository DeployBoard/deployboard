#!/bin/bash

echo "Deleting Cognito User"
aws cognito-idp admin-delete-user \
  --region "us-east-1" \
  --profile "deployboard" \
  --user-pool-id "us-east-1_YQ9xgQ6Mb" \
  --username "tmctesterson@deployboard.io"

echo "Deleting Account From DynamoDB"
aws dynamodb delete-item \
  --region "us-east-1" \
  --profile "deployboard" \
  --table-name "dpb-dev-accounts" \
  --key '{"account": {"S": "DevTestAccount"}}'

echo "Deleting API Key(s)"
api_keys=$(aws apigateway get-api-keys \
  --region "us-east-1" \
  --profile "deployboard" \
  --name-query "DevTestAccount" \
  --query 'items[].id' \
  --output text)
for key in $api_keys; do
  echo "Deleting API Key: $key"
  aws apigateway delete-api-key \
    --region "us-east-1" \
    --profile "deployboard" \
    --api-key $key
done

###############
### COGNITO ###
###############
echo "Signing Up User"
aws cognito-idp sign-up \
  --region "us-east-1" \
  --profile "deployboard" \
  --client-id "7rdn2oofkgmth171touostrh51" \
  --username "tmctesterson@deployboard.io" \
  --password "Testuser123!" \
  --user-attributes=Name=email,Value="tmctesterson@deployboard.io",Name=custom:account,Value="DevTestAccount",Name=custom:group,Value="Admin" \

echo "Confirming User"
aws cognito-idp admin-confirm-sign-up \
  --region "us-east-1" \
  --profile "deployboard" \
  --user-pool-id "us-east-1_YQ9xgQ6Mb" \
  --username "tmctesterson@deployboard.io"

echo "Verifying Email"
aws cognito-idp admin-update-user-attributes \
  --region "us-east-1" \
  --profile "deployboard" \
  --user-pool-id "us-east-1_YQ9xgQ6Mb" \
  --username "tmctesterson@deployboard.io" \
  --user-attributes '[{"Name": "email_verified", "Value": "true"}]'

echo "Creating Group"
aws cognito-idp create-group \
  --region "us-east-1" \
  --profile "deployboard" \
  --group-name "DevTestAccount" \
  --user-pool-id "us-east-1_YQ9xgQ6Mb"

echo "Add User to Group"
aws cognito-idp admin-add-user-to-group \
  --region "us-east-1" \
  --profile "deployboard" \
  --group-name "DevTestAccount" \
  --user-pool-id "us-east-1_YQ9xgQ6Mb" \
  --username "tmctesterson@deployboard.io"

################
### DYNAMODB ###
################
echo "Putting app1 Items in DyanamoDB"
echo "- logs table..."
aws dynamodb put-item \
  --region "us-east-1" \
  --profile "deployboard" \
  --table-name "dpb-dev-logs" \
  --item '{"account": {"S": "DevTestAccount"},"app": {"S": "APP1"},"env": {"S": "Dev"},"id": {"S": "APP1Dev0-0000-0000-0000-000Deploying"},"status": {"S": "Deploying"},"timestamp": {"N": "1572431670000"},"version": {"S": "1.0.0"}}'

aws dynamodb put-item \
  --region "us-east-1" \
  --profile "deployboard" \
  --table-name "dpb-dev-logs" \
  --item '{"account": {"S": "DevTestAccount"},"app": {"S": "APP1"},"env": {"S": "Dev"},"id": {"S": "APP1Dev0-0000-0000-0000-0000Deployed"},"status": {"S": "Deployed"},"timestamp": {"N": "1572431671000"},"version": {"S": "1.0.0"}}'

aws dynamodb put-item \
  --region "us-east-1" \
  --profile "deployboard" \
  --table-name "dpb-dev-logs" \
  --item '{"account": {"S": "DevTestAccount"},"app": {"S": "APP1"},"env": {"S": "Prod"},"id": {"S": "APP1Prod-0000-0000-0000-000Deploying"},"status": {"S": "Deploying"},"timestamp": {"N": "1572431672000"},"version": {"S": "1.0.0"}}'

aws dynamodb put-item \
  --region "us-east-1" \
  --profile "deployboard" \
  --table-name "dpb-dev-logs" \
  --item '{"account": {"S": "DevTestAccount"},"app": {"S": "APP1"},"env": {"S": "Prod"},"id": {"S": "APP1Prod-0000-0000-0000-0000Deployed"},"status": {"S": "Deployed"},"timestamp": {"N": "1572431673000"},"version": {"S": "1.0.0"}}'

echo "- logs table..."
aws dynamodb put-item \
  --region "us-east-1" \
  --profile "deployboard" \
  --table-name "dpb-dev-versions" \
  --item '{"account": {"S": "DevTestAccount"},"app": {"S": "APP1"},"env": {"S": "Prod"},"id": {"S": "APP1Prod-0000-0000-0000-0000Deployed"},"status": {"S": "Deployed"},"timestamp": {"N": "1572431673000"},"version": {"S": "1.0.0"}}'

aws dynamodb put-item \
  --region "us-east-1" \
  --profile "deployboard" \
  --table-name "dpb-dev-versions" \
  --item '{"account": {"S": "DevTestAccount"},"app": {"S": "APP1"},"env": {"S": "Dev"},"id": {"S": "APP1Dev0-0000-0000-0000-0000Deployed"},"status": {"S": "Deployed"},"timestamp": {"N": "1572431671000"},"version": {"S": "1.0.0"}}'

echo "Putting app2 Items in DyanamoDB"
echo "- logs table..."
aws dynamodb put-item \
  --region "us-east-1" \
  --profile "deployboard" \
  --table-name "dpb-dev-logs" \
  --item '{"account": {"S": "DevTestAccount"},"app": {"S": "APP2"},"env": {"S": "Dev"},"id": {"S": "APP2Dev0-0000-0000-0000-000Deploying"},"status": {"S": "Deploying"},"timestamp": {"N": "1572431670500"},"version": {"S": "1.0.0"}}'

aws dynamodb put-item \
  --region "us-east-1" \
  --profile "deployboard" \
  --table-name "dpb-dev-logs" \
  --item '{"account": {"S": "DevTestAccount"},"app": {"S": "APP2"},"env": {"S": "Dev"},"id": {"S": "APP2Dev0-0000-0000-0000-0000Deployed"},"status": {"S": "Deployed"},"timestamp": {"N": "1572431671500"},"version": {"S": "1.0.0"}}'

aws dynamodb put-item \
  --region "us-east-1" \
  --profile "deployboard" \
  --table-name "dpb-dev-logs" \
  --item '{"account": {"S": "DevTestAccount"},"app": {"S": "APP2"},"env": {"S": "Prod"},"id": {"S": "APP2Prod-0000-0000-0000-000Deploying"},"status": {"S": "Deploying"},"timestamp": {"N": "1572431672500"},"version": {"S": "1.0.0"}}'

aws dynamodb put-item \
  --region "us-east-1" \
  --profile "deployboard" \
  --table-name "dpb-dev-logs" \
  --item '{"account": {"S": "DevTestAccount"},"app": {"S": "APP2"},"env": {"S": "Prod"},"id": {"S": "APP2Prod-0000-0000-0000-0000Deployed"},"status": {"S": "Deployed"},"timestamp": {"N": "1572431673500"},"version": {"S": "1.0.0"}}'

echo "- versions table..."
aws dynamodb put-item \
  --region "us-east-1" \
  --profile "deployboard" \
  --table-name "dpb-dev-versions" \
  --item '{"account": {"S": "DevTestAccount"},"app": {"S": "APP2"},"env": {"S": "Prod"},"id": {"S": "APP2Prod-0000-0000-0000-0000Deployed"},"status": {"S": "Deployed"},"timestamp": {"N": "1572431673500"},"version": {"S": "1.0.0"}}'

aws dynamodb put-item \
  --region "us-east-1" \
  --profile "deployboard" \
  --table-name "dpb-dev-versions" \
  --item '{"account": {"S": "DevTestAccount"},"app": {"S": "APP2"},"env": {"S": "Dev"},"id": {"S": "APP2Dev0-0000-0000-0000-0000Deployed"},"status": {"S": "Deployed"},"timestamp": {"N": "1572431671500"},"version": {"S": "1.0.0"}}'


echo "Putting API Items in DyanamoDB"
echo "- logs table..."
aws dynamodb put-item \
  --region "us-east-1" \
  --profile "deployboard" \
  --table-name "dpb-dev-logs" \
  --item '{"account": {"S": "DevTestAccount"},"app": {"S": "API"},"env": {"S": "Dev"},"id": {"S": "API0Dev0-0000-0000-0000-000Deploying"},"status": {"S": "Deploying"},"timestamp": {"N": "1572431674000"},"version": {"S": "1.0.0"}}'

aws dynamodb put-item \
  --region "us-east-1" \
  --profile "deployboard" \
  --table-name "dpb-dev-logs" \
  --item '{"account": {"S": "DevTestAccount"},"app": {"S": "API"},"env": {"S": "Dev"},"id": {"S": "API0Dev0-0000-0000-0000-0000Deployed"},"status": {"S": "Deployed"},"timestamp": {"N": "1572431675000"},"version": {"S": "1.0.0"}}'

aws dynamodb put-item \
  --region "us-east-1" \
  --profile "deployboard" \
  --table-name "dpb-dev-logs" \
  --item '{"account": {"S": "DevTestAccount"},"app": {"S": "API"},"env": {"S": "Prod"},"id": {"S": "API0Prod-0000-0000-0000-000Deploying"},"status": {"S": "Deploying"},"timestamp": {"N": "1572431676000"},"version": {"S": "1.0.0"}}'

aws dynamodb put-item \
  --region "us-east-1" \
  --profile "deployboard" \
  --table-name "dpb-dev-logs" \
  --item '{"account": {"S": "DevTestAccount"},"app": {"S": "API"},"env": {"S": "Prod"},"id": {"S": "API0Prod-0000-0000-0000-0000Deployed"},"status": {"S": "Deployed"},"timestamp": {"N": "1572431677000"},"version": {"S": "1.0.0"}}'

echo "- versions table..."
aws dynamodb put-item \
  --region "us-east-1" \
  --profile "deployboard" \
  --table-name "dpb-dev-versions" \
  --item '{"account": {"S": "DevTestAccount"},"app": {"S": "API"},"env": {"S": "Prod"},"id": {"S": "API0Prod-0000-0000-0000-0000Deployed"},"status": {"S": "Deployed"},"timestamp": {"N": "1572431677000"},"version": {"S": "1.0.0"}}'

aws dynamodb put-item \
  --region "us-east-1" \
  --profile "deployboard" \
  --table-name "dpb-dev-versions" \
  --item '{"account": {"S": "DevTestAccount"},"app": {"S": "API"},"env": {"S": "Dev"},"id": {"S": "API0Dev0-0000-0000-0000-0000Deployed"},"status": {"S": "Deployed"},"timestamp": {"N": "1572431675000"},"version": {"S": "1.0.0"}}'
