# Cypress End-to-End Testing for Sauce Demo Checkout Flow

## Project Overview
This project automates the checkout flow for the Sauce Demo website using Cypress. The test suite covers multiple scenarios, including login validation, item sorting, adding/removing products from the cart, and completing the checkout process.

## Prerequisites
Ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (Latest LTS version recommended)
- [Yarn](https://yarnpkg.com/) (v4.5.2 as specified in package.json)

## Installation
Clone the repository and install dependencies:
```sh
# Clone the repository
git clone https://github.com/AfefBHA/Cata_M-C.git

# Navigate to the project directory
cd saucedemo

# Install dependencies
yarn install
```

## Cypress Installation
If Cypress is not installed, you can install it manually:
```sh
yarn add cypress cypress-slow-down --dev
```

## Running Tests
You can run Cypress tests using the following commands:

### Run Tests in CLI Mode
```sh
yarn cy:run
```
This will execute all test cases in a headless browser.

### Open Cypress Test Runner
```sh
yarn cy:open
```
This will open the Cypress UI, allowing you to run and debug tests interactively.

## Test Scenarios
The Cypress test suite is located in the `cypress/e2e/` directory and covers the following test cases:

### 1. Login Validation
- **Empty Username**: Verifies an error message appears when logging in without a username.
- **Empty Password**: Verifies an error message appears when logging in without a password.
- **Invalid Credentials**: Ensures login fails with incorrect username/password.

### 2. Product Sorting
- **Sort by Lowest Price**: Ensures products are sorted from lowest to highest price.
- **Sort by Highest Price**: Ensures products are sorted from highest to lowest price.

### 3. Shopping Cart Functionality
- **Add One Item to Cart**: Adds a product and verifies the cart count.
- **Add Multiple Items**: Adds multiple products and verifies the total count.
- **Empty the Cart**: Removes all items and confirms an empty cart.

### 4. Checkout Process
- **Checkout with Empty Cart**: Ensures checkout cannot proceed if the cart is empty.
- **Successful Checkout**: Tests the full checkout process with valid user information.
- **Checkout with Missing Fields**: Ensures error messages appear when fields are left blank.

## Cypress Test Structure

```plaintext
├── cypress/
│   ├── e2e/
│   │   ├── saucedemo.spec.cy.js  # Main test script
│   ├── support/
│   │   ├── commands.js  # Custom Cypress commands (if needed)
├── package.json   # Project dependencies & scripts
├── README.md      # Project documentation
```

## Cypress Configuration
The Cypress configuration is handled automatically, but you can customize it in `cypress.config.js` if needed.

### Example Configuration:
```js
const { defineConfig } = require('cypress')
module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://www.saucedemo.com',
    setupNodeEvents(on, config) {
      // Add custom event handlers here
    },
  },
})
```

## Dependencies
This project uses the following dependencies:
```json
{
  "devDependencies": {
    "cypress": "^14.0.1",
    "cypress-slow-down": "^1.3.1"
  }
}
```
- `cypress`: The main testing framework.
- `cypress-slow-down`: Adds delay between Cypress commands to improve visibility.

## Troubleshooting
### Common Issues & Fixes

- **Cypress is not found**
  ```sh
  yarn add cypress --dev
  ```

- **Tests are failing due to timeouts**
  Increase default timeout in `cypress.config.js`:
  ```js
  defaultCommandTimeout: 10000 // Increases timeout to 10 seconds
  ```

- **UI Elements not found**
  Check if element selectors have changed and update test scripts accordingly.

## Contribution Guidelines
- Fork the repository and create a feature branch.
- Commit your changes with clear commit messages.
- Submit a pull request for review.

## License
This project is open-source and available under the MIT License.

---

### 🚀 Happy Testing!

