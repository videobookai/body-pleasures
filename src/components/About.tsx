import React from "react";

export default function About() {
  return (
    <section id="about">
      <div className="section-header">
        <h2>About Us</h2>
        <p>
          At Ms V’s Body Pleasures, we believe in turning everyday routines into
          indulgent rituals. Our artisan products are crafted with love,
          passion, and the finest natural ingredients.
        </p>
      </div>

      <div className="about-content">
        <div className="about-image">🧴</div>
        <div className="about-text">
          <h3>Our Story</h3>
          <p>
            From humble beginnings, we set out to create body-care experiences
            that honor self-care and sensuality. Every fragrance, every texture,
            and every touch tells a story — your story.
          </p>
          <p>
            We source our ingredients ethically and create blends that uplift,
            soothe, and inspire confidence in your own skin.
          </p>
        </div>
      </div>

      <div className="values">
        <div className="value-card">
          <div className="value-icon">🌿</div>
          <h4>Natural Ingredients</h4>
          <p>
            Each product is crafted with plant-based, skin-loving ingredients
            designed to rejuvenate and protect your body.
          </p>
        </div>

        <div className="value-card">
          <div className="value-icon">💛</div>
          <h4>Handmade with Love</h4>
          <p>
            Every bar of soap, lotion, and balm is made in small batches to
            ensure exceptional quality and care.
          </p>
        </div>

        <div className="value-card">
          <div className="value-icon">🌸</div>
          <h4>Sustainable Beauty</h4>
          <p>
            We care for you and the planet — our packaging and practices are
            eco-friendly and cruelty-free.
          </p>
        </div>
      </div>
    </section>
  );
}
