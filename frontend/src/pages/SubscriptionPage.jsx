import { useState, useEffect, useContext } from 'react';
import { api } from '../lib/api';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function SubscriptionPage() {
  const { user, updateUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Load Razorpay script dynamically
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleUpgrade = async () => {
    if (user?.isPremium) return;

    setLoading(true);
    setError('');

    try {
      // 1. Create order on backend
      const order = await api.payment.createOrder();

      // 2. Open Razorpay Checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_StWKfeiQHsQrRB',
        amount: order.amount,
        currency: order.currency,
        name: 'DevCard Premium',
        description: 'Upgrade to Pro for Custom Domains & SEO',
        order_id: order.id,
        handler: async function (response) {
          try {
            // 3. Verify Payment
            const verifyRes = await api.payment.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });

            if (verifyRes.success) {
              updateUser({ isPremium: true, premiumPlan: 'premium' });
              alert('Successfully upgraded to Pro!');
            }
          } catch (err) {
            setError(err.message || 'Payment verification failed');
          }
        },
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
        },
        theme: {
          color: '#6C63FF'
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        setError(response.error.description);
      });
      rzp.open();

    } catch (err) {
      setError(err.message || 'Failed to initiate checkout');
    } finally {
      setLoading(false);
    }
  };

  const handleContactSales = () => {
    alert('Our sales team will reach out to you soon! For immediate assistance, email us at sales@devcard.ai');
  };

  const isPro = user?.isPremium;

  return (
    <section style={{ padding: '4rem 2rem' }}>
      <div className="centered">
        <div className="section-label">💎 Pricing</div>
      </div>
      <h2 className="section-title">Choose Your Plan</h2>
      <p className="section-sub">Start free. Upgrade when your profile starts working for you.</p>

      {error && (
        <div style={{
          maxWidth: '950px', margin: '0 auto 1.5rem',
          background: 'rgba(255,107,107,0.15)', color: '#FF6B6B',
          padding: '1rem', borderRadius: '.75rem', textAlign: 'center', fontWeight: 600
        }}>
          {error}
        </div>
      )}

      {isPro && (
        <div style={{
          maxWidth: '950px', margin: '0 auto 2rem',
          background: 'linear-gradient(135deg, rgba(108,99,255,0.2), rgba(0,212,255,0.1))',
          border: '1px solid var(--border)',
          padding: '1.25rem', borderRadius: '1rem',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: '1rem'
        }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '.25rem' }}>You are on the Pro Plan ✨</h3>
            <p style={{ color: 'var(--muted)', fontSize: '.85rem' }}>Enjoy all premium features without limits.</p>
          </div>
          <span style={{
            background: 'var(--purple)', color: '#fff',
            padding: '.3rem 1rem', borderRadius: '2rem',
            fontSize: '.8rem', fontWeight: 600
          }}>Active</span>
        </div>
      )}

      <div className="pricing-grid">
        {/* FREE PLAN */}
        <div className="price-card">
          <div className="plan-name">Free</div>
          <div className="plan-price">₹0<span>/mo</span></div>
          <div className="plan-desc">Get started with your developer identity. No credit card required.</div>
          <ul className="plan-features">
            <li className="active"><span className="check">✓</span> Basic Profile Page</li>
            <li className="active"><span className="check">✓</span> GitHub Integration</li>
            <li className="active"><span className="check">✓</span> Resume Upload & Display</li>
            <li className="active"><span className="check">✓</span> QR Code Generation</li>
            <li className="active"><span className="check">✓</span> 1 Project Showcase</li>
            <li><span style={{ opacity: .4 }}>✗</span> <span style={{ opacity: .4 }}>AI Features</span></li>
            <li><span style={{ opacity: .4 }}>✗</span> <span style={{ opacity: .4 }}>Analytics Dashboard</span></li>
            <li><span style={{ opacity: .4 }}>✗</span> <span style={{ opacity: .4 }}>Custom Domain</span></li>
          </ul>
          <button
            className="btn-outline"
            style={{ width: '100%', borderRadius: '.75rem', padding: '.75rem' }}
            onClick={() => navigate('/dashboard/profile')}
          >
            Get Started Free
          </button>
        </div>

        {/* PRO PLAN */}
        <div className="price-card popular">
          <div className="popular-badge">⭐ Most Popular</div>
          <div className="plan-name">Pro</div>
          <div className="plan-price">₹499<span>/mo</span></div>
          <div className="plan-desc">For developers serious about their personal brand and career growth.</div>
          <ul className="plan-features">
            <li className="active"><span className="check">✓</span> Everything in Free</li>
            <li className="active"><span className="check">✓</span> AI Bio Generator</li>
            <li className="active"><span className="check">✓</span> AI Portfolio Review</li>
            <li className="active"><span className="check">✓</span> Premium Themes</li>
            <li className="active"><span className="check">✓</span> Full Analytics Dashboard</li>
            <li className="active"><span className="check">✓</span> SEO Tools</li>
            <li className="active"><span className="check">✓</span> Lead Management</li>
            <li className="active"><span className="check">✓</span> Unlimited Projects</li>
          </ul>
          {isPro ? (
            <button
              className="btn-primary"
              style={{ width: '100%', borderRadius: '.75rem', padding: '.75rem', opacity: .7 }}
              disabled
            >
              Active Plan ✅
            </button>
          ) : (
            <button
              className="btn-primary"
              style={{ width: '100%', borderRadius: '.75rem', padding: '.75rem' }}
              onClick={handleUpgrade}
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Go Pro 🚀'}
            </button>
          )}
        </div>

        {/* BUSINESS PLAN */}
        <div className="price-card">
          <div className="plan-name">Business</div>
          <div className="plan-price">₹999<span>/mo</span></div>
          <div className="plan-desc">For agencies and tech teams managing multiple developer profiles.</div>
          <ul className="plan-features">
            <li className="active"><span className="check">✓</span> Everything in Pro</li>
            <li className="active"><span className="check">✓</span> Team Profiles (up to 10)</li>
            <li className="active"><span className="check">✓</span> Custom Domain</li>
            <li className="active"><span className="check">✓</span> Advanced Analytics</li>
            <li className="active"><span className="check">✓</span> Priority Support</li>
            <li className="active"><span className="check">✓</span> Custom Branding</li>
            <li className="active"><span className="check">✓</span> API Access</li>
            <li className="active"><span className="check">✓</span> White-label Option</li>
          </ul>
          <button
            className="btn-outline"
            style={{ width: '100%', borderRadius: '.75rem', padding: '.75rem' }}
            onClick={handleContactSales}
          >
            Contact Sales
          </button>
        </div>
      </div>

      <p style={{ textAlign: 'center', color: 'var(--muted)', fontSize: '.85rem', marginTop: '2rem' }}>
        All plans include SSL, 99.9% uptime SLA, and 14-day money-back guarantee 🛡️
      </p>
    </section>
  );
}
