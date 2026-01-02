// index.js
const weatherApi = "https://api.weather.gov/alerts/active?area="

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
  const stateInput = document.getElementById('state-input')
  const fetchButton = document.getElementById('fetch-alerts')
  const alertsDisplay = document.getElementById('alerts-display')
  const errorMessage = document.getElementById('error-message')

  // Function to fetch weather alerts
  async function fetchWeatherAlerts(stateAbbr) {
    try {
      // Clear previous error messages
      errorMessage.textContent = ''
      errorMessage.classList.add('hidden')

      // Make the API request
      const response = await fetch(`${weatherApi}${stateAbbr}`)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch weather alerts: ${response.status}`)
      }

      const data = await response.json()

      // Clear previous alerts
      alertsDisplay.innerHTML = ''

      // Display title and number of alerts
      const alertCount = data.features ? data.features.length : 0
      const titleText = data.title || 'Weather Alerts'
      const summary = document.createElement('p')
      summary.textContent = `${titleText}: ${alertCount}`
      alertsDisplay.appendChild(summary)

      // Display each alert headline
      if (data.features && data.features.length > 0) {
        data.features.forEach(alert => {
          if (alert.properties && alert.properties.headline) {
            const headlineElement = document.createElement('p')
            headlineElement.textContent = alert.properties.headline
            alertsDisplay.appendChild(headlineElement)
          }
        })
      }

      // Clear input field
      stateInput.value = ''

    } catch (error) {
      // Display error message
      errorMessage.textContent = error.message
      errorMessage.classList.remove('hidden')
      
      // Clear alerts display on error
      alertsDisplay.innerHTML = ''
    }
  }

  // Add event listener to the button
  fetchButton.addEventListener('click', () => {
    const stateAbbr = stateInput.value.trim()
    if (stateAbbr) {
      fetchWeatherAlerts(stateAbbr)
    }
  })
})