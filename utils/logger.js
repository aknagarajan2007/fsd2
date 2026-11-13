// -------------------- Console colors --------------------

const COLOR = {
    reset: '\x1b[0m',
    white: '\x1b[97m',
    green: '\x1b[92m',
    red: '\x1b[91m',
    yellow: '\x1b[93m',
    cyan: '\x1b[96m',
    gray: '\x1b[90m'
};

// -------------------- Status logger --------------------

function status(label, message, color = COLOR.white) {
    const name = `[${label}]`.padEnd(12);

    console.log(
        `${COLOR.white}${name}${COLOR.reset}: ${color}${message}${COLOR.reset}`
    );
}

// -------------------- Heading logger --------------------

function heading(message) {
    console.log(`\n${COLOR.white}==================================================`);
    console.log(`                 ${message}`);
    console.log(`==================================================${COLOR.reset}\n`);
}

// -------------------- Export --------------------

module.exports = {
    COLOR,
    status,
    heading
};