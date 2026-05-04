import survey from "../data/data.json"

const answers = JSON.parse(survey);

const totAnswers = answers.length;


const totEmploi = () => {
    let total = 0;

    answers.forEach(answer => {
        if (answer.pref === "En emploi") {
            total++;
        }

    });
    return total;
}
const totPlein = () => {
    let total = 0;

    answers.forEach(answer => {
        if (answer.pref === "Temps plein") {
            total++;
        }

    });
    return total;
}

const totPartiel = () => {
    let total = 0;

    answers.forEach(answer => {
        if (answer.pref === "Temps partiel") {
            total++;
        }

    });
    return total;
}
const totWorkVital = () => {
    let total = 0;

    answers.forEach(answer => {
        if (answer.working === "Vital") {
            total++;
        }
    });
    return total;
}

const totWorkPocketMoney = () => {
    let total = 0;
    answers.forEach(answer => {
        if (answer.working === "Argent de poche") {
            total++;
        }
    });
    return total;
}

const totWorkNotNecessary = () => {
    let total = 0;
    answers.forEach(answer => {
        if (answer.working === "Pas nécessaire") {
            total++;
        }
    });
    return total;
}

// Situation totals
const totSituationAlone = () => {
    let total = 0;
    answers.forEach(answer => {
        if (answer.situation === "Seul") {
            total++;
        }
    });
    return total;
}

const totSituationFamily = () => {
    let total = 0;
    answers.forEach(answer => {
        if (answer.situation === "Famille") {
            total++;
        }
    });
    return total;
}

const totSituationCouple = () => {
    let total = 0;
    answers.forEach(answer => {
        if (answer.situation === "Couple") {
            total++;
        }
    });
    return total;
}

// Helper function to count occurrences of a specific value in a field
const countFieldValue = (fieldName, value) => {
    let total = 0;
    answers.forEach(answer => {
        if (answer[fieldName] === value) {
            total++;
        }
    });
    return total;
}

// Get all unique values for a field
const getUniqueValues = (fieldName) => {
    const values = new Set();
    answers.forEach(answer => {
        if (answer[fieldName] && answer[fieldName] !== "") {
            values.add(answer[fieldName]);
        }
    });
    return Array.from(values);
}

// Get totals for all reasons (reason1, reason2, reason3)
const getAllReasonsTotals = () => {
    const reasonTotals = {};
    ['reason1', 'reason2', 'reason3'].forEach(field => {
        const uniqueReasons = getUniqueValues(field);
        uniqueReasons.forEach(reason => {
            if (reason) {
                reasonTotals[reason] = (reasonTotals[reason] || 0) + countFieldValue(field, reason);
            }
        });
    });
    return reasonTotals;
}

// Get totals for all helps (help1, help2)
const getAllHelpsTotals = () => {
    const helpTotals = {};
    ['help1', 'help2'].forEach(field => {
        const uniqueHelps = getUniqueValues(field);
        uniqueHelps.forEach(help => {
            if (help) {
                helpTotals[help] = (helpTotals[help] || 0) + countFieldValue(field, help);
            }
        });
    });
    return helpTotals;
}

// Export all functions
export {
    totAnswers,
    totEmploi,
    totPlein,
    totPartiel,
    totWorkVital,
    totWorkPocketMoney,
    totWorkNotNecessary,
    totSituationAlone,
    totSituationFamily,
    totSituationCouple,
    countFieldValue,
    getUniqueValues,
    getAllReasonsTotals,
    getAllHelpsTotals
}
