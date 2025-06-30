"use client";

import {
	headingsPlugin,
	listsPlugin,
	quotePlugin,
	markdownShortcutPlugin,
	MDXEditor,
	type MDXEditorMethods,
	ConditionalContents,
	ChangeCodeMirrorLanguage,
	toolbarPlugin,
	UndoRedo,
	Separator,
	BoldItalicUnderlineToggles,
	ListsToggle,
	CreateLink,
	InsertImage,
	InsertTable,
	InsertThematicBreak,
	InsertCodeBlock,
	linkPlugin,
	linkDialogPlugin,
	tablePlugin,
	imagePlugin,
	codeBlockPlugin,
	codeMirrorPlugin,
	diffSourcePlugin,
	CodeToggle,
} from "@mdxeditor/editor";
import { basicDark } from "cm6-theme-basic-dark";
import { useTheme } from "next-themes";

import "@mdxeditor/editor/style.css";
import "./dark-editor.css";
import { Ref } from "react";

interface Props {
	value: string;
	fieldChange: (value: string) => void;
	editorRef: Ref<MDXEditorMethods> | null;
}

const Editor = ({ value, editorRef, fieldChange }: Props) => {
	const { resolvedTheme } = useTheme();

	const themeExtension = resolvedTheme === "dark" ? [basicDark] : [];

	return (
		<MDXEditor
			key={resolvedTheme}
			markdown={value}
			ref={editorRef}
			className="background-light800_dark200 light-border-2 markdown-editor dark-editor w-full border grid"
			onChange={fieldChange}
			plugins={[
				headingsPlugin(),
				listsPlugin(),
				linkPlugin(),
				linkDialogPlugin(),
				quotePlugin(),
				markdownShortcutPlugin(),
				tablePlugin(),
				imagePlugin(),
				codeBlockPlugin({ defaultCodeBlockLanguage: "" }),
				codeMirrorPlugin({
					codeBlockLanguages: {
						css: "css",
						txt: "txt",
						sql: "sql",
						html: "html",
						saas: "saas",
						scss: "scss",
						bash: "bash",
						json: "json",
						js: "javascript",
						ts: "typescript",
						"": "unspecified",
						tsx: "TypeScript (React)",
						jsx: "JavaScript (React)",
					},
					autoLoadLanguageSupport: true,
					codeMirrorExtensions: themeExtension,
				}),
				diffSourcePlugin({ viewMode: "rich-text", diffMarkdown: "" }),
				toolbarPlugin({
					toolbarContents: () => (
						<ConditionalContents
							options={[
								{
									when: (editor) => editor?.editorType === "codeblock",
									contents: () => <ChangeCodeMirrorLanguage />,
								},
								{
									fallback: () => (
										<>
											<UndoRedo />
											<Separator />

											<BoldItalicUnderlineToggles />
											<CodeToggle />
											<Separator />

											<ListsToggle />
											<Separator />

											<CreateLink />
											<InsertImage />
											<Separator />

											<InsertTable />
											<InsertThematicBreak />
											<Separator />

											<InsertCodeBlock />
										</>
									),
								},
							]}
						/>
					),
				}),
			]}
		/>
	);
};

export default Editor;
