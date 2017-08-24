Rails.application.routes.draw do
  # for user facing side of CP
  get '/cp/(*z)', to: "app#index"

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  resources :applicants
  resources :offers do
    post "decision/:status" => "offers#set_status"
    get "pdf" => "offers#get_contract"
  end
  resources :sessions

  post "offers/send-contracts" => "offers#send_contracts"
  post "offers/print" => "offers#combine_contracts_print"
  post "offers/nag" => "offers#batch_email_nags"
  post "import/offers" => "import#import_offers"
  post "import/locked-assignments" => "import#import_locked_assignments"

  #temp-testing views
  get "test" => "app#test"

  '''
    The following routes are mangled urls, so that attacker can`t mess with the
    status of another student.
  '''
  get "pb/:mangled" => "app#student_view"
  get "pb/:mangled/pdf" => "offers#get_contract_mangled"
  post "pb/:mangled/:status" => "offers#set_status_mangled"
end
