describe('PakWheels Advanced Data Driven Tests', () => {
  beforeEach(() => {
    cy.visit('https://example.cypress.io')
    cy.buildPakWheelsMockApp()
  })

  it('should run searches from JSON fixture data', () => {
    cy.fixture('searchData').then((cars) => {
      cars.forEach((car) => {
        cy.searchCar(car.keyword)
        cy.contains(car.expected).should('be.visible')
      })
    })
  })

  it('should apply filters using fixture data', () => {
    cy.fixture('searchData').then((cars) => {
      const car = cars[0]

      cy.get('#searchBox').type(car.keyword)
      cy.applyCityFilter(car.city)
      cy.applyPriceFilter(car.minPrice, car.maxPrice)
      cy.get('#searchBtn').click()

      cy.contains(car.expected).should('be.visible')
      cy.contains(car.city).should('be.visible')
    })
  })

  it('should use custom command for token based login', () => {
    cy.loginByToken()

    cy.get('#email').type('test@pakwheels.local')
    cy.get('#password').type('password123')
    cy.get('#loginBtn').click()

    cy.contains('Login successful').should('be.visible')
  })

  it('should validate negative search scenario', () => {
    cy.searchCar('Invalid Car 99999')
    cy.contains('No cars found').should('be.visible')
  })
})