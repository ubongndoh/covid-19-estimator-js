const covid19ImpactEstimator = (data) => {
  const input = data;
  const currentlyInfected = data.reportedCases * 10;
  const serverCurrentlyInfcted = data.reportedCases * 50;
  // Calculate the time to elapse
  let estimateTime;
  if (data.periodType === 'days') {
    estimateTime = data.timeToElapse;
  } else if (data.periodType === 'weeks') {
    estimateTime = data.timeToElapse * 7;
  } else if (data.periodType === 'months') {
    estimateTime = data.timeToElapse * 30;
  }
  const setOfDays = Math.floor(estimateTime / 3);
  const infectionsByRequestedTime = currentlyInfected * (2 ** setOfDays);
  const serverinfectionsByRequestedTime = serverCurrentlyInfcted * (2 ** setOfDays);
  const severeCasesByRequestedTime = Math.floor((15 / 100) * infectionsByRequestedTime);
  const serveralSevereCasesByRequestedTime = Math.floor((15 / 100) * serverinfectionsByRequestedTime);
  // calculate the number of beds
  const bedsAreadyOccupied = Math.floor((65 / 100) * data.totalHospitalBeds);
  const availableBeds = Math.floor(data.totalHospitalBeds - bedsAreadyOccupied);
  const hospitalBedsByRequestedTime = availableBeds - severeCasesByRequestedTime;
  const serverehospitalBedsByRequestedTime = availableBeds - serveralSevereCasesByRequestedTime;
  // cases that require ICU care
  const casesForICUByRequestedTime = ((5 / 100) * infectionsByRequestedTime);
  const servercasesForICUByRequestedTime = ((5 / 100) * serverinfectionsByRequestedTime);
  // cases that will require ventilators
  const casesForVentilatorsByRequestedTime = ((2 / 100) * infectionsByRequestedTime);
  const servercasesForVentilatorsByRequestedTime = ((2 / 100) * serverinfectionsByRequestedTime);
  // amount of money to be lost in the economy
  const totalIncomePerperson = data.region.avgDailyIncomeInUSD * estimateTime;
  const dailyAvgIncome = data.region.avgDailyIncomePopulation;
  const dollarsInFlight = (infectionsByRequestedTime * dailyAvgIncome) * totalIncomePerperson;
  const svrDlrsInFlight = (serverinfectionsByRequestedTime * dailyAvgIncome) * totalIncomePerperson;
  // return reponse data
  return {
    data: input,
    impact: {
      currentlyInfected,
      infectionsByRequestedTime,
      severeCasesByRequestedTime,
      hospitalBedsByRequestedTime,
      casesForICUByRequestedTime,
      casesForVentilatorsByRequestedTime,
      dollarsInFlight
    },
    severeImpact: {
      currentlyInfected: serverCurrentlyInfcted,
      infectionsByRequestedTime: serverinfectionsByRequestedTime,
      severeCasesByRequestedTime: serveralSevereCasesByRequestedTime,
      hospitalBedsByRequestedTime: serverehospitalBedsByRequestedTime,
      casesForICUByRequestedTime: servercasesForICUByRequestedTime,
      casesForVentilatorsByRequestedTime: servercasesForVentilatorsByRequestedTime,
      dollarsInFlight: svrDlrsInFlight
    }
  };
};

export default covid19ImpactEstimator;
