// !====================================
// ! Test purposes
// !====================================

// ?====================================
// ? Add initial links to the list
// ?====================================

getLinks().then((links) => {
    links.data.forEach(link => {
        urls.mobile.push(link.mobile.url)
        urls.desktop.push(link.desktop.url)
    });

    return urls
}).then((urls) => {
    urls.mobile.forEach(async (url) => {

        // Get the base url
        const base_url = url.split("url=")[1].split("&")[0];

        if(!await checkReportExists(base_url, "mobile")) {
            await createNewReport(url).then(() => {
                urls.mobile.shift();
                completed.push({
                    url: url,
                    completedAt: new Date().toISOString().split('T')[0] + ' ' + new Date().toTimeString().split(' ')[0]
                });
            }).catch((err) => {
                console.error("Error while generating reports", err);
            })
        } else {
            urls.mobile.shift();
            completed.push({
                url: url,
                completedAt: new Date().toISOString().split('T')[0] + ' ' + new Date().toTimeString().split(' ')[0]
            });
            console.log('====================================');
            console.log("Report already exists, skipping...")
        }

        console.log('====================================');
        console.log('Finished gerating report');
        console.log('Remaining links to generate:', urls.mobile.length, 'links');
        console.log('Failed links:', failed.length, 'links');
        console.log('Completed links:', completed.length, 'links');
        console.log('====================================\n');

        if((urls.mobile.length === 0) && (urls.desktop.length === completed.length)) {
            console.log("All reports generated! Starting fetching desktop reports...\n");

            urls.desktop.forEach(async (url) => {

                // Get the base url
                const base_url = url.split("url=")[1].split("&")[0];
                if(await checkReportExists(base_url, "desktop")) {
                    await updateExistingReport(url).then(() => {
                        urls.desktop.shift();
                        completed.push({
                            url: url,
                            completedAt: new Date().toISOString().split('T')[0] + ' ' + new Date().toTimeString().split(' ')[0]
                        });
                    }).catch((err) => {
                        console.error("Error while generating reports", err);
                    })
                } else {
                    urls.desktop.shift();
                    completed.push({
                        url: url,
                        completedAt: new Date().toISOString().split('T')[0] + ' ' + new Date().toTimeString().split(' ')[0]
                    });
                    console.log('====================================');
                    console.log("Report already exists, skipping...");
                }

                console.log('====================================');
                console.log('Finished updating report');
                console.log('Remaining links to update:', urls.desktop.length, 'links');
                console.log('Failed links:', failed.length, 'links');
                console.log('Completed links:', completed.length, 'links');
                console.log('====================================\n');
            });
        }
    })
})

// ?====================================
// ? Seed the urls array
// ?====================================

// Seed the pending array
getLinks().then((links) => {
    links.data.forEach(link => {
        urls.mobile.push(link.mobile.url)
        urls.desktop.push(link.desktop.url)
    });
});

// Seed the pending array and generate reports after 10 seconds
getLinks().then((links) => {
    links.data.forEach(link => {
        urls.mobile.push(link.mobile.url)
        urls.desktop.push(link.desktop.url)
    });

    setTimeout(() => {
        forceGenerateReport();
    }, 10000);
});

// Seed the pending array and generate reports after 10 seconds then update them after 1 minute
getLinks().then((links) => {
    links.data.forEach(link => {
        urls.mobile.push(link.mobile.url)
        urls.desktop.push(link.desktop.url)
    });

    // Generate reports after 10 seconds
    setTimeout(() => {
        forceGenerateReport();
    }, 10000);

    // Retry after 1 minute
    setTimeout(() => {
        forceGenerateReport();
    }, 60000);
});

// ?====================================
// ? Seed the completed array
// ?====================================

// Current date
getLinks().then((links) => {
    links.data.forEach(link => {
        completed.push({
            url: link.mobile.url,
            completedAt: new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().split("T")[0] + ' ' + new Date().toTimeString().split(' ')[0],
        }, {
            url: link.desktop.url,
            completedAt: new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().split("T")[0] + ' ' + new Date().toTimeString().split(' ')[0],
        })
    });
});

// Randomize hours
getLinks().then((links) => {
    links.data.forEach(link => {
        completed.push({
            url: link.mobile.url,
            completedAt: seedHours()
        }, {
            url: link.desktop.url,
            completedAt: seedHours()
        })
    });
});

// Randomize dates
getLinks().then((links) => {
    links.data.forEach(link => {
        completed.push({
            url: link.mobile.url,
            completedAt: seedDate()
        }, {
            url: link.desktop.url,
            completedAt: seedDate()
        })
    });
});

// ?====================================
// ? Seed the failed array
// ?====================================

// Seed the failed array with random dates
getLinks().then((links) => {
    links.data.forEach(link => {
        failed.push({
            url: link.mobile.url,
            updatedAt: seedDate()
        }, {
            url: link.desktop.url,
            updatedAt: seedDate()
        })
    });
});

// Seed the failed array with random hours
getLinks().then((links) => {
    links.data.forEach(link => {
        failed.push({
            url: link.mobile.url,
            updatedAt: seedHours()
        }, {
            url: link.desktop.url,
            updatedAt: seedHours()
        })
    });
});

// Seed Raja links only
getLinks().then((links) => {
    links.data.forEach(link => {
        if(link.mobile.url.includes('raja')) {
            failed.push({
                url: link.mobile.url,
                updatedAt: seedHours()
            }, {
                url: link.desktop.url,
                updatedAt: seedHours()
            })
        }
    });
});

// Seed Other links only
getLinks().then((links) => {
    links.data.forEach(link => {
        if(!link.mobile.url.includes('raja')) {
            failed.push({
                url: link.mobile.url,
                updatedAt: seedHours()
            }, {
                url: link.desktop.url,
                updatedAt: seedHours()
            })
        }
    });
});


// const affiliates = await getAffiliates();
// for (const affiliate of affiliates.data.affiliates)
//     await generateReports(affiliate);

// Populate failed reports
// await getLinks().then((links) => {
//     links.data.forEach(link => {
//         failed.mobile.push({
//             url: link.mobile.url,
//             updatedAt: seedHours(),
//         });

//         failed.desktop.push({
//             url: link.desktop.url,
//             updatedAt: seedHours(),
//         });
//     });
// })