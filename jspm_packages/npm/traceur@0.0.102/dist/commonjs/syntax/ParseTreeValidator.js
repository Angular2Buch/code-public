/* */ 
"use strict";
var $___46__46__47_syntax_47_trees_47_ParseTrees_46_js__,
    $__ParseTreeVisitor_46_js__,
    $___46__46__47_outputgeneration_47_TreeWriter_46_js__,
    $__TokenType_46_js__,
    $__trees_47_ParseTreeType_46_js__,
    $___46__46__47_util_47_assert_46_js__;
var NewExpression = ($___46__46__47_syntax_47_trees_47_ParseTrees_46_js__ = require('./trees/ParseTrees'), $___46__46__47_syntax_47_trees_47_ParseTrees_46_js__ && $___46__46__47_syntax_47_trees_47_ParseTrees_46_js__.__esModule && $___46__46__47_syntax_47_trees_47_ParseTrees_46_js__ || {default: $___46__46__47_syntax_47_trees_47_ParseTrees_46_js__}).NewExpression;
var ParseTreeVisitor = ($__ParseTreeVisitor_46_js__ = require('./ParseTreeVisitor'), $__ParseTreeVisitor_46_js__ && $__ParseTreeVisitor_46_js__.__esModule && $__ParseTreeVisitor_46_js__ || {default: $__ParseTreeVisitor_46_js__}).ParseTreeVisitor;
var TreeWriter = ($___46__46__47_outputgeneration_47_TreeWriter_46_js__ = require('../outputgeneration/TreeWriter'), $___46__46__47_outputgeneration_47_TreeWriter_46_js__ && $___46__46__47_outputgeneration_47_TreeWriter_46_js__.__esModule && $___46__46__47_outputgeneration_47_TreeWriter_46_js__ || {default: $___46__46__47_outputgeneration_47_TreeWriter_46_js__}).TreeWriter;
var $__3 = ($__TokenType_46_js__ = require('./TokenType'), $__TokenType_46_js__ && $__TokenType_46_js__.__esModule && $__TokenType_46_js__ || {default: $__TokenType_46_js__}),
    AMPERSAND = $__3.AMPERSAND,
    AMPERSAND_EQUAL = $__3.AMPERSAND_EQUAL,
    AND = $__3.AND,
    BAR = $__3.BAR,
    BAR_EQUAL = $__3.BAR_EQUAL,
    CARET = $__3.CARET,
    CARET_EQUAL = $__3.CARET_EQUAL,
    CLOSE_ANGLE = $__3.CLOSE_ANGLE,
    EQUAL = $__3.EQUAL,
    EQUAL_EQUAL = $__3.EQUAL_EQUAL,
    EQUAL_EQUAL_EQUAL = $__3.EQUAL_EQUAL_EQUAL,
    GREATER_EQUAL = $__3.GREATER_EQUAL,
    IDENTIFIER = $__3.IDENTIFIER,
    IN = $__3.IN,
    INSTANCEOF = $__3.INSTANCEOF,
    LEFT_SHIFT = $__3.LEFT_SHIFT,
    LEFT_SHIFT_EQUAL = $__3.LEFT_SHIFT_EQUAL,
    LESS_EQUAL = $__3.LESS_EQUAL,
    MINUS = $__3.MINUS,
    MINUS_EQUAL = $__3.MINUS_EQUAL,
    NOT_EQUAL = $__3.NOT_EQUAL,
    NOT_EQUAL_EQUAL = $__3.NOT_EQUAL_EQUAL,
    NUMBER = $__3.NUMBER,
    OPEN_ANGLE = $__3.OPEN_ANGLE,
    OR = $__3.OR,
    PERCENT = $__3.PERCENT,
    PERCENT_EQUAL = $__3.PERCENT_EQUAL,
    PLUS = $__3.PLUS,
    PLUS_EQUAL = $__3.PLUS_EQUAL,
    RIGHT_SHIFT = $__3.RIGHT_SHIFT,
    RIGHT_SHIFT_EQUAL = $__3.RIGHT_SHIFT_EQUAL,
    SLASH = $__3.SLASH,
    SLASH_EQUAL = $__3.SLASH_EQUAL,
    STAR = $__3.STAR,
    STAR_EQUAL = $__3.STAR_EQUAL,
    STAR_STAR = $__3.STAR_STAR,
    STAR_STAR_EQUAL = $__3.STAR_STAR_EQUAL,
    STRING = $__3.STRING,
    UNSIGNED_RIGHT_SHIFT = $__3.UNSIGNED_RIGHT_SHIFT,
    UNSIGNED_RIGHT_SHIFT_EQUAL = $__3.UNSIGNED_RIGHT_SHIFT_EQUAL,
    YIELD = $__3.YIELD;
