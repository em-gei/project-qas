const util = require("util");
const { exec } = require("child_process");
const execProm = util.promisify(exec);

module.exports = {

    // Simulate Antivirus's behaviour, detect threats during executions
    isAnomaly: async function () {

        let outcome = false;
        await execProm('pgrep -f integrity.sh || pgrep -f dos-attack.sh || pgrep -f confidentiality.sh').then(res => {
            if (res != null) {
                outcome = true;
            }
            return outcome;
        }).catch(err => {
            return outcome;
        });

        return outcome;
        
    }
}