describe('Navigation', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should load the home page', () => {
    cy.contains('React DataGrid').should('be.visible');
  });

  it('should navigate between demo pages', () => {
    // Check initial state
    cy.contains('A powerful, enterprise-grade data grid').should('be.visible');
    
    // Navigate to Virtual Scroll demo (click the sidebar button)
    cy.get('aside').contains('button', 'Virtual Scrolling').click();
    cy.contains('Virtual Scrolling Demo').should('be.visible');
    
    // Navigate to Cell Renderers demo
    cy.get('aside').contains('button', 'Cell Renderers').click();
    cy.contains('Cell Renderers Demo').should('be.visible');
  });

  it('should search for features', () => {
    cy.get('input[placeholder*="Search"]').type('virtual');
    cy.get('aside').contains('button', 'Virtual Scrolling').should('be.visible');
    cy.get('aside').contains('button', 'Infinite Scroll').should('be.visible');
  });

  it('should expand/collapse menu categories', () => {
    const category = 'Data Features';
    
    // Find and click category header
    cy.contains(category).parent().within(() => {
      cy.get('svg').first().click();
    });
    
    // Verify items are hidden
    cy.contains('Tree Data').should('not.be.visible');
  });
});
