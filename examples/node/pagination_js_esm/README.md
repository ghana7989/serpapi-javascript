# Node.js pagination JavaScript (ESM) example

## Usage

1. Build module

```bash
cd ../../../   # Navigate to the root folder
deno task npm
```

2. Setup environment variables

- Duplicate `.env.example` and name it `.env`.
- Replace `YOUR_API_KEY` with your SerpApi API key.

3. Install dependencies and run example

```bash
cd examples/node/pagination_js_esm
npm i
npm start
```

## Notes

- If you want to run the example without building the module, you can update
  `package.json` to depend on the published `serpapi` npm module instead:
  ```json
  {
    "type": "module",
    "dependencies": {
      "dotenv": "*",
      "serpapi": "*" // Relies on the npm module
    },
    "scripts": {
      "start": "node example.js"
    }
  }
  ```
