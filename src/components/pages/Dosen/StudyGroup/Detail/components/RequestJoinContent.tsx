import { approveMembershipRequest, getMembershipsByStudyGroup, rejectMembershipRequest } from '@/api/membership';
import { Button } from '@/components/ui/button';
import Circle from '@/components/ui/circle';
import type { ApiResponse } from '@/types/api';
import type { MembershipByStudyGroup } from '@/types/membership';
import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query';
import { Check, Mail, X } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import StudyGroupListSkeleton from '../../Main/components/StudyGroupListSkeleton';

type RequestJoinContentProps = {
  idSg: string;
};

const RequestJoinContent = ({ idSg }: RequestJoinContentProps) => {
  const { data, isLoading, isError, error, isFetching, refetch } = useQuery<ApiResponse<MembershipByStudyGroup>, Error, MembershipByStudyGroup>({
    queryKey: ['memberships-by-sg', idSg],
    queryFn: () => getMembershipsByStudyGroup(idSg),
    placeholderData: keepPreviousData,
    select: (res) => res.data,
  });

  const memberRequest = useMemo(() => {
    return data?.mahasiswa?.filter((member) => member.status === 'PENDING') ?? [];
  }, [data?.mahasiswa]);

  const { mutate: approve, isPending: isApproving } = useMutation({
    mutationFn: ({ membershipId, idStudyGroup }: { membershipId: string; idStudyGroup: string }) => approveMembershipRequest(membershipId, idStudyGroup),
    onSuccess: () => {
      toast.success('Membership request approved.', { toasterId: 'global' });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to approve membership request.', { toasterId: 'global' });
    },
    onSettled: async () => {
      await refetch();
    },
  });

  const { mutate: reject, isPending: isRejecting } = useMutation({
    mutationFn: ({ membershipId, idStudyGroup }: { membershipId: string; idStudyGroup: string }) => rejectMembershipRequest(membershipId, idStudyGroup),
    onSuccess: () => {
      toast.success('Membership request rejected.', { toasterId: 'global' });
      refetch();
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to reject membership request.', { toasterId: 'global' });
    },
    onSettled: async () => {
      await refetch();
    },
  });

  const approveMembership = (membershipId: string) => {
    approve({ membershipId, idStudyGroup: idSg });
  };

  const rejectMembership = (membershipId: string) => {
    reject({ membershipId, idStudyGroup: idSg });
  };

  useEffect(() => {
    if (!isError) return;
    toast.error(error?.message || 'Gagal mengambil data membership.', { toasterId: 'global' });
  }, [error?.message, isError]);

  return (
    <>
      {(isLoading || isFetching) && <StudyGroupListSkeleton />}

      {!isLoading && !isError && memberRequest.length === 0 ? (
        <div className='flex flex-col p-12 border border-accent rounded-xl mt-8 justify-center items-center'>
          <Mail size={48} className='mx-auto mb-4 text-accent' />
          <p className='text-center text-accent'>Tidak ada permintaan bergabung.</p>
        </div>
      ) : (
        <div className='w-full pt-8 flex flex-col gap-6'>
          {memberRequest.map((member) => (
            <div className='flex flex-row w-full justify-between gap-6' key={`${member.id} - ${member.nama}`}>
              <div>
                <Circle />
              </div>

              <div className='w-full flex flex-col justify-center'>
                <span className='text-primary font-bold text-sm'>{member.nama}</span>
                <span className='text-accent text-sm'>{member.nrp}</span>
              </div>

              <div className='flex flex-row gap-2 items-center'>
                <Button variant='default' size='icon-sm' onClick={() => approveMembership(member.id)} disabled={isApproving || isRejecting}>
                  <Check size={16} className='text-white' />
                </Button>

                <Button variant='destructive' size='icon-sm' onClick={() => rejectMembership(member.id)} disabled={isRejecting || isApproving}>
                  <X size={16} className='text-white' />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};
export default RequestJoinContent;
