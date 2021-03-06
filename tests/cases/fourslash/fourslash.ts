// Welcome to the FourSlash syntax guide!

// A line in the source text is indicated by four slashes (////)
// Tip: Hit Ctrl-K Ctrl-C Ctrl-K Ctrl-C to prefix-slash any selected block of text in Visual Studio
//// This is a line in the source text!
// Files are terminated by any entirely blank line (e.g.
// interspersed //-initiated comments are allowed)

// You can indicate a 'marker' with /**/
//// function./**/
// ... goTo.marker();

// Optionally, markers may have names:
//// function.go(/*1*/x, /*2*/y);
// goTo.marker('1');
// Marker names may consist of any alphanumeric characters

// File metadata must occur directly before the first line of source text
// and is indicated by an @ symbol:
// @Filename: lib.d.ts
//// this is the first line of my file

// Global options may appear anywhere
// @Module: Node
// @Target: ES5

// In the imperative section, you can write any valid TypeScript code.

//---------------------------------------
// For API editors:
// When editting this file, and only while editing this file, enable the reference comments
// and comment out the declarations in this section to get proper type information.
// Undo these changes before compiling/committing/editing any other fourslash tests.
// The test suite will likely crash if you try 'jake runtests' with reference comments enabled.
//
// Explanation:
// We want type-completion while we edit this file, but at compile time/while editting fourslash tests,
// we don't want to include the following reference because we are compiling this file in "--out" mode and don't want to rope
// in the entire codebase into the compilation each fourslash test. Additionally, we don't want to expose the
// src/harness/fourslash.ts API's (or the rest of the compiler) because they are unstable and complicate the
// fourslash testing DSL. Finally, in this case, runtime reflection is (much) faster.
//
// TODO: figure out a better solution to the API exposure problem.

/// <reference path="../../../src/compiler/diagnosticInformationMap.generated.ts" />

declare module ts {
    export type MapKey = string | number;
    export interface Map<T> {
        forEach(action: (value: T, key: string) => void): void;
        get(key: MapKey): T;
        has(key: MapKey): boolean;
        set(key: MapKey, value: T): this;
        delete(key: MapKey): boolean;
        clear(): void;
    }

    interface SymbolDisplayPart {
        text: string;
        kind: string;
    }

    enum IndentStyle {
        None = 0,
        Block = 1,
        Smart = 2,
    }

    interface OutputFile {
        name: string;
        writeByteOrderMark: boolean;
        text: string;
    }

    enum DiagnosticCategory {
        Warning,
        Error,
        Suggestion,
        Message
    }

    interface DiagnosticMessage {
        key: string;
        category: DiagnosticCategory;
        code: number;
        message: string;
        reportsUnnecessary?: {};
    }

    function flatMap<T, U>(array: ReadonlyArray<T>, mapfn: (x: T, i: number) => U | ReadonlyArray<U> | undefined): U[];
}

