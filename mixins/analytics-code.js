export default {
  methods: {
    async analyticSourceCode(data, outClass) {
      const className = data.class.name
      const methodName = data.name
      const parsedParameters = JSON.parse(data.parameters)
      const parameters = parsedParameters.map(param => `${param.type} $${param.name}`).join(', ')
      const parsedLineCode = JSON.parse(data.source_code_json)
      let result = 'sequenceDiagram'
      for (let index = 0; index < outClass.length; index++) {
        if (outClass[index].action) {
          const line = `\n${outClass[index].name}->>+${outClass[index + 1].name}: ${outClass[index].action}`
          result += line
        } else {
          const line = `\n${outClass[index].name}->>+${className}: ${methodName} (${parameters})`
          result += line
        }
      }
      let filteredDataReturn = []
      filteredDataReturn = this.assignIsLastReturn(parsedLineCode, filteredDataReturn)
      const lastElementInFilteredData = filteredDataReturn[filteredDataReturn.length - 1]

      for (const element of parsedLineCode) {
        if (this.updateIsLastReturnInElement(element, lastElementInFilteredData)) {
          break
        }
      }
      for (const element of parsedLineCode) {
        const lineOfCode = await this.analyticLineCode(element, data, outClass)
        result += lineOfCode
      }
      result += this.buildReturnLines(outClass)
      result = this.cleanUpResult(result)

      // Ghép các dòng lại thành một chuỗi

      return result
    },

    buildReturnLines(outClass) {
      let returnLines = ''
      for (let index = outClass.length - 1; index >= 0; index--) {
        if (outClass[index].action) {
          returnLines += `\n ${outClass[index + 1].name}-->>-${outClass[index].name} : true`
        }
      }
      return returnLines
    },

    cleanUpResult(result) {
      const listLines = result.split('\n')
      let previousLineBeforeColon = null
      const finalLines = []

      for (const line of listLines) {
        const colonIndex = line.indexOf(':')

        if (colonIndex >= 0) {
          const lineBeforeColon = line.substring(0, colonIndex)

          if (lineBeforeColon !== previousLineBeforeColon && (lineBeforeColon.includes('-->>-') || lineBeforeColon.includes('->>+'))) {
            finalLines.push(line)
            previousLineBeforeColon = lineBeforeColon
          } else {
            finalLines.push(line)
          }
        } else {
          finalLines.push(line)
        }
      }

      return finalLines.join('\n')
    },

    assignIsLastReturn(source, filteredData) {
      source.forEach(element => {
        if (element.type === 'Return') {
          filteredData.push(element)
        }

        if (element.children) {
          this.assignIsLastReturn(element.children, filteredData)
        }
      })

      return filteredData
    },

    updateIsLastReturnInElement(element, target) {
      if (element === target) {
        element.isLastReturn = true
        return true
      }

      if (element.children) {
        for (const child of element.children) {
          if (this.updateIsLastReturnInElement(child, target)) {
            return true
          }
        }
      }
      return false
    },

    async analyticLineCode(code, data, outClass) {
      let result = ''
      let hasCase = false
      const className = data.class.name || data.class
      let contentWithoutComment = ''
      if (code.content) {
        contentWithoutComment = code.content.replace(/\/\/.*|\/\*[\s\S]*?\*\//g, '').trim()
      }

      if (code.type === 'FuncCall') {
        result += `\n${code.class}->>+${code.class} : ${contentWithoutComment} `
        if (code.children) {
          for (const element of code.children) {
            const childrenLines = await this.analyticLineCode(element, code, outClass)
            result += childrenLines
          }
        }
      } else if (code.type === 'MethodCall') {
        const functionCallRegex = /[->|::]\s*(\w+)\((.*?)\)/
        const beforeEqualsRegex = /^(.*?)\s*=/
        let contentBeforeEquals = ''
        const matchVariable = beforeEqualsRegex.exec(contentWithoutComment)
        if (matchVariable && matchVariable.length > 1) {
          contentBeforeEquals = matchVariable[1].trim()
        }
        const match = functionCallRegex.exec(contentWithoutComment)
        if (match) {
          result += `\n${className}->>+${code.class} : ${match[1]}(${match[2]}) `
          const codeOfMethodCall = await this.getMethodCall(code)
          if (codeOfMethodCall !== null) {
            const parsedLineCode = JSON.parse(codeOfMethodCall.source_code_json)
            const outClass = []
            let hasReturn = false
            outClass.push({
              name: className,
              action: null
            })
            let filteredDataReturn = []
            filteredDataReturn = this.assignIsLastReturn(parsedLineCode, filteredDataReturn)
            const lastElementInFilteredData = filteredDataReturn[filteredDataReturn.length - 1]

            for (const element of parsedLineCode) {
              if (this.updateIsLastReturnInElement(element, lastElementInFilteredData)) {
                hasReturn = true
                break
              } else {
                hasReturn = false
              }
            }
            for (const element of parsedLineCode) {
              const lineOfCode = await this.analyticLineCode(element, codeOfMethodCall, outClass)
              result += lineOfCode
            }

            if (!hasReturn) {
              result += `\n${code.class}-->>-${className} : `
            }
          } else if (contentBeforeEquals !== '') {
            result += `\n${code.class}-->>-${className} : ${contentBeforeEquals} = ${match[1]}(${match[2]})`
          } else {
            result += `\n${code.class}-->>-${className} : ${match[1]}(${match[2]})`
          }
        }
      } else if (code.type === 'StaticCall') {
        const functionCallRegex = /[->|::]\s*(\w+)\((.*?)\)/
        const match = functionCallRegex.exec(contentWithoutComment)
        const beforeEqualsRegex = /^(.*?)\s*=/
        let contentBeforeEquals = ''
        const matchVariable = beforeEqualsRegex.exec(contentWithoutComment)
        if (matchVariable && matchVariable.length > 1) {
          contentBeforeEquals = matchVariable[1].trim()
        }
        if (match) {
          result += `\n${className}->>+${code.class} : ${match[1]}(${match[2]}) `

          if (contentBeforeEquals !== '') {
            result += `\n${code.class}-->>-${className} : ${contentBeforeEquals} = ${match[1]}(${match[2]}) `
          } else {
            result += `\n${code.class}-->>-${className} : ${match[1]}(${match[2]}) `
          }
        }
      } else if (code.type === 'If' || code.type === 'While' || code.type === 'Do') {
        let conditionLine = ''
        conditionLine = await this.processIf(code, outClass, code.type)
        result += conditionLine
      } else if (code.type === 'ElseIf') {
        result += '\nelse'
        const ifConditionLine = await this.processIf(code, outClass, 'If')
        result += ifConditionLine
      } else if (code.type === 'Else') {
        let conditionLine = ''
        result += `\n${contentWithoutComment}`
        if (code.children) {
          for (const element of code.children) {
            const lineOfCode = await this.analyticLineCode(element, code, outClass)
            conditionLine += lineOfCode
          }
        }

        result += conditionLine
      } else if (code.type === 'Switch') {
        let conditionLine = ''
        if (code.children) {
          for (const element of code.children) {
            const lineOfCode = await this.analyticLineCode(element, code, outClass)
            conditionLine += lineOfCode
          }
        }
        result += conditionLine
      } else if (code.type === 'Case') {
        if (!hasCase) {
          result += `\nalt ${code.conditions}`
          hasCase = true
        } else {
          result += `\nelse ${code.conditions}`
        }
        if (code.children) {
          for (const element of code.children) {
            const childrenLines = await this.analyticLineCode(element, code, outClass)
            result += childrenLines
          }
        }
        result += '\nend'
      } else if (code.type === 'Foreach' || code.type === 'For') {
        let conditionLine = ''
        conditionLine = await this.convertLoopCode(code.loop, code.type)
        if (code.children) {
          for (const element of code.children) {
            const childrenLines = await this.analyticLineCode(element, code, outClass)
            conditionLine += childrenLines
          }
        }
        conditionLine += '\nend'
        result += conditionLine
      } else if (code.type === 'TryCatch') {
        if (code.children) {
          for (const element of code.children) {
            const childrenLines = await this.analyticLineCode(element, code, outClass)
            result += childrenLines
          }
        }
      } else if (code.type === 'Catch') {
        let childLines = ''
        result += `\ncritical ${code.exception}`
        if (code.children) {
          for (const element of code.children) {
            const childrenLines = await this.analyticLineCode(element, code, outClass)
            childLines += childrenLines
          }

          childLines += '\nend'
        }
        result += childLines
      } else if (code.type === 'Finally') {
        if (code.children) {
          for (const element of code.children) {
            const childrenLines = await this.analyticLineCode(element, code, outClass)
            result += childrenLines
          }
        }
      } else if (code.type === 'Return') {
        if (code.return_expression && code.return_expression.type === 'MethodCall') {
          result += `\n${code.class}->>+${code.return_expression.class} : ${code.return_expression.name} `
          const codeOfMethodCall = await this.getMethodCall(code.return_expression)
          if (codeOfMethodCall !== null) {
            let hasReturn = false
            const parsedLineCode = JSON.parse(codeOfMethodCall.source_code_json)
            const outClass = []
            outClass.push({
              name: className,
              action: null
            })
            for (const element of parsedLineCode) {
              const lineOfCode = await this.analyticLineCode(element, codeOfMethodCall, outClass)
              result += lineOfCode
              if (element.type === 'Return') {
                hasReturn = true
              }
            }

            if (!hasReturn) {
              result += `\n${code.return_expression.class}-->>-${code.class} : `
            }
          } else {
            result += `\n${code.return_expression.class}-->>-${code.class} : ${code.return_expression.name} `
          }
        }
        if (code.isLastReturn) {
          result += `\n${code.class}-->>-${outClass[outClass.length - 1].name} : ${contentWithoutComment} `
        } else {
          result += `\n${code.class}-->>${outClass[outClass.length - 1].name} : ${contentWithoutComment} `
        }
      } else if (code.type === 'Break') {
        result += '\nbreak'
        result += `\n${outClass[outClass.length - 1].name}-->${code.class}: `
        result += '\nend'
      } else {
        result += `\n${code.class}->>${code.class} : ${contentWithoutComment} `
      }

      return result
    },

    async processIf(ifNode, outClass, type) {
      let ifConditionLine = ''

      ifConditionLine = await this.processMethodCalls(ifNode.conditions, ifNode, ifConditionLine)

      if (ifNode.type_conditions) {
        if (ifNode.type_conditions[0] === 'Identical') {
          const conditionText = ifNode.conditions.map(condition => condition.content).join(' === ')
          ifConditionLine += `\n${type === 'If' ? 'alt' : 'loop'} ${conditionText}`
        } else if (ifNode.type_conditions[0] === 'BooleanAnd') {
          const conditionText = ifNode.conditions.map(condition => condition.content).join(' && ')
          ifConditionLine += `\n${type === 'If' ? 'alt' : 'loop'} ${conditionText}`
        } else if (ifNode.type_conditions[0] === 'BooleanOr') {
          const conditionText = ifNode.conditions.map(condition => condition.content).join(' || ')
          ifConditionLine += `\n${type === 'If' ? 'alt' : 'loop'} ${conditionText}`
        } else if (ifNode.type_conditions[0] === 'Greater') {
          const conditionText = ifNode.conditions.map(condition => condition.content).join(' > ')
          ifConditionLine += `\n${type === 'If' ? 'alt' : 'loop'} ${conditionText}`
        } else if (ifNode.type_conditions[0] === 'Smaller') {
          const conditionText = ifNode.conditions.map(condition => condition.content).join(' < ')
          ifConditionLine += `\n${type === 'If' ? 'alt' : 'loop'} ${conditionText}`
        } else if (ifNode.type_conditions[0] === 'SmallerOrEqual') {
          const conditionText = ifNode.conditions.map(condition => condition.content).join(' <= ')
          ifConditionLine += `\n${type === 'If' ? 'alt' : 'loop'} ${conditionText}`
        } else if (ifNode.type_conditions[0] === 'GreaterOrEqual') {
          const conditionText = ifNode.conditions.map(condition => condition.content).join(' >= ')
          ifConditionLine += `\n${type === 'If' ? 'alt' : 'loop'} ${conditionText}`
        } else if (ifNode.type_conditions[0] === 'Equal') {
          const conditionText = ifNode.conditions.map(condition => condition.content).join(' == ')
          ifConditionLine += `\n${type === 'If' ? 'alt' : 'loop'} ${conditionText}`
        } else if (ifNode.type_conditions[0] === 'NotEqual') {
          const conditionText = ifNode.conditions.map(condition => condition.content).join(' != ')
          ifConditionLine += `\n${type === 'If' ? 'alt' : 'loop'} ${conditionText}`
        } else {
          const conditionText = ifNode.conditions.map(condition => condition.content).join(', ')
          ifConditionLine += `\n${type === 'If' ? 'alt' : 'loop'} ${conditionText}`
        }
      } else {
        const conditionText = ifNode.conditions.map(condition => condition.content).join(', ')
        ifConditionLine += `\n${type === 'If' ? 'alt' : 'loop'} ${conditionText}`
      }

      if (ifNode.children) {
        for (const element of ifNode.children) {
          const lineOfCode = await this.analyticLineCode(element, ifNode, outClass)
          ifConditionLine += lineOfCode
        }
      }
      ifConditionLine += '\nend'

      return ifConditionLine
    },

    async processMethodCalls(conditions, code, conditionLine) {
      for (const element of conditions) {
        if (element.type === 'MethodCall') {
          const functionCallRegex = /[->|::]\s*(\w+)\((.*?)\)/
          const match = functionCallRegex.exec(element.content)
          const beforeEqualsRegex = /^(.*?)\s*=/
          let contentBeforeEquals = ''
          const matchVariable = beforeEqualsRegex.exec(element.content)
          if (matchVariable && matchVariable.length > 1) {
            contentBeforeEquals = matchVariable[1].trim()
          }
          if (match) {
            conditionLine += `\n${code.class}->>+${element.class} : ${match[1]}(${match[2]})`
            const codeOfMethodCall = await this.getMethodCall(code)
            if (codeOfMethodCall !== null) {
              const parsedLineCode = JSON.parse(codeOfMethodCall.source_code_json)
              const outClass = []
              outClass.push({
                name: code.class,
                action: null
              })
              for (const element of parsedLineCode) {
                const lineOfCode = await this.analyticLineCode(element, codeOfMethodCall, outClass)
                conditionLine += lineOfCode
              }
            } else if (contentBeforeEquals !== '') {
              conditionLine += `\n${element.class}-->>-${code.class} : ${contentBeforeEquals} = ${match[1]}(${match[2]})`
            } else {
              conditionLine += `\n${element.class}-->>-${code.class} : ${match[1]}(${match[2]})`
            }
          }
        }
        if (element.conditions) {
          await this.processMethodCalls(element.conditions, code, conditionLine)
        }
      }
      return conditionLine
    },

    async getMethodCall(code) {
      try {
        if (code.content) {
          const contentWithoutComment = code.content.replace(/\/\/.*|\/\*[\s\S]*?\*\//g, '').trim()
          const functionCallRegex = /[->|::]\s*(\w+)\((.*?)\)/
          const match = functionCallRegex.exec(contentWithoutComment)
          let methodName = ''
          if (match) {
            methodName = match[1]
          }
          const params = {
            namespace: code.namespace.replace(/\\/g, '/'),
            class: code.class,
            method_name: methodName
          }
          const { data: { result: { data } } } = await this.$api.tree.getMethodCall({ params })
          return data
        } else {
          return null
        }
      } catch (_) {
        console.log(_)
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
        return null
      }
    },

    convertLoopCode(loop, type) {
      if (type === 'For') {
        const regex = /for\s*\(([^;]+);([^;]+);([^)]+)\)/
        const match = regex.exec(loop)

        if (match) {
          const loopVariable = match[1].trim()
          const loopCondition = match[2].trim()
          const convertedLoop = `\nloop ${loopVariable} to ${loopCondition}`
          return convertedLoop
        }
      }
      return `\nloop ${loop}`
    }
  }
}
