import { useState } from 'react';
import { calculateVoteCost } from '@/lib/utils';

interface VotingModalProps {
  proposalId: bigint;
  onClose: () => void;
  onVote: (voteCount: number, support: boolean) => void;
  reputation?: number;
}

export default function VotingModal({ proposalId, onClose, onVote, reputation = 100 }: VotingModalProps) {
  const [voteCount, setVoteCount] = useState(1);
  const [support, setSupport] = useState(true);

  const cost = calculateVoteCost(voteCount, reputation);

  const handleSubmit = () => {
    onVote(voteCount, support);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Cast Your Vote</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Proposal #{proposalId.toString()}
          </label>

          <div className="flex gap-4 mb-4">
            <button
              onClick={() => setSupport(true)}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition ${
                support
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              ✓ Support
            </button>
            <button
              onClick={() => setSupport(false)}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition ${
                !support
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              ✗ Against
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Votes
            </label>
            <input
              type="number"
              min="1"
              max="100"
              value={voteCount}
              onChange={(e) => setVoteCount(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Vote Count:</span>
            <span className="font-bold text-gray-900">{voteCount}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Your Reputation:</span>
            <span className="font-bold text-gray-900">{reputation}</span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-blue-200">
            <span className="text-sm font-medium text-gray-700">Cost:</span>
            <span className="font-bold text-primary-600">{cost} ORION</span>
          </div>
        </div>

        <div className="text-xs text-gray-500 mb-4">
          <p>Note: Tokens will be locked during the voting period and returned after finalization.</p>
          <p className="mt-1">Cost formula: votes² / (reputation / 100)</p>
        </div>

        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
          >
            Confirm Vote
          </button>
        </div>
      </div>
    </div>
  );
}
