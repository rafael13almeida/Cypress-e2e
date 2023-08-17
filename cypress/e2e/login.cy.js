describe('Login', () => {
//   const email = Cypress.env('USER_EMAIL')
//   const senha = Cypress.env('USER_PASSWORD')
  it('login com sucesso', () => {
    cy.login()
    cy.contains('a', 'Create a new note').should('be.visible')
  })
})
