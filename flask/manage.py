import sys
from flask.cli import FlaskGroup

from src import create_app, db

app = create_app()
cli = FlaskGroup(create_app=create_app)

@cli.command('create_db')
def create_db():
    db.drop_all()
    db.create_all()
    db.session.commit()

# @cli.command()
# def test():
#     """Runs the tests without code coverage"""
#     tests = unittest.TestLoader().discover('project/tests', pattern='test*.py')
#     result = unittest.TextTestRunner(verbosity=2).run(tests)
#     if result.wasSuccessful():
#         return 0
#     sys.exit(result)


# @cli.command('seed_db')
# def seed_db():
#     """Seeds the database."""
#     db.session.add(User(username='nick', email="nickjames@gmail.com"))
#     db.session.add(User(username='nick_james', email="nick@james.org"))
#     db.session.commit()


if __name__ == '__main__':
    cli()
