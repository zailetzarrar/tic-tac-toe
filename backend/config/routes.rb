Rails.application.routes.draw do
  get 'api/getHistory', to: 'application#getHistory'
  post 'api/createHistory', to: 'application#createHistory'
end
