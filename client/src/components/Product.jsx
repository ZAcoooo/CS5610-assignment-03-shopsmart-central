import React from "react";
import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Product({ product, onAddToCart }) {
  return (
    <div className="col-md-3 col-sm-6 mb-2">
      <div className="card text-center">
        <Link to={`/details/${product.id}`}>
          <img src={product.imageUrl} alt={product.name} className="card-img-top img-fluid mx-auto" style={{ maxHeight: '200px', maxWidth: '200px' }} />
        </Link>
        <div className="card-body">
          <h5 className="card-title" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '200px' }}>
            <Link to={`/details/${product.id}`} className="text-decoration-none text-dark">
              {product.name}
            </Link>
          </h5>
          <p className="card-text">${product.price}</p>
          <button className="btn btn-outline-primary btn-sm" onClick={() => onAddToCart(product.id, 1)}>Add to Cart</button>
        </div>
      </div>
    </div>
  );
}