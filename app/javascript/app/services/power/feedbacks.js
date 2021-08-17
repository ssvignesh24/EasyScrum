import Network from '../network';

export default class Feedback extends Network{

  list(){
    return this.get("/power/feedbacks.json")
  }

}