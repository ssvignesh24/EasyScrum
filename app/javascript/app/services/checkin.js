import Network from './network';

export default class Checkin extends Network{

  list(){
    return this.get("/checkins.json")
  }

  create(payload){
    return this.post("/checkins.json", { checkin: payload })
  }

  show(checkinId){
    return this.get(`/checkins/${checkinId}.json`)
  }

  edit(checkinId){
    return this.get(`/checkins/${checkinId}/edit.json`)
  }

  update(checkin){
    return this.put(`/checkins/${checkin.id}.json`, { checkin })
  }

  destroy(checkinId){
    return this.delete(`/checkins/${checkinId}.json`)
  }

  togglePause(checkinId){
    return this.post(`/checkins/${checkinId}/toggle_pause.json`)
  }

  getIssue(checkinId, issueId){
    return this.get(`/checkins/${checkinId}/issues/${issueId}.json`)
  }

  destroy(checkinId){
    return this.delete(`/checkins/${checkinId}.json`)
  }

  respond(checkinId, token, answers){
    return this.post(`/checkins/${checkinId}/respond.json`, {token, answers })
  }


}