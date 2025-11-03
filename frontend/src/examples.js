// Integration examples for frontend
import { FhevsClient } from 'fhevmc';
import { ethers } from 'ethers';

/**
 * Example 1: Complete submission workflow
 */
export async function exampleSubmitWorkflow() {
  try {
    // Initialize
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const fheClient = new FhevsClient();

    // Connect wallet
    await window.ethereum.request({ method: 'eth_requestAccounts' });

    // User inputs
    const income = 150;      // $150,000
    const assets = 500;      // $500,000
    const history = 85;      // 85/100

    console.log('📊 Submitting credit data');
    console.log(`Income: ${income}k, Assets: ${assets}k, History: ${history}`);

    // Encrypt data
    const encryptedIncome = await fheClient.encrypt32(BigInt(income));
    const encryptedAssets = await fheClient.encrypt32(BigInt(assets));
    const encryptedHistory = await fheClient.encrypt32(BigInt(history));

    // Submit to contract
    const contract = new ethers.Contract(
      process.env.REACT_APP_CONTRACT_ADDRESS,
      require('./CreditScore.json').abi,
      signer
    );

    const tx = await contract.submitCreditData(
      encryptedIncome,
      encryptedAssets,
      encryptedHistory
    );

    const receipt = await tx.wait();
    console.log('✓ Data submitted:', receipt.transactionHash);

    return receipt;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

/**
 * Example 2: Compute score
 */
export async function exampleComputeScore() {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const contract = new ethers.Contract(
      process.env.REACT_APP_CONTRACT_ADDRESS,
      require('./CreditScore.json').abi,
      signer
    );

    console.log('🧮 Computing credit score...');

    const tx = await contract.computeMyScore();
    const receipt = await tx.wait();

    console.log('✓ Score computed:', receipt.transactionHash);

    return receipt;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

/**
 * Example 3: Reveal score
 */
export async function exampleRevealScore() {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const fheClient = new FhevsClient();

    const contract = new ethers.Contract(
      process.env.REACT_APP_CONTRACT_ADDRESS,
      require('./CreditScore.json').abi,
      signer
    );

    console.log('🔓 Decrypting score...');

    // Get user's decryption key
    const decryptionKey = await fheClient.getDecryptionKey();

    // Decrypt score
    const score = await contract.revealMyScore(decryptionKey);

    console.log('✓ Score revealed:', score.toNumber());

    return score.toNumber();
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

/**
 * Example 4: Complete flow with validator
 */
export async function exampleValidatorWorkflow() {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const userAddress = await signer.getAddress();

    const contract = new ethers.Contract(
      process.env.REACT_APP_CONTRACT_ADDRESS,
      require('./CreditScoreV2.json').abi,
      signer
    );

    console.log('👤 Validator workflow example');

    // 1. User grants validator access
    const validatorAddress = '0x1234...'; // Replace with actual validator

    console.log('Granting validator access...');
    let tx = await contract.grantValidatorAccess(validatorAddress);
    await tx.wait();
    console.log('✓ Access granted');

    // 2. User computes score
    console.log('Computing score...');
    tx = await contract.computeMyScore();
    await tx.wait();
    console.log('✓ Score computed');

    // 3. User reveals score
    const fheClient = new FhevsClient();
    const decryptionKey = await fheClient.getDecryptionKey();

    console.log('Revealing score...');
    tx = await contract.revealMyScore(decryptionKey);
    await tx.wait();
    const score = await contract.getMyScore();
    console.log('✓ Score revealed:', score.toNumber());

    // 4. Validator can now view the score
    const validatorSigner = provider.getSigner(validatorAddress);
    const validatorContract = contract.connect(validatorSigner);

    console.log('Validator viewing score...');
    const validatorViewScore = await validatorContract.viewAuthorizedScore(userAddress);
    console.log('✓ Validator sees score:', validatorViewScore.toNumber());

    return {
      userScore: score.toNumber(),
      validatorCanView: true,
    };
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

/**
 * Example 5: Batch checking data status
 */
export async function exampleCheckStatus() {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const userAddress = await signer.getAddress();

    const contract = new ethers.Contract(
      process.env.REACT_APP_CONTRACT_ADDRESS,
      require('./CreditScore.json').abi,
      provider
    );

    console.log('📋 Checking user status');

    // Check various states
    const hasData = await contract.hasSubmittedData(userAddress);
    console.log('Has submitted data:', hasData);

    const hasScore = await contract.hasComputedScore(userAddress);
    console.log('Has computed score:', hasScore);

    if (hasScore) {
      const timestamp = await contract.getSubmissionTime(userAddress);
      console.log('Submission time:', new Date(timestamp * 1000));
    }

    return {
      hasData,
      hasScore,
    };
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

/**
 * Helper: Format score with category
 */
export function formatScore(score) {
  if (score >= 750) {
    return { score, category: 'Excellent 📈', color: '#48bb78' };
  } else if (score >= 650) {
    return { score, category: 'Good ✓', color: '#4299e1' };
  } else {
    return { score, category: 'Needs Improvement ⚠️', color: '#ed8936' };
  }
}

/**
 * Helper: Validate inputs
 */
export function validateInputs(income, assets, history) {
  const errors = [];

  if (income < 0 || income > 1000000) {
    errors.push('Income must be 0-1,000,000 (thousands)');
  }

  if (assets < 0 || assets > 10000000) {
    errors.push('Assets must be 0-10,000,000 (thousands)');
  }

  if (history < 0 || history > 100) {
    errors.push('History must be 0-100');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
