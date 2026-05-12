export type StudyGroupMemberOption = {
  nama: string;
  nrp?: string | null;
};

export const getStudyGroupMemberName = (id: string, memberById: Map<string, StudyGroupMemberOption>) => memberById.get(id)?.nama ?? id;

export const isStudyGroupMemberMatch = (id: string, query: string, memberById: Map<string, StudyGroupMemberOption>) => {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return true;

  const member = memberById.get(id);
  const haystack = `${member?.nama ?? id} ${member?.nrp ?? ''}`.toLowerCase();
  return haystack.includes(normalizedQuery);
};
