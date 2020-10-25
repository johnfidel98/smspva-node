# smspva
A Node.js class for receiving sms codes with http://smspva.com using request-promise.

## Usage
### Initialization
```
const SMSPVAClient = require('smspvaclient/smspva');
const client = new SMSPVAClient('yourApiKey');
```
### Getting a number
```
var number = await client.getNumber({
  country:"RU", //list of all countries and optIds can be found at http://smspva.com/new_theme_api.html
  optId: 65 //yahoo
});
```


number looks like
```
{
  response: '1',
  number: '1234567890',
  id: 12345678,
  again: 0,
  text: null,
  extra: '',
  karma: 46.06000000000003,
  pass: null,
  sms: null,
  balanceOnPhone: 0,
  service: null,
  country: null,
  CountryCode: '+44',
  branchId: 0,
  callForwarding: false,
  goipSlotId: -1
}
```

### Receiving a sms

```
  var code = await client.getCode({
    country:"RU",
    optId:65,
    id: number.id
  });
```
Get the received code from a number

returns null if no sms was received
    
```
  var awaitedCode = await client.waitForCode({
    country:"RU",
    optId:65,
    id: number.id,
    timeout:300000, //optional, default: 600000 (equals 10 minutes)
    delay:30000, //optional, default: 20000 (equals 20 seconds)
  });   
```
Waits for the number to receive a code

throws a error if the timeout is exeeded
