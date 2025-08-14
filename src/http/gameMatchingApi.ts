import apiClient from './client'
import { API_ENDPOINTS } from '@/constants/api'
import type { MatchingJoinRequest, RsDataMatchingStatusResponse, MatchingCancelRequest, RsDataQueueStatsResponse, RsDataObject, RsDataString } from '@/types/api'

// processMatching
export const processMatching = (worldType: string): Promise<{ data: RsDataObject }> =>
  apiClient.post(API_ENDPOINTS.MATCH.PROCESS(worldType))

// joinMatching
export const joinMatching = (data: MatchingJoinRequest): Promise<{ data: RsDataMatchingStatusResponse }> =>
  apiClient.post(API_ENDPOINTS.MATCH.JOIN, data)

// getMatchingStatus
export const getMatchingStatus = (memberId: string): Promise<{ data: RsDataMatchingStatusResponse }> =>
  apiClient.get(API_ENDPOINTS.MATCH.STATUS(memberId))

// getQueueStats
export const getQueueStats = (): Promise<{ data: RsDataQueueStatsResponse }> =>
  apiClient.get(API_ENDPOINTS.MATCH.QUEUE_STATS)

// clearQueue
export const clearQueue = (): Promise<{ data: RsDataString }> =>
  apiClient.delete(API_ENDPOINTS.MATCH.QUEUE_CLEAR)

// cancelMatching
export const cancelMatching = (data: MatchingCancelRequest): Promise<{ data: RsDataString }> =>
  apiClient.delete(API_ENDPOINTS.MATCH.CANCEL, data)


