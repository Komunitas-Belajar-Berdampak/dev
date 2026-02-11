import { Image } from '@tiptap/extension-image';
import { EditorContent, useEditor, type JSONContent } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';

import '@/components/tiptap-node/blockquote-node/blockquote-node.scss';
import '@/components/tiptap-node/code-block-node/code-block-node.scss';
import '@/components/tiptap-node/heading-node/heading-node.scss';
import '@/components/tiptap-node/image-node/image-node.scss';
import '@/components/tiptap-node/list-node/list-node.scss';
import '@/components/tiptap-node/paragraph-node/paragraph-node.scss';

type TiptapReadonlyContentProps = {
  content: JSONContent;
  className?: string;
};

const TiptapReadonlyContent = ({ content, className }: TiptapReadonlyContentProps) => {
  const editor = useEditor({
    immediatelyRender: false,
    shouldRerenderOnTransaction: false,
    editable: false,
    editorProps: {
      attributes: {
        class: 'tiptap-thread readonly',
      },
    },
    extensions: [StarterKit, Image],
    content,
  });

  return <EditorContent editor={editor} className={className} />;
};

export default TiptapReadonlyContent;
