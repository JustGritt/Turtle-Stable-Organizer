// Generate a random date for testing purposes
exports.seedDate = () => {

    // Generate date
    let year = 2023;
    let month = Math.floor(Math.random() * 12) + 1;
    month = month < 10 ? '0' + month : month;
    let day = Math.floor(Math.random() * 30) + 1;
    day = day < 10 ? '0' + day : day;

    // Generate time
    let hour = Math.floor(Math.random() * 24);
    hour = hour < 10 ? '0' + hour : hour;
    let minute = Math.floor(Math.random() * 60);
    minute = minute < 10 ? '0' + minute : minute;
    let second = Math.floor(Math.random() * 60);
    second = second < 10 ? '0' + second : second;

    return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
}

exports.seedHours = () => {

    // Current date
    let year = new Date().getFullYear();
    let month = new Date().getMonth() + 1;
    month = month < 10 ? '0' + month : month;
    let day = new Date().getDate();
    day = day < 10 ? '0' + day : day;

    // Randomize hours (max should be the current time)
    let hour = Math.floor(Math.random() * new Date().getHours() + 1);
    hour = hour < 10 ? '0' + hour : hour;
    let minute = Math.floor(Math.random() * 60);
    minute = minute < 10 ? '0' + minute : minute;
    let second = Math.floor(Math.random() * 60);
    second = second < 10 ? '0' + second : second;

    return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
}