module ApplicationHelper
  def readable_date(date, timezone=nil)
    timezone ? date&.in_time_zone(timezone)&.strftime("%d %b %Y") : date&.strftime("%d %b %Y")
  end

  def readable_time(time, timezone=nil)
    timezone ? time&.in_time_zone(timezone)&.strftime("%I:%M%p") : time&.strftime("%I:%M%p")
  end

  def readable_datetime(datetime, timezone=nil)
    timezone ? datetime&.in_time_zone(timezone)&.strftime("%d %b %Y, %I:%M%p") : datetime&.strftime("%d %b %Y, %I:%M%p")
  end
  
end
