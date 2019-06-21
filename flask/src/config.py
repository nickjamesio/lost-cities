import os
from datetime import timedelta
basedir = os.path.abspath(os.path.dirname(__file__))


class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'my butthole'
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'sqlite:///' + os.path.join(basedir, 'data.db')
    # postgresql 'postgresql://chess@localhost/chess'
    SQLALCHEMY_ECHO = True
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SESSION_TYPE = 'sqlalchemy'
    # JWT_COOKIE_DOMAIN = 'nickjames.local'
    JWT_TOKEN_LOCATION = 'cookies'
    # JWT_ACCESS_COOKIE_PATH = '/'
    # JWT_REFRESH_COOKIE_PATH = '/'

    # TODO change this in future
    # https://flask-jwt-extended.readthedocs.io/en/latest/tokens_in_cookies.html
    JWT_COOKIE_CSRF_PROTECT = False
    #TODO use refresh token correct way and lower expire time
    JWT_ACCESS_TOKEN_EXPIRES = 3 # set for 2 hours