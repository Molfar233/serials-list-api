class DoramasController < ApplicationController
  before_action :find_dorama, only: [:create, :viewed]

  def create
    render json: @dorama
  end

  def viewed
    @dorama.viewed!
    render json: @dorama
  end

  private
  def find_dorama
    @dorama = Dorama.find_or_create_by(
      link: params[:link],
      status: params[:status],
      user_id: @user.id
    )
  end
end
