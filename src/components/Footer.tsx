import React from "react";

export default function Footer() {
  return (
    <footer>
      <div className="footer-content">
        <div className="footer-section">
          <h3>Ms V’s Body Pleasures</h3>
          <p>
            Transform your daily routine into an extraordinary experience with
            our artisan soaps and body-care essentials.
          </p>
        </div>

        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="#home">Home</a></li>
            <li><a href="#shop">Shop</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Customer Care</h3>
          <ul>
            <li><a href="#">FAQs</a></li>
            <li><a href="#">Shipping &amp; Returns</a></li>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms & Conditions</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Connect</h3>
          <ul>
            <li><a href="#">Instagram</a></li>
            <li><a href="#">Facebook</a></li>
            <li><a href="#">Twitter (X)</a></li>
            <li><a href="#">TikTok</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} Ms V’s Body Pleasures · All Rights Reserved.
      </div>
    </footer>
  );
}
