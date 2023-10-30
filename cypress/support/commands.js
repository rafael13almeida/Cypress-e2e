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

const anexarArquivoManipulado = () => {
  cy.get('#file').selectFile('cypress/fixtures/example.json')
}

Cypress.Commands.add('criarNota', (nota, anexaArquivo = false) => {

  cy.visit('/notes/new')
  cy.get('#content').type(nota)

  if(anexaArquivo) {
    anexarArquivoManipulado()
  }

  cy.contains('button', 'Create').click()
  cy.contains('.list-group-item', nota).should('be.visible')
})

Cypress.Commands.add('editarNota', (nota, novaNota, anexaArquivo = false) => {
  cy.intercept('GET', '**/notes/**').as('getNote')

  cy.contains('.list-group-item', nota).click()
  cy.wait('@getNote')

  cy.get('#content')
    .as('contentField')
    .clear()
  cy.get('@contentField')
    .type(novaNota)

  if(anexaArquivo) {
    anexarArquivoManipulado()
  }

  cy.contains('button', 'Save').click()

  cy.contains('.list-group-item', nota).should('not.exist')
  cy.contains('.list-group-item', novaNota).should('be.visible')

})

Cypress.Commands.add('deletaNota', nota => {
  cy.contains('.list-group-item', nota).click()
  cy.contains('button', 'Delete').click()

  cy.get('.list-group-item')
    .its('length')
    .should('be.at.least', 1)
  cy.contains('.list-group-item', nota)
    .should('not.exist')
})

Cypress.Commands.add('enviarFormPagamento', () => {
  cy.visit('/settings')
  cy.get('#storage').type('1')
  cy.get('#name').type('Mary Doe')
  cy.iframe('.card-field iframe')
    .as('iframe')
    .find('[name="cardnumber"]')
    .type('4242424242424242')
  cy.get('@iframe')
    .find('[name="exp-date"]')
    .type('1271')
  cy.get('@iframe')
    .find('[name="cvc"]')
    .type('123')
  cy.get('@iframe')
    .find('[name="postal"]')
    .type('12345')
  cy.contains('button', 'Purchase').click()
})
