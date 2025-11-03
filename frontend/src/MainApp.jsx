import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import CreditScoreApp from './CreditScoreApp';
import './MainApp.css';

/**
 * Main Application Hub
 * Central entry point for all features and information
 */
const MainApp = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [account, setAccount] = useState('');
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [networkStatus, setNetworkStatus] = useState('disconnected');
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Initialize Web3 on component mount
  useEffect(() => {
    checkWalletConnection();
  }, []);

  // Check if wallet is connected
  const checkWalletConnection = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({
          method: 'eth_accounts',
        });
        if (accounts.length > 0) {
          setupWeb3(accounts[0]);
        }
      }
    } catch (error) {
      console.error('Error checking wallet:', error);
    }
  };

  // Setup Web3 connection
  const setupWeb3 = async (accountAddress) => {
    try {
      const ethProvider = new ethers.providers.Web3Provider(window.ethereum);
      const ethSigner = ethProvider.getSigner();
      setProvider(ethProvider);
      setSigner(ethSigner);
      setAccount(accountAddress);
      setNetworkStatus('connected');
    } catch (error) {
      console.error('Error setting up Web3:', error);
      setNetworkStatus('error');
    }
  };

  // Connect wallet
  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert('Please install MetaMask');
        return;
      }
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      setupWeb3(accounts[0]);
    } catch (error) {
      console.error('Error connecting wallet:', error);
      setNetworkStatus('error');
    }
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    setAccount('');
    setProvider(null);
    setSigner(null);
    setNetworkStatus('disconnected');
    setCurrentPage('home');
  };

  // Render current page
  const renderPage = () => {
    switch (currentPage) {
      case 'app':
        return account ? (
          <CreditScoreApp />
        ) : (
          <div className="connect-prompt">
            <h2>Connect Your Wallet</h2>
            <p>You need to connect your wallet to use the credit score assessment.</p>
            <button onClick={connectWallet} className="btn btn-primary">
              Connect Wallet
            </button>
          </div>
        );
      case 'about':
        return <AboutPage />;
      case 'docs':
        return <DocumentationPage />;
      case 'faq':
        return <FAQPage />;
      case 'guide':
        return <GuidePage />;
      default:
        return <HomePage onStartClick={() => setCurrentPage('app')} />;
    }
  };

  return (
    <div className="main-app">
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          {/* Logo */}
          <div className="nav-logo" onClick={() => { setCurrentPage('home'); setShowMobileMenu(false); }}>
            <span className="logo-icon">🔐</span>
            <span className="logo-text">Private Credit Score</span>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="mobile-menu-toggle"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            ☰
          </button>

          {/* Navigation Links */}
          <ul className={`nav-menu ${showMobileMenu ? 'active' : ''}`}>
            <li>
              <button
                className={`nav-link ${currentPage === 'home' ? 'active' : ''}`}
                onClick={() => { setCurrentPage('home'); setShowMobileMenu(false); }}
              >
                🏠 Home
              </button>
            </li>
            <li>
              <button
                className={`nav-link ${currentPage === 'app' ? 'active' : ''}`}
                onClick={() => { setCurrentPage('app'); setShowMobileMenu(false); }}
              >
                📊 Credit Score
              </button>
            </li>
            <li>
              <button
                className={`nav-link ${currentPage === 'guide' ? 'active' : ''}`}
                onClick={() => { setCurrentPage('guide'); setShowMobileMenu(false); }}
              >
                📖 How It Works
              </button>
            </li>
            <li>
              <button
                className={`nav-link ${currentPage === 'faq' ? 'active' : ''}`}
                onClick={() => { setCurrentPage('faq'); setShowMobileMenu(false); }}
              >
                ❓ FAQ
              </button>
            </li>
            <li>
              <button
                className={`nav-link ${currentPage === 'docs' ? 'active' : ''}`}
                onClick={() => { setCurrentPage('docs'); setShowMobileMenu(false); }}
              >
                📚 Docs
              </button>
            </li>
          </ul>

          {/* Wallet Connection */}
          <div className="nav-wallet">
            {account ? (
              <div className="wallet-connected">
                <div className="network-status" style={{
                  backgroundColor: networkStatus === 'connected' ? '#48bb78' : '#ed8936'
                }}>
                  ●
                </div>
                <span className="wallet-address">
                  {account.substring(0, 6)}...{account.substring(38)}
                </span>
                <button onClick={disconnectWallet} className="btn btn-small btn-disconnect">
                  Disconnect
                </button>
              </div>
            ) : (
              <button onClick={connectWallet} className="btn btn-primary btn-small">
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        {renderPage()}
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>Private Credit Score</h4>
            <p>Privacy-preserving credit assessment using Fully Homomorphic Encryption</p>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><a onClick={() => setCurrentPage('guide')}>How It Works</a></li>
              <li><a onClick={() => setCurrentPage('faq')}>FAQ</a></li>
              <li><a onClick={() => setCurrentPage('docs')}>Documentation</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Resources</h4>
            <ul>
              <li><a href="https://zama.ai/" target="_blank" rel="noopener noreferrer">Zama</a></li>
              <li><a href="https://docs.zama.ai/" target="_blank" rel="noopener noreferrer">Docs</a></li>
              <li><a href="https://community.zama.ai/" target="_blank" rel="noopener noreferrer">Community</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 Private Credit Score. Built with Zama FHE Framework.</p>
        </div>
      </footer>
    </div>
  );
};

/**
 * Home Page
 */
const HomePage = ({ onStartClick }) => {
  return (
    <div className="page home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>🔐 Private Credit Score Assessment</h1>
          <p>Calculate your credit score with complete privacy using Fully Homomorphic Encryption</p>
          <button onClick={onStartClick} className="btn btn-hero">
            Get Started →
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2>Why Choose Private Credit Score?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>Complete Privacy</h3>
            <p>Your financial data is encrypted before submission and never exposed during computation.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚙️</div>
            <h3>Transparent Computation</h3>
            <p>All calculations happen on encrypted data. Results are verifiable and auditable on-chain.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">👤</div>
            <h3>User Control</h3>
            <p>Only you can decrypt your score using your private key. Complete control over your data.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🧮</div>
            <h3>Fair Calculation</h3>
            <p>Weighted formula (50% income, 30% assets, 20% history) ensures fair and balanced scoring.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🚀</div>
            <h3>Instant Results</h3>
            <p>Submit, compute, and reveal your score in minutes. No waiting, no hidden delays.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Verified On-Chain</h3>
            <p>All transactions recorded on blockchain. Complete audit trail with zero privacy loss.</p>
          </div>
        </div>
      </section>

      {/* How It Works Preview */}
      <section className="how-it-works-preview">
        <h2>How It Works</h2>
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Submit Encrypted Data</h3>
            <p>Enter your income, assets, and credit history. Data is encrypted before sending.</p>
          </div>
          <div className="step-arrow">→</div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>Compute Score</h3>
            <p>Smart contract calculates your score on encrypted data. No one sees raw values.</p>
          </div>
          <div className="step-arrow">→</div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Reveal Score</h3>
            <p>Decrypt your result. Only you can see your final score and rating.</p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats">
        <div className="stat-item">
          <h3>100%</h3>
          <p>Private</p>
        </div>
        <div className="stat-item">
          <h3>∞</h3>
          <p>Users</p>
        </div>
        <div className="stat-item">
          <h3>0</h3>
          <p>Data Leaks</p>
        </div>
        <div className="stat-item">
          <h3>24/7</h3>
          <p>Available</p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <h2>Ready to Assess Your Credit Score?</h2>
        <p>Join thousands of users who trust their financial privacy to Zama FHE technology.</p>
        <button onClick={onStartClick} className="btn btn-primary">
          Start Now
        </button>
      </section>
    </div>
  );
};

/**
 * Guide Page
 */
const GuidePage = () => {
  return (
    <div className="page guide-page">
      <h1>📖 How It Works</h1>

      <section className="guide-section">
        <h2>The Credit Score Formula</h2>
        <div className="formula-box">
          <p className="formula">
            Score = (Income × 0.5 + Assets × 0.3 + History × 0.2) / 100
          </p>
        </div>
        <div className="formula-breakdown">
          <div className="component">
            <h3>📈 Income (50%)</h3>
            <p>Your annual earning capacity. Demonstrates financial stability and repayment ability.</p>
            <p className="range">Range: 0 - 1,000,000 (in thousands)</p>
          </div>
          <div className="component">
            <h3>💰 Assets (30%)</h3>
            <p>Total financial assets available. Shows financial security and resources.</p>
            <p className="range">Range: 0 - 10,000,000 (in thousands)</p>
          </div>
          <div className="component">
            <h3>📋 History (20%)</h3>
            <p>Credit history score. Reflects past financial responsibility.</p>
            <p className="range">Range: 0 - 100</p>
          </div>
        </div>
      </section>

      <section className="guide-section">
        <h2>Score Ratings</h2>
        <div className="ratings-grid">
          <div className="rating excellent">
            <h3>📈 Excellent</h3>
            <p className="score">750+</p>
            <p>Outstanding credit profile. Best terms available.</p>
          </div>
          <div className="rating good">
            <h3>✓ Good</h3>
            <p className="score">650 - 749</p>
            <p>Strong credit profile. Favorable terms.</p>
          </div>
          <div className="rating poor">
            <h3>⚠️ Needs Improvement</h3>
            <p className="score">&lt; 650</p>
            <p>Building credit. Room for improvement.</p>
          </div>
        </div>
      </section>

      <section className="guide-section">
        <h2>Privacy Guarantee</h2>
        <div className="privacy-box">
          <h3>What's Encrypted:</h3>
          <ul>
            <li>✓ Your income amount</li>
            <li>✓ Your asset value</li>
            <li>✓ Your credit history</li>
            <li>✓ Your calculated score</li>
            <li>✓ All computation steps</li>
          </ul>
        </div>
        <div className="privacy-box">
          <h3>What's Public:</h3>
          <ul>
            <li>• Your wallet address (on blockchain)</li>
            <li>• Transaction timestamps</li>
            <li>• Computation status (encrypted data)</li>
          </ul>
        </div>
      </section>

      <section className="guide-section">
        <h2>Example Calculation</h2>
        <div className="example-card">
          <h3>Sample Profile:</h3>
          <div className="example-input">
            <p><strong>Income:</strong> $150,000 (150)</p>
            <p><strong>Assets:</strong> $500,000 (500)</p>
            <p><strong>History:</strong> 85/100</p>
          </div>
          <div className="example-calc">
            <p>(150 × 0.5) + (500 × 0.3) + (85 × 0.2)</p>
            <p>= 75 + 150 + 17</p>
            <p>= 242 ÷ 100</p>
            <p className="result">= <strong>242</strong></p>
          </div>
          <div className="example-rating">
            <p>Rating: <span className="badge good">Good ✓</span></p>
          </div>
        </div>
      </section>
    </div>
  );
};

/**
 * FAQ Page
 */
const FAQPage = () => {
  const [expandedFAQ, setExpandedFAQ] = useState(null);

  const faqs = [
    {
      id: 1,
      question: "What is Fully Homomorphic Encryption (FHE)?",
      answer: "FHE is a cryptographic technique that allows computation on encrypted data without decrypting it first. This means your data is never exposed, even during calculation."
    },
    {
      id: 2,
      question: "How is my data protected?",
      answer: "Your financial data is encrypted using FHE before submission. The smart contract performs all calculations on encrypted data. Only you can decrypt your score using your private key."
    },
    {
      id: 3,
      question: "Can anyone see my score?",
      answer: "No. Your score is encrypted on the blockchain. Only you can decrypt it with your private key. You control who sees your score."
    },
    {
      id: 4,
      question: "What if I lose my wallet?",
      answer: "If you lose access to your wallet, you cannot decrypt your stored score. This is by design for security. Always keep your seed phrase safe."
    },
    {
      id: 5,
      question: "How long does it take?",
      answer: "Typically 1-2 minutes depending on blockchain network congestion. Encryption, computation, and decryption happen on-chain."
    },
    {
      id: 6,
      question: "Is there a cost?",
      answer: "Yes, you pay gas fees in ETH for blockchain transactions. This varies based on network conditions. Testnet fees are minimal."
    },
    {
      id: 7,
      question: "Can I change my data?",
      answer: "Yes. You can submit new data anytime. It will overwrite your previous submission and recalculate your score."
    },
    {
      id: 8,
      question: "Who can see my transactions?",
      answer: "Anyone can see that you submitted encrypted data on-chain. But they cannot see your actual values or score. That's the magic of FHE!"
    },
    {
      id: 9,
      question: "Is this on mainnet?",
      answer: "Currently, this is on Zama's testnet. Always verify you're on the correct network before submitting real data."
    },
    {
      id: 10,
      question: "Where can I get testnet ETH?",
      answer: "Visit the Zama testnet faucet or your network's faucet to get free testnet ETH for gas fees."
    }
  ];

  return (
    <div className="page faq-page">
      <h1>❓ Frequently Asked Questions</h1>
      <div className="faq-list">
        {faqs.map((faq) => (
          <div key={faq.id} className="faq-item">
            <button
              className="faq-question"
              onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
            >
              <span>{faq.question}</span>
              <span className="faq-toggle">{expandedFAQ === faq.id ? '−' : '+'}</span>
            </button>
            {expandedFAQ === faq.id && (
              <div className="faq-answer">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Documentation Page
 */
const DocumentationPage = () => {
  return (
    <div className="page docs-page">
      <h1>📚 Documentation</h1>

      <section className="doc-section">
        <h2>Quick Links</h2>
        <div className="doc-grid">
          <div className="doc-card">
            <h3>📖 README</h3>
            <p>Project overview, features, and quick start guide.</p>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="btn btn-small">
              View →
            </a>
          </div>
          <div className="doc-card">
            <h3>🚀 Setup Guide</h3>
            <p>Complete setup, deployment, and troubleshooting instructions.</p>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="btn btn-small">
              View →
            </a>
          </div>
          <div className="doc-card">
            <h3>🏗️ Architecture</h3>
            <p>Technical deep dive into system design and cryptography.</p>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="btn btn-small">
              View →
            </a>
          </div>
          <div className="doc-card">
            <h3>💻 API Reference</h3>
            <p>Smart contract functions and frontend integration examples.</p>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="btn btn-small">
              View →
            </a>
          </div>
        </div>
      </section>

      <section className="doc-section">
        <h2>Resources</h2>
        <div className="resource-list">
          <a href="https://zama.ai/" target="_blank" rel="noopener noreferrer" className="resource-item">
            <span className="resource-icon">🔐</span>
            <div>
              <h4>Zama Official</h4>
              <p>Explore Zama's FHE framework and products</p>
            </div>
          </a>
          <a href="https://docs.zama.ai/" target="_blank" rel="noopener noreferrer" className="resource-item">
            <span className="resource-icon">📖</span>
            <div>
              <h4>Zama Documentation</h4>
              <p>Complete documentation for Zama tools and libraries</p>
            </div>
          </a>
          <a href="https://community.zama.ai/" target="_blank" rel="noopener noreferrer" className="resource-item">
            <span className="resource-icon">👥</span>
            <div>
              <h4>Zama Community</h4>
              <p>Join discussions and get help from the community</p>
            </div>
          </a>
          <a href="https://discord.com/invite/zama" target="_blank" rel="noopener noreferrer" className="resource-item">
            <span className="resource-icon">💬</span>
            <div>
              <h4>Discord Channel</h4>
              <p>Real-time support and community discussions</p>
            </div>
          </a>
        </div>
      </section>

      <section className="doc-section">
        <h2>Getting Help</h2>
        <div className="help-box">
          <h3>Having issues?</h3>
          <p>Check our troubleshooting guide or reach out to the community:</p>
          <ul>
            <li><strong>Documentation Issues:</strong> See our Setup Guide</li>
            <li><strong>Technical Questions:</strong> Visit Zama Community Forum</li>
            <li><strong>Bug Reports:</strong> Create a GitHub issue</li>
            <li><strong>Quick Help:</strong> Ask in Discord #support</li>
          </ul>
        </div>
      </section>
    </div>
  );
};

/**
 * About Page
 */
const AboutPage = () => {
  return (
    <div className="page about-page">
      <h1>About Private Credit Score</h1>

      <section className="about-section">
        <h2>Our Mission</h2>
        <p>
          To demonstrate that financial privacy and data security are not mutually exclusive
          with transparency and verifiability. Using cutting-edge Fully Homomorphic Encryption,
          we enable credit scoring while keeping your data completely private.
        </p>
      </section>

      <section className="about-section">
        <h2>Technology</h2>
        <p>
          Built on Zama's state-of-the-art TFHE library, this application showcases how FHE
          can be used in real-world applications to ensure privacy-preserving computation.
        </p>
        <div className="tech-stack">
          <div className="tech-item">
            <h4>Smart Contracts</h4>
            <p>Solidity 0.8.24 + Zama fhevm</p>
          </div>
          <div className="tech-item">
            <h4>Frontend</h4>
            <p>React 18.2 + ethers.js</p>
          </div>
          <div className="tech-item">
            <h4>Cryptography</h4>
            <p>Fully Homomorphic Encryption</p>
          </div>
          <div className="tech-item">
            <h4>Blockchain</h4>
            <p>Zama Confidential Network</p>
          </div>
        </div>
      </section>

      <section className="about-section">
        <h2>Why This Matters</h2>
        <ul className="benefits-list">
          <li>🔐 Financial data stays private</li>
          <li>⚙️ Computations are verifiable</li>
          <li>👤 Users maintain complete control</li>
          <li>🔗 Results stored permanently on-chain</li>
          <li>🌍 Open source and transparent</li>
        </ul>
      </section>

      <section className="about-section">
        <h2>Built by</h2>
        <p>
          This project demonstrates the practical applications of Zama's FHE technology.
          Learn more at <a href="https://zama.ai/" target="_blank" rel="noopener noreferrer">zama.ai</a>
        </p>
      </section>
    </div>
  );
};

export default MainApp;
