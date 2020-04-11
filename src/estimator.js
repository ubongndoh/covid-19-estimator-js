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
  const setOfDays = Math.trunc(estimateTime / 3);
  const infectionsByRequestedTime = currentlyInfected * (2 ** setOfDays);
  const serverinfectionsByRequestedTime = serverCurrentlyInfcted * (2 ** setOfDays);
  const severeCasesByRequestedTime = Math.trunc((15 / 100) * infectionsByRequestedTime);
  const servlSevereCasesByRequestedTime = Math.trunc((15 / 100) * serverinfectionsByRequestedTime);
  // calculate the number of beds
  const bedsAreadyOccupied = Math.trunc((65 / 100) * data.totalHospitalBeds);
  const availableBeds = Math.trunc(data.totalHospitalBeds - bedsAreadyOccupied);
  const hospitalBedsByRequestedTime = availableBeds - severeCasesByRequestedTime;
  const serverehospitalBedsByRequestedTime = availableBeds - servlSevereCasesByRequestedTime;
  // cases that require ICU care
  const casesForICUByRequestedTime = Math.trunc((5 / 100) * infectionsByRequestedTime);
  const servercasesForICUByRequestedTime = Math.trunc((5 / 100) * serverinfectionsByRequestedTime);
  // cases that will require ventilators
  const casesForVentilatorsByRequestedTime = Math.trunc((2 / 100) * infectionsByRequestedTime);
  const servCasesForVentByRequestedTime = Math.trunc((2 / 100) * serverinfectionsByRequestedTime);
  // amount of money to be lost in the economy
  const totalIncomePerperson = data.region.avgDailyIncomeInUSD * estimateTime;
  const dailyAvgIncome = data.region.avgDailyIncomePopulation;
  const dollarsInFlight = (infectionsByRequestedTime * dailyAvgIncome) / totalIncomePerperson;
  const svrDlrsInFlight = (serverinfectionsByRequestedTime * dailyAvgIncome) / totalIncomePerperson;
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
      casesForVentilatorsByRequestedTime: servCasesForVentByRequestedTime,
      dollarsInFlight: svrDlrsInFlight
    }
  };
};

export default covid19ImpactEstimator;
