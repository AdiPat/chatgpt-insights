import { expect, test, describe } from "vitest";
import { InsightEngine } from "../insight-engine";
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

  test("should generate basic overview stats", () => {
    const engine = new InsightEngine(mockConversations);
    const report = engine.generateReport();

    expect(report.user_analysis.overview.total_chats).toBe(1);
    expect(report.user_analysis.overview.total_words_used).toBe(0);
    expect(report.user_analysis.overview.total_prompts).toBe(0);
  });

  test("should initialize empty topics analysis", () => {
    const engine = new InsightEngine(mockConversations);
    const report = engine.generateReport();

    expect(report.user_analysis.topics_analysis.most_frequent_topics).toEqual(
      []
    );
    expect(report.user_analysis.topics_analysis.topic_histogram).toEqual({});
  });

  test("should set default sentiment values", () => {
    const engine = new InsightEngine(mockConversations);
    const report = engine.generateReport();

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

  test("should initialize empty visualizations", () => {
    const engine = new InsightEngine(mockConversations);
    const report = engine.generateReport();

    expect(report.visualizations.topic_histogram_url).toBe("");
    expect(report.visualizations.usage_timeline_url).toBe("");
    expect(report.visualizations.dynamic_word_cloud_url).toBe("");
    expect(report.visualizations.response_time_chart_url).toBe("");
  });

  test("should initialize empty recommendations", () => {
    const engine = new InsightEngine(mockConversations);
    const report = engine.generateReport();

    expect(report.recommendations.tips_to_improve).toEqual([]);
    expect(report.recommendations.suggested_topics_to_explore).toEqual([]);
    expect(report.recommendations.recommended_interaction_changes).toEqual([]);
    expect(report.recommendations.experimentation_suggestions).toEqual([]);
  });
});
