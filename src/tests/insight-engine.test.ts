import { expect, test, describe } from "vitest";
import { InsightEngine } from "../insight-engine/insight-engine.js";
import { ChatGTPConversations, Conversation } from "../models";

describe("InsightEngine", () => {
  const mockConversation: Conversation = {
    title: "Test Conversation",
    create_time: 1234567890,
    update_time: 1234567890,
    mapping: {},
    moderation_results: [],
    current_node: "test-node",
    plugin_ids: null,
    conversation_id: "test-id",
    conversation_template_id: null,
    gizmo_id: null,
    gizmo_type: null,
    is_archived: false,
    is_starred: null,
    safe_urls: [],
    default_model_slug: "gpt-4",
    conversation_origin: null,
    voice: null,
    async_status: null,
    disabled_tool_ids: [],
    id: "test-id",
  };

  const mockConversations: ChatGTPConversations = [mockConversation];

  test("should initialize with conversations", () => {
    const engine = new InsightEngine(mockConversations);
    expect(engine).toBeDefined();
  });

  test("should generate report with basic structure", async () => {
    const engine = new InsightEngine(mockConversations);
    const report = await engine.generateReport();

    // Check basic structure
    expect(report).toHaveProperty("user_name");
    expect(report).toHaveProperty("user_analysis");
    expect(report).toHaveProperty("visualizations");
    expect(report).toHaveProperty("recommendations");
    expect(report).toHaveProperty("suggestions");
  });

  test("should generate basic overview stats", async () => {
    const engine = new InsightEngine(mockConversations);
    const report = await engine.generateReport();

    expect(report.user_analysis.overview.total_chats).toBe(1);
    expect(
      report.user_analysis.overview.total_words_used
    ).toBeGreaterThanOrEqual(0);
    expect(report.user_analysis.overview.total_prompts).toBeGreaterThanOrEqual(
      0
    );
  });

  test("should initialize empty topics analysis", async () => {
    const engine = new InsightEngine(mockConversations);
    const report = await engine.generateReport();

    expect(report.user_analysis.topics_analysis.most_frequent_topics).toEqual(
      []
    );
    expect(report.user_analysis.topics_analysis.topic_histogram).toEqual({});
  });

  test("should set default sentiment values", async () => {
    const engine = new InsightEngine(mockConversations);
    const report = await engine.generateReport();

    expect(report.user_analysis.sentiment_analysis.overall_sentiment).toBe(
      "Neutral"
    );
    expect(
      report.user_analysis.sentiment_analysis.sentiment_distribution
    ).toEqual({
      positive: 0,
      neutral: 0,
      negative: 0,
    });
  });

  test("should initialize empty visualizations", async () => {
    const engine = new InsightEngine(mockConversations);
    const report = await engine.generateReport();

    expect(report.visualizations.topic_histogram_url).toBe("");
    expect(report.visualizations.usage_timeline_url).toBe("");
    expect(report.visualizations.dynamic_word_cloud_url).toBe("");
    expect(report.visualizations.response_time_chart_url).toBe("");
  });

  test("should initialize empty recommendations", async () => {
    const engine = new InsightEngine(mockConversations);
    const report = await engine.generateReport();

    expect(report.recommendations.tips_to_improve).toEqual([]);
    expect(report.recommendations.suggested_topics_to_explore).toEqual([]);
    expect(report.recommendations.recommended_interaction_changes).toEqual([]);
    expect(report.recommendations.experimentation_suggestions).toEqual([]);
  });

  test("should generate PDF buffer", async () => {
    const engine = new InsightEngine(mockConversations);
    const report = await engine.generateReport();
    const pdfBuffer = await engine.generatePDF(report);

    expect(Buffer.isBuffer(pdfBuffer)).toBe(true);
    expect(pdfBuffer.length).toBeGreaterThan(0);
  });

  test("should include suggestions in report", async () => {
    const engine = new InsightEngine(mockConversations);
    const report = await engine.generateReport();

    expect(Array.isArray(report.suggestions)).toBe(true);
  });
});
