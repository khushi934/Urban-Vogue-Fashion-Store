import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="fk-footer">
      <div className="fk-footer-container">
        <div>
          <h4>About Urban Vogue</h4>
          <ul>
            <li><Link to="/contact">Contact Us</Link></li>
            <li><Link to="/">Our Story</Link></li>
            <li><Link to="/">Sustainability</Link></li>
            <li><Link to="/">Careers</Link></li>
            <li><Link to="/">Press & Media</Link></li>
            <li><Link to="/">Store Locator</Link></li>
            <li><Link to="/">Corporate Information</Link></li>
          </ul>
        </div>
        <div>
          <h4>Collections</h4>
          <ul>
            <li><Link to="/store?collection=Men">Men's Premium</Link></li>
            <li><Link to="/store?collection=Women">Women's Exclusive</Link></li>
            <li><Link to="/store?collection=Kids">Kids' Apparel</Link></li>
            <li><Link to="/store?collection=New Arrivals">New Arrivals</Link></li>
            <li><Link to="/store?collection=Sale">Clearance Sale</Link></li>
          </ul>
        </div>
        <div>
          <h4>Customer Care</h4>
          <ul>
            <li><Link to="/track-order">Track Order</Link></li>
            <li><Link to="/">Shipping Information</Link></li>
            <li><Link to="/">Returns & Exchanges</Link></li>
            <li><Link to="/">Size Guide</Link></li>
            <li><Link to="/">FAQs</Link></li>
          </ul>
        </div>
        <div>
          <h4>Legal & Policies</h4>
          <ul>
            <li><Link to="/">Terms of Service</Link></li>
            <li><Link to="/">Privacy Policy</Link></li>
            <li><Link to="/">Cookie Policy</Link></li>
            <li><Link to="/">Security</Link></li>
            <li><Link to="/">Accessibility</Link></li>
          </ul>
        </div>
      </div>
      <div className="fk-footer-bottom">
        <span><i className="fa-solid fa-gem"></i> Premium Quality Guarantee</span>
        <span><i className="fa-solid fa-leaf"></i> Sustainable Fashion</span>
        <span><i className="fa-solid fa-circle-question"></i> Help Center</span>
        <span>&copy; 2024-2026 UrbanVogue.com</span>
        {/* Replaced flixcart payment image with a generic text fallback or custom image if available, here just standard icons */}
        <div style={{ display: 'flex', gap: '10px', fontSize: '20px' }}>
          <i className="fa-brands fa-cc-visa"></i>
          <i className="fa-brands fa-cc-mastercard"></i>
          <i className="fa-brands fa-cc-amex"></i>
          <i className="fa-brands fa-cc-paypal"></i>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
