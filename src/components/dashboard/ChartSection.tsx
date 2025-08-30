import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, Target, Users, PieChart as PieChartIcon, BarChart3 } from "lucide-react";

const aiScoresData = [{
  category: "IT Services",
  score: 78
}, {
  category: "Construction",
  score: 82
}, {
  category: "Consulting",
  score: 75
}, {
  category: "Equipment",
  score: 80
}, {
  category: "Maintenance",
  score: 77
}];
const efficiencyTrendData = [{
  month: "Jan",
  efficiency: 65
}, {
  month: "Feb",
  efficiency: 72
}, {
  month: "Mar",
  efficiency: 78
}, {
  month: "Apr",
  efficiency: 85
}, {
  month: "May",
  efficiency: 82
}, {
  month: "Jun",
  efficiency: 88
}];
const reviewOutcomesData = [{
  outcome: "Approved",
  count: 145
}, {
  outcome: "Rejected",
  count: 67
}, {
  outcome: "Pending",
  count: 23
}, {
  outcome: "Under Review",
  count: 34
}];
const reviewDistributionData = [{
  name: "Auto-Approved",
  value: 45
}, {
  name: "Human Review",
  value: 35
}, {
  name: "AI-Flagged",
  value: 20
}];
const topicDistributionData = [{
  topic: "Technical",
  count: 89
}, {
  topic: "Financial",
  count: 67
}, {
  topic: "Compliance",
  count: 45
}, {
  topic: "Legal",
  count: 34
}, {
  topic: "Operations",
  count: 28
}];
const chartConfig = {
  score: {
    label: "Score"
  },
  efficiency: {
    label: "Efficiency %"
  },
  count: {
    label: "Count"
  },
  value: {
    label: "Value"
  }
};

export const ChartSection = () => {
  return <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* AI Scores by Category */}
      <Card className="rounded-[15px] border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-all duration-300">
        <CardHeader className="border-b border-gray-100">
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <div className="p-2 bg-red-muted rounded-xl">
              <BarChart3 className="h-4 w-4 text-white" />
            </div>
            AI Scores by Category
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={aiScoresData} margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5
            }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="category" tick={{
                fontSize: 12,
                fill: "#374151"
              }} angle={-45} textAnchor="end" height={60} />
                <YAxis tick={{
                fontSize: 12,
                fill: "#374151"
              }} />
                <ChartTooltip content={({
                active,
                payload,
                label
              }) => {
                if (active && payload && payload.length) {
                  return <div className="bg-white p-2 border border-gray-200 rounded shadow">
                          <p className="font-medium">{label}</p>
                          <p className="text-red-muted">
                            Score: {payload[0].value}
                          </p>
                        </div>;
                }
                return null;
              }} />
                <Bar dataKey="score" radius={[4, 4, 0, 0]} fill="hsl(var(--red-muted))" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Efficiency Trend */}
      <Card className="rounded-[15px] border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-all duration-300">
        <CardHeader className="border-b border-gray-100">
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <div className="p-2 bg-black rounded-xl">
              <TrendingUp className="h-4 w-4 text-white" />
            </div>
            Efficiency Trend
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={efficiencyTrendData} margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5
            }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="month" tick={{
                fontSize: 12,
                fill: "#374151"
              }} />
                <YAxis tick={{
                fontSize: 12,
                fill: "#374151"
              }} />
                <ChartTooltip content={({
                active,
                payload,
                label
              }) => {
                if (active && payload && payload.length) {
                  return <div className="bg-white p-2 border border-gray-200 rounded shadow">
                          <p className="font-medium">{label}</p>
                          <p className="text-red-muted">
                            Efficiency: {payload[0].value}%
                          </p>
                        </div>;
                }
                return null;
              }} />
                <Line type="monotone" dataKey="efficiency" stroke="hsl(var(--red-muted))" strokeWidth={3} dot={{
                fill: "hsl(var(--red-muted))",
                strokeWidth: 2,
                r: 4
              }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Review Outcomes */}
      <Card className="rounded-[15px] border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-all duration-300">
        <CardHeader className="border-b border-gray-100">
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <div className="p-2 bg-red-muted rounded-xl">
              <Target className="h-4 w-4 text-white" />
            </div>
            Review Outcomes
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={reviewOutcomesData} margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5
            }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="outcome" tick={{
                fontSize: 12,
                fill: "#374151"
              }} angle={-45} textAnchor="end" height={60} />
                <YAxis tick={{
                fontSize: 12,
                fill: "#374151"
              }} />
                <ChartTooltip content={({
                active,
                payload,
                label
              }) => {
                if (active && payload && payload.length) {
                  return <div className="bg-white p-2 border border-gray-200 rounded shadow">
                          <p className="font-medium">{label}</p>
                          <p className="text-red-muted">
                            Count: {payload[0].value}
                          </p>
                        </div>;
                }
                return null;
              }} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]} fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Review Distribution */}
      <Card className="rounded-[15px] border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-all duration-300">
        <CardHeader className="border-b border-gray-100">
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <div className="p-2 bg-black rounded-xl">
              <PieChartIcon className="h-4 w-4 text-white" />
            </div>
            Review Distribution
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={reviewDistributionData} cx="50%" cy="50%" innerRadius={40} outerRadius={80} paddingAngle={5} dataKey="value">
                  <Cell fill="hsl(var(--primary))" />
                  <Cell fill="hsl(var(--red-muted))" />
                  <Cell fill="hsl(var(--muted-foreground))" />
                </Pie>
                <ChartTooltip content={({
                active,
                payload
              }) => {
                if (active && payload && payload.length) {
                  return <div className="bg-white p-2 border border-gray-200 rounded shadow">
                          <p className="font-medium">{payload[0].name}</p>
                          <p className="text-red-muted">
                            {payload[0].value}%
                          </p>
                        </div>;
                }
                return null;
              }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-1 gap-2 mt-4">
            {reviewDistributionData.map((item, index) => {
            const colors = ["hsl(var(--primary))", "hsl(var(--red-muted))", "hsl(var(--muted-foreground))"];
            return <div key={index} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{
                backgroundColor: colors[index]
              }}></div>
                  <span className="text-sm text-gray-700">{item.name}: {item.value}%</span>
                </div>;
          })}
          </div>
        </CardContent>
      </Card>
    </div>;
};
