import {   MDXEditor } from '@mdxeditor/editor'
import {
  BlockTypeSelect,
  CodeToggle,
  CreateLink,
  DiffSourceToggleWrapper,
  imagePlugin,
  directivesPlugin,
  InsertImage,
  linkPlugin,
  markdownShortcutPlugin,
  AdmonitionDirectiveDescriptor,
  InsertAdmonition,
  ListsToggle,
  InsertThematicBreak,
  tablePlugin,
  InsertTable,
} from "@mdxeditor/editor";
import {
  headingsPlugin,
  quotePlugin,
  linkDialogPlugin,
  listsPlugin,
  thematicBreakPlugin,
  UndoRedo,
  BoldItalicUnderlineToggles,
  toolbarPlugin,
  diffSourcePlugin,
} from "@mdxeditor/editor";

import "@mdxeditor/editor/style.css";
import { Link } from "react-router-dom";
import { useRef, useState } from "react";

function MdEditor( {initialMD, editorRef} ) {



  return (
    <MDXEditor
    ref={editorRef}
      markdown={initialMD}
      plugins={[
        headingsPlugin(),
        listsPlugin(),
        linkPlugin(),
        linkDialogPlugin(),
        quotePlugin(),
        markdownShortcutPlugin(),
        tablePlugin(),
        thematicBreakPlugin(),
        directivesPlugin({ directiveDescriptors: [AdmonitionDirectiveDescriptor]}),
        diffSourcePlugin({ viewMode: "source" }),
        imagePlugin({}),
        toolbarPlugin({
          toolbarClassName: "toolbar",
          toolbarContents: () => (
            <>
              <DiffSourceToggleWrapper>
                <InsertImage />
                <CodeToggle />
                <UndoRedo />
                <CreateLink />
                <InsertAdmonition />
                <ListsToggle />
                <InsertThematicBreak />
                <InsertTable />
                <BoldItalicUnderlineToggles />
                <BlockTypeSelect />
              </DiffSourceToggleWrapper>
            </>
          ),
        }),
      ]}
    />
  );
}

export default MdEditor;
