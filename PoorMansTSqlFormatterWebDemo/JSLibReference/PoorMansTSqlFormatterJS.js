/**
 * A simple free (AGPL) T-SQL formatting library for JS
 * @version 2.0.1.22966
 * @copyright Copyright ©  2011-2017 Tao Klerks
 * @compiler Bridge.NET 16.0.0-beta4
 */
Bridge.assembly("PoorMansTSqlFormatterJS", function ($asm, globals) {
    "use strict";

    Bridge.define("PoorMansTSqlFormatterLib._SqlFormattingManager", {
        $kind: "interface"
    });

    Bridge.define("PoorMansTSqlFormatterLib.BaseFormatterState", {
        fields: {
            _outBuilder: null
        },
        props: {
            HtmlOutput: false
        },
        ctors: {
            init: function () {
                this._outBuilder = new System.Text.StringBuilder();
            },
            ctor: function (htmlOutput) {
                this.$initialize();
                this.HtmlOutput = htmlOutput;
            }
        },
        methods: {
            AddOutputContent: function (content) {
                this.AddOutputContent$1(content, null);
            },
            AddOutputContent$1: function (content, htmlClassName) {
                if (this.HtmlOutput) {
                    if (!System.String.isNullOrEmpty(htmlClassName)) {
                        this._outBuilder.append(System.String.concat("<span class=\"", htmlClassName, "\">"));
                    }
                    this._outBuilder.append(PoorMansTSqlFormatterLib.Utils.HtmlEncode(content));
                    if (!System.String.isNullOrEmpty(htmlClassName)) {
                        this._outBuilder.append("</span>");
                    }
                } else {
                    this._outBuilder.append(content);
                }
            },
            OpenClass: function (htmlClassName) {
                if (htmlClassName == null) {
                    throw new System.ArgumentNullException("htmlClassName");
                }

                if (this.HtmlOutput) {
                    this._outBuilder.append(System.String.concat("<span class=\"", htmlClassName, "\">"));
                }
            },
            CloseClass: function () {
                if (this.HtmlOutput) {
                    this._outBuilder.append("</span>");
                }
            },
            AddOutputContentRaw: function (content) {
                this._outBuilder.append(content);
            },
            AddOutputLineBreak: function () {
                this._outBuilder.append('\n');
            },
            DumpOutput: function () {
                return this._outBuilder.toString();
            }
        }
    });

    Bridge.define("PoorMansTSqlFormatterLib.BridgeUtils", {
        statics: {
            methods: {
                ToLowerInvariant$1: function (value) {
                    return value.toLowerCase();
                },
                ToLowerInvariant: function (value) {
                    return String.fromCharCode(value).toLowerCase().charCodeAt(0);
                },
                ToUpperInvariant$1: function (value) {
                    return value.toUpperCase();
                },
                ToUpperInvariant: function (value) {
                    return String.fromCharCode(value).toUpperCase().charCodeAt(0);
                }
            }
        }
    });

    Bridge.define("PoorMansTSqlFormatterLib.Interfaces.ISqlTreeFormatter", {
        $kind: "interface"
    });

    Bridge.define("PoorMansTSqlFormatterLib.Interfaces.ISqlTokenFormatter", {
        $kind: "interface"
    });

    Bridge.define("PoorMansTSqlFormatterLib.Formatters.TSqlStandardFormatter.SpecialRegionType", {
        $kind: "enum",
        statics: {
            fields: {
                NoFormat: 1,
                Minify: 2
            }
        }
    });

    Bridge.define("PoorMansTSqlFormatterLib.Formatters.TSqlStandardFormatterOptions", {
        statics: {
            fields: {
                _defaultOptions: null
            },
            ctors: {
                init: function () {
                    this._defaultOptions = new PoorMansTSqlFormatterLib.Formatters.TSqlStandardFormatterOptions.ctor();
                }
            }
        },
        fields: {
            _indentString: null
        },
        props: {
            IndentString: {
                get: function () {
                    return this._indentString;
                },
                set: function (value) {
                    this._indentString = System.String.replaceAll(System.String.replaceAll(value, "\\t", "\t"), "\\s", " ");
                }
            },
            SpacesPerTab: 0,
            MaxLineWidth: 0,
            ExpandCommaLists: false,
            TrailingCommas: false,
            SpaceAfterExpandedComma: false,
            ExpandBooleanExpressions: false,
            ExpandCaseStatements: false,
            ExpandBetweenConditions: false,
            UppercaseKeywords: false,
            BreakJoinOnSections: false,
            HTMLColoring: false,
            KeywordStandardization: false,
            ExpandInLists: false,
            NewClauseLineBreaks: 0,
            NewStatementLineBreaks: 0
        },
        ctors: {
            ctor: function () {
                this.$initialize();
                this.IndentString = "\t";
                this.SpacesPerTab = 4;
                this.MaxLineWidth = 999;
                this.ExpandCommaLists = true;
                this.TrailingCommas = false;
                this.SpaceAfterExpandedComma = false;
                this.ExpandBooleanExpressions = true;
                this.ExpandBetweenConditions = true;
                this.ExpandCaseStatements = true;
                this.UppercaseKeywords = true;
                this.BreakJoinOnSections = false;
                this.HTMLColoring = false;
                this.KeywordStandardization = false;
                this.ExpandInLists = true;
                this.NewClauseLineBreaks = 1;
                this.NewStatementLineBreaks = 2;
            },
            $ctor1: function (serializedString) {
                PoorMansTSqlFormatterLib.Formatters.TSqlStandardFormatterOptions.ctor.call(this);
                var $t;

                if (System.String.isNullOrEmpty(serializedString)) {
                    return;
                }

                //PLEASE NOTE: This is not reusable/general-purpose key-value serialization: it does not handle commas in data.
                // This will need to be enhanced if we ever need to store formatter options that might contain equals signs or 
                // commas.
                $t = Bridge.getEnumerator(System.String.split(serializedString, [44].map(function(i) {{ return String.fromCharCode(i); }})));
                try {
                    while ($t.moveNext()) {
                        var kvp = $t.Current;
                        var splitPair = System.String.split(kvp, [61].map(function(i) {{ return String.fromCharCode(i); }}));
                        var key = splitPair[System.Array.index(0, splitPair)];
                        var value = splitPair[System.Array.index(1, splitPair)];

                        if (Bridge.referenceEquals(key, "IndentString")) {
                            this.IndentString = value;
                        } else {
                            if (Bridge.referenceEquals(key, "SpacesPerTab")) {
                                this.SpacesPerTab = System.Convert.toInt32(value);
                            } else {
                                if (Bridge.referenceEquals(key, "MaxLineWidth")) {
                                    this.MaxLineWidth = System.Convert.toInt32(value);
                                } else {
                                    if (Bridge.referenceEquals(key, "ExpandCommaLists")) {
                                        this.ExpandCommaLists = System.Convert.toBoolean(value);
                                    } else {
                                        if (Bridge.referenceEquals(key, "TrailingCommas")) {
                                            this.TrailingCommas = System.Convert.toBoolean(value);
                                        } else {
                                            if (Bridge.referenceEquals(key, "SpaceAfterExpandedComma")) {
                                                this.SpaceAfterExpandedComma = System.Convert.toBoolean(value);
                                            } else {
                                                if (Bridge.referenceEquals(key, "ExpandBooleanExpressions")) {
                                                    this.ExpandBooleanExpressions = System.Convert.toBoolean(value);
                                                } else {
                                                    if (Bridge.referenceEquals(key, "ExpandBetweenConditions")) {
                                                        this.ExpandBetweenConditions = System.Convert.toBoolean(value);
                                                    } else {
                                                        if (Bridge.referenceEquals(key, "ExpandCaseStatements")) {
                                                            this.ExpandCaseStatements = System.Convert.toBoolean(value);
                                                        } else {
                                                            if (Bridge.referenceEquals(key, "UppercaseKeywords")) {
                                                                this.UppercaseKeywords = System.Convert.toBoolean(value);
                                                            } else {
                                                                if (Bridge.referenceEquals(key, "BreakJoinOnSections")) {
                                                                    this.BreakJoinOnSections = System.Convert.toBoolean(value);
                                                                } else {
                                                                    if (Bridge.referenceEquals(key, "HTMLColoring")) {
                                                                        this.HTMLColoring = System.Convert.toBoolean(value);
                                                                    } else {
                                                                        if (Bridge.referenceEquals(key, "KeywordStandardization")) {
                                                                            this.KeywordStandardization = System.Convert.toBoolean(value);
                                                                        } else {
                                                                            if (Bridge.referenceEquals(key, "ExpandInLists")) {
                                                                                this.ExpandInLists = System.Convert.toBoolean(value);
                                                                            } else {
                                                                                if (Bridge.referenceEquals(key, "NewClauseLineBreaks")) {
                                                                                    this.NewClauseLineBreaks = System.Convert.toInt32(value);
                                                                                } else {
                                                                                    if (Bridge.referenceEquals(key, "NewStatementLineBreaks")) {
                                                                                        this.NewStatementLineBreaks = System.Convert.toInt32(value);
                                                                                    } else {
                                                                                        throw new System.ArgumentException(System.String.concat("Unknown option: ", key));
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                } finally {
                    if (Bridge.is($t, System.IDisposable)) {
                        $t.System$IDisposable$dispose();
                    }
                }
        }
    },
    methods: {
        ToSerializedString: function () {
            var overrides = new (System.Collections.Generic.Dictionary$2(System.String,System.String))();

            if (!Bridge.referenceEquals(this.IndentString, PoorMansTSqlFormatterLib.Formatters.TSqlStandardFormatterOptions._defaultOptions.IndentString)) {
                overrides.add("IndentString", this.IndentString);
            }
            if (this.SpacesPerTab !== PoorMansTSqlFormatterLib.Formatters.TSqlStandardFormatterOptions._defaultOptions.SpacesPerTab) {
                overrides.add("SpacesPerTab", this.SpacesPerTab.toString());
            }
            if (this.MaxLineWidth !== PoorMansTSqlFormatterLib.Formatters.TSqlStandardFormatterOptions._defaultOptions.MaxLineWidth) {
                overrides.add("MaxLineWidth", this.MaxLineWidth.toString());
            }
            if (this.ExpandCommaLists !== PoorMansTSqlFormatterLib.Formatters.TSqlStandardFormatterOptions._defaultOptions.ExpandCommaLists) {
                overrides.add("ExpandCommaLists", System.Boolean.toString(this.ExpandCommaLists));
            }
            if (this.TrailingCommas !== PoorMansTSqlFormatterLib.Formatters.TSqlStandardFormatterOptions._defaultOptions.TrailingCommas) {
                overrides.add("TrailingCommas", System.Boolean.toString(this.TrailingCommas));
            }
            if (this.SpaceAfterExpandedComma !== PoorMansTSqlFormatterLib.Formatters.TSqlStandardFormatterOptions._defaultOptions.SpaceAfterExpandedComma) {
                overrides.add("SpaceAfterExpandedComma", System.Boolean.toString(this.SpaceAfterExpandedComma));
            }
            if (this.ExpandBooleanExpressions !== PoorMansTSqlFormatterLib.Formatters.TSqlStandardFormatterOptions._defaultOptions.ExpandBooleanExpressions) {
                overrides.add("ExpandBooleanExpressions", System.Boolean.toString(this.ExpandBooleanExpressions));
            }
            if (this.ExpandBetweenConditions !== PoorMansTSqlFormatterLib.Formatters.TSqlStandardFormatterOptions._defaultOptions.ExpandBetweenConditions) {
                overrides.add("ExpandBetweenConditions", System.Boolean.toString(this.ExpandBetweenConditions));
            }
            if (this.ExpandCaseStatements !== PoorMansTSqlFormatterLib.Formatters.TSqlStandardFormatterOptions._defaultOptions.ExpandCaseStatements) {
                overrides.add("ExpandCaseStatements", System.Boolean.toString(this.ExpandCaseStatements));
            }
            if (this.UppercaseKeywords !== PoorMansTSqlFormatterLib.Formatters.TSqlStandardFormatterOptions._defaultOptions.UppercaseKeywords) {
                overrides.add("UppercaseKeywords", System.Boolean.toString(this.UppercaseKeywords));
            }
            if (this.BreakJoinOnSections !== PoorMansTSqlFormatterLib.Formatters.TSqlStandardFormatterOptions._defaultOptions.BreakJoinOnSections) {
                overrides.add("BreakJoinOnSections", System.Boolean.toString(this.BreakJoinOnSections));
            }
            if (this.HTMLColoring !== PoorMansTSqlFormatterLib.Formatters.TSqlStandardFormatterOptions._defaultOptions.HTMLColoring) {
                overrides.add("HTMLColoring", System.Boolean.toString(this.HTMLColoring));
            }
            if (this.KeywordStandardization !== PoorMansTSqlFormatterLib.Formatters.TSqlStandardFormatterOptions._defaultOptions.KeywordStandardization) {
                overrides.add("KeywordStandardization", System.Boolean.toString(this.KeywordStandardization));
            }
            if (this.ExpandInLists !== PoorMansTSqlFormatterLib.Formatters.TSqlStandardFormatterOptions._defaultOptions.ExpandInLists) {
                overrides.add("ExpandInLists", System.Boolean.toString(this.ExpandInLists));
            }
            if (this.NewClauseLineBreaks !== PoorMansTSqlFormatterLib.Formatters.TSqlStandardFormatterOptions._defaultOptions.NewClauseLineBreaks) {
                overrides.add("NewClauseLineBreaks", this.NewClauseLineBreaks.toString());
            }
            if (this.NewStatementLineBreaks !== PoorMansTSqlFormatterLib.Formatters.TSqlStandardFormatterOptions._defaultOptions.NewStatementLineBreaks) {
                overrides.add("NewStatementLineBreaks", this.NewStatementLineBreaks.toString());
            }
            this.NewStatementLineBreaks = 2;

            if (overrides.count === 0) {
                return "";
            }
            return System.Linq.Enumerable.from(overrides).select($asm.$.PoorMansTSqlFormatterLib.Formatters.TSqlStandardFormatterOptions.f1).toArray(System.String).join(",");

        }
    }
    });

    Bridge.ns("PoorMansTSqlFormatterLib.Formatters.TSqlStandardFormatterOptions", $asm.$);

    Bridge.apply($asm.$.PoorMansTSqlFormatterLib.Formatters.TSqlStandardFormatterOptions, {
        f1: function (kvp) {
            return System.String.concat(kvp.key, "=", kvp.value);
        }
    });

    Bridge.define("PoorMansTSqlFormatterLib.Interfaces.ISqlTokenizer", {
        $kind: "interface"
    });

    Bridge.define("PoorMansTSqlFormatterLib.Interfaces.ISqlTokenParser", {
        $kind: "interface"
    });

    Bridge.define("PoorMansTSqlFormatterLib.Interfaces.IToken", {
        $kind: "interface"
    });

    Bridge.define("PoorMansTSqlFormatterLib.Interfaces.MessagingConstants", {
        statics: {
            fields: {
                FormatErrorDefaultMessage: null
            },
            ctors: {
                init: function () {
                    this.FormatErrorDefaultMessage = "--WARNING! ERRORS ENCOUNTERED DURING SQL PARSING!";
                }
            }
        }
    });

    Bridge.define("PoorMansTSqlFormatterLib.Interfaces.SqlHtmlConstants", {
        statics: {
            fields: {
                CLASS_OPERATOR: null,
                CLASS_COMMENT: null,
                CLASS_STRING: null,
                CLASS_FUNCTION: null,
                CLASS_KEYWORD: null,
                CLASS_ERRORHIGHLIGHT: null
            },
            ctors: {
                init: function () {
                    this.CLASS_OPERATOR = "SQLOperator";
                    this.CLASS_COMMENT = "SQLComment";
                    this.CLASS_STRING = "SQLString";
                    this.CLASS_FUNCTION = "SQLFunction";
                    this.CLASS_KEYWORD = "SQLKeyword";
                    this.CLASS_ERRORHIGHLIGHT = "SQLErrorHighlight";
                }
            }
        }
    });

    Bridge.define("PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants", {
        statics: {
            fields: {
                ENAME_SQL_ROOT: null,
                ENAME_SQL_STATEMENT: null,
                ENAME_SQL_CLAUSE: null,
                ENAME_SET_OPERATOR_CLAUSE: null,
                ENAME_INSERT_CLAUSE: null,
                ENAME_BEGIN_END_BLOCK: null,
                ENAME_TRY_BLOCK: null,
                ENAME_CATCH_BLOCK: null,
                ENAME_BATCH_SEPARATOR: null,
                ENAME_CASE_STATEMENT: null,
                ENAME_CASE_INPUT: null,
                ENAME_CASE_WHEN: null,
                ENAME_CASE_THEN: null,
                ENAME_CASE_ELSE: null,
                ENAME_IF_STATEMENT: null,
                ENAME_ELSE_CLAUSE: null,
                ENAME_BOOLEAN_EXPRESSION: null,
                ENAME_WHILE_LOOP: null,
                ENAME_CURSOR_DECLARATION: null,
                ENAME_CURSOR_FOR_BLOCK: null,
                ENAME_CURSOR_FOR_OPTIONS: null,
                ENAME_CTE_WITH_CLAUSE: null,
                ENAME_CTE_ALIAS: null,
                ENAME_CTE_AS_BLOCK: null,
                ENAME_BEGIN_TRANSACTION: null,
                ENAME_COMMIT_TRANSACTION: null,
                ENAME_ROLLBACK_TRANSACTION: null,
                ENAME_SAVE_TRANSACTION: null,
                ENAME_DDL_DECLARE_BLOCK: null,
                ENAME_DDL_PROCEDURAL_BLOCK: null,
                ENAME_DDL_OTHER_BLOCK: null,
                ENAME_DDL_AS_BLOCK: null,
                ENAME_DDL_PARENS: null,
                ENAME_DDL_SUBCLAUSE: null,
                ENAME_DDL_RETURNS: null,
                ENAME_DDLDETAIL_PARENS: null,
                ENAME_DDL_WITH_CLAUSE: null,
                ENAME_PERMISSIONS_BLOCK: null,
                ENAME_PERMISSIONS_DETAIL: null,
                ENAME_PERMISSIONS_TARGET: null,
                ENAME_PERMISSIONS_RECIPIENT: null,
                ENAME_TRIGGER_CONDITION: null,
                ENAME_SELECTIONTARGET_PARENS: null,
                ENAME_EXPRESSION_PARENS: null,
                ENAME_FUNCTION_PARENS: null,
                ENAME_IN_PARENS: null,
                ENAME_FUNCTION_KEYWORD: null,
                ENAME_DATATYPE_KEYWORD: null,
                ENAME_COMPOUNDKEYWORD: null,
                ENAME_OTHERKEYWORD: null,
                ENAME_LABEL: null,
                ENAME_CONTAINER_OPEN: null,
                ENAME_CONTAINER_MULTISTATEMENT: null,
                ENAME_CONTAINER_SINGLESTATEMENT: null,
                ENAME_CONTAINER_GENERALCONTENT: null,
                ENAME_CONTAINER_CLOSE: null,
                ENAME_SELECTIONTARGET: null,
                ENAME_MERGE_CLAUSE: null,
                ENAME_MERGE_TARGET: null,
                ENAME_MERGE_USING: null,
                ENAME_MERGE_CONDITION: null,
                ENAME_MERGE_WHEN: null,
                ENAME_MERGE_THEN: null,
                ENAME_MERGE_ACTION: null,
                ENAME_JOIN_ON_SECTION: null,
                ENAME_PSEUDONAME: null,
                ENAME_WHITESPACE: null,
                ENAME_OTHERNODE: null,
                ENAME_COMMENT_SINGLELINE: null,
                ENAME_COMMENT_SINGLELINE_CSTYLE: null,
                ENAME_COMMENT_MULTILINE: null,
                ENAME_STRING: null,
                ENAME_NSTRING: null,
                ENAME_QUOTED_STRING: null,
                ENAME_BRACKET_QUOTED_NAME: null,
                ENAME_COMMA: null,
                ENAME_PERIOD: null,
                ENAME_SEMICOLON: null,
                ENAME_SCOPERESOLUTIONOPERATOR: null,
                ENAME_ASTERISK: null,
                ENAME_EQUALSSIGN: null,
                ENAME_ALPHAOPERATOR: null,
                ENAME_OTHEROPERATOR: null,
                ENAME_AND_OPERATOR: null,
                ENAME_OR_OPERATOR: null,
                ENAME_BETWEEN_CONDITION: null,
                ENAME_BETWEEN_LOWERBOUND: null,
                ENAME_BETWEEN_UPPERBOUND: null,
                ENAME_NUMBER_VALUE: null,
                ENAME_MONETARY_VALUE: null,
                ENAME_BINARY_VALUE: null,
                ANAME_ERRORFOUND: null,
                ANAME_HASERROR: null,
                ANAME_DATALOSS: null,
                ANAME_SIMPLETEXT: null,
                ENAMELIST_COMMENT: null,
                ENAMELIST_NONCONTENT: null,
                ENAMELIST_NONSEMANTICCONTENT: null
            },
            ctors: {
                init: function () {
                    this.ENAME_SQL_ROOT = "SqlRoot";
                    this.ENAME_SQL_STATEMENT = "SqlStatement";
                    this.ENAME_SQL_CLAUSE = "Clause";
                    this.ENAME_SET_OPERATOR_CLAUSE = "SetOperatorClause";
                    this.ENAME_INSERT_CLAUSE = "InsertClause";
                    this.ENAME_BEGIN_END_BLOCK = "BeginEndBlock";
                    this.ENAME_TRY_BLOCK = "TryBlock";
                    this.ENAME_CATCH_BLOCK = "CatchBlock";
                    this.ENAME_BATCH_SEPARATOR = "BatchSeparator";
                    this.ENAME_CASE_STATEMENT = "CaseStatement";
                    this.ENAME_CASE_INPUT = "Input";
                    this.ENAME_CASE_WHEN = "When";
                    this.ENAME_CASE_THEN = "Then";
                    this.ENAME_CASE_ELSE = "CaseElse";
                    this.ENAME_IF_STATEMENT = "IfStatement";
                    this.ENAME_ELSE_CLAUSE = "ElseClause";
                    this.ENAME_BOOLEAN_EXPRESSION = "BooleanExpression";
                    this.ENAME_WHILE_LOOP = "WhileLoop";
                    this.ENAME_CURSOR_DECLARATION = "CursorDeclaration";
                    this.ENAME_CURSOR_FOR_BLOCK = "CursorForBlock";
                    this.ENAME_CURSOR_FOR_OPTIONS = "CursorForOptions";
                    this.ENAME_CTE_WITH_CLAUSE = "CTEWithClause";
                    this.ENAME_CTE_ALIAS = "CTEAlias";
                    this.ENAME_CTE_AS_BLOCK = "CTEAsBlock";
                    this.ENAME_BEGIN_TRANSACTION = "BeginTransaction";
                    this.ENAME_COMMIT_TRANSACTION = "CommitTransaction";
                    this.ENAME_ROLLBACK_TRANSACTION = "RollbackTransaction";
                    this.ENAME_SAVE_TRANSACTION = "SaveTransaction";
                    this.ENAME_DDL_DECLARE_BLOCK = "DDLDeclareBlock";
                    this.ENAME_DDL_PROCEDURAL_BLOCK = "DDLProceduralBlock";
                    this.ENAME_DDL_OTHER_BLOCK = "DDLOtherBlock";
                    this.ENAME_DDL_AS_BLOCK = "DDLAsBlock";
                    this.ENAME_DDL_PARENS = "DDLParens";
                    this.ENAME_DDL_SUBCLAUSE = "DDLSubClause";
                    this.ENAME_DDL_RETURNS = "DDLReturns";
                    this.ENAME_DDLDETAIL_PARENS = "DDLDetailParens";
                    this.ENAME_DDL_WITH_CLAUSE = "DDLWith";
                    this.ENAME_PERMISSIONS_BLOCK = "PermissionsBlock";
                    this.ENAME_PERMISSIONS_DETAIL = "PermissionsDetail";
                    this.ENAME_PERMISSIONS_TARGET = "PermissionsTarget";
                    this.ENAME_PERMISSIONS_RECIPIENT = "PermissionsRecipient";
                    this.ENAME_TRIGGER_CONDITION = "TriggerCondition";
                    this.ENAME_SELECTIONTARGET_PARENS = "SelectionTargetParens";
                    this.ENAME_EXPRESSION_PARENS = "ExpressionParens";
                    this.ENAME_FUNCTION_PARENS = "FunctionParens";
                    this.ENAME_IN_PARENS = "InParens";
                    this.ENAME_FUNCTION_KEYWORD = "FunctionKeyword";
                    this.ENAME_DATATYPE_KEYWORD = "DataTypeKeyword";
                    this.ENAME_COMPOUNDKEYWORD = "CompoundKeyword";
                    this.ENAME_OTHERKEYWORD = "OtherKeyword";
                    this.ENAME_LABEL = "Label";
                    this.ENAME_CONTAINER_OPEN = "ContainerOpen";
                    this.ENAME_CONTAINER_MULTISTATEMENT = "ContainerMultiStatementBody";
                    this.ENAME_CONTAINER_SINGLESTATEMENT = "ContainerSingleStatementBody";
                    this.ENAME_CONTAINER_GENERALCONTENT = "ContainerContentBody";
                    this.ENAME_CONTAINER_CLOSE = "ContainerClose";
                    this.ENAME_SELECTIONTARGET = "SelectionTarget";
                    this.ENAME_MERGE_CLAUSE = "MergeClause";
                    this.ENAME_MERGE_TARGET = "MergeTarget";
                    this.ENAME_MERGE_USING = "MergeUsing";
                    this.ENAME_MERGE_CONDITION = "MergeCondition";
                    this.ENAME_MERGE_WHEN = "MergeWhen";
                    this.ENAME_MERGE_THEN = "MergeThen";
                    this.ENAME_MERGE_ACTION = "MergeAction";
                    this.ENAME_JOIN_ON_SECTION = "JoinOn";
                    this.ENAME_PSEUDONAME = "PseudoName";
                    this.ENAME_WHITESPACE = "WhiteSpace";
                    this.ENAME_OTHERNODE = "Other";
                    this.ENAME_COMMENT_SINGLELINE = "SingleLineComment";
                    this.ENAME_COMMENT_SINGLELINE_CSTYLE = "SingleLineCommentCStyle";
                    this.ENAME_COMMENT_MULTILINE = "MultiLineComment";
                    this.ENAME_STRING = "String";
                    this.ENAME_NSTRING = "NationalString";
                    this.ENAME_QUOTED_STRING = "QuotedString";
                    this.ENAME_BRACKET_QUOTED_NAME = "BracketQuotedName";
                    this.ENAME_COMMA = "Comma";
                    this.ENAME_PERIOD = "Period";
                    this.ENAME_SEMICOLON = "Semicolon";
                    this.ENAME_SCOPERESOLUTIONOPERATOR = "ScopeResolutionOperator";
                    this.ENAME_ASTERISK = "Asterisk";
                    this.ENAME_EQUALSSIGN = "EqualsSign";
                    this.ENAME_ALPHAOPERATOR = "AlphaOperator";
                    this.ENAME_OTHEROPERATOR = "OtherOperator";
                    this.ENAME_AND_OPERATOR = "And";
                    this.ENAME_OR_OPERATOR = "Or";
                    this.ENAME_BETWEEN_CONDITION = "Between";
                    this.ENAME_BETWEEN_LOWERBOUND = "LowerBound";
                    this.ENAME_BETWEEN_UPPERBOUND = "UpperBound";
                    this.ENAME_NUMBER_VALUE = "NumberValue";
                    this.ENAME_MONETARY_VALUE = "MonetaryValue";
                    this.ENAME_BINARY_VALUE = "BinaryValue";
                    this.ANAME_ERRORFOUND = "errorFound";
                    this.ANAME_HASERROR = "hasError";
                    this.ANAME_DATALOSS = "dataLossLimitation";
                    this.ANAME_SIMPLETEXT = "simpleText";
                    this.ENAMELIST_COMMENT = System.Array.init([PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_COMMENT_MULTILINE, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_COMMENT_SINGLELINE, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_COMMENT_SINGLELINE_CSTYLE], System.String);
                    this.ENAMELIST_NONCONTENT = System.Array.init([PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_WHITESPACE, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_COMMENT_MULTILINE, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_COMMENT_SINGLELINE, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_COMMENT_SINGLELINE_CSTYLE], System.String);
                    this.ENAMELIST_NONSEMANTICCONTENT = System.Array.init([PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_SQL_CLAUSE, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_DDL_PROCEDURAL_BLOCK, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_DDL_OTHER_BLOCK, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_DDL_DECLARE_BLOCK], System.String);
                }
            }
        }
    });

    Bridge.define("PoorMansTSqlFormatterLib.Interfaces.SqlTokenType", {
        $kind: "enum",
        statics: {
            fields: {
                OpenParens: 0,
                CloseParens: 1,
                WhiteSpace: 2,
                OtherNode: 3,
                SingleLineComment: 4,
                SingleLineCommentCStyle: 5,
                MultiLineComment: 6,
                String: 7,
                NationalString: 8,
                BracketQuotedName: 9,
                QuotedString: 10,
                Comma: 11,
                Period: 12,
                Semicolon: 13,
                Colon: 14,
                Asterisk: 15,
                EqualsSign: 16,
                MonetaryValue: 17,
                Number: 18,
                BinaryValue: 19,
                OtherOperator: 20,
                PseudoName: 21
            }
        }
    });

    Bridge.define("PoorMansTSqlFormatterLib.ObfuscatingKeywordMapping", {
        statics: {
            props: {
                Instance: null
            },
            ctors: {
                ctor: function () {
                    PoorMansTSqlFormatterLib.ObfuscatingKeywordMapping.Instance = new (System.Collections.Generic.Dictionary$2(System.String,System.String))();

                    PoorMansTSqlFormatterLib.ObfuscatingKeywordMapping.Instance.add("PROCEDURE", "PROC");
                    PoorMansTSqlFormatterLib.ObfuscatingKeywordMapping.Instance.add("LEFT OUTER JOIN", "LEFT JOIN");
                    PoorMansTSqlFormatterLib.ObfuscatingKeywordMapping.Instance.add("RIGHT OUTER JOIN", "RIGHT JOIN");
                    PoorMansTSqlFormatterLib.ObfuscatingKeywordMapping.Instance.add("FULL OUTER JOIN", "FULL JOIN");
                    PoorMansTSqlFormatterLib.ObfuscatingKeywordMapping.Instance.add("INNER JOIN", "JOIN");
                    PoorMansTSqlFormatterLib.ObfuscatingKeywordMapping.Instance.add("TRANSACTION", "TRAN");
                    PoorMansTSqlFormatterLib.ObfuscatingKeywordMapping.Instance.add("BEGIN TRANSACTION", "BEGIN TRAN");
                    PoorMansTSqlFormatterLib.ObfuscatingKeywordMapping.Instance.add("COMMIT TRANSACTION", "COMMIT TRAN");
                    PoorMansTSqlFormatterLib.ObfuscatingKeywordMapping.Instance.add("ROLLBACK TRANSACTION", "ROLLBACK TRAN");
                    PoorMansTSqlFormatterLib.ObfuscatingKeywordMapping.Instance.add("VARBINARY", "BINARY VARYING");
                    PoorMansTSqlFormatterLib.ObfuscatingKeywordMapping.Instance.add("VARCHAR", "CHARACTER VARYING");
                    PoorMansTSqlFormatterLib.ObfuscatingKeywordMapping.Instance.add("CHARACTER", "CHAR");
                    PoorMansTSqlFormatterLib.ObfuscatingKeywordMapping.Instance.add("CHAR VARYING", "VARCHAR");
                    PoorMansTSqlFormatterLib.ObfuscatingKeywordMapping.Instance.add("DECIMAL", "DEC");
                    PoorMansTSqlFormatterLib.ObfuscatingKeywordMapping.Instance.add("FLOAT", "DOUBLE PRECISION");
                    PoorMansTSqlFormatterLib.ObfuscatingKeywordMapping.Instance.add("INTEGER", "INT");
                    PoorMansTSqlFormatterLib.ObfuscatingKeywordMapping.Instance.add("NCHAR", "NATIONAL CHARACTER");
                    PoorMansTSqlFormatterLib.ObfuscatingKeywordMapping.Instance.add("NATIONAL CHAR", "NCHAR");
                    PoorMansTSqlFormatterLib.ObfuscatingKeywordMapping.Instance.add("NVARCHAR", "NATIONAL CHARACTER VARYING");
                    PoorMansTSqlFormatterLib.ObfuscatingKeywordMapping.Instance.add("NATIONAL CHAR VARYING", "NVARCHAR");
                    PoorMansTSqlFormatterLib.ObfuscatingKeywordMapping.Instance.add("NTEXT", "NATIONAL TEXT");
                }
            }
        }
    });

    Bridge.define("PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType", {
        $kind: "enum",
        statics: {
            fields: {
                OperatorKeyword: 0,
                FunctionKeyword: 1,
                DataTypeKeyword: 2,
                OtherKeyword: 3
            }
        }
    });

    Bridge.define("PoorMansTSqlFormatterLib.ParseStructure.Node", {
        $kind: "interface"
    });

    Bridge.define("PoorMansTSqlFormatterLib.ParseStructure.NodeExtensions", {
        statics: {
            methods: {
                FollowingChild: function (value, fromChild) {
                    var $t;
                    if (value == null) {
                        return null;
                    }

                    if (fromChild == null) {
                        throw new System.ArgumentNullException("fromChild");
                    }

                    var targetFound = false;
                    var sibling = null;

                    $t = Bridge.getEnumerator(value.PoorMansTSqlFormatterLib$ParseStructure$Node$Children, PoorMansTSqlFormatterLib.ParseStructure.Node);
                    try {
                        while ($t.moveNext()) {
                            var child = $t.Current;
                            if (targetFound) {
                                sibling = child;
                                break;
                            }

                            if (Bridge.referenceEquals(child, fromChild)) {
                                targetFound = true;
                            }
                        }
                    } finally {
                        if (Bridge.is($t, System.IDisposable)) {
                            $t.System$IDisposable$dispose();
                        }
                    }
                    return sibling;
                },
                PreviousChild: function (value, fromChild) {
                    var $t;
                    if (value == null) {
                        return null;
                    }

                    if (fromChild == null) {
                        throw new System.ArgumentNullException("fromChild");
                    }

                    var previousSibling = null;

                    $t = Bridge.getEnumerator(value.PoorMansTSqlFormatterLib$ParseStructure$Node$Children, PoorMansTSqlFormatterLib.ParseStructure.Node);
                    try {
                        while ($t.moveNext()) {
                            var child = $t.Current;
                            if (Bridge.referenceEquals(child, fromChild)) {
                                return previousSibling;
                            }

                            previousSibling = child;
                        }
                    } finally {
                        if (Bridge.is($t, System.IDisposable)) {
                            $t.System$IDisposable$dispose();
                        }
                    }
                    return null;
                },
                NextSibling: function (value) {
                    if (value == null || value.PoorMansTSqlFormatterLib$ParseStructure$Node$Parent == null) {
                        return null;
                    }

                    return PoorMansTSqlFormatterLib.ParseStructure.NodeExtensions.FollowingChild(value.PoorMansTSqlFormatterLib$ParseStructure$Node$Parent, value);
                },
                PreviousSibling: function (value) {
                    if (value == null || value.PoorMansTSqlFormatterLib$ParseStructure$Node$Parent == null) {
                        return null;
                    }

                    return PoorMansTSqlFormatterLib.ParseStructure.NodeExtensions.PreviousChild(value.PoorMansTSqlFormatterLib$ParseStructure$Node$Parent, value);
                },
                RootContainer: function (value) {
                    if (value == null) {
                        return null;
                    }

                    var currentParent = value;
                    while (currentParent.PoorMansTSqlFormatterLib$ParseStructure$Node$Parent != null) {
                        currentParent = currentParent.PoorMansTSqlFormatterLib$ParseStructure$Node$Parent;
                    }
                    return currentParent;
                },
                ChildrenByName: function (value, name) {
                    if (value == null) {
                        return System.Linq.Enumerable.empty();
                    }

                    return System.Linq.Enumerable.from(value.PoorMansTSqlFormatterLib$ParseStructure$Node$Children).where(function (p) {
                            return Bridge.referenceEquals(p.PoorMansTSqlFormatterLib$ParseStructure$Node$Name, name);
                        });
                },
                ChildrenByNames: function (value, names) {
                    if (value == null) {
                        return System.Linq.Enumerable.empty();
                    }

                    return System.Linq.Enumerable.from(value.PoorMansTSqlFormatterLib$ParseStructure$Node$Children).where(function (p) {
                            return System.Linq.Enumerable.from(names).contains(p.PoorMansTSqlFormatterLib$ParseStructure$Node$Name);
                        });
                },
                ChildrenExcludingNames: function (value, names) {
                    if (value == null) {
                        return System.Linq.Enumerable.empty();
                    }

                    return System.Linq.Enumerable.from(value.PoorMansTSqlFormatterLib$ParseStructure$Node$Children).where(function (p) {
                            return !System.Linq.Enumerable.from(names).contains(p.PoorMansTSqlFormatterLib$ParseStructure$Node$Name);
                        });
                },
                ChildByName: function (value, name) {
                    return System.Linq.Enumerable.from(PoorMansTSqlFormatterLib.ParseStructure.NodeExtensions.ChildrenByName(value, name)).singleOrDefault(null, null);
                },
                ChildByNames: function (value, names) {
                    return System.Linq.Enumerable.from(PoorMansTSqlFormatterLib.ParseStructure.NodeExtensions.ChildrenByNames(value, names)).singleOrDefault(null, null);
                },
                ChildExcludingNames: function (value, names) {
                    return System.Linq.Enumerable.from(PoorMansTSqlFormatterLib.ParseStructure.NodeExtensions.ChildrenExcludingNames(value, names)).singleOrDefault(null, null);
                },
                ExtractStructureBetween: function (startingElement, endingElement) {
                    var $t;
                    var currentNode = startingElement;
                    var previousNode = null;
                    var remainder = null;
                    var remainderPosition = null;

                    while (currentNode != null) {
                        if (Bridge.equals(currentNode, endingElement)) {
                            break;
                        }

                        if (previousNode != null) {
                            var copyOfThisNode = PoorMansTSqlFormatterLib.ParseStructure.NodeFactory.CreateNode(currentNode.PoorMansTSqlFormatterLib$ParseStructure$Node$Name, currentNode.PoorMansTSqlFormatterLib$ParseStructure$Node$TextValue);

                            $t = Bridge.getEnumerator(currentNode.PoorMansTSqlFormatterLib$ParseStructure$Node$Attributes, System.Collections.Generic.KeyValuePair$2(System.String,System.String));
                            try {
                                while ($t.moveNext()) {
                                    var attribute = $t.Current;
                                    copyOfThisNode.PoorMansTSqlFormatterLib$ParseStructure$Node$SetAttribute(attribute.key, attribute.value);
                                }
                            } finally {
                                if (Bridge.is($t, System.IDisposable)) {
                                    $t.System$IDisposable$dispose();
                                }
                            }
                            if (remainderPosition == null) {
                                remainderPosition = copyOfThisNode;
                                remainder = copyOfThisNode;
                            } else if (Bridge.equals(currentNode, previousNode.PoorMansTSqlFormatterLib$ParseStructure$Node$Parent) && remainderPosition.PoorMansTSqlFormatterLib$ParseStructure$Node$Parent != null) {
                                remainderPosition = remainderPosition.PoorMansTSqlFormatterLib$ParseStructure$Node$Parent;
                            } else if (Bridge.equals(currentNode, previousNode.PoorMansTSqlFormatterLib$ParseStructure$Node$Parent) && remainderPosition.PoorMansTSqlFormatterLib$ParseStructure$Node$Parent == null) {
                                copyOfThisNode.PoorMansTSqlFormatterLib$ParseStructure$Node$AddChild(remainderPosition);
                                remainderPosition = copyOfThisNode;
                                remainder = copyOfThisNode;
                            } else if (Bridge.equals(currentNode, PoorMansTSqlFormatterLib.ParseStructure.NodeExtensions.NextSibling(previousNode)) && remainderPosition.PoorMansTSqlFormatterLib$ParseStructure$Node$Parent != null) {
                                remainderPosition.PoorMansTSqlFormatterLib$ParseStructure$Node$Parent.PoorMansTSqlFormatterLib$ParseStructure$Node$AddChild(copyOfThisNode);
                                remainderPosition = copyOfThisNode;
                            } else if (Bridge.equals(currentNode, PoorMansTSqlFormatterLib.ParseStructure.NodeExtensions.NextSibling(previousNode)) && remainderPosition.PoorMansTSqlFormatterLib$ParseStructure$Node$Parent == null) {
                                var copyOfThisNodesParent = PoorMansTSqlFormatterLib.ParseStructure.NodeFactory.CreateNode(currentNode.PoorMansTSqlFormatterLib$ParseStructure$Node$Parent.PoorMansTSqlFormatterLib$ParseStructure$Node$Name, currentNode.PoorMansTSqlFormatterLib$ParseStructure$Node$Parent.PoorMansTSqlFormatterLib$ParseStructure$Node$TextValue);
                                remainder = copyOfThisNodesParent;
                                remainder.PoorMansTSqlFormatterLib$ParseStructure$Node$AddChild(remainderPosition);
                                remainder.PoorMansTSqlFormatterLib$ParseStructure$Node$AddChild(copyOfThisNode);
                                remainderPosition = copyOfThisNode;
                            } else {
                                //we must be a child
                                remainderPosition.PoorMansTSqlFormatterLib$ParseStructure$Node$AddChild(copyOfThisNode);
                                remainderPosition = copyOfThisNode;
                            }
                        }

                        var nextNode = null;
                        if (previousNode != null && !(Bridge.equals(currentNode, previousNode.PoorMansTSqlFormatterLib$ParseStructure$Node$Parent))) {
                            nextNode = System.Linq.Enumerable.from(currentNode.PoorMansTSqlFormatterLib$ParseStructure$Node$Children).firstOrDefault(null, null);
                        } else if (PoorMansTSqlFormatterLib.ParseStructure.NodeExtensions.NextSibling(currentNode) != null) {
                            nextNode = PoorMansTSqlFormatterLib.ParseStructure.NodeExtensions.NextSibling(currentNode);
                        } else {
                            nextNode = currentNode.PoorMansTSqlFormatterLib$ParseStructure$Node$Parent;
                        }

                        previousNode = currentNode;
                        currentNode = nextNode;
                    }

                    return remainder;
                }
            }
        }
    });

    Bridge.define("PoorMansTSqlFormatterLib.ParseStructure.NodeFactory", {
        statics: {
            methods: {
                CreateNode: function (name, textValue) {
                    var $t;
                    return ($t = new PoorMansTSqlFormatterLib.ParseStructure.NodeImpl(), $t.Name = name, $t.TextValue = textValue, $t);
                }
            }
        }
    });

    Bridge.define("PoorMansTSqlFormatterLib.StandardKeywordRemapping", {
        statics: {
            props: {
                Instance: null
            },
            ctors: {
                ctor: function () {
                    PoorMansTSqlFormatterLib.StandardKeywordRemapping.Instance = new (System.Collections.Generic.Dictionary$2(System.String,System.String))();

                    PoorMansTSqlFormatterLib.StandardKeywordRemapping.Instance.add("PROC", "PROCEDURE");
                    PoorMansTSqlFormatterLib.StandardKeywordRemapping.Instance.add("LEFT OUTER JOIN", "LEFT JOIN");
                    PoorMansTSqlFormatterLib.StandardKeywordRemapping.Instance.add("RIGHT OUTER JOIN", "RIGHT JOIN");
                    PoorMansTSqlFormatterLib.StandardKeywordRemapping.Instance.add("FULL OUTER JOIN", "FULL JOIN");
                    PoorMansTSqlFormatterLib.StandardKeywordRemapping.Instance.add("JOIN", "INNER JOIN");
                    //TODO: This is now wrong in MERGE statements... we now need a scope-limitation strategy :(
                    //Instance.Add("INSERT", "INSERT INTO");
                    PoorMansTSqlFormatterLib.StandardKeywordRemapping.Instance.add("TRAN", "TRANSACTION");
                    PoorMansTSqlFormatterLib.StandardKeywordRemapping.Instance.add("BEGIN TRAN", "BEGIN TRANSACTION");
                    PoorMansTSqlFormatterLib.StandardKeywordRemapping.Instance.add("COMMIT TRAN", "COMMIT TRANSACTION");
                    PoorMansTSqlFormatterLib.StandardKeywordRemapping.Instance.add("ROLLBACK TRAN", "ROLLBACK TRANSACTION");
                    PoorMansTSqlFormatterLib.StandardKeywordRemapping.Instance.add("BINARY VARYING", "VARBINARY");
                    PoorMansTSqlFormatterLib.StandardKeywordRemapping.Instance.add("CHAR VARYING", "VARCHAR");
                    PoorMansTSqlFormatterLib.StandardKeywordRemapping.Instance.add("CHARACTER", "CHAR");
                    PoorMansTSqlFormatterLib.StandardKeywordRemapping.Instance.add("CHARACTER VARYING", "VARCHAR");
                    PoorMansTSqlFormatterLib.StandardKeywordRemapping.Instance.add("DEC", "DECIMAL");
                    PoorMansTSqlFormatterLib.StandardKeywordRemapping.Instance.add("DOUBLE PRECISION", "FLOAT");
                    PoorMansTSqlFormatterLib.StandardKeywordRemapping.Instance.add("INTEGER", "INT");
                    PoorMansTSqlFormatterLib.StandardKeywordRemapping.Instance.add("NATIONAL CHARACTER", "NCHAR");
                    PoorMansTSqlFormatterLib.StandardKeywordRemapping.Instance.add("NATIONAL CHAR", "NCHAR");
                    PoorMansTSqlFormatterLib.StandardKeywordRemapping.Instance.add("NATIONAL CHARACTER VARYING", "NVARCHAR");
                    PoorMansTSqlFormatterLib.StandardKeywordRemapping.Instance.add("NATIONAL CHAR VARYING", "NVARCHAR");
                    PoorMansTSqlFormatterLib.StandardKeywordRemapping.Instance.add("NATIONAL TEXT", "NTEXT");
                    PoorMansTSqlFormatterLib.StandardKeywordRemapping.Instance.add("OUT", "OUTPUT");
                    //TODO: This is wrong when a TIMESTAMP column is unnamed; ROWVERSION does not auto-name. Due to context-sensitivity, this mapping is disabled for now.
                    // REF: http://msdn.microsoft.com/en-us/library/ms182776.aspx
                    //Instance.Add("TIMESTAMP", "ROWVERSION");
                }
            }
        }
    });

    Bridge.define("PoorMansTSqlFormatterLib.Tokenizers.SimplifiedStringReader", {
        fields: {
            inputChars: null,
            nextCharIndex: 0
        },
        props: {
            LastCharacterPosition: {
                get: function () {
                    if (this.nextCharIndex <= this.inputChars.length) {
                        return System.Int64(this.nextCharIndex);
                    } else {
                        return System.Int64(this.inputChars.length);
                    }
                }
            }
        },
        ctors: {
            init: function () {
                this.nextCharIndex = 0;
            },
            ctor: function (inputString) {
                this.$initialize();
                this.inputChars = System.String.toCharArray(inputString, 0, inputString.length);
            }
        },
        methods: {
            Read: function () {
                var nextChar = this.Peek();
                this.nextCharIndex = (this.nextCharIndex + 1) | 0;
                return nextChar;
            },
            Peek: function () {
                if (this.nextCharIndex < this.inputChars.length) {
                    return this.inputChars[System.Array.index(this.nextCharIndex, this.inputChars)];
                } else {
                    return -1;
                }
            }
        }
    });

    Bridge.define("PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.SqlTokenizationType", {
        $kind: "enum",
        statics: {
            fields: {
                WhiteSpace: 0,
                OtherNode: 1,
                SingleLineComment: 2,
                SingleLineCommentCStyle: 3,
                BlockComment: 4,
                String: 5,
                NString: 6,
                QuotedString: 7,
                BracketQuotedName: 8,
                OtherOperator: 9,
                Number: 10,
                BinaryValue: 11,
                MonetaryValue: 12,
                DecimalValue: 13,
                FloatValue: 14,
                PseudoName: 15,
                SingleAsterisk: 16,
                SingleDollar: 17,
                SingleHyphen: 18,
                SingleSlash: 19,
                SingleN: 20,
                SingleLT: 21,
                SingleGT: 22,
                SingleExclamation: 23,
                SinglePeriod: 24,
                SingleZero: 25,
                SinglePipe: 26,
                SingleEquals: 27,
                SingleOtherCompoundableOperator: 28
            }
        }
    });

    Bridge.define("PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.TokenizationState", {
        props: {
            TokenContainer: null,
            InputReader: null,
            CurrentTokenizationType: null,
            CurrentTokenValue: null,
            CommentNesting: 0,
            CurrentCharInt: 0,
            CurrentChar: {
                get: function () {
                    if (this.CurrentCharInt < 0) {
                        throw new System.InvalidOperationException("No character has been read from the stream");
                    }

                    if (!this.HasUnprocessedCurrentCharacter) {
                        throw new System.InvalidOperationException("The current character has already been consumed");
                    }

                    return ((this.CurrentCharInt) & 65535);
                }
            },
            RequestedMarkerPosition: null,
            HasUnprocessedCurrentCharacter: false
        },
        ctors: {
            init: function () {
                this.TokenContainer = new PoorMansTSqlFormatterLib.TokenList();
                this.CurrentTokenValue = new System.Text.StringBuilder();
                this.CommentNesting = 0;
                this.CurrentCharInt = -1;
            },
            ctor: function (inputSQL, requestedMarkerPosition) {
                this.$initialize();
                if (System.Nullable.liftcmp("gt", requestedMarkerPosition, System.Int64.lift(inputSQL.length))) {
                    throw new System.ArgumentException("Requested marker position cannot be beyond the end of the input string", "requestedMarkerPosition");
                }

                this.InputReader = new PoorMansTSqlFormatterLib.Tokenizers.SimplifiedStringReader(inputSQL);
                this.RequestedMarkerPosition = requestedMarkerPosition;
            }
        },
        methods: {
            ReadNextCharacter: function () {
                if (this.HasUnprocessedCurrentCharacter) {
                    throw new System.Exception("Unprocessed character detected!");
                }

                this.CurrentCharInt = this.InputReader.Read();

                if (this.CurrentCharInt >= 0) {
                    this.HasUnprocessedCurrentCharacter = true;
                }
            },
            ConsumeCurrentCharacterIntoToken: function () {
                if (!this.HasUnprocessedCurrentCharacter) {
                    throw new System.Exception("No current character to consume!");
                }

                this.CurrentTokenValue.append(String.fromCharCode(this.CurrentChar));
                this.HasUnprocessedCurrentCharacter = false;
            },
            HasRemainingCharacters: function () {
                if (!this.HasUnprocessedCurrentCharacter) {
                    throw new System.Exception("No current character to consume!");
                }

                this.CurrentTokenValue.append(String.fromCharCode(this.CurrentChar));
                this.HasUnprocessedCurrentCharacter = false;
            },
            DiscardNextCharacter: function () {
                this.ReadNextCharacter();
                this.HasUnprocessedCurrentCharacter = false;
            }
        }
    });

    Bridge.define("PoorMansTSqlFormatterLib.Utils", {
        statics: {
            methods: {
                HtmlEncode: function (raw) {
                    var $t;
                    /* 
                      This is a "Roll Your Own" implementation of HtmlEncode, which was necessary in the end because people want
                      to use the library with .Net 3.5 Client Profile and other restricted environments; the dependency on 
                      System.Web just for HtmlEncode was always a little disturbing anyway.
                      I've attempted to optimize the implementation towards strings that don't actually contain any special 
                      characters, and I've also skipped some of the more interesting stuff that I see in the MS implementation
                      (pointers, and some special handling in the WinAnsi special range of characters?), keeping it to the basic 
                      4 "known bad" characters.
                    */

                    if (raw == null) {
                        return null;
                    }

                    var outBuilder = null;
                    var latestCheckPos = 0;
                    var latestReplacementPos = 0;

                    $t = Bridge.getEnumerator(raw);
                    try {
                        while ($t.moveNext()) {
                            var c = $t.Current;
                            var replacementString = null;

                            switch (c) {
                                case 62: 
                                    replacementString = "&gt;";
                                    break;
                                case 60: 
                                    replacementString = "&lt;";
                                    break;
                                case 38: 
                                    replacementString = "&amp;";
                                    break;
                                case 34: 
                                    replacementString = "&quot;";
                                    break;
                            }

                            if (replacementString != null) {
                                if (outBuilder == null) {
                                    outBuilder = new System.Text.StringBuilder("", raw.length);
                                }

                                if (latestReplacementPos < latestCheckPos) {
                                    outBuilder.append(raw.substr(latestReplacementPos, ((latestCheckPos - latestReplacementPos) | 0)));
                                }

                                outBuilder.append(replacementString);

                                latestReplacementPos = (latestCheckPos + 1) | 0;
                            }

                            latestCheckPos = (latestCheckPos + 1) | 0;
                        }
                    } finally {
                        if (Bridge.is($t, System.IDisposable)) {
                            $t.System$IDisposable$dispose();
                        }
                    }
                    if (outBuilder != null) {
                        if (latestReplacementPos < latestCheckPos) {
                            outBuilder.append(raw.substr(latestReplacementPos));
                        }

                        return outBuilder.toString();
                    } else {
                        return raw;
                    }
                }
            }
        }
    });

    Bridge.define("PoorMansTSqlFormatterLib.Formatters.HtmlPageWrapper", {
        inherits: [PoorMansTSqlFormatterLib.Interfaces.ISqlTreeFormatter],
        statics: {
            fields: {
                HTML_OUTER_PAGE: null
            },
            ctors: {
                init: function () {
                    this.HTML_OUTER_PAGE = "<!DOCTYPE html >\r\n<html>\r\n<head>\r\n</head>\r\n<body>\r\n<style type=\"text/css\">\r\n.SQLCode {{\r\n\tfont-size: 13px;\r\n\tfont-weight: bold;\r\n\tfont-family: monospace;;\r\n\twhite-space: pre;\r\n    -o-tab-size: 4;\r\n    -moz-tab-size: 4;\r\n    -webkit-tab-size: 4;\r\n}}\r\n.SQLComment {{\r\n\tcolor: #00AA00;\r\n}}\r\n.SQLString {{\r\n\tcolor: #AA0000;\r\n}}\r\n.SQLFunction {{\r\n\tcolor: #AA00AA;\r\n}}\r\n.SQLKeyword {{\r\n\tcolor: #0000AA;\r\n}}\r\n.SQLOperator {{\r\n\tcolor: #777777;\r\n}}\r\n.SQLErrorHighlight {{\r\n\tbackground-color: #FFFF00;\r\n}}\r\n\r\n\r\n</style>\r\n<pre class=\"SQLCode\">{0}</pre>\r\n</body>\r\n</html>\r\n";
                }
            }
        },
        fields: {
            _underlyingFormatter: null
        },
        props: {
            HTMLFormatted: {
                get: function () {
                    return true;
                }
            },
            ErrorOutputPrefix: {
                get: function () {
                    return this._underlyingFormatter.PoorMansTSqlFormatterLib$Interfaces$ISqlTreeFormatter$ErrorOutputPrefix;
                },
                set: function (value) {
                    throw new System.NotSupportedException("Error output prefix should be set on the underlying formatter - it cannot be set on the Html Page Wrapper.");
                }
            }
        },
        alias: [
            "HTMLFormatted", "PoorMansTSqlFormatterLib$Interfaces$ISqlTreeFormatter$HTMLFormatted",
            "ErrorOutputPrefix", "PoorMansTSqlFormatterLib$Interfaces$ISqlTreeFormatter$ErrorOutputPrefix",
            "FormatSQLTree", "PoorMansTSqlFormatterLib$Interfaces$ISqlTreeFormatter$FormatSQLTree"
        ],
        ctors: {
            ctor: function (underlyingFormatter) {
                this.$initialize();
                if (underlyingFormatter == null) {
                    throw new System.ArgumentNullException("underlyingFormatter");
                }

                this._underlyingFormatter = underlyingFormatter;
            }
        },
        methods: {
            FormatSQLTree: function (sqlTree) {
                var formattedResult = this._underlyingFormatter.PoorMansTSqlFormatterLib$Interfaces$ISqlTreeFormatter$FormatSQLTree(sqlTree);
                if (this._underlyingFormatter.PoorMansTSqlFormatterLib$Interfaces$ISqlTreeFormatter$HTMLFormatted) {
                    return System.String.format(PoorMansTSqlFormatterLib.Formatters.HtmlPageWrapper.HTML_OUTER_PAGE, formattedResult);
                } else {
                    return System.String.format(PoorMansTSqlFormatterLib.Formatters.HtmlPageWrapper.HTML_OUTER_PAGE, PoorMansTSqlFormatterLib.Utils.HtmlEncode(formattedResult));
                }
            }
        }
    });

    /** @namespace PoorMansTSqlFormatterLib.Formatters */

    /**
     * This formatter is intended to output *exactly the same content as initially parsed*, unless the 
     "HtmlColoring" option is enabled (then it should look the same in HTML, except for the coloring).
     *
     * @public
     * @class PoorMansTSqlFormatterLib.Formatters.TSqlIdentityFormatter
     * @implements  PoorMansTSqlFormatterLib.Interfaces.ISqlTokenFormatter
     * @implements  PoorMansTSqlFormatterLib.Interfaces.ISqlTreeFormatter
     */
    Bridge.define("PoorMansTSqlFormatterLib.Formatters.TSqlIdentityFormatter", {
        inherits: [PoorMansTSqlFormatterLib.Interfaces.ISqlTokenFormatter,PoorMansTSqlFormatterLib.Interfaces.ISqlTreeFormatter],
        statics: {
            methods: {
                ProcessSqlNodeList: function (state, rootList) {
                    var $t;
                    $t = Bridge.getEnumerator(rootList, PoorMansTSqlFormatterLib.ParseStructure.Node);
                    try {
                        while ($t.moveNext()) {
                            var contentElement = $t.Current;
                            PoorMansTSqlFormatterLib.Formatters.TSqlIdentityFormatter.ProcessSqlNode(state, contentElement);
                        }
                    } finally {
                        if (Bridge.is($t, System.IDisposable)) {
                            $t.System$IDisposable$dispose();
                        }
                    }},
                ProcessSqlNode: function (state, contentElement) {
                    var $t;
                    if (Bridge.referenceEquals(contentElement.PoorMansTSqlFormatterLib$ParseStructure$Node$GetAttributeValue(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ANAME_HASERROR), "1")) {
                        state.OpenClass(PoorMansTSqlFormatterLib.Interfaces.SqlHtmlConstants.CLASS_ERRORHIGHLIGHT);
                    }

                    switch (contentElement.PoorMansTSqlFormatterLib$ParseStructure$Node$Name) {
                        case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_DDLDETAIL_PARENS: 
                        case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_DDL_PARENS: 
                        case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_FUNCTION_PARENS: 
                        case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_IN_PARENS: 
                        case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_EXPRESSION_PARENS: 
                        case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_SELECTIONTARGET_PARENS: 
                            state.AddOutputContent("(");
                            PoorMansTSqlFormatterLib.Formatters.TSqlIdentityFormatter.ProcessSqlNodeList(state, contentElement.PoorMansTSqlFormatterLib$ParseStructure$Node$Children);
                            state.AddOutputContent(")");
                            break;
                        case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_SQL_ROOT: 
                        case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_SQL_STATEMENT: 
                        case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_SQL_CLAUSE: 
                        case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_BOOLEAN_EXPRESSION: 
                        case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_DDL_PROCEDURAL_BLOCK: 
                        case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_DDL_OTHER_BLOCK: 
                        case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_DDL_DECLARE_BLOCK: 
                        case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CURSOR_DECLARATION: 
                        case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_BEGIN_END_BLOCK: 
                        case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_TRY_BLOCK: 
                        case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CATCH_BLOCK: 
                        case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CASE_STATEMENT: 
                        case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CASE_INPUT: 
                        case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CASE_WHEN: 
                        case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CASE_THEN: 
                        case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CASE_ELSE: 
                        case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_IF_STATEMENT: 
                        case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_ELSE_CLAUSE: 
                        case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_WHILE_LOOP: 
                        case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_DDL_AS_BLOCK: 
                        case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_BETWEEN_CONDITION: 
                        case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_BETWEEN_LOWERBOUND: 
                        case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_BETWEEN_UPPERBOUND: 
                        case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CTE_WITH_CLAUSE: 
                        case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CTE_ALIAS: 
                        case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CTE_AS_BLOCK: 
                        case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CURSOR_FOR_BLOCK: 
                        case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CURSOR_FOR_OPTIONS: 
                        case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_TRIGGER_CONDITION: 
                        case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_COMPOUNDKEYWORD: 
                        case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_BEGIN_TRANSACTION: 
                        case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_ROLLBACK_TRANSACTION: 
                        case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_SAVE_TRANSACTION: 
                        case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_COMMIT_TRANSACTION: 
                        case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_BATCH_SEPARATOR: 
                        case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_SET_OPERATOR_CLAUSE: 
                        case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CONTAINER_OPEN: 
                        case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CONTAINER_MULTISTATEMENT: 
                        case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CONTAINER_SINGLESTATEMENT: 
                        case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CONTAINER_GENERALCONTENT: 
                        case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CONTAINER_CLOSE: 
                        case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_SELECTIONTARGET: 
                        case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_PERMISSIONS_BLOCK: 
                        case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_PERMISSIONS_DETAIL: 
                        case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_PERMISSIONS_TARGET: 
                        case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_PERMISSIONS_RECIPIENT: 
                        case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_DDL_WITH_CLAUSE: 
                        case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_MERGE_CLAUSE: 
                        case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_MERGE_TARGET: 
                        case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_MERGE_USING: 
                        case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_MERGE_CONDITION: 
                        case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_MERGE_WHEN: 
                        case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_MERGE_THEN: 
                        case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_MERGE_ACTION: 
                        case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_JOIN_ON_SECTION: 
                        case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_DDL_RETURNS: 
                            $t = Bridge.getEnumerator(contentElement.PoorMansTSqlFormatterLib$ParseStructure$Node$Children, PoorMansTSqlFormatterLib.ParseStructure.Node);
                            try {
                                while ($t.moveNext()) {
                                    var childNode = $t.Current;
                                    PoorMansTSqlFormatterLib.Formatters.TSqlIdentityFormatter.ProcessSqlNode(state, childNode);
                                }
                            } finally {
                                if (Bridge.is($t, System.IDisposable)) {
                                    $t.System$IDisposable$dispose();
                                }
                            }break;
                        case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_COMMENT_MULTILINE: 
                            state.AddOutputContent$1(System.String.concat("/*", contentElement.PoorMansTSqlFormatterLib$ParseStructure$Node$TextValue, "*/"), PoorMansTSqlFormatterLib.Interfaces.SqlHtmlConstants.CLASS_COMMENT);
                            break;
                        case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_COMMENT_SINGLELINE: 
                            state.AddOutputContent$1(System.String.concat("--", contentElement.PoorMansTSqlFormatterLib$ParseStructure$Node$TextValue), PoorMansTSqlFormatterLib.Interfaces.SqlHtmlConstants.CLASS_COMMENT);
                            break;
                        case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_COMMENT_SINGLELINE_CSTYLE: 
                            state.AddOutputContent$1(System.String.concat("//", contentElement.PoorMansTSqlFormatterLib$ParseStructure$Node$TextValue), PoorMansTSqlFormatterLib.Interfaces.SqlHtmlConstants.CLASS_COMMENT);
                            break;
                        case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_STRING: 
                            state.AddOutputContent$1(System.String.concat("'", System.String.replaceAll(contentElement.PoorMansTSqlFormatterLib$ParseStructure$Node$TextValue, "'", "''"), "'"), PoorMansTSqlFormatterLib.Interfaces.SqlHtmlConstants.CLASS_STRING);
                            break;
                        case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_NSTRING: 
                            state.AddOutputContent$1(System.String.concat("N'", System.String.replaceAll(contentElement.PoorMansTSqlFormatterLib$ParseStructure$Node$TextValue, "'", "''"), "'"), PoorMansTSqlFormatterLib.Interfaces.SqlHtmlConstants.CLASS_STRING);
                            break;
                        case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_QUOTED_STRING: 
                            state.AddOutputContent(System.String.concat("\"", System.String.replaceAll(contentElement.PoorMansTSqlFormatterLib$ParseStructure$Node$TextValue, "\"", "\"\""), "\""));
                            break;
                        case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_BRACKET_QUOTED_NAME: 
                            state.AddOutputContent(System.String.concat("[", System.String.replaceAll(contentElement.PoorMansTSqlFormatterLib$ParseStructure$Node$TextValue, "]", "]]"), "]"));
                            break;
                        case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_COMMA: 
                        case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_PERIOD: 
                        case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_SEMICOLON: 
                        case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_ASTERISK: 
                        case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_EQUALSSIGN: 
                        case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_SCOPERESOLUTIONOPERATOR: 
                        case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_ALPHAOPERATOR: 
                        case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_OTHEROPERATOR: 
                            state.AddOutputContent$1(contentElement.PoorMansTSqlFormatterLib$ParseStructure$Node$TextValue, PoorMansTSqlFormatterLib.Interfaces.SqlHtmlConstants.CLASS_OPERATOR);
                            break;
                        case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_AND_OPERATOR: 
                        case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_OR_OPERATOR: 
                            state.AddOutputContent$1(PoorMansTSqlFormatterLib.ParseStructure.NodeExtensions.ChildByName(contentElement, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_OTHERKEYWORD).PoorMansTSqlFormatterLib$ParseStructure$Node$TextValue, PoorMansTSqlFormatterLib.Interfaces.SqlHtmlConstants.CLASS_OPERATOR);
                            break;
                        case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_FUNCTION_KEYWORD: 
                            state.AddOutputContent$1(contentElement.PoorMansTSqlFormatterLib$ParseStructure$Node$TextValue, PoorMansTSqlFormatterLib.Interfaces.SqlHtmlConstants.CLASS_FUNCTION);
                            break;
                        case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_OTHERKEYWORD: 
                        case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_DATATYPE_KEYWORD: 
                        case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_PSEUDONAME: 
                            state.AddOutputContent$1(contentElement.PoorMansTSqlFormatterLib$ParseStructure$Node$TextValue, PoorMansTSqlFormatterLib.Interfaces.SqlHtmlConstants.CLASS_KEYWORD);
                            break;
                        case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_OTHERNODE: 
                        case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_WHITESPACE: 
                        case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_NUMBER_VALUE: 
                        case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_MONETARY_VALUE: 
                        case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_BINARY_VALUE: 
                        case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_LABEL: 
                            state.AddOutputContent(contentElement.PoorMansTSqlFormatterLib$ParseStructure$Node$TextValue);
                            break;
                        default: 
                            throw new System.Exception("Unrecognized element in SQL Xml!");
                    }

                    if (Bridge.referenceEquals(contentElement.PoorMansTSqlFormatterLib$ParseStructure$Node$GetAttributeValue(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ANAME_HASERROR), "1")) {
                        state.CloseClass();
                    }
                }
            }
        },
        props: {
            HTMLColoring: false,
            HTMLFormatted: {
                get: function () {
                    return this.HTMLColoring;
                }
            },
            ErrorOutputPrefix: null
        },
        alias: [
            "HTMLFormatted", "PoorMansTSqlFormatterLib$Interfaces$ISqlTreeFormatter$HTMLFormatted",
            "ErrorOutputPrefix", "PoorMansTSqlFormatterLib$Interfaces$ISqlTreeFormatter$ErrorOutputPrefix",
            "ErrorOutputPrefix", "PoorMansTSqlFormatterLib$Interfaces$ISqlTokenFormatter$ErrorOutputPrefix",
            "FormatSQLTree", "PoorMansTSqlFormatterLib$Interfaces$ISqlTreeFormatter$FormatSQLTree",
            "FormatSQLTokens", "PoorMansTSqlFormatterLib$Interfaces$ISqlTokenFormatter$FormatSQLTokens"
        ],
        ctors: {
            ctor: function () {
                PoorMansTSqlFormatterLib.Formatters.TSqlIdentityFormatter.$ctor1.call(this, false);
            },
            $ctor1: function (htmlColoring) {
                this.$initialize();
                this.HTMLColoring = htmlColoring;
                this.ErrorOutputPrefix = System.String.concat(PoorMansTSqlFormatterLib.Interfaces.MessagingConstants.FormatErrorDefaultMessage, '\n');
            }
        },
        methods: {
            FormatSQLTree: function (sqlTreeDoc) {
                var state = new PoorMansTSqlFormatterLib.BaseFormatterState(this.HTMLColoring);

                if (Bridge.referenceEquals(sqlTreeDoc.PoorMansTSqlFormatterLib$ParseStructure$Node$Name, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_SQL_ROOT) && Bridge.referenceEquals(sqlTreeDoc.PoorMansTSqlFormatterLib$ParseStructure$Node$GetAttributeValue(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ANAME_ERRORFOUND), "1")) {
                    state.AddOutputContent(this.ErrorOutputPrefix);
                }

                PoorMansTSqlFormatterLib.Formatters.TSqlIdentityFormatter.ProcessSqlNodeList(state, sqlTreeDoc.PoorMansTSqlFormatterLib$ParseStructure$Node$Children);
                return state.DumpOutput();
            },
            FormatSQLTokens: function (sqlTokenList) {
                var $t;
                var outString = new System.Text.StringBuilder();

                if (sqlTokenList.PoorMansTSqlFormatterLib$Interfaces$ITokenList$HasUnfinishedToken) {
                    outString.append(this.ErrorOutputPrefix);
                }

                $t = Bridge.getEnumerator(sqlTokenList, PoorMansTSqlFormatterLib.Interfaces.IToken);
                try {
                    while ($t.moveNext()) {
                        var entry = $t.Current;
                        switch (entry.PoorMansTSqlFormatterLib$Interfaces$IToken$Type) {
                            case PoorMansTSqlFormatterLib.Interfaces.SqlTokenType.MultiLineComment: 
                                outString.append("/*");
                                outString.append(entry.PoorMansTSqlFormatterLib$Interfaces$IToken$Value);
                                outString.append("*/");
                                break;
                            case PoorMansTSqlFormatterLib.Interfaces.SqlTokenType.SingleLineComment: 
                                outString.append("--");
                                outString.append(entry.PoorMansTSqlFormatterLib$Interfaces$IToken$Value);
                                break;
                            case PoorMansTSqlFormatterLib.Interfaces.SqlTokenType.SingleLineCommentCStyle: 
                                outString.append("//");
                                outString.append(entry.PoorMansTSqlFormatterLib$Interfaces$IToken$Value);
                                break;
                            case PoorMansTSqlFormatterLib.Interfaces.SqlTokenType.String: 
                                outString.append("'");
                                outString.append(System.String.replaceAll(entry.PoorMansTSqlFormatterLib$Interfaces$IToken$Value, "'", "''"));
                                outString.append("'");
                                break;
                            case PoorMansTSqlFormatterLib.Interfaces.SqlTokenType.NationalString: 
                                outString.append("N'");
                                outString.append(System.String.replaceAll(entry.PoorMansTSqlFormatterLib$Interfaces$IToken$Value, "'", "''"));
                                outString.append("'");
                                break;
                            case PoorMansTSqlFormatterLib.Interfaces.SqlTokenType.QuotedString: 
                                outString.append("\"");
                                outString.append(System.String.replaceAll(entry.PoorMansTSqlFormatterLib$Interfaces$IToken$Value, "\"", "\"\""));
                                outString.append("\"");
                                break;
                            case PoorMansTSqlFormatterLib.Interfaces.SqlTokenType.BracketQuotedName: 
                                outString.append("[");
                                outString.append(System.String.replaceAll(entry.PoorMansTSqlFormatterLib$Interfaces$IToken$Value, "]", "]]"));
                                outString.append("]");
                                break;
                            case PoorMansTSqlFormatterLib.Interfaces.SqlTokenType.OpenParens: 
                            case PoorMansTSqlFormatterLib.Interfaces.SqlTokenType.CloseParens: 
                            case PoorMansTSqlFormatterLib.Interfaces.SqlTokenType.Comma: 
                            case PoorMansTSqlFormatterLib.Interfaces.SqlTokenType.Period: 
                            case PoorMansTSqlFormatterLib.Interfaces.SqlTokenType.Semicolon: 
                            case PoorMansTSqlFormatterLib.Interfaces.SqlTokenType.Colon: 
                            case PoorMansTSqlFormatterLib.Interfaces.SqlTokenType.Asterisk: 
                            case PoorMansTSqlFormatterLib.Interfaces.SqlTokenType.EqualsSign: 
                            case PoorMansTSqlFormatterLib.Interfaces.SqlTokenType.OtherNode: 
                            case PoorMansTSqlFormatterLib.Interfaces.SqlTokenType.WhiteSpace: 
                            case PoorMansTSqlFormatterLib.Interfaces.SqlTokenType.OtherOperator: 
                            case PoorMansTSqlFormatterLib.Interfaces.SqlTokenType.Number: 
                            case PoorMansTSqlFormatterLib.Interfaces.SqlTokenType.BinaryValue: 
                            case PoorMansTSqlFormatterLib.Interfaces.SqlTokenType.MonetaryValue: 
                            case PoorMansTSqlFormatterLib.Interfaces.SqlTokenType.PseudoName: 
                                outString.append(entry.PoorMansTSqlFormatterLib$Interfaces$IToken$Value);
                                break;
                            default: 
                                throw new System.Exception("Unrecognized Token Type in Token List!");
                        }
                    }
                } finally {
                    if (Bridge.is($t, System.IDisposable)) {
                        $t.System$IDisposable$dispose();
                    }
                }
                return outString.toString();
            }
        }
    });

    Bridge.define("PoorMansTSqlFormatterLib.Formatters.TSqlObfuscatingFormatter", {
        inherits: [PoorMansTSqlFormatterLib.Interfaces.ISqlTreeFormatter],
        statics: {
            fields: {
                MIN_CASE_WORD_LENGTH: 0,
                MAX_CASE_WORD_LENGTH: 0
            },
            ctors: {
                init: function () {
                    this.MIN_CASE_WORD_LENGTH = 2;
                    this.MAX_CASE_WORD_LENGTH = 8;
                }
            }
        },
        fields: {
            KeywordMapping: null,
            _randomizer: null,
            _currentCaseLength: 0,
            _currentCaseLimit: 0,
            _currentlyUppercase: false
        },
        props: {
            RandomizeCase: false,
            RandomizeColor: false,
            RandomizeLineLength: false,
            PreserveComments: false,
            HTMLFormatted: {
                get: function () {
                    return this.RandomizeColor;
                }
            },
            ErrorOutputPrefix: null
        },
        alias: [
            "HTMLFormatted", "PoorMansTSqlFormatterLib$Interfaces$ISqlTreeFormatter$HTMLFormatted",
            "ErrorOutputPrefix", "PoorMansTSqlFormatterLib$Interfaces$ISqlTreeFormatter$ErrorOutputPrefix",
            "FormatSQLTree", "PoorMansTSqlFormatterLib$Interfaces$ISqlTreeFormatter$FormatSQLTree"
        ],
        ctors: {
            init: function () {
                this.KeywordMapping = new (System.Collections.Generic.Dictionary$2(System.String,System.String))();
                this._randomizer = new System.Random.ctor();
                this._currentCaseLength = 0;
                this._currentCaseLimit = PoorMansTSqlFormatterLib.Formatters.TSqlObfuscatingFormatter.MAX_CASE_WORD_LENGTH;
                this._currentlyUppercase = false;
            },
            ctor: function () {
                PoorMansTSqlFormatterLib.Formatters.TSqlObfuscatingFormatter.$ctor1.call(this, false, false, false, false, false);
            },
            $ctor1: function (randomizeCase, randomizeColor, randomizeLineLength, preserveComments, subtituteKeywords) {
                this.$initialize();
                this.RandomizeCase = randomizeCase;
                this.RandomizeColor = randomizeColor;
                this.RandomizeLineLength = randomizeLineLength;
                this.PreserveComments = preserveComments;
                if (subtituteKeywords) {
                    this.KeywordMapping = PoorMansTSqlFormatterLib.ObfuscatingKeywordMapping.Instance;
                }

                this.ErrorOutputPrefix = System.String.concat(PoorMansTSqlFormatterLib.Interfaces.MessagingConstants.FormatErrorDefaultMessage, '\n');

                if (this.RandomizeCase) {
                    this._currentCaseLimit = this._randomizer.next$2(PoorMansTSqlFormatterLib.Formatters.TSqlObfuscatingFormatter.MIN_CASE_WORD_LENGTH, PoorMansTSqlFormatterLib.Formatters.TSqlObfuscatingFormatter.MAX_CASE_WORD_LENGTH);
                    this._currentlyUppercase = this._randomizer.next$2(0, 2) === 0;
                }
            }
        },
        methods: {
            FormatSQLTree: function (sqlTreeDoc) {
                //thread-safe - each call to FormatSQLTree() gets its own independent state object
                var state = new PoorMansTSqlFormatterLib.Formatters.TSqlObfuscatingFormatter.TSqlObfuscatingFormattingState(this.RandomizeColor, this.RandomizeLineLength);

                if (Bridge.referenceEquals(sqlTreeDoc.PoorMansTSqlFormatterLib$ParseStructure$Node$Name, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_SQL_ROOT) && Bridge.referenceEquals(sqlTreeDoc.PoorMansTSqlFormatterLib$ParseStructure$Node$GetAttributeValue(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ANAME_ERRORFOUND), "1")) {
                    state.AddOutputContent(this.ErrorOutputPrefix);
                }

                this.ProcessSqlNodeList(sqlTreeDoc.PoorMansTSqlFormatterLib$ParseStructure$Node$Children, state);
                state.BreakIfExpected();
                return state.DumpOutput();
            },
            ProcessSqlNodeList: function (rootList, state) {
                var $t;
                $t = Bridge.getEnumerator(rootList, PoorMansTSqlFormatterLib.ParseStructure.Node);
                try {
                    while ($t.moveNext()) {
                        var contentElement = $t.Current;
                        this.ProcessSqlNode(contentElement, state);
                    }
                } finally {
                    if (Bridge.is($t, System.IDisposable)) {
                        $t.System$IDisposable$dispose();
                    }
                }},
            ProcessSqlNode: function (contentElement, state) {
                switch (contentElement.PoorMansTSqlFormatterLib$ParseStructure$Node$Name) {
                    case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_SQL_ROOT: 
                    case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_SQL_STATEMENT: 
                    case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_SQL_CLAUSE: 
                    case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_SET_OPERATOR_CLAUSE: 
                    case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_DDL_PROCEDURAL_BLOCK: 
                    case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_DDL_OTHER_BLOCK: 
                    case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_DDL_DECLARE_BLOCK: 
                    case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CURSOR_DECLARATION: 
                    case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_BEGIN_TRANSACTION: 
                    case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_SAVE_TRANSACTION: 
                    case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_COMMIT_TRANSACTION: 
                    case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_ROLLBACK_TRANSACTION: 
                    case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CONTAINER_OPEN: 
                    case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CONTAINER_CLOSE: 
                    case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_WHILE_LOOP: 
                    case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_IF_STATEMENT: 
                    case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_SELECTIONTARGET: 
                    case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CONTAINER_GENERALCONTENT: 
                    case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CTE_WITH_CLAUSE: 
                    case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_PERMISSIONS_BLOCK: 
                    case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_PERMISSIONS_DETAIL: 
                    case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_MERGE_CLAUSE: 
                    case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_MERGE_TARGET: 
                    case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CASE_INPUT: 
                    case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_BOOLEAN_EXPRESSION: 
                    case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_BETWEEN_LOWERBOUND: 
                    case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_BETWEEN_UPPERBOUND: 
                    case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CONTAINER_SINGLESTATEMENT: 
                    case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CONTAINER_MULTISTATEMENT: 
                    case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_MERGE_ACTION: 
                    case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_PERMISSIONS_TARGET: 
                    case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_PERMISSIONS_RECIPIENT: 
                    case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_DDL_WITH_CLAUSE: 
                    case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_MERGE_CONDITION: 
                    case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_MERGE_THEN: 
                    case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_JOIN_ON_SECTION: 
                    case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CTE_ALIAS: 
                    case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_ELSE_CLAUSE: 
                    case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_DDL_AS_BLOCK: 
                    case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CURSOR_FOR_BLOCK: 
                    case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_TRIGGER_CONDITION: 
                    case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CURSOR_FOR_OPTIONS: 
                    case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CTE_AS_BLOCK: 
                    case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_DDL_RETURNS: 
                    case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_MERGE_USING: 
                    case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_MERGE_WHEN: 
                    case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_BETWEEN_CONDITION: 
                    case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_BEGIN_END_BLOCK: 
                    case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_TRY_BLOCK: 
                    case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CATCH_BLOCK: 
                    case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CASE_STATEMENT: 
                    case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CASE_WHEN: 
                    case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CASE_THEN: 
                    case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CASE_ELSE: 
                    case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_AND_OPERATOR: 
                    case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_OR_OPERATOR: 
                        //these are all containers, and therefore have no impact on obfuscated output.
                        this.ProcessSqlNodeList(contentElement.PoorMansTSqlFormatterLib$ParseStructure$Node$Children, state);
                        break;
                    case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_DDLDETAIL_PARENS: 
                    case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_FUNCTION_PARENS: 
                    case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_IN_PARENS: 
                    case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_DDL_PARENS: 
                    case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_EXPRESSION_PARENS: 
                    case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_SELECTIONTARGET_PARENS: 
                        state.SpaceExpected = false;
                        state.AddOutputContent("(");
                        this.ProcessSqlNodeList(contentElement.PoorMansTSqlFormatterLib$ParseStructure$Node$Children, state);
                        state.SpaceExpected = false;
                        state.SpaceExpectedForAnsiString = false;
                        state.AddOutputContent(")");
                        break;
                    case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_WHITESPACE: 
                        //do nothing
                        break;
                    case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_COMMENT_MULTILINE: 
                        if (this.PreserveComments) {
                            state.SpaceExpected = false;
                            state.AddOutputContent(System.String.concat("/*", contentElement.PoorMansTSqlFormatterLib$ParseStructure$Node$TextValue, "*/"));
                        }
                        break;
                    case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_COMMENT_SINGLELINE: 
                        if (this.PreserveComments) {
                            state.SpaceExpected = false;
                            state.AddOutputContent(System.String.concat("--", System.String.replaceAll(System.String.replaceAll(contentElement.PoorMansTSqlFormatterLib$ParseStructure$Node$TextValue, "\r", ""), "\n", "")));
                            state.BreakExpected = true;
                        }
                        break;
                    case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_COMMENT_SINGLELINE_CSTYLE: 
                        if (this.PreserveComments) {
                            state.SpaceExpected = false;
                            state.AddOutputContent(System.String.concat("//", System.String.replaceAll(System.String.replaceAll(contentElement.PoorMansTSqlFormatterLib$ParseStructure$Node$TextValue, "\r", ""), "\n", "")));
                            state.BreakExpected = true;
                        }
                        break;
                    case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_BATCH_SEPARATOR: 
                        //newline regardless of whether previous element recommended a break or not.
                        state.BreakExpected = true;
                        this.ProcessSqlNodeList(contentElement.PoorMansTSqlFormatterLib$ParseStructure$Node$Children, state);
                        state.BreakExpected = true;
                        break;
                    case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_STRING: 
                        state.SpaceIfExpectedForAnsiString();
                        state.SpaceExpected = false;
                        state.AddOutputContent(System.String.concat("'", System.String.replaceAll(contentElement.PoorMansTSqlFormatterLib$ParseStructure$Node$TextValue, "'", "''"), "'"));
                        state.SpaceExpectedForAnsiString = true;
                        break;
                    case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_NSTRING: 
                        state.AddOutputContent(System.String.concat("N'", System.String.replaceAll(contentElement.PoorMansTSqlFormatterLib$ParseStructure$Node$TextValue, "'", "''"), "'"));
                        state.SpaceExpectedForAnsiString = true;
                        break;
                    case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_BRACKET_QUOTED_NAME: 
                        state.SpaceExpected = false;
                        state.AddOutputContent(System.String.concat("[", System.String.replaceAll(contentElement.PoorMansTSqlFormatterLib$ParseStructure$Node$TextValue, "]", "]]"), "]"));
                        break;
                    case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_QUOTED_STRING: 
                        state.SpaceExpected = false;
                        state.AddOutputContent(System.String.concat("\"", System.String.replaceAll(contentElement.PoorMansTSqlFormatterLib$ParseStructure$Node$TextValue, "\"", "\"\""), "\""));
                        break;
                    case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_COMMA: 
                    case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_PERIOD: 
                    case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_SEMICOLON: 
                    case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_SCOPERESOLUTIONOPERATOR: 
                    case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_ASTERISK: 
                    case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_EQUALSSIGN: 
                    case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_OTHEROPERATOR: 
                        state.SpaceExpected = false;
                        state.AddOutputContent(contentElement.PoorMansTSqlFormatterLib$ParseStructure$Node$TextValue);
                        break;
                    case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_COMPOUNDKEYWORD: 
                        state.AddOutputContent(this.FormatKeyword(contentElement.PoorMansTSqlFormatterLib$ParseStructure$Node$GetAttributeValue(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ANAME_SIMPLETEXT)));
                        state.SpaceExpected = true;
                        break;
                    case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_LABEL: 
                        state.AddOutputContent(contentElement.PoorMansTSqlFormatterLib$ParseStructure$Node$TextValue);
                        state.BreakExpected = true;
                        break;
                    case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_OTHERKEYWORD: 
                    case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_ALPHAOPERATOR: 
                    case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_DATATYPE_KEYWORD: 
                    case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_PSEUDONAME: 
                    case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_BINARY_VALUE: 
                        state.AddOutputContent(this.FormatKeyword(contentElement.PoorMansTSqlFormatterLib$ParseStructure$Node$TextValue));
                        state.SpaceExpected = true;
                        break;
                    case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_NUMBER_VALUE: 
                        state.AddOutputContent(this.FormatKeyword(contentElement.PoorMansTSqlFormatterLib$ParseStructure$Node$TextValue));
                        if (!System.String.contains(PoorMansTSqlFormatterLib.BridgeUtils.ToLowerInvariant$1(contentElement.PoorMansTSqlFormatterLib$ParseStructure$Node$TextValue),"e")) {
                            state.SpaceExpectedForE = true;
                            if (System.String.equals(contentElement.PoorMansTSqlFormatterLib$ParseStructure$Node$TextValue, "0")) {
                                state.SpaceExpectedForX = true;
                            }
                        }
                        break;
                    case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_MONETARY_VALUE: 
                        if (!System.String.equals(contentElement.PoorMansTSqlFormatterLib$ParseStructure$Node$TextValue.substr(0, 1), "$")) {
                            state.SpaceExpected = false;
                        }
                        state.AddOutputContent(contentElement.PoorMansTSqlFormatterLib$ParseStructure$Node$TextValue);
                        if (contentElement.PoorMansTSqlFormatterLib$ParseStructure$Node$TextValue.length === 1) {
                            state.SpaceExpectedForPlusMinus = true;
                        }
                        break;
                    case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_OTHERNODE: 
                    case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_FUNCTION_KEYWORD: 
                        state.AddOutputContent(contentElement.PoorMansTSqlFormatterLib$ParseStructure$Node$TextValue);
                        state.SpaceExpected = true;
                        break;
                    default: 
                        throw new System.Exception("Unrecognized element in SQL Xml!");
                }
            },
            FormatKeyword: function (keyword) {
                var outputKeyword = { };
                if (!this.KeywordMapping.System$Collections$Generic$IDictionary$2$System$String$System$String$tryGetValue(PoorMansTSqlFormatterLib.BridgeUtils.ToUpperInvariant$1(keyword), outputKeyword)) {
                    outputKeyword.v = keyword;
                }

                if (this.RandomizeCase) {
                    return this.GetCaseRandomized(outputKeyword.v);
                } else {
                    return outputKeyword.v;
                }
            },
            GetCaseRandomized: function (outputKeyword) {
                var keywordCharArray = System.String.toCharArray(outputKeyword, 0, outputKeyword.length);
                for (var i = 0; i < keywordCharArray.length; i = (i + 1) | 0) {
                    if (this._currentCaseLength === this._currentCaseLimit) {
                        this._currentCaseLimit = this._randomizer.next$2(PoorMansTSqlFormatterLib.Formatters.TSqlObfuscatingFormatter.MIN_CASE_WORD_LENGTH, PoorMansTSqlFormatterLib.Formatters.TSqlObfuscatingFormatter.MAX_CASE_WORD_LENGTH);
                        this._currentlyUppercase = this._randomizer.next$2(0, 2) === 0;
                        this._currentCaseLength = 0;
                    }

                    keywordCharArray[System.Array.index(i, keywordCharArray)] = this._currentlyUppercase ? PoorMansTSqlFormatterLib.BridgeUtils.ToUpperInvariant(keywordCharArray[System.Array.index(i, keywordCharArray)]) : PoorMansTSqlFormatterLib.BridgeUtils.ToLowerInvariant(keywordCharArray[System.Array.index(i, keywordCharArray)]);
                    this._currentCaseLength = (this._currentCaseLength + 1) | 0;
                }
                return String.fromCharCode.apply(null, keywordCharArray);
            }
        }
    });

    Bridge.define("PoorMansTSqlFormatterLib.Formatters.TSqlObfuscatingFormatter.TSqlObfuscatingFormattingState", {
        inherits: [PoorMansTSqlFormatterLib.BaseFormatterState],
        statics: {
            fields: {
                MIN_COLOR_WORD_LENGTH: 0,
                MAX_COLOR_WORD_LENGTH: 0,
                MIN_LINE_LENGTH: 0,
                MAX_LINE_LENGTH: 0
            },
            ctors: {
                init: function () {
                    this.MIN_COLOR_WORD_LENGTH = 3;
                    this.MAX_COLOR_WORD_LENGTH = 15;
                    this.MIN_LINE_LENGTH = 10;
                    this.MAX_LINE_LENGTH = 80;
                }
            }
        },
        fields: {
            _randomizer: null,
            _currentLineLength: 0,
            _thisLineLimit: 0,
            _currentColorLength: 0,
            _currentColorLimit: 0,
            _currentColor: null
        },
        props: {
            RandomizeColor: false,
            RandomizeLineLength: false,
            BreakExpected: false,
            SpaceExpectedForAnsiString: false,
            SpaceExpectedForE: false,
            SpaceExpectedForX: false,
            SpaceExpectedForPlusMinus: false,
            SpaceExpected: false
        },
        ctors: {
            init: function () {
                this._randomizer = new System.Random.ctor();
                this._currentLineLength = 0;
                this._thisLineLimit = PoorMansTSqlFormatterLib.Formatters.TSqlObfuscatingFormatter.TSqlObfuscatingFormattingState.MAX_LINE_LENGTH;
                this._currentColorLength = 0;
                this._currentColorLimit = PoorMansTSqlFormatterLib.Formatters.TSqlObfuscatingFormatter.TSqlObfuscatingFormattingState.MAX_COLOR_WORD_LENGTH;
            },
            ctor: function (randomizeColor, randomizeLineLength) {
                this.$initialize();
                PoorMansTSqlFormatterLib.BaseFormatterState.ctor.call(this, randomizeColor);
                this.RandomizeColor = randomizeColor;
                this.RandomizeLineLength = randomizeLineLength;

                if (this.RandomizeColor) {
                    this._currentColorLimit = this._randomizer.next$2(PoorMansTSqlFormatterLib.Formatters.TSqlObfuscatingFormatter.TSqlObfuscatingFormattingState.MIN_COLOR_WORD_LENGTH, PoorMansTSqlFormatterLib.Formatters.TSqlObfuscatingFormatter.TSqlObfuscatingFormattingState.MAX_COLOR_WORD_LENGTH);
                    this._currentColor = System.String.format("#{0:x2}{1:x2}{2:x2}", Bridge.box(this._randomizer.next$2(0, 127), System.Int32), Bridge.box(this._randomizer.next$2(0, 127), System.Int32), Bridge.box(this._randomizer.next$2(0, 127), System.Int32));
                }
                if (this.RandomizeLineLength) {
                    this._thisLineLimit = this._randomizer.next$2(PoorMansTSqlFormatterLib.Formatters.TSqlObfuscatingFormatter.TSqlObfuscatingFormattingState.MIN_LINE_LENGTH, PoorMansTSqlFormatterLib.Formatters.TSqlObfuscatingFormatter.TSqlObfuscatingFormattingState.MAX_LINE_LENGTH);
                }
            }
        },
        methods: {
            BreakIfExpected: function () {
                if (this.BreakExpected) {
                    this.BreakExpected = false;
                    PoorMansTSqlFormatterLib.BaseFormatterState.prototype.AddOutputLineBreak.call(this);
                    this.SetSpaceNoLongerExpected();
                    this._currentLineLength = 0;

                    if (this.RandomizeLineLength) {
                        this._thisLineLimit = this._randomizer.next$2(10, 80);
                    }
                }
            },
            SpaceIfExpectedForAnsiString: function () {
                if (this.SpaceExpectedForAnsiString) {
                    PoorMansTSqlFormatterLib.BaseFormatterState.prototype.AddOutputContent$1.call(this, " ", null);
                    this.SetSpaceNoLongerExpected();
                }
            },
            SpaceIfExpected: function () {
                if (this.SpaceExpected) {
                    PoorMansTSqlFormatterLib.BaseFormatterState.prototype.AddOutputContent$1.call(this, " ", null);
                    this.SetSpaceNoLongerExpected();
                }
            },
            AddOutputContent$1: function (content, htmlClassName) {
                if (htmlClassName != null) {
                    throw new System.NotSupportedException("Obfuscating formatter does not use html class names...");
                }

                this.BreakIfExpected();
                this.SpaceIfExpected();
                if (this._currentLineLength > 0 && ((this._currentLineLength + content.length) | 0) > this._thisLineLimit) {
                    this.BreakExpected = true;
                    this.BreakIfExpected();
                } else if ((this.SpaceExpectedForE && System.String.equals(content.substr(0, 1).toLowerCase(), "e")) || (this.SpaceExpectedForX && System.String.equals(content.substr(0, 1).toLowerCase(), "x")) || (this.SpaceExpectedForPlusMinus && System.String.equals(content.substr(0, 1), "+")) || (this.SpaceExpectedForPlusMinus && System.String.equals(content.substr(0, 1), "-"))) {
                    this.SpaceExpected = true;
                    this.SpaceIfExpected();
                }

                this._currentLineLength = (this._currentLineLength + content.length) | 0;
                if (this.RandomizeColor) {
                    var lengthWritten = 0;
                    while (lengthWritten < content.length) {
                        if (this._currentColorLength === this._currentColorLimit) {
                            this._currentColorLimit = this._randomizer.next$2(PoorMansTSqlFormatterLib.Formatters.TSqlObfuscatingFormatter.TSqlObfuscatingFormattingState.MIN_COLOR_WORD_LENGTH, PoorMansTSqlFormatterLib.Formatters.TSqlObfuscatingFormatter.TSqlObfuscatingFormattingState.MAX_COLOR_WORD_LENGTH);
                            this._currentColor = System.String.format("#{0:x2}{1:x2}{2:x2}", Bridge.box(this._randomizer.next$2(0, 127), System.Int32), Bridge.box(this._randomizer.next$2(0, 127), System.Int32), Bridge.box(this._randomizer.next$2(0, 127), System.Int32));
                            this._currentColorLength = 0;
                        }

                        var writing;
                        if (((content.length - lengthWritten) | 0) < ((this._currentColorLimit - this._currentColorLength) | 0)) {
                            writing = (content.length - lengthWritten) | 0;
                        } else {
                            writing = (this._currentColorLimit - this._currentColorLength) | 0;
                        }

                        PoorMansTSqlFormatterLib.BaseFormatterState.prototype.AddOutputContentRaw.call(this, "<span style=\"color: ");
                        PoorMansTSqlFormatterLib.BaseFormatterState.prototype.AddOutputContentRaw.call(this, this._currentColor);
                        PoorMansTSqlFormatterLib.BaseFormatterState.prototype.AddOutputContentRaw.call(this, ";\">");
                        PoorMansTSqlFormatterLib.BaseFormatterState.prototype.AddOutputContentRaw.call(this, PoorMansTSqlFormatterLib.Utils.HtmlEncode(content.substr(lengthWritten, writing)));
                        PoorMansTSqlFormatterLib.BaseFormatterState.prototype.AddOutputContentRaw.call(this, "</span>");
                        lengthWritten = (lengthWritten + writing) | 0;
                        this._currentColorLength = (this._currentColorLength + writing) | 0;
                    }
                } else {
                    PoorMansTSqlFormatterLib.BaseFormatterState.prototype.AddOutputContent$1.call(this, content, null);
                }
                this.SetSpaceNoLongerExpected();
            },
            SetSpaceNoLongerExpected: function () {
                this.SpaceExpected = false;
                this.SpaceExpectedForAnsiString = false;
                this.SpaceExpectedForE = false;
                this.SpaceExpectedForX = false;
                this.SpaceExpectedForPlusMinus = false;
            },
            AddOutputLineBreak: function () {
                //don't want the outer code to write line breaks at all
                throw new System.NotSupportedException();
            }
        }
    });

    Bridge.define("PoorMansTSqlFormatterLib.Formatters.TSqlStandardFormatter", {
        inherits: [PoorMansTSqlFormatterLib.Interfaces.ISqlTreeFormatter],
        fields: {
            KeywordMapping: null
        },
        props: {
            Options: null,
            IndentString: {
                get: function () {
                    return this.Options.IndentString;
                },
                set: function (value) {
                    this.Options.IndentString = value;
                }
            },
            SpacesPerTab: {
                get: function () {
                    return this.Options.SpacesPerTab;
                },
                set: function (value) {
                    this.Options.SpacesPerTab = value;
                }
            },
            MaxLineWidth: {
                get: function () {
                    return this.Options.MaxLineWidth;
                },
                set: function (value) {
                    this.Options.MaxLineWidth = value;
                }
            },
            ExpandCommaLists: {
                get: function () {
                    return this.Options.ExpandCommaLists;
                },
                set: function (value) {
                    this.Options.ExpandCommaLists = value;
                }
            },
            TrailingCommas: {
                get: function () {
                    return this.Options.TrailingCommas;
                },
                set: function (value) {
                    this.Options.TrailingCommas = value;
                }
            },
            SpaceAfterExpandedComma: {
                get: function () {
                    return this.Options.SpaceAfterExpandedComma;
                },
                set: function (value) {
                    this.Options.SpaceAfterExpandedComma = value;
                }
            },
            ExpandBooleanExpressions: {
                get: function () {
                    return this.Options.ExpandBooleanExpressions;
                },
                set: function (value) {
                    this.Options.ExpandBooleanExpressions = value;
                }
            },
            ExpandCaseStatements: {
                get: function () {
                    return this.Options.ExpandCaseStatements;
                },
                set: function (value) {
                    this.Options.ExpandCaseStatements = value;
                }
            },
            ExpandBetweenConditions: {
                get: function () {
                    return this.Options.ExpandBetweenConditions;
                },
                set: function (value) {
                    this.Options.ExpandBetweenConditions = value;
                }
            },
            UppercaseKeywords: {
                get: function () {
                    return this.Options.UppercaseKeywords;
                },
                set: function (value) {
                    this.Options.UppercaseKeywords = value;
                }
            },
            BreakJoinOnSections: {
                get: function () {
                    return this.Options.BreakJoinOnSections;
                },
                set: function (value) {
                    this.Options.BreakJoinOnSections = value;
                }
            },
            HTMLColoring: {
                get: function () {
                    return this.Options.HTMLColoring;
                },
                set: function (value) {
                    this.Options.HTMLColoring = value;
                }
            },
            HTMLFormatted: {
                get: function () {
                    return this.Options.HTMLColoring;
                }
            },
            ErrorOutputPrefix: null
        },
        alias: [
            "HTMLFormatted", "PoorMansTSqlFormatterLib$Interfaces$ISqlTreeFormatter$HTMLFormatted",
            "ErrorOutputPrefix", "PoorMansTSqlFormatterLib$Interfaces$ISqlTreeFormatter$ErrorOutputPrefix",
            "FormatSQLTree", "PoorMansTSqlFormatterLib$Interfaces$ISqlTreeFormatter$FormatSQLTree"
        ],
        ctors: {
            init: function () {
                this.KeywordMapping = new (System.Collections.Generic.Dictionary$2(System.String,System.String))();
            },
            ctor: function () {
                PoorMansTSqlFormatterLib.Formatters.TSqlStandardFormatter.$ctor1.call(this, new PoorMansTSqlFormatterLib.Formatters.TSqlStandardFormatterOptions.ctor());
            },
            $ctor1: function (options) {
                this.$initialize();
                if (options == null) {
                    throw new System.ArgumentNullException("options");
                }

                this.Options = options;

                if (options.KeywordStandardization) {
                    this.KeywordMapping = PoorMansTSqlFormatterLib.StandardKeywordRemapping.Instance;
                }
                this.ErrorOutputPrefix = System.String.concat(PoorMansTSqlFormatterLib.Interfaces.MessagingConstants.FormatErrorDefaultMessage, '\n');
            },
            $ctor2: function (indentString, spacesPerTab, maxLineWidth, expandCommaLists, trailingCommas, spaceAfterExpandedComma, expandBooleanExpressions, expandCaseStatements, expandBetweenConditions, breakJoinOnSections, uppercaseKeywords, htmlColoring, keywordStandardization) {
                this.$initialize();                var $t;

                this.Options = ($t = new PoorMansTSqlFormatterLib.Formatters.TSqlStandardFormatterOptions.ctor(), $t.IndentString = indentString, $t.SpacesPerTab = spacesPerTab, $t.MaxLineWidth = maxLineWidth, $t.ExpandCommaLists = expandCommaLists, $t.TrailingCommas = trailingCommas, $t.SpaceAfterExpandedComma = spaceAfterExpandedComma, $t.ExpandBooleanExpressions = expandBooleanExpressions, $t.ExpandBetweenConditions = expandBetweenConditions, $t.ExpandCaseStatements = expandCaseStatements, $t.UppercaseKeywords = uppercaseKeywords, $t.BreakJoinOnSections = breakJoinOnSections, $t.HTMLColoring = htmlColoring, $t.KeywordStandardization = keywordStandardization, $t);

                if (keywordStandardization) {
                    this.KeywordMapping = PoorMansTSqlFormatterLib.StandardKeywordRemapping.Instance;
                }
                this.ErrorOutputPrefix = System.String.concat(PoorMansTSqlFormatterLib.Interfaces.MessagingConstants.FormatErrorDefaultMessage, '\n');
        }
    },
    methods: {
        FormatSQLTree: function (sqlTreeDoc) {
            //thread-safe - each call to FormatSQLTree() gets its own independent state object
            var state = new PoorMansTSqlFormatterLib.Formatters.TSqlStandardFormatter.TSqlStandardFormattingState.$ctor1(this.Options.HTMLColoring, this.Options.IndentString, this.Options.SpacesPerTab, this.Options.MaxLineWidth, 0);

            if (Bridge.referenceEquals(sqlTreeDoc.PoorMansTSqlFormatterLib$ParseStructure$Node$Name, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_SQL_ROOT) && Bridge.referenceEquals(sqlTreeDoc.PoorMansTSqlFormatterLib$ParseStructure$Node$GetAttributeValue(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ANAME_ERRORFOUND), "1")) {
                state.AddOutputContent(this.ErrorOutputPrefix);
            }

            this.ProcessSqlNodeList(sqlTreeDoc.PoorMansTSqlFormatterLib$ParseStructure$Node$Children, state);

            this.WhiteSpace_BreakAsExpected(state);

            if (System.Nullable.eq(state.SpecialRegionActive, PoorMansTSqlFormatterLib.Formatters.TSqlStandardFormatter.SpecialRegionType.NoFormat)) {
                var skippedXml = PoorMansTSqlFormatterLib.ParseStructure.NodeExtensions.ExtractStructureBetween(state.RegionStartNode, sqlTreeDoc);
                var tempFormatter = new PoorMansTSqlFormatterLib.Formatters.TSqlIdentityFormatter.$ctor1(this.Options.HTMLColoring);
                state.AddOutputContentRaw(tempFormatter.FormatSQLTree(skippedXml));
            } else if (System.Nullable.eq(state.SpecialRegionActive, PoorMansTSqlFormatterLib.Formatters.TSqlStandardFormatter.SpecialRegionType.Minify)) {
                var skippedXml1 = PoorMansTSqlFormatterLib.ParseStructure.NodeExtensions.ExtractStructureBetween(state.RegionStartNode, sqlTreeDoc);
                var tempFormatter1 = new PoorMansTSqlFormatterLib.Formatters.TSqlObfuscatingFormatter.ctor();
                if (this.HTMLFormatted) {
                    state.AddOutputContentRaw(PoorMansTSqlFormatterLib.Utils.HtmlEncode(tempFormatter1.FormatSQLTree(skippedXml1)));
                } else {
                    state.AddOutputContentRaw(tempFormatter1.FormatSQLTree(skippedXml1));
                }
            }
            return state.DumpOutput();
        },
        ProcessSqlNodeList: function (rootList, state) {
            var $t;
            $t = Bridge.getEnumerator(rootList, PoorMansTSqlFormatterLib.ParseStructure.Node);
            try {
                while ($t.moveNext()) {
                    var contentElement = $t.Current;
                    this.ProcessSqlNode(contentElement, state);
                }
            } finally {
                if (Bridge.is($t, System.IDisposable)) {
                    $t.System$IDisposable$dispose();
                }
            }},
        ProcessSqlNode: function (contentElement, state) {
            var $t, $t1, $t2;
            var initialIndent = state.IndentLevel;

            if (Bridge.referenceEquals(contentElement.PoorMansTSqlFormatterLib$ParseStructure$Node$GetAttributeValue(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ANAME_HASERROR), "1")) {
                state.OpenClass(PoorMansTSqlFormatterLib.Interfaces.SqlHtmlConstants.CLASS_ERRORHIGHLIGHT);
            }

            switch (contentElement.PoorMansTSqlFormatterLib$ParseStructure$Node$Name) {
                case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_SQL_STATEMENT: 
                    this.WhiteSpace_SeparateStatements(contentElement, state);
                    state.ResetKeywords();
                    this.ProcessSqlNodeList(contentElement.PoorMansTSqlFormatterLib$ParseStructure$Node$Children, state);
                    state.StatementBreakExpected = true;
                    break;
                case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_SQL_CLAUSE: 
                    state.UnIndentInitialBreak = true;
                    this.ProcessSqlNodeList(contentElement.PoorMansTSqlFormatterLib$ParseStructure$Node$Children, state.IncrementIndent());
                    state.DecrementIndent();
                    if (this.Options.NewClauseLineBreaks > 0) {
                        state.BreakExpected = true;
                    }
                    if (this.Options.NewClauseLineBreaks > 1) {
                        state.AdditionalBreaksExpected = (this.Options.NewClauseLineBreaks - 1) | 0;
                    }
                    break;
                case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_SET_OPERATOR_CLAUSE: 
                    state.DecrementIndent();
                    state.WhiteSpace_BreakToNextLine(); //this is the one already recommended by the start of the clause
                    state.WhiteSpace_BreakToNextLine(); //this is the one we additionally want to apply
                    this.ProcessSqlNodeList(contentElement.PoorMansTSqlFormatterLib$ParseStructure$Node$Children, state.IncrementIndent());
                    state.BreakExpected = true;
                    state.AdditionalBreaksExpected = 1;
                    break;
                case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_BATCH_SEPARATOR: 
                    //newline regardless of whether previous element recommended a break or not.
                    state.WhiteSpace_BreakToNextLine();
                    this.ProcessSqlNodeList(contentElement.PoorMansTSqlFormatterLib$ParseStructure$Node$Children, state);
                    state.BreakExpected = true;
                    break;
                case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_DDL_PROCEDURAL_BLOCK: 
                case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_DDL_OTHER_BLOCK: 
                case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_DDL_DECLARE_BLOCK: 
                case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CURSOR_DECLARATION: 
                case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_BEGIN_TRANSACTION: 
                case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_SAVE_TRANSACTION: 
                case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_COMMIT_TRANSACTION: 
                case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_ROLLBACK_TRANSACTION: 
                case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CONTAINER_OPEN: 
                case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CONTAINER_CLOSE: 
                case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_WHILE_LOOP: 
                case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_IF_STATEMENT: 
                case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_SELECTIONTARGET: 
                case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CONTAINER_GENERALCONTENT: 
                case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CTE_WITH_CLAUSE: 
                case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_PERMISSIONS_BLOCK: 
                case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_PERMISSIONS_DETAIL: 
                case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_MERGE_CLAUSE: 
                case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_MERGE_TARGET: 
                    this.ProcessSqlNodeList(contentElement.PoorMansTSqlFormatterLib$ParseStructure$Node$Children, state);
                    break;
                case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CASE_INPUT: 
                case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_BOOLEAN_EXPRESSION: 
                case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_BETWEEN_LOWERBOUND: 
                case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_BETWEEN_UPPERBOUND: 
                    this.WhiteSpace_SeparateWords(state);
                    this.ProcessSqlNodeList(contentElement.PoorMansTSqlFormatterLib$ParseStructure$Node$Children, state);
                    break;
                case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CONTAINER_SINGLESTATEMENT: 
                case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CONTAINER_MULTISTATEMENT: 
                case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_MERGE_ACTION: 
                    var singleStatementIsIf = false;
                    $t = Bridge.getEnumerator(PoorMansTSqlFormatterLib.ParseStructure.NodeExtensions.ChildrenByName(contentElement, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_SQL_STATEMENT), PoorMansTSqlFormatterLib.ParseStructure.Node);
                    try {
                        while ($t.moveNext()) {
                            var statement = $t.Current;
                            $t1 = Bridge.getEnumerator(PoorMansTSqlFormatterLib.ParseStructure.NodeExtensions.ChildrenByName(statement, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_SQL_CLAUSE), PoorMansTSqlFormatterLib.ParseStructure.Node);
                            try {
                                while ($t1.moveNext()) {
                                    var clause = $t1.Current;
                                    $t2 = Bridge.getEnumerator(PoorMansTSqlFormatterLib.ParseStructure.NodeExtensions.ChildrenByName(clause, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_IF_STATEMENT), PoorMansTSqlFormatterLib.ParseStructure.Node);
                                    try {
                                        while ($t2.moveNext()) {
                                            var ifStatement = $t2.Current;
                                            singleStatementIsIf = true;
                                        }
                                    } finally {
                                        if (Bridge.is($t2, System.IDisposable)) {
                                            $t2.System$IDisposable$dispose();
                                        }
                                    }
                                }
                            } finally {
                                if (Bridge.is($t1, System.IDisposable)) {
                                    $t1.System$IDisposable$dispose();
                                }
                            }
                        }
                    } finally {
                        if (Bridge.is($t, System.IDisposable)) {
                            $t.System$IDisposable$dispose();
                        }
                    }if (singleStatementIsIf && System.String.equals(contentElement.PoorMansTSqlFormatterLib$ParseStructure$Node$Parent.PoorMansTSqlFormatterLib$ParseStructure$Node$Name, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_ELSE_CLAUSE)) {
                        //artificially decrement indent and skip new statement break for "ELSE IF" constructs
                        state.DecrementIndent();
                    } else {
                        state.BreakExpected = true;
                    }
                    this.ProcessSqlNodeList(contentElement.PoorMansTSqlFormatterLib$ParseStructure$Node$Children, state);
                    if (singleStatementIsIf && System.String.equals(contentElement.PoorMansTSqlFormatterLib$ParseStructure$Node$Parent.PoorMansTSqlFormatterLib$ParseStructure$Node$Name, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_ELSE_CLAUSE)) {
                        //bring indent back to symmetrical level
                        state.IncrementIndent();
                    }
                    state.StatementBreakExpected = false; //the responsibility for breaking will be with the OUTER statement; there should be no consequence propagating out from statements in this container;
                    state.UnIndentInitialBreak = false; //if there was no word spacing after the last content statement's clause starter, doesn't mean the unIndent should propagate to the following content!
                    break;
                case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_PERMISSIONS_TARGET: 
                case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_PERMISSIONS_RECIPIENT: 
                case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_DDL_WITH_CLAUSE: 
                case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_MERGE_CONDITION: 
                case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_MERGE_THEN: 
                    state.BreakExpected = true;
                    state.UnIndentInitialBreak = true;
                    this.ProcessSqlNodeList(contentElement.PoorMansTSqlFormatterLib$ParseStructure$Node$Children, state.IncrementIndent());
                    state.DecrementIndent();
                    break;
                case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_JOIN_ON_SECTION: 
                    if (this.Options.BreakJoinOnSections) {
                        state.BreakExpected = true;
                    }
                    this.ProcessSqlNodeList(PoorMansTSqlFormatterLib.ParseStructure.NodeExtensions.ChildrenByName(contentElement, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CONTAINER_OPEN), state);
                    if (this.Options.BreakJoinOnSections) {
                        state.IncrementIndent();
                    }
                    this.ProcessSqlNodeList(PoorMansTSqlFormatterLib.ParseStructure.NodeExtensions.ChildrenByName(contentElement, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CONTAINER_GENERALCONTENT), state);
                    if (this.Options.BreakJoinOnSections) {
                        state.DecrementIndent();
                    }
                    break;
                case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CTE_ALIAS: 
                    state.UnIndentInitialBreak = true;
                    this.ProcessSqlNodeList(contentElement.PoorMansTSqlFormatterLib$ParseStructure$Node$Children, state);
                    break;
                case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_ELSE_CLAUSE: 
                    this.ProcessSqlNodeList(PoorMansTSqlFormatterLib.ParseStructure.NodeExtensions.ChildrenByName(contentElement, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CONTAINER_OPEN), state.DecrementIndent());
                    this.ProcessSqlNodeList(PoorMansTSqlFormatterLib.ParseStructure.NodeExtensions.ChildrenByName(contentElement, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CONTAINER_SINGLESTATEMENT), state.IncrementIndent());
                    break;
                case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_DDL_AS_BLOCK: 
                case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CURSOR_FOR_BLOCK: 
                    state.BreakExpected = true;
                    this.ProcessSqlNodeList(PoorMansTSqlFormatterLib.ParseStructure.NodeExtensions.ChildrenByName(contentElement, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CONTAINER_OPEN), state.DecrementIndent());
                    state.BreakExpected = true;
                    this.ProcessSqlNodeList(PoorMansTSqlFormatterLib.ParseStructure.NodeExtensions.ChildrenByName(contentElement, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CONTAINER_GENERALCONTENT), state);
                    state.IncrementIndent();
                    break;
                case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_TRIGGER_CONDITION: 
                    state.DecrementIndent();
                    state.WhiteSpace_BreakToNextLine();
                    this.ProcessSqlNodeList(contentElement.PoorMansTSqlFormatterLib$ParseStructure$Node$Children, state.IncrementIndent());
                    break;
                case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CURSOR_FOR_OPTIONS: 
                case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CTE_AS_BLOCK: 
                    state.BreakExpected = true;
                    this.ProcessSqlNodeList(PoorMansTSqlFormatterLib.ParseStructure.NodeExtensions.ChildrenByName(contentElement, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CONTAINER_OPEN), state.DecrementIndent());
                    this.ProcessSqlNodeList(PoorMansTSqlFormatterLib.ParseStructure.NodeExtensions.ChildrenByName(contentElement, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CONTAINER_GENERALCONTENT), state.IncrementIndent());
                    break;
                case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_DDL_RETURNS: 
                case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_MERGE_USING: 
                case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_MERGE_WHEN: 
                    state.BreakExpected = true;
                    state.UnIndentInitialBreak = true;
                    this.ProcessSqlNodeList(contentElement.PoorMansTSqlFormatterLib$ParseStructure$Node$Children, state);
                    break;
                case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_BETWEEN_CONDITION: 
                    this.ProcessSqlNodeList(PoorMansTSqlFormatterLib.ParseStructure.NodeExtensions.ChildrenByName(contentElement, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CONTAINER_OPEN), state);
                    state.IncrementIndent();
                    this.ProcessSqlNodeList(PoorMansTSqlFormatterLib.ParseStructure.NodeExtensions.ChildrenByName(contentElement, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_BETWEEN_LOWERBOUND), state.IncrementIndent());
                    if (this.Options.ExpandBetweenConditions) {
                        state.BreakExpected = true;
                    }
                    this.ProcessSqlNodeList(PoorMansTSqlFormatterLib.ParseStructure.NodeExtensions.ChildrenByName(contentElement, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CONTAINER_CLOSE), state.DecrementIndent());
                    this.ProcessSqlNodeList(PoorMansTSqlFormatterLib.ParseStructure.NodeExtensions.ChildrenByName(contentElement, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_BETWEEN_UPPERBOUND), state.IncrementIndent());
                    state.DecrementIndent();
                    state.DecrementIndent();
                    break;
                case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_DDLDETAIL_PARENS: 
                case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_FUNCTION_PARENS: 
                    //simply process sub-nodes - don't add space or expect any linebreaks (but respect linebreaks if necessary)
                    state.WordSeparatorExpected = false;
                    this.WhiteSpace_BreakAsExpected(state);
                    state.AddOutputContent$1(this.FormatOperator("("), PoorMansTSqlFormatterLib.Interfaces.SqlHtmlConstants.CLASS_OPERATOR);
                    this.ProcessSqlNodeList(contentElement.PoorMansTSqlFormatterLib$ParseStructure$Node$Children, state.IncrementIndent());
                    state.DecrementIndent();
                    this.WhiteSpace_BreakAsExpected(state);
                    state.AddOutputContent$1(this.FormatOperator(")"), PoorMansTSqlFormatterLib.Interfaces.SqlHtmlConstants.CLASS_OPERATOR);
                    state.WordSeparatorExpected = true;
                    break;
                case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_DDL_PARENS: 
                case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_EXPRESSION_PARENS: 
                case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_SELECTIONTARGET_PARENS: 
                case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_IN_PARENS: 
                    this.WhiteSpace_SeparateWords(state);
                    if (System.String.equals(contentElement.PoorMansTSqlFormatterLib$ParseStructure$Node$Name, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_EXPRESSION_PARENS) || System.String.equals(contentElement.PoorMansTSqlFormatterLib$ParseStructure$Node$Name, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_IN_PARENS)) {
                        state.IncrementIndent();
                    }
                    state.AddOutputContent$1(this.FormatOperator("("), PoorMansTSqlFormatterLib.Interfaces.SqlHtmlConstants.CLASS_OPERATOR);
                    var innerState = new PoorMansTSqlFormatterLib.Formatters.TSqlStandardFormatter.TSqlStandardFormattingState.ctor(state);
                    this.ProcessSqlNodeList(contentElement.PoorMansTSqlFormatterLib$ParseStructure$Node$Children, innerState);
                    //if there was a linebreak in the parens content, or if it wanted one to follow, then put linebreaks before and after.
                    if (innerState.BreakExpected || innerState.OutputContainsLineBreak) {
                        if (!innerState.StartsWithBreak) {
                            state.WhiteSpace_BreakToNextLine();
                        }
                        state.Assimilate(innerState);
                        state.WhiteSpace_BreakToNextLine();
                    } else {
                        state.Assimilate(innerState);
                    }
                    state.AddOutputContent$1(this.FormatOperator(")"), PoorMansTSqlFormatterLib.Interfaces.SqlHtmlConstants.CLASS_OPERATOR);
                    if (System.String.equals(contentElement.PoorMansTSqlFormatterLib$ParseStructure$Node$Name, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_EXPRESSION_PARENS) || System.String.equals(contentElement.PoorMansTSqlFormatterLib$ParseStructure$Node$Name, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_IN_PARENS)) {
                        state.DecrementIndent();
                    }
                    state.WordSeparatorExpected = true;
                    break;
                case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_BEGIN_END_BLOCK: 
                case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_TRY_BLOCK: 
                case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CATCH_BLOCK: 
                    if (System.String.equals(contentElement.PoorMansTSqlFormatterLib$ParseStructure$Node$Parent.PoorMansTSqlFormatterLib$ParseStructure$Node$Name, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_SQL_CLAUSE) && System.String.equals(contentElement.PoorMansTSqlFormatterLib$ParseStructure$Node$Parent.PoorMansTSqlFormatterLib$ParseStructure$Node$Parent.PoorMansTSqlFormatterLib$ParseStructure$Node$Name, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_SQL_STATEMENT) && System.String.equals(contentElement.PoorMansTSqlFormatterLib$ParseStructure$Node$Parent.PoorMansTSqlFormatterLib$ParseStructure$Node$Parent.PoorMansTSqlFormatterLib$ParseStructure$Node$Parent.PoorMansTSqlFormatterLib$ParseStructure$Node$Name, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CONTAINER_SINGLESTATEMENT)) {
                        state.DecrementIndent();
                    }
                    this.ProcessSqlNodeList(PoorMansTSqlFormatterLib.ParseStructure.NodeExtensions.ChildrenByName(contentElement, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CONTAINER_OPEN), state);
                    this.ProcessSqlNodeList(PoorMansTSqlFormatterLib.ParseStructure.NodeExtensions.ChildrenByName(contentElement, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CONTAINER_MULTISTATEMENT), state);
                    state.DecrementIndent();
                    state.BreakExpected = true;
                    this.ProcessSqlNodeList(PoorMansTSqlFormatterLib.ParseStructure.NodeExtensions.ChildrenByName(contentElement, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CONTAINER_CLOSE), state);
                    state.IncrementIndent();
                    if (System.String.equals(contentElement.PoorMansTSqlFormatterLib$ParseStructure$Node$Parent.PoorMansTSqlFormatterLib$ParseStructure$Node$Name, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_SQL_CLAUSE) && System.String.equals(contentElement.PoorMansTSqlFormatterLib$ParseStructure$Node$Parent.PoorMansTSqlFormatterLib$ParseStructure$Node$Parent.PoorMansTSqlFormatterLib$ParseStructure$Node$Name, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_SQL_STATEMENT) && System.String.equals(contentElement.PoorMansTSqlFormatterLib$ParseStructure$Node$Parent.PoorMansTSqlFormatterLib$ParseStructure$Node$Parent.PoorMansTSqlFormatterLib$ParseStructure$Node$Parent.PoorMansTSqlFormatterLib$ParseStructure$Node$Name, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CONTAINER_SINGLESTATEMENT)) {
                        state.IncrementIndent();
                    }
                    break;
                case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CASE_STATEMENT: 
                    this.ProcessSqlNodeList(PoorMansTSqlFormatterLib.ParseStructure.NodeExtensions.ChildrenByName(contentElement, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CONTAINER_OPEN), state);
                    state.IncrementIndent();
                    this.ProcessSqlNodeList(PoorMansTSqlFormatterLib.ParseStructure.NodeExtensions.ChildrenByName(contentElement, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CASE_INPUT), state);
                    this.ProcessSqlNodeList(PoorMansTSqlFormatterLib.ParseStructure.NodeExtensions.ChildrenByName(contentElement, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CASE_WHEN), state);
                    this.ProcessSqlNodeList(PoorMansTSqlFormatterLib.ParseStructure.NodeExtensions.ChildrenByName(contentElement, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CASE_ELSE), state);
                    if (this.Options.ExpandCaseStatements) {
                        state.BreakExpected = true;
                    }
                    this.ProcessSqlNodeList(PoorMansTSqlFormatterLib.ParseStructure.NodeExtensions.ChildrenByName(contentElement, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CONTAINER_CLOSE), state);
                    state.DecrementIndent();
                    break;
                case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CASE_WHEN: 
                case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CASE_THEN: 
                case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CASE_ELSE: 
                    if (this.Options.ExpandCaseStatements) {
                        state.BreakExpected = true;
                    }
                    this.ProcessSqlNodeList(PoorMansTSqlFormatterLib.ParseStructure.NodeExtensions.ChildrenByName(contentElement, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CONTAINER_OPEN), state);
                    this.ProcessSqlNodeList(PoorMansTSqlFormatterLib.ParseStructure.NodeExtensions.ChildrenByName(contentElement, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CONTAINER_GENERALCONTENT), state.IncrementIndent());
                    this.ProcessSqlNodeList(PoorMansTSqlFormatterLib.ParseStructure.NodeExtensions.ChildrenByName(contentElement, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CASE_THEN), state);
                    state.DecrementIndent();
                    break;
                case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_AND_OPERATOR: 
                case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_OR_OPERATOR: 
                    if (this.Options.ExpandBooleanExpressions) {
                        state.BreakExpected = true;
                    }
                    this.ProcessSqlNode(PoorMansTSqlFormatterLib.ParseStructure.NodeExtensions.ChildByName(contentElement, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_OTHERKEYWORD), state);
                    break;
                case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_COMMENT_MULTILINE: 
                    if (System.Nullable.eq(state.SpecialRegionActive, PoorMansTSqlFormatterLib.Formatters.TSqlStandardFormatter.SpecialRegionType.NoFormat) && System.String.contains(PoorMansTSqlFormatterLib.BridgeUtils.ToUpperInvariant$1(contentElement.PoorMansTSqlFormatterLib$ParseStructure$Node$TextValue),"[/NOFORMAT]")) {
                        var skippedXml = PoorMansTSqlFormatterLib.ParseStructure.NodeExtensions.ExtractStructureBetween(state.RegionStartNode, contentElement);
                        var tempFormatter = new PoorMansTSqlFormatterLib.Formatters.TSqlIdentityFormatter.$ctor1(this.Options.HTMLColoring);
                        state.AddOutputContentRaw(tempFormatter.FormatSQLTree(skippedXml));
                        state.SpecialRegionActive = null;
                        state.RegionStartNode = null;
                    } else if (System.Nullable.eq(state.SpecialRegionActive, PoorMansTSqlFormatterLib.Formatters.TSqlStandardFormatter.SpecialRegionType.Minify) && System.String.contains(PoorMansTSqlFormatterLib.BridgeUtils.ToUpperInvariant$1(contentElement.PoorMansTSqlFormatterLib$ParseStructure$Node$TextValue),"[/MINIFY]")) {
                        var skippedXml1 = PoorMansTSqlFormatterLib.ParseStructure.NodeExtensions.ExtractStructureBetween(state.RegionStartNode, contentElement);
                        var tempFormatter1 = new PoorMansTSqlFormatterLib.Formatters.TSqlObfuscatingFormatter.ctor();
                        if (this.HTMLFormatted) {
                            state.AddOutputContentRaw(PoorMansTSqlFormatterLib.Utils.HtmlEncode(tempFormatter1.FormatSQLTree(skippedXml1)));
                        } else {
                            state.AddOutputContentRaw(tempFormatter1.FormatSQLTree(skippedXml1));
                        }
                        state.SpecialRegionActive = null;
                        state.RegionStartNode = null;
                    }
                    this.WhiteSpace_SeparateComment(contentElement, state);
                    state.AddOutputContent$1(System.String.concat("/*", contentElement.PoorMansTSqlFormatterLib$ParseStructure$Node$TextValue, "*/"), PoorMansTSqlFormatterLib.Interfaces.SqlHtmlConstants.CLASS_COMMENT);
                    if (System.String.equals(contentElement.PoorMansTSqlFormatterLib$ParseStructure$Node$Parent.PoorMansTSqlFormatterLib$ParseStructure$Node$Name, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_SQL_STATEMENT) || (PoorMansTSqlFormatterLib.ParseStructure.NodeExtensions.NextSibling(contentElement) != null && System.String.equals(PoorMansTSqlFormatterLib.ParseStructure.NodeExtensions.NextSibling(contentElement).PoorMansTSqlFormatterLib$ParseStructure$Node$Name, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_WHITESPACE) && System.Text.RegularExpressions.Regex.isMatch(PoorMansTSqlFormatterLib.ParseStructure.NodeExtensions.NextSibling(contentElement).PoorMansTSqlFormatterLib$ParseStructure$Node$TextValue, "(\\r|\\n)+"))) {
                        state.BreakExpected = true;
                    } else {
                        state.WordSeparatorExpected = true;
                    }
                    if (state.SpecialRegionActive == null && System.String.contains(PoorMansTSqlFormatterLib.BridgeUtils.ToUpperInvariant$1(contentElement.PoorMansTSqlFormatterLib$ParseStructure$Node$TextValue),"[NOFORMAT]")) {
                        state.AddOutputLineBreak();
                        state.SpecialRegionActive = PoorMansTSqlFormatterLib.Formatters.TSqlStandardFormatter.SpecialRegionType.NoFormat;
                        state.RegionStartNode = contentElement;
                    } else if (state.SpecialRegionActive == null && System.String.contains(PoorMansTSqlFormatterLib.BridgeUtils.ToUpperInvariant$1(contentElement.PoorMansTSqlFormatterLib$ParseStructure$Node$TextValue),"[MINIFY]")) {
                        state.AddOutputLineBreak();
                        state.SpecialRegionActive = PoorMansTSqlFormatterLib.Formatters.TSqlStandardFormatter.SpecialRegionType.Minify;
                        state.RegionStartNode = contentElement;
                    }
                    break;
                case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_COMMENT_SINGLELINE: 
                case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_COMMENT_SINGLELINE_CSTYLE: 
                    if (System.Nullable.eq(state.SpecialRegionActive, PoorMansTSqlFormatterLib.Formatters.TSqlStandardFormatter.SpecialRegionType.NoFormat) && System.String.contains(PoorMansTSqlFormatterLib.BridgeUtils.ToUpperInvariant$1(contentElement.PoorMansTSqlFormatterLib$ParseStructure$Node$TextValue),"[/NOFORMAT]")) {
                        var skippedXml2 = PoorMansTSqlFormatterLib.ParseStructure.NodeExtensions.ExtractStructureBetween(state.RegionStartNode, contentElement);
                        var tempFormatter2 = new PoorMansTSqlFormatterLib.Formatters.TSqlIdentityFormatter.$ctor1(this.Options.HTMLColoring);
                        state.AddOutputContentRaw(tempFormatter2.FormatSQLTree(skippedXml2));
                        state.SpecialRegionActive = null;
                        state.RegionStartNode = null;
                    } else if (System.Nullable.eq(state.SpecialRegionActive, PoorMansTSqlFormatterLib.Formatters.TSqlStandardFormatter.SpecialRegionType.Minify) && System.String.contains(PoorMansTSqlFormatterLib.BridgeUtils.ToUpperInvariant$1(contentElement.PoorMansTSqlFormatterLib$ParseStructure$Node$TextValue),"[/MINIFY]")) {
                        var skippedXml3 = PoorMansTSqlFormatterLib.ParseStructure.NodeExtensions.ExtractStructureBetween(state.RegionStartNode, contentElement);
                        var tempFormatter3 = new PoorMansTSqlFormatterLib.Formatters.TSqlObfuscatingFormatter.ctor();
                        if (this.HTMLFormatted) {
                            state.AddOutputContentRaw(PoorMansTSqlFormatterLib.Utils.HtmlEncode(tempFormatter3.FormatSQLTree(skippedXml3)));
                        } else {
                            state.AddOutputContentRaw(tempFormatter3.FormatSQLTree(skippedXml3));
                        }
                        state.SpecialRegionActive = null;
                        state.RegionStartNode = null;
                    }
                    this.WhiteSpace_SeparateComment(contentElement, state);
                    state.AddOutputContent$1(System.String.concat((Bridge.referenceEquals(contentElement.PoorMansTSqlFormatterLib$ParseStructure$Node$Name, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_COMMENT_SINGLELINE) ? "--" : "//"), System.String.replaceAll(System.String.replaceAll(contentElement.PoorMansTSqlFormatterLib$ParseStructure$Node$TextValue, "\r", ""), "\n", "")), PoorMansTSqlFormatterLib.Interfaces.SqlHtmlConstants.CLASS_COMMENT);
                    state.BreakExpected = true;
                    state.SourceBreakPending = true;
                    if (state.SpecialRegionActive == null && System.String.contains(PoorMansTSqlFormatterLib.BridgeUtils.ToUpperInvariant$1(contentElement.PoorMansTSqlFormatterLib$ParseStructure$Node$TextValue),"[NOFORMAT]")) {
                        state.AddOutputLineBreak();
                        state.SpecialRegionActive = PoorMansTSqlFormatterLib.Formatters.TSqlStandardFormatter.SpecialRegionType.NoFormat;
                        state.RegionStartNode = contentElement;
                    } else if (state.SpecialRegionActive == null && System.String.contains(PoorMansTSqlFormatterLib.BridgeUtils.ToUpperInvariant$1(contentElement.PoorMansTSqlFormatterLib$ParseStructure$Node$TextValue),"[MINIFY]")) {
                        state.AddOutputLineBreak();
                        state.SpecialRegionActive = PoorMansTSqlFormatterLib.Formatters.TSqlStandardFormatter.SpecialRegionType.Minify;
                        state.RegionStartNode = contentElement;
                    }
                    break;
                case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_STRING: 
                case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_NSTRING: 
                    this.WhiteSpace_SeparateWords(state);
                    var outValue = null;
                    if (System.String.equals(contentElement.PoorMansTSqlFormatterLib$ParseStructure$Node$Name, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_NSTRING)) {
                        outValue = System.String.concat("N'", System.String.replaceAll(contentElement.PoorMansTSqlFormatterLib$ParseStructure$Node$TextValue, "'", "''"), "'");
                    } else {
                        outValue = System.String.concat("'", System.String.replaceAll(contentElement.PoorMansTSqlFormatterLib$ParseStructure$Node$TextValue, "'", "''"), "'");
                    }
                    state.AddOutputContent$1(outValue, PoorMansTSqlFormatterLib.Interfaces.SqlHtmlConstants.CLASS_STRING);
                    state.WordSeparatorExpected = true;
                    break;
                case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_BRACKET_QUOTED_NAME: 
                    this.WhiteSpace_SeparateWords(state);
                    state.AddOutputContent(System.String.concat("[", System.String.replaceAll(contentElement.PoorMansTSqlFormatterLib$ParseStructure$Node$TextValue, "]", "]]"), "]"));
                    state.WordSeparatorExpected = true;
                    break;
                case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_QUOTED_STRING: 
                    this.WhiteSpace_SeparateWords(state);
                    state.AddOutputContent(System.String.concat("\"", System.String.replaceAll(contentElement.PoorMansTSqlFormatterLib$ParseStructure$Node$TextValue, "\"", "\"\""), "\""));
                    state.WordSeparatorExpected = true;
                    break;
                case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_COMMA: 
                    //comma always ignores requested word spacing
                    if (this.Options.TrailingCommas) {
                        this.WhiteSpace_BreakAsExpected(state);
                        state.AddOutputContent$1(this.FormatOperator(","), PoorMansTSqlFormatterLib.Interfaces.SqlHtmlConstants.CLASS_OPERATOR);

                        if ((this.Options.ExpandCommaLists && !(System.String.equals(contentElement.PoorMansTSqlFormatterLib$ParseStructure$Node$Parent.PoorMansTSqlFormatterLib$ParseStructure$Node$Name, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_DDLDETAIL_PARENS) || System.String.equals(contentElement.PoorMansTSqlFormatterLib$ParseStructure$Node$Parent.PoorMansTSqlFormatterLib$ParseStructure$Node$Name, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_FUNCTION_PARENS) || System.String.equals(contentElement.PoorMansTSqlFormatterLib$ParseStructure$Node$Parent.PoorMansTSqlFormatterLib$ParseStructure$Node$Name, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_IN_PARENS))) || (this.Options.ExpandInLists && System.String.equals(contentElement.PoorMansTSqlFormatterLib$ParseStructure$Node$Parent.PoorMansTSqlFormatterLib$ParseStructure$Node$Name, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_IN_PARENS))) {
                            state.BreakExpected = true;
                        } else {
                            state.WordSeparatorExpected = true;
                        }
                    } else {
                        if ((this.Options.ExpandCommaLists && !(System.String.equals(contentElement.PoorMansTSqlFormatterLib$ParseStructure$Node$Parent.PoorMansTSqlFormatterLib$ParseStructure$Node$Name, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_DDLDETAIL_PARENS) || System.String.equals(contentElement.PoorMansTSqlFormatterLib$ParseStructure$Node$Parent.PoorMansTSqlFormatterLib$ParseStructure$Node$Name, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_FUNCTION_PARENS) || System.String.equals(contentElement.PoorMansTSqlFormatterLib$ParseStructure$Node$Parent.PoorMansTSqlFormatterLib$ParseStructure$Node$Name, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_IN_PARENS))) || (this.Options.ExpandInLists && System.String.equals(contentElement.PoorMansTSqlFormatterLib$ParseStructure$Node$Parent.PoorMansTSqlFormatterLib$ParseStructure$Node$Name, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_IN_PARENS))) {
                            state.WhiteSpace_BreakToNextLine();
                            state.AddOutputContent$1(this.FormatOperator(","), PoorMansTSqlFormatterLib.Interfaces.SqlHtmlConstants.CLASS_OPERATOR);
                            if (this.Options.SpaceAfterExpandedComma) {
                                state.WordSeparatorExpected = true;
                            }
                        } else {
                            this.WhiteSpace_BreakAsExpected(state);
                            state.AddOutputContent$1(this.FormatOperator(","), PoorMansTSqlFormatterLib.Interfaces.SqlHtmlConstants.CLASS_OPERATOR);
                            state.WordSeparatorExpected = true;
                        }

                    }
                    break;
                case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_PERIOD: 
                case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_SEMICOLON: 
                case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_SCOPERESOLUTIONOPERATOR: 
                    //always ignores requested word spacing, and doesn't request a following space either.
                    state.WordSeparatorExpected = false;
                    this.WhiteSpace_BreakAsExpected(state);
                    state.AddOutputContent$1(this.FormatOperator(contentElement.PoorMansTSqlFormatterLib$ParseStructure$Node$TextValue), PoorMansTSqlFormatterLib.Interfaces.SqlHtmlConstants.CLASS_OPERATOR);
                    break;
                case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_ASTERISK: 
                case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_EQUALSSIGN: 
                case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_ALPHAOPERATOR: 
                case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_OTHEROPERATOR: 
                    this.WhiteSpace_SeparateWords(state);
                    state.AddOutputContent$1(this.FormatOperator(contentElement.PoorMansTSqlFormatterLib$ParseStructure$Node$TextValue), PoorMansTSqlFormatterLib.Interfaces.SqlHtmlConstants.CLASS_OPERATOR);
                    state.WordSeparatorExpected = true;
                    break;
                case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_COMPOUNDKEYWORD: 
                    this.WhiteSpace_SeparateWords(state);
                    state.SetRecentKeyword(contentElement.PoorMansTSqlFormatterLib$ParseStructure$Node$GetAttributeValue(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ANAME_SIMPLETEXT));
                    state.AddOutputContent$1(this.FormatKeyword(contentElement.PoorMansTSqlFormatterLib$ParseStructure$Node$GetAttributeValue(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ANAME_SIMPLETEXT)), PoorMansTSqlFormatterLib.Interfaces.SqlHtmlConstants.CLASS_KEYWORD);
                    state.WordSeparatorExpected = true;
                    this.ProcessSqlNodeList(PoorMansTSqlFormatterLib.ParseStructure.NodeExtensions.ChildrenByNames(contentElement, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAMELIST_COMMENT), state.IncrementIndent());
                    state.DecrementIndent();
                    state.WordSeparatorExpected = true;
                    break;
                case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_OTHERKEYWORD: 
                case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_DATATYPE_KEYWORD: 
                    this.WhiteSpace_SeparateWords(state);
                    state.SetRecentKeyword(contentElement.PoorMansTSqlFormatterLib$ParseStructure$Node$TextValue);
                    state.AddOutputContent$1(this.FormatKeyword(contentElement.PoorMansTSqlFormatterLib$ParseStructure$Node$TextValue), PoorMansTSqlFormatterLib.Interfaces.SqlHtmlConstants.CLASS_KEYWORD);
                    state.WordSeparatorExpected = true;
                    break;
                case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_PSEUDONAME: 
                    this.WhiteSpace_SeparateWords(state);
                    state.AddOutputContent$1(this.FormatKeyword(contentElement.PoorMansTSqlFormatterLib$ParseStructure$Node$TextValue), PoorMansTSqlFormatterLib.Interfaces.SqlHtmlConstants.CLASS_KEYWORD);
                    state.WordSeparatorExpected = true;
                    break;
                case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_FUNCTION_KEYWORD: 
                    this.WhiteSpace_SeparateWords(state);
                    state.SetRecentKeyword(contentElement.PoorMansTSqlFormatterLib$ParseStructure$Node$TextValue);
                    state.AddOutputContent$1(contentElement.PoorMansTSqlFormatterLib$ParseStructure$Node$TextValue, PoorMansTSqlFormatterLib.Interfaces.SqlHtmlConstants.CLASS_FUNCTION);
                    state.WordSeparatorExpected = true;
                    break;
                case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_OTHERNODE: 
                case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_MONETARY_VALUE: 
                case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_LABEL: 
                    this.WhiteSpace_SeparateWords(state);
                    state.AddOutputContent(contentElement.PoorMansTSqlFormatterLib$ParseStructure$Node$TextValue);
                    state.WordSeparatorExpected = true;
                    break;
                case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_NUMBER_VALUE: 
                    this.WhiteSpace_SeparateWords(state);
                    state.AddOutputContent(PoorMansTSqlFormatterLib.BridgeUtils.ToLowerInvariant$1(contentElement.PoorMansTSqlFormatterLib$ParseStructure$Node$TextValue));
                    state.WordSeparatorExpected = true;
                    break;
                case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_BINARY_VALUE: 
                    this.WhiteSpace_SeparateWords(state);
                    state.AddOutputContent("0x");
                    state.AddOutputContent(PoorMansTSqlFormatterLib.BridgeUtils.ToUpperInvariant$1(contentElement.PoorMansTSqlFormatterLib$ParseStructure$Node$TextValue.substr(2)));
                    state.WordSeparatorExpected = true;
                    break;
                case PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_WHITESPACE: 
                    //take note if it's a line-breaking space, but don't DO anything here
                    if (System.Text.RegularExpressions.Regex.isMatch(contentElement.PoorMansTSqlFormatterLib$ParseStructure$Node$TextValue, "(\\r|\\n)+")) {
                        state.SourceBreakPending = true;
                    }
                    break;
                default: 
                    throw new System.Exception("Unrecognized element in SQL Xml!");
            }

            if (Bridge.referenceEquals(contentElement.PoorMansTSqlFormatterLib$ParseStructure$Node$GetAttributeValue(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ANAME_HASERROR), "1")) {
                state.CloseClass();
            }

            if (initialIndent !== state.IndentLevel) {
                throw new System.Exception("Messed up the indenting!! Check code/stack or panic!");
            }
        },
        FormatKeyword: function (keyword) {
            var outputKeyword = { };
            if (!this.KeywordMapping.System$Collections$Generic$IDictionary$2$System$String$System$String$tryGetValue(PoorMansTSqlFormatterLib.BridgeUtils.ToUpperInvariant$1(keyword), outputKeyword)) {
                outputKeyword.v = keyword;
            }

            if (this.Options.UppercaseKeywords) {
                return PoorMansTSqlFormatterLib.BridgeUtils.ToUpperInvariant$1(outputKeyword.v);
            } else {
                return PoorMansTSqlFormatterLib.BridgeUtils.ToLowerInvariant$1(outputKeyword.v);
            }
        },
        FormatOperator: function (operatorValue) {
            if (this.Options.UppercaseKeywords) {
                return PoorMansTSqlFormatterLib.BridgeUtils.ToUpperInvariant$1(operatorValue);
            } else {
                return PoorMansTSqlFormatterLib.BridgeUtils.ToLowerInvariant$1(operatorValue);
            }
        },
        WhiteSpace_SeparateStatements: function (contentElement, state) {
            if (state.StatementBreakExpected) {
                //check whether this is a DECLARE/SET clause with similar precedent, and therefore exempt from double-linebreak.
                var thisClauseStarter = this.FirstSemanticElementChild(contentElement);
                if (!(thisClauseStarter != null && System.String.equals(thisClauseStarter.PoorMansTSqlFormatterLib$ParseStructure$Node$Name, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_OTHERKEYWORD) && state.GetRecentKeyword() != null && ((System.String.equals(PoorMansTSqlFormatterLib.BridgeUtils.ToUpperInvariant$1(thisClauseStarter.PoorMansTSqlFormatterLib$ParseStructure$Node$TextValue), "SET") && System.String.equals(state.GetRecentKeyword(), "SET")) || (System.String.equals(PoorMansTSqlFormatterLib.BridgeUtils.ToUpperInvariant$1(thisClauseStarter.PoorMansTSqlFormatterLib$ParseStructure$Node$TextValue), "DECLARE") && System.String.equals(state.GetRecentKeyword(), "DECLARE")) || (System.String.equals(PoorMansTSqlFormatterLib.BridgeUtils.ToUpperInvariant$1(thisClauseStarter.PoorMansTSqlFormatterLib$ParseStructure$Node$TextValue), "PRINT") && System.String.equals(state.GetRecentKeyword(), "PRINT"))))) {
                    for (var i = this.Options.NewStatementLineBreaks; i > 0; i = (i - 1) | 0) {
                        state.AddOutputLineBreak();
                    }
                } else {
                    for (var i1 = this.Options.NewClauseLineBreaks; i1 > 0; i1 = (i1 - 1) | 0) {
                        state.AddOutputLineBreak();
                    }
                }

                state.Indent(state.IndentLevel);
                state.BreakExpected = false;
                state.AdditionalBreaksExpected = 0;
                state.SourceBreakPending = false;
                state.StatementBreakExpected = false;
                state.WordSeparatorExpected = false;
            }
        },
        FirstSemanticElementChild: function (contentElement) {
            var target = null;
            while (contentElement != null) {
                target = System.Linq.Enumerable.from(PoorMansTSqlFormatterLib.ParseStructure.NodeExtensions.ChildrenExcludingNames(contentElement, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAMELIST_NONCONTENT)).firstOrDefault(null, null);

                if (target != null && System.Array.contains(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAMELIST_NONSEMANTICCONTENT, target.PoorMansTSqlFormatterLib$ParseStructure$Node$Name, System.String)) {
                    contentElement = target;
                } else {
                    contentElement = null;
                }
            }

            return target;
        },
        WhiteSpace_SeparateWords: function (state) {
            if (state.BreakExpected || state.AdditionalBreaksExpected > 0) {
                var wasUnIndent = state.UnIndentInitialBreak;
                if (wasUnIndent) {
                    state.DecrementIndent();
                }
                this.WhiteSpace_BreakAsExpected(state);
                if (wasUnIndent) {
                    state.IncrementIndent();
                }
            } else if (state.WordSeparatorExpected) {
                state.AddOutputSpace();
            }
            state.UnIndentInitialBreak = false;
            state.SourceBreakPending = false;
            state.WordSeparatorExpected = false;
        },
        WhiteSpace_SeparateComment: function (contentElement, state) {
            if (state.CurrentLineHasContent && state.SourceBreakPending) {
                state.BreakExpected = true;
                this.WhiteSpace_BreakAsExpected(state);
            } else if (state.WordSeparatorExpected) {
                state.AddOutputSpace();
            }
            state.SourceBreakPending = false;
            state.WordSeparatorExpected = false;
        },
        WhiteSpace_BreakAsExpected: function (state) {
            if (state.BreakExpected) {
                state.WhiteSpace_BreakToNextLine();
            }
            while (state.AdditionalBreaksExpected > 0) {
                state.WhiteSpace_BreakToNextLine();
                state.AdditionalBreaksExpected = (state.AdditionalBreaksExpected - 1) | 0;
            }
        }
    }
    });

    Bridge.define("PoorMansTSqlFormatterLib.Formatters.TSqlStandardFormatter.TSqlStandardFormattingState", {
        inherits: [PoorMansTSqlFormatterLib.BaseFormatterState],
        statics: {
            fields: {
                _startsWithBreakChecker: null,
                _lineBreakMatcher: null
            },
            ctors: {
                init: function () {
                    this._startsWithBreakChecker = new System.Text.RegularExpressions.Regex.ctor("^\\s*(\\r|\\n)", 0);
                    this._lineBreakMatcher = new System.Text.RegularExpressions.Regex.ctor("(\\r|\\n)+");
                }
            }
        },
        fields: {
            _mostRecentKeywordsAtEachLevel: null
        },
        props: {
            IndentString: null,
            IndentLength: 0,
            MaxLineWidth: 0,
            StatementBreakExpected: false,
            BreakExpected: false,
            WordSeparatorExpected: false,
            SourceBreakPending: false,
            AdditionalBreaksExpected: 0,
            UnIndentInitialBreak: false,
            IndentLevel: 0,
            CurrentLineLength: 0,
            CurrentLineHasContent: false,
            SpecialRegionActive: null,
            RegionStartNode: null,
            StartsWithBreak: {
                get: function () {
                    return PoorMansTSqlFormatterLib.Formatters.TSqlStandardFormatter.TSqlStandardFormattingState._startsWithBreakChecker.isMatch(this._outBuilder.toString());
                }
            },
            OutputContainsLineBreak: {
                get: function () {
                    return PoorMansTSqlFormatterLib.Formatters.TSqlStandardFormatter.TSqlStandardFormattingState._lineBreakMatcher.isMatch(this._outBuilder.toString());
                }
            }
        },
        ctors: {
            init: function () {
                this._mostRecentKeywordsAtEachLevel = new (System.Collections.Generic.Dictionary$2(System.Int32,System.String))();
            },
            $ctor1: function (htmlOutput, indentString, spacesPerTab, maxLineWidth, initialIndentLevel) {
                this.$initialize();
                PoorMansTSqlFormatterLib.BaseFormatterState.ctor.call(this, htmlOutput);
                this.IndentLevel = initialIndentLevel;
                this.HtmlOutput = htmlOutput;
                this.IndentString = indentString;
                this.MaxLineWidth = maxLineWidth;

                var tabCount = (System.String.split(indentString, [9].map(function(i) {{ return String.fromCharCode(i); }})).length - 1) | 0;
                var tabExtraCharacters = (tabCount * (((spacesPerTab - 1) | 0))) | 0;
                this.IndentLength = (indentString.length + tabExtraCharacters) | 0;
            },
            ctor: function (sourceState) {
                this.$initialize();
                PoorMansTSqlFormatterLib.BaseFormatterState.ctor.call(this, sourceState.HtmlOutput);
                this.IndentLevel = sourceState.IndentLevel;
                this.HtmlOutput = sourceState.HtmlOutput;
                this.IndentString = sourceState.IndentString;
                this.IndentLength = sourceState.IndentLength;
                this.MaxLineWidth = sourceState.MaxLineWidth;
                //TODO: find a way out of the cross-dependent wrapping maze...
                //CurrentLineLength = sourceState.CurrentLineLength;
                this.CurrentLineLength = (this.IndentLevel * this.IndentLength) | 0;
                this.CurrentLineHasContent = sourceState.CurrentLineHasContent;
            }
        },
        methods: {
            AddOutputContent: function (content) {
                if (this.SpecialRegionActive == null) {
                    this.AddOutputContent$1(content, null);
                }
            },
            AddOutputContent$1: function (content, htmlClassName) {
                if (this.CurrentLineHasContent && (((content.length + this.CurrentLineLength) | 0) > this.MaxLineWidth)) {
                    this.WhiteSpace_BreakToNextLine();
                }

                if (this.SpecialRegionActive == null) {
                    PoorMansTSqlFormatterLib.BaseFormatterState.prototype.AddOutputContent$1.call(this, content, htmlClassName);
                }

                this.CurrentLineHasContent = true;
                this.CurrentLineLength = (this.CurrentLineLength + content.length) | 0;
            },
            AddOutputLineBreak: function () {
                //hints for debugging line-width issues:
                //_outBuilder.Append(" (" + CurrentLineLength.ToString(System.Globalization.CultureInfo.InvariantCulture) + ")");

                //if linebreaks are added directly in the content (eg in comments or strings), they 
                // won't be accounted for here - that's ok.
                if (this.SpecialRegionActive == null) {
                    PoorMansTSqlFormatterLib.BaseFormatterState.prototype.AddOutputLineBreak.call(this);
                }
                this.CurrentLineLength = 0;
                this.CurrentLineHasContent = false;
            },
            AddOutputSpace: function () {
                if (this.SpecialRegionActive == null) {
                    this._outBuilder.append(" ");
                }
            },
            Indent: function (indentLevel) {
                for (var i = 0; i < indentLevel; i = (i + 1) | 0) {
                    if (this.SpecialRegionActive == null) {
                        PoorMansTSqlFormatterLib.BaseFormatterState.prototype.AddOutputContent$1.call(this, this.IndentString, "");
                    } //that is, add the indent as HTMLEncoded content if necessary, but no weird linebreak-adding
                    this.CurrentLineLength = (this.CurrentLineLength + this.IndentLength) | 0;
                }
            },
            WhiteSpace_BreakToNextLine: function () {
                this.AddOutputLineBreak();
                this.Indent(this.IndentLevel);
                this.BreakExpected = false;
                this.SourceBreakPending = false;
                this.WordSeparatorExpected = false;
            },
            Assimilate: function (partialState) {
                //TODO: find a way out of the cross-dependent wrapping maze...
                this.CurrentLineLength = (this.CurrentLineLength + partialState.CurrentLineLength) | 0;
                this.CurrentLineHasContent = this.CurrentLineHasContent || partialState.CurrentLineHasContent;
                if (this.SpecialRegionActive == null) {
                    this._outBuilder.append(partialState.DumpOutput());
                }
            },
            IncrementIndent: function () {
                this.IndentLevel = (this.IndentLevel + 1) | 0;
                return this;
            },
            DecrementIndent: function () {
                this.IndentLevel = (this.IndentLevel - 1) | 0;
                return this;
            },
            SetRecentKeyword: function (ElementName) {
                if (!this._mostRecentKeywordsAtEachLevel.containsKey(this.IndentLevel)) {
                    this._mostRecentKeywordsAtEachLevel.add(this.IndentLevel, PoorMansTSqlFormatterLib.BridgeUtils.ToUpperInvariant$1(ElementName));
                }
            },
            GetRecentKeyword: function () {
                var $t;
                var keywordFound = null;
                var keywordFoundAt = null;
                $t = Bridge.getEnumerator(this._mostRecentKeywordsAtEachLevel.getKeys(), System.Int32);
                try {
                    while ($t.moveNext()) {
                        var key = $t.Current;
                        if ((keywordFoundAt == null || System.Nullable.getValue(keywordFoundAt) > key) && key >= this.IndentLevel) {
                            keywordFoundAt = key;
                            keywordFound = this._mostRecentKeywordsAtEachLevel.get(key);
                        }
                    }
                } finally {
                    if (Bridge.is($t, System.IDisposable)) {
                        $t.System$IDisposable$dispose();
                    }
                }return keywordFound;
            },
            ResetKeywords: function () {
                var $t, $t1;
                var descendentLevelKeys = new (System.Collections.Generic.List$1(System.Int32))();
                $t = Bridge.getEnumerator(this._mostRecentKeywordsAtEachLevel.getKeys(), System.Int32);
                try {
                    while ($t.moveNext()) {
                        var key = $t.Current;
                        if (key >= this.IndentLevel) {
                            descendentLevelKeys.add(key);
                        }
                    }
                } finally {
                    if (Bridge.is($t, System.IDisposable)) {
                        $t.System$IDisposable$dispose();
                    }
                }$t1 = Bridge.getEnumerator(descendentLevelKeys);
                try {
                    while ($t1.moveNext()) {
                        var key1 = $t1.Current;
                        this._mostRecentKeywordsAtEachLevel.remove(key1);
                    }
                } finally {
                    if (Bridge.is($t1, System.IDisposable)) {
                        $t1.System$IDisposable$dispose();
                    }
                }}
        }
    });

    Bridge.define("PoorMansTSqlFormatterLib.Interfaces.ITokenList", {
        inherits: [System.Collections.Generic.IList$1(PoorMansTSqlFormatterLib.Interfaces.IToken)],
        $kind: "interface"
    });

    Bridge.define("PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser", {
        inherits: [PoorMansTSqlFormatterLib.Interfaces.ISqlTokenParser],
        statics: {
            fields: {
                _JoinDetector: null,
                _CursorDetector: null,
                _TriggerConditionDetector: null
            },
            props: {
                KeywordList: null
            },
            ctors: {
                init: function () {
                    this._JoinDetector = new System.Text.RegularExpressions.Regex.ctor("^((RIGHT|INNER|LEFT|CROSS|FULL) )?(OUTER )?((HASH|LOOP|MERGE|REMOTE) )?(JOIN|APPLY) ");
                    this._CursorDetector = new System.Text.RegularExpressions.Regex.ctor("^DECLARE [\\p{L}0-9_\\$\\@\\#]+ ((INSENSITIVE|SCROLL) ){0,2}CURSOR ");
                    this._TriggerConditionDetector = new System.Text.RegularExpressions.Regex.ctor("^(FOR|AFTER|INSTEAD OF)( (INSERT|UPDATE|DELETE) (, (INSERT|UPDATE|DELETE) )?(, (INSERT|UPDATE|DELETE) )?)");
                },
                ctor: function () {
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.InitializeKeywordList();
                    System.Linq.Enumerable.from(PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList).take(3);
                }
            },
            methods: {
                ContentStartsWithKeyword: function (providedContainer, contentToMatch) {
                    var firstEntryOfProvidedContainer = Bridge.cast(PoorMansTSqlFormatterLib.ParseStructure.NodeExtensions.RootContainer(providedContainer), PoorMansTSqlFormatterLib.ParseTree).GetFirstNonWhitespaceNonCommentChildElement(providedContainer);
                    var targetFound = false;
                    var keywordUpperValue = null;

                    if (firstEntryOfProvidedContainer != null && System.String.equals(firstEntryOfProvidedContainer.PoorMansTSqlFormatterLib$ParseStructure$Node$Name, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_OTHERKEYWORD) && firstEntryOfProvidedContainer.PoorMansTSqlFormatterLib$ParseStructure$Node$TextValue != null) {
                        keywordUpperValue = PoorMansTSqlFormatterLib.BridgeUtils.ToUpperInvariant$1(firstEntryOfProvidedContainer.PoorMansTSqlFormatterLib$ParseStructure$Node$TextValue);
                    }

                    if (firstEntryOfProvidedContainer != null && System.String.equals(firstEntryOfProvidedContainer.PoorMansTSqlFormatterLib$ParseStructure$Node$Name, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_COMPOUNDKEYWORD)) {
                        keywordUpperValue = firstEntryOfProvidedContainer.PoorMansTSqlFormatterLib$ParseStructure$Node$GetAttributeValue(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ANAME_SIMPLETEXT);
                    }

                    if (keywordUpperValue != null) {
                        targetFound = System.String.equals(keywordUpperValue, contentToMatch) || System.String.startsWith(keywordUpperValue, System.String.concat(contentToMatch, " "));
                    } else {
                        //if contentToMatch was passed in as null, means we were looking for a NON-keyword.
                        targetFound = contentToMatch == null;
                    }

                    return targetFound;
                },
                IsStatementStarter: function (token) {
                    //List created from experience, and augmented with individual sections of MSDN:
                    // http://msdn.microsoft.com/en-us/library/ff848799.aspx
                    // http://msdn.microsoft.com/en-us/library/ff848727.aspx
                    // http://msdn.microsoft.com/en-us/library/ms174290.aspx
                    // etc...
                    var uppercaseValue = PoorMansTSqlFormatterLib.BridgeUtils.ToUpperInvariant$1(token.PoorMansTSqlFormatterLib$Interfaces$IToken$Value);
                    return (token.PoorMansTSqlFormatterLib$Interfaces$IToken$Type === PoorMansTSqlFormatterLib.Interfaces.SqlTokenType.OtherNode && (System.String.equals(uppercaseValue, "ALTER") || System.String.equals(uppercaseValue, "BACKUP") || System.String.equals(uppercaseValue, "BREAK") || System.String.equals(uppercaseValue, "CLOSE") || System.String.equals(uppercaseValue, "CHECKPOINT") || System.String.equals(uppercaseValue, "COMMIT") || System.String.equals(uppercaseValue, "CONTINUE") || System.String.equals(uppercaseValue, "CREATE") || System.String.equals(uppercaseValue, "DBCC") || System.String.equals(uppercaseValue, "DEALLOCATE") || System.String.equals(uppercaseValue, "DELETE") || System.String.equals(uppercaseValue, "DECLARE") || System.String.equals(uppercaseValue, "DENY") || System.String.equals(uppercaseValue, "DROP") || System.String.equals(uppercaseValue, "EXEC") || System.String.equals(uppercaseValue, "EXECUTE") || System.String.equals(uppercaseValue, "FETCH") || System.String.equals(uppercaseValue, "GOTO") || System.String.equals(uppercaseValue, "GRANT") || System.String.equals(uppercaseValue, "IF") || System.String.equals(uppercaseValue, "INSERT") || System.String.equals(uppercaseValue, "KILL") || System.String.equals(uppercaseValue, "MERGE") || System.String.equals(uppercaseValue, "OPEN") || System.String.equals(uppercaseValue, "PRINT") || System.String.equals(uppercaseValue, "RAISERROR") || System.String.equals(uppercaseValue, "RECONFIGURE") || System.String.equals(uppercaseValue, "RESTORE") || System.String.equals(uppercaseValue, "RETURN") || System.String.equals(uppercaseValue, "REVERT") || System.String.equals(uppercaseValue, "REVOKE") || System.String.equals(uppercaseValue, "SELECT") || System.String.equals(uppercaseValue, "SET") || System.String.equals(uppercaseValue, "SETUSER") || System.String.equals(uppercaseValue, "SHUTDOWN") || System.String.equals(uppercaseValue, "TRUNCATE") || System.String.equals(uppercaseValue, "UPDATE") || System.String.equals(uppercaseValue, "USE") || System.String.equals(uppercaseValue, "WAITFOR") || System.String.equals(uppercaseValue, "WHILE")));
                },
                IsClauseStarter: function (token) {
                    //Note: some clause starters are handled separately: Joins, RETURNS clauses, etc.
                    var uppercaseValue = PoorMansTSqlFormatterLib.BridgeUtils.ToUpperInvariant$1(token.PoorMansTSqlFormatterLib$Interfaces$IToken$Value);
                    return (token.PoorMansTSqlFormatterLib$Interfaces$IToken$Type === PoorMansTSqlFormatterLib.Interfaces.SqlTokenType.OtherNode && (System.String.equals(uppercaseValue, "DELETE") || System.String.equals(uppercaseValue, "EXCEPT") || System.String.equals(uppercaseValue, "FOR") || System.String.equals(uppercaseValue, "FROM") || System.String.equals(uppercaseValue, "GROUP") || System.String.equals(uppercaseValue, "HAVING") || System.String.equals(uppercaseValue, "INNER") || System.String.equals(uppercaseValue, "INTERSECT") || System.String.equals(uppercaseValue, "INTO") || System.String.equals(uppercaseValue, "INSERT") || System.String.equals(uppercaseValue, "MERGE") || System.String.equals(uppercaseValue, "ORDER") || System.String.equals(uppercaseValue, "OUTPUT") || System.String.equals(uppercaseValue, "PIVOT") || System.String.equals(uppercaseValue, "RETURNS") || System.String.equals(uppercaseValue, "SELECT") || System.String.equals(uppercaseValue, "UNION") || System.String.equals(uppercaseValue, "UNPIVOT") || System.String.equals(uppercaseValue, "UPDATE") || System.String.equals(uppercaseValue, "USING") || System.String.equals(uppercaseValue, "VALUES") || System.String.equals(uppercaseValue, "WHERE") || System.String.equals(uppercaseValue, "WITH")));
                },
                IsLineBreakingWhiteSpaceOrComment: function (token) {
                    return (token.PoorMansTSqlFormatterLib$Interfaces$IToken$Type === PoorMansTSqlFormatterLib.Interfaces.SqlTokenType.WhiteSpace && System.Text.RegularExpressions.Regex.isMatch(token.PoorMansTSqlFormatterLib$Interfaces$IToken$Value, "(\\r|\\n)+")) || token.PoorMansTSqlFormatterLib$Interfaces$IToken$Type === PoorMansTSqlFormatterLib.Interfaces.SqlTokenType.SingleLineComment;
                },
                InitializeKeywordList: function () {
                    //List originally copied from Side by Side SQL Comparer project from CodeProject:
                    // http://www.codeproject.com/KB/database/SideBySideSQLComparer.aspx
                    // Added some entries that are not strictly speaking keywords, such as 
                    // cursor options "READ_ONLY", "FAST_FORWARD", etc.
                    // also added numerous missing entries, such as "Xml", etc
                    // Could/Should check against MSDN Ref: http://msdn.microsoft.com/en-us/library/ms189822.aspx
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList = new (System.Collections.Generic.Dictionary$2(System.String,PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType))();
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("@@CONNECTIONS", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("@@CPU_BUSY", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("@@CURSOR_ROWS", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("@@DATEFIRST", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("@@DBTS", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("@@ERROR", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("@@FETCH_STATUS", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("@@IDENTITY", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("@@IDLE", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("@@IO_BUSY", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("@@LANGID", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("@@LANGUAGE", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("@@LOCK_TIMEOUT", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("@@MAX_CONNECTIONS", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("@@MAX_PRECISION", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("@@NESTLEVEL", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("@@OPTIONS", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("@@PACKET_ERRORS", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("@@PACK_RECEIVED", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("@@PACK_SENT", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("@@PROCID", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("@@REMSERVER", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("@@ROWCOUNT", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("@@SERVERNAME", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("@@SERVICENAME", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("@@SPID", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("@@TEXTSIZE", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("@@TIMETICKS", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("@@TOTAL_ERRORS", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("@@TOTAL_READ", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("@@TOTAL_WRITE", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("@@TRANCOUNT", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("@@VERSION", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("ABS", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("ACOS", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("ACTIVATION", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("ADD", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("ALL", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OperatorKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("ALTER", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("AND", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OperatorKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("ANSI_DEFAULTS", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("ANSI_NULLS", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("ANSI_NULL_DFLT_OFF", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("ANSI_NULL_DFLT_ON", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("ANSI_PADDING", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("ANSI_WARNINGS", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("ANY", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OperatorKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("APP_NAME", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("ARITHABORT", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("ARITHIGNORE", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("AS", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("ASC", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("ASCII", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("ASIN", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("ATAN", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("ATN2", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("AUTHORIZATION", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("AVG", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("BACKUP", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("BEGIN", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("BETWEEN", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OperatorKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("BIGINT", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.DataTypeKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("BINARY", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.DataTypeKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("BIT", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.DataTypeKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("BREAK", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("BROWSE", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("BULK", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("BY", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("CALLER", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("CASCADE", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("CASE", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("CAST", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("CATALOG", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("CEILING", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("CHAR", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.DataTypeKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("CHARACTER", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.DataTypeKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("CHARINDEX", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("CHECK", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("CHECKALLOC", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("CHECKCATALOG", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("CHECKCONSTRAINTS", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("CHECKDB", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("CHECKFILEGROUP", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("CHECKIDENT", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("CHECKPOINT", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("CHECKSUM", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("CHECKSUM_AGG", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("CHECKTABLE", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("CLEANTABLE", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("CLOSE", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("CLUSTERED", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("COALESCE", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("COLLATIONPROPERTY", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("COLLECTION", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("COLUMN", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("COLUMNPROPERTY", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("COL_LENGTH", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("COL_NAME", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("COMMIT", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("COMMITTED", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("COMPUTE", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("CONCAT", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("CONCAT_NULL_YIELDS_NULL", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("CONCURRENCYVIOLATION", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("CONFIRM", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("CONSTRAINT", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("CONTAINS", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("CONTAINSTABLE", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("CONTINUE", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("CONTROL", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("CONTROLROW", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("CONVERT", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("COS", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("COT", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("COUNT", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("COUNT_BIG", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("CREATE", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("CROSS", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("CURRENT", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("CURRENT_DATE", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("CURRENT_TIME", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("CURRENT_TIMESTAMP", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("CURRENT_USER", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("CURSOR", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("CURSOR_CLOSE_ON_COMMIT", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("CURSOR_STATUS", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("DATABASE", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("DATABASEPROPERTY", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("DATABASEPROPERTYEX", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("DATALENGTH", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("DATEADD", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("DATEDIFF", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("DATEFIRST", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("DATEFORMAT", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("DATENAME", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("DATE", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.DataTypeKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("DATEPART", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("DATETIME", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.DataTypeKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("DATETIME2", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.DataTypeKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("DATETIMEOFFSET", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.DataTypeKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("DAY", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("DBCC", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("DBREINDEX", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("DBREPAIR", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("DB_ID", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("DB_NAME", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("DEADLOCK_PRIORITY", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("DEALLOCATE", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("DEC", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.DataTypeKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("DECIMAL", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.DataTypeKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("DECLARE", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("DEFAULT", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("DEFINITION", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("DEGREES", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("DELAY", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("DELETE", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("DENY", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("DESC", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("DIFFERENCE", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("DISABLE_DEF_CNST_CHK", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("DISK", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("DISTINCT", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("DISTRIBUTED", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("DOUBLE", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.DataTypeKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("DROP", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("DROPCLEANBUFFERS", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("DUMMY", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("DUMP", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("DYNAMIC", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("ELSE", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("ENCRYPTION", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("ERRLVL", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("ERROREXIT", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("ESCAPE", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("EXCEPT", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("EXEC", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("EXECUTE", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("EXISTS", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OperatorKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("EXIT", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("EXP", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("EXPAND", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("EXTERNAL", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("FAST", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("FAST_FORWARD", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("FASTFIRSTROW", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("FETCH", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("FILE", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("FILEGROUPPROPERTY", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("FILEGROUP_ID", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("FILEGROUP_NAME", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("FILEPROPERTY", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("FILE_ID", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("FILE_IDEX", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("FILE_NAME", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("FILLFACTOR", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("FIPS_FLAGGER", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("FLOAT", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.DataTypeKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("FLOOR", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("FLOPPY", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("FMTONLY", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("FOR", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("FORCE", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("FORCED", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("FORCEPLAN", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("FOREIGN", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("FORMATMESSAGE", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("FORWARD_ONLY", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("FREEPROCCACHE", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("FREESESSIONCACHE", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("FREESYSTEMCACHE", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("FREETEXT", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("FREETEXTTABLE", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("FROM", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("FULL", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("FULLTEXT", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("FULLTEXTCATALOGPROPERTY", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("FULLTEXTSERVICEPROPERTY", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("FUNCTION", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("GEOGRAPHY", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.DataTypeKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("GETANCESTOR", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("GETANSINULL", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("GETDATE", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("GETDESCENDANT", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("GETLEVEL", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("GETREPARENTEDVALUE", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("GETROOT", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("GLOBAL", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("GO", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("GOTO", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("GRANT", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("GROUP", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("GROUPING", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("HASH", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("HAVING", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("HELP", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("HIERARCHYID", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.DataTypeKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("HOLDLOCK", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("HOST_ID", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("HOST_NAME", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("IDENTITY", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("IDENTITYCOL", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("IDENTITY_INSERT", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("IDENT_CURRENT", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("IDENT_INCR", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("IDENT_SEED", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("IF", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("IGNORE_CONSTRAINTS", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("IGNORE_TRIGGERS", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("IMAGE", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.DataTypeKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("IMPLICIT_TRANSACTIONS", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("IN", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OperatorKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("INDEX", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("INDEXDEFRAG", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("INDEXKEY_PROPERTY", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("INDEXPROPERTY", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("INDEX_COL", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("INNER", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("INPUTBUFFER", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("INSENSITIVE", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.DataTypeKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("INSERT", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("INT", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.DataTypeKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("INTEGER", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.DataTypeKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("INTERSECT", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("INTO", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("IO", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("IS", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("ISDATE", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("ISDESCENDANTOF", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("ISNULL", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("ISNUMERIC", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("ISOLATION", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("IS_MEMBER", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("IS_SRVROLEMEMBER", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("JOIN", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("KEEP", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("KEEPDEFAULTS", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("KEEPFIXED", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("KEEPIDENTITY", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("KEY", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("KEYSET", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("KILL", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("LANGUAGE", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("LEFT", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("LEN", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("LEVEL", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("LIKE", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OperatorKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("LINENO", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("LOAD", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("LOCAL", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("LOCK_TIMEOUT", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("LOG", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("LOG10", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("LOGIN", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("LOOP", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("LOWER", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("LTRIM", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("MATCHED", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("MAX", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("MAX_QUEUE_READERS", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("MAXDOP", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("MAXRECURSION", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("MERGE", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("MIN", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("MIRROREXIT", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("MODIFY", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("MONEY", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.DataTypeKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("MONTH", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("MOVE", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("NAME", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("NATIONAL", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.DataTypeKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("NCHAR", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.DataTypeKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("NEWID", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("NEXT", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("NOCHECK", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("NOCOUNT", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("NODES", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("NOEXEC", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("NOEXPAND", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("NOLOCK", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("NONCLUSTERED", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("NOT", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OperatorKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("NOWAIT", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("NTEXT", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.DataTypeKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("NTILE", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("NULL", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("NULLIF", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("NUMERIC", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.DataTypeKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("NUMERIC_ROUNDABORT", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("NVARCHAR", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.DataTypeKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("OBJECTPROPERTY", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("OBJECTPROPERTYEX", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("OBJECT", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("OBJECT_ID", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("OBJECT_NAME", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("OF", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("OFF", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("OFFSETS", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("ON", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("ONCE", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("ONLY", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("OPEN", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("OPENDATASOURCE", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("OPENQUERY", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("OPENROWSET", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("OPENTRAN", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("OPTIMIZE", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("OPTIMISTIC", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("OPTION", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("OR", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OperatorKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("ORDER", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("OUTER", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("OUT", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("OUTPUT", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("OUTPUTBUFFER", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("OVER", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("OWNER", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("PAGLOCK", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("PARAMETERIZATION", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("PARSE", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("PARSENAME", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("PARSEONLY", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("PARTITION", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("PATINDEX", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("PERCENT", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("PERM", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("PERMANENT", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("PERMISSIONS", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("PI", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("PINTABLE", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("PIPE", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("PLAN", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("POWER", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("PREPARE", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("PRIMARY", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("PRINT", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("PRIVILEGES", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("PROC", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("PROCCACHE", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("PROCEDURE", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("PROCEDURE_NAME", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("PROCESSEXIT", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("PROCID", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("PROFILE", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("PUBLIC", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("QUERY", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("QUERY_GOVERNOR_COST_LIMIT", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("QUEUE", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("QUOTED_IDENTIFIER", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("QUOTENAME", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("RADIANS", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("RAISERROR", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("RAND", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("READ", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("READCOMMITTED", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("READCOMMITTEDLOCK", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("READPAST", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("READTEXT", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("READUNCOMMITTED", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("READ_ONLY", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("REAL", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.DataTypeKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("RECOMPILE", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("RECONFIGURE", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("REFERENCES", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("REMOTE_PROC_TRANSACTIONS", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("REPEATABLE", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("REPEATABLEREAD", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("REPLACE", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("REPLICATE", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("REPLICATION", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("RESTORE", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("RESTRICT", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("RETURN", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("RETURNS", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("REVERSE", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("REVERT", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("REVOKE", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("RIGHT", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("ROBUST", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("ROLE", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("ROLLBACK", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("ROUND", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("ROWCOUNT", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("ROWGUIDCOL", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("ROWLOCK", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("ROWVERSION", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.DataTypeKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("RTRIM", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("RULE", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("SAVE", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("SCHEMA", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("SCHEMA_ID", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("SCHEMA_NAME", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("SCOPE_IDENTITY", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("SCROLL", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("SCROLL_LOCKS", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("SELECT", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("SELF", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("SERIALIZABLE", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("SERVER", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("SERVERPROPERTY", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("SESSIONPROPERTY", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("SESSION_USER", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("SET", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("SETUSER", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("SHOWCONTIG", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("SHOWPLAN_ALL", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("SHOWPLAN_TEXT", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("SHOW_STATISTICS", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("SHRINKDATABASE", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("SHRINKFILE", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("SHUTDOWN", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("SIGN", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("SIMPLE", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("SIN", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("SMALLDATETIME", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.DataTypeKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("SMALLINT", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.DataTypeKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("SMALLMONEY", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.DataTypeKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("SOME", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OperatorKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("SOUNDEX", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("SPACE", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("SQLPERF", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("SQL_VARIANT", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.DataTypeKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("SQL_VARIANT_PROPERTY", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("SQRT", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("SQUARE", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("STATE", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("STATISTICS", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("STATIC", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("STATS_DATE", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("STATUS", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("STDEV", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("STDEVP", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("STOPLIST", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("STR", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("STUFF", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("SUBSTRING", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("SUM", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("SUSER_ID", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("SUSER_NAME", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("SUSER_SID", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("SUSER_SNAME", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("SYNONYM", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("SYSNAME", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.DataTypeKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("SYSTEM_USER", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("TABLE", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("TABLOCK", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("TABLOCKX", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("TAN", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("TAPE", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("TEMP", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("TEMPORARY", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("TEXT", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.DataTypeKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("TEXTPTR", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("TEXTSIZE", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("TEXTVALID", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("THEN", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("TIME", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.DataTypeKeyword); //not strictly-speaking true, can also be keyword in WAITFOR TIME
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("TIMESTAMP", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.DataTypeKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("TINYINT", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.DataTypeKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("TO", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("TOP", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("TOSTRING", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("TRACEOFF", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("TRACEON", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("TRACESTATUS", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("TRAN", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("TRANSACTION", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("TRIGGER", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("TRUNCATE", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("TSEQUAL", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("TYPEPROPERTY", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("TYPE_ID", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("TYPE_NAME", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("TYPE_WARNING", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("UNCOMMITTED", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("UNICODE", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("UNION", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("UNIQUE", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("UNIQUEIDENTIFIER", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.DataTypeKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("UNKNOWN", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("UNPINTABLE", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("UPDATE", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("UPDATETEXT", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("UPDATEUSAGE", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("UPDLOCK", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("UPPER", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("USE", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("USER", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("USEROPTIONS", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("USER_ID", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("USER_NAME", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("USING", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("VALUE", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("VALUES", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("VAR", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("VARBINARY", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.DataTypeKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("VARCHAR", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.DataTypeKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("VARP", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("VARYING", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("VIEW", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("VIEWS", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("WAITFOR", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("WHEN", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("WHERE", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("WHILE", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("WITH", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("WORK", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("WRITE", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("WRITETEXT", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("XACT_ABORT", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("XLOCK", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("XML", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.DataTypeKeyword);
                    PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.add("YEAR", PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword);
                }
            }
        },
        alias: ["ParseSQL", "PoorMansTSqlFormatterLib$Interfaces$ISqlTokenParser$ParseSQL"],
        methods: {
            ParseSQL: function (tokenList) {
                var $t, $t1, $t2, $t3;
                var sqlTree = new PoorMansTSqlFormatterLib.ParseTree(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_SQL_ROOT);
                sqlTree.StartNewStatement();

                var tokenCount = System.Array.getCount(tokenList, PoorMansTSqlFormatterLib.Interfaces.IToken);
                var tokenID = { v : 0 };
                while (tokenID.v < tokenCount) {
                    var token = System.Array.getItem(tokenList, tokenID.v, PoorMansTSqlFormatterLib.Interfaces.IToken);

                    switch (token.PoorMansTSqlFormatterLib$Interfaces$IToken$Type) {
                        case PoorMansTSqlFormatterLib.Interfaces.SqlTokenType.OpenParens: 
                            var firstNonCommentParensSibling = sqlTree.GetFirstNonWhitespaceNonCommentChildElement(sqlTree.CurrentContainer);
                            var lastNonCommentParensSibling = sqlTree.GetLastNonWhitespaceNonCommentChildElement(sqlTree.CurrentContainer);
                            var isInsertOrValuesClause = (firstNonCommentParensSibling != null && ((System.String.equals(firstNonCommentParensSibling.PoorMansTSqlFormatterLib$ParseStructure$Node$Name, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_OTHERKEYWORD) && System.String.startsWith(PoorMansTSqlFormatterLib.BridgeUtils.ToUpperInvariant$1(firstNonCommentParensSibling.PoorMansTSqlFormatterLib$ParseStructure$Node$TextValue), "INSERT")) || (System.String.equals(firstNonCommentParensSibling.PoorMansTSqlFormatterLib$ParseStructure$Node$Name, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_COMPOUNDKEYWORD) && System.String.startsWith(PoorMansTSqlFormatterLib.BridgeUtils.ToUpperInvariant$1(firstNonCommentParensSibling.PoorMansTSqlFormatterLib$ParseStructure$Node$GetAttributeValue(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ANAME_SIMPLETEXT)), "INSERT ")) || (System.String.equals(firstNonCommentParensSibling.PoorMansTSqlFormatterLib$ParseStructure$Node$Name, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_OTHERKEYWORD) && System.String.startsWith(PoorMansTSqlFormatterLib.BridgeUtils.ToUpperInvariant$1(firstNonCommentParensSibling.PoorMansTSqlFormatterLib$ParseStructure$Node$TextValue), "VALUES"))));
                            if (System.String.equals(sqlTree.CurrentContainer.PoorMansTSqlFormatterLib$ParseStructure$Node$Name, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CTE_ALIAS) && System.String.equals(sqlTree.CurrentContainer.PoorMansTSqlFormatterLib$ParseStructure$Node$Parent.PoorMansTSqlFormatterLib$ParseStructure$Node$Name, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CTE_WITH_CLAUSE)) {
                                sqlTree.CurrentContainer = sqlTree.SaveNewElement(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_DDL_PARENS, "");
                            } else {
                                if (System.String.equals(sqlTree.CurrentContainer.PoorMansTSqlFormatterLib$ParseStructure$Node$Name, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CONTAINER_GENERALCONTENT) && System.String.equals(sqlTree.CurrentContainer.PoorMansTSqlFormatterLib$ParseStructure$Node$Parent.PoorMansTSqlFormatterLib$ParseStructure$Node$Name, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CTE_AS_BLOCK)) {
                                    sqlTree.CurrentContainer = sqlTree.SaveNewElement(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_SELECTIONTARGET_PARENS, "");
                                } else {
                                    if (firstNonCommentParensSibling == null && System.String.equals(sqlTree.CurrentContainer.PoorMansTSqlFormatterLib$ParseStructure$Node$Name, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_SELECTIONTARGET)) {
                                        sqlTree.CurrentContainer = sqlTree.SaveNewElement(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_SELECTIONTARGET_PARENS, "");
                                    } else {
                                        if (firstNonCommentParensSibling != null && System.String.equals(firstNonCommentParensSibling.PoorMansTSqlFormatterLib$ParseStructure$Node$Name, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_SET_OPERATOR_CLAUSE)) {
                                            sqlTree.ConsiderStartingNewClause();
                                            sqlTree.CurrentContainer = sqlTree.SaveNewElement(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_SELECTIONTARGET_PARENS, "");
                                        } else if (this.IsLatestTokenADDLDetailValue(sqlTree)) {
                                            sqlTree.CurrentContainer = sqlTree.SaveNewElement(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_DDLDETAIL_PARENS, "");
                                        } else {
                                            if (System.String.equals(sqlTree.CurrentContainer.PoorMansTSqlFormatterLib$ParseStructure$Node$Name, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_DDL_PROCEDURAL_BLOCK) || System.String.equals(sqlTree.CurrentContainer.PoorMansTSqlFormatterLib$ParseStructure$Node$Name, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_DDL_OTHER_BLOCK) || System.String.equals(sqlTree.CurrentContainer.PoorMansTSqlFormatterLib$ParseStructure$Node$Name, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_DDL_DECLARE_BLOCK) || (System.String.equals(sqlTree.CurrentContainer.PoorMansTSqlFormatterLib$ParseStructure$Node$Name, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_SQL_CLAUSE) && (firstNonCommentParensSibling != null && System.String.equals(firstNonCommentParensSibling.PoorMansTSqlFormatterLib$ParseStructure$Node$Name, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_OTHERKEYWORD) && System.String.startsWith(PoorMansTSqlFormatterLib.BridgeUtils.ToUpperInvariant$1(firstNonCommentParensSibling.PoorMansTSqlFormatterLib$ParseStructure$Node$TextValue), "OPTION"))) || isInsertOrValuesClause) {
                                                sqlTree.CurrentContainer = sqlTree.SaveNewElement(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_DDL_PARENS, "");
                                            } else {
                                                if ((lastNonCommentParensSibling != null && System.String.equals(lastNonCommentParensSibling.PoorMansTSqlFormatterLib$ParseStructure$Node$Name, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_ALPHAOPERATOR) && System.String.equals(PoorMansTSqlFormatterLib.BridgeUtils.ToUpperInvariant$1(lastNonCommentParensSibling.PoorMansTSqlFormatterLib$ParseStructure$Node$TextValue), "IN"))) {
                                                    sqlTree.CurrentContainer = sqlTree.SaveNewElement(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_IN_PARENS, "");
                                                } else {
                                                    if (this.IsLatestTokenAMiscName(sqlTree)) {
                                                        sqlTree.CurrentContainer = sqlTree.SaveNewElement(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_FUNCTION_PARENS, "");
                                                    } else {
                                                        sqlTree.CurrentContainer = sqlTree.SaveNewElement(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_EXPRESSION_PARENS, "");
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            break;
                        case PoorMansTSqlFormatterLib.Interfaces.SqlTokenType.CloseParens: 
                            //we're not likely to actually have a "SingleStatement" in parens, but 
                            // we definitely want the side-effects (all the lower-level escapes)
                            sqlTree.EscapeAnySingleOrPartialStatementContainers();
                            //check whether we expected to end the parens...
                            if (System.String.equals(sqlTree.CurrentContainer.PoorMansTSqlFormatterLib$ParseStructure$Node$Name, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_DDLDETAIL_PARENS) || System.String.equals(sqlTree.CurrentContainer.PoorMansTSqlFormatterLib$ParseStructure$Node$Name, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_DDL_PARENS) || System.String.equals(sqlTree.CurrentContainer.PoorMansTSqlFormatterLib$ParseStructure$Node$Name, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_FUNCTION_PARENS) || System.String.equals(sqlTree.CurrentContainer.PoorMansTSqlFormatterLib$ParseStructure$Node$Name, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_IN_PARENS) || System.String.equals(sqlTree.CurrentContainer.PoorMansTSqlFormatterLib$ParseStructure$Node$Name, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_EXPRESSION_PARENS) || System.String.equals(sqlTree.CurrentContainer.PoorMansTSqlFormatterLib$ParseStructure$Node$Name, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_SELECTIONTARGET_PARENS)) {
                                sqlTree.MoveToAncestorContainer(1); //unspecified parent node...
                            } else if (System.String.equals(sqlTree.CurrentContainer.PoorMansTSqlFormatterLib$ParseStructure$Node$Name, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_SQL_CLAUSE) && System.String.equals(sqlTree.CurrentContainer.PoorMansTSqlFormatterLib$ParseStructure$Node$Parent.PoorMansTSqlFormatterLib$ParseStructure$Node$Name, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_SELECTIONTARGET_PARENS) && System.String.equals(sqlTree.CurrentContainer.PoorMansTSqlFormatterLib$ParseStructure$Node$Parent.PoorMansTSqlFormatterLib$ParseStructure$Node$Parent.PoorMansTSqlFormatterLib$ParseStructure$Node$Name, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CONTAINER_GENERALCONTENT) && System.String.equals(sqlTree.CurrentContainer.PoorMansTSqlFormatterLib$ParseStructure$Node$Parent.PoorMansTSqlFormatterLib$ParseStructure$Node$Parent.PoorMansTSqlFormatterLib$ParseStructure$Node$Parent.PoorMansTSqlFormatterLib$ParseStructure$Node$Name, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CTE_AS_BLOCK)) {
                                sqlTree.MoveToAncestorContainer$1(4, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CTE_WITH_CLAUSE);
                                sqlTree.CurrentContainer = sqlTree.SaveNewElement(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CONTAINER_GENERALCONTENT, "");
                            } else if (System.String.equals(sqlTree.CurrentContainer.PoorMansTSqlFormatterLib$ParseStructure$Node$Name, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_SQL_CLAUSE) && (System.String.equals(sqlTree.CurrentContainer.PoorMansTSqlFormatterLib$ParseStructure$Node$Parent.PoorMansTSqlFormatterLib$ParseStructure$Node$Name, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_EXPRESSION_PARENS) || System.String.equals(sqlTree.CurrentContainer.PoorMansTSqlFormatterLib$ParseStructure$Node$Parent.PoorMansTSqlFormatterLib$ParseStructure$Node$Name, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_IN_PARENS) || System.String.equals(sqlTree.CurrentContainer.PoorMansTSqlFormatterLib$ParseStructure$Node$Parent.PoorMansTSqlFormatterLib$ParseStructure$Node$Name, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_SELECTIONTARGET_PARENS))) {
                                sqlTree.MoveToAncestorContainer(2); //unspecified grandfather node.
                            } else {
                                sqlTree.SaveNewElementWithError(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_OTHERNODE, ")");
                            }
                            break;
                        case PoorMansTSqlFormatterLib.Interfaces.SqlTokenType.OtherNode: 
                            //prepare multi-keyword detection by "peeking" up to 7 keywords ahead
                            var significantTokenPositions = this.GetSignificantTokenPositions(tokenList, tokenID.v, 7);
                            var significantTokensString = this.ExtractTokensString(tokenList, significantTokenPositions);
                            if (sqlTree.PathNameMatches$1(0, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_PERMISSIONS_DETAIL)) {
                                //if we're in a permissions detail clause, we can expect all sorts of statements 
                                // starters and should ignore them all; the only possible keywords to escape are
                                // "ON" and "TO".
                                if (System.String.startsWith(significantTokensString, "ON ")) {
                                    sqlTree.MoveToAncestorContainer$1(1, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_PERMISSIONS_BLOCK);
                                    sqlTree.StartNewContainer(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_PERMISSIONS_TARGET, token.PoorMansTSqlFormatterLib$Interfaces$IToken$Value, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CONTAINER_GENERALCONTENT);
                                } else if (System.String.startsWith(significantTokensString, "TO ") || System.String.startsWith(significantTokensString, "FROM ")) {
                                    sqlTree.MoveToAncestorContainer$1(1, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_PERMISSIONS_BLOCK);
                                    sqlTree.StartNewContainer(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_PERMISSIONS_RECIPIENT, token.PoorMansTSqlFormatterLib$Interfaces$IToken$Value, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CONTAINER_GENERALCONTENT);
                                } else {
                                    //default to "some classification of permission"
                                    sqlTree.SaveNewElement(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_OTHERKEYWORD, token.PoorMansTSqlFormatterLib$Interfaces$IToken$Value);
                                }
                            } else if (System.String.startsWith(significantTokensString, "CREATE PROC") || System.String.startsWith(significantTokensString, "CREATE FUNC") || System.String.startsWith(significantTokensString, "CREATE TRIGGER ") || System.String.startsWith(significantTokensString, "CREATE VIEW ") || System.String.startsWith(significantTokensString, "ALTER PROC") || System.String.startsWith(significantTokensString, "ALTER FUNC") || System.String.startsWith(significantTokensString, "ALTER TRIGGER ") || System.String.startsWith(significantTokensString, "ALTER VIEW ")) {
                                sqlTree.ConsiderStartingNewStatement();
                                sqlTree.CurrentContainer = sqlTree.SaveNewElement(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_DDL_PROCEDURAL_BLOCK, "");
                                sqlTree.SaveNewElement(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_OTHERKEYWORD, token.PoorMansTSqlFormatterLib$Interfaces$IToken$Value);
                            } else if (PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser._CursorDetector.isMatch(significantTokensString)) {
                                sqlTree.ConsiderStartingNewStatement();
                                sqlTree.CurrentContainer = sqlTree.SaveNewElement(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CURSOR_DECLARATION, "");
                                sqlTree.SaveNewElement(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_OTHERKEYWORD, token.PoorMansTSqlFormatterLib$Interfaces$IToken$Value);
                            } else if (sqlTree.PathNameMatches$1(0, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_DDL_PROCEDURAL_BLOCK) && PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser._TriggerConditionDetector.isMatch(significantTokensString)) {
                                //horrible complicated forward-search, to avoid having to keep a different "Trigger Condition" state for Update, Insert and Delete statement-starting keywords 
                                var triggerConditions = PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser._TriggerConditionDetector.match(significantTokensString);
                                sqlTree.CurrentContainer = sqlTree.SaveNewElement(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_TRIGGER_CONDITION, "");
                                var triggerConditionType = sqlTree.SaveNewElement(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_COMPOUNDKEYWORD, "");

                                //first set the "trigger condition type": FOR, INSTEAD OF, AFTER
                                var triggerConditionTypeSimpleText = triggerConditions.getGroups().get(1).getValue();
                                triggerConditionType.PoorMansTSqlFormatterLib$ParseStructure$Node$SetAttribute(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ANAME_SIMPLETEXT, triggerConditionTypeSimpleText);
                                var triggerConditionTypeNodeCount = System.String.split(triggerConditionTypeSimpleText, System.Array.init([32], System.Char).map(function(i) {{ return String.fromCharCode(i); }})).length; //there's probably a better way of counting words...
                                this.AppendNodesWithMapping(sqlTree, tokenList.PoorMansTSqlFormatterLib$Interfaces$ITokenList$getRangeByIndex(significantTokenPositions.getItem(0), significantTokenPositions.getItem(((triggerConditionTypeNodeCount - 1) | 0))), PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_OTHERKEYWORD, triggerConditionType);

                                //then get the count of conditions (INSERT, UPDATE, DELETE) and add those too...
                                var triggerConditionNodeCount = (System.String.split(triggerConditions.getGroups().get(2).getValue(), System.Array.init([32], System.Char).map(function(i) {{ return String.fromCharCode(i); }})).length - 2) | 0; //there's probably a better way of counting words...
                                this.AppendNodesWithMapping(sqlTree, tokenList.PoorMansTSqlFormatterLib$Interfaces$ITokenList$getRangeByIndex(((significantTokenPositions.getItem(((triggerConditionTypeNodeCount - 1) | 0)) + 1) | 0), significantTokenPositions.getItem(((((triggerConditionTypeNodeCount + triggerConditionNodeCount) | 0) - 1) | 0))), PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_OTHERKEYWORD, sqlTree.CurrentContainer);
                                tokenID.v = significantTokenPositions.getItem(((((triggerConditionTypeNodeCount + triggerConditionNodeCount) | 0) - 1) | 0));
                                sqlTree.MoveToAncestorContainer$1(1, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_DDL_PROCEDURAL_BLOCK);
                            } else if (System.String.startsWith(significantTokensString, "FOR ")) {
                                sqlTree.EscapeAnyBetweenConditions();
                                sqlTree.EscapeAnySelectionTarget();
                                sqlTree.EscapeJoinCondition();

                                if (sqlTree.PathNameMatches$1(0, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CURSOR_DECLARATION)) {
                                    sqlTree.StartNewContainer(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CURSOR_FOR_BLOCK, token.PoorMansTSqlFormatterLib$Interfaces$IToken$Value, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CONTAINER_GENERALCONTENT);
                                    sqlTree.StartNewStatement();
                                } else if (sqlTree.PathNameMatches$1(0, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_SQL_CLAUSE) && sqlTree.PathNameMatches$1(1, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_SQL_STATEMENT) && sqlTree.PathNameMatches$1(2, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CONTAINER_GENERALCONTENT) && sqlTree.PathNameMatches$1(3, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CURSOR_FOR_BLOCK)) {
                                    sqlTree.MoveToAncestorContainer$1(4, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CURSOR_DECLARATION);
                                    sqlTree.StartNewContainer(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CURSOR_FOR_OPTIONS, token.PoorMansTSqlFormatterLib$Interfaces$IToken$Value, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CONTAINER_GENERALCONTENT);
                                } else {
                                    //Assume FOR clause if we're at clause level
                                    // (otherwise, eg in OPTIMIZE FOR UNKNOWN, this will just not do anything)
                                    sqlTree.ConsiderStartingNewClause();

                                    sqlTree.SaveNewElement(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_OTHERKEYWORD, token.PoorMansTSqlFormatterLib$Interfaces$IToken$Value);
                                }
                            } else if (System.String.startsWith(significantTokensString, "DECLARE ")) {
                                sqlTree.ConsiderStartingNewStatement();
                                sqlTree.CurrentContainer = sqlTree.SaveNewElement(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_DDL_DECLARE_BLOCK, "");
                                sqlTree.SaveNewElement(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_OTHERKEYWORD, token.PoorMansTSqlFormatterLib$Interfaces$IToken$Value);
                            } else if (System.String.startsWith(significantTokensString, "CREATE ") || System.String.startsWith(significantTokensString, "ALTER ")) {
                                sqlTree.ConsiderStartingNewStatement();
                                sqlTree.CurrentContainer = sqlTree.SaveNewElement(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_DDL_OTHER_BLOCK, "");
                                sqlTree.SaveNewElement(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_OTHERKEYWORD, token.PoorMansTSqlFormatterLib$Interfaces$IToken$Value);
                            } else if (System.String.startsWith(significantTokensString, "GRANT ") || System.String.startsWith(significantTokensString, "DENY ") || System.String.startsWith(significantTokensString, "REVOKE ")) {
                                if (System.String.startsWith(significantTokensString, "GRANT ") && sqlTree.PathNameMatches$1(0, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CONTAINER_GENERALCONTENT) && sqlTree.PathNameMatches$1(1, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_DDL_WITH_CLAUSE) && sqlTree.PathNameMatches$1(2, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_PERMISSIONS_BLOCK) && sqlTree.GetFirstNonWhitespaceNonCommentChildElement(sqlTree.CurrentContainer) == null) {
                                    //this MUST be a "WITH GRANT OPTION" option...
                                    sqlTree.SaveNewElement(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_OTHERKEYWORD, token.PoorMansTSqlFormatterLib$Interfaces$IToken$Value);
                                } else {
                                    sqlTree.ConsiderStartingNewStatement();
                                    sqlTree.StartNewContainer(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_PERMISSIONS_BLOCK, token.PoorMansTSqlFormatterLib$Interfaces$IToken$Value, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_PERMISSIONS_DETAIL);
                                }
                            } else if (System.String.equals(sqlTree.CurrentContainer.PoorMansTSqlFormatterLib$ParseStructure$Node$Name, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_DDL_PROCEDURAL_BLOCK) && System.String.startsWith(significantTokensString, "RETURNS ")) {
                                sqlTree.SaveNewElement$1(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_OTHERKEYWORD, token.PoorMansTSqlFormatterLib$Interfaces$IToken$Value, sqlTree.SaveNewElement(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_DDL_RETURNS, ""));
                            } else if (System.String.startsWith(significantTokensString, "AS ")) {
                                if (sqlTree.PathNameMatches$1(0, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_DDL_PROCEDURAL_BLOCK)) {
                                    var nextKeywordType = { v : new PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType() };
                                    var isDataTypeDefinition = false;
                                    if (significantTokenPositions.Count > 1 && PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.tryGetValue(PoorMansTSqlFormatterLib.BridgeUtils.ToUpperInvariant$1(System.Array.getItem(tokenList, significantTokenPositions.getItem(1), PoorMansTSqlFormatterLib.Interfaces.IToken).PoorMansTSqlFormatterLib$Interfaces$IToken$Value), nextKeywordType)) {
                                        if (nextKeywordType.v === PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.DataTypeKeyword) {
                                            isDataTypeDefinition = true;
                                        }
                                    }

                                    if (isDataTypeDefinition) {
                                        //this is actually a data type declaration (redundant "AS"...), save as regular token.
                                        sqlTree.SaveNewElement(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_OTHERKEYWORD, token.PoorMansTSqlFormatterLib$Interfaces$IToken$Value);
                                    } else {
                                        //this is the start of the object content definition
                                        sqlTree.StartNewContainer(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_DDL_AS_BLOCK, token.PoorMansTSqlFormatterLib$Interfaces$IToken$Value, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CONTAINER_GENERALCONTENT);
                                        sqlTree.StartNewStatement();
                                    }
                                } else if (sqlTree.PathNameMatches$1(0, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CONTAINER_GENERALCONTENT) && sqlTree.PathNameMatches$1(1, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_DDL_WITH_CLAUSE) && sqlTree.PathNameMatches$1(2, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_DDL_PROCEDURAL_BLOCK)) {
                                    sqlTree.MoveToAncestorContainer$1(2, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_DDL_PROCEDURAL_BLOCK);
                                    sqlTree.StartNewContainer(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_DDL_AS_BLOCK, token.PoorMansTSqlFormatterLib$Interfaces$IToken$Value, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CONTAINER_GENERALCONTENT);
                                    sqlTree.StartNewStatement();
                                } else if (sqlTree.PathNameMatches$1(0, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CTE_ALIAS) && sqlTree.PathNameMatches$1(1, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CTE_WITH_CLAUSE)) {
                                    sqlTree.MoveToAncestorContainer$1(1, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CTE_WITH_CLAUSE);
                                    sqlTree.StartNewContainer(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CTE_AS_BLOCK, token.PoorMansTSqlFormatterLib$Interfaces$IToken$Value, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CONTAINER_GENERALCONTENT);
                                } else {
                                    sqlTree.SaveNewElement(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_OTHERKEYWORD, token.PoorMansTSqlFormatterLib$Interfaces$IToken$Value);
                                }
                            } else if (System.String.startsWith(significantTokensString, "BEGIN DISTRIBUTED TRANSACTION ") || System.String.startsWith(significantTokensString, "BEGIN DISTRIBUTED TRAN ")) {
                                sqlTree.ConsiderStartingNewStatement();
                                this.ProcessCompoundKeyword$1(tokenList, sqlTree, sqlTree.SaveNewElement(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_BEGIN_TRANSACTION, ""), tokenID, significantTokenPositions, 3);
                            } else if (System.String.startsWith(significantTokensString, "BEGIN TRANSACTION ") || System.String.startsWith(significantTokensString, "BEGIN TRAN ")) {
                                sqlTree.ConsiderStartingNewStatement();
                                this.ProcessCompoundKeyword$1(tokenList, sqlTree, sqlTree.SaveNewElement(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_BEGIN_TRANSACTION, ""), tokenID, significantTokenPositions, 2);
                            } else if (System.String.startsWith(significantTokensString, "SAVE TRANSACTION ") || System.String.startsWith(significantTokensString, "SAVE TRAN ")) {
                                sqlTree.ConsiderStartingNewStatement();
                                this.ProcessCompoundKeyword$1(tokenList, sqlTree, sqlTree.SaveNewElement(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_SAVE_TRANSACTION, ""), tokenID, significantTokenPositions, 2);
                            } else if (System.String.startsWith(significantTokensString, "COMMIT TRANSACTION ") || System.String.startsWith(significantTokensString, "COMMIT TRAN ") || System.String.startsWith(significantTokensString, "COMMIT WORK ")) {
                                sqlTree.ConsiderStartingNewStatement();
                                this.ProcessCompoundKeyword$1(tokenList, sqlTree, sqlTree.SaveNewElement(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_COMMIT_TRANSACTION, ""), tokenID, significantTokenPositions, 2);
                            } else if (System.String.startsWith(significantTokensString, "COMMIT ")) {
                                sqlTree.ConsiderStartingNewStatement();
                                sqlTree.SaveNewElement$1(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_OTHERKEYWORD, token.PoorMansTSqlFormatterLib$Interfaces$IToken$Value, sqlTree.SaveNewElement(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_COMMIT_TRANSACTION, token.PoorMansTSqlFormatterLib$Interfaces$IToken$Value));
                            } else if (System.String.startsWith(significantTokensString, "ROLLBACK TRANSACTION ") || System.String.startsWith(significantTokensString, "ROLLBACK TRAN ") || System.String.startsWith(significantTokensString, "ROLLBACK WORK ")) {
                                sqlTree.ConsiderStartingNewStatement();
                                this.ProcessCompoundKeyword$1(tokenList, sqlTree, sqlTree.SaveNewElement(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_ROLLBACK_TRANSACTION, ""), tokenID, significantTokenPositions, 2);
                            } else if (System.String.startsWith(significantTokensString, "ROLLBACK ")) {
                                sqlTree.ConsiderStartingNewStatement();
                                sqlTree.SaveNewElement$1(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_OTHERKEYWORD, token.PoorMansTSqlFormatterLib$Interfaces$IToken$Value, sqlTree.SaveNewElement(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_ROLLBACK_TRANSACTION, token.PoorMansTSqlFormatterLib$Interfaces$IToken$Value));
                            } else if (System.String.startsWith(significantTokensString, "BEGIN TRY ")) {
                                sqlTree.ConsiderStartingNewStatement();
                                var newTryBlock = sqlTree.SaveNewElement(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_TRY_BLOCK, "");
                                var tryContainerOpen = sqlTree.SaveNewElement$1(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CONTAINER_OPEN, "", newTryBlock);
                                this.ProcessCompoundKeyword$1(tokenList, sqlTree, tryContainerOpen, tokenID, significantTokenPositions, 2);
                                var tryMultiContainer = sqlTree.SaveNewElement$1(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CONTAINER_MULTISTATEMENT, "", newTryBlock);
                                sqlTree.StartNewStatement$1(tryMultiContainer);
                            } else if (System.String.startsWith(significantTokensString, "BEGIN CATCH ")) {
                                sqlTree.ConsiderStartingNewStatement();
                                var newCatchBlock = sqlTree.SaveNewElement(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CATCH_BLOCK, "");
                                var catchContainerOpen = sqlTree.SaveNewElement$1(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CONTAINER_OPEN, "", newCatchBlock);
                                this.ProcessCompoundKeyword$1(tokenList, sqlTree, catchContainerOpen, tokenID, significantTokenPositions, 2);
                                var catchMultiContainer = sqlTree.SaveNewElement$1(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CONTAINER_MULTISTATEMENT, "", newCatchBlock);
                                sqlTree.StartNewStatement$1(catchMultiContainer);
                            } else if (System.String.startsWith(significantTokensString, "BEGIN ")) {
                                sqlTree.ConsiderStartingNewStatement();
                                sqlTree.StartNewContainer(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_BEGIN_END_BLOCK, token.PoorMansTSqlFormatterLib$Interfaces$IToken$Value, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CONTAINER_MULTISTATEMENT);
                                sqlTree.StartNewStatement();
                            } else if (System.String.startsWith(significantTokensString, "MERGE ")) {
                                //According to BOL, MERGE is a fully reserved keyword from compat 100 onwards, for the MERGE statement only.
                                sqlTree.ConsiderStartingNewStatement();
                                sqlTree.ConsiderStartingNewClause();
                                sqlTree.StartNewContainer(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_MERGE_CLAUSE, token.PoorMansTSqlFormatterLib$Interfaces$IToken$Value, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_MERGE_TARGET);
                            } else if (System.String.startsWith(significantTokensString, "USING ")) {
                                if (sqlTree.PathNameMatches$1(0, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_MERGE_TARGET)) {
                                    sqlTree.MoveToAncestorContainer$1(1, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_MERGE_CLAUSE);
                                    sqlTree.StartNewContainer(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_MERGE_USING, token.PoorMansTSqlFormatterLib$Interfaces$IToken$Value, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_SELECTIONTARGET);
                                } else {
                                    sqlTree.SaveNewElementWithError(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_OTHERNODE, token.PoorMansTSqlFormatterLib$Interfaces$IToken$Value);
                                }
                            } else if (System.String.startsWith(significantTokensString, "ON ")) {
                                sqlTree.EscapeAnySelectionTarget();

                                if (sqlTree.PathNameMatches$1(0, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_MERGE_USING)) {
                                    sqlTree.MoveToAncestorContainer$1(1, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_MERGE_CLAUSE);
                                    sqlTree.StartNewContainer(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_MERGE_CONDITION, token.PoorMansTSqlFormatterLib$Interfaces$IToken$Value, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CONTAINER_GENERALCONTENT);
                                } else if (!sqlTree.PathNameMatches$1(0, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_DDL_PROCEDURAL_BLOCK) && !sqlTree.PathNameMatches$1(0, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_DDL_OTHER_BLOCK) && !sqlTree.PathNameMatches$1(1, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_DDL_WITH_CLAUSE) && !sqlTree.PathNameMatches$1(0, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_EXPRESSION_PARENS) && !PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.ContentStartsWithKeyword(sqlTree.CurrentContainer, "SET")) {
                                    sqlTree.StartNewContainer(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_JOIN_ON_SECTION, token.PoorMansTSqlFormatterLib$Interfaces$IToken$Value, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CONTAINER_GENERALCONTENT);
                                } else {
                                    sqlTree.SaveNewElement(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_OTHERKEYWORD, token.PoorMansTSqlFormatterLib$Interfaces$IToken$Value);
                                }
                            } else if (System.String.startsWith(significantTokensString, "CASE ")) {
                                sqlTree.StartNewContainer(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CASE_STATEMENT, token.PoorMansTSqlFormatterLib$Interfaces$IToken$Value, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CASE_INPUT);
                            } else if (System.String.startsWith(significantTokensString, "WHEN ")) {
                                sqlTree.EscapeMergeAction();

                                if (sqlTree.PathNameMatches$1(0, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CASE_INPUT) || (sqlTree.PathNameMatches$1(0, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CONTAINER_GENERALCONTENT) && sqlTree.PathNameMatches$1(1, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CASE_THEN))) {
                                    if (sqlTree.PathNameMatches$1(0, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CASE_INPUT)) {
                                        sqlTree.MoveToAncestorContainer$1(1, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CASE_STATEMENT);
                                    } else {
                                        sqlTree.MoveToAncestorContainer$1(3, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CASE_STATEMENT);
                                    }

                                    sqlTree.StartNewContainer(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CASE_WHEN, token.PoorMansTSqlFormatterLib$Interfaces$IToken$Value, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CONTAINER_GENERALCONTENT);
                                } else if ((sqlTree.PathNameMatches$1(0, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CONTAINER_GENERALCONTENT) && sqlTree.PathNameMatches$1(1, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_MERGE_CONDITION)) || sqlTree.PathNameMatches$1(0, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_MERGE_WHEN)) {
                                    if (sqlTree.PathNameMatches$1(1, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_MERGE_CONDITION)) {
                                        sqlTree.MoveToAncestorContainer$1(2, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_MERGE_CLAUSE);
                                    } else {
                                        sqlTree.MoveToAncestorContainer$1(1, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_MERGE_CLAUSE);
                                    }

                                    sqlTree.StartNewContainer(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_MERGE_WHEN, token.PoorMansTSqlFormatterLib$Interfaces$IToken$Value, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CONTAINER_GENERALCONTENT);
                                } else {
                                    sqlTree.SaveNewElementWithError(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_OTHERNODE, token.PoorMansTSqlFormatterLib$Interfaces$IToken$Value);
                                }
                            } else if (System.String.startsWith(significantTokensString, "THEN ")) {
                                sqlTree.EscapeAnyBetweenConditions();

                                if (sqlTree.PathNameMatches$1(0, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CONTAINER_GENERALCONTENT) && sqlTree.PathNameMatches$1(1, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CASE_WHEN)) {
                                    sqlTree.MoveToAncestorContainer$1(1, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CASE_WHEN);
                                    sqlTree.StartNewContainer(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CASE_THEN, token.PoorMansTSqlFormatterLib$Interfaces$IToken$Value, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CONTAINER_GENERALCONTENT);
                                } else if (sqlTree.PathNameMatches$1(0, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CONTAINER_GENERALCONTENT) && sqlTree.PathNameMatches$1(1, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_MERGE_WHEN)) {
                                    sqlTree.MoveToAncestorContainer$1(1, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_MERGE_WHEN);
                                    sqlTree.StartNewContainer(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_MERGE_THEN, token.PoorMansTSqlFormatterLib$Interfaces$IToken$Value, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_MERGE_ACTION);
                                    sqlTree.StartNewStatement();
                                } else {
                                    sqlTree.SaveNewElementWithError(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_OTHERNODE, token.PoorMansTSqlFormatterLib$Interfaces$IToken$Value);
                                }
                            } else if (System.String.startsWith(significantTokensString, "OUTPUT ")) {
                                var isSprocArgument = false;

                                //We're looking for sproc calls - they can't be nested inside anything else (as far as I know)
                                if (sqlTree.PathNameMatches$1(0, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_SQL_CLAUSE) && sqlTree.PathNameMatches$1(1, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_SQL_STATEMENT) && (PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.ContentStartsWithKeyword(sqlTree.CurrentContainer, "EXEC") || PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.ContentStartsWithKeyword(sqlTree.CurrentContainer, "EXECUTE") || PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.ContentStartsWithKeyword(sqlTree.CurrentContainer, null))) {
                                    isSprocArgument = true;
                                }

                                //Also proc definitions - argument lists without parens
                                if (sqlTree.PathNameMatches$1(0, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_DDL_PROCEDURAL_BLOCK)) {
                                    isSprocArgument = true;
                                }

                                if (!isSprocArgument) {
                                    sqlTree.EscapeMergeAction();
                                    sqlTree.ConsiderStartingNewClause();
                                }

                                sqlTree.SaveNewElement(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_OTHERKEYWORD, token.PoorMansTSqlFormatterLib$Interfaces$IToken$Value);
                            } else if (System.String.startsWith(significantTokensString, "OPTION ")) {
                                if (sqlTree.PathNameMatches$1(0, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CONTAINER_GENERALCONTENT) && sqlTree.PathNameMatches$1(1, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_DDL_WITH_CLAUSE)) {
                                    //"OPTION" keyword here is NOT indicative of a new clause.
                                } else {
                                    sqlTree.EscapeMergeAction();
                                    sqlTree.ConsiderStartingNewClause();
                                }
                                sqlTree.SaveNewElement(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_OTHERKEYWORD, token.PoorMansTSqlFormatterLib$Interfaces$IToken$Value);
                            } else if (System.String.startsWith(significantTokensString, "END TRY ")) {
                                sqlTree.EscapeAnySingleOrPartialStatementContainers();

                                if (sqlTree.PathNameMatches$1(0, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_SQL_CLAUSE) && sqlTree.PathNameMatches$1(1, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_SQL_STATEMENT) && sqlTree.PathNameMatches$1(2, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CONTAINER_MULTISTATEMENT) && sqlTree.PathNameMatches$1(3, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_TRY_BLOCK)) {
                                    //clause.statement.multicontainer.try
                                    var tryBlock = sqlTree.CurrentContainer.PoorMansTSqlFormatterLib$ParseStructure$Node$Parent.PoorMansTSqlFormatterLib$ParseStructure$Node$Parent.PoorMansTSqlFormatterLib$ParseStructure$Node$Parent;
                                    var tryContainerClose = sqlTree.SaveNewElement$1(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CONTAINER_CLOSE, "", tryBlock);
                                    this.ProcessCompoundKeyword$1(tokenList, sqlTree, tryContainerClose, tokenID, significantTokenPositions, 2);
                                    sqlTree.CurrentContainer = tryBlock.PoorMansTSqlFormatterLib$ParseStructure$Node$Parent;
                                } else {
                                    this.ProcessCompoundKeywordWithError(tokenList, sqlTree, sqlTree.CurrentContainer, tokenID, significantTokenPositions, 2);
                                }
                            } else if (System.String.startsWith(significantTokensString, "END CATCH ")) {
                                sqlTree.EscapeAnySingleOrPartialStatementContainers();

                                if (sqlTree.PathNameMatches$1(0, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_SQL_CLAUSE) && sqlTree.PathNameMatches$1(1, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_SQL_STATEMENT) && sqlTree.PathNameMatches$1(2, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CONTAINER_MULTISTATEMENT) && sqlTree.PathNameMatches$1(3, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CATCH_BLOCK)) {
                                    //clause.statement.multicontainer.catch
                                    var catchBlock = sqlTree.CurrentContainer.PoorMansTSqlFormatterLib$ParseStructure$Node$Parent.PoorMansTSqlFormatterLib$ParseStructure$Node$Parent.PoorMansTSqlFormatterLib$ParseStructure$Node$Parent;
                                    var catchContainerClose = sqlTree.SaveNewElement$1(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CONTAINER_CLOSE, "", catchBlock);
                                    this.ProcessCompoundKeyword$1(tokenList, sqlTree, catchContainerClose, tokenID, significantTokenPositions, 2);
                                    sqlTree.CurrentContainer = catchBlock.PoorMansTSqlFormatterLib$ParseStructure$Node$Parent;
                                } else {
                                    this.ProcessCompoundKeywordWithError(tokenList, sqlTree, sqlTree.CurrentContainer, tokenID, significantTokenPositions, 2);
                                }
                            } else if (System.String.startsWith(significantTokensString, "END ")) {
                                if (sqlTree.PathNameMatches$1(0, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CONTAINER_GENERALCONTENT) && sqlTree.PathNameMatches$1(1, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CASE_THEN)) {
                                    sqlTree.MoveToAncestorContainer$1(3, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CASE_STATEMENT);
                                    sqlTree.SaveNewElement$1(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_OTHERKEYWORD, token.PoorMansTSqlFormatterLib$Interfaces$IToken$Value, sqlTree.SaveNewElement(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CONTAINER_CLOSE, ""));
                                    sqlTree.MoveToAncestorContainer(1); //unnamed container
                                } else if (sqlTree.PathNameMatches$1(0, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CONTAINER_GENERALCONTENT) && sqlTree.PathNameMatches$1(1, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CASE_ELSE)) {
                                    sqlTree.MoveToAncestorContainer$1(2, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CASE_STATEMENT);
                                    sqlTree.SaveNewElement$1(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_OTHERKEYWORD, token.PoorMansTSqlFormatterLib$Interfaces$IToken$Value, sqlTree.SaveNewElement(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CONTAINER_CLOSE, ""));
                                    sqlTree.MoveToAncestorContainer(1); //unnamed container
                                } else {
                                    //Begin/End block handling
                                    sqlTree.EscapeAnySingleOrPartialStatementContainers();

                                    if (sqlTree.PathNameMatches$1(0, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_SQL_CLAUSE) && sqlTree.PathNameMatches$1(1, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_SQL_STATEMENT) && sqlTree.PathNameMatches$1(2, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CONTAINER_MULTISTATEMENT) && sqlTree.PathNameMatches$1(3, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_BEGIN_END_BLOCK)) {
                                        var beginBlock = sqlTree.CurrentContainer.PoorMansTSqlFormatterLib$ParseStructure$Node$Parent.PoorMansTSqlFormatterLib$ParseStructure$Node$Parent.PoorMansTSqlFormatterLib$ParseStructure$Node$Parent;
                                        var beginContainerClose = sqlTree.SaveNewElement$1(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CONTAINER_CLOSE, "", beginBlock);
                                        sqlTree.SaveNewElement$1(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_OTHERKEYWORD, token.PoorMansTSqlFormatterLib$Interfaces$IToken$Value, beginContainerClose);
                                        sqlTree.CurrentContainer = beginBlock.PoorMansTSqlFormatterLib$ParseStructure$Node$Parent;
                                    } else {
                                        sqlTree.SaveNewElementWithError(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_OTHERKEYWORD, token.PoorMansTSqlFormatterLib$Interfaces$IToken$Value);
                                    }
                                }
                            } else if (System.String.startsWith(significantTokensString, "GO ")) {
                                sqlTree.EscapeAnySingleOrPartialStatementContainers();

                                if ((tokenID.v === 0 || PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.IsLineBreakingWhiteSpaceOrComment(System.Array.getItem(tokenList, ((tokenID.v - 1) | 0), PoorMansTSqlFormatterLib.Interfaces.IToken))) && this.IsFollowedByLineBreakingWhiteSpaceOrSingleLineCommentOrEnd(tokenList, tokenID.v)) {
                                    // we found a batch separator - were we supposed to?
                                    if (sqlTree.FindValidBatchEnd()) {
                                        var sqlRoot = PoorMansTSqlFormatterLib.ParseStructure.NodeExtensions.RootContainer(sqlTree);
                                        var batchSeparator = sqlTree.SaveNewElement$1(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_BATCH_SEPARATOR, "", sqlRoot);
                                        sqlTree.SaveNewElement$1(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_OTHERKEYWORD, token.PoorMansTSqlFormatterLib$Interfaces$IToken$Value, batchSeparator);
                                        sqlTree.StartNewStatement$1(sqlRoot);
                                    } else {
                                        sqlTree.SaveNewElementWithError(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_OTHERKEYWORD, token.PoorMansTSqlFormatterLib$Interfaces$IToken$Value);
                                    }
                                } else {
                                    sqlTree.SaveNewElement(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_OTHERKEYWORD, token.PoorMansTSqlFormatterLib$Interfaces$IToken$Value);
                                }
                            } else if (System.String.startsWith(significantTokensString, "EXECUTE AS ")) {
                                var executeAsInWithOptions = false;
                                if (sqlTree.PathNameMatches$1(0, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CONTAINER_GENERALCONTENT) && sqlTree.PathNameMatches$1(1, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_DDL_WITH_CLAUSE) && (this.IsLatestTokenAComma(sqlTree) || !sqlTree.HasNonWhiteSpaceNonCommentContent(sqlTree.CurrentContainer))) {
                                    executeAsInWithOptions = true;
                                }

                                if (!executeAsInWithOptions) {
                                    sqlTree.ConsiderStartingNewStatement();
                                    sqlTree.ConsiderStartingNewClause();
                                }

                                this.ProcessCompoundKeyword$1(tokenList, sqlTree, sqlTree.CurrentContainer, tokenID, significantTokenPositions, 2);
                            } else if (System.String.startsWith(significantTokensString, "EXEC ") || System.String.startsWith(significantTokensString, "EXECUTE ")) {
                                var execShouldntTryToStartNewStatement = false;

                                if (sqlTree.PathNameMatches$1(0, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_SQL_CLAUSE) && sqlTree.PathNameMatches$1(1, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_SQL_STATEMENT) && (PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.ContentStartsWithKeyword(sqlTree.CurrentContainer, "INSERT") || PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.ContentStartsWithKeyword(sqlTree.CurrentContainer, "INSERT INTO"))) {
                                    var existingClauseCount = sqlTree.CurrentContainer.PoorMansTSqlFormatterLib$ParseStructure$Node$Parent != null ? System.Linq.Enumerable.from(PoorMansTSqlFormatterLib.ParseStructure.NodeExtensions.ChildrenByName(sqlTree.CurrentContainer.PoorMansTSqlFormatterLib$ParseStructure$Node$Parent, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_SQL_CLAUSE)).count() : 0;
                                    if (existingClauseCount === 1) {
                                        execShouldntTryToStartNewStatement = true;
                                    }
                                }

                                if (!execShouldntTryToStartNewStatement) {
                                    sqlTree.ConsiderStartingNewStatement();
                                }

                                sqlTree.ConsiderStartingNewClause();

                                sqlTree.SaveNewElement(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_OTHERKEYWORD, token.PoorMansTSqlFormatterLib$Interfaces$IToken$Value);
                            } else if (PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser._JoinDetector.isMatch(significantTokensString)) {
                                sqlTree.ConsiderStartingNewClause();
                                var joinText = PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser._JoinDetector.match(significantTokensString).getValue();
                                var targetKeywordCount = System.String.split(joinText, System.Array.init([32], System.Char).map(function(i) {{ return String.fromCharCode(i); }}), null, 1).length;
                                this.ProcessCompoundKeyword$1(tokenList, sqlTree, sqlTree.CurrentContainer, tokenID, significantTokenPositions, targetKeywordCount);
                                sqlTree.CurrentContainer = sqlTree.SaveNewElement(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_SELECTIONTARGET, "");
                            } else if (System.String.startsWith(significantTokensString, "UNION ALL ")) {
                                sqlTree.ConsiderStartingNewClause();
                                this.ProcessCompoundKeyword$1(tokenList, sqlTree, sqlTree.SaveNewElement(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_SET_OPERATOR_CLAUSE, ""), tokenID, significantTokenPositions, 2);
                            } else if (System.String.startsWith(significantTokensString, "UNION ") || System.String.startsWith(significantTokensString, "INTERSECT ") || System.String.startsWith(significantTokensString, "EXCEPT ")) {
                                sqlTree.ConsiderStartingNewClause();
                                var unionClause = sqlTree.SaveNewElement(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_SET_OPERATOR_CLAUSE, "");
                                sqlTree.SaveNewElement$1(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_OTHERKEYWORD, token.PoorMansTSqlFormatterLib$Interfaces$IToken$Value, unionClause);
                            } else if (System.String.startsWith(significantTokensString, "WHILE ")) {
                                sqlTree.ConsiderStartingNewStatement();
                                var newWhileLoop = sqlTree.SaveNewElement(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_WHILE_LOOP, "");
                                var whileContainerOpen = sqlTree.SaveNewElement$1(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CONTAINER_OPEN, "", newWhileLoop);
                                sqlTree.SaveNewElement$1(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_OTHERKEYWORD, token.PoorMansTSqlFormatterLib$Interfaces$IToken$Value, whileContainerOpen);
                                sqlTree.CurrentContainer = sqlTree.SaveNewElement$1(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_BOOLEAN_EXPRESSION, "", newWhileLoop);
                            } else if (System.String.startsWith(significantTokensString, "IF ")) {
                                sqlTree.ConsiderStartingNewStatement();
                                sqlTree.StartNewContainer(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_IF_STATEMENT, token.PoorMansTSqlFormatterLib$Interfaces$IToken$Value, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_BOOLEAN_EXPRESSION);
                            } else if (System.String.startsWith(significantTokensString, "ELSE ")) {
                                sqlTree.EscapeAnyBetweenConditions();
                                sqlTree.EscapeAnySelectionTarget();
                                sqlTree.EscapeJoinCondition();

                                if (sqlTree.PathNameMatches$1(0, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CONTAINER_GENERALCONTENT) && sqlTree.PathNameMatches$1(1, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CASE_THEN)) {
                                    sqlTree.MoveToAncestorContainer$1(3, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CASE_STATEMENT);
                                    sqlTree.StartNewContainer(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CASE_ELSE, token.PoorMansTSqlFormatterLib$Interfaces$IToken$Value, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CONTAINER_GENERALCONTENT);
                                } else {
                                    sqlTree.EscapePartialStatementContainers();

                                    if (sqlTree.PathNameMatches$1(0, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_SQL_CLAUSE) && sqlTree.PathNameMatches$1(1, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_SQL_STATEMENT) && sqlTree.PathNameMatches$1(2, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CONTAINER_SINGLESTATEMENT)) {
                                        //we need to pop up the single-statement containers stack to the next "if" that doesn't have an "else" (if any; else error).
                                        // LOCAL SEARCH - we're not actually changing the "CurrentContainer" until we decide to start a statement.
                                        var currentNode = sqlTree.CurrentContainer.PoorMansTSqlFormatterLib$ParseStructure$Node$Parent.PoorMansTSqlFormatterLib$ParseStructure$Node$Parent;
                                        var stopSearching = false;
                                        while (!stopSearching) {
                                            if (sqlTree.PathNameMatches(currentNode, 1, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_IF_STATEMENT)) {
                                                //if this is in an "If", then the "Else" must still be available - yay!
                                                sqlTree.CurrentContainer = currentNode.PoorMansTSqlFormatterLib$ParseStructure$Node$Parent;
                                                sqlTree.StartNewContainer(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_ELSE_CLAUSE, token.PoorMansTSqlFormatterLib$Interfaces$IToken$Value, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CONTAINER_SINGLESTATEMENT);
                                                sqlTree.StartNewStatement();
                                                stopSearching = true;
                                            } else if (sqlTree.PathNameMatches(currentNode, 1, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_ELSE_CLAUSE)) {
                                                //If this is in an "Else", we should skip its parent "IF" altogether, and go to the next singlestatementcontainer candidate.
                                                //singlestatementcontainer.else.if.clause.statement.NEWCANDIDATE
                                                currentNode = currentNode.PoorMansTSqlFormatterLib$ParseStructure$Node$Parent.PoorMansTSqlFormatterLib$ParseStructure$Node$Parent.PoorMansTSqlFormatterLib$ParseStructure$Node$Parent.PoorMansTSqlFormatterLib$ParseStructure$Node$Parent.PoorMansTSqlFormatterLib$ParseStructure$Node$Parent;
                                            } else if (sqlTree.PathNameMatches(currentNode, 1, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_WHILE_LOOP)) {
                                                //If this is in a "While", we should skip to the next singlestatementcontainer candidate.
                                                //singlestatementcontainer.while.clause.statement.NEWCANDIDATE
                                                currentNode = currentNode.PoorMansTSqlFormatterLib$ParseStructure$Node$Parent.PoorMansTSqlFormatterLib$ParseStructure$Node$Parent.PoorMansTSqlFormatterLib$ParseStructure$Node$Parent.PoorMansTSqlFormatterLib$ParseStructure$Node$Parent;
                                            } else {
                                                //if this isn't a known single-statement container, then we're lost.
                                                sqlTree.SaveNewElementWithError(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_OTHERKEYWORD, token.PoorMansTSqlFormatterLib$Interfaces$IToken$Value);
                                                stopSearching = true;
                                            }
                                        }
                                    } else {
                                        sqlTree.SaveNewElementWithError(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_OTHERKEYWORD, token.PoorMansTSqlFormatterLib$Interfaces$IToken$Value);
                                    }
                                }
                            } else if (System.String.startsWith(significantTokensString, "INSERT INTO ")) {
                                sqlTree.ConsiderStartingNewStatement();
                                sqlTree.ConsiderStartingNewClause();
                                this.ProcessCompoundKeyword$1(tokenList, sqlTree, sqlTree.CurrentContainer, tokenID, significantTokenPositions, 2);
                            } else if (System.String.startsWith(significantTokensString, "NATIONAL CHARACTER VARYING ")) {
                                this.ProcessCompoundKeyword$1(tokenList, sqlTree, sqlTree.CurrentContainer, tokenID, significantTokenPositions, 3);
                            } else if (System.String.startsWith(significantTokensString, "NATIONAL CHAR VARYING ")) {
                                this.ProcessCompoundKeyword$1(tokenList, sqlTree, sqlTree.CurrentContainer, tokenID, significantTokenPositions, 3);
                            } else if (System.String.startsWith(significantTokensString, "BINARY VARYING ")) {
                                //TODO: Figure out how to handle "Compound Keyword Datatypes" so they are still correctly highlighted
                                this.ProcessCompoundKeyword$1(tokenList, sqlTree, sqlTree.CurrentContainer, tokenID, significantTokenPositions, 2);
                            } else if (System.String.startsWith(significantTokensString, "CHAR VARYING ")) {
                                this.ProcessCompoundKeyword$1(tokenList, sqlTree, sqlTree.CurrentContainer, tokenID, significantTokenPositions, 2);
                            } else if (System.String.startsWith(significantTokensString, "CHARACTER VARYING ")) {
                                this.ProcessCompoundKeyword$1(tokenList, sqlTree, sqlTree.CurrentContainer, tokenID, significantTokenPositions, 2);
                            } else if (System.String.startsWith(significantTokensString, "DOUBLE PRECISION ")) {
                                this.ProcessCompoundKeyword$1(tokenList, sqlTree, sqlTree.CurrentContainer, tokenID, significantTokenPositions, 2);
                            } else if (System.String.startsWith(significantTokensString, "NATIONAL CHARACTER ")) {
                                this.ProcessCompoundKeyword$1(tokenList, sqlTree, sqlTree.CurrentContainer, tokenID, significantTokenPositions, 2);
                            } else if (System.String.startsWith(significantTokensString, "NATIONAL CHAR ")) {
                                this.ProcessCompoundKeyword$1(tokenList, sqlTree, sqlTree.CurrentContainer, tokenID, significantTokenPositions, 2);
                            } else if (System.String.startsWith(significantTokensString, "NATIONAL TEXT ")) {
                                this.ProcessCompoundKeyword$1(tokenList, sqlTree, sqlTree.CurrentContainer, tokenID, significantTokenPositions, 2);
                            } else if (System.String.startsWith(significantTokensString, "INSERT ")) {
                                sqlTree.ConsiderStartingNewStatement();
                                sqlTree.ConsiderStartingNewClause();
                                sqlTree.SaveNewElement(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_OTHERKEYWORD, token.PoorMansTSqlFormatterLib$Interfaces$IToken$Value);
                            } else if (System.String.startsWith(significantTokensString, "BULK INSERT ")) {
                                sqlTree.ConsiderStartingNewStatement();
                                sqlTree.ConsiderStartingNewClause();
                                this.ProcessCompoundKeyword$1(tokenList, sqlTree, sqlTree.CurrentContainer, tokenID, significantTokenPositions, 2);
                            } else if (System.String.startsWith(significantTokensString, "SELECT ")) {
                                if (sqlTree.NewStatementDue) {
                                    sqlTree.ConsiderStartingNewStatement();
                                }

                                var selectShouldntTryToStartNewStatement = false;

                                if (sqlTree.PathNameMatches$1(0, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_SQL_CLAUSE)) {
                                    var firstStatementClause = sqlTree.GetFirstNonWhitespaceNonCommentChildElement(sqlTree.CurrentContainer.PoorMansTSqlFormatterLib$ParseStructure$Node$Parent);

                                    var isPrecededByInsertStatement = false;
                                    $t = Bridge.getEnumerator(PoorMansTSqlFormatterLib.ParseStructure.NodeExtensions.ChildrenByName(sqlTree.CurrentContainer.PoorMansTSqlFormatterLib$ParseStructure$Node$Parent, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_SQL_CLAUSE), PoorMansTSqlFormatterLib.ParseStructure.Node);
                                    try {
                                        while ($t.moveNext()) {
                                            var clause = $t.Current;
                                            if (PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.ContentStartsWithKeyword(clause, "INSERT")) {
                                                isPrecededByInsertStatement = true;
                                            }
                                        }
                                    } finally {
                                        if (Bridge.is($t, System.IDisposable)) {
                                            $t.System$IDisposable$dispose();
                                        }
                                    }
                                    if (isPrecededByInsertStatement) {
                                        var existingSelectClauseFound = false;
                                        $t1 = Bridge.getEnumerator(PoorMansTSqlFormatterLib.ParseStructure.NodeExtensions.ChildrenByName(sqlTree.CurrentContainer.PoorMansTSqlFormatterLib$ParseStructure$Node$Parent, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_SQL_CLAUSE), PoorMansTSqlFormatterLib.ParseStructure.Node);
                                        try {
                                            while ($t1.moveNext()) {
                                                var clause1 = $t1.Current;
                                                if (PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.ContentStartsWithKeyword(clause1, "SELECT")) {
                                                    existingSelectClauseFound = true;
                                                }
                                            }
                                        } finally {
                                            if (Bridge.is($t1, System.IDisposable)) {
                                                $t1.System$IDisposable$dispose();
                                            }
                                        }
                                        var existingValuesClauseFound = false;
                                        $t2 = Bridge.getEnumerator(PoorMansTSqlFormatterLib.ParseStructure.NodeExtensions.ChildrenByName(sqlTree.CurrentContainer.PoorMansTSqlFormatterLib$ParseStructure$Node$Parent, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_SQL_CLAUSE), PoorMansTSqlFormatterLib.ParseStructure.Node);
                                        try {
                                            while ($t2.moveNext()) {
                                                var clause2 = $t2.Current;
                                                if (PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.ContentStartsWithKeyword(clause2, "VALUES")) {
                                                    existingValuesClauseFound = true;
                                                }
                                            }
                                        } finally {
                                            if (Bridge.is($t2, System.IDisposable)) {
                                                $t2.System$IDisposable$dispose();
                                            }
                                        }
                                        var existingExecClauseFound = false;
                                        $t3 = Bridge.getEnumerator(PoorMansTSqlFormatterLib.ParseStructure.NodeExtensions.ChildrenByName(sqlTree.CurrentContainer.PoorMansTSqlFormatterLib$ParseStructure$Node$Parent, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_SQL_CLAUSE), PoorMansTSqlFormatterLib.ParseStructure.Node);
                                        try {
                                            while ($t3.moveNext()) {
                                                var clause3 = $t3.Current;
                                                if (PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.ContentStartsWithKeyword(clause3, "EXEC") || PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.ContentStartsWithKeyword(clause3, "EXECUTE")) {
                                                    existingExecClauseFound = true;
                                                }
                                            }
                                        } finally {
                                            if (Bridge.is($t3, System.IDisposable)) {
                                                $t3.System$IDisposable$dispose();
                                            }
                                        }
                                        if (!existingSelectClauseFound && !existingValuesClauseFound && !existingExecClauseFound) {
                                            selectShouldntTryToStartNewStatement = true;
                                        }
                                    }

                                    var firstEntryOfThisClause = sqlTree.GetFirstNonWhitespaceNonCommentChildElement(sqlTree.CurrentContainer);
                                    if (firstEntryOfThisClause != null && System.String.equals(firstEntryOfThisClause.PoorMansTSqlFormatterLib$ParseStructure$Node$Name, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_SET_OPERATOR_CLAUSE)) {
                                        selectShouldntTryToStartNewStatement = true;
                                    }
                                }

                                if (!selectShouldntTryToStartNewStatement) {
                                    sqlTree.ConsiderStartingNewStatement();
                                }

                                sqlTree.ConsiderStartingNewClause();

                                sqlTree.SaveNewElement(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_OTHERKEYWORD, token.PoorMansTSqlFormatterLib$Interfaces$IToken$Value);
                            } else if (System.String.startsWith(significantTokensString, "UPDATE ")) {
                                if (sqlTree.NewStatementDue) {
                                    sqlTree.ConsiderStartingNewStatement();
                                }

                                if (!(sqlTree.PathNameMatches$1(0, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CONTAINER_GENERALCONTENT) && sqlTree.PathNameMatches$1(1, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CURSOR_FOR_OPTIONS))) {
                                    sqlTree.ConsiderStartingNewStatement();
                                    sqlTree.ConsiderStartingNewClause();
                                }

                                sqlTree.SaveNewElement(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_OTHERKEYWORD, token.PoorMansTSqlFormatterLib$Interfaces$IToken$Value);
                            } else if (System.String.startsWith(significantTokensString, "TO ")) {
                                if (sqlTree.PathNameMatches$1(0, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CONTAINER_GENERALCONTENT) && sqlTree.PathNameMatches$1(1, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_PERMISSIONS_TARGET)) {
                                    sqlTree.MoveToAncestorContainer$1(2, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_PERMISSIONS_BLOCK);
                                    sqlTree.StartNewContainer(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_PERMISSIONS_RECIPIENT, token.PoorMansTSqlFormatterLib$Interfaces$IToken$Value, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CONTAINER_GENERALCONTENT);
                                } else {
                                    //I don't currently know whether there is any other place where "TO" can be used in T-SQL...
                                    // TODO: look into that.
                                    // -> for now, we'll just save as a random keyword without raising an error.
                                    sqlTree.SaveNewElement(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_OTHERKEYWORD, token.PoorMansTSqlFormatterLib$Interfaces$IToken$Value);
                                }
                            } else if (System.String.startsWith(significantTokensString, "FROM ")) {
                                if (sqlTree.PathNameMatches$1(0, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CONTAINER_GENERALCONTENT) && sqlTree.PathNameMatches$1(1, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_PERMISSIONS_TARGET)) {
                                    sqlTree.MoveToAncestorContainer$1(2, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_PERMISSIONS_BLOCK);
                                    sqlTree.StartNewContainer(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_PERMISSIONS_RECIPIENT, token.PoorMansTSqlFormatterLib$Interfaces$IToken$Value, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CONTAINER_GENERALCONTENT);
                                } else {
                                    sqlTree.ConsiderStartingNewClause();
                                    sqlTree.SaveNewElement(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_OTHERKEYWORD, token.PoorMansTSqlFormatterLib$Interfaces$IToken$Value);
                                    sqlTree.CurrentContainer = sqlTree.SaveNewElement(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_SELECTIONTARGET, "");
                                }
                            } else if (System.String.startsWith(significantTokensString, "CASCADE ") && sqlTree.PathNameMatches$1(0, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CONTAINER_GENERALCONTENT) && sqlTree.PathNameMatches$1(1, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_PERMISSIONS_RECIPIENT)) {
                                sqlTree.MoveToAncestorContainer$1(2, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_PERMISSIONS_BLOCK);
                                sqlTree.CurrentContainer = sqlTree.SaveNewElement$1(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CONTAINER_GENERALCONTENT, "", sqlTree.SaveNewElement(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_DDL_WITH_CLAUSE, ""));
                                sqlTree.SaveNewElement(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_OTHERKEYWORD, token.PoorMansTSqlFormatterLib$Interfaces$IToken$Value);
                            } else if (System.String.startsWith(significantTokensString, "SET ")) {
                                var firstNonCommentSibling2 = sqlTree.GetFirstNonWhitespaceNonCommentChildElement(sqlTree.CurrentContainer);
                                if (!(firstNonCommentSibling2 != null && System.String.equals(firstNonCommentSibling2.PoorMansTSqlFormatterLib$ParseStructure$Node$Name, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_OTHERKEYWORD) && System.String.startsWith(PoorMansTSqlFormatterLib.BridgeUtils.ToUpperInvariant$1(firstNonCommentSibling2.PoorMansTSqlFormatterLib$ParseStructure$Node$TextValue), "UPDATE"))) {
                                    sqlTree.ConsiderStartingNewStatement();
                                }

                                sqlTree.ConsiderStartingNewClause();
                                sqlTree.SaveNewElement(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_OTHERKEYWORD, token.PoorMansTSqlFormatterLib$Interfaces$IToken$Value);
                            } else if (System.String.startsWith(significantTokensString, "BETWEEN ")) {
                                sqlTree.CurrentContainer = sqlTree.SaveNewElement(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_BETWEEN_CONDITION, "");
                                sqlTree.SaveNewElement$1(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_OTHERKEYWORD, token.PoorMansTSqlFormatterLib$Interfaces$IToken$Value, sqlTree.SaveNewElement(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CONTAINER_OPEN, ""));
                                sqlTree.CurrentContainer = sqlTree.SaveNewElement(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_BETWEEN_LOWERBOUND, "");
                            } else if (System.String.startsWith(significantTokensString, "AND ")) {
                                if (sqlTree.PathNameMatches$1(0, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_BETWEEN_LOWERBOUND)) {
                                    sqlTree.MoveToAncestorContainer$1(1, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_BETWEEN_CONDITION);
                                    sqlTree.SaveNewElement$1(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_OTHERKEYWORD, token.PoorMansTSqlFormatterLib$Interfaces$IToken$Value, sqlTree.SaveNewElement(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CONTAINER_CLOSE, ""));
                                    sqlTree.CurrentContainer = sqlTree.SaveNewElement(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_BETWEEN_UPPERBOUND, "");
                                } else {
                                    sqlTree.EscapeAnyBetweenConditions();
                                    sqlTree.SaveNewElement$1(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_OTHERKEYWORD, token.PoorMansTSqlFormatterLib$Interfaces$IToken$Value, sqlTree.SaveNewElement(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_AND_OPERATOR, ""));
                                }
                            } else if (System.String.startsWith(significantTokensString, "OR ")) {
                                sqlTree.EscapeAnyBetweenConditions();
                                sqlTree.SaveNewElement$1(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_OTHERKEYWORD, token.PoorMansTSqlFormatterLib$Interfaces$IToken$Value, sqlTree.SaveNewElement(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_OR_OPERATOR, ""));
                            } else if (System.String.startsWith(significantTokensString, "WITH ")) {
                                if (sqlTree.NewStatementDue) {
                                    sqlTree.ConsiderStartingNewStatement();
                                }

                                if (sqlTree.PathNameMatches$1(0, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_SQL_CLAUSE) && sqlTree.PathNameMatches$1(1, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_SQL_STATEMENT) && !sqlTree.HasNonWhiteSpaceNonCommentContent(sqlTree.CurrentContainer)) {
                                    sqlTree.CurrentContainer = sqlTree.SaveNewElement(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CTE_WITH_CLAUSE, "");
                                    sqlTree.SaveNewElement$1(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_OTHERKEYWORD, token.PoorMansTSqlFormatterLib$Interfaces$IToken$Value, sqlTree.SaveNewElement(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CONTAINER_OPEN, ""));
                                    sqlTree.CurrentContainer = sqlTree.SaveNewElement(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CTE_ALIAS, "");
                                } else if (sqlTree.PathNameMatches$1(0, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CONTAINER_GENERALCONTENT) && sqlTree.PathNameMatches$1(1, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_PERMISSIONS_RECIPIENT)) {
                                    sqlTree.MoveToAncestorContainer$1(2, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_PERMISSIONS_BLOCK);
                                    sqlTree.StartNewContainer(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_DDL_WITH_CLAUSE, token.PoorMansTSqlFormatterLib$Interfaces$IToken$Value, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CONTAINER_GENERALCONTENT);
                                } else if (sqlTree.PathNameMatches$1(0, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_DDL_PROCEDURAL_BLOCK) || sqlTree.PathNameMatches$1(0, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_DDL_OTHER_BLOCK)) {
                                    sqlTree.StartNewContainer(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_DDL_WITH_CLAUSE, token.PoorMansTSqlFormatterLib$Interfaces$IToken$Value, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CONTAINER_GENERALCONTENT);
                                } else if (sqlTree.PathNameMatches$1(0, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_SELECTIONTARGET)) {
                                    sqlTree.SaveNewElement(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_OTHERKEYWORD, token.PoorMansTSqlFormatterLib$Interfaces$IToken$Value);
                                } else {
                                    sqlTree.ConsiderStartingNewClause();
                                    sqlTree.SaveNewElement(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_OTHERKEYWORD, token.PoorMansTSqlFormatterLib$Interfaces$IToken$Value);
                                }
                            } else if (System.Array.getCount(tokenList, PoorMansTSqlFormatterLib.Interfaces.IToken) > ((tokenID.v + 1) | 0) && System.Array.getItem(tokenList, ((tokenID.v + 1) | 0), PoorMansTSqlFormatterLib.Interfaces.IToken).PoorMansTSqlFormatterLib$Interfaces$IToken$Type === PoorMansTSqlFormatterLib.Interfaces.SqlTokenType.Colon && !(System.Array.getCount(tokenList, PoorMansTSqlFormatterLib.Interfaces.IToken) > ((tokenID.v + 2) | 0) && System.Array.getItem(tokenList, ((tokenID.v + 2) | 0), PoorMansTSqlFormatterLib.Interfaces.IToken).PoorMansTSqlFormatterLib$Interfaces$IToken$Type === PoorMansTSqlFormatterLib.Interfaces.SqlTokenType.Colon)) {
                                sqlTree.ConsiderStartingNewStatement();
                                sqlTree.SaveNewElement(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_LABEL, System.String.concat(token.PoorMansTSqlFormatterLib$Interfaces$IToken$Value, System.Array.getItem(tokenList, ((tokenID.v + 1) | 0), PoorMansTSqlFormatterLib.Interfaces.IToken).PoorMansTSqlFormatterLib$Interfaces$IToken$Value));
                                tokenID.v = (tokenID.v + 1) | 0;
                            } else {
                                //miscellaneous single-word tokens, which may or may not be statement starters and/or clause starters

                                //check for statements starting...
                                if (PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.IsStatementStarter(token) || sqlTree.NewStatementDue) {
                                    sqlTree.ConsiderStartingNewStatement();
                                }

                                //check for statements starting...
                                if (PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.IsClauseStarter(token)) {
                                    sqlTree.ConsiderStartingNewClause();
                                }

                                var newNodeName = PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_OTHERNODE;
                                var matchedKeywordType = { v : new PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType() };
                                if (PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordList.tryGetValue(PoorMansTSqlFormatterLib.BridgeUtils.ToUpperInvariant$1(token.PoorMansTSqlFormatterLib$Interfaces$IToken$Value), matchedKeywordType)) {
                                    switch (matchedKeywordType.v) {
                                        case PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OperatorKeyword: 
                                            newNodeName = PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_ALPHAOPERATOR;
                                            break;
                                        case PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.FunctionKeyword: 
                                            newNodeName = PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_FUNCTION_KEYWORD;
                                            break;
                                        case PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.DataTypeKeyword: 
                                            newNodeName = PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_DATATYPE_KEYWORD;
                                            break;
                                        case PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser.KeywordType.OtherKeyword: 
                                            sqlTree.EscapeAnySelectionTarget();
                                            newNodeName = PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_OTHERKEYWORD;
                                            break;
                                        default: 
                                            throw new System.Exception("Unrecognized Keyword Type!");
                                    }
                                }

                                sqlTree.SaveNewElement(newNodeName, token.PoorMansTSqlFormatterLib$Interfaces$IToken$Value);
                            }
                            break;
                        case PoorMansTSqlFormatterLib.Interfaces.SqlTokenType.Semicolon: 
                            sqlTree.SaveNewElement(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_SEMICOLON, token.PoorMansTSqlFormatterLib$Interfaces$IToken$Value);
                            sqlTree.NewStatementDue = true;
                            break;
                        case PoorMansTSqlFormatterLib.Interfaces.SqlTokenType.Colon: 
                            if (System.Array.getCount(tokenList, PoorMansTSqlFormatterLib.Interfaces.IToken) > ((tokenID.v + 1) | 0) && System.Array.getItem(tokenList, ((tokenID.v + 1) | 0), PoorMansTSqlFormatterLib.Interfaces.IToken).PoorMansTSqlFormatterLib$Interfaces$IToken$Type === PoorMansTSqlFormatterLib.Interfaces.SqlTokenType.Colon) {
                                sqlTree.SaveNewElement(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_SCOPERESOLUTIONOPERATOR, System.String.concat(token.PoorMansTSqlFormatterLib$Interfaces$IToken$Value, System.Array.getItem(tokenList, ((tokenID.v + 1) | 0), PoorMansTSqlFormatterLib.Interfaces.IToken).PoorMansTSqlFormatterLib$Interfaces$IToken$Value));
                                tokenID.v = (tokenID.v + 1) | 0;
                            } else if (System.Array.getCount(tokenList, PoorMansTSqlFormatterLib.Interfaces.IToken) > ((tokenID.v + 1) | 0) && System.Array.getItem(tokenList, ((tokenID.v + 1) | 0), PoorMansTSqlFormatterLib.Interfaces.IToken).PoorMansTSqlFormatterLib$Interfaces$IToken$Type === PoorMansTSqlFormatterLib.Interfaces.SqlTokenType.OtherNode) {
                                //This SHOULD never happen in valid T-SQL, but can happen in DB2 or NexusDB or PostgreSQL 
                                // code (host variables) - so be nice and handle it anyway.
                                sqlTree.SaveNewElement(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_OTHERNODE, System.String.concat(token.PoorMansTSqlFormatterLib$Interfaces$IToken$Value, System.Array.getItem(tokenList, ((tokenID.v + 1) | 0), PoorMansTSqlFormatterLib.Interfaces.IToken).PoorMansTSqlFormatterLib$Interfaces$IToken$Value));
                                tokenID.v = (tokenID.v + 1) | 0;
                            } else {
                                sqlTree.SaveNewElementWithError(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_OTHEROPERATOR, token.PoorMansTSqlFormatterLib$Interfaces$IToken$Value);
                            }
                            break;
                        case PoorMansTSqlFormatterLib.Interfaces.SqlTokenType.Comma: 
                            var isCTESplitter = (sqlTree.PathNameMatches$1(0, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CONTAINER_GENERALCONTENT) && sqlTree.PathNameMatches$1(1, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CTE_WITH_CLAUSE));
                            sqlTree.SaveNewElement(this.GetEquivalentSqlNodeName(token.PoorMansTSqlFormatterLib$Interfaces$IToken$Type), token.PoorMansTSqlFormatterLib$Interfaces$IToken$Value);
                            if (isCTESplitter) {
                                sqlTree.MoveToAncestorContainer$1(1, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CTE_WITH_CLAUSE);
                                sqlTree.CurrentContainer = sqlTree.SaveNewElement(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CTE_ALIAS, "");
                            }
                            break;
                        case PoorMansTSqlFormatterLib.Interfaces.SqlTokenType.EqualsSign: 
                            sqlTree.SaveNewElement(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_EQUALSSIGN, token.PoorMansTSqlFormatterLib$Interfaces$IToken$Value);
                            if (sqlTree.PathNameMatches$1(0, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_DDL_DECLARE_BLOCK)) {
                                sqlTree.CurrentContainer = sqlTree.SaveNewElement(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CONTAINER_GENERALCONTENT, "");
                            }
                            break;
                        case PoorMansTSqlFormatterLib.Interfaces.SqlTokenType.MultiLineComment: 
                        case PoorMansTSqlFormatterLib.Interfaces.SqlTokenType.SingleLineComment: 
                        case PoorMansTSqlFormatterLib.Interfaces.SqlTokenType.SingleLineCommentCStyle: 
                        case PoorMansTSqlFormatterLib.Interfaces.SqlTokenType.WhiteSpace: 
                            //create in statement rather than clause if there are no siblings yet
                            if (sqlTree.PathNameMatches$1(0, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_SQL_CLAUSE) && sqlTree.PathNameMatches$1(1, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_SQL_STATEMENT) && !System.Linq.Enumerable.from(sqlTree.CurrentContainer.PoorMansTSqlFormatterLib$ParseStructure$Node$Children).any()) {
                                sqlTree.SaveNewElementAsPriorSibling(this.GetEquivalentSqlNodeName(token.PoorMansTSqlFormatterLib$Interfaces$IToken$Type), token.PoorMansTSqlFormatterLib$Interfaces$IToken$Value, sqlTree.CurrentContainer);
                            } else {
                                sqlTree.SaveNewElement(this.GetEquivalentSqlNodeName(token.PoorMansTSqlFormatterLib$Interfaces$IToken$Type), token.PoorMansTSqlFormatterLib$Interfaces$IToken$Value);
                            }
                            break;
                        case PoorMansTSqlFormatterLib.Interfaces.SqlTokenType.BracketQuotedName: 
                        case PoorMansTSqlFormatterLib.Interfaces.SqlTokenType.Asterisk: 
                        case PoorMansTSqlFormatterLib.Interfaces.SqlTokenType.Period: 
                        case PoorMansTSqlFormatterLib.Interfaces.SqlTokenType.OtherOperator: 
                        case PoorMansTSqlFormatterLib.Interfaces.SqlTokenType.NationalString: 
                        case PoorMansTSqlFormatterLib.Interfaces.SqlTokenType.String: 
                        case PoorMansTSqlFormatterLib.Interfaces.SqlTokenType.QuotedString: 
                        case PoorMansTSqlFormatterLib.Interfaces.SqlTokenType.Number: 
                        case PoorMansTSqlFormatterLib.Interfaces.SqlTokenType.BinaryValue: 
                        case PoorMansTSqlFormatterLib.Interfaces.SqlTokenType.MonetaryValue: 
                        case PoorMansTSqlFormatterLib.Interfaces.SqlTokenType.PseudoName: 
                            sqlTree.SaveNewElement(this.GetEquivalentSqlNodeName(token.PoorMansTSqlFormatterLib$Interfaces$IToken$Type), token.PoorMansTSqlFormatterLib$Interfaces$IToken$Value);
                            break;
                        default: 
                            throw new System.Exception("Unrecognized element encountered!");
                    }

                    tokenID.v = (tokenID.v + 1) | 0;
                }

                if (tokenList.PoorMansTSqlFormatterLib$Interfaces$ITokenList$HasUnfinishedToken) {
                    sqlTree.SetError();
                }

                if (!sqlTree.FindValidBatchEnd()) {
                    sqlTree.SetError();
                }

                return sqlTree;
            },
            ProcessCompoundKeywordWithError: function (tokenList, sqlTree, currentContainerElement, tokenID, significantTokenPositions, keywordCount) {
                this.ProcessCompoundKeyword$1(tokenList, sqlTree, currentContainerElement, tokenID, significantTokenPositions, keywordCount);
                sqlTree.SetError();
            },
            ProcessCompoundKeyword$1: function (tokenList, sqlTree, targetContainer, tokenID, significantTokenPositions, keywordCount) {
                var compoundKeyword = sqlTree.SaveNewElement$1(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_COMPOUNDKEYWORD, "", targetContainer);
                var targetText = System.String.trimEnd(this.ExtractTokensString(tokenList, significantTokenPositions.getRange(0, keywordCount)));
                compoundKeyword.PoorMansTSqlFormatterLib$ParseStructure$Node$SetAttribute(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ANAME_SIMPLETEXT, targetText);
                this.AppendNodesWithMapping(sqlTree, tokenList.PoorMansTSqlFormatterLib$Interfaces$ITokenList$getRangeByIndex(significantTokenPositions.getItem(0), significantTokenPositions.getItem(((keywordCount - 1) | 0))), PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_OTHERKEYWORD, compoundKeyword);
                tokenID.v = significantTokenPositions.getItem(((keywordCount - 1) | 0));
            },
            ProcessCompoundKeyword: function (sqlTree, newElementName, tokenID, currentContainerElement, compoundKeywordCount, compoundKeywordTokenCounts, compoundKeywordRawStrings) {
                var newElement = PoorMansTSqlFormatterLib.ParseStructure.NodeFactory.CreateNode(newElementName, this.GetCompoundKeyword(tokenID, compoundKeywordCount, compoundKeywordTokenCounts, compoundKeywordRawStrings));
                sqlTree.CurrentContainer.PoorMansTSqlFormatterLib$ParseStructure$Node$AddChild(newElement);
                return newElement;
            },
            AppendNodesWithMapping: function (sqlTree, tokens, otherTokenMappingName, targetContainer) {
                var $t;
                $t = Bridge.getEnumerator(tokens, PoorMansTSqlFormatterLib.Interfaces.IToken);
                try {
                    while ($t.moveNext()) {
                        var token = $t.Current;
                        var elementName;
                        if (token.PoorMansTSqlFormatterLib$Interfaces$IToken$Type === PoorMansTSqlFormatterLib.Interfaces.SqlTokenType.OtherNode) {
                            elementName = otherTokenMappingName;
                        } else {
                            elementName = this.GetEquivalentSqlNodeName(token.PoorMansTSqlFormatterLib$Interfaces$IToken$Type);
                        }

                        sqlTree.SaveNewElement$1(elementName, token.PoorMansTSqlFormatterLib$Interfaces$IToken$Value, targetContainer);
                    }
                } finally {
                    if (Bridge.is($t, System.IDisposable)) {
                        $t.System$IDisposable$dispose();
                    }
                }},
            ExtractTokensString: function (tokenList, significantTokenPositions) {
                var $t;
                var keywordSB = new System.Text.StringBuilder();
                $t = Bridge.getEnumerator(significantTokenPositions, System.Int32);
                try {
                    while ($t.moveNext()) {
                        var tokenPos = $t.Current;
                        //grr, this could be more elegant.
                        if (System.Array.getItem(tokenList, tokenPos, PoorMansTSqlFormatterLib.Interfaces.IToken).PoorMansTSqlFormatterLib$Interfaces$IToken$Type === PoorMansTSqlFormatterLib.Interfaces.SqlTokenType.Comma) {
                            keywordSB.append(",");
                        } else {
                            keywordSB.append(PoorMansTSqlFormatterLib.BridgeUtils.ToUpperInvariant$1(System.Array.getItem(tokenList, tokenPos, PoorMansTSqlFormatterLib.Interfaces.IToken).PoorMansTSqlFormatterLib$Interfaces$IToken$Value));
                        }
                        keywordSB.append(" ");
                    }
                } finally {
                    if (Bridge.is($t, System.IDisposable)) {
                        $t.System$IDisposable$dispose();
                    }
                }return keywordSB.toString();
            },
            GetEquivalentSqlNodeName: function (tokenType) {
                switch (tokenType) {
                    case PoorMansTSqlFormatterLib.Interfaces.SqlTokenType.WhiteSpace: 
                        return PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_WHITESPACE;
                    case PoorMansTSqlFormatterLib.Interfaces.SqlTokenType.SingleLineComment: 
                        return PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_COMMENT_SINGLELINE;
                    case PoorMansTSqlFormatterLib.Interfaces.SqlTokenType.SingleLineCommentCStyle: 
                        return PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_COMMENT_SINGLELINE_CSTYLE;
                    case PoorMansTSqlFormatterLib.Interfaces.SqlTokenType.MultiLineComment: 
                        return PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_COMMENT_MULTILINE;
                    case PoorMansTSqlFormatterLib.Interfaces.SqlTokenType.BracketQuotedName: 
                        return PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_BRACKET_QUOTED_NAME;
                    case PoorMansTSqlFormatterLib.Interfaces.SqlTokenType.Asterisk: 
                        return PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_ASTERISK;
                    case PoorMansTSqlFormatterLib.Interfaces.SqlTokenType.EqualsSign: 
                        return PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_EQUALSSIGN;
                    case PoorMansTSqlFormatterLib.Interfaces.SqlTokenType.Comma: 
                        return PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_COMMA;
                    case PoorMansTSqlFormatterLib.Interfaces.SqlTokenType.Period: 
                        return PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_PERIOD;
                    case PoorMansTSqlFormatterLib.Interfaces.SqlTokenType.NationalString: 
                        return PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_NSTRING;
                    case PoorMansTSqlFormatterLib.Interfaces.SqlTokenType.String: 
                        return PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_STRING;
                    case PoorMansTSqlFormatterLib.Interfaces.SqlTokenType.QuotedString: 
                        return PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_QUOTED_STRING;
                    case PoorMansTSqlFormatterLib.Interfaces.SqlTokenType.OtherOperator: 
                        return PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_OTHEROPERATOR;
                    case PoorMansTSqlFormatterLib.Interfaces.SqlTokenType.Number: 
                        return PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_NUMBER_VALUE;
                    case PoorMansTSqlFormatterLib.Interfaces.SqlTokenType.MonetaryValue: 
                        return PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_MONETARY_VALUE;
                    case PoorMansTSqlFormatterLib.Interfaces.SqlTokenType.BinaryValue: 
                        return PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_BINARY_VALUE;
                    case PoorMansTSqlFormatterLib.Interfaces.SqlTokenType.PseudoName: 
                        return PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_PSEUDONAME;
                    default: 
                        throw new System.Exception("Mapping not found for provided Token Type");
                }
            },
            GetKeywordMatchPhrase: function (tokenList, tokenID, rawKeywordParts, tokenCounts, overflowNodes) {
                var phrase = "";
                var phraseComponentsFound = 0;
                rawKeywordParts.v = new (System.Collections.Generic.List$1(System.String))();
                overflowNodes.v = new (System.Collections.Generic.List$1(System.Collections.Generic.List$1(PoorMansTSqlFormatterLib.Interfaces.IToken)))();
                tokenCounts.v = new (System.Collections.Generic.List$1(System.Int32))();
                var precedingWhitespace = "";
                var originalTokenID = tokenID;

                while (tokenID < System.Array.getCount(tokenList, PoorMansTSqlFormatterLib.Interfaces.IToken) && phraseComponentsFound < 7) {
                    if (System.Array.getItem(tokenList, tokenID, PoorMansTSqlFormatterLib.Interfaces.IToken).PoorMansTSqlFormatterLib$Interfaces$IToken$Type === PoorMansTSqlFormatterLib.Interfaces.SqlTokenType.OtherNode || System.Array.getItem(tokenList, tokenID, PoorMansTSqlFormatterLib.Interfaces.IToken).PoorMansTSqlFormatterLib$Interfaces$IToken$Type === PoorMansTSqlFormatterLib.Interfaces.SqlTokenType.BracketQuotedName || System.Array.getItem(tokenList, tokenID, PoorMansTSqlFormatterLib.Interfaces.IToken).PoorMansTSqlFormatterLib$Interfaces$IToken$Type === PoorMansTSqlFormatterLib.Interfaces.SqlTokenType.Comma) {
                        phrase = System.String.concat(phrase, (System.String.concat(PoorMansTSqlFormatterLib.BridgeUtils.ToUpperInvariant$1(System.Array.getItem(tokenList, tokenID, PoorMansTSqlFormatterLib.Interfaces.IToken).PoorMansTSqlFormatterLib$Interfaces$IToken$Value), " ")));
                        phraseComponentsFound = (phraseComponentsFound + 1) | 0;
                        rawKeywordParts.v.add(System.String.concat(precedingWhitespace, System.Array.getItem(tokenList, tokenID, PoorMansTSqlFormatterLib.Interfaces.IToken).PoorMansTSqlFormatterLib$Interfaces$IToken$Value));

                        tokenID = (tokenID + 1) | 0;
                        tokenCounts.v.add(((tokenID - originalTokenID) | 0));

                        //found a possible phrase component - skip past any upcoming whitespace or comments, keeping track.
                        overflowNodes.v.add(new (System.Collections.Generic.List$1(PoorMansTSqlFormatterLib.Interfaces.IToken))());
                        precedingWhitespace = "";
                        while (tokenID < System.Array.getCount(tokenList, PoorMansTSqlFormatterLib.Interfaces.IToken) && (System.Array.getItem(tokenList, tokenID, PoorMansTSqlFormatterLib.Interfaces.IToken).PoorMansTSqlFormatterLib$Interfaces$IToken$Type === PoorMansTSqlFormatterLib.Interfaces.SqlTokenType.WhiteSpace || System.Array.getItem(tokenList, tokenID, PoorMansTSqlFormatterLib.Interfaces.IToken).PoorMansTSqlFormatterLib$Interfaces$IToken$Type === PoorMansTSqlFormatterLib.Interfaces.SqlTokenType.SingleLineComment || System.Array.getItem(tokenList, tokenID, PoorMansTSqlFormatterLib.Interfaces.IToken).PoorMansTSqlFormatterLib$Interfaces$IToken$Type === PoorMansTSqlFormatterLib.Interfaces.SqlTokenType.MultiLineComment)) {
                            if (System.Array.getItem(tokenList, tokenID, PoorMansTSqlFormatterLib.Interfaces.IToken).PoorMansTSqlFormatterLib$Interfaces$IToken$Type === PoorMansTSqlFormatterLib.Interfaces.SqlTokenType.WhiteSpace) {
                                precedingWhitespace = System.String.concat(precedingWhitespace, System.Array.getItem(tokenList, tokenID, PoorMansTSqlFormatterLib.Interfaces.IToken).PoorMansTSqlFormatterLib$Interfaces$IToken$Value);
                            } else {
                                overflowNodes.v.getItem(((phraseComponentsFound - 1) | 0)).add(System.Array.getItem(tokenList, tokenID, PoorMansTSqlFormatterLib.Interfaces.IToken));
                            }

                            tokenID = (tokenID + 1) | 0;
                        }
                    } else {
                        break;
                    }
                }

                return phrase;
            },
            GetSignificantTokenPositions: function (tokenList, tokenID, searchDistance) {
                var significantTokenPositions = new (System.Collections.Generic.List$1(System.Int32))();
                var originalTokenID = tokenID;

                while (tokenID < System.Array.getCount(tokenList, PoorMansTSqlFormatterLib.Interfaces.IToken) && significantTokenPositions.Count < searchDistance) {
                    if (System.Array.getItem(tokenList, tokenID, PoorMansTSqlFormatterLib.Interfaces.IToken).PoorMansTSqlFormatterLib$Interfaces$IToken$Type === PoorMansTSqlFormatterLib.Interfaces.SqlTokenType.OtherNode || System.Array.getItem(tokenList, tokenID, PoorMansTSqlFormatterLib.Interfaces.IToken).PoorMansTSqlFormatterLib$Interfaces$IToken$Type === PoorMansTSqlFormatterLib.Interfaces.SqlTokenType.BracketQuotedName || System.Array.getItem(tokenList, tokenID, PoorMansTSqlFormatterLib.Interfaces.IToken).PoorMansTSqlFormatterLib$Interfaces$IToken$Type === PoorMansTSqlFormatterLib.Interfaces.SqlTokenType.Comma) {
                        significantTokenPositions.add(tokenID);
                        tokenID = (tokenID + 1) | 0;

                        //found a possible phrase component - skip past any upcoming whitespace or comments, keeping track.
                        while (tokenID < System.Array.getCount(tokenList, PoorMansTSqlFormatterLib.Interfaces.IToken) && (System.Array.getItem(tokenList, tokenID, PoorMansTSqlFormatterLib.Interfaces.IToken).PoorMansTSqlFormatterLib$Interfaces$IToken$Type === PoorMansTSqlFormatterLib.Interfaces.SqlTokenType.WhiteSpace || System.Array.getItem(tokenList, tokenID, PoorMansTSqlFormatterLib.Interfaces.IToken).PoorMansTSqlFormatterLib$Interfaces$IToken$Type === PoorMansTSqlFormatterLib.Interfaces.SqlTokenType.SingleLineComment || System.Array.getItem(tokenList, tokenID, PoorMansTSqlFormatterLib.Interfaces.IToken).PoorMansTSqlFormatterLib$Interfaces$IToken$Type === PoorMansTSqlFormatterLib.Interfaces.SqlTokenType.MultiLineComment)) {
                            tokenID = (tokenID + 1) | 0;
                        }
                    } else {
                        break;
                    }
                }

                return significantTokenPositions;
            },
            GetCompoundKeyword: function (tokenID, compoundKeywordCount, compoundKeywordTokenCounts, compoundKeywordRawStrings) {
                tokenID.v = (tokenID.v + (((compoundKeywordTokenCounts.getItem(((compoundKeywordCount - 1) | 0)) - 1) | 0))) | 0;
                var outString = "";
                for (var i = 0; i < compoundKeywordCount; i = (i + 1) | 0) {
                    outString = System.String.concat(outString, compoundKeywordRawStrings.getItem(i));
                }
                return outString;
            },
            IsLatestTokenADDLDetailValue: function (sqlTree) {
                var latestContentNode = System.Linq.Enumerable.from(PoorMansTSqlFormatterLib.ParseStructure.NodeExtensions.ChildrenExcludingNames(sqlTree.CurrentContainer, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAMELIST_NONCONTENT)).lastOrDefault(null, null);
                if (latestContentNode != null && (System.String.equals(latestContentNode.PoorMansTSqlFormatterLib$ParseStructure$Node$Name, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_OTHERKEYWORD) || System.String.equals(latestContentNode.PoorMansTSqlFormatterLib$ParseStructure$Node$Name, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_DATATYPE_KEYWORD) || System.String.equals(latestContentNode.PoorMansTSqlFormatterLib$ParseStructure$Node$Name, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_COMPOUNDKEYWORD))) {
                    var uppercaseText = null;
                    if (System.String.equals(latestContentNode.PoorMansTSqlFormatterLib$ParseStructure$Node$Name, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_COMPOUNDKEYWORD)) {
                        uppercaseText = latestContentNode.PoorMansTSqlFormatterLib$ParseStructure$Node$GetAttributeValue(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ANAME_SIMPLETEXT);
                    } else {
                        uppercaseText = PoorMansTSqlFormatterLib.BridgeUtils.ToUpperInvariant$1(latestContentNode.PoorMansTSqlFormatterLib$ParseStructure$Node$TextValue);
                    }

                    return (System.String.equals(uppercaseText, "NVARCHAR") || System.String.equals(uppercaseText, "VARCHAR") || System.String.equals(uppercaseText, "DECIMAL") || System.String.equals(uppercaseText, "DEC") || System.String.equals(uppercaseText, "NUMERIC") || System.String.equals(uppercaseText, "VARBINARY") || System.String.equals(uppercaseText, "DEFAULT") || System.String.equals(uppercaseText, "IDENTITY") || System.String.equals(uppercaseText, "XML") || System.String.endsWith(uppercaseText, "VARYING") || System.String.endsWith(uppercaseText, "CHAR") || System.String.endsWith(uppercaseText, "CHARACTER") || System.String.equals(uppercaseText, "FLOAT") || System.String.equals(uppercaseText, "DATETIMEOFFSET") || System.String.equals(uppercaseText, "DATETIME2") || System.String.equals(uppercaseText, "TIME"));
                }
                return false;
            },
            IsLatestTokenAComma: function (sqlTree) {
                var latestContent = System.Linq.Enumerable.from(PoorMansTSqlFormatterLib.ParseStructure.NodeExtensions.ChildrenExcludingNames(sqlTree.CurrentContainer, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAMELIST_NONCONTENT)).lastOrDefault(null, null);
                return latestContent != null && System.String.equals(latestContent.PoorMansTSqlFormatterLib$ParseStructure$Node$Name, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_COMMA);
            },
            IsLatestTokenAMiscName: function (sqlTree) {
                var latestContent = System.Linq.Enumerable.from(PoorMansTSqlFormatterLib.ParseStructure.NodeExtensions.ChildrenExcludingNames(sqlTree.CurrentContainer, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAMELIST_NONCONTENT)).lastOrDefault(null, null);

                if (latestContent != null) {
                    var testValue = PoorMansTSqlFormatterLib.BridgeUtils.ToUpperInvariant$1(latestContent.PoorMansTSqlFormatterLib$ParseStructure$Node$TextValue);

                    if (System.String.equals(latestContent.PoorMansTSqlFormatterLib$ParseStructure$Node$Name, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_BRACKET_QUOTED_NAME)) {
                        return true;
                    }

                    if ((System.String.equals(latestContent.PoorMansTSqlFormatterLib$ParseStructure$Node$Name, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_OTHERNODE) || System.String.equals(latestContent.PoorMansTSqlFormatterLib$ParseStructure$Node$Name, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_FUNCTION_KEYWORD)) && !(System.String.equals(testValue, "AND") || System.String.equals(testValue, "OR") || System.String.equals(testValue, "NOT") || System.String.equals(testValue, "BETWEEN") || System.String.equals(testValue, "LIKE") || System.String.equals(testValue, "CONTAINS") || System.String.equals(testValue, "EXISTS") || System.String.equals(testValue, "FREETEXT") || System.String.equals(testValue, "IN") || System.String.equals(testValue, "ALL") || System.String.equals(testValue, "SOME") || System.String.equals(testValue, "ANY") || System.String.equals(testValue, "FROM") || System.String.equals(testValue, "JOIN") || System.String.endsWith(testValue, " JOIN") || System.String.equals(testValue, "UNION") || System.String.equals(testValue, "UNION ALL") || System.String.equals(testValue, "USING") || System.String.equals(testValue, "AS") || System.String.endsWith(testValue, " APPLY"))) {
                        return true;
                    }
                }

                return false;
            },
            IsFollowedByLineBreakingWhiteSpaceOrSingleLineCommentOrEnd: function (tokenList, tokenID) {
                var currTokenID = (tokenID + 1) | 0;
                while (System.Array.getCount(tokenList, PoorMansTSqlFormatterLib.Interfaces.IToken) >= ((currTokenID + 1) | 0)) {
                    if (System.Array.getItem(tokenList, currTokenID, PoorMansTSqlFormatterLib.Interfaces.IToken).PoorMansTSqlFormatterLib$Interfaces$IToken$Type === PoorMansTSqlFormatterLib.Interfaces.SqlTokenType.SingleLineComment) {
                        return true;
                    } else {
                        if (System.Array.getItem(tokenList, currTokenID, PoorMansTSqlFormatterLib.Interfaces.IToken).PoorMansTSqlFormatterLib$Interfaces$IToken$Type === PoorMansTSqlFormatterLib.Interfaces.SqlTokenType.WhiteSpace) {
                            if (System.Text.RegularExpressions.Regex.isMatch(System.Array.getItem(tokenList, currTokenID, PoorMansTSqlFormatterLib.Interfaces.IToken).PoorMansTSqlFormatterLib$Interfaces$IToken$Value, "(\\r|\\n)+")) {
                                return true;
                            } else {
                                currTokenID = (currTokenID + 1) | 0;
                            }
                        } else {
                            return false;
                        }
                    }
                }
                return true;
            }
        }
    });

    Bridge.define("PoorMansTSqlFormatterLib.ParseStructure.NodeImpl", {
        inherits: [PoorMansTSqlFormatterLib.ParseStructure.Node],
        props: {
            Name: null,
            TextValue: null,
            Parent: null,
            Attributes: null,
            Children: null
        },
        alias: [
            "Name", "PoorMansTSqlFormatterLib$ParseStructure$Node$Name",
            "TextValue", "PoorMansTSqlFormatterLib$ParseStructure$Node$TextValue",
            "Parent", "PoorMansTSqlFormatterLib$ParseStructure$Node$Parent",
            "Attributes", "PoorMansTSqlFormatterLib$ParseStructure$Node$Attributes",
            "Children", "PoorMansTSqlFormatterLib$ParseStructure$Node$Children",
            "AddChild", "PoorMansTSqlFormatterLib$ParseStructure$Node$AddChild",
            "InsertChildBefore", "PoorMansTSqlFormatterLib$ParseStructure$Node$InsertChildBefore",
            "RemoveChild", "PoorMansTSqlFormatterLib$ParseStructure$Node$RemoveChild",
            "GetAttributeValue", "PoorMansTSqlFormatterLib$ParseStructure$Node$GetAttributeValue",
            "SetAttribute", "PoorMansTSqlFormatterLib$ParseStructure$Node$SetAttribute",
            "RemoveAttribute", "PoorMansTSqlFormatterLib$ParseStructure$Node$RemoveAttribute"
        ],
        ctors: {
            ctor: function () {
                this.$initialize();
                this.Attributes = new (System.Collections.Generic.Dictionary$2(System.String,System.String))();
                this.Children = new (System.Collections.Generic.List$1(PoorMansTSqlFormatterLib.ParseStructure.Node))();
            }
        },
        methods: {
            AddChild: function (child) {
                this.SetParentOnChild(child);
                System.Array.add(Bridge.cast(this.Children, System.Collections.Generic.IList$1(PoorMansTSqlFormatterLib.ParseStructure.Node)), child, PoorMansTSqlFormatterLib.ParseStructure.Node);
            },
            InsertChildBefore: function (newChild, existingChild) {
                this.SetParentOnChild(newChild);
                var childList = Bridge.as(this.Children, System.Collections.Generic.IList$1(PoorMansTSqlFormatterLib.ParseStructure.Node));
                System.Array.insert(childList, System.Array.indexOf(childList, existingChild, 0, null, PoorMansTSqlFormatterLib.ParseStructure.Node), newChild, PoorMansTSqlFormatterLib.ParseStructure.Node);
            },
            SetParentOnChild: function (child) {
                //TODO: NOT THREAD-SAFE AT ALL!
                if (child.PoorMansTSqlFormatterLib$ParseStructure$Node$Parent != null) {
                    throw new System.ArgumentException("Child cannot already have a parent!");
                }
                Bridge.cast(child, PoorMansTSqlFormatterLib.ParseStructure.NodeImpl).Parent = this;
            },
            RemoveChild: function (child) {
                //TODO: NOT THREAD-SAFE AT ALL!
                System.Array.remove(Bridge.cast(this.Children, System.Collections.Generic.IList$1(PoorMansTSqlFormatterLib.ParseStructure.Node)), child, PoorMansTSqlFormatterLib.ParseStructure.Node);
                Bridge.cast(child, PoorMansTSqlFormatterLib.ParseStructure.NodeImpl).Parent = null;
            },
            GetAttributeValue: function (aName) {
                var outVal = { v : null };
                this.Attributes.System$Collections$Generic$IDictionary$2$System$String$System$String$tryGetValue(aName, outVal);
                return outVal.v;
            },
            SetAttribute: function (name, value) {
                this.Attributes.System$Collections$Generic$IDictionary$2$System$String$System$String$setItem(name, value);
            },
            RemoveAttribute: function (name) {
                this.Attributes.System$Collections$Generic$IDictionary$2$System$String$System$String$remove(name);
            }
        }
    });

    Bridge.define("PoorMansTSqlFormatterLib.SqlFormattingManager", {
        inherits: [PoorMansTSqlFormatterLib._SqlFormattingManager],
        statics: {
            methods: {
                DefaultFormat: function (inputSQL) {
                    return new PoorMansTSqlFormatterLib.SqlFormattingManager.ctor().Format(inputSQL);
                },
                DefaultFormat$1: function (inputSQL, errorsEncountered) {
                    return new PoorMansTSqlFormatterLib.SqlFormattingManager.ctor().Format$1(inputSQL, errorsEncountered);
                }
            }
        },
        props: {
            Tokenizer: null,
            Parser: null,
            Formatter: null
        },
        alias: ["Format", "PoorMansTSqlFormatterLib$_SqlFormattingManager$Format"],
        ctors: {
            ctor: function () {
                PoorMansTSqlFormatterLib.SqlFormattingManager.$ctor1.call(this, new PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer(), new PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser(), new PoorMansTSqlFormatterLib.Formatters.TSqlStandardFormatter.ctor());
            },
            $ctor2: function (formatter) {
                PoorMansTSqlFormatterLib.SqlFormattingManager.$ctor1.call(this, new PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer(), new PoorMansTSqlFormatterLib.Parsers.TSqlStandardParser(), formatter);
            },
            $ctor1: function (tokenizer, parser, formatter) {
                this.$initialize();
                this.Tokenizer = tokenizer;
                this.Parser = parser;
                this.Formatter = formatter;
            }
        },
        methods: {
            Format: function (inputSQL) {
                var error = { v : false };
                return this.Format$1(inputSQL, error);
            },
            Format$1: function (inputSQL, errorEncountered) {
                var sqlTree = this.Parser.PoorMansTSqlFormatterLib$Interfaces$ISqlTokenParser$ParseSQL(this.Tokenizer.PoorMansTSqlFormatterLib$Interfaces$ISqlTokenizer$TokenizeSQL(inputSQL));
                errorEncountered.v = (Bridge.referenceEquals(sqlTree.PoorMansTSqlFormatterLib$ParseStructure$Node$GetAttributeValue(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ANAME_ERRORFOUND), "1"));
                return this.Formatter.PoorMansTSqlFormatterLib$Interfaces$ISqlTreeFormatter$FormatSQLTree(sqlTree);
            }
        }
    });

    Bridge.define("PoorMansTSqlFormatterLib.Token", {
        inherits: [PoorMansTSqlFormatterLib.Interfaces.IToken],
        props: {
            Type: 0,
            Value: null
        },
        alias: [
            "Type", "PoorMansTSqlFormatterLib$Interfaces$IToken$Type",
            "Value", "PoorMansTSqlFormatterLib$Interfaces$IToken$Value"
        ],
        ctors: {
            ctor: function (type, value) {
                this.$initialize();
                this.Type = type;
                this.Value = value;
            }
        }
    });

    Bridge.define("PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer", {
        inherits: [PoorMansTSqlFormatterLib.Interfaces.ISqlTokenizer],
        statics: {
            methods: {
                IsWhitespace: function (targetCharacter) {
                    return (targetCharacter === 32 || targetCharacter === 9 || targetCharacter === 10 || targetCharacter === 13);
                },
                IsNonWordCharacter: function (currentCharacter) {
                    //characters that pop you out of a regular "word" context (maybe into a new word)
                    return (PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.IsWhitespace(currentCharacter) || PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.IsOperatorCharacter(currentCharacter) || (PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.IsCurrencyPrefix(currentCharacter) && currentCharacter !== 36) || currentCharacter === 39 || currentCharacter === 34 || currentCharacter === 44 || currentCharacter === 46 || currentCharacter === 91 || currentCharacter === 40 || currentCharacter === 41 || currentCharacter === 33 || currentCharacter === 59 || currentCharacter === 58);
                },
                IsCompoundableOperatorCharacter: function (currentCharacter) {
                    //operator characters that can be compounded by a subsequent "equals" sign
                    return (currentCharacter === 47 || currentCharacter === 45 || currentCharacter === 43 || currentCharacter === 42 || currentCharacter === 37 || currentCharacter === 38 || currentCharacter === 94 || currentCharacter === 60 || currentCharacter === 62 || currentCharacter === 124);
                },
                IsOperatorCharacter: function (currentCharacter) {
                    //operator characters
                    return (currentCharacter === 47 || currentCharacter === 45 || currentCharacter === 43 || currentCharacter === 37 || currentCharacter === 42 || currentCharacter === 38 || currentCharacter === 124 || currentCharacter === 94 || currentCharacter === 61 || currentCharacter === 60 || currentCharacter === 62 || currentCharacter === 126);
                },
                IsCurrencyPrefix: function (currentCharacter) {
                    //symbols that SQL Server recognizes as currency prefixes - these also happen to 
                    // be word-breakers, except the dollar. Ref:
                    // http://msdn.microsoft.com/en-us/library/ms188688.aspx
                    return (currentCharacter === 36 || currentCharacter === 162 || currentCharacter === 163 || currentCharacter === 164 || currentCharacter === 165 || currentCharacter === 2546 || currentCharacter === 2547 || currentCharacter === 3647 || currentCharacter === 6107 || currentCharacter === 8352 || currentCharacter === 8353 || currentCharacter === 8354 || currentCharacter === 8355 || currentCharacter === 8356 || currentCharacter === 8357 || currentCharacter === 8358 || currentCharacter === 8359 || currentCharacter === 8360 || currentCharacter === 8361 || currentCharacter === 8362 || currentCharacter === 8363 || currentCharacter === 8364 || currentCharacter === 8365 || currentCharacter === 8366 || currentCharacter === 8367 || currentCharacter === 8368 || currentCharacter === 8369 || currentCharacter === 65020 || currentCharacter === 65129 || currentCharacter === 65284 || currentCharacter === 65504 || currentCharacter === 65505 || currentCharacter === 65509 || currentCharacter === 65510);
                },
                CompleteTokenAndProcessNext: function (state) {
                    PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.CompleteToken(state, true);
                    PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.ProcessOrOpenToken(state);
                },
                AppendCharAndCompleteToken: function (state) {
                    state.ConsumeCurrentCharacterIntoToken();
                    PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.CompleteToken(state, false);
                },
                SwallowOutstandingCharacterAndCompleteToken: function (state) {
                    //this is for cases where we *know* we are swallowing the "current character" (not putting it in the output)
                    state.HasUnprocessedCurrentCharacter = false;
                    PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.CompleteToken(state, false);
                },
                ProcessOrOpenToken: function (state) {
                    if (state.CurrentTokenizationType != null) {
                        throw new System.Exception("Cannot start a new Token: existing Tokenization Type is not null");
                    }

                    if (!state.HasUnprocessedCurrentCharacter) {
                        throw new System.Exception("Cannot start a new Token: no (outstanding) current character specified!");
                    }

                    //start a new value.
                    state.CurrentTokenValue.setLength(0);

                    if (PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.IsWhitespace(state.CurrentChar)) {
                        state.CurrentTokenizationType = PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.SqlTokenizationType.WhiteSpace;
                        state.ConsumeCurrentCharacterIntoToken();
                    } else if (state.CurrentChar === 45) {
                        state.CurrentTokenizationType = PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.SqlTokenizationType.SingleHyphen;
                        state.HasUnprocessedCurrentCharacter = false; //purposefully swallowing, will be reinserted later
                    } else if (state.CurrentChar === 36) {
                        state.CurrentTokenizationType = PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.SqlTokenizationType.SingleDollar;
                        state.HasUnprocessedCurrentCharacter = false; //purposefully swallowing, will be reinserted later
                    } else if (state.CurrentChar === 47) {
                        state.CurrentTokenizationType = PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.SqlTokenizationType.SingleSlash;
                        state.HasUnprocessedCurrentCharacter = false; //purposefully swallowing, will be reinserted later
                    } else if (state.CurrentChar === 78) {
                        state.CurrentTokenizationType = PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.SqlTokenizationType.SingleN;
                        state.HasUnprocessedCurrentCharacter = false; //purposefully swallowing, will be reinserted later except N-string case
                    } else if (state.CurrentChar === 39) {
                        state.CurrentTokenizationType = PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.SqlTokenizationType.String;
                        state.HasUnprocessedCurrentCharacter = false; //purposefully swallowing
                    } else if (state.CurrentChar === 34) {
                        state.CurrentTokenizationType = PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.SqlTokenizationType.QuotedString;
                        state.HasUnprocessedCurrentCharacter = false; //purposefully swallowing
                    } else if (state.CurrentChar === 91) {
                        state.CurrentTokenizationType = PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.SqlTokenizationType.BracketQuotedName;
                        state.HasUnprocessedCurrentCharacter = false; //purposefully swallowing
                    } else if (state.CurrentChar === 40) {
                        PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.SaveCurrentCharToNewToken(state, PoorMansTSqlFormatterLib.Interfaces.SqlTokenType.OpenParens);
                    } else if (state.CurrentChar === 41) {
                        PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.SaveCurrentCharToNewToken(state, PoorMansTSqlFormatterLib.Interfaces.SqlTokenType.CloseParens);
                    } else if (state.CurrentChar === 44) {
                        PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.SaveCurrentCharToNewToken(state, PoorMansTSqlFormatterLib.Interfaces.SqlTokenType.Comma);
                    } else if (state.CurrentChar === 46) {
                        state.CurrentTokenizationType = PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.SqlTokenizationType.SinglePeriod;
                        state.HasUnprocessedCurrentCharacter = false; //purposefully swallowing, will be reinserted later
                    } else if (state.CurrentChar === 48) {
                        state.CurrentTokenizationType = PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.SqlTokenizationType.SingleZero;
                        state.HasUnprocessedCurrentCharacter = false; //purposefully swallowing, will be reinserted later
                    } else if (state.CurrentChar >= 49 && state.CurrentChar <= 57) {
                        state.CurrentTokenizationType = PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.SqlTokenizationType.Number;
                        state.ConsumeCurrentCharacterIntoToken();
                    } else if (PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.IsCurrencyPrefix(state.CurrentChar)) {
                        state.CurrentTokenizationType = PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.SqlTokenizationType.MonetaryValue;
                        state.ConsumeCurrentCharacterIntoToken();
                    } else if (state.CurrentChar === 59) {
                        PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.SaveCurrentCharToNewToken(state, PoorMansTSqlFormatterLib.Interfaces.SqlTokenType.Semicolon);
                    } else if (state.CurrentChar === 58) {
                        PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.SaveCurrentCharToNewToken(state, PoorMansTSqlFormatterLib.Interfaces.SqlTokenType.Colon);
                    } else if (state.CurrentChar === 42) {
                        state.CurrentTokenizationType = PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.SqlTokenizationType.SingleAsterisk;
                        state.HasUnprocessedCurrentCharacter = false; //purposefully swallowing, will be reinserted later
                    } else if (state.CurrentChar === 61) {
                        state.CurrentTokenizationType = PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.SqlTokenizationType.SingleEquals;
                        state.HasUnprocessedCurrentCharacter = false; //purposefully swallowing, will be reinserted later
                    } else if (state.CurrentChar === 60) {
                        state.CurrentTokenizationType = PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.SqlTokenizationType.SingleLT;
                        state.HasUnprocessedCurrentCharacter = false; //purposefully swallowing, will be reinserted later
                    } else if (state.CurrentChar === 62) {
                        state.CurrentTokenizationType = PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.SqlTokenizationType.SingleGT;
                        state.HasUnprocessedCurrentCharacter = false; //purposefully swallowing, will be reinserted later
                    } else if (state.CurrentChar === 33) {
                        state.CurrentTokenizationType = PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.SqlTokenizationType.SingleExclamation;
                        state.HasUnprocessedCurrentCharacter = false; //purposefully swallowing, will be reinserted later
                    } else if (state.CurrentChar === 124) {
                        state.CurrentTokenizationType = PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.SqlTokenizationType.SinglePipe;
                        state.HasUnprocessedCurrentCharacter = false; //purposefully swallowing, will be reinserted later
                    } else if (PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.IsCompoundableOperatorCharacter(state.CurrentChar)) {
                        state.CurrentTokenizationType = PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.SqlTokenizationType.SingleOtherCompoundableOperator;
                        state.ConsumeCurrentCharacterIntoToken();
                    } else if (PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.IsOperatorCharacter(state.CurrentChar)) {
                        PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.SaveCurrentCharToNewToken(state, PoorMansTSqlFormatterLib.Interfaces.SqlTokenType.OtherOperator);
                    } else {
                        state.CurrentTokenizationType = PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.SqlTokenizationType.OtherNode;
                        state.ConsumeCurrentCharacterIntoToken();
                    }
                },
                CompleteToken: function (state, nextCharRead) {
                    if (state.CurrentTokenizationType == null) {
                        throw new System.Exception("Cannot complete Token, as there is no current Tokenization Type");
                    }

                    switch (state.CurrentTokenizationType) {
                        case PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.SqlTokenizationType.BlockComment: 
                            PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.SaveToken(state, PoorMansTSqlFormatterLib.Interfaces.SqlTokenType.MultiLineComment, state.CurrentTokenValue.toString());
                            break;
                        case PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.SqlTokenizationType.OtherNode: 
                            PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.SaveToken(state, PoorMansTSqlFormatterLib.Interfaces.SqlTokenType.OtherNode, state.CurrentTokenValue.toString());
                            break;
                        case PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.SqlTokenizationType.PseudoName: 
                            PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.SaveToken(state, PoorMansTSqlFormatterLib.Interfaces.SqlTokenType.PseudoName, state.CurrentTokenValue.toString());
                            break;
                        case PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.SqlTokenizationType.SingleLineComment: 
                            PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.SaveToken(state, PoorMansTSqlFormatterLib.Interfaces.SqlTokenType.SingleLineComment, state.CurrentTokenValue.toString());
                            break;
                        case PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.SqlTokenizationType.SingleLineCommentCStyle: 
                            PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.SaveToken(state, PoorMansTSqlFormatterLib.Interfaces.SqlTokenType.SingleLineCommentCStyle, state.CurrentTokenValue.toString());
                            break;
                        case PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.SqlTokenizationType.SingleHyphen: 
                            PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.SaveToken(state, PoorMansTSqlFormatterLib.Interfaces.SqlTokenType.OtherOperator, "-");
                            break;
                        case PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.SqlTokenizationType.SingleDollar: 
                            PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.SaveToken(state, PoorMansTSqlFormatterLib.Interfaces.SqlTokenType.MonetaryValue, "$");
                            break;
                        case PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.SqlTokenizationType.SingleSlash: 
                            PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.SaveToken(state, PoorMansTSqlFormatterLib.Interfaces.SqlTokenType.OtherOperator, "/");
                            break;
                        case PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.SqlTokenizationType.WhiteSpace: 
                            PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.SaveToken(state, PoorMansTSqlFormatterLib.Interfaces.SqlTokenType.WhiteSpace, state.CurrentTokenValue.toString());
                            break;
                        case PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.SqlTokenizationType.SingleN: 
                            PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.SaveToken(state, PoorMansTSqlFormatterLib.Interfaces.SqlTokenType.OtherNode, "N");
                            break;
                        case PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.SqlTokenizationType.SingleExclamation: 
                            PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.SaveToken(state, PoorMansTSqlFormatterLib.Interfaces.SqlTokenType.OtherNode, "!");
                            break;
                        case PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.SqlTokenizationType.SinglePipe: 
                            PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.SaveToken(state, PoorMansTSqlFormatterLib.Interfaces.SqlTokenType.OtherNode, "|");
                            break;
                        case PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.SqlTokenizationType.SingleGT: 
                            PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.SaveToken(state, PoorMansTSqlFormatterLib.Interfaces.SqlTokenType.OtherOperator, ">");
                            break;
                        case PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.SqlTokenizationType.SingleLT: 
                            PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.SaveToken(state, PoorMansTSqlFormatterLib.Interfaces.SqlTokenType.OtherOperator, "<");
                            break;
                        case PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.SqlTokenizationType.NString: 
                            PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.SaveToken(state, PoorMansTSqlFormatterLib.Interfaces.SqlTokenType.NationalString, state.CurrentTokenValue.toString());
                            break;
                        case PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.SqlTokenizationType.String: 
                            PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.SaveToken(state, PoorMansTSqlFormatterLib.Interfaces.SqlTokenType.String, state.CurrentTokenValue.toString());
                            break;
                        case PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.SqlTokenizationType.QuotedString: 
                            PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.SaveToken(state, PoorMansTSqlFormatterLib.Interfaces.SqlTokenType.QuotedString, state.CurrentTokenValue.toString());
                            break;
                        case PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.SqlTokenizationType.BracketQuotedName: 
                            PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.SaveToken(state, PoorMansTSqlFormatterLib.Interfaces.SqlTokenType.BracketQuotedName, state.CurrentTokenValue.toString());
                            break;
                        case PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.SqlTokenizationType.OtherOperator: 
                        case PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.SqlTokenizationType.SingleOtherCompoundableOperator: 
                            PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.SaveToken(state, PoorMansTSqlFormatterLib.Interfaces.SqlTokenType.OtherOperator, state.CurrentTokenValue.toString());
                            break;
                        case PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.SqlTokenizationType.SingleZero: 
                            PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.SaveToken(state, PoorMansTSqlFormatterLib.Interfaces.SqlTokenType.Number, "0");
                            break;
                        case PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.SqlTokenizationType.SinglePeriod: 
                            PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.SaveToken(state, PoorMansTSqlFormatterLib.Interfaces.SqlTokenType.Period, ".");
                            break;
                        case PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.SqlTokenizationType.SingleAsterisk: 
                            PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.SaveToken(state, PoorMansTSqlFormatterLib.Interfaces.SqlTokenType.Asterisk, state.CurrentTokenValue.toString());
                            break;
                        case PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.SqlTokenizationType.SingleEquals: 
                            PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.SaveToken(state, PoorMansTSqlFormatterLib.Interfaces.SqlTokenType.EqualsSign, state.CurrentTokenValue.toString());
                            break;
                        case PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.SqlTokenizationType.Number: 
                        case PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.SqlTokenizationType.DecimalValue: 
                        case PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.SqlTokenizationType.FloatValue: 
                            PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.SaveToken(state, PoorMansTSqlFormatterLib.Interfaces.SqlTokenType.Number, state.CurrentTokenValue.toString());
                            break;
                        case PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.SqlTokenizationType.BinaryValue: 
                            PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.SaveToken(state, PoorMansTSqlFormatterLib.Interfaces.SqlTokenType.BinaryValue, state.CurrentTokenValue.toString());
                            break;
                        case PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.SqlTokenizationType.MonetaryValue: 
                            PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.SaveToken(state, PoorMansTSqlFormatterLib.Interfaces.SqlTokenType.MonetaryValue, state.CurrentTokenValue.toString());
                            break;
                        default: 
                            throw new System.Exception("Unrecognized SQL Node Type");
                    }

                    state.CurrentTokenizationType = null;
                },
                SaveCurrentCharToNewToken: function (state, tokenType) {
                    var charToSave = state.CurrentChar;
                    state.HasUnprocessedCurrentCharacter = false; //because we're using it now!
                    PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.SaveToken(state, tokenType, String.fromCharCode(charToSave));
                },
                SaveToken: function (state, tokenType, tokenValue) {
                    var foundToken = new PoorMansTSqlFormatterLib.Token(tokenType, tokenValue);
                    state.TokenContainer.add(foundToken);

                    var positionOfLastCharacterInToken = state.InputReader.LastCharacterPosition.sub(System.Int64((state.HasUnprocessedCurrentCharacter ? 1 : 0)));
                    if (System.Nullable.liftne("ne", state.RequestedMarkerPosition, System.Int64.lift(null)) && state.TokenContainer.MarkerToken == null && System.Nullable.liftcmp("lte", state.RequestedMarkerPosition, positionOfLastCharacterInToken)) {
                        state.TokenContainer.MarkerToken = foundToken;
                        //TODO: this is wrong for container types, as commented elsewhere. the marker position will be too high.
                        var rawPositionInToken = System.Nullable.lift2("sub", System.Int64.lift(foundToken.Value.length), (System.Nullable.lift2("sub", positionOfLastCharacterInToken, state.RequestedMarkerPosition)));
                        // temporarily bypass overflow issues without fixing underlying problem
                        state.TokenContainer.MarkerPosition = System.Nullable.liftcmp("gt", rawPositionInToken, System.Int64.lift(foundToken.Value.length)) ? System.Int64.lift(foundToken.Value.length) : rawPositionInToken;
                    }
                }
            }
        },
        alias: [
            "TokenizeSQL", "PoorMansTSqlFormatterLib$Interfaces$ISqlTokenizer$TokenizeSQL",
            "TokenizeSQL$1", "PoorMansTSqlFormatterLib$Interfaces$ISqlTokenizer$TokenizeSQL$1"
        ],
        methods: {
            TokenizeSQL: function (inputSQL) {
                return this.TokenizeSQL$1(inputSQL, System.Int64.lift(null));
            },
            TokenizeSQL$1: function (inputSQL, requestedMarkerPosition) {
                var state = new PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.TokenizationState(inputSQL, requestedMarkerPosition);

                state.ReadNextCharacter();
                while (state.HasUnprocessedCurrentCharacter) {
                    if (state.CurrentTokenizationType == null) {
                        PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.ProcessOrOpenToken(state);
                        state.ReadNextCharacter();
                        continue;
                    }

                    switch (System.Nullable.getValue(state.CurrentTokenizationType)) {
                        case PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.SqlTokenizationType.WhiteSpace: 
                            if (PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.IsWhitespace(state.CurrentChar)) {
                                state.ConsumeCurrentCharacterIntoToken();
                            } else {
                                PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.CompleteTokenAndProcessNext(state);
                            }
                            break;
                        case PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.SqlTokenizationType.SinglePeriod: 
                            if (state.CurrentChar >= 48 && state.CurrentChar <= 57) {
                                state.CurrentTokenizationType = PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.SqlTokenizationType.DecimalValue;
                                state.CurrentTokenValue.append(String.fromCharCode(46));
                                state.ConsumeCurrentCharacterIntoToken();
                            } else {
                                state.CurrentTokenValue.append(String.fromCharCode(46));
                                PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.CompleteTokenAndProcessNext(state);
                            }
                            break;
                        case PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.SqlTokenizationType.SingleZero: 
                            if (state.CurrentChar === 120 || state.CurrentChar === 88) {
                                state.CurrentTokenizationType = PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.SqlTokenizationType.BinaryValue;
                                state.CurrentTokenValue.append(String.fromCharCode(48));
                                state.ConsumeCurrentCharacterIntoToken();
                            } else if (state.CurrentChar >= 48 && state.CurrentChar <= 57) {
                                state.CurrentTokenizationType = PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.SqlTokenizationType.Number;
                                state.CurrentTokenValue.append(String.fromCharCode(48));
                                state.ConsumeCurrentCharacterIntoToken();
                            } else if (state.CurrentChar === 46) {
                                state.CurrentTokenizationType = PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.SqlTokenizationType.DecimalValue;
                                state.CurrentTokenValue.append(String.fromCharCode(48));
                                state.ConsumeCurrentCharacterIntoToken();
                            } else {
                                state.CurrentTokenValue.append(String.fromCharCode(48));
                                PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.CompleteTokenAndProcessNext(state);
                            }
                            break;
                        case PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.SqlTokenizationType.Number: 
                            if (state.CurrentChar === 101 || state.CurrentChar === 69) {
                                state.CurrentTokenizationType = PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.SqlTokenizationType.FloatValue;
                                state.ConsumeCurrentCharacterIntoToken();
                            } else if (state.CurrentChar === 46) {
                                state.CurrentTokenizationType = PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.SqlTokenizationType.DecimalValue;
                                state.ConsumeCurrentCharacterIntoToken();
                            } else if (state.CurrentChar >= 48 && state.CurrentChar <= 57) {
                                state.ConsumeCurrentCharacterIntoToken();
                            } else {
                                PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.CompleteTokenAndProcessNext(state);
                            }
                            break;
                        case PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.SqlTokenizationType.DecimalValue: 
                            if (state.CurrentChar === 101 || state.CurrentChar === 69) {
                                state.CurrentTokenizationType = PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.SqlTokenizationType.FloatValue;
                                state.ConsumeCurrentCharacterIntoToken();
                            } else if (state.CurrentChar >= 48 && state.CurrentChar <= 57) {
                                state.ConsumeCurrentCharacterIntoToken();
                            } else {
                                PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.CompleteTokenAndProcessNext(state);
                            }
                            break;
                        case PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.SqlTokenizationType.FloatValue: 
                            if (state.CurrentChar >= 48 && state.CurrentChar <= 57) {
                                state.ConsumeCurrentCharacterIntoToken();
                            } else if (state.CurrentChar === 45 && System.String.endsWith(state.CurrentTokenValue.toString().toUpperCase(), "E")) {
                                state.ConsumeCurrentCharacterIntoToken();
                            } else {
                                PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.CompleteTokenAndProcessNext(state);
                            }
                            break;
                        case PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.SqlTokenizationType.BinaryValue: 
                            if ((state.CurrentChar >= 48 && state.CurrentChar <= 57) || (state.CurrentChar >= 65 && state.CurrentChar <= 70) || (state.CurrentChar >= 97 && state.CurrentChar <= 102)) {
                                state.ConsumeCurrentCharacterIntoToken();
                            } else {
                                PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.CompleteTokenAndProcessNext(state);
                            }
                            break;
                        case PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.SqlTokenizationType.SingleDollar: 
                            state.CurrentTokenValue.append(String.fromCharCode(36));
                            if ((state.CurrentChar >= 65 && state.CurrentChar <= 90) || (state.CurrentChar >= 97 && state.CurrentChar <= 122)) {
                                state.CurrentTokenizationType = PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.SqlTokenizationType.PseudoName;
                            } else {
                                state.CurrentTokenizationType = PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.SqlTokenizationType.MonetaryValue;
                            }
                            state.ConsumeCurrentCharacterIntoToken();
                            break;
                        case PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.SqlTokenizationType.MonetaryValue: 
                            if (state.CurrentChar >= 48 && state.CurrentChar <= 57) {
                                state.ConsumeCurrentCharacterIntoToken();
                            } else if (state.CurrentChar === 45 && state.CurrentTokenValue.getLength() === 1) {
                                state.ConsumeCurrentCharacterIntoToken();
                            } else if (state.CurrentChar === 46 && !System.String.contains(state.CurrentTokenValue.toString(),".")) {
                                state.ConsumeCurrentCharacterIntoToken();
                            } else {
                                PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.CompleteTokenAndProcessNext(state);
                            }
                            break;
                        case PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.SqlTokenizationType.SingleHyphen: 
                            if (state.CurrentChar === 45) {
                                state.CurrentTokenizationType = PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.SqlTokenizationType.SingleLineComment;
                                state.HasUnprocessedCurrentCharacter = false; //DISCARDING the hyphen because of weird standard
                            } else if (state.CurrentChar === 61) {
                                state.CurrentTokenizationType = PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.SqlTokenizationType.OtherOperator;
                                state.CurrentTokenValue.append(String.fromCharCode(45));
                                PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.AppendCharAndCompleteToken(state);
                            } else {
                                state.CurrentTokenizationType = PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.SqlTokenizationType.OtherOperator;
                                state.CurrentTokenValue.append(String.fromCharCode(45));
                                PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.CompleteTokenAndProcessNext(state);
                            }
                            break;
                        case PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.SqlTokenizationType.SingleSlash: 
                            if (state.CurrentChar === 42) {
                                state.CurrentTokenizationType = PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.SqlTokenizationType.BlockComment;
                                state.HasUnprocessedCurrentCharacter = false; //DISCARDING the asterisk because of weird standard
                                state.CommentNesting = (state.CommentNesting + 1) | 0;
                            } else if (state.CurrentChar === 47) {
                                state.CurrentTokenizationType = PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.SqlTokenizationType.SingleLineCommentCStyle;
                                state.HasUnprocessedCurrentCharacter = false; //DISCARDING the slash because of weird standard
                            } else if (state.CurrentChar === 61) {
                                state.CurrentTokenizationType = PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.SqlTokenizationType.OtherOperator;
                                state.CurrentTokenValue.append(String.fromCharCode(47));
                                PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.AppendCharAndCompleteToken(state);
                            } else {
                                state.CurrentTokenizationType = PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.SqlTokenizationType.OtherOperator;
                                state.CurrentTokenValue.append(String.fromCharCode(47));
                                PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.CompleteTokenAndProcessNext(state);
                            }
                            break;
                        case PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.SqlTokenizationType.SingleLineComment: 
                        case PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.SqlTokenizationType.SingleLineCommentCStyle: 
                            if (state.CurrentChar === 13 || state.CurrentChar === 10) {
                                var nextCharInt = state.InputReader.Peek();
                                if (state.CurrentChar === 13 && nextCharInt === 10) {
                                    state.ConsumeCurrentCharacterIntoToken();
                                    state.ReadNextCharacter();
                                }
                                PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.AppendCharAndCompleteToken(state);
                            } else {
                                state.ConsumeCurrentCharacterIntoToken();
                            }
                            break;
                        case PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.SqlTokenizationType.BlockComment: 
                            if (state.CurrentChar === 42) {
                                if (state.InputReader.Peek() === 47) {
                                    state.CommentNesting = (state.CommentNesting - 1) | 0;
                                    if (state.CommentNesting > 0) {
                                        state.ConsumeCurrentCharacterIntoToken();
                                        state.ReadNextCharacter();
                                        state.ConsumeCurrentCharacterIntoToken();
                                    } else {
                                        state.HasUnprocessedCurrentCharacter = false; //discarding the asterisk
                                        state.ReadNextCharacter();
                                        //TODO: DANGER DANGER why do "contained" token types have this inconsistent handling where the delimiters are not in the value???
                                        PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.SwallowOutstandingCharacterAndCompleteToken(state);
                                    }
                                } else {
                                    state.ConsumeCurrentCharacterIntoToken();
                                }
                            } else {
                                if (state.CurrentChar === 47 && state.InputReader.Peek() === 42) {
                                    state.ConsumeCurrentCharacterIntoToken();
                                    state.ReadNextCharacter();
                                    state.ConsumeCurrentCharacterIntoToken();
                                    state.CommentNesting = (state.CommentNesting + 1) | 0;
                                } else {
                                    state.ConsumeCurrentCharacterIntoToken();
                                }
                            }
                            break;
                        case PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.SqlTokenizationType.OtherNode: 
                        case PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.SqlTokenizationType.PseudoName: 
                            if (PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.IsNonWordCharacter(state.CurrentChar)) {
                                PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.CompleteTokenAndProcessNext(state);
                            } else {
                                state.ConsumeCurrentCharacterIntoToken();
                            }
                            break;
                        case PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.SqlTokenizationType.SingleN: 
                            if (state.CurrentChar === 39) {
                                state.CurrentTokenizationType = PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.SqlTokenizationType.NString;
                                state.HasUnprocessedCurrentCharacter = false; //DISCARDING the apostrophe because of weird standard
                            } else {
                                if (PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.IsNonWordCharacter(state.CurrentChar)) {
                                    PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.CompleteTokenAndProcessNext(state);
                                } else {
                                    state.CurrentTokenizationType = PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.SqlTokenizationType.OtherNode;
                                    state.CurrentTokenValue.append(String.fromCharCode(78));
                                    state.ConsumeCurrentCharacterIntoToken();
                                }
                            }
                            break;
                        case PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.SqlTokenizationType.NString: 
                        case PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.SqlTokenizationType.String: 
                            if (state.CurrentChar === 39) {
                                if (state.InputReader.Peek() === 39) {
                                    //add the character (once)
                                    state.ConsumeCurrentCharacterIntoToken();

                                    //throw away the second character... because (for some reason?) we're storing the effective value" rather than the raw token...
                                    state.DiscardNextCharacter();
                                } else {
                                    //TODO: DANGER DANGER why do "contained" token types have this inconsistent handling where the delimiters are not in the value???
                                    PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.SwallowOutstandingCharacterAndCompleteToken(state);
                                }
                            } else {
                                state.ConsumeCurrentCharacterIntoToken();
                            }
                            break;
                        case PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.SqlTokenizationType.QuotedString: 
                            if (state.CurrentChar === 34) {
                                if (state.InputReader.Peek() === 34) {
                                    //add the character (once)
                                    state.ConsumeCurrentCharacterIntoToken();

                                    //throw away the second character... because (for some reason?) we're storing the effective value" rather than the raw token...
                                    state.DiscardNextCharacter();
                                } else {
                                    //TODO: DANGER DANGER why do "contained" token types have this inconsistent handling where the delimiters are not in the value???
                                    PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.SwallowOutstandingCharacterAndCompleteToken(state);
                                }
                            } else {
                                state.ConsumeCurrentCharacterIntoToken();
                            }
                            break;
                        case PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.SqlTokenizationType.BracketQuotedName: 
                            if (state.CurrentChar === 93) {
                                if (state.InputReader.Peek() === 93) {
                                    //add the character (once)
                                    state.ConsumeCurrentCharacterIntoToken();

                                    //throw away the second character... because (for some reason?) we're storing the effective value" rather than the raw token...
                                    state.DiscardNextCharacter();
                                } else {
                                    //TODO: DANGER DANGER why do "contained" token types have this inconsistent handling where the delimiters are not in the value???
                                    PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.SwallowOutstandingCharacterAndCompleteToken(state);
                                }
                            } else {
                                state.ConsumeCurrentCharacterIntoToken();
                            }
                            break;
                        case PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.SqlTokenizationType.SingleLT: 
                            state.CurrentTokenValue.append(String.fromCharCode(60));
                            state.CurrentTokenizationType = PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.SqlTokenizationType.OtherOperator;
                            if (state.CurrentChar === 61 || state.CurrentChar === 62 || state.CurrentChar === 60) {
                                PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.AppendCharAndCompleteToken(state);
                            } else {
                                PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.CompleteTokenAndProcessNext(state);
                            }
                            break;
                        case PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.SqlTokenizationType.SingleGT: 
                            state.CurrentTokenValue.append(String.fromCharCode(62));
                            state.CurrentTokenizationType = PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.SqlTokenizationType.OtherOperator;
                            if (state.CurrentChar === 61 || state.CurrentChar === 62) {
                                PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.AppendCharAndCompleteToken(state);
                            } else {
                                PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.CompleteTokenAndProcessNext(state);
                            }
                            break;
                        case PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.SqlTokenizationType.SingleAsterisk: 
                            state.CurrentTokenValue.append(String.fromCharCode(42));
                            if (state.CurrentChar === 61) {
                                state.CurrentTokenizationType = PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.SqlTokenizationType.OtherOperator;
                                PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.AppendCharAndCompleteToken(state);
                            } else {
                                PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.CompleteTokenAndProcessNext(state);
                            }
                            break;
                        case PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.SqlTokenizationType.SingleOtherCompoundableOperator: 
                            state.CurrentTokenizationType = PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.SqlTokenizationType.OtherOperator;
                            if (state.CurrentChar === 61) {
                                PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.AppendCharAndCompleteToken(state);
                            } else {
                                PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.CompleteTokenAndProcessNext(state);
                            }
                            break;
                        case PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.SqlTokenizationType.SinglePipe: 
                            state.CurrentTokenizationType = PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.SqlTokenizationType.OtherOperator;
                            state.CurrentTokenValue.append(String.fromCharCode(124));
                            if (state.CurrentChar === 61 || state.CurrentChar === 124) {
                                PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.AppendCharAndCompleteToken(state);
                            } else {
                                PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.CompleteTokenAndProcessNext(state);
                            }
                            break;
                        case PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.SqlTokenizationType.SingleEquals: 
                            state.CurrentTokenValue.append(String.fromCharCode(61));
                            if (state.CurrentChar === 61) {
                                PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.AppendCharAndCompleteToken(state);
                            } else {
                                PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.CompleteTokenAndProcessNext(state);
                            }
                            break;
                        case PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.SqlTokenizationType.SingleExclamation: 
                            state.CurrentTokenValue.append(String.fromCharCode(33));
                            if (state.CurrentChar === 61 || state.CurrentChar === 60 || state.CurrentChar === 62) {
                                state.CurrentTokenizationType = PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.SqlTokenizationType.OtherOperator;
                                PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.AppendCharAndCompleteToken(state);
                            } else {
                                state.CurrentTokenizationType = PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.SqlTokenizationType.OtherNode;
                                PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.CompleteTokenAndProcessNext(state);
                            }
                            break;
                        default: 
                            throw new System.Exception("In-progress node unrecognized!");
                    }

                    state.ReadNextCharacter();
                }


                if (state.CurrentTokenizationType != null) {
                    if (System.Nullable.getValue(state.CurrentTokenizationType) === PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.SqlTokenizationType.BlockComment || System.Nullable.getValue(state.CurrentTokenizationType) === PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.SqlTokenizationType.String || System.Nullable.getValue(state.CurrentTokenizationType) === PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.SqlTokenizationType.NString || System.Nullable.getValue(state.CurrentTokenizationType) === PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.SqlTokenizationType.QuotedString || System.Nullable.getValue(state.CurrentTokenizationType) === PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.SqlTokenizationType.BracketQuotedName) {
                        state.TokenContainer.HasUnfinishedToken = true;
                    }

                    PoorMansTSqlFormatterLib.Tokenizers.TSqlStandardTokenizer.SwallowOutstandingCharacterAndCompleteToken(state);
                }

                return state.TokenContainer;
            }
        }
    });

    Bridge.define("PoorMansTSqlFormatterLib.ParseTree", {
        inherits: [PoorMansTSqlFormatterLib.ParseStructure.NodeImpl,PoorMansTSqlFormatterLib.ParseStructure.Node],
        statics: {
            methods: {
                HasNonWhiteSpaceNonSingleCommentContent: function (containerNode) {
                    var $t;
                    $t = Bridge.getEnumerator(containerNode.PoorMansTSqlFormatterLib$ParseStructure$Node$Children, PoorMansTSqlFormatterLib.ParseStructure.Node);
                    try {
                        while ($t.moveNext()) {
                            var testElement = $t.Current;
                            if (!System.String.equals(testElement.PoorMansTSqlFormatterLib$ParseStructure$Node$Name, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_WHITESPACE) && !System.String.equals(testElement.PoorMansTSqlFormatterLib$ParseStructure$Node$Name, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_COMMENT_SINGLELINE) && !System.String.equals(testElement.PoorMansTSqlFormatterLib$ParseStructure$Node$Name, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_COMMENT_SINGLELINE_CSTYLE) && (!System.String.equals(testElement.PoorMansTSqlFormatterLib$ParseStructure$Node$Name, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_COMMENT_MULTILINE) || System.Text.RegularExpressions.Regex.isMatch(testElement.PoorMansTSqlFormatterLib$ParseStructure$Node$TextValue, "(\\r|\\n)+"))) {
                                return true;
                            }
                        }
                    } finally {
                        if (Bridge.is($t, System.IDisposable)) {
                            $t.System$IDisposable$dispose();
                        }
                    }
                    return false;
                }
            }
        },
        fields: {
            _currentContainer: null,
            _newStatementDue: false
        },
        props: {
            CurrentContainer: {
                get: function () {
                    return this._currentContainer;
                },
                set: function (value) {
                    if (value == null) {
                        throw new System.ArgumentNullException("CurrentContainer");
                    }

                    if (!Bridge.equals(PoorMansTSqlFormatterLib.ParseStructure.NodeExtensions.RootContainer(value), this)) {
                        throw new System.Exception("Current Container node can only be set to an element in the current document.");
                    }

                    this._currentContainer = value;
                }
            },
            NewStatementDue: {
                get: function () {
                    return this._newStatementDue;
                },
                set: function (value) {
                    this._newStatementDue = value;
                }
            },
            ErrorFound: {
                get: function () {
                    return this._newStatementDue;
                },
                set: function (value) {
                    if (value) {
                        this.SetAttribute(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ANAME_ERRORFOUND, "1");
                    } else {
                        this.RemoveAttribute(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ANAME_ERRORFOUND);
                    }
                }
            }
        },
        ctors: {
            ctor: function (rootName) {
                this.$initialize();
                PoorMansTSqlFormatterLib.ParseStructure.NodeImpl.ctor.call(this);
                this.Name = rootName;
                this.CurrentContainer = this;
            }
        },
        methods: {
            SetError: function () {
                this.CurrentContainer.PoorMansTSqlFormatterLib$ParseStructure$Node$SetAttribute(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ANAME_HASERROR, "1");
                this.ErrorFound = true;
            },
            SaveNewElement: function (newElementName, newElementValue) {
                return this.SaveNewElement$1(newElementName, newElementValue, this.CurrentContainer);
            },
            SaveNewElement$1: function (newElementName, newElementValue, targetNode) {
                var newElement = PoorMansTSqlFormatterLib.ParseStructure.NodeFactory.CreateNode(newElementName, newElementValue);
                targetNode.PoorMansTSqlFormatterLib$ParseStructure$Node$AddChild(newElement);
                return newElement;
            },
            SaveNewElementWithError: function (newElementName, newElementValue) {
                var newElement = this.SaveNewElement(newElementName, newElementValue);
                this.SetError();
                return newElement;
            },
            SaveNewElementAsPriorSibling: function (newElementName, newElementValue, nodeToSaveBefore) {
                var newElement = PoorMansTSqlFormatterLib.ParseStructure.NodeFactory.CreateNode(newElementName, newElementValue);
                nodeToSaveBefore.PoorMansTSqlFormatterLib$ParseStructure$Node$Parent.PoorMansTSqlFormatterLib$ParseStructure$Node$InsertChildBefore(newElement, nodeToSaveBefore);
                return newElement;
            },
            StartNewContainer: function (newElementName, containerOpenValue, containerType) {
                this.CurrentContainer = this.SaveNewElement(newElementName, "");
                var containerOpen = this.SaveNewElement(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CONTAINER_OPEN, "");
                this.SaveNewElement$1(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_OTHERKEYWORD, containerOpenValue, containerOpen);
                this.CurrentContainer = this.SaveNewElement(containerType, "");
            },
            StartNewStatement: function () {
                this.StartNewStatement$1(this.CurrentContainer);
            },
            StartNewStatement$1: function (targetNode) {
                this.NewStatementDue = false;
                var newStatement = this.SaveNewElement$1(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_SQL_STATEMENT, "", targetNode);
                this.CurrentContainer = this.SaveNewElement$1(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_SQL_CLAUSE, "", newStatement);
            },
            EscapeAnyBetweenConditions: function () {
                if (this.PathNameMatches$1(0, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_BETWEEN_UPPERBOUND) && this.PathNameMatches$1(1, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_BETWEEN_CONDITION)) {
                    //we just ended the upper bound of a "BETWEEN" condition, need to pop back to the enclosing context
                    this.MoveToAncestorContainer(2);
                }
            },
            EscapeMergeAction: function () {
                if (this.PathNameMatches$1(0, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_SQL_CLAUSE) && this.PathNameMatches$1(1, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_SQL_STATEMENT) && this.PathNameMatches$1(2, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_MERGE_ACTION) && this.HasNonWhiteSpaceNonCommentContent(this.CurrentContainer)) {
                    this.MoveToAncestorContainer(4);
                }
            },
            EscapePartialStatementContainers: function () {
                if (this.PathNameMatches$1(0, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_DDL_PROCEDURAL_BLOCK) || this.PathNameMatches$1(0, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_DDL_OTHER_BLOCK) || this.PathNameMatches$1(0, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_DDL_DECLARE_BLOCK)) {
                    this.MoveToAncestorContainer(1);
                } else {
                    if (this.PathNameMatches$1(0, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CONTAINER_GENERALCONTENT) && this.PathNameMatches$1(1, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CURSOR_FOR_OPTIONS)) {
                        this.MoveToAncestorContainer(3);
                    } else {
                        if (this.PathNameMatches$1(0, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CONTAINER_GENERALCONTENT) && this.PathNameMatches$1(1, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_PERMISSIONS_RECIPIENT)) {
                            this.MoveToAncestorContainer(3);
                        } else {
                            if (this.PathNameMatches$1(0, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CONTAINER_GENERALCONTENT) && this.PathNameMatches$1(1, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_DDL_WITH_CLAUSE) && (this.PathNameMatches$1(2, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_PERMISSIONS_BLOCK) || this.PathNameMatches$1(2, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_DDL_PROCEDURAL_BLOCK) || this.PathNameMatches$1(2, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_DDL_OTHER_BLOCK) || this.PathNameMatches$1(2, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_DDL_DECLARE_BLOCK))) {
                                this.MoveToAncestorContainer(3);
                            } else {
                                if (this.PathNameMatches$1(0, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_MERGE_WHEN)) {
                                    this.MoveToAncestorContainer(2);
                                } else {
                                    if (this.PathNameMatches$1(0, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CONTAINER_GENERALCONTENT) && (this.PathNameMatches$1(1, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CTE_WITH_CLAUSE) || this.PathNameMatches$1(1, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_DDL_DECLARE_BLOCK))) {
                                        this.MoveToAncestorContainer(2);
                                    }
                                }
                            }
                        }
                    }
                }
            },
            EscapeAnySingleOrPartialStatementContainers: function () {
                this.EscapeAnyBetweenConditions();
                this.EscapeAnySelectionTarget();
                this.EscapeJoinCondition();

                if (this.HasNonWhiteSpaceNonCommentContent(this.CurrentContainer)) {
                    this.EscapeCursorForBlock();
                    this.EscapeMergeAction();
                    this.EscapePartialStatementContainers();

                    while (true) {
                        if (this.PathNameMatches$1(0, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_SQL_CLAUSE) && this.PathNameMatches$1(1, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_SQL_STATEMENT) && this.PathNameMatches$1(2, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CONTAINER_SINGLESTATEMENT)) {
                            var currentSingleContainer = this.CurrentContainer.PoorMansTSqlFormatterLib$ParseStructure$Node$Parent.PoorMansTSqlFormatterLib$ParseStructure$Node$Parent;
                            if (this.PathNameMatches(currentSingleContainer, 1, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_ELSE_CLAUSE)) {
                                //we just ended the one and only statement in an else clause, and need to pop out to the same level as its parent if
                                // singleContainer.else.if.CANDIDATE
                                this.CurrentContainer = currentSingleContainer.PoorMansTSqlFormatterLib$ParseStructure$Node$Parent.PoorMansTSqlFormatterLib$ParseStructure$Node$Parent.PoorMansTSqlFormatterLib$ParseStructure$Node$Parent;
                            } else {
                                //we just ended the one statement of an if or while, and need to pop out the same level as that if or while
                                // singleContainer.(if or while).CANDIDATE
                                this.CurrentContainer = currentSingleContainer.PoorMansTSqlFormatterLib$ParseStructure$Node$Parent.PoorMansTSqlFormatterLib$ParseStructure$Node$Parent;
                            }
                        } else {
                            break;
                        }
                    }
                }
            },
            EscapeCursorForBlock: function () {
                if (this.PathNameMatches$1(0, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_SQL_CLAUSE) && this.PathNameMatches$1(1, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_SQL_STATEMENT) && this.PathNameMatches$1(2, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CONTAINER_GENERALCONTENT) && this.PathNameMatches$1(3, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CURSOR_FOR_BLOCK) && this.HasNonWhiteSpaceNonCommentContent(this.CurrentContainer)) {
                    this.MoveToAncestorContainer(5);
                }
            },
            EscapeAndLocateNextStatementContainer: function (escapeEmptyContainer) {
                this.EscapeAnySingleOrPartialStatementContainers();

                if (this.PathNameMatches$1(0, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_BOOLEAN_EXPRESSION) && (this.PathNameMatches$1(1, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_IF_STATEMENT) || this.PathNameMatches$1(1, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_WHILE_LOOP))) {
                    //we just ended the boolean clause of an if or while, and need to pop to the single-statement container.
                    return this.SaveNewElement$1(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CONTAINER_SINGLESTATEMENT, "", this.CurrentContainer.PoorMansTSqlFormatterLib$ParseStructure$Node$Parent);
                } else if (this.PathNameMatches$1(0, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_SQL_CLAUSE) && this.PathNameMatches$1(1, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_SQL_STATEMENT) && (escapeEmptyContainer || PoorMansTSqlFormatterLib.ParseTree.HasNonWhiteSpaceNonSingleCommentContent(this.CurrentContainer))) {
                    return this.CurrentContainer.PoorMansTSqlFormatterLib$ParseStructure$Node$Parent.PoorMansTSqlFormatterLib$ParseStructure$Node$Parent;
                } else {
                    return null;
                }
            },
            MigrateApplicableCommentsFromContainer: function (previousContainerElement) {
                var migrationContext = previousContainerElement;
                var migrationCandidate = System.Linq.Enumerable.from(previousContainerElement.PoorMansTSqlFormatterLib$ParseStructure$Node$Children).last();

                //keep track of where we're going to be prepending - this will change as we go moving stuff.
                var insertBeforeNode = this.CurrentContainer;

                while (migrationCandidate != null) {
                    if (System.String.equals(migrationCandidate.PoorMansTSqlFormatterLib$ParseStructure$Node$Name, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_WHITESPACE)) {
                        migrationCandidate = PoorMansTSqlFormatterLib.ParseStructure.NodeExtensions.PreviousSibling(migrationCandidate);
                        continue;
                    } else if (PoorMansTSqlFormatterLib.ParseStructure.NodeExtensions.PreviousSibling(migrationCandidate) != null && System.Array.contains(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAMELIST_COMMENT, migrationCandidate.PoorMansTSqlFormatterLib$ParseStructure$Node$Name, System.String) && System.Array.contains(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAMELIST_NONCONTENT, PoorMansTSqlFormatterLib.ParseStructure.NodeExtensions.PreviousSibling(migrationCandidate).PoorMansTSqlFormatterLib$ParseStructure$Node$Name, System.String)) {
                        if (System.String.equals(PoorMansTSqlFormatterLib.ParseStructure.NodeExtensions.PreviousSibling(migrationCandidate).PoorMansTSqlFormatterLib$ParseStructure$Node$Name, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_WHITESPACE) && System.Text.RegularExpressions.Regex.isMatch(PoorMansTSqlFormatterLib.ParseStructure.NodeExtensions.PreviousSibling(migrationCandidate).PoorMansTSqlFormatterLib$ParseStructure$Node$TextValue, "(\\r|\\n)+")) {
                            //we have a match, so migrate everything considered so far (backwards from the end). need to keep track of where we're inserting.
                            while (!Bridge.equals(System.Linq.Enumerable.from(migrationContext.PoorMansTSqlFormatterLib$ParseStructure$Node$Children).last(), migrationCandidate)) {
                                var movingNode = System.Linq.Enumerable.from(migrationContext.PoorMansTSqlFormatterLib$ParseStructure$Node$Children).last();
                                movingNode.PoorMansTSqlFormatterLib$ParseStructure$Node$Parent.PoorMansTSqlFormatterLib$ParseStructure$Node$RemoveChild(movingNode);
                                this.CurrentContainer.PoorMansTSqlFormatterLib$ParseStructure$Node$Parent.PoorMansTSqlFormatterLib$ParseStructure$Node$InsertChildBefore(movingNode, insertBeforeNode);
                                insertBeforeNode = movingNode;
                            }
                            migrationCandidate.PoorMansTSqlFormatterLib$ParseStructure$Node$Parent.PoorMansTSqlFormatterLib$ParseStructure$Node$RemoveChild(migrationCandidate);
                            this.CurrentContainer.PoorMansTSqlFormatterLib$ParseStructure$Node$Parent.PoorMansTSqlFormatterLib$ParseStructure$Node$InsertChildBefore(migrationCandidate, insertBeforeNode);
                            insertBeforeNode = migrationCandidate;

                            //move on to the next candidate element for consideration.
                            migrationCandidate = System.Linq.Enumerable.from(migrationContext.PoorMansTSqlFormatterLib$ParseStructure$Node$Children).last();
                        } else {
                            //this one wasn't properly separated from the previous node/entry, keep going in case there's a linebreak further up.
                            migrationCandidate = PoorMansTSqlFormatterLib.ParseStructure.NodeExtensions.PreviousSibling(migrationCandidate);
                        }
                    } else if (!System.String.isNullOrEmpty(migrationCandidate.PoorMansTSqlFormatterLib$ParseStructure$Node$TextValue)) {
                        //we found a non-whitespace non-comment node with text content. Stop trying to migrate comments.
                        migrationCandidate = null;
                    } else {
                        //walk up the last found node, in case the comment got trapped in some substructure.
                        migrationContext = migrationCandidate;
                        migrationCandidate = System.Linq.Enumerable.from(migrationCandidate.PoorMansTSqlFormatterLib$ParseStructure$Node$Children).lastOrDefault(null, null);
                    }
                }
            },
            ConsiderStartingNewStatement: function () {
                this.EscapeAnyBetweenConditions();
                this.EscapeAnySelectionTarget();
                this.EscapeJoinCondition();

                //before single-statement-escaping
                var previousContainerElement = this.CurrentContainer;

                //context might change AND suitable ancestor selected
                var nextStatementContainer = this.EscapeAndLocateNextStatementContainer(false);

                //if suitable ancestor found, start statement and migrate in-between comments to the new statement
                if (nextStatementContainer != null) {
                    var inBetweenContainerElement = this.CurrentContainer;
                    this.StartNewStatement$1(nextStatementContainer);
                    if (!Bridge.equals(inBetweenContainerElement, previousContainerElement)) {
                        this.MigrateApplicableCommentsFromContainer(inBetweenContainerElement);
                    }
                    this.MigrateApplicableCommentsFromContainer(previousContainerElement);
                }
            },
            ConsiderStartingNewClause: function () {
                this.EscapeAnySelectionTarget();
                this.EscapeAnyBetweenConditions();
                this.EscapePartialStatementContainers();
                this.EscapeJoinCondition();

                if (System.String.equals(this.CurrentContainer.PoorMansTSqlFormatterLib$ParseStructure$Node$Name, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_SQL_CLAUSE) && PoorMansTSqlFormatterLib.ParseTree.HasNonWhiteSpaceNonSingleCommentContent(this.CurrentContainer)) {
                    //complete current clause, start a new one in the same container
                    var previousContainerElement = this.CurrentContainer;
                    this.CurrentContainer = this.SaveNewElement$1(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_SQL_CLAUSE, "", this.CurrentContainer.PoorMansTSqlFormatterLib$ParseStructure$Node$Parent);
                    this.MigrateApplicableCommentsFromContainer(previousContainerElement);
                } else if (System.String.equals(this.CurrentContainer.PoorMansTSqlFormatterLib$ParseStructure$Node$Name, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_EXPRESSION_PARENS) || System.String.equals(this.CurrentContainer.PoorMansTSqlFormatterLib$ParseStructure$Node$Name, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_IN_PARENS) || System.String.equals(this.CurrentContainer.PoorMansTSqlFormatterLib$ParseStructure$Node$Name, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_SELECTIONTARGET_PARENS) || System.String.equals(this.CurrentContainer.PoorMansTSqlFormatterLib$ParseStructure$Node$Name, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_SQL_STATEMENT)) {
                    //create new clause and set context to it.
                    this.CurrentContainer = this.SaveNewElement(PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_SQL_CLAUSE, "");
                }
            },
            EscapeAnySelectionTarget: function () {
                if (this.PathNameMatches$1(0, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_SELECTIONTARGET)) {
                    this.CurrentContainer = this.CurrentContainer.PoorMansTSqlFormatterLib$ParseStructure$Node$Parent;
                }
            },
            EscapeJoinCondition: function () {
                if (this.PathNameMatches$1(0, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CONTAINER_GENERALCONTENT) && this.PathNameMatches$1(1, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_JOIN_ON_SECTION)) {
                    this.MoveToAncestorContainer(2);
                }
            },
            FindValidBatchEnd: function () {
                var nextStatementContainer = this.EscapeAndLocateNextStatementContainer(true);
                return nextStatementContainer != null && (System.String.equals(nextStatementContainer.PoorMansTSqlFormatterLib$ParseStructure$Node$Name, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_SQL_ROOT) || (System.String.equals(nextStatementContainer.PoorMansTSqlFormatterLib$ParseStructure$Node$Name, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_CONTAINER_GENERALCONTENT) && System.String.equals(nextStatementContainer.PoorMansTSqlFormatterLib$ParseStructure$Node$Parent.PoorMansTSqlFormatterLib$ParseStructure$Node$Name, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAME_DDL_AS_BLOCK)));
            },
            PathNameMatches$1: function (levelsUp, nameToMatch) {
                return this.PathNameMatches(this.CurrentContainer, levelsUp, nameToMatch);
            },
            PathNameMatches: function (targetNode, levelsUp, nameToMatch) {
                var currentNode = targetNode;
                while (levelsUp > 0) {
                    currentNode = currentNode.PoorMansTSqlFormatterLib$ParseStructure$Node$Parent;
                    levelsUp = (levelsUp - 1) | 0;
                }
                return currentNode != null && System.String.equals(currentNode.PoorMansTSqlFormatterLib$ParseStructure$Node$Name, nameToMatch);
            },
            HasNonWhiteSpaceNonCommentContent: function (containerNode) {
                return System.Linq.Enumerable.from(PoorMansTSqlFormatterLib.ParseStructure.NodeExtensions.ChildrenExcludingNames(containerNode, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAMELIST_NONCONTENT)).any();
            },
            GetFirstNonWhitespaceNonCommentChildElement: function (targetElement) {
                return System.Linq.Enumerable.from(PoorMansTSqlFormatterLib.ParseStructure.NodeExtensions.ChildrenExcludingNames(targetElement, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAMELIST_NONCONTENT)).firstOrDefault(null, null);
            },
            GetLastNonWhitespaceNonCommentChildElement: function (targetElement) {
                return System.Linq.Enumerable.from(PoorMansTSqlFormatterLib.ParseStructure.NodeExtensions.ChildrenExcludingNames(targetElement, PoorMansTSqlFormatterLib.Interfaces.SqlStructureConstants.ENAMELIST_NONCONTENT)).lastOrDefault(null, null);
            },
            MoveToAncestorContainer: function (levelsUp) {
                this.MoveToAncestorContainer$1(levelsUp, null);
            },
            MoveToAncestorContainer$1: function (levelsUp, targetContainerName) {
                var candidateContainer = this.CurrentContainer;
                while (levelsUp > 0) {
                    candidateContainer = candidateContainer.PoorMansTSqlFormatterLib$ParseStructure$Node$Parent;
                    levelsUp = (levelsUp - 1) | 0;
                }
                if (System.String.isNullOrEmpty(targetContainerName) || System.String.equals(candidateContainer.PoorMansTSqlFormatterLib$ParseStructure$Node$Name, targetContainerName)) {
                    this.CurrentContainer = candidateContainer;
                } else {
                    throw new System.Exception("Ancestor node does not match expected name!");
                }
            }
        }
    });

    Bridge.define("PoorMansTSqlFormatterLib.TokenList", {
        inherits: [System.Collections.Generic.List$1(PoorMansTSqlFormatterLib.Interfaces.IToken),PoorMansTSqlFormatterLib.Interfaces.ITokenList],
        props: {
            HasUnfinishedToken: false,
            MarkerToken: null,
            MarkerPosition: null
        },
        alias: [
            "HasUnfinishedToken", "PoorMansTSqlFormatterLib$Interfaces$ITokenList$HasUnfinishedToken",
            "prettyPrint", "PoorMansTSqlFormatterLib$Interfaces$ITokenList$prettyPrint",
            "getRange$2", "PoorMansTSqlFormatterLib$Interfaces$ITokenList$getRange",
            "getRangeByIndex", "PoorMansTSqlFormatterLib$Interfaces$ITokenList$getRangeByIndex",
            "MarkerToken", "PoorMansTSqlFormatterLib$Interfaces$ITokenList$MarkerToken",
            "MarkerPosition", "PoorMansTSqlFormatterLib$Interfaces$ITokenList$MarkerPosition",
            "getEnumerator", "System$Collections$IEnumerable$getEnumerator"
        ],
        methods: {
            prettyPrint: function () {
                var $t;
                var outString = new System.Text.StringBuilder();
                $t = Bridge.getEnumerator(this);
                try {
                    while ($t.moveNext()) {
                        var contentToken = $t.Current;
                        var tokenType = System.Enum.toString(PoorMansTSqlFormatterLib.Interfaces.SqlTokenType, contentToken.PoorMansTSqlFormatterLib$Interfaces$IToken$Type);
                        outString.append(System.String.alignString(tokenType, -20));
                        outString.append(": ");
                        outString.append(contentToken.PoorMansTSqlFormatterLib$Interfaces$IToken$Value);
                        if (Bridge.equals(contentToken, this.MarkerToken)) {
                            outString.append(" (MARKER - pos ");
                            outString.append(System.Nullable.toString(this.MarkerPosition, null));
                            outString.append(")");
                        }
                        outString.appendLine();
                    }
                } finally {
                    if (Bridge.is($t, System.IDisposable)) {
                        $t.System$IDisposable$dispose();
                    }
                }return outString.toString();
            },
            getRange$2: function (index, count) {
                return this.getRange(index, count);
            },
            getRangeByIndex: function (fromIndex, toIndex) {
                return this.getRange$2(fromIndex, ((((toIndex - fromIndex) | 0) + 1) | 0));
            }
        }
    });
});
