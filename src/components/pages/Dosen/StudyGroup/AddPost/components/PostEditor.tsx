import { EditorContent, EditorContext, useEditor, type Editor, type JSONContent } from '@tiptap/react';
import * as React from 'react';

// --- Tiptap Core Extensions ---
import { Highlight } from '@tiptap/extension-highlight';
import { Image } from '@tiptap/extension-image';
import { TaskItem, TaskList } from '@tiptap/extension-list';
import { Subscript } from '@tiptap/extension-subscript';
import { Superscript } from '@tiptap/extension-superscript';
import { TextAlign } from '@tiptap/extension-text-align';
import { Typography } from '@tiptap/extension-typography';
import { Selection } from '@tiptap/extensions';
import { StarterKit } from '@tiptap/starter-kit';

// --- Tiptap Node ---
import { HorizontalRule } from '@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node-extension';
import { ImageUploadNode } from '@/components/tiptap-node/image-upload-node/image-upload-node-extension';

// --- Tiptap UI Primitive ---
import { Toolbar, ToolbarGroup, ToolbarSeparator } from '@/components/tiptap-ui-primitive/toolbar';

// --- Tiptap UI ---
import { BlockquoteButton } from '@/components/tiptap-ui/blockquote-button';
import { CodeBlockButton } from '@/components/tiptap-ui/code-block-button';
import { ColorHighlightPopover } from '@/components/tiptap-ui/color-highlight-popover';
import { ImageUploadButton } from '@/components/tiptap-ui/image-upload-button';
import { LinkPopover } from '@/components/tiptap-ui/link-popover';
import { MarkButton } from '@/components/tiptap-ui/mark-button';
import { TextAlignButton } from '@/components/tiptap-ui/text-align-button';
import { UndoRedoButton } from '@/components/tiptap-ui/undo-redo-button';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';

// --- Lib ---
import { handleImageUpload, MAX_FILE_SIZE } from '@/lib/tiptap-utils';

// --- Styles ---
import '@/components/tiptap-node/blockquote-node/blockquote-node.scss';
import '@/components/tiptap-node/code-block-node/code-block-node.scss';
import '@/components/tiptap-node/heading-node/heading-node.scss';
import '@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node.scss';
import '@/components/tiptap-node/image-node/image-node.scss';
import '@/components/tiptap-node/image-upload-node/image-upload-node.scss';
import '@/components/tiptap-node/list-node/list-node.scss';
import '@/components/tiptap-node/paragraph-node/paragraph-node.scss';

export type PostEditorProps = {
  value: JSONContent;
  onChange: (value: JSONContent) => void;
  disabled?: boolean;
};

type HeadingLevel = 1 | 2 | 3 | 4;

const headingLevels: HeadingLevel[] = [1, 2, 3, 4];

const HeadingCustomDropdown = ({ editor, disabled }: { editor: Editor | null; disabled?: boolean }) => {
  if (!editor) return null;

  const activeHeading = headingLevels.find((level) => editor.isActive('heading', { level }));
  const label = activeHeading ? `H${activeHeading}` : 'Heading';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='sm' className='h-8 gap-1' disabled={disabled || !editor.isEditable}>
          {label}
          <ChevronDown className='h-3 w-3' />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align='start' className='w-36'>
        {headingLevels.map((level) => (
          <DropdownMenuItem key={level} onSelect={() => editor.chain().focus().toggleHeading({ level }).run()}>
            Heading {level}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const ListCustomDropdown = ({ editor, disabled }: { editor: Editor | null; disabled?: boolean }) => {
  if (!editor) return null;

  const label = editor.isActive('taskList') ? 'Task List' : editor.isActive('orderedList') ? 'Numbered List' : editor.isActive('bulletList') ? 'Bullet List' : 'List';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='sm' className='h-8 gap-1' disabled={disabled || !editor.isEditable}>
          {label}
          <ChevronDown className='h-3 w-3' />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align='start' className='w-44'>
        <DropdownMenuItem onSelect={() => editor.chain().focus().toggleBulletList().run()}>Bullet List</DropdownMenuItem>
        <DropdownMenuItem onSelect={() => editor.chain().focus().toggleOrderedList().run()}>Numbered List</DropdownMenuItem>
        <DropdownMenuItem onSelect={() => editor.chain().focus().toggleTaskList().run()}>Task List</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const PostEditor = ({ value, onChange, disabled }: PostEditorProps) => {
  const editor = useEditor({
    immediatelyRender: false,
    shouldRerenderOnTransaction: false,
    editorProps: {
      attributes: {
        class: 'tiptap post-editor',
      },
    },
    extensions: [
      StarterKit.configure({
        horizontalRule: false,
        link: {
          openOnClick: false,
          enableClickSelection: true,
        },
      }),
      HorizontalRule,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Highlight.configure({ multicolor: true }),
      Image,
      Typography,
      Superscript,
      Subscript,
      Selection,
      ImageUploadNode.configure({
        accept: 'image/*',
        maxSize: MAX_FILE_SIZE,
        limit: 3,
        upload: handleImageUpload,
        onError: (error) => console.error('Upload failed:', error),
      }),
    ],
    content: value,
    editable: !disabled,
    onUpdate: ({ editor }) => {
      onChange(editor.getJSON());
    },
  });

  React.useEffect(() => {
    if (!editor) return;

    const next = value;
    const current = editor.getJSON();

    if (JSON.stringify(current) === JSON.stringify(next)) return;
    editor.commands.setContent(next, { emitUpdate: false });
  }, [editor, value]);

  return (
    <div className='w-full rounded-md shadow-sm border border-accent overflow-hidden '>
      <EditorContext.Provider value={{ editor }}>
        <Toolbar className='justify-center'>
          <ToolbarGroup>
            <UndoRedoButton action='undo' />
            <UndoRedoButton action='redo' />
          </ToolbarGroup>

          <ToolbarSeparator />

          <ToolbarGroup>
            <HeadingCustomDropdown editor={editor} disabled={disabled} />
            <ListCustomDropdown editor={editor} disabled={disabled} />
            <BlockquoteButton />
            <CodeBlockButton />
          </ToolbarGroup>

          <ToolbarSeparator />

          <ToolbarGroup>
            <MarkButton type='bold' />
            <MarkButton type='italic' />
            <MarkButton type='strike' />
            <MarkButton type='code' />
            <MarkButton type='underline' />
            <MarkButton type='superscript' />
            <MarkButton type='subscript' />
            <ColorHighlightPopover />
            <LinkPopover />
          </ToolbarGroup>

          <ToolbarSeparator />

          <ToolbarGroup>
            <TextAlignButton align='left' />
            <TextAlignButton align='center' />
            <TextAlignButton align='right' />
            <TextAlignButton align='justify' />
          </ToolbarGroup>

          <ToolbarSeparator />

          <ToolbarGroup>
            <ImageUploadButton />
          </ToolbarGroup>
        </Toolbar>

        <div className='p-4 text-primary text-sm selection:bg-accent/30 '>
          <EditorContent editor={editor} />
        </div>
      </EditorContext.Provider>
    </div>
  );
};

export default PostEditor;
