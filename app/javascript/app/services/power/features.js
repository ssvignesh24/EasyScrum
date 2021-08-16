import Network from '../network';

export default class User extends Network{

  list(){
    return this.get("/power/features.json")
  }

  toggle(featureId, state){
    return this.post(`/power/features/${featureId}/toggle.json`, { state })
  }

}