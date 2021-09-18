module ApplicationHelper
  def readable_date(date, timezone="Asia/Kolkata")
    timezone ? date&.in_time_zone(timezone)&.strftime("%d %b %Y") : date&.strftime("%d %b %Y")
  end

  def readable_time(time, timezone="Asia/Kolkata", add_timezone=false)
    if add_timezone
      timezone ? time&.in_time_zone(timezone)&.strftime("%I:%M%p %:z") : time&.strftime("%I:%M%p %:z")
    else
      timezone ? time&.in_time_zone(timezone)&.strftime("%I:%M%p") : time&.strftime("%I:%M%p")
    end
  end

  def readable_datetime(datetime, timezone="Asia/Kolkata", add_timezone=false)
    if add_timezone
      timezone ? datetime&.in_time_zone(timezone)&.strftime("%d %b %Y, %I:%M%p %:z") : datetime&.strftime("%d %b %Y, %I:%M%p %:z")
    else
      timezone ? datetime&.in_time_zone(timezone)&.strftime("%d %b %Y, %I:%M%p") : datetime&.strftime("%d %b %Y, %I:%M%p")
    end
  end

  def guest_target_link(board)
    case board.class.to_s
    when "Retro::Board"
      retro_board_path(@board.id)
    when "Poker::Board"
      "/poker/board/#{@board.id}"
    else
      raise "Unknown board class: #{board.class}"
    end
  end
  
end
