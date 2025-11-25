describe('Market Data Mode', () => {
  beforeEach(() => {
    cy.visit('/demo/market-data');
    cy.contains('Live Market Data', { timeout: 10000 }).should('exist');
  });

  it('should render market data demo', () => {
    cy.contains('Live Market Data').should('be.visible');
    cy.get('[data-testid="data-grid"]').should('be.visible');
  });

  it('should display grid with data', () => {
    // Market data grid uses custom classes, not ARIA roles
    cy.get('.market-grid-row').should('have.length.greaterThan', 0);
  });

  it('should have column headers', () => {
    cy.get('.market-grid-header-cell').should('have.length.greaterThan', 0);
  });

  it('should render cells with data', () => {
    // Verify cells exist
    cy.get('.market-grid-cell').should('exist');
  });

  it('should maintain grid visibility', () => {
    // Grid should remain visible and functional
    cy.get('[data-testid="data-grid"]').should('be.visible');
    cy.get('.market-grid-row').should('have.length.greaterThan', 0);
  });
});
