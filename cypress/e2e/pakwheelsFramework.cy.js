describe('PakWheels Smart Search Automation Framework', () => {
  beforeEach(() => {
    cy.visit('https://example.cypress.io')

    cy.document().then((doc) => {
      doc.body.innerHTML = `
        <div id="app" style="font-family: Arial; padding: 30px;">
          <h1>PakWheels Smart Search</h1>
          <p>Find used cars in Pakistan</p>

          <input id="searchBox" placeholder="Car Make or Model" />
          <select id="city">
            <option value="">All Cities</option>
            <option value="Lahore">Lahore</option>
            <option value="Karachi">Karachi</option>
            <option value="Islamabad">Islamabad</option>
            <option value="Rawalpindi">Rawalpindi</option>
          </select>

          <input id="minPrice" placeholder="Min Price" />
          <input id="maxPrice" placeholder="Max Price" />

          <button id="searchBtn">Search</button>

          <div id="results"></div>

          <form id="loginForm">
            <h2>Login</h2>
            <input id="email" placeholder="Email" />
            <input id="password" placeholder="Password" type="password" />
            <button id="loginBtn" type="button">Login</button>
            <p id="loginStatus"></p>
          </form>
        </div>
      `

      const cars = [
        { title: 'Honda Civic 2020', city: 'Lahore', price: 6500000 },
        { title: 'Toyota Corolla 2021', city: 'Karachi', price: 5800000 },
        { title: 'Suzuki Alto 2022', city: 'Islamabad', price: 2800000 },
        { title: 'KIA Sportage 2021', city: 'Rawalpindi', price: 8200000 },
        { title: 'Hyundai Tucson 2022', city: 'Lahore', price: 9000000 }
      ]

      doc.getElementById('searchBtn').addEventListener('click', () => {
        const keyword = doc.getElementById('searchBox').value.toLowerCase()
        const city = doc.getElementById('city').value
        const min = Number(doc.getElementById('minPrice').value || 0)
        const max = Number(doc.getElementById('maxPrice').value || 999999999)

        const filteredCars = cars.filter((car) => {
          return (
            car.title.toLowerCase().includes(keyword) &&
            (city === '' || car.city === city) &&
            car.price >= min &&
            car.price <= max
          )
        })

        const results = doc.getElementById('results')
        results.innerHTML = ''

        if (filteredCars.length === 0) {
          results.innerHTML = '<p class="noResult">No cars found</p>'
          return
        }

        filteredCars.forEach((car) => {
          results.innerHTML += `
            <div class="car-card" style="border:1px solid #ccc; margin:10px; padding:10px;">
              <h3>${car.title}</h3>
              <p class="city">${car.city}</p>
              <p class="price">${car.price}</p>
              <button class="detailsBtn">View Details</button>
            </div>
          `
        })
      })

      doc.getElementById('loginBtn').addEventListener('click', () => {
        const token = localStorage.getItem('authToken')
        doc.getElementById('loginStatus').innerText = token ? 'Login successful' : 'Captcha required'
      })
    })
  })

  it('should load PakWheels smart search page', () => {
    cy.contains('PakWheels Smart Search').should('be.visible')
    cy.contains('Find used cars in Pakistan').should('be.visible')
    cy.get('#searchBox').should('exist')
    cy.get('#city').should('exist')
    cy.get('#searchBtn').should('be.visible')
  })

  it('should search any car keyword dynamically', () => {
    const keyword = 'Honda'

    cy.get('#searchBox').type(keyword)
    cy.get('#searchBtn').click()

    cy.get('.car-card').should('have.length', 1)
    cy.contains('Honda Civic 2020').should('be.visible')
  })

  it('should apply city and price filters', () => {
    cy.get('#searchBox').type('Honda')
    cy.get('#city').select('Lahore')
    cy.get('#minPrice').type('5000000')
    cy.get('#maxPrice').type('7000000')
    cy.get('#searchBtn').click()

    cy.get('.car-card').should('have.length', 1)
    cy.contains('Honda Civic 2020').should('be.visible')
    cy.contains('Lahore').should('be.visible')
  })

  it('should show no result message for invalid search', () => {
    cy.get('#searchBox').type('Ferrari Pakistan Cheap')
    cy.get('#searchBtn').click()

    cy.get('.noResult').should('be.visible')
    cy.contains('No cars found').should('be.visible')
  })

  it('should demonstrate token based authentication captcha bypass', () => {
    cy.window().then((win) => {
      win.localStorage.setItem('authToken', 'mock-token-123')
    })

    cy.get('#email').type('test@pakwheels.local')
    cy.get('#password').type('password123')
    cy.get('#loginBtn').click()

    cy.contains('Login successful').should('be.visible')
  })

  it('should use arrays for data driven testing', () => {
    const searchKeywords = ['Honda', 'Toyota', 'Suzuki']

    searchKeywords.forEach((keyword) => {
      cy.get('#searchBox').clear().type(keyword)
      cy.get('#searchBtn').click()
      cy.get('#results').should('not.be.empty')
    })
  })

  it('should use cy.intercept for API mocking', () => {
  cy.intercept('GET', '**/api/cars', {
    statusCode: 200,
    body: [
      { title: 'Mock Honda Civic', city: 'Lahore', price: 6000000 },
      { title: 'Mock Toyota Corolla', city: 'Karachi', price: 5500000 }
    ]
  }).as('getCars')

  cy.window().then((win) => {
    return win.fetch('/api/cars')
  })

  cy.wait('@getCars').then((interception) => {
    expect(interception.response.statusCode).to.eq(200)
    expect(interception.response.body).to.have.length(2)
    expect(interception.response.body[0].title).to.eq('Mock Honda Civic')
  })
})
  it('should send API request using cy.request', () => {
    cy.request('https://example.cypress.io').then((response) => {
      expect(response.status).to.eq(200)
    })
  })

  it('should capture screenshot for visual regression demo', () => {
    cy.contains('PakWheels Smart Search').should('be.visible')
    cy.screenshot('pakwheels-smart-search-homepage')
  })
})