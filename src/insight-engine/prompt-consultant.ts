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
   * Analyzes all prompts and returns top suggestions.
   * The grand finale of our prompt analysis! 🎭
   * @public
   * @returns {Promise<string[]>} Array of top improvement suggestions
   */
  public async analyzeAllPrompts(): Promise<string[]> {
    const prompts = this.extractUserPrompts();

    if (prompts.length === 0) {
      console.log("No prompts found to analyze");
      return [];
    }

    try {
      const { object } = await generateObject({
        model: openai("gpt-4o"),
        schema: z.object({
          suggestions: z.array(z.string()),
        }),
        prompt: `Analyze these user prompts and provide 5 specific suggestions for improvement:
          
          ${prompts.slice(0, 10).join("\n")}
          
          Focus on:
          1. Clarity and specificity
          2. Structure and organization
          3. Context provision
          4. Technical accuracy
          5. Best practices
          
          Provide actionable, specific suggestions.`,
      });

      console.log("Generated suggestions:", object.suggestions);
      return object.suggestions;
    } catch (error) {
      console.error("Error generating suggestions:", error);
      return [];
    }
  }
}
