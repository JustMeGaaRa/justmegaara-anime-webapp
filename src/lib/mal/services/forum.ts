import type { MALClient } from '../client';
import type { ForumBoards, ForumTopic, ForumTopicDetails, PaginatedResponse } from '../types';

export interface GetForumTopicsParams {
  board_id?: number;
  subboard_id?: number;
  /** Full-text search query. */
  q?: string;
  topic_user_name?: string;
  user_name?: string;
  sort?: 'recent';
  limit?: number;
  offset?: number;
}

export interface GetTopicDetailsParams {
  limit?: number;
  offset?: number;
}

export class ForumService {
  constructor(private readonly client: MALClient) {}

  /** Get all forum boards and their sub-boards. */
  getBoards(): Promise<ForumBoards> {
    return this.client.get('/forum/boards');
  }

  /** Search or list forum topics. */
  getTopics(
    params?: GetForumTopicsParams,
  ): Promise<PaginatedResponse<ForumTopic>> {
    return this.client.get('/forum/topics', params);
  }

  /** Get posts inside a single forum topic. */
  getTopicDetails(
    topicId: number,
    params?: GetTopicDetailsParams,
  ): Promise<ForumTopicDetails> {
    return this.client.get(`/forum/topic/${topicId}`, params);
  }
}
