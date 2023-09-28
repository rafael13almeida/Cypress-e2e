import { faker } from '@faker-js/faker/locale/pt_BR'

describe('crud', () => {
  it('CRUDs a note', () => {
    const descricaoNota = faker.lorem.words(4)
    let anexaArquivo = false


    cy.intercept('GET', '**/notes').as('getNotes')
    cy.intercept('GET', '**/notes/**').as('getNote')
    cy.sessionLogin()

    cy.visit('/notes/new')
    cy.get('#content').type(descricaoNota)

    if (anexaArquivo) {
      cy.get('#file').selectFile('cypress/fixtures/example.json')
    }

    cy.contains('button', 'Create').click()

    cy.wait('@getNotes')
    cy.contains('.list-group-item', descricaoNota)
      .should('be.visible')
      .click()
    cy.wait('@getNote')

    const editarDescricaoNota = faker.lorem.words(3)

    cy.get('#content')
      .as('contentField')
      .clear()
    cy.get('@contentField')
      .type(editarDescricaoNota)

    anexaArquivo = true

    if(anexaArquivo) {
      cy.get('#file').selectFile('cypress/fixtures/example.json')
    }

    cy.contains('button', 'Save').click()
    cy.wait('@getNotes')

    cy.contains('.list-group-item', descricaoNota).should('not.exist')
    cy.contains('.list-group-item', editarDescricaoNota)
      .should('be.visible')
      .click()
    cy.wait('@getNote')
    cy.contains('button', 'Delete').click()
    cy.wait('@getNotes')

    cy.get('.list-group-item')
      .its('length')
      .should('be.at.least', 1)
    cy.contains('.list-group-item', editarDescricaoNota)
      .should('not.exist')
  })
})
