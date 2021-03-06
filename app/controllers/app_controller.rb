class AppController < ApplicationController
  include Mangler
  def main
    render :main, layout: false
  end

  def test
    @offers = Offer.all.map {|o| o.format }
    @sessions = Session.all.map {|s| s.json }
    render :test, layout: false
  end

  '''
    Shows the student facing view when the applicant is looking at the page.
    This uses a route of /pb/:mangled, so that the applicant can`t attack
    access the decision page of another student.
  '''
  def student_view
    offer_id = get_offer_id(params[:mangled])
    if offer_id
      show_decision_view(decrypt(params[:mangled], offer_id))
    else
      render status: 404, json: {message: "There is no such page."}
    end
  end

  private
  def show_decision_view(params)
    applicant = Applicant.find_by_utorid(params[:utorid])
    if applicant
      position = Position.find(params[:position_id]).json
      if position
        offer = Offer.find_by(applicant_id: applicant[:id], position_id: position[:id])
        if offer
          if offer[:send_date]
            @offer = offer.format.except(:id).merge({mangled: offer[:link]})
            render :decision, layout: false
          else
            render status: 404, json: {message: "Offer #{offer.json[:id]} hasn't been sent."}
          end
        else
          render status: 404, json: {message: "TAship for #{position[:position]} was not offered to #{applicant[:first_name]} #{applicant[:last_name]}."}
        end
      else
        render status: 404, json: {message: "No such position."}
      end
    else
      render status: 404, json: {message: "No such applicant."}
    end
  end

end
