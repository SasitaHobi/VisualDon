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
console.log(totEmploi())