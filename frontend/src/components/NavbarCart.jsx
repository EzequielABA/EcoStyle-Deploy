import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext.jsx';

const NavbarCart = () => {
  const { getCartItemsCount } = useCart();
  const itemCount = getCartItemsCount();

  return (
    <Link to="/cart" className="cart-link">
      <span className="cart-icon">
        <i className="pi pi-shopping-cart" style={{ fontSize: '2rem', color: 'var(--primary)', transform: 'scaleX(-1)' }} />        
      </span>
      {itemCount > 0 && (
        <span className="cart-counter">{itemCount}</span>
      )}
    </Link>
  );
};

export default NavbarCart;