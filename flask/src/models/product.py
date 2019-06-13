from src.db import db

class ProductModel(db.Model):
    """
    New product
    """
    __tablename__ = 'product'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(150))
    description = db.Column(db.Text())
    product_type = db.Column(db.String(20))
    person = db.Column(db.String(10))
    price = db.Column(db.Float(precision=2))

    # One to many
    colors = db.relationship("ProductColorsModel", back_populates="product")

    def save_to_db(self):
        """
        Save product to db.
        :return:
        """
        db.session.add(self)
        db.session.commit()

    def delete_from_db(self):
        """
        Delete this product from the db.
        :return:
        """
        db.session.delete(self)
        db.session.commit()

    @classmethod
    def load_by(cls, **kwargs):
        products = cls.query.filter_by(**kwargs)
        results = []
        for product in products:
            results.append(product)

        return results

    @classmethod
    def load_by_id(cls, pid):
        return cls.query.get(pid)

    def json(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'product_type': self.product_type,
            'person': self.person,
            'price': self.price,
            'colors': [color.color for color in self.colors]
        }
