import Network from './network';

export default class User extends Network{

  constructor(userId){
    super(30 * 1000)
    if(userId) this.userId = userId;
  }

  updateProfile(payload){
    return this.put("/profile.json", payload)
  }

  deleteProfile(){
    return this.delete("/profile.json")
  }

  submitFeedback(rating, comment){
    return this.post("/feedbacks.json", { rating, comment })
  }

}