const { requestI2CAccess } = require("node-web-i2c");
const GROVEACCELEROMETER = require("@chirimen/grove-accelerometer");
const { promisify } = require("util");
const sleep = promisify(setTimeout)


main();

async function main() {
  var i2cAccess = await requestI2CAccess();
  var port = i2cAccess.ports.get(1);
  var groveaccelerometer = new GROVEACCELEROMETER(port, 0x53);
  await groveaccelerometer.init();
  for (;;) {
    try {
      var values = await groveaccelerometer.read();
      console.log(`ax: ${values.x}, ax: ${values.y}, ax: ${values.z}`)
    } catch (err) {
      console.error("READ ERROR:" + err);
    }
    await sleep(1000);
  }
}
