export default class{
  static logEvent(tag, attributes){
    if(!window.amplitude) return;
    amplitude.getInstance().logEvent(tag, attributes);
  }
}