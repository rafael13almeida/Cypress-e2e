import { faker } from '@faker-js/faker/locale/pt_BR'

describe('crud', () => {

  beforeEach(() => {
    cy.intercept('GET', '**/notes').as('getNotes')
    cy.sessionLogin()
  })

  it('CRUDs de notas', () => {
    const descricaoNota = faker.lorem.words(4)

    cy.criarNota(descricaoNota)
    cy.wait('@getNotes')

    const editarDescricaoNota = faker.lorem.words(3)
    const anexaArquivo = true

    cy.editarNota(descricaoNota, editarDescricaoNota, anexaArquivo)
    cy.wait('@getNotes')

    cy.deletaNota(editarDescricaoNota)
    cy.wait('@getNotes')
  })

  it('preencher o form e enviar com sucesso', () => {
    cy.intercept('POST', '**/prod/billing').as('reqPagamento')

    cy.enviarFormPagamento()

    cy.wait('@getNotes')
    cy.wait('@reqPagamento')
      .its('state')
      .should('be.equal', 'Complete')
  })

  it('realizar o logout no sistema', () => {
    cy.visit('/')
    cy.wait('@getNotes')

    if (Cypress.config('viewportWidth') < Cypress.env('viewportWidthBreakpoint')) {
      cy.get('.navbar-toggle.collapsed')
        .should('be.visible')
        .click()
    }

    cy.contains('.nav a', 'Logout')
      .should('be.visible')
      .click()

    cy.get('#email')
      .should('be.visible')
  })

})
