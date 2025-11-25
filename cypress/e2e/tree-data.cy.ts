describe('Tree Data', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('aside').contains('button', 'Tree Data').click();
  });

  it('should render tree data demo', () => {
    cy.contains('Tree Data').should('be.visible');
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
