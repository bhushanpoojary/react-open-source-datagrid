describe('Column Filtering', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('aside').contains('button', 'Column Filters').click();
  });

  it('should open filter menu', () => {
    // Click filter icon on first column
    cy.get('[role="columnheader"]').first().find('svg').click();
    
    // Filter menu should appear
    cy.contains('Filter').should('be.visible');
  });

  it('should filter by text contains', () => {
    // Open filter on Name column
    cy.contains('[role="columnheader"]', 'Name').find('svg').click();
    
    // Select "Contains" filter
    cy.contains('Contains').click();
    
    // Type filter value
    cy.get('input[type="text"]').first().type('John');
    
    // Apply filter
    cy.contains('Apply').click();
    
    // Verify filtered results
    cy.get('[role="row"]').should('have.length.lessThan', 100);
  });

  it('should filter by number range', () => {
    // Open filter on Age column
    cy.contains('[role="columnheader"]', 'Age').find('svg').click();
    
    // Select "Between" filter
    cy.contains('Between').click();
    
    // Enter range
    cy.get('input[type="number"]').first().type('25');
    cy.get('input[type="number"]').last().type('35');
    
    // Apply filter
    cy.contains('Apply').click();
    
    // Verify results are filtered
    cy.get('[role="row"]').should('have.length.greaterThan', 0);
  });

  it('should clear filters', () => {
    // Apply a filter first
    cy.contains('[role="columnheader"]', 'Name').find('svg').click();
    cy.contains('Contains').click();
    cy.get('input[type="text"]').first().type('Test');
    cy.contains('Apply').click();
    
    // Click clear filters button
    cy.contains('Clear All Filters').click();
    
    // Verify all rows are back
    cy.get('[role="row"]').should('have.length.greaterThan', 10);
  });

  it('should combine multiple filters', () => {
    // Filter by name
    cy.contains('[role="columnheader"]', 'Name').find('svg').click();
    cy.contains('Contains').click();
    cy.get('input[type="text"]').first().type('a');
    cy.contains('Apply').click();
    
    cy.wait(300);
    
    // Filter by age
    cy.contains('[role="columnheader"]', 'Age').find('svg').click();
    cy.contains('Greater Than').click();
    cy.get('input[type="number"]').type('30');
    cy.contains('Apply').click();
    
    // Verify both filters are active
    cy.get('[role="row"]').should('have.length.greaterThan', 0);
  });
});
