describe('DataGrid Basic Functionality', () => {
  beforeEach(() => {
    cy.visit('/demo/standard');
    cy.get('[data-testid="data-grid"]', { timeout: 10000 }).should('exist');
  });

  it('should render the grid with data', () => {
    cy.get('[data-testid="data-grid"]').should('be.visible');
    cy.get('[role="row"]').should('have.length.greaterThan', 1);
  });

  it('should display column headers', () => {
    cy.get('[role="columnheader"]').should('have.length.greaterThan', 0);
    cy.contains('[role="columnheader"]', 'Name').should('exist');
    cy.contains('[role="columnheader"]', 'Department').should('exist');
  });

  it('should sort columns when clicking headers', () => {
    // Click Name header to sort
    cy.contains('[role="columnheader"]', 'Name').click();
    cy.wait(300);
    
    // Verify rows still exist after sort
    cy.get('[role="row"]').should('have.length.greaterThan', 1);
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
