Cypress.Commands.add('verificaEmail', (email, password) => {
  cy.intercept('GET', '**/notes').as('getNotes')
  cy.visit('/signup')
  cy.get('#email').type(email)
  cy.get('#password').type(password, { log: false })
  cy.get('#confirmPassword').type(password, { log: false })
  cy.contains('button', 'Signup').click()
  cy.get('#confirmationCode').should('be.visible')
  cy.mailosaurGetMessage(Cypress.env('MAILOSAUR_SERVER_ID'), {
    sentTo: email
  }).then(codigo => {
    const codigoConfirmacao = codigo.html.body.match(/\d{6}/)[0]
    cy.get('#confirmationCode').type(`${codigoConfirmacao}{enter}`)
    cy.wait('@getNotes')
  })
})
