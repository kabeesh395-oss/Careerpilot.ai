// --- PRIVACY-PRESERVING PRODUCT ANALYTICS & TELEMETRY ---

export type AnalyticsEventType =
  | 'app_opened'
  | 'signup_started'
  | 'onboarding_started'
  | 'onboarding_step_viewed'
  | 'onboarding_completed'
  | 'onboarding_skipped'
  | 'career_discovery_triggered'
  | 'first_action_taken'
  | 'first_task_completed'
  | 'first_project_started'
  | 'first_resume_scanned'
  | 'first_interview_started'
  | 'career_selected'
  | 'profile_updated'
  | 'resume_uploaded'
  | 'resume_analyzed'
  | 'github_analyzed'
  | 'linkedin_analyzed'
  | 'roadmap_opened'
  | 'roadmap_stage_completed'
  | 'task_completed'
  | 'project_opened'
  | 'learning_resource_opened'
  | 'mock_interview_started'
  | 'mock_interview_completed'
  | 'job_applied'
  | 'ai_assistant_used'
  | 'api_key_configured'
  | 'theme_toggled'
  | 'error_occurred';

export interface AnalyticsEvent {
  id: string;
  type: AnalyticsEventType;
  timestamp: string;
  metadata?: Record<string, string | number | boolean | undefined>;
}

export const AnalyticsService = {
  getEvents: (): AnalyticsEvent[] => {
    try {
      const saved = localStorage.getItem('careerpilot_analytics_events');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  },

  track: (type: AnalyticsEventType, metadata?: Record<string, string | number | boolean | undefined>) => {
    try {
      const isTelemetryAllowed = localStorage.getItem('careerpilot_privacy_telemetry') !== 'false';
      if (!isTelemetryAllowed) return;

      const newEvent: AnalyticsEvent = {
        id: `evt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        type,
        timestamp: new Date().toISOString(),
        metadata
      };

      const existing = AnalyticsService.getEvents();
      // Keep recent 150 events to preserve performance and avoid storage bloat
      const updated = [newEvent, ...existing].slice(0, 150);
      localStorage.setItem('careerpilot_analytics_events', JSON.stringify(updated));
    } catch (e) {
      console.warn('Analytics logging failed non-critically:', e);
    }
  },

  getStats: () => {
    const events = AnalyticsService.getEvents();
    return {
      totalEvents: events.length,
      tasksCompleted: events.filter(e => e.type === 'task_completed').length,
      interviewsCompleted: events.filter(e => e.type === 'mock_interview_completed').length,
      resumesAnalyzed: events.filter(e => e.type === 'resume_analyzed').length,
      githubAudits: events.filter(e => e.type === 'github_analyzed').length,
      lastActive: events[0]?.timestamp || new Date().toISOString()
    };
  },

  clearEvents: () => {
    localStorage.removeItem('careerpilot_analytics_events');
  }
};
