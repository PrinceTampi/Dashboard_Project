/**
 * Static Insights Generator for Sleep Health Dashboard
 * 
 * Generates insights, recommendations, and interesting facts
 * from the ENTIRE (unfiltered) dataset.
 * These insights DO NOT change based on filters.
 */

/**
 * Convert string value to number
 */
const toNumber = (value) => {
  if (value === null || value === undefined || value === '') return null;
  const num = parseFloat(value);
  return isNaN(num) ? null : num;
};

/**
 * Calculate Pearson Correlation Coefficient between two arrays
 */
const calculateCorrelation = (arr1, arr2) => {
  if (arr1.length !== arr2.length || arr1.length === 0) return 0;
  
  const n = arr1.length;
  const mean1 = arr1.reduce((a, b) => a + b, 0) / n;
  const mean2 = arr2.reduce((a, b) => a + b, 0) / n;
  
  let numerator = 0;
  let denominator1 = 0;
  let denominator2 = 0;
  
  for (let i = 0; i < n; i++) {
    const diff1 = arr1[i] - mean1;
    const diff2 = arr2[i] - mean2;
    numerator += diff1 * diff2;
    denominator1 += diff1 * diff1;
    denominator2 += diff2 * diff2;
  }
  
  if (denominator1 === 0 || denominator2 === 0) return 0;
  return numerator / Math.sqrt(denominator1 * denominator2);
};

/**
 * Generate static insights from entire dataset
 */
