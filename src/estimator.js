const covid19ImpactEstimator = (data) => {
    //challange 1
    const input = data;
    const currentlyInfected = data.reportedCases * 10;
    const serverCurrentlyInfected = data.reportedCases * 50;
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
    const serverinfectionsByRequestedTime = serverCurrentlyInfected * (2 ** setOfDays);
    return {
        data: input,
        impact: {
            currentlyInfected,
            infectionsByRequestedTime
        },
        severeImpact: {
            currentlyInfected: serverCurrentlyInfected,
            infectionsByRequestedTime: serverinfectionsByRequestedTime
        }
    };
};

export default covid19ImpactEstimator;