declare namespace FourSlashInterface {
    interface Marker {
        fileName: string;
        position: number;
        data?: any;
    }
    interface EditorOptions {
        BaseIndentSize?: number,
        IndentSize: number;
        TabSize: number;
        NewLineCharacter: string;
        ConvertTabsToSpaces: boolean;
    }
    interface FormatCodeOptions extends EditorOptions {
        InsertSpaceAfterCommaDelimiter: boolean;
        InsertSpaceAfterSemicolonInForStatements: boolean;
        InsertSpaceBeforeAndAfterBinaryOperators: boolean;
        InsertSpaceAfterKeywordsInControlFlowStatements: boolean;
        InsertSpaceAfterFunctionKeywordForAnonymousFunctions: boolean;
        InsertSpaceAfterOpeningAndBeforeClosingNonemptyParenthesis: boolean;
        InsertSpaceAfterOpeningAndBeforeClosingNonemptyBrackets: boolean;
        InsertSpaceAfterOpeningAndBeforeClosingNonemptyBraces: boolean;
        InsertSpaceAfterOpeningAndBeforeClosingTemplateStringBraces: boolean;
        InsertSpaceAfterTypeAssertion: boolean;
        PlaceOpenBraceOnNewLineForFunctions: boolean;
        PlaceOpenBraceOnNewLineForControlBlocks: boolean;
        insertSpaceBeforeTypeAnnotation: boolean;
        [s: string]: boolean | number | string | undefined;
    }
    interface Range {
        fileName: string;
        pos: number;
        end: number;
        marker?: Marker;
    }
    interface TextSpan {
        start: number;
        end: number;
    }
    class test_ {
        markers(): Marker[];
        markerNames(): string[];
        markerName(m: Marker): string;
        marker(name?: string): Marker;
        ranges(): Range[];
        spans(): Array<{ start: number, length: number }>;
        rangesByText(): ts.Map<Range[]>;
        markerByName(s: string): Marker;
        symbolsInScope(range: Range): any[];
        setTypesRegistry(map: { [key: string]: void }): void;
    }
    class plugins {
        configurePlugin(pluginName: string, configuration: any): void;
    }
    class goTo {
        marker(name?: string | Marker): void;
        eachMarker(markers: ReadonlyArray<string>, action: (marker: Marker, index: number) => void): void;
        eachMarker(action: (marker: Marker, index: number) => void): void;
        rangeStart(range: Range): void;
        eachRange(action: (range: Range) => void): void;
        bof(): void;
        eof(): void;
        implementation(): void;
        position(position: number, fileIndex?: number): any;
        position(position: number, fileName?: string): any;
        file(index: number, content?: string, scriptKindName?: string): any;
        file(name: string, content?: string, scriptKindName?: string): any;
        select(startMarker: string, endMarker: string): void;
        selectRange(range: Range): void;
    }
    class verifyNegatable {
        private negative;
        not: verifyNegatable;
        allowedClassElementKeywords: string[];
        allowedConstructorParameterKeywords: string[];
        constructor(negative?: boolean);
        errorExistsBetweenMarkers(startMarker: string, endMarker: string): void;
        errorExistsAfterMarker(markerName?: string): void;
        errorExistsBeforeMarker(markerName?: string): void;
        quickInfoExists(): void;
        typeDefinitionCountIs(expectedCount: number): void;
        implementationListIsEmpty(): void;
        isValidBraceCompletionAtPosition(openingBrace?: string): void;
        jsxClosingTag(map: { [markerName: string]: { readonly newText: string } | undefined }): void;
        isInCommentAtPosition(onlyMultiLineDiverges?: boolean): void;
        codeFix(options: {
            description: string,
            newFileContent?: NewFileContent,
            newRangeContent?: string,
            errorCode?: number,
            index?: number,
            preferences?: UserPreferences,
            applyChanges?: boolean,
            commands?: {}[],
        });
        codeFixAvailable(options?: ReadonlyArray<VerifyCodeFixAvailableOptions> | string): void;
        applicableRefactorAvailableAtMarker(markerName: string): void;
        codeFixDiagnosticsAvailableAtMarkers(markerNames: string[], diagnosticCode?: number): void;
        applicableRefactorAvailableForRange(): void;

