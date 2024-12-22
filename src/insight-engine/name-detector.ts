/**
 * @file name-detector.ts
 * @author AdiPat 🚀
 * @company ShinCy Labs 🔬
 * @description Advanced name detection engine for ChatGPT conversations.
 * Uses AI-powered analysis to find and verify user names in chat history.
 *
 * Features:
 * - AI-powered name detection 🤖
 * - Multi-chunk analysis 📚
 * - Smart name verification ✨
 * - Confidence scoring 📊
 *
 * @version 1.0.0
 * @date March 2024
 *
 * Fun fact: This detector is so good at finding names,
 * it could probably find Waldo in a crowd! 🔍
 */

import { ChatGTPConversations } from "../models/conversation.model";
import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";

/**
 * Advanced name detection engine that uses AI to find user names in conversations.
 * Like having a super-smart assistant who's really good with names! 🎯
 */
export class NameDetector {
  private conversations: ChatGTPConversations;
  /**
   * Default number of chunks to process.
   * Good chance, that the first 10 messages are the most relevant and the name is in there.
   */
  private DEFAULT_CHUNKS_TO_PROCESS = 10;

  /**
   * Creates a new instance of the NameDetector.
   * @param conversations - The ChatGPT conversations to analyze
   */
  constructor(conversations: ChatGTPConversations) {
    this.conversations = conversations;
  }

  /**
   * Public method to detect user's name from conversations.
   * The main entry point for name detection magic! ✨
   * @returns {Promise<string>} The detected name
   */
  public async detectName(): Promise<string> {
    return this.extractUserName();
  }

  /**
   * Extracts all user messages from conversations.
   * Like panning for gold, but we're looking for names! ⛏️
   * @returns {string} Concatenated user messages
   */
  private getUserMessages(): string {
    return this.conversations
      .flatMap((conversation) =>
        Object.values(conversation.mapping)
          .filter((node) => node.message?.author.role === "user")
          .map((node) =>
            node
              .message!.content.parts.filter((part) => typeof part === "string")
              .join(" ")
          )
      )
      .join("\n");
  }

  /**
   * Uses AI to extract name from a chunk of conversation.
   * Our AI detective at work! 🕵️‍♂️
   * @param chunk - The conversation chunk to analyze
   * @returns {Promise<string>} The extracted name
   */
  private async extractUserNameFromChunk(chunk: string): Promise<string> {
    const { object } = await generateObject({
      model: openai("gpt-4o"),
      schema: z.object({ name: z.string() }),
      prompt: `Extract the user's name from the following conversation: ${chunk}`,
    });

    return object.name;
  }

  /**
   * Collects all probable names from conversation chunks.
   * Like gathering clues for our name investigation! 🔍
   * @param messageChunks - Array of conversation chunks
   * @returns {Promise<string[]>} Array of probable names
   */
  private async getAllProbableNames(
    messageChunks: string[]
  ): Promise<string[]> {
    console.log("Found ", messageChunks.length, " chunks");

    const names = [];

    for (const chunk of messageChunks) {
      const name = await this.extractUserNameFromChunk(chunk);

      if (name) {
        names.push(name);
      }
    }

    return names;
  }

  /**
   * Splits messages into manageable chunks for processing.
   * Like slicing a cake, but for conversations! 🍰
   * @param messages - The messages to chunk
   * @param chunkSize - Size of each chunk
   * @returns {string[]} Array of message chunks
   */
  private createMessageChunks(messages: string, chunkSize = 1000): string[] {
    const chunks = [];
    for (let i = 0; i < messages.length; i += chunkSize) {
      chunks.push(messages.slice(i, i + chunkSize));
    }
    return chunks;
  }

  /**
   * Main name extraction orchestrator.
   * The mastermind behind our name detection operation! 🧠
   * @returns {Promise<string>} The final detected name
   */
  private async extractUserName(): Promise<string> {
    const userMessages = this.getUserMessages();
    const allMessageChunks = this.createMessageChunks(userMessages);
    console.log("Found ", allMessageChunks.length, " chunks.");
    const messageChunks = allMessageChunks.slice(
      0,
      this.DEFAULT_CHUNKS_TO_PROCESS
    );
    console.log("Processing ", messageChunks.length, " chunks.");
    const names = await this.getAllProbableNames(messageChunks);
    console.log("Found ", names.length, " names.");
    const name = await this.detectCorrectUsernameFromProbableNames(names);
    console.log("Detected name: ", name);
    return name;
  }

  /**
   * Uses AI to determine the most likely correct name.
   * The final verdict from our AI judge! ⚖️
   * @param names - Array of candidate names
   * @returns {Promise<string>} The most likely correct name
   */
  private async detectCorrectUsernameFromProbableNames(
    names: string[]
  ): Promise<string> {
    const { object } = await generateObject({
      model: openai("gpt-4o"),
      schema: z.object({ name: z.string() }),
      prompt: `Given a list of probable names we extracted from the conversation, which one is the most likely to be the user's name: ${names.join(
        "\n"
      )}`,
    });
    return object.name;
  }
}
