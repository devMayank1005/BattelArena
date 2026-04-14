import { runBattle } from './graph.ai.service.js';
const invokeGraph = async (query) => {
    return runBattle(query);
};
export { invokeGraph };
