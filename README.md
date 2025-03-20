# Weather App

A [modern weather application](https://weather-app-indol-delta-12.vercel.app/) built with Next.js that provides current weather information and 5-day forecasts.

## Features

- **Location-based Weather**: Search for weather by city, zip code, landmark, or any location
- **Current Location**: Use your device's geolocation to get local weather
- **Current Weather Details**: View temperature, feels like, humidity, pressure, and wind speed
- **5-Day Forecast**: Plan ahead with a 5-day weather forecast
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop devices
- **Visual Weather Indicators**: Icons that represent different weather conditions

## Technologies Used

- **Next.js**: React framework for building the application
- **TypeScript**: Static typing for improved development experience
- **Tailwind CSS**: Utility-first CSS framework for styling
- **OpenWeatherMap API**: Weather data provider

## Getting Started

### Prerequisites

- Node.js (version 14 or later)
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/suraj2906/weather-app.git
   cd weather-app
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env.local` file in the root directory with your OpenWeatherMap API key
   ```
   NEXT_PUBLIC_OPENWEATHERMAP_API_KEY=your_api_key_here
   ```

   > You can get a free API key by signing up at [OpenWeatherMap](https://openweathermap.org/api)

4. Start the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application


## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
