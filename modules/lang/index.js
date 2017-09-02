class Lang {
  constructor() {
    this.__messages = {}
    this.language = 'en_US'
  }

  /**
   * @TODO
   * - Parsing data in the message
   * - Save and get user language from de browser or headers
   * - Retrieve in the init function labels for the current 
   *     language and save it in the __message object
  */
  translate(category, message, data) {
    // if(this.__messages[category] && this.__messages[category][message])
    //   return this.__messages[category][message];
    return message;
  }

  t(category, message, data) {
    if(!message && !data) {
      message = category; 
      category = 'core';
    }
    return this.translate(category, message, data);
  }
}
Lang.__configurable = true;
module.exports = Lang;
