import { HumanMessage } from '@langchain/core/messages';
import { createAgent, providerStrategy } from 'langchain';
import { z } from 'zod';
import { cohereModel, geminiModel, mistralModel } from './model.service.js';
const ScoreBreakdownSchema = z.object({
    correctness: z.number().min(0).max(10),
    efficiency: z.number().min(0).max(10),
    readability: z.number().min(0).max(10),
    completeness: z.number().min(0).max(10),
    notes: z.string(),
});
const JudgeSchema = z.object({
    solution_1: ScoreBreakdownSchema,
    solution_2: ScoreBreakdownSchema,
    winner: z.enum(['solution_1', 'solution_2']),
    winner_explanation: z.string(),
});
const judgeModel = createAgent({
    model: geminiModel,
    tools: [],
    responseFormat: providerStrategy(JudgeSchema),
});
function buildJudgePrompt(problem, solution1, solution2) {
    return `
You are judging two competing solutions for the same programming task.
Score each solution from 0 to 10 in four categories: correctness, efficiency, readability, and completeness.
Return structured JSON only.

Programming task:
${problem}

Solution 1:
${solution1}

Solution 2:
${solution2}

Requirements:
- Provide a numeric score for each category.
- Add a brief note for each solution.
- Pick the overall winner.
- Write a short plain-English explanation for why the winner won.
`;
}
async function generateSolutions(userMessage) {
    const messages = [new HumanMessage(userMessage)];
    const [mistralRes, cohereRes] = await Promise.all([
        mistralModel.invoke(messages),
        cohereModel.invoke(messages),
    ]);
    return {
        mistral: String(mistralRes.content),
        cohere: String(cohereRes.content),
    };
}
async function judgeSolutions(problem, solution1, solution2) {
    const judgeResponse = await judgeModel.invoke({
        messages: [
            new HumanMessage(buildJudgePrompt(problem, solution1, solution2)),
        ],
    });
    return judgeResponse.structuredResponse;
}
function buildConversation(input, solution1, solution2, evaluation) {
    return [
        {
            role: 'user',
            content: input,
        },
        {
            role: 'assistant',
            content: `Mistral solution:\n${solution1}`,
        },
        {
            role: 'assistant',
            content: `Cohere solution:\n${solution2}`,
        },
        {
            role: 'assistant',
            content: `Judge winner: ${evaluation.winner}. ${evaluation.winner_explanation}`,
        },
    ];
}
export async function runBattle(userMessage) {
    const solutions = await generateSolutions(userMessage);
    const evaluation = await judgeSolutions(userMessage, solutions.mistral, solutions.cohere);
    return {
        input: userMessage,
        solutions,
        evaluation,
        conversation: buildConversation(userMessage, solutions.mistral, solutions.cohere, evaluation),
    };
}
export async function streamBattle(userMessage, onEvent) {
    onEvent({
        type: 'status',
        phase: 'generating',
        message: 'Generating both model solutions...',
    });
    const messages = [new HumanMessage(userMessage)];
    const solutions = { mistral: '', cohere: '' };
    const tasks = [
        mistralModel.invoke(messages).then((result) => {
            solutions.mistral = String(result.content);
            onEvent({ type: 'solution', model: 'mistral', text: solutions.mistral });
        }),
        cohereModel.invoke(messages).then((result) => {
            solutions.cohere = String(result.content);
            onEvent({ type: 'solution', model: 'cohere', text: solutions.cohere });
        }),
    ];
    await Promise.all(tasks);
    onEvent({
        type: 'status',
        phase: 'judging',
        message: 'Judging the two solutions...',
    });
    const evaluation = await judgeSolutions(userMessage, solutions.mistral, solutions.cohere);
    const result = {
        input: userMessage,
        solutions,
        evaluation,
        conversation: buildConversation(userMessage, solutions.mistral, solutions.cohere, evaluation),
    };
    onEvent({ type: 'judge', judge: evaluation });
    onEvent({ type: 'done', result });
    return result;
}
export { JudgeSchema };
