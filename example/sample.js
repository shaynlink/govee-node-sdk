const { Client } = require('../dist/src/index.cjs');

const client = new Client('689544ee-914a-414f-b32c-b00ee8fba4a8');

client.on('debug', console.warn);

let requestCount = 0;

client.on('trace', (request) => {
  requestCount++;
  console.log('%s requests executed', requestCount);
  console.log(request.data.data.devices[1].properties.colorTem);
});

client.deviceList()
  .then((devices) => console.log('%s devices', devices.size))
  .catch(() => console.error('request error'))

