class BlogPostsController < ApplicationController
  before_action :authenticate_user!, except: [:home, :article]
  before_action :authenticate_power_user!, except: [:home, :article]

  def index
    @posts = BlogPost.all.order(:status)
  end

  def show
  end

  def new
  end

  def create
  end

  def update
  end

  def destroy
  end

  def home
  end

  def article
  end
end
