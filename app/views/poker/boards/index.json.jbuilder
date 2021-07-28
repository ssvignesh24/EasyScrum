json.status true
json.boards @boards, partial: 'poker/boards/board', as: :board
json.totalCount @boards.size