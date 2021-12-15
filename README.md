<!-- @format -->

# Easy Scrum

EasyScrum is a simple tool for managing your team's retrospectives, planning pokers, and daily check-ins.

**Technologies used**

1.  Ruby on rails
2.  React JS
3.  Postgres
4.  Redis

## Retrospective

**Functionalities**

- Retro board templates
- Custom retro columns
- Real-time board using Action Cable
- Invite guests to board using invite link
- Ability to add comments to card
- Ability to vote
- Action items
- See previous retro's action items and ability to mark items as complete

## Planning poker

**Functionalities**

- Realtime voting using Action Cable
- Pre-defined vote template (Fibonacci series, Number 1-10, T-Shirt size)
- Custom votes
- Vote summary after voting completion - Avg. vote, highest vote, lowest vote
- Invite guests to the board using an invite link
- Add your issues with link to the board
- Ghost issue - Play planning poker on a virtual issue without adding your issues

## Check-ins (for daily stand-ups)

**Functionalities**

- Custom questions
- Schedule the week-day and the time of the check-in
- Send check-in emails based on user timezone
- Custom answer types (Text, date, time, select, checkbox, etc)
- Check report for selected users
- Checkin response history
