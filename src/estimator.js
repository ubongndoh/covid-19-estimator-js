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
  const severeCasesByRequestedTime = Math.trunc((0.15) * infectionsByRequestedTime);
  const servlSevereCasesByRequestedTime = Math.trunc((0.15) * serverinfectionsByRequestedTime);
  // calculate the number of beds
  const bedsAreadyOccupied = Math.trunc((0.65) * data.totalHospitalBeds);
  const availableBeds = Math.trunc(data.totalHospitalBeds - bedsAreadyOccupied);
  const hospitalBedsByRequestedTime = availableBeds - severeCasesByRequestedTime;
  const serverehospitalBedsByRequestedTime = availableBeds - servlSevereCasesByRequestedTime;
  // cases that require ICU care
  const casesForICUByRequestedTime = Math.trunc((0.05) * infectionsByRequestedTime);
  const servercasesForICUByRequestedTime = Math.trunc((0.05) * serverinfectionsByRequestedTime);
  // cases that will require ventilators
  const casesForVentilatorsByRequestedTime = Math.trunc((0.02) * infectionsByRequestedTime);
  const servCasesForVentByRequestedTime = Math.trunc((0.02) * serverinfectionsByRequestedTime);
  // amount of money to be lost in the economy
  // const totalIncomePerperson = data.region.avgDailyIncomeInUSD * estimateTime;
  const { avgDailyIncomeInUSD, avgDailyIncomePopulation } = data.region;
  const populationIncome = avgDailyIncomePopulation * avgDailyIncomeInUSD;
  const moneyLoss = (infectionsByRequestedTime * populationIncome) / estimateTime;
  const severePopIncome = avgDailyIncomePopulation * avgDailyIncomeInUSD;
  const severeMoneyLoss = (infectionsByRequestedTime * severePopIncome) / estimateTime;
  const dollarsInFlight = Math.trunc(moneyLoss);
  const svrDlrsInFlight = Math.trunc(severeMoneyLoss);
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
