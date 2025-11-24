/// <reference types="cypress" />

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to select a menu item in the app
       * @example cy.selectMenuItem('virtual')
       */
      selectMenuItem(menuId: string): Chainable<void>;
      
      /**
       * Custom command to wait for DataGrid to render
       * @example cy.waitForGrid()
       */
      waitForGrid(): Chainable<void>;
      
      /**
       * Custom command to get grid rows
       * @example cy.getGridRows()
       */
      getGridRows(): Chainable<JQuery<HTMLElement>>;
      
      /**
       * Custom command to scroll grid to position
       * @example cy.scrollGrid(1000)
       */
      scrollGrid(scrollTop: number): Chainable<void>;
    }
  }
}

Cypress.Commands.add('selectMenuItem', (menuId: string) => {
  cy.get(`[data-testid="menu-item-${menuId}"]`).click();
});

Cypress.Commands.add('waitForGrid', () => {
  cy.get('[data-testid="data-grid"]', { timeout: 10000 }).should('be.visible');
});

Cypress.Commands.add('getGridRows', () => {
  return cy.get('[data-testid="data-grid"] [role="row"]');
});

Cypress.Commands.add('scrollGrid', (scrollTop: number) => {
  cy.get('[data-testid="data-grid"]').scrollTo(0, scrollTop);
});

export {};
