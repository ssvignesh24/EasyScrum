import Network from '../network';

export default class User extends Network{

  constructor(userId){
    super()
    if(userId) this.userId = userId;
  }

  list(){
    return this.get("/power/users.json")
  }

  show(userId){
    return this.get(`/power/users/${userId}.json`)
  }

}