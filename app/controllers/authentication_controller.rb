class AuthenticationController < ApplicationController
  skip_before_action :authenticate, only: :login

  def login
    @user = User.find_by(nickname: params[:nickname])
    permitted = params.permit(:nickname, :password)
    if @user
      unless @user.authenticate(params[:password])
        return render json: { message: "Authenticated failed" }
      end
    else
      @user = User.create(permitted)
    end
    payload = { user_id: @user.id }
    @user.update(token: create_token(payload))
    render json: { token: @user.token }
  end
end
