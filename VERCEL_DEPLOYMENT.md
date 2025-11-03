# Vercel Deployment Guide - Private Credit Score Application

## 📋 Prerequisites

Before deploying to Vercel, you need:

- [ ] GitHub account (to push code)
- [ ] Vercel account (free at https://vercel.com)
- [ ] Code pushed to GitHub repository
- [ ] Environment variables ready

---

## 🚀 Deployment Steps

### Step 1: Prepare Your Code

```bash
# Make sure everything is committed
cd /home/zama/creditscore
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### Step 2: Create GitHub Repository

1. Go to https://github.com/new
2. Create new repository
3. Name it: `credit-score-app` (or your choice)
4. Push your code:

```bash
git remote add origin https://github.com/YOUR_USERNAME/credit-score-app.git
git branch -M main
git push -u origin main
```

### Step 3: Connect to Vercel

1. Go to https://vercel.com
2. Click "New Project"
3. Click "Import Git Repository"
4. Select your GitHub repository
5. Click "Import"

### Step 4: Configure Project Settings

**Framework Preset:** React

**Build Settings:**
```
Framework: Create React App
Root Directory: frontend
Build Command: npm run build
Output Directory: build
Install Command: npm install
```

**Environment Variables:**
Add these to Vercel project settings:

```
REACT_APP_RPC_URL=https://your-zama-testnet-rpc
REACT_APP_CONTRACT_ADDRESS=0x0000000000000000000000000000000000000000
```

### Step 5: Deploy

1. Click "Deploy"
2. Wait for build to complete (2-3 minutes)
3. Get your live URL: `https://your-app.vercel.app`

---

## 📝 Environment Variables

### Required Variables

Set these in Vercel project settings under "Environment Variables":

```
REACT_APP_RPC_URL
  → Your Zama testnet RPC endpoint

REACT_APP_CONTRACT_ADDRESS
  → Deployed smart contract address

REACT_APP_NETWORK_ID (optional)
  → Network chain ID
```

### How to Add Variables in Vercel

1. Go to project settings
2. Click "Environment Variables"
3. Add each variable:
   - **Name:** REACT_APP_RPC_URL
   - **Value:** your-rpc-url
4. Repeat for other variables
5. Redeploy project

---

## ✅ Verification

After deployment, verify:

- [ ] URL loads without errors
- [ ] Home page displays correctly
- [ ] Navigation works
- [ ] All pages accessible
- [ ] Mobile responsive
- [ ] No console errors (F12 → console)
- [ ] MetaMask connects (if wallet available)

---

## 🔄 Continuous Deployment

### Auto-Deploy on Git Push

Vercel automatically deploys when you push to main branch:

```bash
# Make changes
nano frontend/src/MainApp.jsx

# Commit and push
git add .
git commit -m "Update app"
git push origin main

# Vercel automatically deploys!
```

### Custom Domain

1. In Vercel project settings
2. Click "Domains"
3. Add your custom domain
4. Follow DNS setup instructions

---

## 🛠️ Troubleshooting

### Build Fails

**Error: "Cannot find module"**
```
Solution:
1. Check package.json has all dependencies
2. Verify all imports are correct
3. Redeploy in Vercel
```

**Error: "Build command failed"**
```
Solution:
1. Check build logs in Vercel
2. Run locally: npm run frontend:build
3. Fix any errors
4. Push and redeploy
```

### Page Blank or Not Loading

```
1. Check environment variables are set
2. Verify RPC URL is correct
3. Check browser console (F12)
4. Clear cache and refresh
```

### MetaMask Not Connecting

```
1. Ensure you're on correct network
2. Check RPC URL is valid
3. Try on testnet
4. Check browser console for errors
```

---

## 📊 Vercel Features

### Performance

- Auto-optimized images
- Automatic code splitting
- Edge caching
- Global CDN

### Analytics

- Vercel Analytics dashboard
- Performance metrics
- Error tracking
- Usage statistics

### Monitoring

- Real-time deployment logs
- Error notifications
- Performance insights
- Security scanning

---

## 🔒 Security

### Best Practices

1. **Environment Variables**
   - Never commit .env files
   - Use Vercel's environment variables
   - Rotate secrets regularly

2. **HTTPS**
   - Automatically enabled
   - Free SSL certificates
   - Auto-renewal

3. **Access Control**
   - Set team access in Vercel
   - Use GitHub protection rules
   - Require reviews before deploy

---

## 📱 Custom Domain

### Add Custom Domain

1. In Vercel dashboard
2. Project → Settings → Domains
3. Add domain name
4. Update DNS records:
   - CNAME: alias.vercel.app
   - Or use Vercel nameservers

### SSL Certificate

- Automatically provisioned
- Auto-renewed
- No action needed

---

## 🔄 Rollback to Previous Version

1. Vercel keeps deployment history
2. Go to Deployments tab
3. Click on previous deployment
4. Click "Promote to Production"

---

## 📈 Scaling & Performance

### Vercel Auto-Scaling

- Handles traffic automatically
- No manual scaling needed
- Pay only for usage
- Global edge deployment

### Optimize Performance

1. Enable Image Optimization
2. Use Code Splitting
3. Minimize JavaScript
4. Optimize CSS

---

## 💰 Pricing

### Free Plan
- Unlimited deployments
- Global CDN
- SSL included
- 100 GB bandwidth/month
- Perfect for development

### Pro Plan
- Custom domains
- Advanced analytics
- Priority support
- 1 TB bandwidth/month

---

## 🎯 Next Steps

### 1. Prepare Code (Now)
```bash
cd /home/zama/creditscore
npm run frontend:build  # Test build locally
```

### 2. Create GitHub Repo (5 min)
```bash
git init
git add .
git commit -m "Initial commit"
git push origin main
```

### 3. Connect Vercel (5 min)
- Sign up at vercel.com
- Import repository
- Configure settings
- Deploy!

### 4. Add Custom Domain (10 min)
- Add domain in Vercel
- Update DNS
- Test access

### 5. Monitor & Maintain
- Check deployment logs
- Monitor performance
- Update as needed

---

## 📞 Support

### Vercel Documentation
- https://vercel.com/docs

### Common Issues
- https://vercel.com/docs/troubleshooting

### Community
- https://vercel.com/support

---

## Quick Checklist

- [ ] Code ready for production
- [ ] Environment variables prepared
- [ ] GitHub repository created
- [ ] Vercel account set up
- [ ] Project imported to Vercel
- [ ] Build settings configured
- [ ] Environment variables added
- [ ] Project deployed
- [ ] URL working
- [ ] Custom domain configured (optional)
- [ ] Monitoring set up
- [ ] Team access configured

---

**Version:** 1.0.0
**Platform:** Vercel
**Framework:** React 18.2
**Status:** Ready to Deploy

Deploy your app now! 🚀

Visit: https://vercel.com
