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

Cypress.Commands.add('guiLogin', (
  email = Cypress.env('USER_EMAIL'),
  senha = Cypress.env('USER_PASSWORD')
) => {
  cy.intercept('GET', '**/notes').as('getNotes')
  cy.visit('/login')
  cy.get('#email').type(email)
  cy.get('#password').type(senha, { log: false })
  cy.contains('button', 'Login').click()
  cy.wait('@getNotes')
  cy.contains('h1', 'Your Notes').should('be.visible')
})

Cypress.Commands.add('sessionLogin', (
  email = Cypress.env('USER_EMAIL'),
  senha = Cypress.env('USER_PASSWORD')
) => {
  const login = () => cy.guiLogin(email, senha)
  cy.session(email, login)
})
