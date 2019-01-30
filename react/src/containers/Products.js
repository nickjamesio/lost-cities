import React, { Component } from 'react';
import { withRouteData } from 'react-static';

class Products extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: []
    }
  }

  componentDidMount() {
    fetch('http://api.localhost/products')
      .then(response => response.json())
      .then(({data}) => this.setState({products: data}))
      .catch(error => console.error(error));
  }

  render() {
    const { data } = this.props;
    const { products } = this.state;

    return (
      <div>
        <h1>Products</h1>
        <table>
          <thead>
            <tr>
              <th>title</th>
              <th>product</th>
              <th>person</th>
              <th>price</th>
              <th>description</th>
            </tr>
          </thead>
          <tbody>
              {products.map(product => (
                <tr key={product.id}>
                  <td>{product.title}</td>
                  <td>{product.product_type}</td>
                  <td>{product.person}</td>
                  <td>{product.price}</td>
                  <td>{product.description}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default withRouteData(Products);
