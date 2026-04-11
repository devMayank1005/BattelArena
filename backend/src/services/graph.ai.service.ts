import { HumanMessage, AIMessage } from "@langchain/core/messages";
import {
  StateSchema,
  MessagesValue,
  ReducedValue,
  StateGraph,
  START,
  END,
} from "@langchain/langgraph";
import type { GraphNode } from "@langchain/langgraph";
import { z } from "zod";
import { mistralModel, cohereModel, geminiModel } from "./model.service.js";
import { createAgent, providerStrategy } from "langchain";

/**
 * -----------------------------
 * ZOD SCHEMAS (STRICT STRUCTURE)
 * -----------------------------
 */
const JudgeSchema = z.object({
  solution_1_score: z.number().min(0).max(10),
  solution_2_score: z.number().min(0).max(10),
  solution_1_reasoning: z.string(),
  solution_2_reasoning: z.string(),

  winner: z.enum(["solution_1", "solution_2"]),
});

/**
 * -----------------------------
 * STATE
 * -----------------------------
 */
const State = new StateSchema({
  messages: MessagesValue,

  problem: new ReducedValue (
    z.string().default(""),
    { reducer: (_, next) => next }
  ),
  

  solution_1: new ReducedValue(
    z.string().default(""),
    { reducer: (_, next) => next }
  ),

  solution_2: new ReducedValue(
    z.string().default(""),
    { reducer: (_, next) => next }
  ),

    judge: new ReducedValue(
      JudgeSchema.default({
        solution_1_score: 0,
        solution_2_score: 0,
        solution_1_reasoning: "",
        solution_2_reasoning: "",
        systemPrompt: `You are an impartial judge comparing two solutions to a problem.
  Score each solution from 0 to 10 based on its effectiveness, creativity, and relevance to the problem.
  Provide reasoning for each score.`,
        winner: "solution_1",
      }),
      { reducer: (_, next) => next }
    ),
});

/**
 * -----------------------------
 * NODE: SOLUTION GENERATOR
 * -----------------------------
 */
const solutionNode: GraphNode<typeof State> = async (state) => {
  console.log("🧠 Input Messages:", state.messages);

  const [mistralRes, cohereRes] = await Promise.all([
    mistralModel.invoke(state.messages),
    cohereModel.invoke(state.messages),
  ]);

  const sol1 = String(mistralRes.content);
  const sol2 = String(cohereRes.content);

  console.log("⚡ Mistral:", sol1);
  console.log("⚡ Cohere:", sol2);

  return {
    messages: [
      ...state.messages,
      new AIMessage(`Mistral: ${sol1}`),
      new AIMessage(`Cohere: ${sol2}`),
    ],
    solution_1: sol1,
    solution_2: sol2,
  };
};

/**
 * -----------------------------
 * NODE: JUDGE (LLM BASED)
 * -----------------------------
 */
const judgeNode: GraphNode<typeof State> = async (state) => {
  const { solution_1, solution_2 , problem} = state;
  const agent = createAgent({
    model: geminiModel,
    tools: [],
    responseFormat: providerStrategy(JudgeSchema),
  });

  const judgeResponse = await agent.invoke({
    messages: [
      new HumanMessage(`
Compare the following two solutions and score them from 0 to 10. and tell your reasoning why you have selcted that model.
Return structured JSON.

Solution 1:
${state.solution_1}

Solution 2:
${state.solution_2}
      `),
    ],
  });

  const result = judgeResponse.structuredResponse;

  console.log("🏆 Judge Result:", result);

  return {
    messages: [
      ...state.messages,
      new AIMessage(
        `Judge → S1: ${result.solution_1_score}, S2: ${result.solution_2_score}, Winner: ${result.winner}`
      ),
    ],
    judge: result,
  };
};

/**
 * -----------------------------
 * GRAPH
 * -----------------------------
 */
const graph = new StateGraph(State)
  .addNode("solution", solutionNode)
  .addNode("judgeNode", judgeNode) // ✅ renamed

  .addEdge(START, "solution")
  .addEdge("solution", "judgeNode")
  .addEdge("judgeNode", END)

  .compile();

/**
 * -----------------------------
 * ENTRY FUNCTION
 * -----------------------------
 */
export default async function runGraph(userMessage: string) {
  const result = await graph.invoke({
    messages: [new HumanMessage(userMessage)],
  });

  return {
    input: userMessage,

    solutions: {
      mistral: result.solution_1,
      cohere: result.solution_2,
    },

    evaluation: result.judge,

    conversation: result.messages.map((m) => ({
      type: m._getType(),
      content: m.content,
    })),
  };
}