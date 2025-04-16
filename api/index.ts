import 'dotenv/config'

import express from 'express'
import { PublishCommand, SNSClient } from '@aws-sdk/client-sns';

const app = express()

const snsClient = new SNSClient({
  region: process.env.AWS_REGION as string,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
})

const ARN_PLATAFORM_ENDPOINT = 'arn:aws:sns:us-east-1:771906516456:endpoint/GCM/snsmobileteststrim/228a84fb-7317-38c2-a749-874862c3dfef'

app.post('/notify', async (_req, res) => {
  try {
    const data = await snsClient.send(
      new PublishCommand({
        TargetArn: ARN_PLATAFORM_ENDPOINT,
        Message: JSON.stringify({
          default: 'default',
          GCM: JSON.stringify({
            notification: {
              title: 'Nova Notificação',
              body: 'Você recebeu uma nova notificação',
            },
          }),
        }),
      })
    );
    
    console.log(data)
    
    res.status(200).json({ success: 'Notification sent successfully' })
  } catch (err) {
    console.log(err)
    
    res.status(500).json({ error: 'Error sending notification' })
  }
})

app.listen(3333, () => {
  console.log('Server is running on port 3333')
})