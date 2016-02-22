var async = require('async');
module.exports = function (app) {
  var loopback = require('loopback');

  var LiveStreamUrl = app.models.LiveStreamUrl;
  var LiveStream = app.models.LiveStream;
  var Shop = app.models.Shop;

  var shops = [
    { name: '大悦城' }
  ]

  // async.waterfall([
  //   // function createShop(next){
  //   //   Shop.create({ name: '万达' }, next);
  //   // },
  //   // function createShopStream(shop, next) {
  //   //   shop.liveStreams.create({
  //   //     type: 'flv',
  //   //     value: 'http://xxxx.flv'
  //   //   }, next);
  //   // }
  //
  //   // function getShop(next){
  //   //   Shop.findOne({
  //   //     where: { name: "万达" },
  //   //     include: 'liveStreams'
  //   //   }, next);
  //   // }
  //
  //   // function getStream(next){
  //   //   LiveStream.findOne({
  //   //     include: 'shop'
  //   //   }, next)
  //   // }
  //
  //
  // ], function (err, result) {
  //   console.log(err, result);
  // })
}
