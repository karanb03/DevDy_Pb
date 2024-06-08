import React, { useEffect, useState } from "react";
import { fetchDeveloperActivity } from "../services/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import "/Users/karanborade/developer-activity-dashboard/src/styles/App.css";

interface Activity {
  name: string;
  value: string;
}

interface MetaActivity {
  label: string;
  fillColor: string;
}

interface DayWiseActivity {
  date: string;
  items: { children: Activity[] };
}

interface Developer {
  name: string;
  totalActivity: Activity[];
  dayWiseActivity: DayWiseActivity[];
}

interface ActivityData {
  data: {
    AuthorWorklog: {
      activityMeta: MetaActivity[];
      rows: Developer[];
    };
  };
}

const ActivityDashboard: React.FC = () => {
  const [data, setData] = useState<ActivityData | null>(null);

  useEffect(() => {
    fetchDeveloperActivity()
      .then(setData)
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  if (!data) return <div>Loading...</div>;

  const { AuthorWorklog } = data.data;

  const transformData = (developer: Developer) => {
    return developer.dayWiseActivity.map((day) => ({
      date: day.date,
      ...day.items.children.reduce((acc, activity) => {
        acc[activity.name] = parseInt(activity.value, 10); // Ensure values are numbers
        return acc;
      }, {} as Record<string, number>),
    }));
  };

  return (
    <div className="activity-dashboard">
      {AuthorWorklog.rows.map((developer) => (
        <div key={developer.name}>
          <h3>{developer.name}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={transformData(developer)}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              {AuthorWorklog.activityMeta.map((activity) => (
                <Bar
                  key={activity.label}
                  dataKey={activity.label}
                  fill={activity.fillColor}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      ))}
    </div>
  );
};

export default ActivityDashboard;
