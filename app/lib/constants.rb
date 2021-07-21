# Use to declare scoped constants
# e.g. Status = Constants.new :OPEN, :CLOSED
# Then you can refer to those constants in code:
#      >> Status.OPEN
#      => "open"
# And you can refer to the set of constant values for membership tests, e.g.
#      validate :status, inclusion: Status.values
class Constants < OpenStruct
  delegate :keys,
           :values,
           :value?,
           :each,
           to: :table

  def initialize(*constant_symbols)
    super(if constant_symbols.first.is_a? Hash
            constant_symbols.first
          else
            constant_symbols.map { |s| [s, s.to_s.downcase] }.to_h
          end)
    self.freeze
  end

  def from_s(s)
    table.keys.each { |k| return self.send(k) if k.to_s.casecmp(s) == 0 }
    nil
  end

  def from_v(value)
    table.each { |k,v| return k if v == value }
    nil
  end
end
