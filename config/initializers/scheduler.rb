require 'rufus-scheduler'

s = Rufus::Scheduler.singleton

s.cron('0 7 * * *') do
  date = DateTime.now
  today = date.strftime("%A")
  if today != "Sunday" && today != "Saturday"
    yesterday = date.days_ago(1)
    num_offers = 0
    Offer.all.each do |offer|
      if offer[:accept_datetime]
        if offer[:accept_datetime]>=yesterday && offer[:status]=="Accepted"
          num_offers+=1
        end
      end
    end
    if num_offers> 0
      CpMailer.status_email(num_offers).deliver_now
    end
  end
end
