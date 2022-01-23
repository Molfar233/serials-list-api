class DoramasController < ApplicationController
  before_action :find_dorama, only: [:create, :destroy]

  def index
    @doramas = if request.query_parameters[:st].present?
      Dorama.send("#{request.query_parameters[:st]}").where(user_id: @user.id)
    else
      Dorama.where(user_id: @user.id).group(:status).count
    end
    render json: @doramas
  end

  def create
    if request.query_parameters[:st].present?
      @dorama.send("#{request.query_parameters[:st]}!")
    end
    render json: @dorama
  end

  def status
    @dorama = Dorama.find_by(
      link: params[:link],
      name: params[:name],
      user_id: @user.id
    )
    render json: @dorama
  end

  def destroy
    @dorama.destroy
    render json: { message: 'ok' }
  end

  private
  def find_dorama
    @dorama = Dorama.find_or_create_by(
      link: params[:link],
      name: params[:name],
      user_id: @user.id
    )
  end
end
