import React, { useState } from 'react';
import { ethers } from 'ethers';
import { FhevsClient } from 'fhevmc';
import './CreditScoreApp.css';

/**
 * Private Credit Score Application Frontend
 * Allows users to submit encrypted credit data and view their scores
 */
const CreditScoreApp = () => {
  const [account, setAccount] = useState('');
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [fheClient, setFheClient] = useState(null);

  // Form state for credit data
  const [income, setIncome] = useState('');
  const [assets, setAssets] = useState('');
  const [history, setHistory] = useState('');

  // UI state
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [score, setScore] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  // Initialize Web3 connection
  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert('Please install MetaMask');
        return;
      }

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      const ethProvider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = ethProvider.getSigner();

      // Initialize FhevsClient for encryption
      const client = new FhevsClient({
        networkUrl: process.env.REACT_APP_RPC_URL || 'http://localhost:8545',
      });

      setProvider(ethProvider);
      setAccount(accounts[0]);
      setFheClient(client);

      // Initialize contract
      const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
      const contractABI = require('./CreditScore.json').abi;

      const contractInstance = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );

      setContract(contractInstance);
      setMessage(`Connected: ${accounts[0].substring(0, 6)}...`);
    } catch (error) {
      setMessage(`Connection error: ${error.message}`);
      console.error(error);
    }
  };

  // Validate input ranges
  const validateInputs = () => {
    const incomeNum = parseInt(income);
    const assetsNum = parseInt(assets);
    const historyNum = parseInt(history);

    if (isNaN(incomeNum) || incomeNum < 0 || incomeNum > 1000000) {
      setMessage('Income must be between 0 and 1,000,000 (in thousands)');
      return false;
    }

    if (isNaN(assetsNum) || assetsNum < 0 || assetsNum > 10000000) {
      setMessage('Assets must be between 0 and 10,000,000 (in thousands)');
      return false;
    }

    if (isNaN(historyNum) || historyNum < 0 || historyNum > 100) {
      setMessage('Credit history must be between 0 and 100');
      return false;
    }

    return true;
  };

  // Submit encrypted credit data
  const submitCreditData = async (e) => {
    e.preventDefault();

    if (!contract || !fheClient) {
      setMessage('Please connect wallet first');
      return;
    }

    if (!validateInputs()) {
      return;
    }

    try {
      setLoading(true);
      setMessage('Encrypting data...');

      // Create encrypted inputs using FHE client
      const encryptedIncome = await fheClient.encrypt32(BigInt(income));
      const encryptedAssets = await fheClient.encrypt32(BigInt(assets));
      const encryptedHistory = await fheClient.encrypt32(BigInt(history));

      setMessage('Submitting encrypted data to contract...');

      // Submit to contract
      const tx = await contract.submitCreditData(
        encryptedIncome,
        encryptedAssets,
        encryptedHistory
      );

      setMessage(`Transaction sent: ${tx.hash}`);

      // Wait for confirmation
      await tx.wait();

      setMessage('✓ Credit data submitted successfully!');
      setSubmitted(true);
      setIncome('');
      setAssets('');
      setHistory('');
      setLoading(false);
    } catch (error) {
      setMessage(`Submission error: ${error.message}`);
      setLoading(false);
      console.error(error);
    }
  };

  // Compute credit score
  const handleComputeScore = async () => {
    if (!contract) {
      setMessage('Please connect wallet first');
      return;
    }

    try {
      setLoading(true);
      setMessage('Computing encrypted score...');

      const tx = await contract.computeMyScore();
      setMessage(`Computing: ${tx.hash}`);

      await tx.wait();

      setMessage('✓ Score computed successfully!');
      setLoading(false);
    } catch (error) {
      setMessage(`Computation error: ${error.message}`);
      setLoading(false);
      console.error(error);
    }
  };

  // Reveal and decrypt score
  const handleRevealScore = async () => {
    if (!contract || !fheClient) {
      setMessage('Please connect wallet first');
      return;
    }

    try {
      setLoading(true);
      setMessage('Decrypting your score...');

      // Get decryption key from FHE client
      const decryptionKey = await fheClient.getDecryptionKey();

      // Call contract to decrypt
      const tx = await contract.revealMyScore(decryptionKey);
      setMessage(`Decrypting: ${tx.hash}`);

      const receipt = await tx.wait();

      // Parse result from event logs
      const events = contract.interface.parseLog(receipt.logs[0]);
      const revealedScore = events.args.revealedScore.toNumber();

      setScore(revealedScore);
      setMessage('✓ Score decrypted successfully!');
      setLoading(false);
    } catch (error) {
      setMessage(`Decryption error: ${error.message}`);
      setLoading(false);
      console.error(error);
    }
  };

  return (
    <div className="credit-score-app">
      <header className="app-header">
        <h1>🔐 Private Credit Score Assessment</h1>
        <p>
          Calculate your credit score with complete privacy using Fully Homomorphic
          Encryption
        </p>
      </header>

      <main className="app-container">
        {/* Connection Section */}
        <section className="connection-section">
          <button
            onClick={connectWallet}
            className="btn btn-primary"
            disabled={account}
          >
            {account ? `Connected: ${account.substring(0, 10)}...` : 'Connect Wallet'}
          </button>
        </section>

        {account && (
          <>
            {/* Input Section */}
            <section className="form-section">
              <h2>📊 Submit Your Credit Data</h2>
              <p className="info-text">All data is encrypted before submission</p>

              <form onSubmit={submitCreditData} className="credit-form">
                <div className="form-group">
                  <label htmlFor="income">Annual Income (in thousands)</label>
                  <input
                    id="income"
                    type="number"
                    min="0"
                    max="1000000"
                    value={income}
                    onChange={(e) => setIncome(e.target.value)}
                    placeholder="e.g., 100 = $100,000"
                    disabled={loading}
                  />
                  <small>Weight: 50%</small>
                </div>

                <div className="form-group">
                  <label htmlFor="assets">Total Assets (in thousands)</label>
                  <input
                    id="assets"
                    type="number"
                    min="0"
                    max="10000000"
                    value={assets}
                    onChange={(e) => setAssets(e.target.value)}
                    placeholder="e.g., 500 = $500,000"
                    disabled={loading}
                  />
                  <small>Weight: 30%</small>
                </div>

                <div className="form-group">
                  <label htmlFor="history">Credit History Score (0-100)</label>
                  <input
                    id="history"
                    type="number"
                    min="0"
                    max="100"
                    value={history}
                    onChange={(e) => setHistory(e.target.value)}
                    placeholder="e.g., 85"
                    disabled={loading}
                  />
                  <small>Weight: 20%</small>
                </div>

                <button
                  type="submit"
                  className="btn btn-submit"
                  disabled={loading || !income || !assets || !history}
                >
                  {loading ? 'Processing...' : 'Submit Encrypted Data'}
                </button>
              </form>
            </section>

            {/* Score Computation Section */}
            {submitted && (
              <section className="score-section">
                <h2>🧮 Calculate Your Score</h2>
                <p className="info-text">
                  The contract will compute: (income × 0.5) + (assets × 0.3) + (history × 0.2)
                </p>

                <div className="button-group">
                  <button
                    onClick={handleComputeScore}
                    className="btn btn-secondary"
                    disabled={loading || score !== null}
                  >
                    {loading ? 'Computing...' : 'Compute Score'}
                  </button>

                  <button
                    onClick={handleRevealScore}
                    className="btn btn-success"
                    disabled={loading}
                  >
                    {loading ? 'Decrypting...' : 'Reveal My Score'}
                  </button>
                </div>
              </section>
            )}

            {/* Result Section */}
            {score !== null && (
              <section className="result-section">
                <h2>✨ Your Private Credit Score</h2>
                <div className="score-display">
                  <div className="score-value">{score}</div>
                  <div className="score-range">
                    {score >= 750 ? '📈 Excellent' : score >= 650 ? '✓ Good' : '⚠️ Needs Improvement'}
                  </div>
                </div>
                <p className="score-note">
                  This score was computed entirely on encrypted data. Your individual credit
                  metrics remain private.
                </p>
              </section>
            )}

            {/* Status Message */}
            {message && (
              <div className={`message ${message.includes('error') ? 'error' : 'success'}`}>
                {message}
              </div>
            )}
          </>
        )}
      </main>

      <footer className="app-footer">
        <p>🔒 Powered by Zama FHE | All computations are privacy-preserving</p>
      </footer>
    </div>
  );
};

export default CreditScoreApp;
