const request = require('request-promise');
const countries = ["RU", "KZ", "UA", "RO", "AR", "BA", "BR", "KH", "CN2", "HR", "DO", "EE", "FI", "FR", "GE", "ID", "IL", "KE", "XK", "KG", "LV", "LT", "MY", "NL", "NZ", "NG", "PK", "PY", "PL", "PH", "PL", "PT", "ZA", "ES", "SE", "UK", "US", "VN"];

class SMSPVAClient {
  constructor(apiKey) {
    this.apiKey = apiKey;
  }

  async getNumber(config){
    if(!config.country) throw "no country specified";
    if(!countries.includes(config.country)) throw "unknown country "+config.country;
    if(!config.optId) throw "no opt id specified";

    try {
      parseInt(config.optId)
    } catch (e) { throw "opt id is not a number"; }

    return JSON.parse(await request({
      url:"http://smspva.com/priemnik.php?metod=get_number&country="+config.country+"&service=opt"+config.optId+"&apikey="+this.apiKey
    }));
  }

  async getCode(config){
    if(!config.country) { throw "no country specified"; }
    if(!countries.includes(config.country)) throw "unknown country "+config.country;

    if(!config.optId) { throw "no opt id specified"; }
    try {
      config.optId = parseInt(config.optId);
    } catch (e) { throw "opt id is not a number"; }

    if(!config.id) { throw "no number id specified"; }
    try {
      config.id = parseInt(config.id);
    } catch (e) { throw "number id is not a number"; }

    return JSON.parse(await request({
      url:"http://smspva.com/priemnik.php?metod=get_sms&country="+config.country+"&service=opt"+config.optId+"&id="+config.id+"&apikey="+this.apiKey
    })).sms;
  }

  async waitForCode(config){
    if(!config.timeout) config.timeout = 600000;
    if(!config.delay) config.delay = 20000;

    try {
      config.timeout = parseInt(config.timeout);
    } catch (e) { throw "timeout is not a number"; }

    try {
      config.delay = parseInt(config.delay);
    } catch (e) { throw "delay is not a number"; }

    var startTime = Date.now();
    var sms;

    do {
      sms = await this.getCode({
        country:config.country,
        optId:config.optId,
        id:config.id
      });
      if(!sms) await this.delay(config.delay);
    } while ((!sms) && ((Date.now()-startTime) < config.timeout));

    if(!sms) throw "timeout exceeded";

    return sms;
  }

  delay(t){
    return new Promise(function(resolve, reject) {
      setTimeout(resolve, t);
    });
  }
}

module.exports = SMSPVAClient;