        refactorAvailable(name: string, actionName?: string): void;
    }
    class verify extends verifyNegatable {
        assertHasRanges(ranges: Range[]): void;
        caretAtMarker(markerName?: string): void;
        completions(...options: CompletionsOptions[]): void;
        applyCodeActionFromCompletion(markerName: string, options: {
            name: string,
            source?: string,
            description: string,
            newFileContent?: string,
            newRangeContent?: string,
            preferences?: UserPreferences,
        });
        indentationIs(numberOfSpaces: number): void;
        indentationAtPositionIs(fileName: string, position: number, numberOfSpaces: number, indentStyle?: ts.IndentStyle, baseIndentSize?: number): void;
        textAtCaretIs(text: string): void;
        /**
         * Compiles the current file and evaluates 'expr' in a context containing
         * the emitted output, then compares (using ===) the result of that expression
         * to 'value'. Do not use this function with external modules as it is not supported.
         */
        eval(expr: string, value: any): void;
        currentLineContentIs(text: string): void;
        currentFileContentIs(text: string): void;
        formatDocumentChangesNothing(): void;
        /** Verifies that goToDefinition at the current position would take you to `endMarker`. */
        goToDefinitionIs(endMarkers: ArrayOrSingle<string>): void;
        goToDefinitionName(name: string, containerName: string): void;
        /**
         * `verify.goToDefinition("a", "b");` verifies that go-to-definition at marker "a" takes you to marker "b".
         * `verify.goToDefinition(["a", "aa"], "b");` verifies that markers "a" and "aa" have the same definition "b".
         * `verify.goToDefinition("a", ["b", "bb"]);` verifies that "a" has multiple definitions available.
         */
        goToDefinition(startMarkerNames: ArrayOrSingle<string>, endMarkerNames: ArrayOrSingle<string>): void;
        goToDefinition(startMarkerNames: ArrayOrSingle<string>, endMarkerNames: ArrayOrSingle<string>, range: Range): void;
        /** Performs `goToDefinition` for each pair. */
        goToDefinition(startsAndEnds: [ArrayOrSingle<string>, ArrayOrSingle<string>][]): void;
        /** Performs `goToDefinition` on each key and value. */
        goToDefinition(startsAndEnds: { [startMarkerName: string]: ArrayOrSingle<string> }): void;
        /** Verifies goToDefinition for each `${markerName}Reference` -> `${markerName}Definition` */
        goToDefinitionForMarkers(...markerNames: string[]): void;
        goToType(startsAndEnds: { [startMarkerName: string]: ArrayOrSingle<string> }): void;
        goToType(startMarkerNames: ArrayOrSingle<string>, endMarkerNames: ArrayOrSingle<string>): void;
        verifyGetEmitOutputForCurrentFile(expected: string): void;
        verifyGetEmitOutputContentsForCurrentFile(expected: ts.OutputFile[]): void;
        noReferences(markerNameOrRange?: string | Range): void;
        symbolAtLocation(startRange: Range, ...declarationRanges: Range[]): void;
        typeOfSymbolAtLocation(range: Range, symbol: any, expected: string): void;
        /**
         * For each of starts, asserts the ranges that are referenced from there.
         * This uses the 'findReferences' command instead of 'getReferencesAtPosition', so references are grouped by their definition.
         */
        referenceGroups(starts: ArrayOrSingle<string> | ArrayOrSingle<Range>, parts: ReadonlyArray<ReferenceGroup>): void;
        singleReferenceGroup(definition: ReferencesDefinition, ranges?: Range[] | string): void;
        rangesAreOccurrences(isWriteAccess?: boolean, ranges?: Range[]): void;
        rangesWithSameTextAreRenameLocations(...texts: string[]): void;
        rangesAreRenameLocations(options?: Range[] | { findInStrings?: boolean, findInComments?: boolean, ranges?: Range[] });
        findReferencesDefinitionDisplayPartsAtCaretAre(expected: ts.SymbolDisplayPart[]): void;
        noSignatureHelp(...markers: (string | Marker)[]): void;
        noSignatureHelpForTriggerReason(triggerReason: SignatureHelpTriggerReason, ...markers: (string | Marker)[]): void
        signatureHelpPresentForTriggerReason(triggerReason: SignatureHelpTriggerReason, ...markers: (string | Marker)[]): void
        signatureHelp(...options: VerifySignatureHelpOptions[], ): void;
        // Checks that there are no compile errors.
        noErrors(): void;
        errorExistsAtRange(range: Range, code: number, message?: string): void;
        numberOfErrorsInCurrentFile(expected: number): void;
        baselineCurrentFileBreakpointLocations(): void;
        baselineCurrentFileNameOrDottedNameSpans(): void;
        baselineGetEmitOutput(insertResultsIntoVfs?: boolean): void;
        getEmitOutput(expectedOutputFiles: ReadonlyArray<string>): void;
        baselineQuickInfo(): void;
        baselineSmartSelection(): void;
        nameOrDottedNameSpanTextIs(text: string): void;
        outliningSpansInCurrentFile(spans: Range[]): void;
        outliningHintSpansInCurrentFile(spans: Range[]): void;
        todoCommentsInCurrentFile(descriptors: string[]): void;
        matchingBracePositionInCurrentFile(bracePosition: number, expectedMatchPosition: number): void;
        noMatchingBracePositionInCurrentFile(bracePosition: number): void;
        docCommentTemplateAt(markerName: string | FourSlashInterface.Marker, expectedOffset: number, expectedText: string): void;
        noDocCommentTemplateAt(markerName: string | FourSlashInterface.Marker): void;
        rangeAfterCodeFix(expectedText: string, includeWhiteSpace?: boolean, errorCode?: number, index?: number): void;
        codeFixAll(options: { fixId: string, fixAllDescription: string, newFileContent: NewFileContent, commands?: {}[] }): void;
        fileAfterApplyingRefactorAtMarker(markerName: string, expectedContent: string, refactorNameToApply: string, actionName: string, formattingOptions?: FormatCodeOptions): void;
        rangeIs(expectedText: string, includeWhiteSpace?: boolean): void;
        fileAfterApplyingRefactorAtMarker(markerName: string, expectedContent: string, refactorNameToApply: string, formattingOptions?: FormatCodeOptions): void;
        getAndApplyCodeFix(errorCode?: number, index?: number): void;
        importFixAtPosition(expectedTextArray: string[], errorCode?: number, options?: UserPreferences): void;

