class PasswordValidator

  def self.validate(password)
    if !password.present?
      return "Password is empty"
    end

    if is_too_short?(password)
      return "Password is too short"
    elsif is_too_long?(password)
      return "Password is too long"
    end

    unless missing_regular_requirements?(password)
      return "At least one number and one capital letter should be present"
    end

    if has_sequences?(password.downcase) || has_sequences?(password.downcase.reverse)
      return "Password has sequences"
    end

    if has_repeats?(password)
      return  [I18n.t(:passwords_repeated)]
    end

    nil
  end


  def self.is_too_long?(password)
    password.length > Devise.password_length.end
  end

  def self.is_too_short?(password)
    password.length < Devise.password_length.begin
  end

  def self.missing_regular_requirements?(password)
    password =~ /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/
  end

  def self.has_sequences? password
    last_char = -10
    seq_count = 0
    password.each_char do |chr|
      ascii_val = chr.ord
      ascii_val + 1 == last_char ? seq_count += 1 : seq_count = 0
      if seq_count == 2
        return true
      else
        last_char = ascii_val
      end
    end
    return false
  end

  def self.has_repeats? password
    last_char = -10
    rep_count = 0
    password.each_char do |chr|
      ascii_val = chr.ord
      ascii_val == last_char ? rep_count += 1 : rep_count = 0
      if rep_count == 2
        return true
      else
        last_char = ascii_val
      end
    end
    return false
  end

  # extracted from Devise::Recoverable.rb to avoid the save that happens on checking the token
  def self.errors_from_devise(raw_reset_password_token)
    reset_password_token = Devise.token_generator.digest(self, :reset_password_token, raw_reset_password_token)
    recoverable = User.find_or_initialize_with_error_by(:reset_password_token, reset_password_token)
    if recoverable.persisted?
      unless recoverable.reset_password_period_valid?
        recoverable.errors.add(:reset_password_token, :expired)
      end
    end
    recoverable.errors.full_messages
  end

  private_class_method :has_sequences?, :errors_from_devise, :has_repeats?
end
