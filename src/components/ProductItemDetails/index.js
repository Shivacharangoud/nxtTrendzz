import {Component} from 'react'

import {Link} from 'react-router-dom'

import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'

import Cookies from 'js-cookie'

import Loader from 'react-loader-spinner'

import SimilarProductItem from '../SimilarProductItem'

import Header from '../Header'
import './index.css'

class ProductItemDetails extends Component {
  state = {status: 'LOADING', data: {}, noOfItems: 1}

  componentDidMount() {
    this.getProductDetail()
  }

  getProductDetail = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params
    const token = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/products/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: 'GET',
    }
    const responsee = await fetch(apiUrl, options)
    if (responsee.ok === true) {
      const data = await responsee.json()
      const formattedData = {
        availability: data.availability,
        brand: data.brand,
        description: data.description,
        id: data.id,
        imageUrl: data.image_url,
        price: data.price,
        rating: data.rating,
        similarProducts: data.similar_products,
        title: data.title,
        totalReviews: data.total_reviews,
      }
      this.setState({data: formattedData, status: 'SUCCESS'})
    } else {
      this.setState({status: 'FAILURE'})
    }
  }

  renderLoadingView = () => (
    <div testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  onMinus = () => {
    const {noOfItems} = this.state
    if (noOfItems > 1) {
      this.setState(prevState => ({noOfItems: prevState.noOfItems - 1}))
    }
  }

  onPlus = () => {
    this.setState(prevState => ({noOfItems: prevState.noOfItems + 1}))
  }

  renderProductDetailView = () => {
    const {data, noOfItems} = this.state
    const {
      availability,
      brand,
      description,
      id,
      imageUrl,
      price,
      rating,
      similarProducts,
      title,
      totalReviews,
    } = data

    return (
      <>
        <div className="product-detail-main-container">
          <img alt="product" src={imageUrl} className="detailed-image" />
          <div className="product-detail-matter">
            <h1 className="detailed-title">{title}</h1>
            <p>Rs {price}/-</p>
            <div className="rating-review-container">
              <div className="small-star-container">
                <p>{rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                  className="small-star-image"
                />
              </div>
              <p>{totalReviews} Reviews</p>
            </div>
            <p className="detailed-description">{description}</p>
            <p>Available: {availability}</p>
            <p>Brand: {brand}</p>
            <hr />
            <div className="plus-and-minus-container">
              <button
                testid="minus"
                onClick={this.onMinus}
                className="plus-or-minus-button"
                type="button"
              >
                <BsDashSquare className="plus-minus-icon" />
              </button>

              <p>{noOfItems}</p>
              <button
                testid="plus"
                className="plus-or-minus-button"
                onClick={this.onPlus}
                type="button"
              >
                <BsPlusSquare className="plus-minus-icon" />
              </button>
            </div>
            <button type="button" className="add-to-cart-button">
              ADD TO CART
            </button>
          </div>
        </div>
        <div className="similar-products-container">
          <h1>Similar Products</h1>
          <ul className="unorder-list-similar-products">
            {similarProducts.map(each => (
              <SimilarProductItem detail={each} key={each.id} />
            ))}
          </ul>
        </div>
      </>
    )
  }

  renderFailureView = () => (
    <div className="failure-containerr">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
        className="failure-image"
      />
      <h1>Product Not Found</h1>
      <Link to="/products">
        <button type="button" className="continue-button">
          Continue Shopping
        </button>
      </Link>
    </div>
  )

  whatTorender = () => {
    const {status} = this.state
    switch (status) {
      case 'LOADING':
        return this.renderLoadingView()
      case 'SUCCESS':
        return this.renderProductDetailView()
      case 'FAILURE':
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="main-container">{this.whatTorender()}</div>
      </>
    )
  }
}

export default ProductItemDetails
