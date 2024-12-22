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

import { writeFile } from "fs/promises";
import puppeteer from "puppeteer";
import { ChatGTPConversations, ChatGPTInsightsReport } from "../models";
import { NameDetector } from "./name-detector.js";
import { PromptConsultant } from "./prompt-consultant.js";

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
    const userName = await this.nameDetector.detectName();
    const suggestions = await this.promptConsultant.analyzeAllPrompts();

    if (suggestions.length === 0) {
      console.log("No suggestions found");
      console.log(suggestions);
    } else {
      console.log("Suggestions found");
      console.log(suggestions);
    }

    // Generate some default suggestions if none are available
    const defaultSuggestions = [
      "Try using more specific keywords in your prompts",
      "Break down complex questions into smaller parts",
      "Include context when switching topics",
      "Review ChatGPT's response before asking follow-up questions",
      "Use system prompts to set context for complex tasks",
    ];

    const finalSuggestions =
      suggestions.length > 0 ? suggestions : defaultSuggestions;

    console.log("Final suggestions: ", finalSuggestions.length);

    return {
      user_name: userName,
      suggestions: finalSuggestions,
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

  public generateHTML(report: ChatGPTInsightsReport): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ChatGPT Insights Report - ${report.user_name}</title>
    <style>
        :root {
            --primary: #00ffff;
            --secondary: #00cccc;
            --text: #ffffff;
            --muted: #888888;
            --bg: #000000;
            --card-bg: #111111;
        }
        
        body {
            font-family: system-ui, -apple-system, sans-serif;
            line-height: 1.6;
            color: var(--text);
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
            background: var(--bg);
        }
        
        h1, h2, h3 {
            color: var(--primary);
            font-weight: 600;
        }
        
        .header {
            text-align: center;
            margin-bottom: 3rem;
            padding: 2rem;
            background: var(--card-bg);
            border-radius: 12px;
            border-bottom: 4px solid var(--primary);
        }
        
        .stat-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 1.5rem;
            margin: 2rem 0;
        }
        
        .stat-card {
            background: var(--card-bg);
            padding: 1.5rem;
            border-radius: 12px;
            box-shadow: 0 2px 4px rgba(0,255,255,0.1);
            border-left: 4px solid var(--primary);
        }
        
        .stat-value {
            font-size: 2rem;
            font-weight: bold;
            color: var(--primary);
            margin-bottom: 0.5rem;
        }
        
        .stat-label {
            color: var(--text);
            font-size: 0.9rem;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .tag {
            display: inline-block;
            padding: 0.25rem 0.75rem;
            background: var(--primary);
            color: var(--bg);
            border-radius: 20px;
            font-size: 0.85rem;
            margin: 0.25rem;
        }
        
        .suggestions {
            list-style-type: none;
            padding: 0;
        }
        
        .suggestions li {
            margin: 0.75rem 0;
            padding: 1rem;
            background: var(--card-bg);
            border-radius: 8px;
            border-left: 4px solid var(--primary);
            color: var(--text);
        }
        
        .section-title {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            margin: 2rem 0 1rem;
        }
        
        footer {
            text-align: center;
            margin-top: 4rem;
            padding: 2rem;
            color: var(--muted);
            border-top: 1px solid var(--card-bg);
        }

        .progress-bar {
            width: 100%;
            height: 8px;
            background: var(--card-bg);
            border-radius: 4px;
            overflow: hidden;
        }

        .progress-value {
            height: 100%;
            background: var(--primary);
            transition: width 0.3s ease;
        }

        .suggestion-bullet {
            color: var(--primary);
            font-weight: bold;
            margin-right: 0.5rem;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>✨ ChatGPT Insights Report</h1>
        <p>Generated for ${report.user_name}</p>
        <p>${new Date().toLocaleDateString()}</p>
    </div>

    <section>
        <div class="section-title">
            <h2>📊 Overview</h2>
        </div>
        <div class="stat-grid">
            <div class="stat-card">
                <div class="stat-value">${report.user_analysis.overview.total_chats.toLocaleString()}</div>
                <div class="stat-label">Total Conversations</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${report.user_analysis.overview.total_prompts.toLocaleString()}</div>
                <div class="stat-label">Total Prompts</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${report.user_analysis.overview.total_words_used.toLocaleString()}</div>
                <div class="stat-label">Total Words</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${
                  report.user_analysis.overview.average_prompt_length
                }</div>
                <div class="stat-label">Avg. Prompt Length</div>
            </div>
        </div>
    </section>

    <section>
        <div class="section-title">
            <h2> Activity Patterns</h2>
        </div>
        <div class="stat-grid">
            <div class="stat-card">
                <h3>Most Active Days</h3>
                <p>${report.user_analysis.overview.most_active_days.join(
                  ", "
                )}</p>
            </div>
            <div class="stat-card">
                <h3>Peak Hours</h3>
                <p>${report.user_analysis.overview.most_active_hours.join(
                  ", "
                )}</p>
            </div>
        </div>
    </section>

    <section>
        <div class="section-title">
            <h2>💭 Prompting Style</h2>
        </div>
        <div class="stat-grid">
            <div class="stat-card">
                <h3>Common Phrases</h3>
                <div>
                    ${report.user_analysis.prompting_style.common_phrases
                      .map((phrase) => `<span class="tag">${phrase}</span>`)
                      .join("")}
                </div>
            </div>
            <div class="stat-card">
                <h3>Most Used Keywords</h3>
                <div>
                    ${report.user_analysis.prompting_style.most_used_keywords
                      .map((keyword) => `<span class="tag">${keyword}</span>`)
                      .join("")}
                </div>
            </div>
        </div>
        <div class="stat-card">
            <h3>Prompt Efficiency</h3>
            <p>Average Follow-up Prompts: ${report.user_analysis.prompting_style.prompt_efficiency.average_follow_up_prompts.toFixed(
              2
            )}</p>
            <div class="progress-bar">
                <div class="progress-value" style="width: ${
                  report.user_analysis.prompting_style.prompt_efficiency
                    .percentage_prompts_needing_rephrasing
                }%"></div>
            </div>
            <p>Rephrasing Needed: ${report.user_analysis.prompting_style.prompt_efficiency.percentage_prompts_needing_rephrasing.toFixed(
              1
            )}%</p>
        </div>
    </section>

    <section>
        <div class="section-title">
            <h2>💡 Suggestions for Improvement</h2>
        </div>
        <div class="stat-card">
            <ul class="suggestions">
                ${report.suggestions
                  .map(
                    (suggestion) => `
                    <li>
                        <span class="suggestion-bullet">•</span>
                        ${suggestion}
                    </li>
                `
                  )
                  .join("")}
            </ul>
        </div>
    </section>

    <section>
        <div class="section-title">
            <h2>🎯 Recommendations</h2>
        </div>
        <div class="stat-grid">
            <div class="stat-card">
                <h3>Topics to Explore</h3>
                ${report.recommendations.suggested_topics_to_explore
                  .map((topic) => `<span class="tag">${topic}</span>`)
                  .join("")}
            </div>
            <div class="stat-card">
                <h3>Interaction Changes</h3>
                <ul class="suggestions">
                    ${report.recommendations.recommended_interaction_changes
                      .map((change) => `<li>${change}</li>`)
                      .join("")}
                </ul>
            </div>
        </div>
    </section>

    <footer>
        <p>Generated by ChatGPT Insights - ShinCy Labs 🚀</p>
        <p>Making AI more explainable, one chat at a time! ✨</p>
        <p>${new Date().toLocaleString()}</p>
    </footer>
</body>
</html>
    `;
  }

  private async convertHTMLToPDF(html: string): Promise<Buffer> {
    const browser = await puppeteer.launch();
    try {
      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: "networkidle0" });
      await page.addStyleTag({
        content: `
          @page { margin-bottom: 50px; }
          .footer { position: fixed; bottom: 0; width: 100%; padding: 10px; text-align: center; }
        `,
      });

      const pdfBuffer = await page.pdf({
        format: "A4",
        printBackground: true,
        margin: { top: "20mm", right: "20mm", bottom: "20mm", left: "20mm" },
        displayHeaderFooter: true,
        footerTemplate: `
          <div style="font-size: 10px; text-align: center; width: 100%;">
            <span class="pageNumber"></span> of <span class="totalPages"></span>
          </div>
        `,
      });

      return Buffer.from(pdfBuffer);
    } finally {
      await browser.close();
    }
  }

  public async writeReportToFile(report: ChatGPTInsightsReport): Promise<void> {
    const timestamp = Date.now();
    const html = this.generateHTML(report);

    const htmlFilename = `insights-${timestamp}.html`;
    await writeFile(htmlFilename, html, "utf-8");
    console.log(`HTML report written to ${htmlFilename}`);

    const pdf = await this.convertHTMLToPDF(html);
    const pdfFilename = `insights-${timestamp}.pdf`;
    await writeFile(pdfFilename, pdf);
    console.log(`PDF report written to ${pdfFilename}`);
  }
}
