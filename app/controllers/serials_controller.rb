class SerialsController < ApplicationController
  def index
    @serials = if request.query_parameters[:st].present?
      Serial.send("#{request.query_parameters[:st]}").where(user_id: @user.id)
    else
      Serial.where(user_id: @user.id).group(:status).count
    end
    render json: @serials
  end

  def create
    @serial = Serial.find_or_create_by(
      link: params[:link],
      name: params[:name],
      user_id: @user.id
    )
    if request.query_parameters[:st].present?
      @serial.send("#{request.query_parameters[:st]}!")
    end
    render json: @serial
  end

  def status
    query = "(? LIKE CONCAT('%', name, '%') OR name = ? OR name LIKE ?) AND link = ? AND user_id = ?"
    @serial = Serial.where(query, params[:name], params[:name], "%#{params[:name]}%", params[:link], @user.id).first
    render json: @serial
  end

  def destroy
    @serial = Serial.find(params[:id])
    @serial.destroy
    render json: { message: 'ok' }
  end
end
