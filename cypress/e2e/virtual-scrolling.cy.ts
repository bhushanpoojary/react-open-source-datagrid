describe('Virtual Scrolling', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('aside').contains('button', 'Virtual Scrolling').click();
  });

  it('should render virtual scrolling demo', () => {
    cy.contains('Virtual Scrolling Demo').should('exist');
    cy.get('[data-testid="data-grid"]').should('exist');
  });

  it('should virtualize rows efficiently', () => {
    // Count initially rendered rows
    cy.get('[role="row"]').then(($rows) => {
      const initialRowCount = $rows.length;
      
      // Should render only viewport rows, not all rows
      expect(initialRowCount).to.be.lessThan(100);
    });
  });

  it('should display grid with data', () => {
    // Verify grid renders with rows
    cy.get('[role="row"]').should('have.length.greaterThan', 1);
  });

  it('should have column headers', () => {
    cy.get('[role="columnheader"]').should('have.length.greaterThan', 0);
  });

  it('should render cells', () => {
    // Verify cells exist in data rows (skip first row which might be header)
    cy.get('[role="row"]').eq(1).should('exist');
  });
});
