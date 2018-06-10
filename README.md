# aws-lambda-typescript-dynamodb-query-example
Example of AWS Lambda querying DynamoDb Global Secondary Index (with DynamoDb Mapper) in TypeScript

## Get started with serverless, typescript and AWS

Prepare the local deveopment environment.
On Ubuntu/Debian:
```
$ sudo apt install npm
$ sudo npm install serverless -g
$ sls version
1.27.3
$ sudo npm install typescript -g
$ tsc --version
Version 2.9.1
```

Also install Visual Studio Code.

## Build the package

Fetch all the dependency modules:
```
npm install
```

Deploy package
```
sls deploy
```

## Test

In AWS Lambda, run with following payload: `{ stage: 'dev'}`.
You will see following output:
```
2018-06-10T15:56:25.839Z	d46f2c82-6cc6-11e8-a0a2-5fe0274bcd72	started: {"stage":"dev"}
2018-06-10T15:56:25.887Z	d46f2c82-6cc6-11e8-a0a2-5fe0274bcd72	entry: {"id":"2","status":"failed"}
2018-06-10T15:56:25.887Z	d46f2c82-6cc6-11e8-a0a2-5fe0274bcd72	entry: {"id":"4","status":"failed"}
2018-06-10T15:56:25.887Z	d46f2c82-6cc6-11e8-a0a2-5fe0274bcd72	found 2 items
2018-06-10T15:56:25.908Z	d46f2c82-6cc6-11e8-a0a2-5fe0274bcd72	metric saved
2018-06-10T15:56:25.908Z	d46f2c82-6cc6-11e8-a0a2-5fe0274bcd72	END
```

Though you have to seed some 'failed' entries into dev-valters-query-example DynamoDb table first.

The trick with passing stage to lambda (and then building the DynamoDb table name from param) is
that single Lambda function might serve all your stage environments - dev/test/qa that you run in your account.
