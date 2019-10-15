import os
from datetime import timedelta
basedir = os.path.abspath(os.path.dirname(__file__))


class BaseConfig:
    """Base configuration"""
    TESTING = False
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'spongebob'
    SESSION_TYPE = 'sqlalchemy'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    PROPAGATE_EXCEPTIONS = True
    DEBUG_TB_ENABLED = False
    DEBUG_TB_INTERCEPT_REDIRECTS = False
    JWT_TOKEN_LOCATION = 'cookies'


class DevelopmentConfig(BaseConfig):
    """Development configuration"""
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'sqlite:///' + os.path.join(basedir, 'data.db')
    DEBUG_TB_ENABLED = True
    JWT_ACCESS_COOKIE_PATH = '/'
    JWT_REFRESH_COOKIE_PATH = '/'
    JWT_COOKIE_DOMAIN=".lostcities.local"
    CORS_ORIGINS=["http://lostcities.local:3000", "http://lostcities.local"]
    CORS_SUPPORTS_CREDENTIALS=True
    # TODO change this in future
    # https://flask-jwt-extended.readthedocs.io/en/latest/tokens_in_cookies.html
    JWT_COOKIE_CSRF_PROTECT = False
    #TODO make token expire after time elapses
    JWT_ACCESS_TOKEN_EXPIRES = False


class TestingConfig(BaseConfig):
    """Testing configuration"""
    TESTING = True
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'sqlite:///' + os.path.join(basedir, 'data.db')


class ProductionConfig(BaseConfig):
    """Production configuration"""
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL')
    JWT_ACCESS_COOKIE_PATH = '/'
    JWT_REFRESH_COOKIE_PATH = '/'
    SESSION_COOKIE_DOMAIN=".lostcities.nickjames.io"
    JWT_COOKIE_DOMAIN=".lostcities.nickjames.io"
    CORS_ORIGINS=["http://lostcities.nickjames.io"]
    # SESSION_COOKIE_DOMAIN=".nickjames.io"
    # JWT_COOKIE_DOMAIN=".nickjames.io"
    # CORS_ORIGINS=["http://lostcities.nickjames.io", "http://lostcities.local:3000"]
    CORS_SUPPORTS_CREDENTIALS=True
    # TODO change this in future
    # https://flask-jwt-extended.readthedocs.io/en/latest/tokens_in_cookies.html
    JWT_COOKIE_CSRF_PROTECT = False
    #TODO make token expire after time elapses
    JWT_ACCESS_TOKEN_EXPIRES = False