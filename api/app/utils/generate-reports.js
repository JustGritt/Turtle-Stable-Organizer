// Imports
const axios = require('axios');
const Report = require('../model/report.model.js');
const { updateDesktopReport } = require('../controllers/report.controller.js');

const failed = { mobile: [], desktop: [] };
exports.failed = failed;

// ====================================
// Utils
// ====================================
const dateOverride = new Date(new Date().getTime() - new Date().getTimezoneOffset() - (86400000 * 0)).toISOString().split("T")[0];

// Change API Keys if the limit is reached (429)
const changeAPIKey = async (api_key) => {
    const api_keys = [process.env.API_KEY_1, process.env.API_KEY_2, process.env.API_KEY_3];
    const index = api_keys.indexOf(api_key);
    return api_keys[index + 1] ? api_keys[index + 1] : api_keys[0];
}

// Check if all mobile reports are generated
const isMobileAllGenerated = async () => {
    const currentDate = dateOverride ? dateOverride : new Date(new Date().getTime() - new Date().getTimezoneOffset() - (86400000 * 0)).toISOString().split("T")[0];

    const reports = await axios.get(`${process.env.LOCAL_URL}/api/reports/date/${currentDate}`);
    const reportsFiltered = reports.data.filter(report => report.created_at === currentDate);
    if(reportsFiltered.length === 0) return false;

    // Check if the score is -1
    const allScoresValid = reportsFiltered.every(report => report.mobile.score !== -1);
    return allScoresValid;
};

// ====================================
// 0. Check if the report exists for the current strategy and url
// ====================================
exports.checkReportExists = async (url, strategy) => {
    const currentDate = dateOverride ? dateOverride : new Date(new Date().getTime() - new Date().getTimezoneOffset() - (86400000 * 1)).toISOString().split("T")[0];
    const reports = await axios.get(`${process.env.LOCAL_URL}/api/reports/date/${currentDate}`);

    // Quick exit if there are no reports generated today
    if(reports.data.length === 0) return false;

    // Check if the report exists
    const reportExists = reports.data.some((report) => {
        if((url.includes(report.url)) && (report.created_at === currentDate)) {

            // Check if the score is -1
            const scores = strategy === "mobile" ? report.mobile : report.desktop;
            const allScoresValid = Object.values(scores).every(score => score.score !== -1);
            return allScoresValid;
        }
        return false;
    });

    return reportExists;
}

// ====================================
// 1. Generate the report data from Lighthouse API
// ====================================
const getReportData = async (url, api_key) => {
    try {
        const response = await axios.get(url, {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            params: {
                key: api_key,
            }
        });

        // console.log("====================================")
        // console.log("Success with:", api_key);
        // console.log("[+] Report generated for", url.split("?url=")[1].split("&category=")[0], response.data);
        // console.log("====================================\n")

        return response.data;
    } catch (error) {
        if (error.response.status === 429) {
            console.log("API Limit reached, trying again with backup key");
            const backup_api_key = await changeAPIKey(api_key);
            return await getReportData(url, backup_api_key);
        } else {
            console.log("====================================")
            console.log("Failed with:", error.response.status, error.response.statusText);
            console.log("[=]", failed.length, "links failed so far.")
            console.log("====================================\n")

            if(!failed.mobile.includes(url) && !failed.desktop.includes(url)) {
                const strategy = url.includes("strategy=mobile") ? "mobile" : "desktop";
                console.log("strategy", strategy);

                if(strategy === "mobile") {
                    failed.mobile.push({
                        url: url,
                        updatedAt: new Date().toISOString().split('T')[0] + ' ' + new Date().toTimeString().split(' ')[0]
                    });
                } else {
                    failed.desktop.push({
                        url: url,
                        updatedAt: new Date().toISOString().split('T')[0] + ' ' + new Date().toTimeString().split(' ')[0]
                    });
                }
            }
            throw error;
        }
    }
}

// ====================================
// 2. Format the report data
// ====================================
const formatReportData = async (report, strategy, baseUrl, affiliate) => {

    // Get the report data
    const reportData = {
        country: baseUrl.split(".")[baseUrl.split(".").length - 1],
        url: baseUrl,
        affiliate: affiliate,
        created_at: dateOverride ? dateOverride : new Date(new Date().getTime() - new Date().getTimezoneOffset()).toISOString().split("T")[0],
    }

    // Get the score of each category
    const scores = {
        performance: { score: report.lighthouseResult.categories.performance.score },
        accessibility: { score: report.lighthouseResult.categories.accessibility.score },
        best_practices: { score: report.lighthouseResult.categories["best-practices"].score },
        seo: { score: report.lighthouseResult.categories.seo.score },
        pwa: { score: report.lighthouseResult.categories.pwa.score },
    }

    // Add the scores to the report data
    strategy === "mobile" ? reportData.mobile = { ...reportData.mobile, ...scores } : reportData.desktop = { ...reportData.desktop, ...scores };
    return reportData;
}

// ====================================
// 3. Generate the reports
// ====================================
exports.generateMobileReports = async (urls, affiliate) => {
    urls.mobile = urls.mobile.filter(url => url.includes(affiliate));

    const promises = urls.mobile.map(async (url) => {
        const baseUrl = url.split("?url=")[1].split("&category=")[0];
        const reportExists = await exports.checkReportExists(url, "mobile");

        // Quick exit if the report exists
        if(reportExists) {
            console.log("[Mobile] report already exists for", baseUrl);
            urls.mobile = urls.mobile.filter(url => !url.includes(baseUrl));
            return Promise.resolve();
        }

        // Get the report data from Lighthouse API
        console.log("Generating the report for", baseUrl, "with API key:", process.env.API_KEY_1);
        try {
            const report = await getReportData(url, process.env.API_KEY_1);
            const formattedReport = await formatReportData(report, "mobile", baseUrl, affiliate);

            console.log("====================================")
            console.log("[+] - Mobile report generated for", baseUrl);
            console.log("====================================\n")

            // Format the report data
            await Report.create(formattedReport);
        } catch (error) {
            console.log("Error while generating the report for", baseUrl, error);
        }
    });

    await Promise.all(promises);
    return;
}

// Wait for the mobile reports to be generated before generating the desktop ones (to avoid duplicates)
exports.generateDesktopReports = async (urls, affiliate) => {
    if(await isMobileAllGenerated()) {
        urls.desktop = urls.desktop.filter(url => url.includes(affiliate));
        const promises = urls.desktop.map(async (url) => {
            const baseUrl = url.split("?url=")[1].split("&category=")[0];
            const reportExists = await exports.checkReportExists(url, "desktop"); // Changed "mobile" to "desktop"

            // Quick exit if the report exists
            if(reportExists) {
                console.log("[Desktop] report already exists for", baseUrl);
                urls.desktop = urls.desktop.filter(url => !url.includes(baseUrl));
                return Promise.resolve();
            }

            // Get the report data from Lighthouse API
            console.log("Generating the report for", baseUrl, "with API key:", process.env.API_KEY_1);
            try {
                const report = await getReportData(url, process.env.API_KEY_1);
                const formattedReport = await formatReportData(report, "desktop", baseUrl, affiliate);

                console.log("====================================")
                console.log("[+] - Desktop report generated for", baseUrl);
                console.log("====================================\n")

                // Update the report data
                await updateDesktopReport(formattedReport);
            } catch (error) {
                console.log("Error while generating the report for", baseUrl, error);
            }

        });

        await Promise.all(promises);
        return;
    } else {
        console.log("Mobile reports are not generated yet for", affiliate);
        return;
    }
}