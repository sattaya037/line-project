
const express = require('express');
const app = express();
const line = require('@line/bot-sdk');
const config = require('./config');
const client = new line.Client(config);
const port = process.env.PORT || 5000;
const fs = require('fs');
const tf = require('@tensorflow/tfjs');
const mobilenet = require('@tensorflow-models/mobilenet');

// const tf = require('@tensorflow/tfjs')
// const mobilenet = require('@tensorflow-models/mobilenet');
//     require('@tensorflow/tfjs-node')
const jpeg = require('jpeg-js');
app.use(express.static(__dirname));
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
    console.log(messageID)
//   var myWriteStream = fs.createWriteStream(__dirname+'/img/'+messageID+'.jpg','binary');
  client.getMessageContent(messageID).then((stream) => {
    // stream.on('data', chunk => (frameData += chunk)) 
    // stream.setEncoding('binary')
    var frameData  = [];

    stream.on('data', (chunk) => {
        frameData.push(chunk); 

        // myWriteStream.write(chunk)
        // var img = jpeg.decode(chunk, true)
        // var pixels = jpeg.decode(chunk, true)
        // console.log(pixels)
    })
    stream.on('end', () => {
      var result = Buffer.concat(frameData);
      var pixels = jpeg.decode(result, true)
      mobilenet.load().then(model=>{
        model.classify(pixels).then(predictions =>{
            var message={
              type: 'text',
              text: predictions[0].className
            };
            client.replyMessage(event.replyToken, message);
        })
    })
  })


})
  
}

function Intent(event){
    // const imageBuffer = fs.readFileSync(__dirname+"/img/img01.jpg");
    
    // const pixels = jpeg.decode(imageBuffer, true)
    // mobilenet.load().then(model=>{
    //     const img = pixels;
    //     model.classify(img).then(predictions =>{
    //         console.log('Classification Results:', predictions);
    //     })
    // })

    
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