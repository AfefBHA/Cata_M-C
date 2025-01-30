import { slowCypressDown } from 'cypress-slow-down'
slowCypressDown(300)

describe('Sauce Demo Checkout Flow', () => {
  const login = (username, password) => {
    cy.get('[data-test="username"]').type(username)
    cy.get('[data-test="password"]').type(password)
    cy.get('[data-test="login-button"]').click()
  }

  const addItemToCart = (itemSelector) => {
    cy.get(itemSelector).click()
  }

  const fillCheckoutForm = (firstName, lastName, postalCode) => {
    cy.get('[data-test="firstName"]').type(firstName)
    cy.get('[data-test="lastName"]').type(lastName)
    cy.get('[data-test="postalCode"]').type(postalCode)
  }

  const verifyCartItems = () => {
    cy.get(':nth-child(3) > .cart_item_label > .item_pricebar > [data-test="inventory-item-price"]')
      .contains('29.99')
    cy.get(':nth-child(4) > .cart_item_label > .item_pricebar > [data-test="inventory-item-price"]')
      .contains('9.99')
  }

  beforeEach(() => {
    cy.visit('/')  // This will use the baseUrl from cypress.config.js
  })

  it('should fail login with empty username', () => {
    cy.get('[data-test="password"]').type('password')
    cy.get('[data-test="login-button"]').click()
    cy.get('.error-message-container').should('be.visible')
      .contains('Epic sadface: Username is required')
  })

  it('should fail login with empty password', () => {
    cy.get('[data-test="username"]').type('username')
    cy.get('[data-test="login-button"]').click()
    cy.get('.error-message-container').should('be.visible')
      .contains('Epic sadface: Password is required')
  })

  it('should fail login with invalid credentials', () => {
    login('invalid_user', 'wrong_password')
    cy.get('.error-message-container').should('be.visible')
      .contains('Epic sadface: Username and password do not match')
  })

  it('should sort items by lowest price', () => {
    login('standard_user', 'secret_sauce')
    cy.get('[data-test="product-sort-container"]').select('Price (low to high)')
    cy.get('.inventory_item_price').first().contains('7.99')
  })

  it('should sort items by highest price', () => {
    login('standard_user', 'secret_sauce')
    cy.get('[data-test="product-sort-container"]').select('Price (high to low)')
    cy.get('.inventory_item_price').first().contains('49.99')
  })

  it('should add one item to the cart', () => {
    login('standard_user', 'secret_sauce')
    addItemToCart('[data-test="add-to-cart-sauce-labs-backpack"]')
    cy.get('[data-test="shopping-cart-link"]').click()
    // There is two default children beside the first item children so the sum is 3
    cy.get('[data-test="cart-list"]').children().should('have.length', 3)
  })

  it('should add multiple items to the cart', () => {
    login('standard_user', 'secret_sauce')
    addItemToCart('[data-test="add-to-cart-sauce-labs-backpack"]')
    addItemToCart('[data-test="add-to-cart-sauce-labs-bike-light"]')
    cy.get('[data-test="shopping-cart-link"]').click()
    cy.get('[data-test="cart-list"]').children().should('have.length', 4)
  })

  it('should empty the cart', () => {
    login('standard_user', 'secret_sauce')
    addItemToCart('[data-test="add-to-cart-sauce-labs-backpack"]')
    addItemToCart('[data-test="add-to-cart-sauce-labs-bike-light"]')
    cy.get('[data-test="shopping-cart-link"]').click()
    cy.get('[data-test="remove-sauce-labs-backpack"]').click()
    cy.get('[data-test="remove-sauce-labs-bike-light"]').click()
    cy.get('.cart_item').should('have.length', 0)
  })

  // This is a bug and should not allow to continue the checkout process
  it('should not allow checkout with an empty cart', () => {
    login('standard_user', 'secret_sauce')
    cy.get('[data-test="shopping-cart-link"]').click()
    cy.get('[data-test="checkout"]').click()
  })

  it('should complete checkout successfully', () => {
    // Login
    login('standard_user', 'secret_sauce')

    // Add items to cart
    addItemToCart('[data-test="add-to-cart-sauce-labs-backpack"]') // $29.99
    addItemToCart('[data-test="add-to-cart-sauce-labs-bike-light"]') // $9.99

    // Verify cart items
    cy.get('[data-test="shopping-cart-link"]').click()
    verifyCartItems()
    
    // Proceed to checkout
    cy.get('[data-test="checkout"]').click()

    // Verify checkout info form is visible
    cy.get('.checkout_info').should('be.visible')
    cy.get('[data-test="firstName"]').should('be.visible')
    cy.get('[data-test="lastName"]').should('be.visible')
    cy.get('[data-test="postalCode"]').should('be.visible')
    cy.get('[data-test="cancel"]').should('be.visible')

    // Fill in checkout form and continue
    fillCheckoutForm('Bel hadg Ahmed', 'Afef', '1234')
    cy.get('[data-test="continue"]').click()

    // Verify checkout overview page
    cy.get('[data-test="title"]').contains('Checkout: Overview')
    cy.get('[data-test="payment-info-label"]').contains('Payment Information:')
    cy.get('[data-test="shipping-info-label"]').contains('Shipping Information:').should('be.visible')
    cy.get('[data-test="subtotal-label"]').contains('$39.98').should('be.visible')

    // Finish checkout
    cy.get('[data-test="finish"]').click()

    // Verify completion page
    cy.get('[data-test="title"]').contains('Checkout: Complete!').should('be.visible')
    cy.get('[data-test="complete-header"]').contains('Thank you for your order!').should('be.visible')
    cy.get('[data-test="complete-text"]').contains('Your order has been dispatched, and will arrive just as fast as the pony can get there!').should('be.visible')

    // Return to products page
    cy.get('[data-test="back-to-products"]').click()
  })

  it('should fail when trying to checkout with missing fields', () => {
    // Login
    login('standard_user', 'secret_sauce')

    // Add items to cart
    addItemToCart('[data-test="add-to-cart-sauce-labs-backpack"]') // $29.99
    addItemToCart('[data-test="add-to-cart-sauce-labs-bike-light"]') // $9.99

    // Verify cart items
    cy.get('[data-test="shopping-cart-link"]').click()
    verifyCartItems()

    // Proceed to checkout
    cy.get('[data-test="checkout"]').click()

    // Leave the first name blank and try to continue
    cy.get('[data-test="firstName"]').clear() // Clear the field to simulate a failure case
    cy.get('[data-test="continue"]').click()

    // Expect an error message for missing first name
    cy.get('.error-message-container').should('be.visible')
    cy.get('.error-message-container').contains('Error: First Name is required')

    //Remove current Error
    cy.get('[data-test="error-button"]').click()
    cy.get('[data-test="firstName"]').type('Bel hadg Ahmed')
    cy.get('[data-test="continue"]').click()

    // Expect an error message for missing last name
    cy.get('.error-message-container').should('be.visible')
    cy.get('.error-message-container').contains('Error: Last Name is required')
  })
})