export const generateStaticInsights = (data) => {
  if (!data || data.length === 0) {
    return {
      mainInsights: [],
      recommendations: [],
      funFacts: []
    };
  }

  const mainInsights = [];
  const recommendations = [];
  const funFacts = [];

  // ===== MAIN INSIGHTS =====

  // Insight 1: Average sleep duration
  const sleepDurations = data
    .map(row => toNumber(row['Sleep Duration']))
    .filter(v => v !== null);
  
  if (sleepDurations.length > 0) {
    const avgSleep = sleepDurations.reduce((a, b) => a + b, 0) / sleepDurations.length;
    const roundedAvg = Math.round(avgSleep * 100) / 100;
    mainInsights.push(
      `Durasi tidur rata-rata adalah ${roundedAvg} jam per hari. Ini berada dalam rentang kesehatan yang optimal (7-9 jam).`
    );
  }

  // Insight 2: Sleep disorder percentage
  const disorderCount = data.filter(row => row['Sleep Disorder'] !== 'None').length;
  const disorderPercentage = Math.round((disorderCount / data.length) * 100 * 100) / 100;
  mainInsights.push(
    `${disorderPercentage}% responden mengalami gangguan tidur (Insomnia atau Sleep Apnea). Ini menunjukkan masalah kesehatan yang signifikan dalam populasi.`
  );

  // Insight 3: Stress-Sleep correlation
  const stressLevels = data
    .map(row => toNumber(row['Stress Level']))
    .filter(v => v !== null);
  const sleepQualities = data
    .map(row => toNumber(row['Quality of Sleep']))
    .filter(v => v !== null);

  if (stressLevels.length > 0 && sleepQualities.length > 0 && stressLevels.length === sleepQualities.length) {
    const correlation = calculateCorrelation(stressLevels, sleepQualities);
    const corrRounded = Math.round(correlation * 100) / 100;
    
    if (correlation < 0) {
      mainInsights.push(
        `Terdapat korelasi negatif yang kuat (r = ${corrRounded}) antara tingkat stres dan kualitas tidur. Semakin tinggi stres, semakin rendah kualitas tidur.`
      );
    }
  }

  // ===== RECOMMENDATIONS =====

  // Recommendation 1: Stress management
  recommendations.push(
    '🎯 Prioritaskan manajemen stres dan teknik relaksasi (meditasi, yoga, breathing exercises) untuk meningkatkan kualitas tidur.'
  );

  // Recommendation 2: BMI and sleep disorders
  const bmiGroups = {};
  data.forEach(row => {
    const bmi = String(row['BMI Category']).trim();
    const disorder = row['Sleep Disorder'];
    if (bmi) {
      if (!bmiGroups[bmi]) {
        bmiGroups[bmi] = { count: 0, disorderCount: 0 };
      }
      bmiGroups[bmi].count += 1;
      if (disorder !== 'None') {
        bmiGroups[bmi].disorderCount += 1;
      }
    }
  });

  let overweightDisorderPct = 0;
  if (bmiGroups['Overweight']) {
    overweightDisorderPct = Math.round((bmiGroups['Overweight'].disorderCount / bmiGroups['Overweight'].count) * 100);
  }

  if (overweightDisorderPct > 0) {
    recommendations.push(
      `💪 Kelompok dengan BMI Overweight memiliki tingkat gangguan tidur ${overweightDisorderPct}%. Pertimbangkan program aktifitas fisik dan nutrisi seimbang.`
    );
  }

  // Recommendation 3: Occupational focus
  recommendations.push(
    '🏥 Identifikasi profesi dengan risiko tinggi gangguan tidur dan tawarkan program intervensi khusus (fleksibilitas kerja, wellness program).'
  );

  // ===== FUN FACTS =====

  // Fun Fact 1: Best occupation for sleep quality
  const occupationQualities = {};
  data.forEach(row => {
    const occupation = String(row['Occupation']).trim();
    const quality = toNumber(row['Quality of Sleep']);
    if (occupation && quality !== null) {
      if (!occupationQualities[occupation]) {
        occupationQualities[occupation] = [];
      }
      occupationQualities[occupation].push(quality);
    }
  });

  let bestOccupation = '';
  let bestQuality = 0;
  let worstOccupation = '';
  let worstQuality = 10;

  Object.entries(occupationQualities).forEach(([occupation, qualities]) => {
    const avgQuality = qualities.reduce((a, b) => a + b, 0) / qualities.length;
    if (avgQuality > bestQuality) {
      bestQuality = avgQuality;
      bestOccupation = occupation;
    }
    if (avgQuality < worstQuality) {
      worstQuality = avgQuality;
      worstOccupation = occupation;
    }
  });

  if (bestOccupation) {
    bestQuality = Math.round(bestQuality * 100) / 100;
    funFacts.push(
      `🌟 Profesi dengan kualitas tidur tertinggi: ${bestOccupation} (${bestQuality}/10). Mereka memiliki rutinitas tidur yang konsisten.`
    );
  }

  if (worstOccupation) {
    worstQuality = Math.round(worstQuality * 100) / 100;
    funFacts.push(
      `⚠️ Profesi dengan kualitas tidur terendah: ${worstOccupation} (${worstQuality}/10). Perlu perhatian khusus untuk wellness program.`
    );
  }

  // Fun Fact 2: Gender differences in stress
  const maleStress = data
    .filter(row => row['Gender'] === 'Male')
    .map(row => toNumber(row['Stress Level']))
    .filter(v => v !== null);

  const femaleStress = data
    .filter(row => row['Gender'] === 'Female')
    .map(row => toNumber(row['Stress Level']))
    .filter(v => v !== null);

  if (maleStress.length > 0 && femaleStress.length > 0) {
    const avgMaleStress = Math.round((maleStress.reduce((a, b) => a + b, 0) / maleStress.length) * 100) / 100;
    const avgFemaleStress = Math.round((femaleStress.reduce((a, b) => a + b, 0) / femaleStress.length) * 100) / 100;
    const stressDiff = Math.round((avgFemaleStress - avgMaleStress) * 100) / 100;

    if (stressDiff > 0) {
      funFacts.push(
        `👩👨 Perempuan memiliki tingkat stres ${stressDiff} poin lebih tinggi dibanding laki-laki (${avgFemaleStress}/10 vs ${avgMaleStress}/10).`
      );
    } else if (stressDiff < 0) {
      funFacts.push(
        `👨👩 Laki-laki memiliki tingkat stres ${Math.abs(stressDiff)} poin lebih tinggi dibanding perempuan (${avgMaleStress}/10 vs ${avgFemaleStress}/10).`
      );
    }
  }

  // Fun Fact 3: Most active individuals
  const maxActivity = Math.max(...data.map(row => toNumber(row['Physical Activity Level'])).filter(v => v !== null));
  const highActivityCount = data.filter(row => toNumber(row['Physical Activity Level']) >= maxActivity - 50).length;

  funFacts.push(
    `🏃 ${highActivityCount} orang memiliki aktivitas fisik di atas rata-rata, dengan korelasi positif terhadap kualitas tidur.`
  );

  return {
    mainInsights,
    recommendations,
    funFacts
  };
};
