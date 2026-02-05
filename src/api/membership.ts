import { api } from '@/lib/axios';
import type { ApiResponse } from '@/types/api';
import type { MembershipByStudyGroup } from '@/types/membership';

const getMembershipsByStudyGroup = async (studyGroupId: string) => {
  const res = await api.get<ApiResponse<MembershipByStudyGroup>>(`/memberships/${studyGroupId}`);

  return res.data;
};

const approveMembershipRequest = async (membershipId: string, idStudyGroup: string) => {
  const res = await api.post<ApiResponse<null>>(`/memberships/${membershipId}/sg/${idStudyGroup}/approve`);
  return res.data;
};

const rejectMembershipRequest = async (membershipId: string, idStudyGroup: string) => {
  const res = await api.post<ApiResponse<null>>(`/memberships/${membershipId}/sg/${idStudyGroup}/reject`);
  return res.data;
};

export { approveMembershipRequest, getMembershipsByStudyGroup, rejectMembershipRequest };
