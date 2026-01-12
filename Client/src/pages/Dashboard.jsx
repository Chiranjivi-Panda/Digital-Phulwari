import WeatherCard from "../components/WeatherCard";
import PlantCard from "../components/PlantCard";

const Dashboard = () => {
  return (
    <div className="p-6 space-y-6">
      <WeatherCard />

      <section>
        <h2 className="text-xl font-semibold mb-3">🌿 Plant Recommendations</h2>
        {/* map your plant data here */}
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">💧 Watering Schedule</h2>
        <p>Weather-based watering reminders coming soon.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">🌼 Gardening Tip</h2>
        <p>Early morning watering reduces evaporation and plant stress.</p>
      </section>
    </div>
  );
};

export default Dashboard;
