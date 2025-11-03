# 🌐 Access localhost:3000 - Complete Setup Guide

## ⚡ FASTEST WAY (30 Seconds)

### Copy & Paste This Command:

```bash
cd /home/zama/creditscore && npm run frontend:install && npm run frontend:start
```

### Then Open Browser:
```
http://localhost:3000
```

**Done!** 🎉 Your application is now running.

---

## 📋 Step-by-Step Instructions

### Step 1: Open Terminal

**On Mac/Linux:**
```bash
# Open your terminal application
# Then navigate to the project:
cd /home/zama/creditscore
```

**On Windows:**
```bash
# Open Command Prompt or PowerShell
# Navigate to the project:
cd C:\Users\YourName\path\to\creditscore
# (or your actual path)
```

### Step 2: Install Dependencies (First Time Only)

```bash
npm run frontend:install
```

This installs React, ethers.js, and all required libraries.

**Expected output:**
```
> npm install
added 1234 packages, and audited 1235 packages in 2m 30s
```

### Step 3: Start Development Server

```bash
npm run frontend:start
```

**Expected output:**
```
Compiled successfully!

You can now view credit-score-frontend in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000
```

### Step 4: Open Browser

Click this link or type in your browser:
```
http://localhost:3000
```

---

## 🎨 What You'll See

### Landing Page (Home)

```
┌─────────────────────────────────────────────────────────┐
│  Navigation Bar (Sticky at Top)                         │
│  🔐 Private Credit Score | Home | Credit Score | FAQ   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  HERO SECTION (Gradient Background)                    │
│  ═════════════════════════════════════════════════     │
│                                                         │
│  🔐 Private Credit Score Assessment                   │
│                                                         │
│  Calculate your credit score with complete privacy    │
│  using Fully Homomorphic Encryption                   │
│                                                         │
│  [Get Started →]                                       │
│                                                         │
├─────────────────────────────────────────────────────────┤
│  FEATURES SECTION                                       │
│  ═════════════════════════════════════════════════     │
│                                                         │
│  🔒 Complete Privacy  ⚙️ Transparent   👤 User Control│
│  🧮 Fair Calculation  🚀 Instant       📊 Verified   │
│                                                         │
├─────────────────────────────────────────────────────────┤
│  HOW IT WORKS                                           │
│  ═════════════════════════════════════════════════     │
│                                                         │
│  [1] Submit Data → [2] Compute Score → [3] Reveal    │
│                                                         │
├─────────────────────────────────────────────────────────┤
│  STATISTICS                                             │
│  ═════════════════════════════════════════════════     │
│                                                         │
│  100% Private | ∞ Users | 0 Data Leaks | 24/7        │
│                                                         │
├─────────────────────────────────────────────────────────┤
│  CALL TO ACTION                                         │
│  ═════════════════════════════════════════════════     │
│                                                         │
│  Ready to Assess Your Credit Score?                  │
│  [Start Now]                                           │
│                                                         │
└─────────────────────────────────────────────────────────┘

FOOTER
─────────────────────────────────────────────────────────
Quick Links | Resources | © 2024 Private Credit Score
```

### Navigation Menu

**Desktop View:**
```
🔐 Private Credit Score | 🏠 Home | 📊 Credit Score | 📖 How It Works | ❓ FAQ | 📚 Docs | [Connect Wallet]
```

**Mobile View:**
```
🔐 Private Credit Score | ☰ Menu | [Connect Wallet]
```

---

## 🎯 Pages You Can Visit

### 1. 🏠 Home Page (Default)
- Project overview
- 6 feature cards
- Process visualization
- Statistics
- Call-to-action

### 2. 📊 Credit Score App
- Wallet connection
- Data input form
- Score computation
- Result display

### 3. 📖 How It Works
- Score formula
- Component breakdown
- Rating system
- Privacy explanation
- Example calculation

### 4. ❓ FAQ
- 10+ expandable questions
- Common concerns answered

### 5. 📚 Documentation
- Quick links
- Resources
- Getting help

### 6. ℹ️ About
- Mission statement
- Technology stack
- Why it matters

---

## 🔐 Try the Credit Score App

### 1. Click "Connect Wallet"
   - MetaMask will pop up
   - Select your account
   - Click "Connect"

### 2. Fill in Form
   ```
   Income:  150  (represents $150,000)
   Assets:  500  (represents $500,000)
   History: 85   (out of 100)
   ```

### 3. Submit Data
   - Click "Submit Encrypted Data"
   - MetaMask window opens
   - Click "Confirm"
   - Wait for transaction

### 4. Compute Score
   - Click "Compute Score"
   - Smart contract calculates
   - Wait for confirmation

### 5. View Result
   - Click "Reveal My Score"
   - Get your encrypted score decrypted
   - See rating: Excellent 📈 / Good ✓ / Needs Improvement ⚠️

---

## 🛠️ Troubleshooting

### Problem: "npm: command not found"
**Solution:** Install Node.js from https://nodejs.org/

