import Network from './network';

export default class Checkin extends Network{

  list(){
    return this.get("/checkins.json")
  }

  create(payload){
    return this.post("/checkins.json", { checkin: payload })
  }

  destroy(checkId){
    return this.delete(`/checkins/${checkId}.json`)
  }

}