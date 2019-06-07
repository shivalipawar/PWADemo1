import * as express from 'express';
import {Application} from "express";
const cors = require('cors')
const bodyParser = require('body-parser');
import {addPushSubscriber} from "./add-push-subscriber.route";
import {sendNotification} from "./send-notification.route";
const webpush = require('web-push');

const vapidKeys = {
    "publicKey":"BIXkYQtZj7QqY4jln7NOIpFk5jr4qK03kSkD5j7jVdZcmbjUZ8KVe4fwTkYgmJdMRCBu2MvlU_jTCcpg5kvo4S8",
    "privateKey":"T70zOqEBxWe1YhO6tOPK6qtEoQcCQ61gFjWtnWLzKIE"
};


webpush.setVapidDetails(
    'mailto:example@yourdomain.org',
    vapidKeys.publicKey,
    vapidKeys.privateKey
);


const app: Application = express();

app.use(cors())
app.use(bodyParser.json());

const httpServer = app.listen(9000, ()=>{
    console.log("Http server running at port "+httpServer.address().port);
})

app.route('/api/notifications')
    .post(addPushSubscriber);

app.route('/api/sendnotification')
    .post(sendNotification);
