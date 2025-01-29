document.addEventListener("DOMContentLoaded", function () {
    const userData = document.querySelector("#input");
    const button = document.querySelector("#btn");
    const ranKing = document.querySelector(".ranking");
    const easyCircle = document.querySelector(".easy-progress");
    const mediumCircle = document.querySelector(".medium-progress");
    const hardCircle = document.querySelector(".hard-progress");
    const easyLabel = document.querySelector("#easy-level");
    const mediumLabel = document.querySelector("#medium-level");
    const hardLabel = document.querySelector("#hard-level");
    const stateCard = document.querySelector(".stat-card");

    function validateUsername(username) {
        if (username.trim() === "") {
            alert("Please enter a username.");
            return false;
        }
        const usernameRegex = /^[a-zA-Z0-9]{3,15}$/;
        if (!usernameRegex.test(username)) {
            alert("Please enter a valid username (3-15 alphanumeric characters).");
            return false;
        }
        return true;
    }

    async function fetchUserDetails(username) {

        try{
            button.textContent = "Searching...";
            button.disabled = true;
            stateCard.classList.add("hidden");

            const targetUrl = `https://leetcode-stats-api.herokuapp.com/${username}`;
            
            const response = await fetch(targetUrl);
            if(!response.ok) {
                throw new Error("Unable to fetch the User details");
            }
            const parsedData = await response.json();
            console.log("Logging data: ", parsedData) ;

            displayUserData(parsedData);
        }
        catch(error) {
            stateCard.innerHTML = `<p>${error.message}</p>`
        }
        finally {
            button.textContent = "Search";
            button.disabled = false;
        }
    }

    function updateProgress(solved, total, label, circle,rank) {
        ranKing.innerHTML = `<h4>Ranking:${rank}</h4>`;

        if (total === 0) {
            label.textContent = "0/0";
            circle.style.setProperty("--progress-degree", "0deg");
            return;
        }
    
        const progressDegree = (solved / total) * 360; // Now in degrees, not percentage
        circle.style.setProperty("--progress-degree", `${progressDegree}deg`);
        label.textContent = `${solved}/${total}`;
    }


    function displayUserData(parsedData) {
        const totalQues = parsedData.totalQuestion;
        const totalEasyQues = parsedData.totalEasy;
        const totalMediumQues = parsedData.totalMedium;
        const totalHardQues = parsedData.totalHard;
        const rank = parsedData.ranking;
        const solvedTotalQues = parsedData.totalSolved;
        const solvedTotalEasyQues = parsedData.easySolved;
        const solvedTotalMediumQues = parsedData.mediumSolved;
        const solvedTotalHardQues = parsedData.hardSolved;

        updateProgress(solvedTotalEasyQues, totalEasyQues, easyLabel, easyCircle,rank);
        updateProgress(solvedTotalMediumQues, totalMediumQues, mediumLabel, mediumCircle,rank);
        updateProgress(solvedTotalHardQues, totalHardQues, hardLabel, hardCircle,rank);

        

    }
    button.addEventListener("click", function () {
        const username = userData.value.trim();
        console.log("Input Username:", username);

        if (validateUsername(username)) {
            fetchUserDetails(username);
        }
    });
});
