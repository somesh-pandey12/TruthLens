const Analysis = require('../models/Analysis');

exports.analyzeNews = async (req, res) => {
    try {
        const { newsText } = req.body;
        
        const fakeNewsResult = "Real/Fake status"; 

        const newAnalysis = new Analysis({ text: newsText, result: fakeNewsResult });
        await newAnalysis.save();

        res.status(200).json({ result: fakeNewsResult });
    } catch (error) {
        res.status(500).json({ error: "Analysis failed", details: error.message });
    }
};