import { useMemo } from 'react';
import {
  getAverageSleepDuration,
  getAverageSleepQuality,
  getAverageStressLevel,
  getAverageDailySteps,
  getAverageHeartRate,
  getSleepDisorderPercentage
} from '../utils/generateKPIs';

/**
 * KPI Section Component - Sleep Health Dashboard
 * 
 * Displays 6 fixed KPI cards:
 * 1. Rata-rata Durasi Tidur (jam)
 * 2. Rata-rata Kualitas Tidur (/10)
 * 3. Rata-rata Tingkat Stres (/10)
 * 4. Rata-rata Langkah Harian (langkah)
 * 5. Rata-rata Detak Jantung (bpm)
 * 6. Persentase Gangguan Tidur (%)
 * 
 * Props:
 * - filteredData: Filtered data array (from filters)
 */
const KPISection = ({ filteredData }) => {
  const kpiData = useMemo(() => {
    if (!filteredData || filteredData.length === 0) {
      return null;
    }

    return {
      sleepDuration: getAverageSleepDuration(filteredData),
      sleepQuality: getAverageSleepQuality(filteredData),
      stressLevel: getAverageStressLevel(filteredData),
      dailySteps: getAverageDailySteps(filteredData),
      heartRate: getAverageHeartRate(filteredData),
      disorder: getSleepDisorderPercentage(filteredData)
    };
  }, [filteredData]);

  if (!kpiData) {
    return (
      <div className="kpi-container">
        <p style={{ color: '#888', textAlign: 'center', padding: '20px' }}>
          Tidak ada data untuk kombinasi filter ini
        </p>
      </div>
    );
  }

  const kpiCards = [
    {
      id: 'sleep-duration',
      icon: '😴',
      title: 'Rata-rata Durasi Tidur',
      value: kpiData.sleepDuration !== null ? kpiData.sleepDuration : '-',
      unit: 'jam'
    },
    {
      id: 'sleep-quality',
      icon: '⭐',
      title: 'Rata-rata Kualitas Tidur',
      value: kpiData.sleepQuality !== null ? kpiData.sleepQuality : '-',
      unit: '/10'
    },
    {
      id: 'stress-level',
      icon: '😰',
      title: 'Rata-rata Tingkat Stres',
      value: kpiData.stressLevel !== null ? kpiData.stressLevel : '-',
      unit: '/10'
    },
    {
      id: 'daily-steps',
      icon: '🚶',
      title: 'Rata-rata Langkah Harian',
      value: kpiData.dailySteps !== null ? kpiData.dailySteps.toLocaleString('id-ID') : '-',
      unit: 'langkah'
    },
    {
      id: 'heart-rate',
      icon: '❤️',
      title: 'Rata-rata Detak Jantung',
      value: kpiData.heartRate !== null ? kpiData.heartRate : '-',
      unit: 'bpm'
    },
    {
      id: 'disorder-percentage',
      icon: '⚠️',
      title: 'Persentase Gangguan Tidur',
      value: kpiData.disorder !== null ? kpiData.disorder : '-',
      unit: '%'
    }
  ];

  return (
    <div className="kpi-container">
      <h2 style={{ marginBottom: '20px', color: 'var(--text-h)' }}>Key Performance Indicators</h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '15px',
        marginBottom: '30px'
      }}>
        {kpiCards.map(card => (
          <div
            key={card.id}
            style={{
              padding: '20px',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              backgroundColor: 'var(--bg)',
              boxShadow: 'var(--shadow)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              cursor: 'default'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'var(--shadow)';
            }}
          >
            <div style={{ fontSize: '32px', marginBottom: '10px' }}>{card.icon}</div>
            <div style={{ fontSize: '14px', color: 'var(--text)', marginBottom: '8px', fontWeight: '500' }}>
              {card.title}
            </div>
            <div style={{
              fontSize: '28px',
              fontWeight: 'bold',
              color: 'var(--accent)',
              marginBottom: '5px'
            }}>
              {card.value}
            </div>
            <div style={{ fontSize: '12px', color: '#999' }}>
              {card.unit}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KPISection;
