
const express = require('express');
const app = express();
const line = require('@line/bot-sdk');
const config = require('./config');
const client = new line.Client(config);
const port = process.env.PORT || 5000;
const fs = require('fs');

app.post('/webhook', line.middleware(config), (req, res) => {
  Promise
        .all(req.body.events.map(handleEvent))
        .then((result) => res.json(result));
});

function handleEvent(event) {
  switch (event.type) {
    case 'message':
      switch (event.message.type) {
        case 'text':
          return   Intent(event);
        case 'image':
          return  image(event);
        case 'video':
          return  broadcast(event);
        case 'audio':
          return  broadcast(event);
        case 'location':
          return  broadcast(event);
        case 'sticker':
          return  broadcast(event);
        default:
          throw new Error(`Unknown message: ${JSON.stringify(message)}`);
      }

    case 'follow':
      return follow(event);

    case 'unfollow':
      return console.log(`Unfollowed this bot: ${JSON.stringify(event)}`);

    case 'join':
      return replyText(event.replyToken, `Joined ${event.source.type}`);

    case 'leave':
      return console.log(`Left: ${JSON.stringify(event)}`);

    case 'postback':

      return replyText(event.replyToken, `Got postback: ${data}`);

    case 'beacon':
      const dm = `${Buffer.from(event.beacon.dm || '', 'hex').toString('utf8')}`;
      return beacon(event,dm);
    default:
      throw new Error(`Unknown event: ${JSON.stringify(event)}`);
  }
}

function image(event){
  var messageID=event.message.id;
  
}

function Intent(event){
    const imageBuffer = fs.readFileSync(__dirname+"/img/img01.jpg");
    const tfimage = tfnode.node.decodeImage(imageBuffer);

    console.log(tfimage)

}


function follow(event){
  var msg={
    type: 'text',
    text:  "ขอบคุณที่เป็นเพื่อนกับเรา \uDBC0\uDC03  หากไม่ต้องการรับการแจ้งเตือน ขอให้ไปที่เมนูที่มุมขวาบนของหน้าจอแล้วปิดใช้งานการแจ้งเตือน \uDBC0\uDC2E   "
  };
  client.replyMessage(event.replyToken, msg);
}

function beacon(event,dm){ 
}

app.listen(port, () => {
  console.log(`listening on ${port}`);
});