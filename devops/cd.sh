# You can update the image tag and the environment variables in the env.json file
IMAGE_TAG="latest"

# Constants
FULL_IMAGE="tumktp/e-commerce-backend:$IMAGE_TAG"
TASK_FAMILY="backend-task"
AWS_DEFAULT_REGION="us-east-1"
ENV_FILE="env.json"
ECS_CLUSTER="ecs-fargate-cluster"
SERVICE_NAME="backend-service"

TASK_DEFINITION=$(aws ecs describe-task-definition \
  --task-definition "$TASK_FAMILY" \
  --region "$AWS_DEFAULT_REGION")

NEW_TASK_DEFINITION=$(echo "$TASK_DEFINITION" | jq --arg IMAGE "$FULL_IMAGE" \
  --slurpfile ENV_FILE "$ENV_FILE" \
  '.taskDefinition |
   .containerDefinitions[0].image = $IMAGE |
   .containerDefinitions[0].environment = $ENV_FILE[0] |
   del(.taskDefinitionArn, .revision, .status, .requiresAttributes, .compatibilities, .registeredAt, .registeredBy)')

NEW_TASK_INFO=$(aws ecs register-task-definition \
  --region "$AWS_DEFAULT_REGION" \
  --cli-input-json "$NEW_TASK_DEFINITION")

NEW_REVISION=$(echo "$NEW_TASK_INFO" | jq -r '.taskDefinition.revision')

echo "New revision of task definition: $NEW_REVISION"

aws ecs update-service \
  --cluster "$ECS_CLUSTER" \
  --service "$SERVICE_NAME" \
  --task-definition "${TASK_FAMILY}:${NEW_REVISION}"
