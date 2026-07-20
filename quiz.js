/* =========================================================
   quiz.js
   Handles grading and feedback for the Self-Assessment Quiz
========================================================= */

var quizAnswers = {
    q1: { type: "fill", correct: ["gogh"], text: "Fill in the blank" },
    q2: { type: "single", correct: "b", text: "Who painted the Mona Lisa?" },
    q3: { type: "single", correct: "c", text: "In what year was The Scream created?" },
    q4: { type: "single", correct: "b", text: "Which art movement is Vincent van Gogh most associated with?" },
    q5: { type: "multi", correct: ["a", "c"], text: "Which of the following are true about oil painting?" }
};

var answerLabels = {
    q1: "Gogh",
    q2: "Leonardo da Vinci",
    q3: "1893",
    q4: "Post-Impressionism",
    q5: "Uses pigments mixed with oil; Known for producing rich, long-lasting color"
};

var passThreshold = 0.6;

document.addEventListener("DOMContentLoaded", function () {

    var quizForm = document.getElementById('quiz-form');
    var resultsBox = document.getElementById('quiz-results');
    var overallResult = document.getElementById('overall-result');
    var overallHeading = document.getElementById('overall-heading');
    var overallScore = document.getElementById('overall-score');
    var feedbackList = document.getElementById('question-feedback-list');

    function arraysMatch(a, b) {
        if (a.length !== b.length) return false;
        var sortedA = a.slice().sort();
        var sortedB = b.slice().sort();
        for (var i = 0; i < sortedA.length; i++) {
            if (sortedA[i] !== sortedB[i]) return false;
        }
        return true;
    }

    function isCorrect(qName) {
        var info = quizAnswers[qName];

        if (info.type === "fill") {
            var value = document.getElementById(qName).value.trim().toLowerCase();
            return info.correct.indexOf(value) !== -1;
        }

        if (info.type === "single") {
            var selected = document.querySelector('input[name="' + qName + '"]:checked');
            return !!selected && selected.value === info.correct;
        }

        if (info.type === "multi") {
            var checked = document.querySelectorAll('input[name="' + qName + '"]:checked');
            var chosen = [];
            checked.forEach(function (box) { chosen.push(box.value); });
            return arraysMatch(chosen, info.correct);
        }

        return false;
    }

    quizForm.addEventListener('submit', function (e) {
        e.preventDefault();

        var questionNames = Object.keys(quizAnswers);
        var totalQuestions = questionNames.length;
        var correctCount = 0;

        feedbackList.innerHTML = "";

        questionNames.forEach(function (qName, index) {
            var correct = isCorrect(qName);
            if (correct) correctCount++;

            var fb = document.createElement('div');
            fb.className = "question-feedback " + (correct ? "correct" : "incorrect");

            fb.innerHTML =
                '<div class="fb-header">' +
                    '<span>Question ' + (index + 1) + ': ' + quizAnswers[qName].text + '</span>' +
                    '<span class="status-tag ' + (correct ? "correct" : "incorrect") + '">' +
                        (correct ? "Correct" : "Incorrect") +
                    '</span>' +
                '</div>' +
                '<p class="fb-answer">Correct answer: <strong>' + answerLabels[qName] + '</strong></p>' +
                '<p class="fb-answer">Points earned: <strong>' + (correct ? "1 / 1" : "0 / 1") + '</strong></p>';

            feedbackList.appendChild(fb);
        });

        var percent = Math.round((correctCount / totalQuestions) * 100);
        var passed = (correctCount / totalQuestions) >= passThreshold;

        overallResult.className = "overall-result " + (passed ? "pass" : "fail");
        overallHeading.textContent = passed ? "You Passed!" : "You Did Not Pass";
        overallScore.textContent =
            "Total score: " + correctCount + " out of " + totalQuestions +
            " correct (" + percent + "%)";

        resultsBox.style.display = "block";
        resultsBox.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    document.getElementById('quiz-reset').addEventListener('click', function () {
        quizForm.reset();
        feedbackList.innerHTML = "";
        overallScore.textContent = "";
        overallHeading.textContent = "";
        overallResult.className = "overall-result";
        resultsBox.style.display = "none";
    });

});
