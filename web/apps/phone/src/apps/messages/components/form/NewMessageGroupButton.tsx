import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useCheckedConversationsValue, useIsEditing } from '../../hooks/state';
import { useMessageAPI } from '../../hooks/useMessageAPI';
import { toggleKeys } from '@ui/components';
import { cn } from '@utils/cn';

interface NewMessageGroupButtonProps {
  onClick(): void;
}

export const NewMessageGroupButton: React.FC<NewMessageGroupButtonProps> = ({ onClick }) => {
  const checkedConversations = useCheckedConversationsValue();
  const [isEditing, setIsEditing] = useIsEditing();
  const { deleteConversation } = useMessageAPI();

  const handleDeleteConversations = () => {
    deleteConversation(checkedConversations);
    setIsEditing(false);
  };

  return (
    <button
      className={cn(
        "absolute bottom-10 right-5 flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg transition-all active:scale-90 focus:outline-none focus:ring-2 focus:ring-offset-2",
        !isEditing ? "bg-green-500 hover:bg-green-600 focus:ring-green-400" : "bg-red-500 hover:bg-red-600 focus:ring-red-400"
      )}
      onClick={!isEditing ? onClick : handleDeleteConversations}
      onMouseUp={() => {
        toggleKeys(false);
      }}
    >
      {!isEditing ? <Plus size={28} /> : <Trash2 size={24} />}
    </button>
  );
};

export default NewMessageGroupButton;
