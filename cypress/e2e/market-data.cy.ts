describe('Market Data Mode', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('aside').contains('button', 'Market Data').click();
  });

  it('should render market data demo', () => {
    cy.contains('Live Market Data').should('be.visible');
    cy.get('[data-testid="data-grid"]').should('be.visible');
  });

  it('should start/pause live updates', () => {
    // Initially updates should be active
    cy.contains('Pause Updates').should('be.visible');
    
    // Click to pause
    cy.contains('Pause Updates').click();
    cy.contains('Resume Updates').should('be.visible');
    
    // Click to resume
    cy.contains('Resume Updates').click();
    cy.contains('Pause Updates').should('be.visible');
  });

  it('should show cell flashing on updates', () => {
    // Wait for some updates
    cy.wait(2000);
    
    // Check for flash classes (cells should have flash styling)
    cy.get('[data-testid="data-grid"]').find('[data-flash]').should('exist');
  });

  it('should toggle density mode', () => {
    // Click density toggle
    cy.contains('Density Mode').click();
    cy.wait(500);
    
    // Grid should still be visible
    cy.get('[data-testid="data-grid"]').should('be.visible');
  });

  it('should update values in real-time', () => {
    // Get initial value from first row
    cy.get('[role="row"]').eq(1).find('[role="cell"]').eq(2).invoke('text').then((initialPrice) => {
      // Wait for updates
      cy.wait(3000);
      
      // Value should have changed
      cy.get('[role="row"]').eq(1).find('[role="cell"]').eq(2).invoke('text').should('not.equal', initialPrice);
    });
  });
});
