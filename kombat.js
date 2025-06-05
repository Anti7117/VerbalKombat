async function analyzeInsult(text) {
    const prompt = `Értékeld a következő beszólást három szempont alapján 1-től 10-ig (számokkal), majd indoklod is meg röviden mindhárom értékelést.

    Szempontok:
    1. Furfangosság (mennyire ötletes, nyelvi játékos)
    2. Erősség (mennyire ütős, odaszúró)
    3. Durvaság (mennyire trágár vagy bántó)

    Szöveg: "${text}"

    Válasz formátuma:
    Furfangosság: X/10 – (indoklás)
    Erősség: Y/10 – (indoklás)
    Durvaság: Z/10 – (indoklás)

    Kérlek, magyar nyelven válaszolj.`;

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
              //  "Authorization":                 "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "gpt-4",
                messages: [
                    { role: "system", content: "Te egy magyar nyelvi stíluselemző vagy." },
                    { role: "user", content: prompt }
                ]
            })
        });

        const data = await response.json();
        const analysis = data.choices[0].message.content;
        console.log("Analysis Text:", analysis); // Debugging statement

        // Extract scores from the analysis
        const scores = analysis.match(/(\d+)\/10/g);
        console.log("Scores:", scores); // Debugging statement

        if (!scores || scores.length === 0) {
            console.error("No scores found in the analysis text.");
            return { analysis, totalScore: 0 };
        }

        const totalScore = scores.map(score => parseInt(score, 10)).reduce((sum, score) => sum + score, 0) * 2; // Convert to a scale of 1-20

        return { analysis, totalScore };
    } catch (error) {
        console.error("Error analyzing insult:", error);
        return { analysis: "A beszólás elemzése jelenleg nem lehetséges.", totalScore: 0 };
    }
}