var $__4 = ($__trees_47_ParseTreeType_46_js__ = require('./trees/ParseTreeType'), $__trees_47_ParseTreeType_46_js__ && $__trees_47_ParseTreeType_46_js__.__esModule && $__trees_47_ParseTreeType_46_js__ || {default: $__trees_47_ParseTreeType_46_js__}),
    ARRAY_PATTERN = $__4.ARRAY_PATTERN,
    ASSIGNMENT_ELEMENT = $__4.ASSIGNMENT_ELEMENT,
    BINDING_ELEMENT = $__4.BINDING_ELEMENT,
    BINDING_IDENTIFIER = $__4.BINDING_IDENTIFIER,
    BLOCK = $__4.BLOCK,
    CASE_CLAUSE = $__4.CASE_CLAUSE,
    CATCH = $__4.CATCH,
    CLASS_DECLARATION = $__4.CLASS_DECLARATION,
    COMPUTED_PROPERTY_NAME = $__4.COMPUTED_PROPERTY_NAME,
    DEFAULT_CLAUSE = $__4.DEFAULT_CLAUSE,
    EXPORT_DEFAULT = $__4.EXPORT_DEFAULT,
    EXPORT_SPECIFIER = $__4.EXPORT_SPECIFIER,
    EXPORT_SPECIFIER_SET = $__4.EXPORT_SPECIFIER_SET,
    EXPORT_STAR = $__4.EXPORT_STAR,
    FINALLY = $__4.FINALLY,
    FORMAL_PARAMETER = $__4.FORMAL_PARAMETER,
    FORMAL_PARAMETER_LIST = $__4.FORMAL_PARAMETER_LIST,
    FORWARD_DEFAULT_EXPORT = $__4.FORWARD_DEFAULT_EXPORT,
    FUNCTION_BODY = $__4.FUNCTION_BODY,
    FUNCTION_DECLARATION = $__4.FUNCTION_DECLARATION,
    GET_ACCESSOR = $__4.GET_ACCESSOR,
    IDENTIFIER_EXPRESSION = $__4.IDENTIFIER_EXPRESSION,
    IMPORTED_BINDING = $__4.IMPORTED_BINDING,
    IMPORT_CLAUSE_PAIR = $__4.IMPORT_CLAUSE_PAIR,
    IMPORT_SPECIFIER_SET = $__4.IMPORT_SPECIFIER_SET,
    IMPORT_TYPE_CLAUSE = $__4.IMPORT_TYPE_CLAUSE,
    JSX_ATTRIBUTE = $__4.JSX_ATTRIBUTE,
    JSX_ELEMENT_NAME = $__4.JSX_ELEMENT_NAME,
    JSX_ELEMENT = $__4.JSX_ELEMENT,
    JSX_PLACEHOLDER = $__4.JSX_PLACEHOLDER,
    JSX_TEXT = $__4.JSX_TEXT,
    LITERAL_PROPERTY_NAME = $__4.LITERAL_PROPERTY_NAME,
    METHOD = $__4.METHOD,
    MODULE_SPECIFIER = $__4.MODULE_SPECIFIER,
    NAMED_EXPORT = $__4.NAMED_EXPORT,
    NAME_SPACE_EXPORT = $__4.NAME_SPACE_EXPORT,
    NAME_SPACE_IMPORT = $__4.NAME_SPACE_IMPORT,
    OBJECT_PATTERN = $__4.OBJECT_PATTERN,
    OBJECT_PATTERN_FIELD = $__4.OBJECT_PATTERN_FIELD,
    PROPERTY_NAME_ASSIGNMENT = $__4.PROPERTY_NAME_ASSIGNMENT,
    PROPERTY_NAME_SHORTHAND = $__4.PROPERTY_NAME_SHORTHAND,
    PROPERTY_VARIABLE_DECLARATION = $__4.PROPERTY_VARIABLE_DECLARATION,
    REST_PARAMETER = $__4.REST_PARAMETER,
    SET_ACCESSOR = $__4.SET_ACCESSOR,
    TEMPLATE_LITERAL_PORTION = $__4.TEMPLATE_LITERAL_PORTION,
    TEMPLATE_SUBSTITUTION = $__4.TEMPLATE_SUBSTITUTION,
    TYPE_ALIAS_DECLARATION = $__4.TYPE_ALIAS_DECLARATION,
    TYPE_ARGUMENTS = $__4.TYPE_ARGUMENTS,
    TYPE_NAME = $__4.TYPE_NAME,
    TYPE_PARAMETER = $__4.TYPE_PARAMETER,
    TYPE_PARAMETERS = $__4.TYPE_PARAMETERS,
    VARIABLE_DECLARATION_LIST = $__4.VARIABLE_DECLARATION_LIST,
    VARIABLE_STATEMENT = $__4.VARIABLE_STATEMENT;