### Problem: Port 3000 already in use
**Solution:**
```bash
# Kill the process using port 3000
# Mac/Linux:
lsof -ti:3000 | xargs kill -9

# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Problem: "Cannot find module"
**Solution:**
```bash
rm -rf frontend/node_modules package-lock.json
npm run frontend:install
```

### Problem: Browser shows blank page
**Solution:**
```bash
# Clear cache and refresh
# Ctrl+Shift+Delete (most browsers)
# Then refresh: Ctrl+R or Cmd+R
```

### Problem: MetaMask not connecting
**Solution:**
1. Refresh the page
2. Check MetaMask is unlocked
3. Try different network
4. Check browser console for errors

### Problem: Cannot read property of undefined
**Solution:**
```bash
# Clear all and reinstall
cd /home/zama/creditscore
npm run frontend:install
npm run frontend:start
```

---

## 📱 Device Support

### Desktop
- ✅ Full functionality
- ✅ All features accessible
- ✅ Best experience

### Tablet
- ✅ Responsive design
- ✅ Touch-friendly buttons
- ✅ Optimized layout

### Mobile
- ✅ Hamburger menu
- ✅ Single column layout
- ✅ Touch optimized
- ✅ All features work

---

## 🔒 Security Notes

### Local Development
- Data is NOT encrypted without blockchain
- No real data storage
- Test environment only

### To Enable Full Features
You'll need:
1. MetaMask wallet installed
2. Testnet ETH (for gas fees)
3. Connected to Zama testnet
4. Smart contract deployed

---

## 📊 Example Calculations

### Profile 1: Conservative
```
Income: 80
Assets: 200
History: 60

Score = (80×0.5 + 200×0.3 + 60×0.2) ÷ 100
       = (40 + 60 + 12) ÷ 100
       = 112 ÷ 100
       = 1.12... → 11
Rating: Needs Improvement ⚠️
```

### Profile 2: Moderate
```
Income: 150
Assets: 500
History: 85

Score = (150×0.5 + 500×0.3 + 85×0.2) ÷ 100
       = (75 + 150 + 17) ÷ 100
       = 242 ÷ 100
       = 2.42... → 242
Rating: Good ✓
```

### Profile 3: Strong
```
Income: 300
Assets: 1500
History: 95

Score = (300×0.5 + 1500×0.3 + 95×0.2) ÷ 100
       = (150 + 450 + 19) ÷ 100
       = 619 ÷ 100
       = 6.19... → 619
Rating: Excellent 📈
```

---

## 💡 Tips for Best Experience

### Performance
1. Use Chrome for best compatibility
2. Close other browser tabs for speed
3. Clear cache if things act strange
4. Use DevTools (F12) to debug

### Testing
1. Test all navigation links
2. Try different screen sizes (F12 → responsive)
3. Test mobile menu on mobile
4. Try form validation

### Development
1. Keep terminal visible
2. Watch for error messages
3. Check browser console (F12)
4. Restart if needed

---

## 📚 Learn More

### In the Application
- Read "How It Works" page
- Browse FAQ page
- Check About page
- View all documentation

### External Resources
- Zama: https://zama.ai/
- Docs: https://docs.zama.ai/
- Community: https://community.zama.ai/
- Discord: https://discord.com/invite/zama

### Project Documentation
- **README.md** - Overview
- **SETUP_GUIDE.md** - Detailed setup
- **ARCHITECTURE.md** - Technical details
- **UI_GUIDE.md** - UI documentation
- **LOCALHOST_GUIDE.md** - This file!

---

## 🎮 Try These Commands

### Start the app
```bash
npm run frontend:start
```

### Build for production
```bash
npm run frontend:build
```

### Run backend tests
```bash
npm run test
```

### Deploy to testnet
```bash
./deploy.sh testnet
```

### Full project setup
```bash
bash init.sh
```

---

## 📞 Need Help?

### Check These First
1. Refresh browser (Ctrl+R or Cmd+R)
2. Clear browser cache (Ctrl+Shift+Delete)
3. Check browser console (F12)
4. Check terminal for error messages

### Then Try
1. Restart development server
2. Reinstall dependencies
3. Clear node_modules and reinstall

### Still Stuck?
1. Check SETUP_GUIDE.md
2. Check LOCALHOST_GUIDE.md (this file)
3. Visit https://docs.zama.ai/
4. Join Discord community

---

## ✅ Verification Checklist

After starting the server, verify:

- [ ] Terminal shows "Compiled successfully!"
- [ ] Browser shows home page
- [ ] Navigation menu visible
- [ ] All 6 pages accessible
- [ ] Features cards display
- [ ] Responsive on mobile (F12 → mobile view)
- [ ] Connect Wallet button visible
- [ ] No error messages in console

---

## 🎉 Ready to Go!

You now have:
- ✅ Beautiful home page
- ✅ 6 full pages
- ✅ Professional design
- ✅ Mobile responsive
- ✅ Wallet integration
- ✅ Credit score app
- ✅ Complete documentation

**Everything is ready for localhost:3000!**

---

## Quick Reference

| Task | Command |
|------|---------|
| Install | `npm run frontend:install` |
| Start | `npm run frontend:start` |
| Build | `npm run frontend:build` |
| Navigate | Open http://localhost:3000 |
| Stop | Ctrl+C in terminal |
| Reset | Refresh browser (Ctrl+R) |

---

**Version:** 1.0.0
**Status:** Ready for localhost:3000
**Date:** November 2024
**Framework:** React 18.2 + Zama FHE

**Start now with:**
```bash
npm run frontend:start
```

Then visit: http://localhost:3000 🚀
