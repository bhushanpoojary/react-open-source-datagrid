describe('Virtual Scrolling', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('aside').contains('button', 'Virtual Scrolling').click();
  });

  it('should render virtual scrolling demo', () => {
    cy.contains('Virtual Scrolling Demo').should('be.visible');
    cy.get('[data-testid="data-grid"]').should('be.visible');
  });

  it('should virtualize rows efficiently', () => {
    // Count initially rendered rows
    cy.get('[role="row"]').then(($rows) => {
      const initialRowCount = $rows.length;
      
      // Should render only viewport rows, not all rows
      expect(initialRowCount).to.be.lessThan(100);
    });
  });

  it('should load more rows on scroll', () => {
    // Get initial visible row
    cy.get('[role="row"]').first().invoke('text').then((firstRowText) => {
      // Scroll down
      cy.get('[data-testid="data-grid"]').scrollTo(0, 2000);
      cy.wait(300);
      
      // Verify different rows are visible
      cy.get('[role="row"]').first().invoke('text').should('not.equal', firstRowText);
    });
  });

  it('should maintain scroll position', () => {
    // Scroll to middle
    cy.get('[data-testid="data-grid"]').scrollTo(0, 1000);
    cy.wait(300);
    
    // Get scroll position
    cy.get('[data-testid="data-grid"]').then(($grid) => {
      const scrollTop = $grid[0].scrollTop;
      expect(scrollTop).to.be.greaterThan(900);
    });
  });

  it('should handle rapid scrolling', () => {
    // Rapid scroll events
    for (let i = 0; i < 5; i++) {
      cy.get('[data-testid="data-grid"]').scrollTo(0, i * 500);
    }
    
    // Grid should still be stable
    cy.get('[data-testid="data-grid"]').should('be.visible');
    cy.get('[role="row"]').should('have.length.greaterThan', 0);
  });
});
