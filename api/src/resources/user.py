from flask import jsonify
from flask_restful import Resource, reqparse
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    jwt_refresh_token_required,
    get_jwt_identity,
    set_access_cookies,
    set_refresh_cookies,
    unset_jwt_cookies,
    jwt_required,
    current_user
)

from src.models.user import UserModel
from src import api


class UserRegister(Resource):
    user_parser = reqparse.RequestParser()
    user_parser.add_argument('username',
                            type=str,
                            required=True,
                            help="This field cannot be blank."
                            )
    user_parser.add_argument('email',
                            type=str,
                            required=True,
                            help="This field cannot be blank."
                            )
    user_parser.add_argument('password',
                            type=str,
                            required=True,
                            help="This field cannot be blank."
                            )
    def post(self):
        data = self.user_parser.parse_args()

        if UserModel.find_by_username(data['email']):
            return {"message": "Email already in use"}, 400

        if UserModel.find_by_email(data['username']):
            return {"message": "Username taken"}, 400

        user = UserModel(**data)
        user.save_to_db()

        return {"message": "User created successfully."}, 201


class CurrentUser(Resource):
    @jwt_required
    def get(self):
        return current_user.json()


class User(Resource):
    @classmethod
    def get(cls, uid):
        user = UserModel.find_by_id(uid)
        if not user:
            return {'message': 'User not found'}, 404
        return user.json()

    @classmethod
    def delete(cls, uid):
        user = UserModel.find_by_id(uid)
        if not user:
            return {'message': 'User not found'}, 404

        user.delete_from_db()
        return {'message': 'User deleted'}, 200


class UserList(Resource):
    @classmethod
    def get(cls):
        return {'data': [user.json() for user in UserModel.find_all()]}


class UserLogin(Resource):
    user_parser = reqparse.RequestParser()
    user_parser.add_argument('username',
                            type=str,
                            required=True,
                            help="This field cannot be blank."
                            )
    user_parser.add_argument('password',
                            type=str,
                            required=True,
                            help="This field cannot be blank."
                            )
    @classmethod
    def post(self):
        data = self.user_parser.parse_args()

        user = UserModel.find_by_username(data['username'])
        if not user:
            user = UserModel.find_by_email(data['username'])

        if user and user.is_correct_password(data['password']):
            access_token = create_access_token(identity=user.id, fresh=True)
            refresh_token = create_refresh_token(user.id)
            
            # Set the JWT cookies in the response
            resp = jsonify({'user': user.json()})
            set_access_cookies(resp, access_token)
            set_refresh_cookies(resp, refresh_token)

            return resp, 200

        return {'message': 'Invalid credentials'}, 401


class UserLogout(Resource):
    @jwt_required
    def get(self):
        resp = jsonify({'logout': True})
        unset_jwt_cookies(resp)
        return resp, 200

class TokenRefresh(Resource):
    @jwt_refresh_token_required
    def post(self):
        current_user = get_jwt_identity()
        new_token = create_access_token(identity=current_user, fresh=False)
        resp = jsonify({'refreshed': True})
        set_access_cookies(resp, new_token)
        
        return resp, 200


# Register routes
api.add_resource(UserRegister, '/register')
api.add_resource(User, '/user/<int:uid>')
api.add_resource(UserList, '/users')
api.add_resource(UserLogin, '/login')
api.add_resource(UserLogout, '/logout')
api.add_resource(CurrentUser, '/me')
api.add_resource(TokenRefresh, '/refresh')