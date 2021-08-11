import Network from './network';

export default class Retro extends Network{

  constructor(boardId){
    super()
    if(boardId) this.boardId = boardId;
  }

  list(){
    return this.get("/retro/board.json")
  }

  createBoard(payload){
    return this.post("/retro/board.json", payload)
  }

  deleteBoard(){
    return this.delete(`/retro/board/${this.boardId}.json`)
  }

  getBoard(){
    return this.get(`/retro/board/${this.boardId}.json`)
  }

  createColumn(payload){
    return this.post(`/retro/board/${this.boardId}/columns.json`, payload)
  }

  updateColumn(columnId, payload){
    return this.put(`/retro/board/${this.boardId}/columns/${columnId}.json`, { column: payload })
  }

  deleteColumn(columnId){
    return this.delete(`/retro/board/${this.boardId}/columns/${columnId}.json`)
  }
 
  createCard(columnId, payload){
    return this.post(`/retro/board/${this.boardId}/columns/${columnId}/cards.json`, payload)
  }

  updateCard(cardId, columnId, message){
    return this.put(`/retro/board/${this.boardId}/columns/${columnId}/cards/${cardId}.json`, { card: { message } })
  }

  deleteCard(columnId, cardId){
    return this.delete(`/retro/board/${this.boardId}/columns/${columnId}/cards/${cardId}.json`)
  }

  addComment(cardId, columnId, comment){
    return this.post(`/retro/board/${this.boardId}/columns/${columnId}/cards/${cardId}/comment.json`, { comment: { message: comment }})
  }

  removeComment(cardId, columnId, commentId){
    return this.delete(`/retro/board/${this.boardId}/columns/${columnId}/cards/${cardId}/comment.json`, { comment_id: commentId })
  }

  rearrangeCard(columnId, cardId, payload){
    return this.put(`/retro/board/${this.boardId}/columns/${columnId}/cards/${cardId}/rearrange.json`, payload)
  }

  createActionItem(text){
    return this.post(`/retro/board/${this.boardId}/action_items.json`, { text })
  }

  toggleComplete(itemId){
    return this.put(`/retro/board/${this.boardId}/action_items/${itemId}/toggle.json`)
  }

  deleteActionItem(itemId){
    return this.delete(`/retro/board/${this.boardId}/action_items/${itemId}.json`)
  }

  renameBoard(name){
    return this.put(`/retro/board/${this.boardId}/rename.json`, {name })
  }

  removeParticipant(participantId){
    return this.delete(`/retro/board/${this.boardId}/participant.json`, { participant_id: participantId })
  }
}