var assert = ($___46__46__47_util_47_assert_46_js__ = require('../util/assert'), $___46__46__47_util_47_assert_46_js__ && $___46__46__47_util_47_assert_46_js__.__esModule && $___46__46__47_util_47_assert_46_js__ || {default: $___46__46__47_util_47_assert_46_js__}).assert;
var ValidationError = function($__super) {
  function ValidationError(tree, message) {
    $traceurRuntime.superConstructor(ValidationError).call(this);
    this.tree = tree;
    this.message = message;
  }
  return ($traceurRuntime.createClass)(ValidationError, {}, {}, $__super);
}(Error);
var ParseTreeValidator = function($__super) {
  function ParseTreeValidator() {
    $traceurRuntime.superConstructor(ParseTreeValidator).apply(this, arguments);
  }
  return ($traceurRuntime.createClass)(ParseTreeValidator, {
    fail_: function(tree, message) {
      throw new ValidationError(tree, message);
    },
    check_: function(condition, tree, message) {
      if (!condition) {
        this.fail_(tree, message);
      }
    },
    checkVisit_: function(condition, tree, message) {
      this.check_(condition, tree, message);
      this.visitAny(tree);
    },
    checkType_: function(type, tree, message) {
      this.checkVisit_(tree.type === type, tree, message);
    },
    visitArgumentList: function(tree) {
      for (var i = 0; i < tree.args.length; i++) {
        var argument = tree.args[i];
        this.checkVisit_(argument.isAssignmentOrSpread(), argument, 'assignment or spread expected');
      }
    },
    visitArrayLiteral: function(tree) {
      for (var i = 0; i < tree.elements.length; i++) {
        var element = tree.elements[i];
        this.checkVisit_(element === null || element.isAssignmentOrSpread(), element, 'assignment or spread expected');
      }
    },
    visitArrayPattern: function(tree) {
      for (var i = 0; i < tree.elements.length; i++) {
        var element = tree.elements[i];
        this.checkVisit_(element === null || element.type === BINDING_ELEMENT || element.type === ASSIGNMENT_ELEMENT || element.isLeftHandSideExpression() || element.isPattern() || element.isSpreadPatternElement(), element, 'null, sub pattern, left hand side expression or spread expected');
        if (element && element.isSpreadPatternElement()) {
          this.check_(i === (tree.elements.length - 1), element, 'spread in array patterns must be the last element');
        }
      }
    },
    visitBinaryExpression: function(tree) {
      switch (tree.operator.type) {
        case EQUAL:
        case STAR_EQUAL:
        case STAR_STAR_EQUAL:
        case SLASH_EQUAL:
        case PERCENT_EQUAL:
        case PLUS_EQUAL:
        case MINUS_EQUAL:
        case LEFT_SHIFT_EQUAL:
        case RIGHT_SHIFT_EQUAL:
        case UNSIGNED_RIGHT_SHIFT_EQUAL:
        case AMPERSAND_EQUAL:
        case CARET_EQUAL:
        case BAR_EQUAL:
          this.check_(tree.left.isLeftHandSideExpression() || tree.left.isPattern(), tree.left, 'left hand side expression or pattern expected');
          this.check_(tree.right.isAssignmentExpression(), tree.right, 'assignment expression expected');
          break;
        case AND:
        case OR:
        case BAR:
        case CARET:
        case AMPERSAND:
        case EQUAL_EQUAL:
        case NOT_EQUAL:
        case EQUAL_EQUAL_EQUAL:
        case NOT_EQUAL_EQUAL:
        case OPEN_ANGLE:
        case CLOSE_ANGLE:
        case GREATER_EQUAL:
        case LESS_EQUAL:
        case INSTANCEOF:
        case IN:
        case LEFT_SHIFT:
        case RIGHT_SHIFT:
        case UNSIGNED_RIGHT_SHIFT:
        case PLUS:
        case MINUS:
        case STAR:
        case SLASH:
        case PERCENT:
        case STAR_STAR:
          this.check_(tree.left.isAssignmentExpression(), tree.left, 'assignment expression expected');
          this.check_(tree.right.isAssignmentExpression(), tree.right, 'assignment expression expected');
          break;
        default:
          this.fail_(tree, 'unexpected binary operator');
      }
      this.visitAny(tree.left);
      this.visitAny(tree.right);
    },
    visitBindingElement: function(tree) {
      var binding = tree.binding;
      this.checkVisit_(binding.type === BINDING_IDENTIFIER || binding.type === OBJECT_PATTERN || binding.type === ARRAY_PATTERN, binding, 'expected valid binding element');
      this.visitAny(tree.initializer);
    },
    visitAssignmentElement: function(tree) {
      var assignment = tree.assignment;
      this.checkVisit_(assignment.type === OBJECT_PATTERN || assignment.type === ARRAY_PATTERN || assignment.isLeftHandSideExpression(), assignment, 'expected valid assignment element');
      this.visitAny(tree.initializer);
    },
    visitBlock: function(tree) {
      for (var i = 0; i < tree.statements.length; i++) {
        var statement = tree.statements[i];
        this.checkVisit_(statement.isStatementListItem(), statement, 'statement or function declaration expected');
      }
    },
    visitCallExpression: function(tree) {
      this.check_(tree.operand.isMemberExpression(), tree.operand, 'member expression expected');
      if (tree.operand instanceof NewExpression) {
        this.check_(tree.operand.args !== null, tree.operand, 'new args expected');
      }
      this.visitAny(tree.operand);
      this.visitAny(tree.args);
    },
    visitCaseClause: function(tree) {
      this.checkVisit_(tree.expression.isExpression(), tree.expression, 'expression expected');
      for (var i = 0; i < tree.statements.length; i++) {
        var statement = tree.statements[i];
        this.checkVisit_(statement.isStatementListItem(), statement, 'statement expected');
      }
    },
    visitCatch: function(tree) {
      this.checkVisit_(tree.binding.isPattern() || tree.binding.type === BINDING_IDENTIFIER, tree.binding, 'binding identifier expected');
      this.checkVisit_(tree.catchBody.type === BLOCK, tree.catchBody, 'block expected');
    },
    visitClassDeclaration: function(tree) {
      this.visitClassShared_(tree);
    },
    visitClassExpression: function(tree) {
      this.visitClassShared_(tree);
    },
    visitClassShared_: function(tree) {
      if (tree.typeParameters) {
        this.checkVisit_(tree.typeParameters.type === TYPE_PARAMETERS, tree.typeParameters, 'type parameters expected');
      }
      for (var i = 0; i < tree.elements.length; i++) {
        var element = tree.elements[i];
        switch (element.type) {
          case GET_ACCESSOR:
          case SET_ACCESSOR:
          case METHOD:
          case PROPERTY_VARIABLE_DECLARATION:
            break;
          default:
            this.fail_(element, 'class element expected');
        }
        this.visitAny(element);
      }
    },
    visitCommaExpression: function(tree) {
      for (var i = 0; i < tree.expressions.length; i++) {
        var expression = tree.expressions[i];
        this.checkVisit_(expression.isExpression(), expression, 'expression expected');
      }
    },
    visitConditionalExpression: function(tree) {
      this.checkVisit_(tree.condition.isAssignmentExpression(), tree.condition, 'expression expected');
      this.checkVisit_(tree.left.isAssignmentExpression(), tree.left, 'expression expected');
      this.checkVisit_(tree.right.isAssignmentExpression(), tree.right, 'expression expected');
    },
    visitCoverFormals: function(tree) {
      this.fail_(tree, 'CoverFormals should have been removed');
    },
    visitCoverInitializedName: function(tree) {
      this.fail_(tree, 'CoverInitializedName should have been removed');
    },
    visitDefaultClause: function(tree) {
      for (var i = 0; i < tree.statements.length; i++) {
        var statement = tree.statements[i];
        this.checkVisit_(statement.isStatementListItem(), statement, 'statement expected');
      }
    },
    visitDoWhileStatement: function(tree) {
      this.checkVisit_(tree.body.isStatement(), tree.body, 'statement expected');
      this.checkVisit_(tree.condition.isExpression(), tree.condition, 'expression expected');
    },
    visitExportDeclaration: function(tree) {
      var declType = tree.declaration.type;
      this.checkVisit_(declType === VARIABLE_STATEMENT || declType === FUNCTION_DECLARATION || declType === CLASS_DECLARATION || declType === NAMED_EXPORT || declType === EXPORT_DEFAULT || declType === TYPE_ALIAS_DECLARATION, tree.declaration, 'expected valid export tree');
    },
    visitNamedExport: function(tree) {
      var specifierType = tree.exportClause.type;
      this.checkVisit_(specifierType === EXPORT_SPECIFIER || specifierType === EXPORT_SPECIFIER_SET || specifierType === EXPORT_STAR || specifierType === FORWARD_DEFAULT_EXPORT || specifierType === NAME_SPACE_EXPORT, tree.exportClause, 'Invalid export clause');
      if (tree.moduleSpecifier) {
        this.checkVisit_(tree.moduleSpecifier.type === MODULE_SPECIFIER, tree.moduleSpecifier, 'module expression expected');
      }
    },
    visitExportSpecifierSet: function(tree) {
      this.check_(tree.specifiers.length > 0, tree, 'expected at least one identifier');
      for (var i = 0; i < tree.specifiers.length; i++) {
        var specifier = tree.specifiers[i];
        this.checkVisit_(specifier.type === EXPORT_SPECIFIER || specifier.type === IDENTIFIER_EXPRESSION, specifier, 'expected valid export specifier');
      }
    },
    visitExpressionStatement: function(tree) {
      this.checkVisit_(tree.expression.isExpression(), tree.expression, 'expression expected');
    },
    visitFinally: function(tree) {
      this.checkVisit_(tree.block.type === BLOCK, tree.block, 'block expected');
    },
    visitForOfStatement: function(tree) {
      this.checkVisit_(tree.initializer.isPattern() || tree.initializer.type === IDENTIFIER_EXPRESSION || tree.initializer.type === VARIABLE_DECLARATION_LIST && tree.initializer.declarations.length === 1, tree.initializer, 'for-each statement may not have more than one variable declaration');
      this.checkVisit_(tree.collection.isExpression(), tree.collection, 'expression expected');
      this.checkVisit_(tree.body.isStatement(), tree.body, 'statement expected');
    },
    visitForInStatement: function(tree) {
      if (tree.initializer.type === VARIABLE_DECLARATION_LIST) {
        this.checkVisit_(tree.initializer.declarations.length <= 1, tree.initializer, 'for-in statement may not have more than one variable declaration');
      } else {
        this.checkVisit_(tree.initializer.isPattern() || tree.initializer.isExpression(), tree.initializer, 'variable declaration, expression or ' + 'pattern expected');
      }
      this.checkVisit_(tree.collection.isExpression(), tree.collection, 'expression expected');
      this.checkVisit_(tree.body.isStatement(), tree.body, 'statement expected');
    },
    visitFormalParameterList: function(tree) {
      for (var i = 0; i < tree.parameters.length; i++) {
        var parameter = tree.parameters[i];
        assert(parameter.type === FORMAL_PARAMETER);
        parameter = parameter.parameter;
        switch (parameter.type) {
          case BINDING_ELEMENT:
            break;
          case REST_PARAMETER:
            this.checkVisit_(i === tree.parameters.length - 1, parameter, 'rest parameters must be the last parameter in a parameter list');
            this.checkType_(BINDING_IDENTIFIER, parameter.identifier, 'binding identifier expected');
            break;
          default:
            this.fail_(parameter, 'parameters must be identifiers or rest' + (" parameters. Found: " + parameter.type));
            break;
        }
        this.visitAny(parameter);
      }
    },
    visitForStatement: function(tree) {
      if (tree.initializer !== null) {
        this.checkVisit_(tree.initializer.isExpression() || tree.initializer.type === VARIABLE_DECLARATION_LIST, tree.initializer, 'variable declaration list or expression expected');
      }
      if (tree.condition !== null) {
        this.checkVisit_(tree.condition.isExpression(), tree.condition, 'expression expected');
      }
      if (tree.increment !== null) {
        this.checkVisit_(tree.increment.isExpression(), tree.increment, 'expression expected');
      }
      this.checkVisit_(tree.body.isStatement(), tree.body, 'statement expected');
    },
    visitFunctionBody: function(tree) {
      for (var i = 0; i < tree.statements.length; i++) {
        var statement = tree.statements[i];
        this.checkVisit_(statement.isStatementListItem(), statement, 'statement expected');
      }
    },
    visitFunctionDeclaration: function(tree) {
      this.checkType_(BINDING_IDENTIFIER, tree.name, 'binding identifier expected');
      this.visitFunction_(tree);
    },
    visitFunctionExpression: function(tree) {
      if (tree.name !== null) {
        this.checkType_(BINDING_IDENTIFIER, tree.name, 'binding identifier expected');
      }
      this.visitFunction_(tree);
    },
    visitFunction_: function(tree) {
      this.checkType_(FORMAL_PARAMETER_LIST, tree.parameterList, 'formal parameters expected');
      this.checkType_(FUNCTION_BODY, tree.body, 'function body expected');
    },
    visitGetAccessor: function(tree) {
      this.checkPropertyName_(tree.name);
      this.checkType_(FUNCTION_BODY, tree.body, 'function body expected');
    },
    visitIfStatement: function(tree) {
      this.checkVisit_(tree.condition.isExpression(), tree.condition, 'expression expected');
      this.checkVisit_(tree.ifClause.isStatement(), tree.ifClause, 'statement expected');
      if (tree.elseClause !== null) {
        this.checkVisit_(tree.elseClause.isStatement(), tree.elseClause, 'statement expected');
      }
    },
    visitImportDeclaration: function(tree) {
      if (tree.importClause !== null) {
        this.check_(tree.importClause.type === NAME_SPACE_IMPORT || tree.importClause.type === IMPORTED_BINDING || tree.importClause.type === IMPORT_SPECIFIER_SET || tree.importClause.type === IMPORT_CLAUSE_PAIR || tree.importClause.type === IMPORT_TYPE_CLAUSE, tree.importClause, 'Invalid import clause');
      }
      this.checkType_(MODULE_SPECIFIER, tree.moduleSpecifier, 'module specifier expected');
    },
    visitImportSpecifier: function(tree) {
      this.checkType_(IMPORTED_BINDING, tree.binding, 'ImportedBinding expected');
    },
    visitImportedBinding: function(tree) {
      this.checkType_(BINDING_IDENTIFIER, tree.binding, 'binding identifier expected');
    },
    visitImportClausePair: function(tree) {
      this.checkType_(IMPORTED_BINDING, tree.first, 'ImportedBinding expected');
      this.check_(tree.second.type === NAME_SPACE_IMPORT || tree.second.type === IMPORT_SPECIFIER_SET, tree.second, 'Invalid import clause');
    },
    visitJsxElement: function(tree) {
      this.checkType_(JSX_ELEMENT_NAME, tree.name, 'JSX Element Name expected');
      for (var i = 0; i < tree.attributes.length; i++) {
        var attr = tree.attributes[i];
        this.checkVisit_(attr.type === JSX_ATTRIBUTE, attr, 'JSX Attribute expected');
      }
      for (var i$__11 = 0; i$__11 < tree.children.length; i$__11++) {
        var child = tree.children[i$__11];
        this.checkVisit_(child.type === JSX_ELEMENT || child.type === JSX_PLACEHOLDER || child.type === JSX_TEXT, child, 'JSX child expected');
      }
    },
    visitLabelledStatement: function(tree) {
      this.checkVisit_(tree.statement.isStatement(), tree.statement, 'statement expected');
    },
    visitMemberExpression: function(tree) {
      this.check_(tree.operand.isMemberExpression(), tree.operand, 'member expression expected');
      if (tree.operand instanceof NewExpression) {
        this.check_(tree.operand.args !== null, tree.operand, 'new args expected');
      }
      this.visitAny(tree.operand);
    },
    visitMemberLookupExpression: function(tree) {
      this.check_(tree.operand.isMemberExpression(), tree.operand, 'member expression expected');
      if (tree.operand instanceof NewExpression) {
        this.check_(tree.operand.args !== null, tree.operand, 'new args expected');
      }
      this.visitAny(tree.operand);
    },
    visitSyntaxErrorTree: function(tree) {
      this.fail_(tree, ("parse tree contains SyntaxError: " + tree.message));
    },
    visitModuleSpecifier: function(tree) {
      this.check_(tree.token.type === STRING, tree, 'string or identifier expected');
    },
    visitNewExpression: function(tree) {
      this.checkVisit_(tree.operand.isMemberExpression(), tree.operand, 'member expression expected');
      this.visitAny(tree.args);
    },
    visitObjectLiteral: function(tree) {
      for (var i = 0; i < tree.propertyNameAndValues.length; i++) {
        var propertyNameAndValue = tree.propertyNameAndValues[i];
        switch (propertyNameAndValue.type) {
          case GET_ACCESSOR:
          case SET_ACCESSOR:
          case METHOD:
            this.check_(!propertyNameAndValue.isStatic, propertyNameAndValue, 'static is not allowed in object literal expression');
            break;
          case PROPERTY_NAME_ASSIGNMENT:
          case PROPERTY_NAME_SHORTHAND:
            break;
          default:
            this.fail_(propertyNameAndValue, 'accessor, property name ' + 'assignment or property method assigment expected');
        }
        this.visitAny(propertyNameAndValue);
      }
    },
    visitObjectPattern: function(tree) {
      for (var i = 0; i < tree.fields.length; i++) {
        var field = tree.fields[i];
        this.checkVisit_(field.type === OBJECT_PATTERN_FIELD || field.type === ASSIGNMENT_ELEMENT || field.type === BINDING_ELEMENT, field, 'object pattern field expected');
      }
    },
    visitObjectPatternField: function(tree) {
      this.checkPropertyName_(tree.name);
      this.checkVisit_(tree.element.type === ASSIGNMENT_ELEMENT || tree.element.type === BINDING_ELEMENT || tree.element.isPattern() || tree.element.isLeftHandSideExpression(), tree.element, 'binding element expected');
    },
    visitParenExpression: function(tree) {
      if (tree.expression.isPattern()) {
        this.visitAny(tree.expression);
      } else {
        this.checkVisit_(tree.expression.isExpression(), tree.expression, 'expression expected');
      }
    },
    visitPostfixExpression: function(tree) {
      this.checkVisit_(tree.operand.isAssignmentExpression(), tree.operand, 'assignment expression expected');
    },
    visitPredefinedType: function(tree) {},
    visitScript: function(tree) {
      for (var i = 0; i < tree.scriptItemList.length; i++) {
        var scriptItemList = tree.scriptItemList[i];
        this.checkVisit_(scriptItemList.isScriptElement(), scriptItemList, 'global script item expected');
      }
    },
    checkPropertyName_: function(tree) {
      this.checkVisit_(tree.type === LITERAL_PROPERTY_NAME || tree.type === COMPUTED_PROPERTY_NAME, tree, 'property name expected');
    },
    visitPropertyNameAssignment: function(tree) {
      this.checkPropertyName_(tree.name);
      this.checkVisit_(tree.value.isAssignmentExpression(), tree.value, 'assignment expression expected');
    },
    visitPropertyNameShorthand: function(tree) {
      this.check_(tree.name.type === IDENTIFIER || tree.name.type === YIELD || tree.name.isStrictKeyword(), tree, 'identifier token expected');
    },
    visitLiteralPropertyName: function(tree) {
      var type = tree.literalToken.type;
      this.check_(tree.literalToken.isKeyword() || type === IDENTIFIER || type === NUMBER || type === STRING, tree, 'Unexpected token in literal property name');
    },
    visitTemplateLiteralExpression: function(tree) {
      if (tree.operand) {
        this.checkVisit_(tree.operand.isMemberExpression(), tree.operand, 'member or call expression expected');
      }
      for (var i = 0; i < tree.elements.length; i++) {
        var element = tree.elements[i];
        if (i % 2) {
          this.checkType_(TEMPLATE_SUBSTITUTION, element, 'Template literal substitution expected');
        } else {
          this.checkType_(TEMPLATE_LITERAL_PORTION, element, 'Template literal portion expected');
        }
      }
    },
    visitReturnStatement: function(tree) {
      if (tree.expression !== null) {
        this.checkVisit_(tree.expression.isExpression(), tree.expression, 'expression expected');
      }
    },
    visitSetAccessor: function(tree) {
      this.checkPropertyName_(tree.name);
      this.checkType_(FUNCTION_BODY, tree.body, 'function body expected');
    },
    visitSpreadExpression: function(tree) {
      this.checkVisit_(tree.expression.isAssignmentExpression(), tree.expression, 'assignment expression expected');
    },
    visitStateMachine: function(tree) {
      this.fail_(tree, 'State machines are never valid outside of the ' + 'GeneratorTransformer pass.');
    },
    visitSwitchStatement: function(tree) {
      this.checkVisit_(tree.expression.isExpression(), tree.expression, 'expression expected');
      var defaultCount = 0;
      for (var i = 0; i < tree.caseClauses.length; i++) {
        var caseClause = tree.caseClauses[i];
        if (caseClause.type === DEFAULT_CLAUSE) {
          ++defaultCount;
          this.checkVisit_(defaultCount <= 1, caseClause, 'no more than one default clause allowed');
        } else {
          this.checkType_(CASE_CLAUSE, caseClause, 'case or default clause expected');
        }
      }
    },
    visitThrowStatement: function(tree) {
      if (tree.value === null) {
        return;
      }
      this.checkVisit_(tree.value.isExpression(), tree.value, 'expression expected');
    },
    visitTryStatement: function(tree) {
      this.checkType_(BLOCK, tree.body, 'block expected');
      if (tree.catchBlock !== null) {
        this.checkType_(CATCH, tree.catchBlock, 'catch block expected');
      }
      if (tree.finallyBlock !== null) {
        this.checkType_(FINALLY, tree.finallyBlock, 'finally block expected');
      }
      if (tree.catchBlock === null && tree.finallyBlock === null) {
        this.fail_(tree, 'either catch or finally must be present');
      }
    },
    visitTypeArguments: function(tree) {
      var args = tree.args;
      for (var i = 0; i < args.length; i++) {
        this.checkVisit_(args[i].isType(), args[i], 'Type arguments must be type expressions');
      }
    },
    visitTypeName: function(tree) {
      this.checkVisit_(tree.moduleName === null || tree.moduleName.type === TYPE_NAME, tree.moduleName, 'moduleName must be null or a TypeName');
      this.check_(tree.name.type === IDENTIFIER, tree, 'name must be an identifier');
    },
    visitTypeReference: function(tree) {
      this.checkType_(TYPE_NAME, tree.typeName, 'typeName must be a TypeName');
      this.checkType_(TYPE_ARGUMENTS, tree.args, 'args must be a TypeArguments');
    },
    visitTypeParameters: function(tree) {
      var parameters = tree.parameters;
      for (var i = 0; i < parameters.length; i++) {
        this.checkType_(TYPE_PARAMETER, parameters[i], 'Type parameters must all be type parameters');
      }
    },
    visitTypeParameter: function(tree) {
      this.check_(tree.identifierToken.type === IDENTIFIER, tree, 'Type parameter must be an identifier token');
      if (tree.extendsType) {
        this.checkVisit_(tree.extendsType.isType(), tree.extendsType, 'extends type must be a type expression');
      }
    },
    visitUnaryExpression: function(tree) {
      this.checkVisit_(tree.operand.isAssignmentExpression(), tree.operand, 'assignment expression expected');
    },
    visitVariableDeclaration: function(tree) {
      this.checkVisit_(tree.lvalue.isPattern() || tree.lvalue.type === BINDING_IDENTIFIER, tree.lvalue, 'binding identifier expected, found: ' + tree.lvalue.type);
      if (tree.initializer !== null) {
        this.checkVisit_(tree.initializer.isAssignmentExpression(), tree.initializer, 'assignment expression expected');
      }
    },
    visitWhileStatement: function(tree) {
      this.checkVisit_(tree.condition.isExpression(), tree.condition, 'expression expected');
      this.checkVisit_(tree.body.isStatement(), tree.body, 'statement expected');
    },
    visitWithStatement: function(tree) {
      this.checkVisit_(tree.expression.isExpression(), tree.expression, 'expression expected');
      this.checkVisit_(tree.body.isStatement(), tree.body, 'statement expected');
    },
    visitYieldExpression: function(tree) {
      if (tree.expression !== null) {
        this.checkVisit_(tree.expression.isExpression(), tree.expression, 'expression expected');
      }
    }
  }, {}, $__super);
}(ParseTreeVisitor);
ParseTreeValidator.validate = function(tree) {
  var validator = new ParseTreeValidator();
  try {
    validator.visitAny(tree);
  } catch (e) {
    if (!(e instanceof ValidationError)) {
      throw e;
    }
    var location = null;
    if (e.tree !== null) {
      location = e.tree.location;
    }
    if (location === null) {
      location = tree.location;
    }
    var locationString = location !== null ? location.start.toString() : '(unknown)';
    throw new Error(("Parse tree validation failure '" + e.message + "' at " + locationString + ":") + ("\n\n" + TreeWriter.write(tree) + "\n"));
  }
};
Object.defineProperties(module.exports, {
  ParseTreeValidator: {get: function() {
      return ParseTreeValidator;
    }},
  __esModule: {value: true}
});
