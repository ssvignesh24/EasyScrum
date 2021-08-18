full_details ||= false

json.id user.id
json.name user.name
json.email user.email
json.avatarUrl user.avatar_url
json.addedOn readable_datetime(user.created_at)
json.pendingInvitation user.verified_at.nil?
json.invitationSentAt readable_datetime(user.verification_email_sent_at)