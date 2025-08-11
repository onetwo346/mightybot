# 🤖 Mighty Chatbot - Free AI Aggregator

**The ultimate free AI chatbot that combines Claude, ChatGPT, DeepSeek, and Grok into one unlimited experience!**

## ✨ Features

- **🚀 Unlimited Free AI Access** - No API keys, no costs, no limits!
- **🔄 Multi-AI Service Rotation** - Automatically cycles through available AI services
- **💬 Real-time Chat Interface** - Beautiful, responsive web-based chat
- **🎨 Modern UI/UX** - Sleek design with glassmorphism effects
- **📱 Responsive Design** - Works perfectly on desktop and mobile
- **⚡ Real-time Updates** - Socket.IO powered instant messaging
- **🔒 Rate Limiting** - Smart service rotation to avoid hitting limits

## 🎯 How It Works

Mighty Chatbot intelligently routes your questions through multiple free AI services:

1. **Claude.ai** - Anthropic's free tier
2. **ChatGPT** - OpenAI's free tier  
3. **DeepSeek** - DeepSeek's free tier
4. **Grok** - xAI's free tier

The system automatically rotates between services, ensuring you never hit rate limits and always have access to AI assistance.

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd mighty-chatbot
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the server**
   ```bash
   npm start
   ```

4. **Open your browser**
   ```
   http://localhost:3000
   ```

### Development Mode

```bash
npm run dev
```

This will start the server with nodemon for automatic restarts during development.

## 🏗️ Project Structure

```
mighty-chatbot/
├── index.html            # Main HTML file
├── styles.css            # CSS styles
├── app.js               # Frontend JavaScript
├── server.js            # Express server + Socket.IO
├── package.json         # Dependencies and scripts
└── README.md           # This file
```

## 🛠️ Technology Stack

- **Backend**: Node.js, Express.js, Socket.IO
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Styling**: Custom CSS with modern design
- **Real-time**: Socket.IO for instant messaging
- **AI Integration**: Web scraping approach (simulated for now)

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3000
NODE_ENV=development
```

### Customizing AI Services

Edit `server.js` to modify the AI service configuration:

```javascript
this.services = [
  { name: 'Claude', url: 'https://claude.ai', status: 'available', lastUsed: 0 },
  { name: 'ChatGPT', url: 'https://chat.openai.com', status: 'available', lastUsed: 0 },
  // Add more services here
];
```

## 🎨 Customization

### Styling

The app uses custom CSS with modern design. To modify styles:

1. Edit `styles.css` directly
2. Changes are applied immediately - no build step needed

### Adding New AI Services

1. Add the service to the `services` array in `server.js`
2. Implement the integration logic in the `processMessage` method
3. Add corresponding UI elements in the HTML/CSS

## 🚧 Current Status

**Phase 1: Foundation Complete** ✅
- Beautiful UI/UX design
- Real-time chat functionality
- Service management system
- Responsive design

**Phase 2: AI Integration** 🚧
- Web scraping implementation
- Service rotation logic
- Rate limiting and cooldowns

**Phase 3: Advanced Features** 📋
- User authentication
- Chat history
- Export functionality
- Mobile app

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

## 🐛 Known Issues

- Currently using simulated AI responses (Phase 2 will implement real integration)
- Some browsers may have backdrop-filter compatibility issues
- Mobile responsiveness could be improved

## 📱 Browser Support

- ✅ Chrome 88+
- ✅ Firefox 87+
- ✅ Safari 14+
- ✅ Edge 88+

## 🔒 Security Considerations

- Rate limiting implemented to prevent abuse
- Input sanitization for XSS protection
- CORS configuration for production deployment
- Helmet.js for security headers

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Tailwind CSS** for the amazing utility-first CSS framework
- **Socket.IO** for real-time communication
- **Font Awesome** for beautiful icons
- **Inter font** for typography

## 📞 Support

If you have any questions or need help:

- Create an issue on GitHub
- Check the documentation
- Join our community discussions

---

**Made with ❤️ by the Mighty Bot Team**

*Unleash the power of unlimited AI - completely free!*
