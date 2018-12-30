//按钮触发方法，相当于main
function lex() {
  var input = document.getElementById("input")
  var output = document.getElementById("output")

  var source = input.value
  input.value = null
  source = escapeSpace(source)

  var reader = new Object();
  reader.point = 0;
  reader.sequence = source
  reader.nextChar = function () {
    return this.sequence.charAt(this.point++)
  }
  reader.giveback = function () {
    this.point--
  }
  reader.getIndex = function () {
    return this.point
  }

  try {
    var outTokenText = ""
    while (true) {
      var token = getToken(reader)
      outTokenText += token
      if (token == "<EOF>") {
        break
      }
    }
  } catch (e) {
    outTokenText = "词法分析发生错误，错误如下：\n"
    outTokenText += e
    outTokenText += "\n错误字符序号：" + reader.getIndex()
    outTokenText += "\n请检查输入，参考范例"
  }

  output.innerText = outTokenText
}

//错误信息输出
function failed(c) {
  return 'Failed lex analyze at "' + c + '"'
}

//去掉空格和换行
function escapeSpace(raw) {
  return raw.replace(/[\n]/g, "").replace(/\s/g,"")
}

function getToken(reader) {
  state = 0
  id = ""

  while (true) {
    ch = reader.nextChar()

    switch (state) {
      case 0:
        if (isChar(ch, /\$/)) {
          state = 1
          id += ch
        } else if (isChar(ch, /[1-9]/)) {
          state = 3
          id += ch
        }
        else if (isChar(ch, /i/)) {
          state = 4
        }
        else if (isChar(ch, /e/)) {
          state = 6
        }
        else if (isChar(ch, /w/)) {
          state = 10
        }
        else if (isChar(ch, /=/)) {
          state = 15
        }
        else if (isChar(ch, /\+/)) {
          state = 17
        }
        else if (isChar(ch, /-/)) {
          state = 18
        }
        else if (isChar(ch, /\*/)) {
          state = 19
        }
        else if (isChar(ch, /\//)) {
          state = 20
        }
        else if (isChar(ch, />/)) {
          state = 21
        }
        else if (isChar(ch, /</)) {
          state = 22
        }
        else if (isChar(ch, /!/)) {
          state = 23
        }
        else if (isChar(ch, /\{/)) {
          state = 25
        }
        else if (isChar(ch, /\}/)) {
          state = 26
        }
        else if (isChar(ch, /\;/)) {
          state = 27
        }
        else if (isChar(ch, /[0-9]/)) {
          id += ch
          state = 28
        }
        else if (isChar(ch,/\(/)){
          state = 29
        }
        else if (isChar(ch,/\)/)){
          state = 30
        }
        else if (ch == "") {
          return "<EOF>"
        }
        else {
          throw "UNEXPECT CHAR '" + ch + "'"
        }
        break
      case 1:
        if (isChar(ch, /\w/)) {
          state = 2
          id += ch
        } else {
          throw "UNEXPECT CHAR '" + ch + "'"
        }
        break
      case 2:
        if (isChar(ch, /\w/)) {
          state = 2
          id += ch
        }
        else {
          reader.giveback()
          return "<ID," + id + ">"
        }
        break
      case 3:
        if (isChar(ch, /[0-9]/)) {
          state = 3
          id += ch
        }
        else {
          reader.giveback()
          return "<NUM," + id + ">"
        }
        break
      case 4:
        if (isChar(ch, "f")) {
          state = 5
        } else {
          throw "UNEXPECT CHAR '" + ch + "'"
        }
        break
      case 5:
        reader.giveback()
        return '<IF>'
      case 6:
        if (isChar(ch, /l/)) {
          state = 7
        } else {
          throw "UNEXPECT CHAR '" + ch + "'"
        }
        break
      case 7:
        if (isChar(ch, /s/)) {
          state = 8
        } else {
          throw "UNEXPECT CHAR '" + ch + "'"
        }
        break
      case 8:
        if (isChar(ch, /e/)) {
          state = 9
        } else {
          throw "UNEXPECT CHAR '" + ch + "'"
        }
        break
      case 9:
        reader.giveback()
        return "<ELSE>"
      case 10:
        if (isChar(ch, /h/)) {
          state = 11
        } else {
          throw "UNEXPECT CHAR '" + ch + "'"
        }
        break
      case 11:
        if (isChar(ch, /i/)) {
          state = 12
        } else {
          throw "UNEXPECT CHAR '" + ch + "'"
        }
        break
      case 12:
        if (isChar(ch, /l/)) {
          state = 13
        } else {
          throw "UNEXPECT CHAR '" + ch + "'"
        }
        break
      case 13:
        if (isChar(ch, /e/)) {
          state = 14
        } else {
          throw "UNEXPECT CHAR '" + ch + "'"
        }
        break
      case 14:
        reader.giveback();
        return "<WHILE>"
      case 15:
        if (isChar(ch, /=/)) {
          state = 16
        } else {
          reader.giveback()
          return "<ASSIGN>"
        }
        break
      case 16:
        reader.giveback()
        return "<EQ>"
      case 17:
        reader.giveback()
        return "<ADD>"
      case 18:
        reader.giveback()
        return "<SUB>"
      case 19:
        reader.giveback()
        return "<TIMES>"
      case 20:
        reader.giveback()
        return "<DIVIDE>"
      case 21:
        reader.giveback()
        return "<GT>"
      case 22:
        reader.giveback()
        return "<LT>"
      case 23:
        if (isChar(ch, /=/)) {
          state = 24
        }
        else {
          throw "UNEXPECT CHAR '" + ch + "'"
        }
        break
      case 24:
        reader.giveback()
        return "<NE>"
      case 25:
        reader.giveback()
        return "<BEGIN>"
      case 26:
        reader.giveback()
        return "<END>"
      case 27:
        reader.giveback()
        return "<SEM>"
      case 28:
        reader.giveback()
        return "<NUM," + id + ">"
      case 29:
        reader.giveback()
        return "<LB>"
      case 30:
        reader.giveback()
        return "<RB>"
    }
  }
}

function isChar(ch, regex) {

  if (ch == "")
    return false

  var result
  (ch.match(regex)) ? result = true : result = false
  return result
}