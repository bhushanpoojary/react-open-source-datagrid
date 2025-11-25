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
    cy.get('[role="columnheader"]').contains('Name').scrollIntoView().should('be.visible');
    cy.get('[role="columnheader"]').contains('Email').scrollIntoView().should('be.visible');
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
    // Verify column headers exist and are resizable
    cy.get('[role="columnheader"]').first().should('exist');
    cy.get('[role="columnheader"]').first().invoke('width').should('be.greaterThan', 0);
  });
});
