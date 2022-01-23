class ApplicationController < ActionController::API

  before_action :authenticate

  def authenticate
    if auth_header
      begin
        decode_token = JWT.decode(token, secret)
        payload = decode_token.first
        user_id = payload['user_id']
        @user = User.find(user_id)
      rescue => ex
        render json: { message: "Error: #{ex}" }, status: :forbidden
      end
    else
      render json: { message: 'No Authorization header send' }, status: :forbidden
    end
  end

  def auth_header
    request.headers['Authorization']
  end

  def token
    auth_header.split("=")[1]
  end

  def secret
    ENV['SECRET_KEY_BASE'] || Rails.application.secrets.secret_key_base
  end

  def create_token(payload)
    JWT.encode(payload, secret)
  end
end
