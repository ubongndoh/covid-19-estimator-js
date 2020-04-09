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
  const servlSevereCasesByRequestedTime = Math.floor((15 / 100) * serverinfectionsByRequestedTime);
  // calculate the number of beds
  const bedsAreadyOccupied = Math.floor((65 / 100) * data.totalHospitalBeds);
  const availableBeds = Math.floor(data.totalHospitalBeds - bedsAreadyOccupied);
  const hospitalBedsByRequestedTime = availableBeds - severeCasesByRequestedTime;
  const serverehospitalBedsByRequestedTime = availableBeds - servlSevereCasesByRequestedTime;
  // cases that require ICU care
  const casesForICUByRequestedTime = Math.floor((5 / 100) * infectionsByRequestedTime);
  const servercasesForICUByRequestedTime = Math.floor((5 / 100) * serverinfectionsByRequestedTime);
  // cases that will require ventilators
  const casesForVentilatorsByRequestedTime = Math.floor((2 / 100) * infectionsByRequestedTime);
  const serCasesForVentByRequestedTime = Math.floor((2 / 100) * serverinfectionsByRequestedTime);
  // amount of money to be lost in the economy
  const totalIncomePerperson = data.region.avgDailyIncomeInUSD * estimateTime;
  const dailyAvgIncome = data.region.avgDailyIncomePopulation;
  const dollarsInFlight = Math.floor(infectionsByRequestedTime
    * dailyAvgIncome) * totalIncomePerperson;
  const svrDlrsInFlight = Math.floor(serverinfectionsByRequestedTime
    * dailyAvgIncome) * totalIncomePerperson;
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
      severeCasesByRequestedTime: servlSevereCasesByRequestedTime,
      hospitalBedsByRequestedTime: serverehospitalBedsByRequestedTime,
      casesForICUByRequestedTime: servercasesForICUByRequestedTime,
      casesForVentilatorsByRequestedTime: serCasesForVentByRequestedTime,
      dollarsInFlight: svrDlrsInFlight
    }
  };
};

export default covid19ImpactEstimator;
