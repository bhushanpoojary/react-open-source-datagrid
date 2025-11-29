describe('Tree Data', () => {
  beforeEach(() => {
    cy.visit('/demo/tree-data');
    cy.get('[data-testid="data-grid"]', { timeout: 10000 }).should('exist');
  });

  it('should render tree data demo', () => {
    cy.contains('h1', 'Tree Data').should('be.visible');
    cy.get('[data-testid="data-grid"]').should('be.visible');
  });

  it('should display grid with data', () => {
    cy.get('[role="row"]').should('have.length.greaterThan', 0);
  });

  it('should have column headers', () => {
    cy.get('[role="columnheader"]').should('have.length.greaterThan', 0);
  });

  it('should render data rows', () => {
    // Verify rows exist
    cy.get('[role="row"]').should('exist');
    cy.get('[role="row"]').should('have.length.greaterThan', 0);
  });

  it('should maintain grid functionality', () => {
    // Grid should remain visible and functional
    cy.get('[data-testid="data-grid"]').should('be.visible');
    cy.get('[role="row"]').first().should('exist');
  });
});