        navigationBar(json: any, options?: { checkSpans?: boolean }): void;
        navigationTree(json: any, options?: { checkSpans?: boolean }): void;
        navigateTo(...options: VerifyNavigateToOptions[]);
        occurrencesAtPositionContains(range: Range, isWriteAccess?: boolean): void;
        occurrencesAtPositionCount(expectedCount: number): void;
        rangesAreDocumentHighlights(ranges?: Range[], options?: VerifyDocumentHighlightsOptions): void;
        rangesWithSameTextAreDocumentHighlights(): void;
        documentHighlightsOf(startRange: Range, ranges: Range[], options?: VerifyDocumentHighlightsOptions): void;
        /**
         * This method *requires* a contiguous, complete, and ordered stream of classifications for a file.
         */
        syntacticClassificationsAre(...classifications: {
            classificationType: string;
            text: string;
        }[]): void;
        /**
         * This method *requires* an ordered stream of classifications for a file, and spans are highly recommended.
         */
        semanticClassificationsAre(...classifications: {
            classificationType: string;
            text: string;
            textSpan?: TextSpan;
        }[]): void;
        renameInfoSucceeded(displayName?: string, fullDisplayName?: string, kind?: string, kindModifiers?: string, fileToRename?: string, range?: Range, allowRenameOfImportPath?: boolean): void;
        renameInfoFailed(message?: string, allowRenameOfImportPath?: boolean): void;
        renameLocations(startRanges: ArrayOrSingle<Range>, options: RenameLocationsOptions): void;

        /** Verify the quick info available at the current marker. */
        quickInfoIs(expectedText: string, expectedDocumentation?: string): void;
        /** Goto a marker and call `quickInfoIs`. */
        quickInfoAt(markerName: string | Range, expectedText?: string, expectedDocumentation?: string): void;
        /**
         * Call `quickInfoAt` for each pair in the object.
         * (If the value is an array, it is [expectedText, expectedDocumentation].)
         */
        quickInfos(namesAndTexts: { [name: string]: string | [string, string] }): void;
        verifyQuickInfoDisplayParts(kind: string, kindModifiers: string, textSpan: {
            start: number;
            length: number;
        }, displayParts: ts.SymbolDisplayPart[], documentation: ts.SymbolDisplayPart[], tags: { name: string, text?: string }[] | undefined): void;
        getSyntacticDiagnostics(expected: ReadonlyArray<Diagnostic>): void;
        getSemanticDiagnostics(expected: ReadonlyArray<Diagnostic>): void;
        getSuggestionDiagnostics(expected: ReadonlyArray<Diagnostic>): void;
        ProjectInfo(expected: string[]): void;
        allRangesAppearInImplementationList(markerName: string): void;
        getEditsForFileRename(options: {
            readonly oldPath: string;
            readonly newPath: string;
            readonly newFileContents: { readonly [fileName: string]: string };
            readonly preferences?: UserPreferences;
        }): void;
        moveToNewFile(options: {
            readonly newFileContents: { readonly [fileName: string]: string };
            readonly preferences?: UserPreferences;
        }): void;
        noMoveToNewFile(): void;

        generateTypes(...options: GenerateTypesOptions[]): void;
    }
    class edit {
        backspace(count?: number): void;
        deleteAtCaret(times?: number): void;
        replace(start: number, length: number, text: string): void;
        paste(text: string): void;
        insert(text: string): void;
        insertLine(text: string): void;
        insertLines(...lines: string[]): void;
        moveRight(count?: number): void;
        moveLeft(count?: number): void;
        enableFormatting(): void;
        disableFormatting(): void;

