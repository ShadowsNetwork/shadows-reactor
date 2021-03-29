/**
 * Converts a string into a hex representation of bytes32, with right padding
 */
function loadDeploymentFile(network) {
    return require(`../../../contract/publish/deployed/${network}/deployment.json`);
}
function getTarget(network = 'mainnet', contract) {
    const deployment = loadDeploymentFile(network);
    if (contract)
        return deployment.targets[contract];
    return deployment.targets;
}
const getSource = (network = 'mainnet', contract) => {
    const deployment = loadDeploymentFile(network);
    if (contract)
        return deployment.sources[contract];
    return deployment.sources;
};
const getSynths = ({ network = 'mainnet' } = {}) => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const synths = require(`../../../contract/publish/deployed/${network}/synths.json`);
    // copy all necessary index parameters from the longs to the corresponding shorts
    return synths.map((synth) => {
        if (typeof synth.index === 'string') {
            const { index } = synths.find(({ name }) => name === synth.index) || {};
            if (!index) {
                throw Error(`While processing ${synth.name}, it's index mapping "${synth.index}" cannot be found - this is an error in the deployment config and should be fixed`);
            }
            return {
                ...synth,
                index
            };
        }
        return synth;
    });
};
export { getTarget, getSource, getSynths };
//# sourceMappingURL=utils.js.map