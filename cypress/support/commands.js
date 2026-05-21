Cypress.Commands.add('buildPakWheelsMockApp', () => {
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

Cypress.Commands.add('searchCar', (keyword) => {
  cy.get('#searchBox').clear().type(keyword)
  cy.get('#searchBtn').click()
})

Cypress.Commands.add('applyCityFilter', (city) => {
  cy.get('#city').select(city)
})

Cypress.Commands.add('applyPriceFilter', (minPrice, maxPrice) => {
  cy.get('#minPrice').clear().type(String(minPrice))
  cy.get('#maxPrice').clear().type(String(maxPrice))
})

Cypress.Commands.add('loginByToken', () => {
  cy.window().then((win) => {
    win.localStorage.setItem('authToken', 'mock-token-123')
  })
})