        applyRefactor(options: { refactorName: string, actionName: string, actionDescription: string, newContent: NewFileContent }): void;
    }
    class debug {
        printCurrentParameterHelp(): void;
        printCurrentFileState(): void;
        printCurrentFileStateWithWhitespace(): void;
        printCurrentFileStateWithoutCaret(): void;
        printCurrentQuickInfo(): void;
        printCurrentSignatureHelp(): void;
        printCompletionListMembers(options?: { includeExternalModuleExports: boolean }): void;
        printAvailableCodeFixes(): void;
        printBreakpointLocation(pos: number): void;
        printBreakpointAtCurrentLocation(): void;
        printNameOrDottedNameSpans(pos: number): void;
        printErrorList(): void;
        printNavigationBar(): void;
        printNavigationItems(searchValue?: string): void;
        printScriptLexicalStructureItems(): void;
        printReferences(): void;
        printContext(): void;
    }
    class format {
        document(): void;
        copyFormatOptions(): FormatCodeOptions;
        setFormatOptions(options: FormatCodeOptions): any;
        selection(startMarker: string, endMarker: string): void;
        onType(posMarker: string, key: string): void;
        setOption(name: keyof FormatCodeOptions, value: number | string | boolean): void;
    }
    class cancellation {
        resetCancelled(): void;
        setCancelled(numberOfCalls?: number): void;
    }
    module classification {
        function comment(text: string, position?: number): {
            classificationType: string;
            text: string;
            textSpan?: TextSpan;
        };
        function identifier(text: string, position?: number): {
            classificationType: string;
            text: string;
            textSpan?: TextSpan;
        };
        function keyword(text: string, position?: number): {
            classificationType: string;
            text: string;
            textSpan?: TextSpan;
        };
        function numericLiteral(text: string, position?: number): {
            classificationType: string;
            text: string;
            textSpan?: TextSpan;
        };
        function operator(text: string, position?: number): {
            classificationType: string;
            text: string;
            textSpan?: TextSpan;
        };
        function stringLiteral(text: string, position?: number): {
            classificationType: string;
            text: string;
            textSpan?: TextSpan;
        };
        function whiteSpace(text: string, position?: number): {
            classificationType: string;
            text: string;
            textSpan?: TextSpan;
        };
        function text(text: string, position?: number): {
            classificationType: string;
            text: string;
            textSpan?: TextSpan;
        };
        function punctuation(text: string, position?: number): {
            classificationType: string;
            text: string;
            textSpan?: TextSpan;
        };
        function docCommentTagName(text: string, position?: number): {
            classificationType: string;
            text: string;
            textSpan?: TextSpan;
        };
        function className(text: string, position?: number): {
            classificationType: string;
            text: string;
            textSpan?: TextSpan;
        };
        function enumName(text: string, position?: number): {
            classificationType: string;
            text: string;
            textSpan?: TextSpan;
        };
        function interfaceName(text: string, position?: number): {
            classificationType: string;
            text: string;
            textSpan?: TextSpan;
        };
        function moduleName(text: string, position?: number): {
            classificationType: string;
            text: string;
            textSpan?: TextSpan;
        };
        function typeParameterName(text: string, position?: number): {
            classificationType: string;
            text: string;
            textSpan?: TextSpan;
        };
        function parameterName(text: string, position?: number): {
            classificationType: string;
            text: string;
            textSpan?: TextSpan;
        };
        function typeAliasName(text: string, position?: number): {
            classificationType: string;
            text: string;
            textSpan?: TextSpan;
        };
        function jsxOpenTagName(text: string, position?: number): {
            classificationType: string;
            text: string;
            textSpan?: TextSpan;
        };
        function jsxCloseTagName(text: string, position?: number): {
            classificationType: string;
            text: string;
            textSpan?: TextSpan;
        };
        function jsxSelfClosingTagName(text: string, position?: number): {
            classificationType: string;
            text: string;
            textSpan?: TextSpan;
        };
        function jsxAttribute(text: string, position?: number): {
            classificationType: string;
            text: string;
            textSpan?: TextSpan;
        };
        function jsxText(text: string, position?: number): {
            classificationType: string;
            text: string;
            textSpan?: TextSpan;
        };
        function jsxAttributeStringLiteralValue(text: string, position?: number): {
            classificationType: string;
            text: string;
            textSpan?: TextSpan;
        };
    }

