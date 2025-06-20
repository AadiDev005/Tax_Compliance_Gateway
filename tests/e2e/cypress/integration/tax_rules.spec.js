describe('Tax Rules Endpoint', () => {
  it('should return 5 tax rules', () => {
    cy.request('GET', '/tax-rules').then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.data).to.have.length(5);
      expect(response.body.meta.total).to.eq(5);
      expect(response.body.data[0].rule_type).to.eq('IVA');
    });
  });
});
