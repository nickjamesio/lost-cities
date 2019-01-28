from src import db


class ProductColorsModel(db.Model):
    """
    Colors for product
    """
    __tablename__ = 'product_colors'

    id = db.Column(db.Integer, primary_key=True)
    color = db.Column(db.String(20))

    # Many to one
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=False)
    product = db.relationship("ProductModel", back_populates="colors")

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

    def json(self):
        return {
            'color': self.color,
        }