    interface ReferenceGroup {
        readonly definition: ReferencesDefinition;
        readonly ranges: ReadonlyArray<Range>;
    }
    type ReferencesDefinition = string | {
        text: string;
        range: Range;
    }
    interface Diagnostic {
        message: string;
        /** @default `test.ranges()[0]` */
        range?: Range;
        code: number;
        reportsUnnecessary?: true;
    }
    interface VerifyDocumentHighlightsOptions {
        filesToSearch?: ReadonlyArray<string>;
    }
    interface UserPreferences {
        readonly quotePreference?: "double" | "single";
        readonly includeCompletionsForModuleExports?: boolean;
        readonly includeInsertTextCompletions?: boolean;
        readonly importModuleSpecifierPreference?: "relative" | "non-relative";
        readonly importModuleSpecifierEnding?: "minimal" | "index" | "js";
    }
    interface CompletionsOptions {
        readonly marker?: ArrayOrSingle<string | Marker>;
        readonly isNewIdentifierLocation?: boolean;
        readonly isGlobalCompletion?: boolean;
        readonly exact?: ArrayOrSingle<ExpectedCompletionEntry>;
        readonly includes?: ArrayOrSingle<ExpectedCompletionEntry>;
        readonly excludes?: ArrayOrSingle<string>;
        readonly preferences?: UserPreferences;
        readonly triggerCharacter?: string;
    }
    type ExpectedCompletionEntry = string | ExpectedCompletionEntryObject;
    interface ExpectedCompletionEntryObject {
        readonly name: string;
        readonly source?: string;
        readonly insertText?: string;
        readonly replacementSpan?: Range;
        readonly hasAction?: boolean;
        readonly isRecommended?: boolean;
        readonly kind?: string;
        readonly kindModifiers?: string;
        readonly sortText?: completion.SortText;

        // details
        readonly text?: string;
        readonly documentation?: string;
        readonly tags?: ReadonlyArray<JSDocTagInfo>;
        readonly sourceDisplay?: string;
    }

    interface VerifySignatureHelpOptions {
        marker?: ArrayOrSingle<string | Marker>;
        /** @default 1 */
        overloadsCount?: number;
        docComment?: string;
        text?: string;
        parameterName?: string;
        parameterSpan?: string;
        parameterDocComment?: string;
        parameterCount?: number;
        argumentCount?: number;
        isVariadic?: boolean;
        tags?: ReadonlyArray<JSDocTagInfo>;
        triggerReason?: SignatureHelpTriggerReason;
    }

    export type SignatureHelpTriggerReason =
        | SignatureHelpInvokedReason
        | SignatureHelpCharacterTypedReason
        | SignatureHelpRetriggeredReason;

    /**
     * Signals that the user manually requested signature help.
     * The language service will unconditionally attempt to provide a result.
     */
    export interface SignatureHelpInvokedReason {
        kind: "invoked",
        triggerCharacter?: undefined,
    }

    /**
     * Signals that the signature help request came from a user typing a character.
     * Depending on the character and the syntactic context, the request may or may not be served a result.
     */
    export interface SignatureHelpCharacterTypedReason {
        kind: "characterTyped",
        /**
         * Character that was responsible for triggering signature help.
         */
        triggerCharacter: string,
    }

    /**
     * Signals that this signature help request came from typing a character or moving the cursor.
     * This should only occur if a signature help session was already active and the editor needs to see if it should adjust.
     * The language service will unconditionally attempt to provide a result.
     * `triggerCharacter` can be `undefined` for a retrigger caused by a cursor move.
     */
    export interface SignatureHelpRetriggeredReason {
        kind: "retrigger",
        /**
         * Character that was responsible for triggering signature help.
         */
        triggerCharacter?: string,
    }

    export interface VerifyCodeFixAvailableOptions {
        readonly description: string;
        readonly actions?: ReadonlyArray<{ readonly type: string, readonly data: {} }>;
        readonly commands?: ReadonlyArray<{}>;
    }

