import { runBattle } from './graph.ai.service.js';

const invokeGraph = async (query: string) => {
  return runBattle(query);
};

export { invokeGraph };