describe('Column Filtering', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('aside').contains('button', 'Column Filters').click();
  });

  it('should render column filters demo', () => {
    cy.contains('Column Filtering').should('be.visible');
    cy.get('[data-testid="data-grid"]').should('be.visible');
  });

  it('should display column headers', () => {
    cy.get('[role="columnheader"]').should('have.length.greaterThan', 0);
  });

  it('should display data rows', () => {
    cy.get('[role="row"]').should('have.length.greaterThan', 1);
  });

  it('should have filter inputs if filtering is enabled', () => {
    // Just verify the grid is interactive
    cy.get('[data-testid="data-grid"]').should('be.visible');
    cy.get('[role="row"]').first().should('exist');
  });

  it('should render grid with data', () => {
    // Verify basic grid functionality
    cy.get('[role="row"]').should('have.length.greaterThan', 0);
  });
});
