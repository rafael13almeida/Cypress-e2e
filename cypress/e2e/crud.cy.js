import { faker } from '@faker-js/faker/locale/pt_BR'

describe('crud', () => {
  it('CRUDs a note', () => {
    const descricaoNota = faker.lorem.words(4)

    cy.intercept('GET', '**/notes').as('getNotes')
    cy.sessionLogin()

    cy.criarNota(descricaoNota)
    cy.wait('@getNotes')

    const editarDescricaoNota = faker.lorem.words(3)
    const anexaArquivo = true

    cy.editarNota(descricaoNota, editarDescricaoNota, anexaArquivo)
    cy.wait('@getNotes')

    cy.deletaNota(editarDescricaoNota)
    cy.wait('@getNotes')
  })

})
