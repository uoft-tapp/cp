require 'net/http'
class Applicant < ActiveResource::Base
  include Model
  self.site = "http://#{ENV['TAPP']}:3000/"

  def self.find_by_utorid(utorid)
    Applicant.all.each do |applicant|
      applicant = applicant.json
      if applicant[:utorid]==utorid
        return applicant
      end
    end
    return nil
  end
end
