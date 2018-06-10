import { Context } from "aws-lambda"

import DynamoDB = require('aws-sdk/clients/dynamodb')
import CloudWatch = require('aws-sdk/clients/cloudwatch')

import { DataMapper, QueryParameters } from '@aws/dynamodb-data-mapper'
import {
    attribute,
    hashKey,
    table,
} from '@aws/dynamodb-data-mapper-annotations'

@table('valters-query-example')
class TransactionBlock {
    @hashKey()
    id: string = ''

    @attribute()
    status: string = ''
}

const REGION = 'eu-west-1';

class ScheduleEvent {
    stage: string = 'dev'
}

const cw = new CloudWatch({ region: REGION })

function findStatus(status: string) {
    const query: QueryParameters = {
        indexName: 'index-status',
        valueConstructor: TransactionBlock,
        keyCondition: {
            status: status
        }
    }
    return query
}

function saveMetric(stage: string, items: number) {
    return cw.putMetricData(
        {
            Namespace: 'Valters Functions',
            MetricData: [
                {
                    Dimensions: [
                        {
                            Name: 'Stage',
                            Value: stage
                        }
                    ],
                    MetricName: 'Failed Entries',
                    Timestamp: new Date(),
                    Value: items,
                    Unit: 'Count'
                }
            ]
        }
    ).promise()
}


export async function find_failed_entries(event: ScheduleEvent, context: Context): Promise<{}> {

    console.log('started: ' + JSON.stringify(event))
    const mapper = new DataMapper({
        client: new DynamoDB({ region: REGION }),
        tableNamePrefix: event.stage + '-'
    })

    var items = 0
    for await (const entry of mapper.query(findStatus('failed'))) {
        console.log("entry: " + JSON.stringify(entry))
        items++;
        if (items >= 50) {
            break;
        }
    }

    console.log(`found ${items} items`)
    if (items > 0) {
        await saveMetric(event.stage, items).then(m => {
            console.log('metric saved')
        }).catch(err => {
            console.log('err: ' + JSON.stringify(err))
        })
    }
    else {
        console.log('metric skipped')
    }

    console.log('END')
    return {}
}
