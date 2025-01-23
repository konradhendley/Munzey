import { cy } from 'cypress';
describe('Home Page', () => {
    it('should load the home page', () => {
      cy.visit('/')  // Assuming your app runs locally on the root path
      cy.contains('Welcome to Folio')
      cy.get('button').contains('Login')
      cy.get('button').contains('Signup')
    })
  })