/**
 * Created by sunharuka on 14-7-31.
 */
var Message = require('./message');
class TextMessage extends Message{
  public content = "";
}
module.exports = TextMessage;