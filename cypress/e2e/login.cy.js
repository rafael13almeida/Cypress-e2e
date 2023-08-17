describe('Login', () => {
  it('login com sucesso', () => {
    cy.login()
    cy.contains('a', 'Create a new note').should('be.visible')
  })
})
