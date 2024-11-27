import { Proposal, ProposalState } from '@/lib/types';
import { formatDate, getTimeRemaining } from '@/lib/utils';
import { PROPOSAL_STATES } from '@/lib/constants';

interface ProposalCardProps {
  proposal: Proposal;
  onClick?: () => void;
}

export default function ProposalCard({ proposal, onClick }: ProposalCardProps) {
  const getStateBadgeColor = (state: ProposalState) => {
    switch (state) {
      case ProposalState.Draft:
        return 'bg-gray-200 text-gray-800';
      case ProposalState.Voting:
        return 'bg-blue-500 text-white';
      case ProposalState.Finalization:
        return 'bg-yellow-500 text-white';
      case ProposalState.Execution:
        return 'bg-purple-500 text-white';
      case ProposalState.Executed:
        return 'bg-green-500 text-white';
      case ProposalState.Rejected:
        return 'bg-red-500 text-white';
      case ProposalState.Cancelled:
        return 'bg-gray-500 text-white';
      default:
        return 'bg-gray-200 text-gray-800';
    }
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition cursor-pointer"
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-gray-900">{proposal.title}</h3>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStateBadgeColor(proposal.state)}`}>
          {PROPOSAL_STATES[proposal.state]}
        </span>
      </div>

      <p className="text-gray-600 mb-4 line-clamp-2">
        {proposal.description}
      </p>

      <div className="flex justify-between items-center text-sm text-gray-500">
        <div className="flex items-center space-x-4">
          <span>ID: #{proposal.id.toString()}</span>
          <span>•</span>
          <span className="truncate max-w-[120px]">
            {proposal.proposer.slice(0, 6)}...{proposal.proposer.slice(-4)}
          </span>
        </div>

        {proposal.state === ProposalState.Voting && proposal.votingEndTime > 0n && (
          <div className="text-blue-600 font-medium">
            {getTimeRemaining(Number(proposal.votingEndTime))}
          </div>
        )}

        {proposal.createdAt > 0n && (
          <span>{formatDate(Number(proposal.createdAt))}</span>
        )}
      </div>
    </div>
  );
}
