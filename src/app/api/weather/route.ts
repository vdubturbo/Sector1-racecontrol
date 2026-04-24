import { NextRequest, NextResponse } from 'next/server';

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
const CURRENT_URL = 'https://api.openweathermap.org/data/2.5/weather';
const FORECAST_URL = 'https://api.openweathermap.org/data/2.5/forecast';

function kelvinToFahrenheit(k: number): number {
  return Math.round((k - 273.15) * 9 / 5 + 32);
}

function mpsToMph(mps: number): number {
  return Math.round(mps * 2.237);
}

function estimateTrackTemperature(
  ambientF: number,
  cloudiness: number,
  windMph: number,
  isDay: boolean,
): number {
  if (!isDay) return ambientF + 7;
  let trackTemp = ambientF + 15;
  trackTemp += (1 - cloudiness / 100) * 25;  // solar heating
  trackTemp += 8;                              // traffic friction
  trackTemp -= Math.min(windMph * 0.5, 10);   // wind cooling
  return Math.round(trackTemp);
}

export async function GET(request: NextRequest) {
  if (!OPENWEATHER_API_KEY) {
    return NextResponse.json({ error: 'Weather API key not configured' }, { status: 500 });
  }

  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');

  if (!lat || !lon) {
    return NextResponse.json({ error: 'lat and lon are required' }, { status: 400 });
  }

  try {
    const [currentRes, forecastRes] = await Promise.all([
      fetch(`${CURRENT_URL}?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}`),
      fetch(`${FORECAST_URL}?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&cnt=6`),
    ]);

    if (!currentRes.ok) {
      return NextResponse.json(
        { error: `OpenWeather API returned ${currentRes.status}` },
        { status: currentRes.status },
      );
    }

    const current = await currentRes.json();
    const now = Math.floor(Date.now() / 1000);
    const isDay = now >= current.sys.sunrise && now <= current.sys.sunset;

    const ambientTemp = kelvinToFahrenheit(current.main.temp);
    const windSpeed = mpsToMph(current.wind?.speed || 0);

    const weather = {
      ambientTemp,
      feelsLike: kelvinToFahrenheit(current.main.feels_like),
      trackTemp: estimateTrackTemperature(ambientTemp, current.clouds.all, windSpeed, isDay),
      humidity: current.main.humidity,
      windSpeed,
      windDirection: current.wind?.deg || 0,
      conditions: {
        main: current.weather[0].main,
        description: current.weather[0].description,
        icon: current.weather[0].icon,
      },
      cloudiness: current.clouds.all,
      location: current.name,
    };

    let forecast: Array<{
      time: number;
      temp: number;
      trackTemp: number;
      conditions: { main: string; description: string; icon: string };
      precipChance: number;
    }> = [];

    if (forecastRes.ok) {
      const forecastData = await forecastRes.json();
      forecast = forecastData.list.map((f: Record<string, unknown>) => {
        const fTemp = kelvinToFahrenheit((f.main as Record<string, number>).temp);
        const fWind = mpsToMph(((f.wind as Record<string, number>)?.speed) || 0);
        const fClouds = (f.clouds as Record<string, number>)?.all || 0;
        const fTime = f.dt as number;
        const fIsDay = fTime >= current.sys.sunrise && fTime <= current.sys.sunset;
        const fWeather = (f.weather as Array<Record<string, string>>)[0];
        return {
          time: fTime,
          temp: fTemp,
          trackTemp: estimateTrackTemperature(fTemp, fClouds, fWind, fIsDay),
          conditions: { main: fWeather.main, description: fWeather.description, icon: fWeather.icon },
          precipChance: Math.round(((f.pop as number) || 0) * 100),
        };
      });
    }

    return NextResponse.json(
      { weather, forecast },
      { headers: { 'Cache-Control': 'public, max-age=600, s-maxage=600' } },
    );
  } catch (err) {
    console.error('[Weather proxy] Fetch error:', err);
    return NextResponse.json({ error: 'Failed to reach OpenWeather API' }, { status: 502 });
  }
}
