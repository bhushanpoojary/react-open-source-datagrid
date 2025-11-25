describe('Market Data Mode', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('aside').contains('button', 'Market Data').click();
  });

  it('should render market data demo', () => {
    cy.contains('Market Data').should('be.visible');
    cy.get('[data-testid="data-grid"]').should('be.visible');
  });

  it('should display grid with data', () => {
    cy.get('[role="row"]').should('have.length.greaterThan', 1);
  });

  it('should have column headers', () => {
    cy.get('[role="columnheader"]').should('have.length.greaterThan', 0);
  });

  it('should render cells with data', () => {
    // Verify cells exist
    cy.get('[role="row"]').eq(1).find('[role="cell"]').should('exist');
  });

  it('should maintain grid visibility', () => {
    // Grid should remain visible and functional
    cy.get('[data-testid="data-grid"]').should('be.visible');
    cy.get('[role="row"]').should('have.length.greaterThan', 0);
  });
});
