import React from 'react'
import "../../styles/product.css"
import { addProductToCart } from '../../reducers/product'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'

const Cart = ({ product }) => {
    // console.log(product);

    const dispatch = useDispatch()
    const handleAddProductToCart = (productItem) => {
        dispatch(addProductToCart(productItem))
    }

    return (
        <div className="cart_container">
            <div className="cart_container-img">
                {/* <img src={product.image} className='cart_img' alt={product.title} /> */}
                <Link to={`/san-pham/${product.id}`}><img src={product.image} className='cart_img' alt={product.title} /></Link>
            </div>
            <div className='cart_content'>
                <h3 className='cart_title'>{product.title}</h3>
                <h4 className='cart_price'>$ {product.price}</h4>
                <h5 className='cart_name-cate'>{product.category}</h5>
                <h5>Rating: {product.rating.rate} ✰</h5>
            </div>
            <div className='cart_container-button'>
                {/* <a href={`/san-pham/${product.id}`}>Xem</a> */}
                <button onClick={() => handleAddProductToCart(product)}>Thêm vào giỏ hàng</button>
            </div>
        </div>
    )
}

export default Cart