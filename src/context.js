import React, { Component } from "react";
import { storeProducts, detailProduct } from "./data";
const ProductContext = React.createContext();

class ProductProvider extends Component {
  state = {
    products: [],
    detailProduct: detailProduct,
    cart: [],
    modalOpen: false,
    modalProduct: detailProduct,
    cartSubTotal: 0,
    cartTax: 0,
    cartTotal: 0
  };
  componentDidMount() {
    this.setProducts();
  }

  setProducts = () => {
    let products = [];
    //console.log('productsproducts', products);
    storeProducts.forEach(item => {
      const singleItem = { ...item };
      //console.log('singleItem', singleItem);
      products = [...products, singleItem];
     // console.log('products', products);
    });
    this.setState(() => {
      return { products };
    }, this.checkCartItems);
  };

  getItem = id => {
  //  console.log('id', id);
    const product = this.state.products.find(item => item.id === id);
  //  console.log('getItemfunction', product);
    return product;
  };
  handleDetail = id => {
    const product = this.getItem(id);
    this.setState(() => {
      return { detailProduct: product };
    });
  };
  addToCart = id => {
  //  console.log('idaddcartid', id);
    let tempProducts = [...this.state.products];
    //console.log('tempProducts', tempProducts);
    const index = tempProducts.indexOf(this.getItem(id));
   // console.log('index', index);
    const product = tempProducts[index];
  //  console.log('product', product);
    product.inCart = true;
    product.count = 1;
    const price = product.price;
    product.total = price;

    this.setState(() => {
      return {
        products: [...tempProducts],
        cart: [...this.state.cart, product],
        detailProduct: { ...product }
      };
     
    }, this.addTotals);
   // console.log('products', this.state.products);
   //  console.log('cartin addtocart', this.state.cart);
   // console.log('detailProduct', this.state.detailProduct);
  };
  openModal = id => {
    const product = this.getItem(id);
    this.setState(() => {
      return { modalProduct: product, modalOpen: true };
    });
  };
  closeModal = () => {
    this.setState(() => {
      return { modalOpen: false };
    });
  };
  increment = id => {
   // console.log('id', id);
    let tempCart = [...this.state.cart];
  //  console.log('tempCart', tempCart);
    const selectedProduct = tempCart.find(item => {
      return item.id === id;
    });
   // console.log('selectedProduct', selectedProduct);
    const index = tempCart.indexOf(selectedProduct);
   // console.log('index', index);
    const product = tempCart[index];
  //  console.log('product', product);
    product.count = product.count + 1;
  //  console.log('product.count', product.count);
    product.total = product.count * product.price;
  //  console.log('product.total', product.total);
    this.setState(() => {
      return {
        cart: [...tempCart]
      };
    }, this.addTotals);
   // console.log('cart', this.state.cart);
  };
  decrement = id => {
    let tempCart = [...this.state.cart];
    const selectedProduct = tempCart.find(item => {
      return item.id === id;
    });
    const index = tempCart.indexOf(selectedProduct);
    const product = tempCart[index];
    product.count = product.count - 1;
    if (product.count === 0) {
      this.removeItem(id);
    } else {
      product.total = product.count * product.price;
      this.setState(() => {
        return { cart: [...tempCart] };
      }, this.addTotals);
    }
  };
  getTotals = () => {
    // const subTotal = this.state.cart
    //   .map(item => item.total)
    //   .reduce((acc, curr) => {
    //     acc = acc + curr;
    //     return acc;
    //   }, 0);
    let subTotal = 0;
    this.state.cart.map(item => (subTotal += item.total));
    const tempTax = subTotal * 0.1;
    const tax = parseFloat(tempTax.toFixed(2));
    const total = subTotal + tax;
    return {
      subTotal,
      tax,
      total
    };
  };
  addTotals = () => {
   // console.log('addTotals', this.state.cart);
    const totals = this.getTotals();
    // console.log('totals', totals);
    this.setState(
      () => {
        return {
          cartSubTotal: totals.subTotal,
          cartTax: totals.tax,
          cartTotal: totals.total
        };
      },
      () => {
        // console.log(this.state);
      }
    );
  };
  removeItem = id => {
   // console.log('id', id);
    let tempProducts = [...this.state.products];
   // console.log('tempProducts', tempProducts);
    let tempCart = [...this.state.cart];
   // console.log('tempCart', tempCart);
    const index = tempProducts.indexOf(this.getItem(id));
   // console.log('index', index);
    let removedProduct = tempProducts[index];
   // console.log('removedProduct', removedProduct);
    removedProduct.inCart = false;
    removedProduct.count = 0;
    removedProduct.total = 0;

    tempCart = tempCart.filter(item => {    
      return item.id !== id;
    });
   // console.log('tempCartfilter', tempCart);

    this.setState(() => {
      return {
        cart: [...tempCart],
        products: [...tempProducts]
      };
    }, this.addTotals);
    //console.log('cartafter', this.state.cart);
    //console.log('productsafter', this.state.products);
  };
  clearCart = () => {
    this.setState(
      () => {
        return { cart: [] };
      },
      () => {
        this.setProducts();
        this.addTotals();
      }
    );
  };
  render() {
    return (
      <ProductContext.Provider
        value={{
          ...this.state,
          handleDetail: this.handleDetail,
          addToCart: this.addToCart,
          openModal: this.openModal,
          closeModal: this.closeModal,
          increment: this.increment,
          decrement: this.decrement,
          removeItem: this.removeItem,
          clearCart: this.clearCart
        }}
      >
        {this.props.children}
      </ProductContext.Provider>
    );
  }
}

const ProductConsumer = ProductContext.Consumer;

export { ProductProvider, ProductConsumer };
