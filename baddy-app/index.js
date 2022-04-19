var express = require('./node_modules/express');
var app = express();
app.use(express.static('src'));
app.use(express.static('../baddy-contract/build/contracts'));
app.get('/', function (req, res) {
  res.render('index.html');
});

app.listen(3000, function () {
  console.log('Counter Dapp listening on port 3000!');
});