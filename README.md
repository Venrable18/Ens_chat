# cosmosChat - Quick Development Prompt

## 🎯 **Core Objective**
Build a **real-time on-chain chat dApp** with `.cosmos` ENS domains, IPFS profile images, and **zero page reloads** - everything updates live via blockchain events.

## ⚡ **Critical Requirements**

### **Real-time SPA Architecture**
- **No page/route reloads** - everything happens in single page context
- **Live message streaming** via blockchain event listeners
- **Instant UI updates** with optimistic rendering
- **Real-time typing indicators** and online status
- **Seamless chat switching** without navigation

### **Tech Stack**
- **Contracts**: Foundry + Solidity 0.8.24 + Sepolia testnet
- **Frontend**: Vite + React + TypeScript + Wagmi 2.x + Viem 2.x
- **Design**: Pixelated retro + WhatsApp UX + Framer Motion
- **Storage**: IPFS (Pinata) for profile images
- **State**: Zustand + React Query for caching

### **Core Features**
1. **Manual wallet connection** → Check `.cosmos` registration status
2. **Register `.cosmos` name** + upload IPFS profile image
3. **Single-page chat interface** with live updates
4. **Group chat + Direct messaging** with real-time events
5. **Profile management** with instant updates across all views

### **Smart Contract (`cosmosChatRegistry.sol`)**
```solidity
// Register with profile image
function registerCosmosUser(string memory crazyName, string memory ipfsImageHash) external payable

// Messaging with comprehensive events
function sendGroupMessage(string memory message) external
function sendDirectMessage(address recipient, string memory message) external

// Real-time events for frontend
event GroupMessageSent(address indexed sender, string message, uint256 timestamp, uint256 messageId);
event DirectMessageSent(address indexed sender, address indexed recipient, string message, uint256 timestamp);
event UserOnlineStatusChanged(address indexed user, bool isOnline, uint256 timestamp);
```


### **Development Priority**
1. Deploy smart contract to Sepolia with comprehensive events
2. Build real-time event subscription system
3. Create single-page chat interface with live updates
4. Implement `.cosmos` registration with IPFS images
5. Add optimistic UI updates and error handling

## 🚀 **Expected Outcome**
A fully functional **real-time chat dApp** where users register `.cosmos` names, upload profile images to IPFS, and chat in real-time **without any page reloads** - creating a smooth, app-like experience on the blockchain.

