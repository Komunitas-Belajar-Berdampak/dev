import { api } from '@/lib/axios';
import type { ApiResponse } from '@/types/api';
import type { MembershipByStudyGroup } from '@/types/membership';

const getMembershipsByStudyGroup = async (studyGroupId: string) => {
  const res = await api.get<ApiResponse<MembershipByStudyGroup>>(`/memberships/${studyGroupId}`);
  return res.data;
};

export { getMembershipsByStudyGroup };
