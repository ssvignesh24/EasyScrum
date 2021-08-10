import Network from './network';

export default class Poker extends Network{

  constructor(boardId){
    super()
    if(boardId) this.boardId = boardId;
  }

  list(){
    return this.get("/poker/boards.json")
  }

  createBoard(payload){
    return this.post("/poker/boards.json", payload)
  }

  deleteBoard(){
    return this.delete(`/poker/boards/${this.boardId}.json`)
  }

  getBoard(){
    return this.get(`/poker/boards/${this.boardId}.json`)
  }

  createIssue(payload){
    return this.post(`/poker/boards/${this.boardId}/issues.json`, payload)
  }

  removeIssue(issueId){
    return this.delete(`/poker/boards/${this.boardId}/issues/${issueId}.json`)
  }

  updateIssueStatus(issueId, status){
    return this.put(`/poker/boards/${this.boardId}/issues/${issueId}/update_status.json`, { status })
  }

  vote(issueId, vote){
    return this.put(`/poker/boards/${this.boardId}/issues/${issueId}/vote.json`, { vote })
  }

  assignPoint(issueId, points){
    return this.post(`/poker/boards/${this.boardId}/issues/${issueId}/assign.json`, { points })
  }

  clearVotes(issueId){
    return this.put(`/poker/boards/${this.boardId}/issues/${issueId}/clear_votes.json`)
  }

  removeParticipant(participantId){
    return this.delete(`/poker/boards/${this.boardId}/participant.json`, { participant_id: participantId })
  }

  renameBoard(name){
    return this.put(`/poker/boards/${this.boardId}/rename.json`, { name })
  }
}