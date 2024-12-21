import { Conversation } from "./conversation.model";

export interface ChatGPTInsightsReport {
  user_analysis: UserAnalysis;
  visualizations: Visualizations;
  recommendations: Recommendations;
}

export interface UserAnalysis {
  overview: AnalysisOverview;
  topics_analysis: TopicsAnalysis;
  prompting_style: PromptingStyle;
  sentiment_analysis: SentimentAnalysis;
  response_quality: ResponseQuality;
  interaction_patterns: InteractionPatterns;
  advanced_insights: AdvancedInsights;
  communication_effectiveness: CommunicationEffectiveness;
  ai_utilization_patterns: AIUtilizationPatterns;
  personalization_metrics: PersonalizationMetrics;
  diversity_metrics: DiversityMetrics;
  errors_and_ambiguities: ErrorsAndAmbiguities;
}

export interface AnalysisOverview {
  total_chats: number;
  total_words_used: number;
  total_prompts: number;
  average_prompt_length: number;
  average_response_length: number;
  most_active_days: string[];
  most_active_hours: string[];
}

export interface TopicsAnalysis {
  most_frequent_topics: TopicFrequency[];
  topic_histogram: Record<string, number>;
}

export interface TopicFrequency {
  topic: string;
  percentage: number;
  example_prompts: string[];
}

export interface PromptingStyle {
  common_phrases: string[];
  average_prompt_tone: string;
  most_used_keywords: string[];
  query_complexity_distribution: {
    simple: number;
    moderate: number;
    complex: number;
  };
  prompt_efficiency: {
    average_follow_up_prompts: number;
    percentage_prompts_needing_rephrasing: number;
  };
}

export interface SentimentAnalysis {
  overall_sentiment: string;
  sentiment_distribution: {
    positive: number;
    neutral: number;
    negative: number;
  };
  common_positive_topics: string[];
  common_negative_topics: string[];
}

export interface ResponseQuality {
  average_response_relevance: number;
  common_feedback_keywords: string[];
  most_helpful_topics: string[];
  least_helpful_topics: string[];
}

export interface InteractionPatterns {
  usage_frequency: {
    daily_average: number;
    weekly_average: number;
    monthly_average: number;
  };
  time_of_day_preference: {
    morning: number;
    afternoon: number;
    evening: number;
    night: number;
  };
  conversation_length_distribution: {
    short: number;
    medium: number;
    long: number;
  };
}

export interface AdvancedInsights {
  emerging_interest: {
    topic: string;
    increase_in_prompts: number;
    time_period: string;
  };
  redundant_queries: number;
  most_improved_topic_knowledge: string;
  topic_diversity_score: number;
}

export interface CommunicationEffectiveness {
  response_clarity_score: number;
  length_matching: {
    short_prompts: number;
    long_prompts: number;
  };
}

export interface AIUtilizationPatterns {
  task_based_analysis: {
    problem_solving: number;
    creative_exploration: number;
    knowledge_inquiry: number;
  };
  dependency_index: number;
}

export interface PersonalizationMetrics {
  tone_alignment: {
    preferred_tone: string;
    alignment_percentage: number;
  };
}

export interface DiversityMetrics {
  language_usage: {
    primary_language: string;
    other_languages: string[];
    percentage_non_primary_language: number;
  };
  cross_disciplinary_interests: {
    science: number;
    art: number;
    business: number;
    miscellaneous: number;
  };
}

export interface ErrorsAndAmbiguities {
  misunderstood_queries: number;
  percentage_prompts_with_errors: number;
  common_error_causes: string[];
}

export interface Visualizations {
  topic_histogram_url: string;
  usage_timeline_url: string;
  dynamic_word_cloud_url: string;
  response_time_chart_url: string;
}

export interface Recommendations {
  tips_to_improve: string[];
  suggested_topics_to_explore: string[];
  recommended_interaction_changes: string[];
  experimentation_suggestions: string[];
}
