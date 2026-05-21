describe('Final Lab Requirement Coverage Tests', () => {
  beforeEach(() => {
    cy.visit('https://example.cypress.io')
    cy.buildPakWheelsMockApp()
  })

  it('should use environment variable style dynamic search', () => {
    const keyword = 'Honda'

    cy.get('#searchBox').type(keyword)
    cy.get('#searchBtn').click()

    cy.get('#results').should('not.be.empty')
    cy.contains('Honda Civic 2020').should('be.visible')
  })

  it('should demonstrate find, wait, and trigger Cypress commands', () => {
    cy.get('#searchBox').type('Honda')
    cy.get('#searchBtn').click()

    cy.wait(500)

    cy.get('#results')
      .find('.car-card')
      .first()
      .trigger('mouseover')
      .should('exist')
  })

  it('should use object based form submission data', () => {
    const loginUser = {
      email: 'test@pakwheels.local',
      password: 'password123',
      token: 'mock-token-123'
    }

    cy.window().then((win) => {
      win.localStorage.setItem('authToken', loginUser.token)
    })

    cy.get('#email').type(loginUser.email)
    cy.get('#password').type(loginUser.password)
    cy.get('#loginBtn').click()

    cy.contains('Login successful').should('be.visible')
  })

  it('should demonstrate multiple login credentials dataset', () => {
    const users = [
      {
        email: 'validuser@pakwheels.local',
        password: 'password123',
        token: 'mock-token-123',
        expected: 'Login successful'
      },
      {
        email: 'invaliduser@pakwheels.local',
        password: 'wrongpass',
        token: '',
        expected: 'Captcha required'
      }
    ]

    users.forEach((user) => {
      cy.window().then((win) => {
        win.localStorage.clear()

        if (user.token) {
          win.localStorage.setItem('authToken', user.token)
        }
      })

      cy.get('#email').clear().type(user.email)
      cy.get('#password').clear().type(user.password)
      cy.get('#loginBtn').click()

      cy.contains(user.expected).should('be.visible')
    })
  })
})
