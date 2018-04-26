const request = require('request');


// returns an object of objects with information about transactions and fraud per day

const filterDateData = (start, end, data) => {
    let dates = buildDateArray(start, end);
    let returnObj = {}

    dates.forEach(day => {
        let dayString = day.toLocaleString("en-US", { year: 'numeric', month: 'long', day: 'numeric' });
        returnObj[dayString] = {
            transactions: getTransactionsOnDay(day, data),
            fraudRatio: getFraudRatioOnDay(day, data)
        }
    });

    return returnObj;
}




// Request Library Promise Wrapper
const requestPromise = options => new Promise((resolve, reject) => {
    request(options, (err, res, body) => {
        if (err != null) {
            return reject(err);
        } else {
            resolve(JSON.parse(body));
        }
    })
});

// ****************** filterDateData Helper Functions ******************

// date is a Date obj
const compareDates = (date, resObj) => {
    const objDate = new Date(resObj.timeStamp);

    // check if dates are the same
    if (isSameDay(objDate, date)) {
        return true;
    }
    return false;
}

// get array of transactions on same day
const getTransactionsOnDay = (date, transactions) => transactions.filter(t => compareDates(date, t));

const getFraudRatioOnDay = (date, transactions) => {
    const transactionsOnDate = getTransactionsOnDay(date, transactions);
    const amtTransactions = transactionsOnDate.length;
    const amtFraud = transactionsOnDate.filter(t => t.fraud > -0.75).length;


    // avoid division by zero
    if (amtTransactions !== 0) {
        return amtFraud / amtTransactions;
    }
    // zero fraud
    return 0;
}

// builds an array of dates between two dates (inclusive)
// must be same year OR start must be before end date!
// ex: [date(4/1/2018), date(4/2/2018)] 

const buildDateArray = (start, end) => {
    let arr = [];
    currDate = start;
    while (!isSameDay(currDate, end)) {
        arr.push(new Date(currDate));

        // increment date
        currDate.setDate(currDate.getDate() + 1);
    }
    // includes end date
    arr.push(currDate);
    return arr;
}


// compares date objects based on day, month, year
const isSameDay = (day0, day1) =>
    day0.getDate() === day1.getDate() &&
    day0.getMonth() === day1.getMonth() &&
    day0.getFullYear() === day1.getFullYear();

// ********************************************************

module.exports = { requestPromise, filterDateData };