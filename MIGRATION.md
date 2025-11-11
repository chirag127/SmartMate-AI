# 🔄 Migration Guide: Backend to Client-Side Architecture

This guide will help you transition from the previous backend-based SmartMate AI to the new serverless, client-side architecture powered by Cerebras API.

## 📋 What's Changed

### Architecture Evolution

**Before (v1.x)**:
- Browser Extension ↔️ Express.js Backend ↔️ Gemini API
- MongoDB for user settings/logs
- Required self-hosting or cloud deployment
- Network latency from multiple hops

**Now (v2.0)**:
- Browser Extension ↔️ Cerebras API (direct)
- Local browser storage for settings
- No backend hosting required
- Ultra-fast inference with reduced latency

## 🎯 Benefits of the New Architecture

### For Users
- ✅ **Enhanced Privacy**: No data passes through intermediary servers
- ✅ **Faster Response**: Direct API communication eliminates backend hop
- ✅ **Zero Setup**: No backend server to configure or maintain
- ✅ **Better Performance**: Cerebras hardware provides ultra-fast inference

### For Developers
- ✅ **Simplified Deployment**: Just load the extension
- ✅ **Reduced Costs**: No backend hosting fees
- ✅ **Easier Maintenance**: Fewer moving parts
- ✅ **Better Scalability**: Each user brings their own API key

## 🚀 Migration Steps

### Step 1: Backup Your Data (Optional)

If you have custom prompt templates or settings you want to preserve:

1. Open the old extension
2. Export your settings (if available) or take screenshots of your configurations
3. Note down any custom prompt templates you've created

### Step 2: Remove Old Backend (If Self-Hosted)

If you were running the backend server:

1. Stop the backend server:
   ```bash
   # Stop the Node.js process
   pkill -f "node backend/server.js"
   # Or if using PM2
   pm2 stop smartmate-ai
   ```

2. Remove MongoDB data (optional):
   ```bash
   # Connect to MongoDB and drop the database
   mongosh
   use smartmate_ai
   db.dropDatabase()
   exit
   ```

3. You can safely delete the backend folder and dependencies (the new version handles this automatically)

### Step 3: Get Your Cerebras API Key

1. Visit [Cerebras Cloud](https://cerebras.ai/) and create an account
2. Navigate to your API dashboard
3. Generate a new API key
4. Copy and save this key securely

**Note**: Cerebras offers:
- Free tier for testing and development
- Competitive pricing for production use
- Ultra-fast inference speeds
- High rate limits

### Step 4: Install New Extension Version

1. Update your repository:
   ```bash
   cd SmartMate-AI
   git pull origin main
   ```

2. Install updated dependencies:
   ```bash
   npm install
   ```

3. Build the extension:
   ```bash
   npm run build
   ```

4. Reload the extension in your browser:
   - **Chrome/Edge/Brave**: Go to `chrome://extensions/`, find SmartMate AI, and click the reload icon
   - **Firefox**: Go to `about:debugging#/runtime/this-firefox`, find SmartMate AI, and click "Reload"

### Step 5: Configure API Key

1. Click the SmartMate AI extension icon
2. Go to "Settings" tab
3. Enter your Cerebras API key
4. Click "Save"

### Step 6: Restore Your Settings

Reconfigure your preferences in the Settings panel:
- Default tone
- Default language
- Theme preference
- Save history toggle

## 🔄 Feature Mapping

| Old Feature | New Feature | Status |
|------------|-------------|--------|
| Text summarization | Text summarization | ✅ Available |
| Tone adjustment | Tone adjustment | ✅ Available |
| Content rewriting | Content rewriting | ✅ Available |
| Text expansion | Text expansion | ✅ Available |
| Custom prompts | Custom prompts | ✅ Available |
| Settings storage | Local browser storage | ✅ Available |
| Prompt history | Optional local history | ✅ Available |
| User accounts | Not applicable | ❌ Removed |
| Cloud sync | Not applicable | ❌ Removed |
| Server logs | Not applicable | ❌ Removed |

## 🔧 Breaking Changes

### Removed Features
- **User Authentication**: No login/signup required anymore
- **Cloud Sync**: Settings no longer sync across devices (stored locally per browser)
- **Usage Analytics**: No server-side logging (enhanced privacy)
- **Backend API**: All backend endpoints removed

### Changed Features
- **API Key Management**: Now handled in extension settings instead of `.env` file
- **Settings Storage**: Moved from MongoDB to browser's local storage
- **AI Provider**: Switched from Gemini to Cerebras for better performance

## 🆘 Troubleshooting

### Extension Not Working After Update

1. **Clear Extension Storage**:
   ```javascript
   // Open extension popup, then open browser console (F12)
   chrome.storage.local.clear(() => console.log('Storage cleared'));
   ```

2. **Reload Extension**: Remove and re-add the extension

3. **Check API Key**: Ensure your Cerebras API key is valid and properly entered

### Missing Old Settings

Unfortunately, settings from the MongoDB backend cannot be automatically migrated. You'll need to:
- Re-enter your preferred tone, language, and theme
- Recreate any custom prompt templates
- Reconfigure any other preferences

### API Rate Limits

Cerebras has different rate limits than Gemini:
- Check your [Cerebras dashboard](https://cerebras.ai/dashboard) for current limits
- Upgrade your plan if you need higher throughput
- The extension will display error messages if you hit rate limits

### Performance Differences

You should notice:
- **Faster responses** due to Cerebras hardware acceleration
- **Lower latency** from removing backend hop
- **More consistent performance** without backend server variability

## 📊 Comparing Costs

### Old Architecture (Backend-Based)
- Backend hosting: $5-50/month (depending on provider)
- MongoDB hosting: $0-15/month (Atlas free tier or paid)
- Gemini API: Pay per token
- **Total**: $5-65/month + API costs

### New Architecture (Client-Side)
- Backend hosting: $0
- Database: $0
- Cerebras API: Pay per token (competitive rates, free tier available)
- **Total**: $0 base + API costs

## 🎉 Next Steps

Now that you've migrated:

1. **Test Core Features**: Try summarizing, rewriting, and tone adjustment
2. **Configure Preferences**: Set your default tone, language, and theme
3. **Create Shortcuts**: Set up browser shortcuts for quick access
4. **Explore New Performance**: Notice the improved response times
5. **Provide Feedback**: Report any issues or suggestions on GitHub

## 🤝 Need Help?

- **GitHub Issues**: [Report bugs or ask questions](https://github.com/chirag127/SmartMate-AI/issues)
- **Discussions**: [Join community discussions](https://github.com/chirag127/SmartMate-AI/discussions)
- **Documentation**: [Read the full README](README.md)

## 📝 Rollback (If Needed)

If you need to temporarily rollback to the old version:

```bash
# Checkout the last version with backend
git checkout v1.0.0  # or the last backend-based tag

# Install old dependencies
npm install

# Start the old backend
npm start
```

However, we recommend giving the new architecture a try - it's faster, more private, and easier to use!

---

**Questions?** Open an issue on GitHub or check existing discussions.
