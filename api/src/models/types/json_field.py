from sqlalchemy.types import TypeDecorator, VARCHAR
import json

class JSONEncoded(TypeDecorator):
    """Represents an immutable structure as a json-encoded string.

    Usage::

        JSONEncoded(255)

    """

    impl = VARCHAR

    def process_bind_param(self, value, dialect):
        if value is not None:
            value = json.dumps(value, separators=(',', ':'))

        return value

    def process_result_value(self, value, dialect):
        if value is not None:
            value = json.loads(value)
        return value