import Network from './network';

export default class User extends Network{

  constructor(userId){
    super()
    if(userId) this.userId = userId;
  }

  updateProfile(payload){
    return this.put("/profile.json", payload)
  }

}