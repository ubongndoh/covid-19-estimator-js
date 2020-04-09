const covid19ImpactEstimator = (data) => {
  // challenge-1
  const input = data;
  const currentlyInfected = data.reportedCases * 10;
  const serverCurrentlyInfected = data.reportedCases * 50;
  // Calculate-the-time-to-elapse
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
  const serverinfectionsByRequestedTime = serverCurrentlyInfected * (2 ** setOfDays);
  // challenge-2
  const severeCasesByRequestedTime = ((15 / 100) * infectionsByRequestedTime);
  const ServeresevereCasesByRequestedTime = ((15 / 100) * serverinfectionsByRequestedTime);
  // calculate the number of beds
  const bedsAreadyOccupied = ((65/100) * data.totalHospitalBeds);
  const availableBeds = (data.totalHospitalBeds - bedsAreadyOccupied);
  const hospitalBedsByRequestedTime = availableBeds - severeCasesByRequestedTime;
  const serverehospitalBedsByRequestedTime = availableBeds - ServeresevereCasesByRequestedTime;
  
  return {
    data: input,
    impact: {
      currentlyInfected,
      infectionsByRequestedTime,
      severeCasesByRequestedTime,
      hospitalBedsByRequestedTime
    },
    severeImpact: {
      currentlyInfected: serverCurrentlyInfected,
      infectionsByRequestedTime: serverinfectionsByRequestedTime,
      severeCasesByRequestedTime: ServeresevereCasesByRequestedTime,
      hospitalBedsByRequestedTime: serverehospitalBedsByRequestedTime
    }
  };
};

export default covid19ImpactEstimator;
