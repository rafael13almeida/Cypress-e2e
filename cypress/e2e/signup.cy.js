import { faker } from '@faker-js/faker/locale/en'

describe('Sign up', () => {
  const email = `${faker.datatype.uuid()}@${Cypress.env('MAILOSAUR_SERVER_ID')}.mailosaur.net`
  const senha = Cypress.env('USER_PASSWORD')

  it('se inscreva com sucesso usando o código de confirmação enviado por e-mail', () => {
    cy.verificaEmail(email, senha)

    cy.contains('h1', 'Your Notes').should('be.visible')
    cy.contains('a', 'Create a new note').should('be.visible')
  })
})
