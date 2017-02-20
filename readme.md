Alt Legal Code Challenge
===

# Instructions
1. In the root direct, run `npm install` to install dependencies.

2. You will need to make a `_config.js` file in the root directory with:
`var ids = {
  twitter: {
    consumerKey: '0rA7q4Fe3UUPy0ttkFjLA1i21',
    consumerSecret: 'AZRZNF1HuSKmNr4UdB6PiE2DpxxoLKQG3wxFtN4Hk1ZBHbRgNv',
    accessToken:  '816156838039273472-daZUtCZz6rbZiLqpQTPnOGuNiWAhcrL',
    accessTokenSecret: 'RPKHz7KeQkqdw7qSdamjh7NOvzVWUXXGo6CfzoBLkQ1j3',
    callbackURL: "http://127.0.0.1:3000/auth/twitter/callback"
  }
};
module.exports = ids;`

3. Run `mongod` in terminal first. The application will create a DB named altlegal upon starting the server.

4. Run `node server.js` or `nodemon server.js`

5. Visit localhost:3001 to start the app!

###Note: Speeds may vary, but the application definitely works


