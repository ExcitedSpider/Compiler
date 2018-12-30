//按钮触发方法，相当于main
function parsing() {
  var input = document.getElementById("input")
  var output = document.getElementById("output")

  try {
    var tokens = JSON.parse(input.value).inputs
    tokens.push('$')
    input.value==null
  } catch (err) {
    outputText = '输入错误，详细信息：\n'
    outputText += err + '\n'
    output.innerText = outputText
    return
  }
  //输入Token队列
  var inputQueue = new Object()
  inputQueue.tokens = tokens
  inputQueue.ip = 0
  inputQueue.getToken = function () {
    return this.tokens[this.ip]
  }
  inputQueue.moveToNext = function(){
    this.ip++
  }

  //符号栈，终结符使用字符，非终结符使用数字序号
  var symbolStack = ['$', 0]

  var ppt = createPPT()

  output.innerText = predict(inputQueue,symbolStack,ppt)
}

function predict(inputQueue, symbolStack,ppt) {
  var outputText = ''
  var X = stackTop(symbolStack)
  while(X!='$')
  {
    var token = inputQueue.getToken()
    var termianlIndex = findSymbolIndex(terminal,X)
    var tokenIndex = findSymbolIndex(terminal,token)
    if(X==token)
    {
      symbolStack.pop()
      inputQueue.moveToNext()
      var token = inputQueue.getToken()
      X = stackTop(symbolStack)
    }else if(termianlIndex!=-1)
    {
      throw "Predict error at char: '"+X+"' at token index: "+inputQueue.ip
    }else if(!ppt[X][tokenIndex])
    {
      throw "Predict error at char: '"+X+"' at token index: ("+X+","+tokenIndex+")"
    }else 
   {
      var exp = ppt[X][tokenIndex]
      outputText+=getPredictLine(X,exp)
      symbolStack.pop()
      symbolStack=symbolStack.concat(exp.reverse())
      exp.reverse()
      X = stackTop(symbolStack)
      if(X=='epsilon')
      {
        symbolStack.pop()
        X = stackTop(symbolStack)
      }
    }
  }
  return outputText
}

function getPredictLine(X,exp){
  var line = unTerminal[X] + '\t→\t'
  for(var i=0;i<exp.length;i++){
    if(typeof(exp[i])=='string')
    {
      line+=exp[i]
    }
    else
    {
      line+=unTerminal[exp[i]]
    }
    line+=" "
  }
  line+='\n'
  return line
}

function stackTop(symbolStack) {
  var X = symbolStack[symbolStack.length-1]
  return X
}
//非终结符
var unTerminal = ['Stmt', 'Expr', "Expr'", 'Term', 'WhileStmt', 'IfStmt']
var terminal = ['id', 'num', '+', '-', '*', '/', '=', '<', '>', '!=', '==', '(', ')', '{', '}', 'while', 'if', 'else', ';', '$','epsilon']

function findSymbol(list,symbol){
  return list.find((v)=>{return v==symbol})
}

function findSymbolIndex(list,symbol){
  return list.findIndex((v)=>{return v==symbol})
}

function createPPT() {
  var ppt = new Array()
  for (var i = 0; i < 6; i++) {
    ppt[i] = new Array()
    for (var j = 0; j < 20; j++) {
      ppt[i][j] = undefined
    }
  }
  ppt[0][0] = [1, ';', 0]
  ppt[0][1] = [1, ';', 0]
  ppt[0][15] = [4, 0]
  ppt[0][16] = [5, 0]
  ppt[0][14] = ['epsilon']
  ppt[0][19] = ['epsilon']
  ppt[1][0] = [3, 2]
  ppt[1][1] = [3, 2]
  ppt[2][2] = ['+', 1]
  ppt[2][3] = ['-', 1]
  ppt[2][4] = ['*', 1]
  ppt[2][5] = ['/', 1]
  ppt[2][6] = ['=', 1]
  ppt[2][7] = ['<', 1]
  ppt[2][8] = ['>', 1]
  ppt[2][9] = ['!=', 1]
  ppt[2][10] = ['==', 1]
  ppt[2][12] = ['epsilon'] 
  ppt[2][18] = ['epsilon'] 
  ppt[3][0] = ['id']
  ppt[3][1] = ['num']
  ppt[4][15] = ['while', '(', 1, ')', '{', 0, '}']
  ppt[5][16] = ['if', '(', 1, ')', '{', 0, '}', 'else', '{', 0, '}']

  return ppt
}