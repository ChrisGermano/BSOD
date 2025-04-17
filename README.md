# Personal Portfolio Website

A modern personal portfolio website built with React and Node.js.

## Project Structure

```
.
├── client/             # React frontend
│   ├── public/         # Static assets
│   └── src/            # React source files
├── server/             # Node.js backend
│   └── index.js        # Express server
├── .env               # Environment variables
├── .gitignore         # Git ignore file
├── package.json       # Project dependencies
└── README.md          # Project documentation
```

## Setup

1. Install server dependencies:
```bash
npm install
```

2. Install client dependencies:
```bash
npm run install-client
```

3. Create a `.env` file in the root directory with:
```
PORT=8069
NODE_ENV=development
```

4. Start the development server:
```bash
npm run dev
```

This will start both the React development server and the Node.js backend concurrently.

## Development

- The React frontend will run on `https://chrisgermano.dev`
- The Node.js backend will run on `https://api.chrisgermano.dev`

## Production Build

To create a production build:
```bash
npm run build
```

This will create an optimized build of the React application in the `client/build` directory. 