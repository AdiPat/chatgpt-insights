/**
 * @file insight-engine.ts
 * @author AdiPat 🚀
 * @description The core engine that analyzes ChatGPT conversations and generates insights.
 * Think of it as your personal data detective 🔍, but for chat conversations!
 *
 * Features:
 * - Name detection from conversations 🎯
 * - PDF report generation 📊
 * - Conversation analysis 🤖
 * - Insights extraction 💡
 *
 * @version 1.0.0
 * @date March 2024
 *
 * Fun fact: This engine processes more messages than your average group chat!
 * And unlike your friends, it actually reads everything 😉
 */

import PDFDocument from "pdfkit";
import { ChatGTPConversations, ChatGPTInsightsReport } from "../models";
import { NameDetector } from "./name-detector";
import { PromptConsultant } from "./prompt-consultant";

/**
 * Main engine class for generating insights from ChatGPT conversations.
 * It's like a fortune teller, but for your chat history! 🔮
 */
export class InsightEngine {
  private conversations: ChatGTPConversations;
  private nameDetector: NameDetector;
  private promptConsultant: PromptConsultant;
  /**
   * Creates a new instance of the InsightEngine.
   * @param conversations - Array of ChatGPT conversations to analyze
   */
  constructor(conversations: ChatGTPConversations) {
    this.conversations = conversations;
    this.nameDetector = new NameDetector(conversations);
    this.promptConsultant = new PromptConsultant(conversations);
  }

  /**
   * Generates a comprehensive insights report from the conversations.
   * Warning: May contain traces of artificial intelligence! 🤖
   * @returns {Promise<ChatGPTInsightsReport>} The generated insights report
   */
  public async generateReport(): Promise<ChatGPTInsightsReport> {
    return {
      user_name: await this.nameDetector.detectName(),
      suggestions: await this.promptConsultant.analyzeAllPrompts(),
      user_analysis: {
        overview: {
          total_chats: this.conversations.length,
          total_words_used: 0,
          total_prompts: 0,
          average_prompt_length: 0,
          average_response_length: 0,
          most_active_days: [],
          most_active_hours: [],
        },
        topics_analysis: {
          most_frequent_topics: [],
          topic_histogram: {},
        },
        prompting_style: {
          common_phrases: [],
          average_prompt_tone: "Neutral",
          most_used_keywords: [],
          query_complexity_distribution: { simple: 0, moderate: 0, complex: 0 },
          prompt_efficiency: {
            average_follow_up_prompts: 0,
            percentage_prompts_needing_rephrasing: 0,
          },
        },
        sentiment_analysis: {
          overall_sentiment: "Neutral",
          sentiment_distribution: { positive: 0, neutral: 0, negative: 0 },
          common_positive_topics: [],
          common_negative_topics: [],
        },
        response_quality: {
          average_response_relevance: 0,
          common_feedback_keywords: [],
          most_helpful_topics: [],
          least_helpful_topics: [],
        },
        interaction_patterns: {
          usage_frequency: {
            daily_average: 0,
            weekly_average: 0,
            monthly_average: 0,
          },
          time_of_day_preference: {
            morning: 0,
            afternoon: 0,
            evening: 0,
            night: 0,
          },
          conversation_length_distribution: { short: 0, medium: 0, long: 0 },
        },
        advanced_insights: {
          emerging_interest: {
            topic: "",
            increase_in_prompts: 0,
            time_period: "",
          },
          redundant_queries: 0,
          most_improved_topic_knowledge: "",
          topic_diversity_score: 0,
        },
        communication_effectiveness: {
          response_clarity_score: 0,
          length_matching: { short_prompts: 0, long_prompts: 0 },
        },
        ai_utilization_patterns: {
          task_based_analysis: {
            problem_solving: 0,
            creative_exploration: 0,
            knowledge_inquiry: 0,
          },
          dependency_index: 0,
        },
        personalization_metrics: {
          tone_alignment: { preferred_tone: "", alignment_percentage: 0 },
        },
        diversity_metrics: {
          language_usage: {
            primary_language: "English",
            other_languages: [],
            percentage_non_primary_language: 0,
          },
          cross_disciplinary_interests: {
            science: 0,
            art: 0,
            business: 0,
            miscellaneous: 0,
          },
        },
        errors_and_ambiguities: {
          misunderstood_queries: 0,
          percentage_prompts_with_errors: 0,
          common_error_causes: [],
        },
      },
      visualizations: {
        topic_histogram_url: "",
        usage_timeline_url: "",
        dynamic_word_cloud_url: "",
        response_time_chart_url: "",
      },
      recommendations: {
        tips_to_improve: [],
        suggested_topics_to_explore: [],
        recommended_interaction_changes: [],
        experimentation_suggestions: [],
      },
    };
  }

  /**
   * Generates a PDF report from the insights.
   * Making PDFs great again! 📄✨
   * @param report - The insights report to convert to PDF
   * @returns {Promise<Buffer>} The generated PDF as a buffer
   */
  public async generatePDF(report: ChatGPTInsightsReport): Promise<Buffer> {
    const doc = new PDFDocument();
    const chunks: Buffer[] = [];

    doc.on("data", (chunk) => chunks.push(chunk));

    // Title and Introduction
    doc
      .fontSize(24)
      .text(`ChatGPT Insights Report`, { align: "center" })
      .moveDown()
      .fontSize(18)
      .text(`Hi ${report.user_name}!`, { align: "center" })
      .moveDown()
      .fontSize(12)
      .text("Here's your personalized analysis of ChatGPT interactions.", {
        align: "center",
      })
      .moveDown(2);

    // Overview Section
    doc
      .fontSize(16)
      .text("Overview", { underline: true })
      .moveDown()
      .fontSize(12)
      .text(`Total Chats: ${report.user_analysis.overview.total_chats}`)
      .text(`Total Words: ${report.user_analysis.overview.total_words_used}`)
      .text(`Total Prompts: ${report.user_analysis.overview.total_prompts}`)
      .moveDown(2);

    // Suggestions Section
    if (report.suggestions && report.suggestions.length > 0) {
      doc
        .fontSize(16)
        .text("Prompt Improvement Suggestions", { underline: true })
        .moveDown()
        .fontSize(12);

      report.suggestions.forEach((suggestion, index) => {
        doc.text(`${index + 1}. ${suggestion}`).moveDown(0.5);
      });
      doc.moveDown();
    }

    // Recommendations Section
    doc
      .fontSize(16)
      .text("Recommendations", { underline: true })
      .moveDown()
      .fontSize(12);

    // Tips to Improve
    if (report.recommendations.tips_to_improve.length > 0) {
      doc.text("Tips to Improve:").moveDown(0.5);
      report.recommendations.tips_to_improve.forEach((tip, index) => {
        doc.text(`• ${tip}`).moveDown(0.5);
      });
      doc.moveDown();
    }

    // Topics to Explore
    if (report.recommendations.suggested_topics_to_explore.length > 0) {
      doc.text("Suggested Topics:").moveDown(0.5);
      report.recommendations.suggested_topics_to_explore.forEach(
        (topic, index) => {
          doc.text(`• ${topic}`).moveDown(0.5);
        }
      );
      doc.moveDown();
    }

    // Footer
    doc
      .fontSize(10)
      .text("Generated by ChatGPT Insights - ShinCy Labs 🚀", {
        align: "center",
      })
      .moveDown()
      .text(`Generated on: ${new Date().toLocaleDateString()}`, {
        align: "center",
      });

    doc.end();

    return new Promise((resolve) => {
      doc.on("end", () => {
        resolve(Buffer.concat(chunks));
      });
    });
  }
}
