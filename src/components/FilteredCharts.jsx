import { useMemo } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  ScatterChart, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  ComposedChart
} from 'recharts';
import {
  generateStressVsSleepQualityChart,
  generateSleepDurationByOccupationChart,
  generateSleepDisorderDistribution,
  generateBMIVsQualityStressChart,
  generateAgeVsSleepDurationChart,
  generatePhysicalActivityBySleepDisorder,
  generateOccupationVsSleepDisorderChart
} from '../utils/generateCharts';

/**
 * Filtered Charts Component - Sleep Health Dashboard
 * 
 * Renders 7 specialized charts grouped into 3 tabs:
 * - Tab 1 (Stres & Tidur): Stress vs Sleep Quality + Sleep Duration by Occupation
 * - Tab 2 (Demografi & Gangguan): Sleep Disorder Distribution + Occupation vs Sleep Disorder
 * - Tab 3 (Kesehatan Fisik): Age vs Sleep Duration + BMI vs Quality/Stress + Physical Activity by Disorder
 * 
 * All charts are dynamically updated based on filters.
 * 
 * Props:
 * - filteredData: Filtered data array (from filters)
 */
const FilteredCharts = ({ filteredData }) => {
  // Generate all chart configurations
  const chartConfigs = useMemo(() => {
    if (!filteredData || filteredData.length === 0) {
      return {
        stressVsSleep: null,
        sleepByOccupation: null,
        disorderDistribution: null,
        bmiVsQualityStress: null,
        ageVsSleep: null,
        activityByDisorder: null,
        occupationVsDisorder: null
      };
    }

    return {
      stressVsSleep: generateStressVsSleepQualityChart(filteredData),
      sleepByOccupation: generateSleepDurationByOccupationChart(filteredData),
      disorderDistribution: generateSleepDisorderDistribution(filteredData),
      bmiVsQualityStress: generateBMIVsQualityStressChart(filteredData),
      ageVsSleep: generateAgeVsSleepDurationChart(filteredData),
      activityByDisorder: generatePhysicalActivityBySleepDisorder(filteredData),
      occupationVsDisorder: generateOccupationVsSleepDisorderChart(filteredData)
    };
  }, [filteredData]);

  // Check if no data available
  if (
    !filteredData ||
    filteredData.length === 0 ||
    !Object.values(chartConfigs).some(config => config && config.canRender)
  ) {
    return (
      <div style={{
        padding: '40px 20px',
        textAlign: 'center',
        color: '#888',
        backgroundColor: 'rgba(0,0,0,0.02)',
        borderRadius: '8px',
        border: '1px solid var(--border)',
        marginBottom: '30px'
      }}>
        <p>Tidak ada data untuk kombinasi filter ini</p>
      </div>
    );
  }

  // Helper function to render line chart
  const renderLineChart = (config) => {
    if (!config || !config.canRender) return null;

    return (
      <div style={{ marginBottom: '30px' }}>
        <h4 style={{ marginBottom: '15px', color: 'var(--text-h)' }}>{config.title}</h4>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={config.data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey={config.xAxis.dataKey}
              label={{ value: config.xAxis.label, position: 'insideBottomRight', offset: -5 }}
              type={config.xAxis.type || 'category'}
            />
            <YAxis label={{ value: config.yAxis.label, angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            {config.lines.map((line, idx) => (
              <Line
                key={idx}
                type="monotone"
                dataKey={line.dataKey}
                stroke={line.stroke}
                strokeWidth={line.strokeWidth || 2}
                dot={false}
                isAnimationActive={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  };

  // Helper function to render bar chart
  const renderBarChart = (config) => {
    if (!config || !config.canRender) return null;

    return (
      <div style={{ marginBottom: '30px' }}>
        <h4 style={{ marginBottom: '15px', color: 'var(--text-h)' }}>{config.title}</h4>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={config.data} margin={{ top: 20, right: 30, left: 0, bottom: 100 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey={config.xAxis.dataKey}
              angle={-45}
              textAnchor="end"
              height={100}
              label={{ value: config.xAxis.label, position: 'insideBottomRight', offset: -5 }}
            />
            <YAxis label={{ value: config.yAxis.label, angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            {config.bars.map((bar, idx) => (
              <Bar key={idx} dataKey={bar.dataKey} fill={bar.fill} isAnimationActive={false} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  };

  // Helper function to render grouped bar chart
  const renderGroupedBarChart = (config) => {
    if (!config || !config.canRender) return null;

    return (
      <div style={{ marginBottom: '30px' }}>
        <h4 style={{ marginBottom: '15px', color: 'var(--text-h)' }}>{config.title}</h4>
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={config.data} margin={{ top: 20, right: 30, left: 0, bottom: 100 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey={config.xAxis.dataKey}
              angle={-45}
              textAnchor="end"
              height={100}
              label={{ value: config.xAxis.label, position: 'insideBottomRight', offset: -5 }}
            />
            <YAxis label={{ value: config.yAxis.label, angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            {config.bars.map((bar, idx) => (
              <Bar key={idx} dataKey={bar.dataKey} fill={bar.fill} isAnimationActive={false} />
            ))}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    );
  };

  // Helper function to render stacked bar chart
  const renderStackedBarChart = (config) => {
    if (!config || !config.canRender) return null;

    return (
      <div style={{ marginBottom: '30px' }}>
        <h4 style={{ marginBottom: '15px', color: 'var(--text-h)' }}>{config.title}</h4>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={config.data} margin={{ top: 20, right: 30, left: 0, bottom: 100 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey={config.xAxis.dataKey}
              angle={-45}
              textAnchor="end"
              height={100}
              label={{ value: config.xAxis.label, position: 'insideBottomRight', offset: -5 }}
            />
            <YAxis label={{ value: config.yAxis.label, angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            {config.bars.map((bar, idx) => (
              <Bar
                key={idx}
                dataKey={bar.dataKey}
                fill={bar.fill}
                stackId={bar.stackId}
                isAnimationActive={false}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  };

  // Helper function to render donut chart
  const renderDonutChart = (config) => {
    if (!config || !config.canRender) return null;

    return (
      <div style={{ marginBottom: '30px' }}>
        <h4 style={{ marginBottom: '15px', color: 'var(--text-h)' }}>{config.title}</h4>
        <ResponsiveContainer width="100%" height={400}>
          <PieChart margin={{ top: 20, right: 80, bottom: 20, left: 80 }}>
            <Pie
              data={config.data}
              dataKey={config.dataKey}
              nameKey={config.nameKey}
              cx="50%"
              cy="50%"
              innerRadius={80}
              outerRadius={140}
              label={({ name, percentage }) => `${name}: ${percentage}%`}
              isAnimationActive={false}
            >
              {config.data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `${value}`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  };

  // Helper function to render scatter chart
  const renderScatterChart = (config) => {
    if (!config || !config.canRender) return null;

    return (
      <div style={{ marginBottom: '30px' }}>
        <h4 style={{ marginBottom: '15px', color: 'var(--text-h)' }}>{config.title}</h4>
        <div style={{ fontSize: '12px', color: '#666', marginBottom: '10px' }}>
          🟢 HR &lt;70 (normal) | 🟡 HR 70-80 (elevated) | 🔴 HR &gt;80 (high)
        </div>
        <ResponsiveContainer width="100%" height={400}>
          <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey={config.xAxis.dataKey}
              label={{
                value: config.xAxis.label,
                position: 'insideBottomRight',
                offset: -5
              }}
              type="number"
            />
            <YAxis
              dataKey={config.yAxis.dataKey}
              label={{
                value: config.yAxis.label,
                angle: -90,
                position: 'insideLeft'
              }}
              type="number"
            />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
            <Scatter
              name="Points"
              data={config.data}
              fill="#8884d8"
              isAnimationActive={false}
            >
              {config.data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    );
  };

  // Helper function to render horizontal bar chart
  const renderHorizontalBarChart = (config) => {
    if (!config || !config.canRender) return null;

    return (
      <div style={{ marginBottom: '30px' }}>
        <h4 style={{ marginBottom: '15px', color: 'var(--text-h)' }}>{config.title}</h4>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={config.data}
            layout="vertical"
            margin={{ top: 20, right: 30, left: 150, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" label={{ value: config.xAxis.label }} />
            <YAxis dataKey={config.yAxis.dataKey} type="category" width={140} />
            <Tooltip />
            <Legend />
            {config.bars.map((bar, idx) => (
              <Bar
                key={idx}
                dataKey={bar.dataKey}
                fill={bar.fill}
                isAnimationActive={false}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  };

  return (
    <div style={{ marginBottom: '30px' }}>
      <h2 style={{ marginBottom: '20px', color: 'var(--text-h)' }}>Analisis Data (Terpengaruh Filter)</h2>

      <Tabs
        defaultActiveKey="stress-sleep"
        className="mb-3"
        style={{
          borderRadius: '8px',
          border: '1px solid var(--border)',
          padding: '10px',
          backgroundColor: 'var(--bg)'
        }}
      >
        {/* Tab 1: Stres & Tidur */}
        <Tab eventKey="stress-sleep" title="📊 Stres & Tidur">
          <div style={{ padding: '20px' }}>
            {renderLineChart(chartConfigs.stressVsSleep)}
            {renderBarChart(chartConfigs.sleepByOccupation)}
          </div>
        </Tab>

        {/* Tab 2: Demografi & Gangguan */}
        <Tab eventKey="demographics-disorder" title="👥 Demografi & Gangguan">
          <div style={{ padding: '20px' }}>
            {renderDonutChart(chartConfigs.disorderDistribution)}
            {renderStackedBarChart(chartConfigs.occupationVsDisorder)}
          </div>
        </Tab>

        {/* Tab 3: Kesehatan Fisik */}
        <Tab eventKey="physical-health" title="💪 Kesehatan Fisik">
          <div style={{ padding: '20px' }}>
            {renderScatterChart(chartConfigs.ageVsSleep)}
            {renderGroupedBarChart(chartConfigs.bmiVsQualityStress)}
            {renderHorizontalBarChart(chartConfigs.activityByDisorder)}
          </div>
        </Tab>
      </Tabs>
    </div>
  );
};

export default FilteredCharts;
