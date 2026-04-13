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

export type JudgeResult = z.infer<typeof JudgeSchema>;

export type BattleResult = {
  input: string;
  solutions: {
    mistral: string;
    cohere: string;
  };
  evaluation: JudgeResult;
  conversation: Array<{
    role: 'user' | 'assistant' | 'system';
    content: string;
  }>;
};

export type BattleEvent =
  | { type: 'status'; phase: 'generating' | 'judging'; message: string }
  | { type: 'solution'; model: 'mistral' | 'cohere'; text: string }
  | { type: 'judge'; judge: JudgeResult }
  | { type: 'done'; result: BattleResult };

const judgeModel = createAgent({
  model: geminiModel,
  tools: [],
  responseFormat: providerStrategy(JudgeSchema),
});

function buildJudgePrompt(problem: string, solution1: string, solution2: string) {
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

async function generateSolutions(userMessage: string) {
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

async function judgeSolutions(
  problem: string,
  solution1: string,
  solution2: string,
): Promise<JudgeResult> {
  const judgeResponse = await judgeModel.invoke({
    messages: [
      new HumanMessage(buildJudgePrompt(problem, solution1, solution2)),
    ],
  });

  return judgeResponse.structuredResponse as JudgeResult;
}

function buildConversation(input: string, solution1: string, solution2: string, evaluation: JudgeResult) {
  return [
    {
      role: 'user' as const,
      content: input,
    },
    {
      role: 'assistant' as const,
      content: `Mistral solution:\n${solution1}`,
    },
    {
      role: 'assistant' as const,
      content: `Cohere solution:\n${solution2}`,
    },
    {
      role: 'assistant' as const,
      content: `Judge winner: ${evaluation.winner}. ${evaluation.winner_explanation}`,
    },
  ];
}

export async function runBattle(userMessage: string): Promise<BattleResult> {
  const solutions = await generateSolutions(userMessage);
  const evaluation = await judgeSolutions(userMessage, solutions.mistral, solutions.cohere);

  return {
    input: userMessage,
    solutions,
    evaluation,
    conversation: buildConversation(userMessage, solutions.mistral, solutions.cohere, evaluation),
  };
}

export async function streamBattle(
  userMessage: string,
  onEvent: (event: BattleEvent) => void,
): Promise<BattleResult> {
  onEvent({
    type: 'status',
    phase: 'generating',
    message: 'Generating both model solutions...',
  });

  const messages = [new HumanMessage(userMessage)];
  const solutions: { mistral: string; cohere: string } = { mistral: '', cohere: '' };

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