    interface VerifyNavigateToOptions {
        readonly pattern: string;
        readonly fileName?: string;
        readonly expected: ReadonlyArray<ExpectedNavigateToItem>;
    }
    interface ExpectedNavigateToItem {
        readonly name: string;
        readonly kind: string;
        readonly kindModifiers?: string; // default: ""
        readonly matchKind?: string; // default: "exact"
        readonly isCaseSensitive?: boolean; // default: "true"
        readonly range: Range;
        readonly containerName?: string; // default: ""
        readonly containerKind?: string; // default: ScriptElementKind.unknown
    }

    interface JSDocTagInfo {
        readonly name: string;
        readonly text: string | undefined;
    }

    interface GenerateTypesOptions {
        readonly name?: string;
        readonly value: unknown;
        readonly global?: boolean;
        readonly output?: string | undefined;
        readonly outputBaseline?: string;
    }

    type ArrayOrSingle<T> = T | ReadonlyArray<T>;
    type NewFileContent = string | { readonly [fileName: string]: string };

    type RenameLocationsOptions = ReadonlyArray<RenameLocationOptions> | {
        readonly findInStrings?: boolean;
        readonly findInComments?: boolean;
        readonly ranges: ReadonlyArray<RenameLocationOptions>;
        readonly providePrefixAndSuffixTextForRename?: boolean;
    };
    type RenameLocationOptions = Range | { readonly range: Range, readonly prefixText?: string, readonly suffixText?: string };
}
declare function verifyOperationIsCancelled(f: any): void;
declare var test: FourSlashInterface.test_;
declare var plugins: FourSlashInterface.plugins;
declare var goTo: FourSlashInterface.goTo;
declare var verify: FourSlashInterface.verify;
declare var edit: FourSlashInterface.edit;
declare var debug: FourSlashInterface.debug;
declare var format: FourSlashInterface.format;
declare var cancellation: FourSlashInterface.cancellation;
declare var classification: typeof FourSlashInterface.classification;
declare namespace completion {
    type Entry = FourSlashInterface.ExpectedCompletionEntryObject;
    export const enum SortText {
        LocationPriority = "0",
        SuggestedClassMembers = "1",
        GlobalsOrKeywords = "2",
        AutoImportSuggestions = "3",
        JavascriptIdentifiers = "4"
    }
    export const globalThisEntry: Entry;
    export const undefinedVarEntry: Entry;
    export const globals: ReadonlyArray<Entry>;
    export const globalsInJs: ReadonlyArray<Entry>;
    export const globalKeywords: ReadonlyArray<Entry>;
    export const globalInJsKeywords: ReadonlyArray<Entry>;
    export const insideMethodKeywords: ReadonlyArray<Entry>;
    export const insideMethodInJsKeywords: ReadonlyArray<Entry>;
    export const globalKeywordsPlusUndefined: ReadonlyArray<Entry>;
    export const globalsVars: ReadonlyArray<Entry>;
    export function globalsInsideFunction(plus: ReadonlyArray<Entry>): ReadonlyArray<Entry>;
    export function globalsInJsInsideFunction(plus: ReadonlyArray<Entry>): ReadonlyArray<Entry>;
    export function globalsPlus(plus: ReadonlyArray<FourSlashInterface.ExpectedCompletionEntry>): ReadonlyArray<Entry>;
    export function globalsInJsPlus(plus: ReadonlyArray<FourSlashInterface.ExpectedCompletionEntry>): ReadonlyArray<Entry>;
    export const keywordsWithUndefined: ReadonlyArray<Entry>;
    export const keywords: ReadonlyArray<Entry>;
    export const typeKeywords: ReadonlyArray<Entry>;
    export const globalTypes: ReadonlyArray<Entry>;
    export function globalTypesPlus(plus: ReadonlyArray<FourSlashInterface.ExpectedCompletionEntry>): ReadonlyArray<Entry>;
    export const classElementKeywords: ReadonlyArray<Entry>;
    export const classElementInJsKeywords: ReadonlyArray<Entry>;
    export const constructorParameterKeywords: ReadonlyArray<Entry>;
    export const functionMembers: ReadonlyArray<Entry>;
    export const stringMembers: ReadonlyArray<Entry>;
    export const functionMembersWithPrototype: ReadonlyArray<Entry>;
    export const statementKeywordsWithTypes: ReadonlyArray<Entry>;
    export const statementKeywords: ReadonlyArray<Entry>;
    export const statementInJsKeywords: ReadonlyArray<Entry>;
}
