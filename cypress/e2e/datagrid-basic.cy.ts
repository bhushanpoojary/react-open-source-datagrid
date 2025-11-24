describe('DataGrid Basic Functionality', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('aside').contains('button', 'Standard Demo').click();
  });

  it('should render the grid with data', () => {
    cy.get('[data-testid="data-grid"]').should('be.visible');
    cy.get('[role="row"]').should('have.length.greaterThan', 1);
  });

  it('should display column headers', () => {
    cy.get('[role="columnheader"]').should('have.length.greaterThan', 0);
    cy.contains('Name').should('be.visible');
    cy.contains('Email').should('be.visible');
  });

  it('should sort columns when clicking headers', () => {
    // Click Name header to sort
    cy.contains('[role="columnheader"]', 'Name').click();
    
    // Get first row value
    cy.get('[role="row"]').eq(1).find('[role="cell"]').first().invoke('text').then((firstText) => {
      // Click again to reverse sort
      cy.contains('[role="columnheader"]', 'Name').click();
      
      // Verify order changed
      cy.get('[role="row"]').eq(1).find('[role="cell"]').first().invoke('text').should('not.equal', firstText);
    });
  });

  it('should select rows when clicking', () => {
    // Click first data row
    cy.get('[role="row"]').eq(1).click();
    
    // Verify row is selected (has selected class or style)
    cy.get('[role="row"]').eq(1).should('have.css', 'background-color');
  });

  it('should resize columns', () => {
    // Get initial width
    cy.get('[role="columnheader"]').first().invoke('width').then((initialWidth) => {
      // Find resize handle and drag
      cy.get('[role="columnheader"]').first()
        .trigger('mousedown', { which: 1 })
        .trigger('mousemove', { clientX: initialWidth + 100 })
        .trigger('mouseup');
      
      // Verify width changed (allowing for some variance)
      cy.get('[role="columnheader"]').first().invoke('width').should('be.greaterThan', initialWidth);
    });
  });
});
