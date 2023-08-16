import { faker } from '@faker-js/faker/locale/en'

describe('Sign up', () => {
  it('se inscreva com sucesso usando o código de confirmação enviado por e-mail', () => {
    const email = `${faker.datatype.uuid()}@${Cypress.env('MAILOSAUR_SERVER_ID')}.mailosaur.net`
    const senha = Cypress.env('USER_PASSWORD')

    cy.intercept('GET', '**/notes').as('getNotes')
    cy.visit('/signup')
    cy.get('#email').type(email)
    cy.get('#password').type(senha, { log: false })
    cy.get('#confirmPassword').type(senha, { log: false })
    cy.contains('button', 'Signup').click()
    cy.get('#confirmationCode').should('be.visible')

    cy.mailosaurGetMessage(Cypress.env('MAILOSAUR_SERVER_ID'), {
      sentTo: email
    }).then(codigo => {
      const codigoConfirmacao = codigo.html.body.match(/\d{6}/)[0]
      cy.get('#confirmationCode').type(`${codigoConfirmacao}{enter}`)

      cy.wait('@getNotes')
      cy.contains('h1', 'Your Notes').should('be.visible')
    })
  })
})
