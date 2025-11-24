describe('Tree Data', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('aside').contains('button', 'Tree Data').click();
  });

  it('should render tree structure', () => {
    cy.contains('Tree Data Demo').should('be.visible');
    cy.get('[data-testid="data-grid"]').should('be.visible');
  });

  it('should expand/collapse tree nodes', () => {
    // Find first expandable row
    cy.get('[data-tree-toggle]').first().then(($toggle) => {
      // Click to expand
      cy.wrap($toggle).click();
      
      // Wait for animation
      cy.wait(300);
      
      // Verify child rows appear
      cy.get('[role="row"]').should('have.length.greaterThan', 5);
      
      // Click to collapse
      cy.wrap($toggle).click();
      cy.wait(300);
    });
  });

  it('should show correct indentation levels', () => {
    // Expand root node
    cy.get('[data-tree-toggle]').first().click();
    cy.wait(300);
    
    // Check indentation on child rows
    cy.get('[role="row"]').eq(2).find('[data-tree-level]').should('exist');
  });

  it('should expand all nodes', () => {
    // Click expand all button
    cy.contains('Expand All').click();
    cy.wait(500);
    
    // Verify more rows are visible
    cy.get('[role="row"]').should('have.length.greaterThan', 20);
  });

  it('should collapse all nodes', () => {
    // First expand all
    cy.contains('Expand All').click();
    cy.wait(500);
    
    // Then collapse all
    cy.contains('Collapse All').click();
    cy.wait(500);
    
    // Verify fewer rows visible
    cy.get('[role="row"]').should('have.length.lessThan', 10);
  });
});
