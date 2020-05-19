
var serverlessSDK = require('./serverless_sdk/index.js');
serverlessSDK = new serverlessSDK({
  orgId: 'manishhanmantraolokhande',
  applicationName: 'general-services-app',
  appUid: 'QQsF8bQn9q5kVwwg9y',
  orgUid: 'hRLkT1Q61hK3Hxb65f',
  deploymentUid: 'a6fd11ff-2fe3-41d4-8ea7-1b7d22821197',
  serviceName: 'general-services',
  shouldLogMeta: true,
  shouldCompressLogs: true,
  disableAwsSpans: false,
  disableHttpSpans: false,
  stageName: 'dev',
  serverlessPlatformStage: 'prod',
  devModeEnabled: false,
  accessKey: null,
  pluginVersion: '3.6.11',
  disableFrameworksInstrumentation: false
});

const handlerWrapperArgs = { functionName: 'general-services-dev-api', timeout: 6 };

try {
  const userHandler = require('./lambda.js');
  module.exports.handler = serverlessSDK.handler(userHandler.universal, handlerWrapperArgs);
} catch (error) {
  module.exports.handler = serverlessSDK.handler(() => { throw error }, handlerWrapperArgs);
}