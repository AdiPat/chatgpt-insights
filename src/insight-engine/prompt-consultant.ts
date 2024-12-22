/**
 * @file prompt-consultant.ts
 * @author AdiPat 🚀
 * @company ShinCy Labs 🔬
 * @description Analyzes user prompts to understand patterns and provide insights.
 * Like a prompt whisperer, but for AI! 🤫
 *
 * Features:
 * - Prompt extraction 📝
 * - Pattern analysis 🔍
 * - Style detection 🎨
 * - Quality scoring 📊
 *
 * @version 1.0.0
 * @date March 2024
 *
 * Fun fact: This consultant has seen more prompts than
 * a writing professor during finals week! 📚
 */

import { z } from "zod";
import { ChatGTPConversations } from "../models/conversation.model";
import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";

/**
 * Analyzes and provides insights about user's prompting patterns.
 * Think of it as your personal prompt style coach! 🎯
 */
export class PromptConsultant {
  private conversations: ChatGTPConversations;
  private DEFAULT_PROMPT_COUNT = 10;
  /**
   * Creates a new instance of PromptConsultant.
   * @param conversations - The conversations to analyze
   */
  constructor(conversations: ChatGTPConversations) {
    this.conversations = conversations;
  }

  /**
   * Extracts all user prompts from conversations.
   * Like mining for conversational gold! ⛏️
   * @private
   * @returns {string[]} Array of user prompts, cleaned and filtered
   */
  private extractUserPrompts(): string[] {
    return this.conversations.flatMap((conversation) =>
      Object.values(conversation.mapping)
        .filter((node) => node.message?.author.role === "user")
        .map((node) =>
          node
            .message!.content.parts.filter((part) => typeof part === "string")
            .join(" ")
            .trim()
        )
        .filter((prompt) => prompt.length > 0)
    );
  }

  /**
   * Analyzes a single prompt for improvement suggestions.
   * Our AI writing coach in action! 🎓
   * @private
   * @param prompt - The prompt to analyze
   * @returns {Promise<string[]>} Array of improvement suggestions
   */
  private async analyzePrompt(prompt: string): Promise<string[]> {
    const { object } = await generateObject({
      model: openai("gpt-4o"),
      schema: z.object({ suggestions: z.array(z.string()) }),
      prompt: `Analyze the following prompt: ${prompt}.
            Suggest how this prompt can be improved to support the goals of Explainable AI.
            Our goal is to make AI more transparent and understandable.
            We want to help our users prompt AI systems better.
            Take into account all factors and come up with at most 5 suggestions.`,
    });
    return object.suggestions;
  }

  /**
   * Analyzes all prompts and returns top suggestions.
   * The grand finale of our prompt analysis! 🎭
   * @public
   * @returns {Promise<string[]>} Array of top improvement suggestions
   */
  public async analyzeAllPrompts(): Promise<string[]> {
    const allPrompts = this.extractUserPrompts();
    const prompts = allPrompts.slice(0, this.DEFAULT_PROMPT_COUNT);
    const suggestions = [];

    for (const prompt of prompts) {
      const suggestion = await this.analyzePrompt(prompt);
      suggestions.push(...suggestion);
    }

    // Randomize and limit suggestions
    const randomSuggestions = suggestions.sort(() => Math.random() - 0.5);
    const topSuggestions = randomSuggestions.slice(
      0,
      randomSuggestions.length > 5
        ? Math.min(randomSuggestions.length, 10)
        : randomSuggestions.length
    );

    return topSuggestions;
  }
}
